import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Icon from "./Icon.jsx";
import { BRAND_LOGOS, logoTone } from "../brandLogos.js";
import { HERO, STATEMENT, FLOW, REELS, PROJECTS, SERVICES, TOOLKIT, ABOUT, PROFILE } from "../data.js";

gsap.registerPlugin(ScrollTrigger);

export function Hero({ onNav }) {
  return (
    <section className="hero pad" id="home">
      <div>
        <h1><span className="thin">{HERO.thin}</span><span className="bold">{HERO.bold}</span></h1>
        <p className="mono">{HERO.sub}</p>
        <div className="cta">
          <a className="btn btn--fill" href="#contact" onClick={e => onNav(e, "contact", "hire")}>Hire me <span aria-hidden="true">↗</span></a>
          <a className="btn" href="#work" onClick={e => onNav(e, "work")}>See the work</a>
        </div>
      </div>
    </section>
  );
}

// words are rendered once; scroll progress toggles classes directly (no re-render per frame)
export function Statement({ reduce }) {
  const ref = useRef(null);
  const words = [];
  STATEMENT.forEach(part => {
    if (typeof part === "string") part.split(/\s+/).filter(Boolean).forEach(t => words.push({ t }));
    else words.push({ t: part.text, key: part.key });
  });
  const keys = STATEMENT.filter(p => typeof p !== "string");

  useLayoutEffect(() => {
    const el = ref.current, spans = [...el.querySelectorAll(".w")], steps = [...el.querySelectorAll("[data-step]")];
    const at = Object.fromEntries(keys.map(k => [k.key, words.findIndex(w => w.key === k.key)]));
    const set = p => {
      const n = Math.round(p * spans.length);
      spans.forEach((s, i) => s.classList.toggle("on", i < n));
      steps.forEach(s => s.classList.toggle("on", n > at[s.dataset.step]));
    };
    if (reduce) { set(1); return; }
    set(0);
    const st = ScrollTrigger.create({ trigger: el, start: "top top", end: "+=140%", pin: true, scrub: true, onUpdate: s => set(s.progress) });
    return () => st.kill();
  }, [reduce]);

  return (
    <section className="statement pad" aria-label="What I do" ref={ref}>
      <p className="kicker mono">What I do</p>
      <ol className="steps mono" aria-hidden="true">{keys.map(k => <li key={k.key} data-step={k.key}>{k.key}</li>)}</ol>
      <p className="lit">
        {words.map((w, i) => {
          const span = <span className="w">{w.t}</span>;
          return <span key={i}>{w.key ? <b>{span}</b> : span}{i < words.length - 1 ? " " : ""}</span>;
        })}
      </p>
    </section>
  );
}

