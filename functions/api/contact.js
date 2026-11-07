// Cloudflare Pages Function: POST /api/contact -> emails the enquiry to you via Resend.
// Set in Cloudflare (Pages project -> Settings -> Variables and Secrets):
//   RESEND_API_KEY (secret), CONTACT_TO_EMAIL, optionally CONTACT_FROM_EMAIL,
//   TURNSTILE_SECRET_KEY (secret; when set, every message must pass Turnstile).
// And under Settings -> Bindings: a KV namespace bound as RATE_LIMIT (limits messages per visitor).
// Only POST runs this function; other methods fall through to the static site.
import { validate } from "../../src/validate.js";

export const RATE = { max: 5, windowSec: 3600 }; // 5 messages per visitor per hour

const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...headers } });

// shortcut: KV is eventually consistent, so a burst of parallel requests can slip a few past the limit; Turnstile covers bots, move to a Durable Object if that matters
async function overLimit(kv, ip) {
  const key = `contact:${ip}`;
  const n = Number(await kv.get(key)) || 0;
  if (n >= RATE.max) return true;
  await kv.put(key, String(n + 1), { expirationTtl: RATE.windowSec });
  return false;
}

async function passesTurnstile(token, secret, ip) {
  if (!token) return false;
  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    return (await r.json()).success === true;
  } catch {
    return false;
  }
}

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { body = {}; }

  // honeypot: real visitors never see this field; bots fill it. Pretend success, send nothing.
  if (body.company) return json({ ok: true });

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (env.RATE_LIMIT && await overLimit(env.RATE_LIMIT, ip))
    return json({ error: "Too many messages. Please try again later." }, 429, { "retry-after": String(RATE.windowSec) });

  const { values, errors, ok } = validate(body);
  if (!ok) return json({ error: "Invalid input", errors }, 400);

  if (env.TURNSTILE_SECRET_KEY && !await passesTurnstile(body.turnstile, env.TURNSTILE_SECRET_KEY, ip))
    return json({ error: "Verification failed. Please try again." }, 403);

  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) return json({ error: "Email is not configured on the server" }, 500);
  const from = env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from, to: [env.CONTACT_TO_EMAIL], reply_to: values.email,
        subject: `New enquiry from ${values.name}: ${values.type}`,
        text: `Name: ${values.name}\nEmail: ${values.email}\nNeeds: ${values.type}\n\n${values.message}\n`,
      }),
    });
    if (!r.ok) return json({ error: "The email service did not accept the message" }, 502);
    return json({ ok: true });
  } catch {
    return json({ error: "Could not reach the email service" }, 502);
  }
}
