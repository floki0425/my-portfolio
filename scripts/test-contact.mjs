// Self-check for the contact form rules and the Cloudflare /api/contact function. Run: npm test
import assert from "node:assert/strict";
import { validate } from "../src/validate.js";
import { onRequestPost } from "../functions/api/contact.js";

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
const call = async (body, env, raw) => {
  const req = new Request("https://site.test/api/contact", { method: "POST", body: raw ?? JSON.stringify(body), headers: { "content-type": "application/json" } });
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

console.log("contact: all checks passed");