// Animated step diagram. pin: hold the section while it plays (desktop only); otherwise steps light as the board scrolls past.
function FlowSection({ id, kicker, heading, intro, data, reduce, pin = true, children }) {
  const ref = useRef(null);
  const [inspect, setInspect] = useState("Hover or focus a step to inspect it.");
  const [stage, setStage] = useState(0);
  const steps = data.steps.map((s, i) => ({ ...s, i }));

  useLayoutEffect(() => {
    const el = ref.current, nodes = [...el.querySelectorAll(".node")].sort((a, b) => a.dataset.n - b.dataset.n);
    const set = p => {
      const k = Math.min(nodes.length - 1, Math.floor(p * nodes.length * 0.999));
      nodes.forEach((n, i) => { n.classList.toggle("on", i <= k); n.classList.toggle("now", i === k); });
      setStage(data.steps[k].stage);
    };
    if (reduce) { set(1); return; }
    set(0);
    const scrubBoard = () => ScrollTrigger.create({ trigger: el.querySelector(".board"), start: "top 75%", end: "bottom 55%", scrub: true, onUpdate: s => set(s.progress) });
    const mm = gsap.matchMedia();
    if (pin) {
      mm.add("(min-width: 901px)", () => { ScrollTrigger.create({ trigger: el, start: "top top", end: "+=160%", pin: true, scrub: true, onUpdate: s => set(s.progress) }); });
      mm.add("(max-width: 900px)", scrubBoard);   // the stacked board is taller than a phone screen
    } else mm.add("all", scrubBoard);
    return () => mm.revert();
  }, [reduce]);

  const node = s => (
    <div key={s.i} className="node" tabIndex={0} data-n={s.i} onPointerEnter={() => setInspect(s.detail)} onFocus={() => setInspect(s.detail)}>
      <Icon name={s.icon} width={1.6} /><b>{s.name}</b><small>{s.sub}</small>
    </div>
  );
  const [first, second] = data.sides;

  return (
    <section className={`flow pad${pin ? "" : " flow--free"}`} id={id} aria-labelledby={`${id}-h`} ref={ref}>
      <div>
        <p className="kicker mono">{kicker}</p>
        <h2 className="h2" id={`${id}-h`}>{heading[0]}<b>{heading[1]}</b></h2>
        {intro && <p className="flow__intro">{intro}</p>}
      </div>
      <div className="flow__body">
        <div>
          <ol className="stages">
            {data.stages.map((s, i) => <li key={s.name} className={i === stage ? "on" : ""}><span>0{i + 1}</span>{s.name}</li>)}
          </ol>
          <p className="stage-note">{data.stages[stage].note}</p>
        </div>
        <div className="board">
          <div className="board__head">
            <h3>{data.board[0]}<span>{data.board[1]}</span></h3>
            <p className="legend mono" aria-hidden="true"><span><i className="f" />{first.label}</span><span><i />{second.label}</span></p>
          </div>
          <p className="rowlabel mono">{first.label}</p>
          <div className="row row--customer">{steps.filter(s => s.side === first.key).map(node)}</div>
          <p className="rowlabel mono" style={{ marginTop: "1.2rem" }}>{second.label}</p>
          <div className="row row--team">{steps.filter(s => s.side === second.key).map(node)}</div>
          <div className="board__foot mono"><span className="inspect" aria-live="polite">{inspect}</span><span aria-hidden="true">{data.foot}</span></div>
        </div>
      </div>
      {children}
    </section>
  );
}

export const Flow = ({ reduce }) => <FlowSection id="how" kicker="How it works" heading={["Order. Book. ", "Manage."]} data={FLOW} reduce={reduce} />;

