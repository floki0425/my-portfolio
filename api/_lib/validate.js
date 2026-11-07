// Shared by the browser form and the /api/contact function, so both apply the same rules.
export const TYPES = ["Job opportunity", "Business website", "Web app or system", "Launch & care", "Not sure yet"];
export const LIMITS = { name: 100, email: 200, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validate(input = {}) {
  const str = v => (typeof v === "string" ? v : "").trim();
  const values = {
    name: str(input.name).replace(/[\r\n]+/g, " "),   // single line: it goes into the email subject
    email: str(input.email),
    type: str(input.type),
    message: str(input.message),
  };
  const errors = {};
  if (!values.name) errors.name = "Enter your name.";
  else if (values.name.length > LIMITS.name) errors.name = `Keep your name under ${LIMITS.name} characters.`;
  if (!values.email) errors.email = "Enter your email so I can reply.";
  else if (values.email.length > LIMITS.email || !EMAIL_RE.test(values.email)) errors.email = "Enter a valid email, like name@example.com.";
  if (!TYPES.includes(values.type)) errors.type = "Choose what you need.";
  if (values.message.length < 10) errors.message = "Tell me a little about the project (at least 10 characters).";
  else if (values.message.length > LIMITS.message) errors.message = `Keep the message under ${LIMITS.message} characters.`;
  return { values, errors, ok: Object.keys(errors).length === 0 };
}
