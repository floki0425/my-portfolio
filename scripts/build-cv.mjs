// Renders ../CV/resume.html (your CV, kept outside the website) to ../CV/Joshua-Evangelista-CV.pdf (A4).
// Run: npm run cv   (set CHROME_PATH if Chrome is installed somewhere else)
import { chromium } from "playwright-core";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const cvDir = path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))), "..", "CV");
const out = path.join(cvDir, "Joshua-Evangelista-CV.pdf");
const chrome = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";

const browser = await chromium.launch({ executablePath: chrome });
const page = await browser.newPage();
await page.goto(pathToFileURL(path.join(cvDir, "resume.html")).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const pages = await page.evaluate(() => Math.ceil(document.body.scrollHeight / (297 * 96 / 25.4)));
await page.pdf({ path: out, format: "A4", printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log(`${out} written (${pages} page${pages > 1 ? "s" : ""})`);
