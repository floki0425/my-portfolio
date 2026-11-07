// Cloudflare Pages Function: POST /api/contact -> emails the enquiry to you via Resend.
// Set in Cloudflare (Pages project -> Settings -> Variables and Secrets):
//   RESEND_API_KEY (secret), CONTACT_TO_EMAIL, and optionally CONTACT_FROM_EMAIL.
// Only POST runs this function; other methods fall through to the static site.
import { validate } from "../../src/validate.js";

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { body = {}; }

  // honeypot: real visitors never see this field; bots fill it. Pretend success, send nothing.
  if (body.company) return json({ ok: true });

  const { values, errors, ok } = validate(body);
  if (!ok) return json({ error: "Invalid input", errors }, 400);

  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) return json({ error: "Email is not configured on the server" }, 500);
  const from = env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";

  // shortcut: no rate limiting beyond the honeypot; add a Cloudflare rate-limiting rule if spam shows up
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
