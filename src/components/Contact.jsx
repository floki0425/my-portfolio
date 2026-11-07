import { useEffect, useRef, useState } from "react";
import { PROFILE } from "../data.js";
import { TYPES, validate } from "../../api/_lib/validate.js";

const FIELDS = ["name", "email", "type", "message"];

export default function Contact({ preset }) {
  const form = useRef(null);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle"); // idle | sending | sent | failed
  const [type, setType] = useState(TYPES[0]);
  useEffect(() => { if (preset && TYPES.includes(preset)) setType(preset); }, [preset]);

  async function submit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form.current));
    const { values, errors: errs, ok } = validate(data);
    setErrors(errs);
    if (!ok) { form.current.elements[FIELDS.find(f => errs[f])]?.focus(); return; }
    setState("sending");
    const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 12000);
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, company: data.company }), signal: ctl.signal });
      if (!r.ok) throw new Error(String(r.status));
      setState("sent");
      form.current.reset(); setType(TYPES[0]);
    } catch {
      setState("failed");
    } finally { clearTimeout(timer); }
  }

  const err = f => errors[f] && <p className="err" id={`${f}-err`}>{errors[f]}</p>;
  const a11y = f => ({ "aria-invalid": errors[f] ? "true" : undefined, "aria-describedby": errors[f] ? `${f}-err` : undefined });
  const mailto = `mailto:${PROFILE.email}?subject=${encodeURIComponent("Project enquiry")}`;

  return (
    <section className="contact pad" id="contact" aria-labelledby="contact-h">
      <div className="intro">
        <p className="kicker mono">Contact</p>
        <h2 className="h2" id="contact-h">Let's build <b>the next one.</b></h2>
        <p>Hiring for your team, or have a project in mind? I'll reply within a couple of days. Or email <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>.</p>
      </div>
      <form className="form" ref={form} onSubmit={submit} noValidate>
        <label>Name <span className="sr-only">(required)</span><input name="name" autoComplete="name" {...a11y("name")} />{err("name")}</label>
        <label>Email <span className="sr-only">(required)</span><input name="email" type="email" autoComplete="email" {...a11y("email")} />{err("email")}</label>
        <label className="full">What do you need?
          <select name="type" value={type} onChange={e => setType(e.target.value)} {...a11y("type")}>{TYPES.map(t => <option key={t}>{t}</option>)}</select>{err("type")}
        </label>
        <label className="full">Message <span className="sr-only">(required)</span><textarea name="message" {...a11y("message")} />{err("message")}</label>
        <div className="hp" aria-hidden="true"><label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label></div>
        <button className="btn btn--fill" type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : <>Send message <span aria-hidden="true">↗</span></>}</button>
        <p className={`status${state === "failed" ? " bad" : ""}`} role="status">
          {state === "sent" && "Thanks! Your message is on its way. I'll reply within a couple of days."}
          {state === "failed" && <>Your message didn't go through. Please <a href={mailto}>email me directly</a> instead.</>}
        </p>
      </form>
    </section>
  );
}
