// Self-check for the contact form rules and the Cloudflare /api/contact function. Run: npm test
import assert from "node:assert/strict";
import { validate } from "../src/validate.js";
import { onRequestPost, RATE } from "../functions/api/contact.js";

const good = { name: "Ana Cruz", email: "ana@example.com", type: "Business website", message: "I need a site for my bakery." };

// validation
assert.equal(validate(good).ok, true);
assert.ok(validate({ ...good, name: "  " }).errors.name);
assert.ok(validate({ ...good, email: "not-an-email" }).errors.email);
assert.ok(validate({ ...good, type: "Hack" }).errors.type);
assert.ok(validate({ ...good, message: "short" }).errors.message);
assert.equal(validate({ ...good, name: "Ana\r\nBcc: x@y.z" }).values.name, "Ana Bcc: x@y.z"); // no header injection via subject
assert.equal(validate({}).ok, false);

// the function, with a fake Request/env and a fake fetch to Resend
const call = async (body, env, raw, ip = "1.1.1.1") => {
  const req = new Request("https://site.test/api/contact", { method: "POST", body: raw ?? JSON.stringify(body), headers: { "content-type": "application/json", "CF-Connecting-IP": ip } });
  const res = await onRequestPost({ request: req, env });
  return { status: res.status, body: await res.json() };
};
let sent = null;
globalThis.fetch = async (url, opts) => { sent = { url, body: JSON.parse(opts.body), auth: opts.headers.Authorization }; return { ok: true }; };
const env = { RESEND_API_KEY: "test-key", CONTACT_TO_EMAIL: "me@example.com" };

assert.equal((await call({ ...good, company: "bot" }, env)).status, 200);
assert.equal(sent, null, "honeypot must not send");
assert.equal((await call(null, env, "not json")).status, 400, "bad JSON is rejected, not a crash");
assert.equal((await call({ ...good, email: "x" }, env)).status, 400);
assert.equal((await call(good, {})).status, 500, "missing config is reported");
const ok = await call(good, env);
assert.equal(ok.status, 200);
assert.equal(sent.url, "https://api.resend.com/emails");
assert.equal(sent.auth, "Bearer test-key");
assert.deepEqual(sent.body.to, ["me@example.com"]);
assert.equal(sent.body.reply_to, "ana@example.com");
assert.match(sent.body.text, /bakery/);
globalThis.fetch = async () => ({ ok: false });
assert.equal((await call(good, env)).status, 502);

// Turnstile: fake siteverify accepts only the token "pass"
let verified = null;
globalThis.fetch = async (url, opts) => {
  if (url.includes("siteverify")) { verified = Object.fromEntries(opts.body); return { json: async () => ({ success: verified.response === "pass" }) }; }
  sent = { url, body: JSON.parse(opts.body) }; return { ok: true };
};
const tsEnv = { ...env, TURNSTILE_SECRET_KEY: "ts-secret" };
sent = null;
assert.equal((await call(good, tsEnv)).status, 403, "missing token is rejected");
assert.equal((await call({ ...good, turnstile: "fail" }, tsEnv)).status, 403, "bad token is rejected");
assert.equal(sent, null, "no email without a valid token");
assert.equal((await call({ ...good, turnstile: "pass" }, tsEnv, undefined, "9.9.9.9")).status, 200);
assert.equal(verified.secret, "ts-secret");
assert.equal(verified.remoteip, "9.9.9.9");
assert.ok(sent, "valid token sends");

// rate limit: fake KV
const store = new Map();
const kvEnv = { ...env, RATE_LIMIT: { get: async k => store.get(k) ?? null, put: async (k, v, o) => { assert.equal(o.expirationTtl, RATE.windowSec); store.set(k, v); } } };
for (let i = 0; i < RATE.max; i++) assert.equal((await call(good, kvEnv, undefined, "2.2.2.2")).status, 200, `message ${i + 1} allowed`);
const blocked = await call(good, kvEnv, undefined, "2.2.2.2");
assert.equal(blocked.status, 429, "over the limit is blocked");
assert.equal((await call(good, kvEnv, undefined, "3.3.3.3")).status, 200, "other visitors unaffected");

console.log("contact: all checks passed");
