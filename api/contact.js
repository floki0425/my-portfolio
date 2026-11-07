// Vercel serverless function: POST /api/contact -> emails the enquiry to you via Resend.
// Needs env vars in Vercel: RESEND_API_KEY, CONTACT_TO_EMAIL (and optionally CONTACT_FROM_EMAIL).
import { validate } from "./_lib/validate.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const body = typeof req.body === "string" ? safeJson(req.body) : req.body || {};

  // honeypot: real visitors never see this field; bots fill it. Pretend success, send nothing.
  if (body.company) return res.status(200).json({ ok: true });

  const { values, errors, ok } = validate(body);
  if (!ok) return res.status(400).json({ error: "Invalid input", errors });

  const key = process.env.RESEND_API_KEY, to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) return res.status(500).json({ error: "Email is not configured on the server" });
  const from = process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";

  // shortcut: no rate limiting beyond the honeypot; add Vercel Firewall rules or Upstash if spam shows up
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from, to: [to], reply_to: values.email,
        subject: `New enquiry from ${values.name}: ${values.type}`,
        text: `Name: ${values.name}\nEmail: ${values.email}\nNeeds: ${values.type}\n\n${values.message}\n`,
      }),
    });
    if (!r.ok) return res.status(502).json({ error: "The email service did not accept the message" });
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ error: "Could not reach the email service" });
  }
}

function safeJson(s) { try { return JSON.parse(s); } catch { return {}; } }
