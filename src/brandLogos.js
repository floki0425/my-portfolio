// Official brand marks from Simple Icons (CC0, https://simpleicons.org). Each has { title, hex, path } on a 24x24 grid.
// Tools without an entry here show a neutral letter tile instead of a redrawn logo.
import { siReact, siNextdotjs, siVite, siTailwindcss, siGsap, siWordpress, siTypescript, siPython, siMeta, siElevenlabs } from "simple-icons";

export const BRAND_LOGOS = {
  "React": siReact,
  "Next.js": siNextdotjs,
  "Vite": siVite,
  "Tailwind CSS": siTailwindcss,
  "GSAP": siGsap,
  "WordPress": siWordpress,
  "TypeScript": siTypescript,
  "Python": siPython,
  "Meta Graph API": siMeta,
  "ElevenLabs": siElevenlabs,
};

// brand colours that would be too faint on a theme's tiles (below 3:1) fall back to the text colour there
const lum = hex => {
  const [r, g, b] = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const logoTone = hex => {
  const L = lum(hex);
  return [L < 0.128 ? "is-dark" : "", L > 0.267 ? "is-light" : ""].join(" ").trim();
};
