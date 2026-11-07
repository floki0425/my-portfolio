import { useEffect, useRef, useState } from "react";
import { PROFILE } from "../data.js";
import { TYPES, validate } from "../validate.js";

const FIELDS = ["name", "email", "type", "message"];
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

let turnstileScript;
const loadTurnstile = () => turnstileScript ??= new Promise((resolve, reject) => {
  const s = document.createElement("script");
  s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
  s.onload = () => resolve(window.turnstile);
  s.onerror = () => { turnstileScript = null; reject(); };
  document.head.appendChild(s);
});

export default function Contact({ preset, theme }) {
  const form = useRef(null);
  const box = useRef(null), widget = useRef(null), token = useRef("");
  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle"); // idle | sending | sent | failed | verifying
  const [type, setType] = useState(TYPES[0]);
  useEffect(() => { if (preset && TYPES.includes(preset)) setType(preset); }, [preset]);

  // Cloudflare Turnstile: invisible unless Cloudflare wants a click; re-rendered when the site theme flips
  useEffect(() => {
    if (!SITE_KEY) return;
    let gone = false;
    loadTurnstile().then(ts => {
      if (gone || !box.current) return;
      widget.current = ts.render(box.current, {
        sitekey: SITE_KEY, theme: theme === "light" ? "light" : "dark", appearance: "interaction-only", size: "flexible",
        callback: t => { token.current = t; },
        "expired-callback": () => { token.current = ""; },
        "error-callback": () => { token.current = ""; },
      });
    }).catch(() => {});
    return () => {
      gone = true; token.current = "";
      if (widget.current != null) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, [theme]);

  async function submit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form.current));
    const { values, errors: errs, ok } = validate(data);
    setErrors(errs);
    if (!ok) { form.current.elements[FIELDS.find(f => errs[f])]?.focus(); return; }
    if (SITE_KEY && !token.current) { setState("verifying"); return; }
    setState("sending");
    const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 12000);
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, company: data.company, turnstile: token.current }), signal: ctl.signal });
      if (!r.ok) throw new Error(String(r.status));
      setState("sent");
      form.current.reset(); setType(TYPES[0]);
    } catch {
      setState("failed");
    } finally {
      clearTimeout(timer);
      // tokens are single-use: get a fresh one for the next message
      if (widget.current != null) { token.current = ""; window.turnstile?.reset(widget.current); }
    }
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
        {SITE_KEY && <div className="ts full" ref={box} />}
        <button className="btn btn--fill" type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : <>Send message <span aria-hidden="true">↗</span></>}</button>
        <p className={`status${state === "failed" ? " bad" : ""}`} role="status">
          {state === "verifying" && "Just a second, still checking you're not a bot. Then press Send again."}
          {state === "sent" &&"Thanks! Your message is on its way. I'll reply within a couple of days."}
          {state === "failed" && <>Your message didn't go through. Please <a href={mailto}>email me directly</a> instead.</>}
        </p>
      </form>
    </section>
  );
}
