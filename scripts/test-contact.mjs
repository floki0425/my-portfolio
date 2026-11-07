// Self-check for the contact form rules and the /api/contact function. Run: npm test
import assert from "node:assert/strict";
import { validate } from "../api/_lib/validate.js";
import handler from "../api/contact.js";

const good = { name: "Ana Cruz", email: "ana@example.com", type: "Business website", message: "I need a site for my bakery." };

// validation
assert.equal(validate(good).ok, true);
assert.ok(validate({ ...good, name: "  " }).errors.name);
assert.ok(validate({ ...good, email: "not-an-email" }).errors.email);
assert.ok(validate({ ...good, type: "Hack" }).errors.type);
assert.ok(validate({ ...good, message: "short" }).errors.message);
assert.equal(validate({ ...good, name: "Ana\r\nBcc: x@y.z" }).values.name, "Ana Bcc: x@y.z"); // no header injection via subject
assert.equal(validate({}).ok, false);

// fake req/res + fetch
const call = async (req, env = {}) => {
  const saved = { ...process.env };
  Object.assign(process.env, env);
  const out = { status: 0, body: null, headers: {} };
  const res = { status(c) { out.status = c; return this; }, json(b) { out.body = b; return this; }, setHeader(k, v) { out.headers[k] = v; } };
  await handler(req, res);
  process.env = saved;
  return out;
};
let sent = null;
globalThis.fetch = async (url, opts) => { sent = { url, body: JSON.parse(opts.body), auth: opts.headers.Authorization }; return { ok: true }; };
const env = { RESEND_API_KEY: "test-key", CONTACT_TO_EMAIL: "me@example.com" };

assert.equal((await call({ method: "GET" }, env)).status, 405);
assert.equal((await call({ method: "POST", body: { ...good, company: "bot" } }, env)).status, 200);
assert.equal(sent, null, "honeypot must not send");
assert.equal((await call({ method: "POST", body: { ...good, email: "x" } }, env)).status, 400);
assert.equal((await call({ method: "POST", body: good }, {})).status, 500, "missing config is reported");
const ok = await call({ method: "POST", body: good }, env);
assert.equal(ok.status, 200);
assert.equal(sent.url, "https://api.resend.com/emails");
assert.equal(sent.auth, "Bearer test-key");
assert.deepEqual(sent.body.to, ["me@example.com"]);
assert.equal(sent.body.reply_to, "ana@example.com");
assert.match(sent.body.text, /bakery/);
globalThis.fetch = async () => ({ ok: false });
assert.equal((await call({ method: "POST", body: good }, env)).status, 502);

console.log("contact: all checks passed");