// Case study: same diagram, unpinned so the page doesn't hold the scroll twice in a row
export function Reels({ reduce }) {
  return (
    <FlowSection id="reels" kicker={REELS.kicker} heading={REELS.heading} intro={REELS.intro} data={REELS} reduce={reduce} pin={false}>
      <div className="case">
        <div>
          <dl className="case__stats">
            {REELS.stats.map(s => <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}
          </dl>
          <p className="case__asof mono">{REELS.asOf}</p>
          <p className="case__links">
            {REELS.links.map(l => <a key={l.url} className="btn" href={l.url} target="_blank" rel="noopener" aria-label={`${l.label} (opens in a new tab)`}>{l.label} <span aria-hidden="true">↗</span></a>)}
          </p>
        </div>
        <ul className="case__ads" aria-label="Ads generated by the agent">
          {REELS.ads.map(a => <li key={a.src}><img src={a.src} alt={a.alt} loading="lazy" width="640" height="800" /></li>)}
        </ul>
      </div>
    </FlowSection>
  );
}

export function Work() {
  return (
    <section className="work pad" id="work" aria-labelledby="work-h">
      <p className="kicker mono">Selected work</p>
      <h2 className="h2" id="work-h">Live sites, <b>open them.</b></h2>
      <div className="bento">
        {PROJECTS.map(p => {
          const inner = (<>
            <div className={`card__shot${p.full ? " tall" : ""}`}><img src={p.full || p.shot} alt="" loading="lazy" width="720" height="450" /></div>
            <div className="card__meta"><b>{p.name}</b><span className={`mono${p.url ? "" : " soon"}`}>{p.label}</span></div>
          </>);
          const cls = `card${p.big ? " card--big" : ""}`;
          return p.url
            ? <a key={p.name} className={cls} href={p.url} target="_blank" rel="noopener" aria-label={`${p.name}, ${p.label} (opens in a new tab)`}>{inner}</a>
            : <div key={p.name} className={cls}>{inner}</div>;
        })}
      </div>
    </section>
  );
}

function ToolLogo({ name }) {
  const logo = BRAND_LOGOS[name];
  if (!logo) return <span className="tool-logo tool-logo--letter" aria-hidden="true">{name[0]}</span>;
  return (
    <span className={`tool-logo ${logoTone(logo.hex)}`} style={{ "--brand": `#${logo.hex}` }} aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d={logo.path} fill="currentColor" /></svg>
    </span>
  );
}

export function Toolkit() {
  return (
    <section className="toolkit pad" id="toolkit" aria-labelledby="tool-h">
      <p className="kicker mono">Toolkit</p>
      <h2 className="h2" id="tool-h">What I build with, <b>and where.</b></h2>
      <ul className="tools">
        {TOOLKIT.map(t => {
          const used = PROJECTS.filter(p => p.stack?.includes(t.name)).map(p => p.name);
          if (t.extra) used.push(t.extra);
          return (
            <li key={t.name}>
              <div className="tools__head">
                <ToolLogo name={t.name} />
                <h3>{t.name}</h3>
                <span className="mono">{used.length} {used.length === 1 ? "build" : "builds"}</span>
              </div>
              <p>{t.note}</p>
              <p className="tools__used"><span className="sr-only">Used in: </span>{used.join(" · ")}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function About({ onNav }) {
  return (
    <section className="about pad" id="about" aria-labelledby="about-h">
      <figure className="about__photo"><img src={PROFILE.photo} alt={`Portrait of ${PROFILE.name}`} width="900" height="1124" loading="lazy" /></figure>
      <div className="about__text">
        <p className="kicker mono">About</p>
        <h2 className="h2" id="about-h">{ABOUT.heading[0]}<b>{ABOUT.heading[1]}</b></h2>
        {ABOUT.paragraphs.map((t, i) => <p key={i}>{t}</p>)}
        <dl className="facts">
          {ABOUT.facts.map(([k, v]) => <div key={k}><dt className="mono">{k}</dt><dd>{v}</dd></div>)}
        </dl>
        <div className="about__cta">
          <a className="btn btn--fill" href="#contact" onClick={e => onNav(e, "contact", "hire")}>Hire me <span aria-hidden="true">↗</span></a>
          {PROFILE.resume && <a className="btn" href={PROFILE.resume} download="Joshua-Evangelista-CV.pdf">Download résumé</a>}
          <a className="btn" href={`mailto:${PROFILE.email}`}>Email me</a>
        </div>
      </div>
    </section>
  );
}

export function Services({ reduce, onNav }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (reduce) return;
    const cards = [...ref.current.querySelectorAll("article")];
    // each card dims back as the next one stacks over it (via --dim, so it stays opaque in both themes)
    const tweens = cards.slice(0, -1).map((card, i) => gsap.to(card, {
      scale: 0.94, "--dim": 1, ease: "none",
      scrollTrigger: { trigger: cards[i + 1], start: "top 65%", end: `top ${(6 + (i + 1) * 1.4) * 16}px`, scrub: true },
    }));
    return () => tweens.forEach(t => { t.scrollTrigger?.kill(); t.kill(); });
  }, [reduce]);
  return (
    <section className="services pad" id="services" aria-labelledby="svc-h">
      <p className="kicker mono">Services</p>
      <h2 className="h2" id="svc-h">Start with one. <b>Add as you grow.</b></h2>
      <div className="svc" ref={ref}>
        {SERVICES.map((s, i) => (
          <article key={s.title} style={{ "--i": i }}>
            <div className="svc__top mono"><span>{s.tag}</span><span>{s.stack}</span></div>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
            <a href="#contact" onClick={e => onNav(e, "contact", s.title)}>Start this <span aria-hidden="true">↗</span></a>
          </article>
        ))}
      </div>
    </section>
  );
}
