# Joshua Evangelista · Portfolio

Personal portfolio: a profile sidebar, a scroll-lit statement, an animated order-flow diagram, live project cards, a toolkit backed by real builds, stacking service cards and a working contact form. Light and dark themes.

**Stack:** React 19 · Vite · Tailwind CSS 4 · GSAP (ScrollTrigger) · Lenis · Vercel (hosting, serverless contact API, analytics) · Resend (email).

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # contact form + API self-check
npm run build      # production build in dist/
```

The contact form calls `/api/contact`, which only exists on Vercel. Locally it shows the "email me directly" fallback. To run the API locally, use `npx vercel dev`.

## Edit the content

Almost everything is in **`src/data.js`**:

- `PROFILE`: name, role, email, **GitHub/LinkedIn links**, `status` ("Open to full-time roles"), `resume`
- `HERO`, `STATEMENT`, `FLOW`, `SERVICES`: the words on the page
- `PROJECTS`: each project's name, link, label, stack and screenshots (images live in `public/work/`)
- `TOOLKIT`: each tool automatically lists the projects whose `stack` includes it
- `REELS`: the NEXFORA Reels case study. Its `stats` are real counts from the project logs; update them and `asOf` as it keeps running

Contact form options are in `api/_lib/validate.js` (`TYPES`), shared by the browser and the server.

**CV:** kept separate from the website, in `../CV/`. Edit `../CV/resume.html`, then run `npm run cv` to rebuild `../CV/Joshua-Evangelista-CV.pdf`. To offer it on the site instead, copy the PDF into `public/` and set `resume` in `PROFILE`; a download icon and button then appear.

## Deploy to Vercel

1. Push this `site` folder to a GitHub repository (public is good: employers can read the code).
2. On vercel.com, choose **Add New → Project**, import the repo, and keep the detected **Vite** settings.
3. In **Settings → Environment Variables**, add:

   | Name | Value |
   |---|---|
   | `RESEND_API_KEY` | from resend.com → API Keys |
   | `CONTACT_TO_EMAIL` | the inbox that receives messages |
   | `CONTACT_FROM_EMAIL` | optional, e.g. `Portfolio <hello@yourdomain.com>` once your domain is verified in Resend |

   Until you verify a domain in Resend, leave `CONTACT_FROM_EMAIL` unset. Resend's test sender only delivers to the email you signed up to Resend with, so use that address as `CONTACT_TO_EMAIL`.
4. Deploy. Then set `VITE_SITE_URL` in `.env.production` to your real address (e.g. `https://joshuaevangelista.dev`) and redeploy, so share previews and the sitemap use it.
5. In the Vercel project, open **Analytics** and enable it.
6. Optional: **Settings → Domains** to connect a custom domain.

## After launch

- Send yourself a message through the form, and check it arrives.
- Paste the link into LinkedIn or Messenger to check the share preview (image: `public/og.png`).
- Add the site to Google Search Console and submit `/sitemap.xml`.
