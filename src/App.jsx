import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Analytics } from "@vercel/analytics/react";
import Sidebar from "./components/Sidebar.jsx";
import Contact from "./components/Contact.jsx";
import { Hero, Statement, Flow, Work, Reels, Toolkit, About, Services } from "./components/Sections.jsx";
import { PROFILE } from "./data.js";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
// "Start this" on a service card pre-selects the matching option in the form
const SERVICE_TO_TYPE = { hire: "Job opportunity", "Business websites": "Business website", "Web apps & systems": "Web app or system", "Launch & care": "Launch & care" };

export default function App() {
  const [theme, setTheme] = useState(document.documentElement.dataset.theme || "dark");
  const [menu, setMenu] = useState(false);
  const [preset, setPreset] = useState(null);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("side-collapsed") === "1");
  const lenis = useRef(null);
  const menuBtn = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0a0a0b" : "#f4f4f5");
  }, [theme]);

  // smooth scrolling drives ScrollTrigger; skipped entirely for reduced motion
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    if (reduce) return;
    const l = new Lenis({ lerp: 0.1 });
    lenis.current = l;
    l.on("scroll", ScrollTrigger.update);
    const tick = t => l.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); l.destroy(); lenis.current = null; };
  }, []);

  const toggleTheme = () => setTheme(t => {
    const next = t === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    return next;
  });

  // in-page links: smooth scroll, update the URL, and move focus to the section for keyboard/screen-reader users
  const nav = (e, id, service) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    if (service) setPreset(SERVICE_TO_TYPE[service]);
    const offset = innerWidth <= 900 ? -64 : 0;
    if (lenis.current) lenis.current.scrollTo(el, { offset });
    else window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + offset, behavior: reduce ? "auto" : "smooth" });
    history.replaceState(null, "", `#${id}`);
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  };

  const closeMenu = returnFocus => { setMenu(false); if (returnFocus) menuBtn.current?.focus(); };

  // desktop sidebar can shrink to icons; layout changes, so pinned scroll sections are re-measured
  useEffect(() => {
    document.documentElement.classList.toggle("side-collapsed", collapsed);
    localStorage.setItem("side-collapsed", collapsed ? "1" : "0");
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [collapsed]);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="topbar">
        <span className="avatar avatar--photo"><img src={PROFILE.avatar} alt="" width="240" height="240" /></span><b>{PROFILE.name}</b>
        <button className="btn" type="button" ref={menuBtn} aria-expanded={menu} aria-controls="side" onClick={() => setMenu(m => !m)}>{menu ? "Close" : "Menu"}</button>
      </div>
      <div className={`scrim${menu ? " open" : ""}`} onClick={() => closeMenu(false)} />
      <Sidebar open={menu} onClose={closeMenu} theme={theme} onTheme={toggleTheme} onNav={nav} collapsed={collapsed} onCollapse={() => setCollapsed(c => !c)} />
      <main id="main" tabIndex={-1}>
        <Hero onNav={nav} />
        <Statement reduce={reduce} />
        <Flow reduce={reduce} />
        <Work />
        <Reels reduce={reduce} />
        <Toolkit />
        <About onNav={nav} />
        <Services reduce={reduce} onNav={nav} />
        <Contact preset={preset} />
        <footer className="foot pad"><span>© {new Date().getFullYear()} {PROFILE.name}</span><span className="mono">Built with React, GSAP &amp; Lenis</span></footer>
      </main>
      <Analytics />
    </>
  );
}
