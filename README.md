# Joshua Evangelista · Portfolio

Personal portfolio: a profile sidebar, a scroll-lit statement, an animated order-flow diagram, live project cards, a toolkit backed by real builds, stacking service cards and a working contact form. Light and dark themes.

**Stack:** React 19 · Vite · Tailwind CSS 4 · GSAP (ScrollTrigger) · Lenis · Cloudflare Pages (hosting + contact form function) · Resend (email).

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # contact form + API self-check
npm run build      # production build in dist/
```

The contact form calls `/api/contact` (`functions/api/contact.js`), which runs on Cloudflare. Locally it shows the "email me directly" fallback. To run the function locally: `npm run build` then `npx wrangler pages dev dist`.

## Edit the content

Almost everything is in **`src/data.js`**:

- `PROFILE`: name, role, email, photo, social links (Facebook, and **GitHub/LinkedIn** once you add them)
- `HERO`, `STATEMENT`, `FLOW`, `SERVICES`: the words on the page
- `PROJECTS`: each project's name, link, label, stack and screenshots (images live in `public/work/`)
- `TOOLKIT`: each tool automatically lists the projects whose `stack` includes it
- `REELS`: the NEXFORA Reels case study. Its `stats` are real counts from the project logs; update them and `asOf` as it keeps running

Contact form options are in `src/validate.js` (`TYPES`), shared by the browser and the server function.

**CV:** kept separate from the website, in `../CV/`. Edit `../CV/resume.html`, then run `npm run cv` to rebuild `../CV/Joshua-Evangelista-CV.pdf`. To offer it on the site instead, copy the PDF into `public/` and set `resume` in `PROFILE`; a download icon and button then appear.

## Deploy to Cloudflare Pages

1. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**, and pick `floki0425/my-portfolio`.
2. Build settings: framework preset **React (Vite)** (or None), build command `npm run build`, output directory `dist`.
   Under **Environment variables** add `NODE_VERSION` = `22` (Vite 8 needs a recent Node).
3. Deploy. The site gets an address like `https://my-portfolio.pages.dev`.
4. In the Pages project, **Settings → Variables and Secrets**, add:

   | Name | Type | Value |
   |---|---|---|
   | `RESEND_API_KEY` | Secret | from resend.com → API Keys |
   | `CONTACT_TO_EMAIL` | Text | the inbox that receives messages |
   | `CONTACT_FROM_EMAIL` | Text | optional, once your domain is verified in Resend |

   Until you verify a domain in Resend, leave `CONTACT_FROM_EMAIL` unset and use the email you signed up to Resend with as `CONTACT_TO_EMAIL`. Then **redeploy** so the function picks the values up.
5. If the address differs from `https://my-portfolio.pages.dev`, update `VITE_SITE_URL` in `.env.production` and push.
6. Optional: **Web Analytics** (Cloudflare, cookie-free) and **Custom domains** in the Pages project.

Every `git push` to `main` redeploys automatically.

## After launch

- Send yourself a message through the form, and check it arrives.
- Paste the link into LinkedIn or Messenger to check the share preview (image: `public/og.png`).
- Add the site to Google Search Console and submit `/sitemap.xml`.
