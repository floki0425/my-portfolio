import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// robots.txt + sitemap.xml need the absolute site address, so they're generated from VITE_SITE_URL
const seoFiles = url => ({
  name: "seo-files",
  generateBundle() {
    this.emitFile({ type: "asset", fileName: "robots.txt", source: `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n` });
    this.emitFile({ type: "asset", fileName: "sitemap.xml", source:
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${url}/</loc></url>\n</urlset>\n` });
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  return { plugins: [react(), tailwindcss(), seoFiles(env.VITE_SITE_URL)] };
});
