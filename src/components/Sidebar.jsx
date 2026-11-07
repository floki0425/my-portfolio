import { Fragment, useEffect, useRef, useState } from "react";
import { siFacebook, siGithub, siTiktok } from "simple-icons";
import Icon from "./Icon.jsx";
import { PROFILE, PROJECTS } from "../data.js";

const MENU = [
  { id: "home", label: "Home", icon: "home" },
  { id: "how", label: "How it works", icon: "flow" },
  { id: "work", label: "Work", icon: "work", count: PROJECTS.length },
  { id: "toolkit", label: "Toolkit", icon: "grid" },
  { id: "about", label: "About", icon: "user" },
  { id: "services", label: "Services", icon: "layers" },
];
const SECTION_IDS = [...MENU.map(m => m.id), "reels", "contact"];

// NEXFORA "N" monogram, traced from the brand mark as a vector so it stays sharp and follows the theme colour
export const NexforaMark = () => (
  <svg viewBox="298 307 659 636" aria-hidden="true"><path fill="currentColor" d="M298 307 792 730V417L957 307V855L833 943 415 555V847L298 936Z" /></svg>
);
const Brand = ({ icon }) => <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d={icon.path} /></svg>;

function useClock(timeZone) {
  const fmt = () => new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone }).format(new Date());
  const [time, setTime] = useState(fmt);
  useEffect(() => { const t = setInterval(() => setTime(fmt()), 15000); return () => clearInterval(t); }, []);
  return time;
}

// the section nearest above 40% of the viewport is the current one
function useCurrentSection(ids) {
  const [cur, setCur] = useState(ids[0]);
  useEffect(() => {
    const onScroll = () => {
      let best = -Infinity, id = ids[0];
      for (const s of ids) {
        const top = document.getElementById(s)?.getBoundingClientRect().top ?? Infinity;
        if (top < innerHeight * 0.4 && top > best) { best = top; id = s; }
      }
      setCur(id);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);
  return cur;
}

export default function Sidebar({ open, onClose, theme, onTheme, onNav, collapsed, onCollapse }) {
  const time = useClock(PROFILE.timeZone);
  const current = useCurrentSection(SECTION_IDS);
  const firstLink = useRef(null);

  useEffect(() => { if (open) firstLink.current?.focus(); }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKey = e => e.key === "Escape" && onClose(true);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  const go = (e, id) => { onNav(e, id); onClose(false); };
  const link = (id, label, icon, extra, cls = "") => (
    <a href={`#${id}`} className={cls} ref={id === "home" ? firstLink : null} aria-current={current === id ? "location" : undefined}
       onClick={e => go(e, id)} title={collapsed ? label : undefined}>
      {icon}<span className="lbl">{label}</span>{extra}
    </a>
  );
  const ext = (href, label, icon) => (
    <a href={href} target="_blank" rel="noopener" title={collapsed ? label : undefined} aria-label={`${label} (opens in a new tab)`}>
      {icon}<span className="lbl">{label}</span><span className="ext" aria-hidden="true">↗</span>
    </a>
  );
  // socials show only once their link is filled in (data.js → PROFILE)
  const socials = [
    { href: "https://www.nexforatech.com/", label: "NEXFORA", icon: <span className="mark"><NexforaMark /></span> },
    { href: "https://synqro.nexforatech.com/", label: "SYNQRO", icon: <img className="mark-img" src="/brand/synqro-mark.png" alt="" width="96" height="96" /> },
    PROFILE.facebook && { href: PROFILE.facebook, label: "Facebook", icon: <Brand icon={siFacebook} /> },
    PROFILE.github && { href: PROFILE.github, label: "GitHub", icon: <Brand icon={siGithub} /> },
    PROFILE.linkedin && { href: PROFILE.linkedin, label: "LinkedIn", icon: <span className="txt">in</span> },
    PROFILE.tiktok && { href: PROFILE.tiktok, label: "TikTok", icon: <Brand icon={siTiktok} /> },
    PROFILE.resume && { href: PROFILE.resume, label: "Download résumé (PDF)", icon: <Icon name="doc" />, download: true },
  ].filter(Boolean);

  return (
    <aside className={`side${open ? " open" : ""}${collapsed ? " is-collapsed" : ""}`} id="side" aria-label="Profile and navigation">
      <button className="side__collapse" type="button" onClick={onCollapse} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-expanded={!collapsed} aria-controls="side">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      <div className="side__hero">
        <p className="clock"><b>{time}</b> in {PROFILE.place}</p>
        <a className="side__brand" href="https://www.nexforatech.com/" target="_blank" rel="noopener" aria-label="NEXFORA website (opens in a new tab)">
          <img className="wm wm--light" src="/brand/nexfora-wordmark-light.png" alt="" width="897" height="75" />
          <img className="wm wm--dark" src="/brand/nexfora-wordmark-dark.png" alt="" width="897" height="75" />
          <span className="mono-mark"><NexforaMark /></span>
        </a>
      </div>

      <div className="side__profile">
        <div className="side__avatar">
          <img src={PROFILE.avatar} alt="" width="240" height="240" />
          <span className="side__badge" title={PROFILE.status} aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="m7 12.5 3.2 3.2L17 9" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </div>
        <p className="who"><b>{PROFILE.name}</b><span>{PROFILE.role}</span></p>
        <div className="socials">
          {socials.map(s => s.download
            ? <a key={s.label} href={s.href} download="Joshua-Evangelista-CV.pdf" aria-label={s.label} title={s.label}>{s.icon}</a>
            : <a key={s.label} href={s.href} target="_blank" rel="noopener" aria-label={`${s.label} (opens in a new tab)`} title={s.label}>{s.icon}</a>)}
        </div>
      </div>

      <nav className="menu" aria-label="Sections">
        <p className="menu__label mono">Menu</p>
        {MENU.map(m => <Fragment key={m.id}>{link(m.id, m.label, <Icon name={m.icon} />, m.count != null && <span className="count">{m.count}</span>)}</Fragment>)}
        <p className="menu__label mono">Discover</p>
        {link("reels", "AI automation", <Icon name="bolt" />, null, "is-feature")}
        {ext("https://www.nexforatech.com/", "NEXFORA", <span className="mark"><NexforaMark /></span>)}
        {ext("https://synqro.nexforatech.com/", "SYNQRO", <img className="mark-img" src="/brand/synqro-mark.png" alt="" width="96" height="96" />)}
        <p className="menu__label mono">General</p>
        {link("contact", "Contact", <Icon name="chat" />)}
        <button className="toggle" type="button" role="switch" aria-checked={theme === "dark"} onClick={onTheme} title={collapsed ? "Dark mode" : undefined}>
          <Icon name="moon" /><span className="lbl">Dark mode</span><span className="toggle__track" aria-hidden="true" />
        </button>
      </nav>
    </aside>
  );
}
