// ---- Everything you'd edit lives here --------------------------------------

export const PROFILE = {
  name: "Joshua Evangelista",
  initials: "JE",
  role: "Full-stack developer",
  org: "Founder, NEXFORA",
  email: "joshua.evangelista.dev@gmail.com",
  timeZone: "Asia/Manila",
  place: "the Philippines",
  github: "",    // e.g. "https://github.com/your-username" (hidden until set)
  linkedin: "",  // e.g. "https://linkedin.com/in/your-username" (hidden until set)
  resume: "",  // the CV is a separate file (npm run cv); leave empty to keep it off the site
  facebook: "https://www.facebook.com/jxfitactiveliving/",
  tiktok: "",    // TikTok profile URL (hidden until set)
  status: "Open to full-stack roles",
  avatar: "/avatar.webp",
  photo: "/profile.webp",
};

// About: written only from known facts. Add your own story, experience and education here.
export const ABOUT = {
  heading: ["The person ", "behind the builds."],
  paragraphs: [
    "I'm Joshua, a full-stack web developer from the Philippines. I've been building for the web for 3 years, I hold a BS in Information Technology, and I founded NEXFORA.",
    "I build what businesses actually run on: ordering for a homemade beef tapa brand, bookings for car and motorcycle rentals, and Nexfora OS, the operations dashboard behind my own studio.",
    "Lately I've gone deep on AI automation. NEXFORA Reels writes, voices, renders and posts our social content every day and answers comments on its own, so the work keeps moving while I build.",
    "I'm looking for a full-stack role where I can ship product with a team, from fast, accessible interfaces to the APIs and systems behind them.",
  ],
  facts: [
    ["Experience", "3 years building for the web"],
    ["Education", "BS Information Technology"],
    ["Role", "Full-stack developer"],
    ["Focus", "Web apps, websites, AI automation"],
    ["Based in", "Philippines (GMT+8)"],
    ["Open to", "Full-stack roles"],
  ],
};

export const HERO = {
  thin: "I build the site.",
  bold: "You run the business.",
  sub: "Full-stack web developer & founder of NEXFORA. 3 years shipping production websites, web apps and AI automations with React, Next.js and Tailwind.",
};

// The statement that lights up as you scroll. Objects are the highlighted keywords.
export const STATEMENT = [
  "Most business websites look fine and do nothing. I build sites customers ",
  { key: "order", text: "order" }, " from, ",
  { key: "book", text: "book" }, " through, and systems your team ",
  { key: "manage", text: "manages" }, " the work in.",
];

export const FLOW = {
  sides: [{ key: "customer", label: "Customer" }, { key: "team", label: "Your team" }],
  board: ["Visit to ", "fulfilled order"],
  foot: "Example flow",
  stages: [
    { name: "Order", note: "Customers find you and choose what they want, on any phone." },
    { name: "Book", note: "Payment or booking is confirmed instantly, with no back-and-forth." },
    { name: "Manage", note: "Every order lands in one dashboard, so your team always knows what's next." },
  ],
  // stage: index into stages; side: who does this step
  steps: [
    { icon: "eye", name: "Visit", sub: "Lands on site", stage: 0, side: "customer", detail: "A visitor lands on a fast page from search, ads or a shared link." },
    { icon: "grid", name: "Browse", sub: "Picks an item", stage: 0, side: "customer", detail: "Products, cars or services laid out so the choice is easy on a phone." },
    { icon: "cart", name: "Order", sub: "Or books dates", stage: 0, side: "customer", detail: "An order form or booking dates, with only the fields that matter." },
    { icon: "card", name: "Pay", sub: "Or confirms", stage: 1, side: "customer", detail: "Payment details or a deposit, so the order is real." },
    { icon: "check", name: "Confirmed", sub: "Instant receipt", stage: 1, side: "customer", detail: "The customer gets a clear confirmation. No waiting for a reply." },
    { icon: "dash", name: "Dashboard", sub: "Order logged", stage: 2, side: "team", detail: "The order lands in one dashboard instead of five group chats." },
    { icon: "bell", name: "Notify", sub: "Team alerted", stage: 2, side: "team", detail: "Whoever handles it gets notified right away." },
    { icon: "box", name: "Fulfil", sub: "Status updated", stage: 2, side: "team", detail: "Prepared, released or delivered, with the status updated as it moves." },
    { icon: "chat", name: "Follow up", sub: "Comes back", stage: 2, side: "team", detail: "A follow-up message brings the customer back for the next one." },
  ],
};

// shot: screenshot in /public/work. full: full-page capture that scrolls on hover. big: wide card.
export const PROJECTS = [
  { name: "NEXFORA Reels", url: "https://www.instagram.com/reel/DfVpDlYAkeJ/", label: "AI automation · Daily", stack: ["Remotion", "React", "TypeScript", "Python", "Meta Graph API", "ElevenLabs", "Playwright"], shot: "/work/nexfora-reels.webp", big: true },
  { name: "Kuya King's", url: "https://www.kuyakings.com/", label: "Food brand · Ordering", stack: ["React", "Vite", "Tailwind CSS"], shot: "/work/kuya-kings.webp", full: "/work/kuya-kings-full.webp" },
  { name: "Nexfora OS", url: "https://nexfora-neon.vercel.app", label: "Web app · Next.js", stack: ["Next.js", "React", "Tailwind CSS"], shot: "/work/nexfora-os.webp" },
  { name: "Pure Grind", url: "https://pure-grind-website.vercel.app", label: "Product site", stack: ["React", "Vite", "Tailwind CSS"], shot: "/work/pure-grind.webp", full: "/work/pure-grind-full.webp" },
  { name: "Hoppin With Shawn's", url: "https://car-rental-pi-pearl.vercel.app/", label: "Car rental", stack: ["React", "Vite", "Tailwind CSS"], shot: "/work/hoppin.webp", full: "/work/hoppin-full.webp" },
  { name: "SYNQRO", url: "https://synqro.nexforatech.com/", label: "NFC card app", stack: ["Next.js", "React", "Tailwind CSS"], shot: "/work/synqro.webp" },
  { name: "Forge", url: "https://www.getforge.uk/", label: "Agency site", stack: ["React", "Vite", "Tailwind CSS"], shot: "/work/forge.webp", full: "/work/forge-full.webp" },
  { name: "Renta Motor Manila", url: "https://rentamotormanila.com/", label: "Rentals", stack: [], shot: "/work/renta-motor.webp" },
  { name: "BookBike", url: "https://bookbike.com.ph/", label: "Corporate", stack: ["WordPress", "Elementor"], shot: "/work/bookbike.webp" },
  { name: "NEXFORA", url: "https://www.nexforatech.com/", label: "Studio site", stack: ["Next.js", "React", "Tailwind CSS"], shot: "/work/nexfora.webp" },
  { name: "San Roque Parish", url: "", label: "In progress", stack: ["Next.js", "React"], shot: "/work/san-roque.webp" },
];

export const SERVICES = [
  { tag: "01 · Sells & books", stack: "React · Vite · Tailwind", title: "Business websites", text: "Fast sites for brands, rentals and services, with ordering or booking built in. Found on Google, easy on a phone." },
  { tag: "02 · Runs the work", stack: "Next.js · Dashboards", title: "Web apps & systems", text: "Dashboards, portals and internal tools that replace spreadsheets and group chats, like Nexfora OS." },
  { tag: "03 · Keeps it running", stack: "Hosting · Analytics", title: "Launch & care", text: "Domain, hosting, analytics and updates after launch, so the site keeps working as the business changes." },
];

// Toolkit: every tool lists the projects above that use it, so the proof is built in.
// `extra` names tools used on this portfolio itself.
export const TOOLKIT = [
  { name: "React", note: "Components and state for every modern build" },
  { name: "Next.js", note: "Web apps with routing and server rendering" },
  { name: "Vite", note: "Fast builds for marketing and product sites" },
  { name: "Tailwind CSS", note: "Design systems that stay consistent" },
  { name: "GSAP", note: "Scroll and motion design", extra: "This portfolio" },
  { name: "WordPress", note: "Sites clients can edit themselves" },
  { name: "TypeScript", note: "Typed React for larger codebases" },
  { name: "Remotion", note: "Videos rendered from React code" },
  { name: "Python", note: "Automation scripts and pipelines" },
  { name: "Meta Graph API", note: "Posting and comment replies on Facebook and Instagram" },
  { name: "ElevenLabs", note: "AI voiceovers in a cloned voice" },
  { name: "Playwright", note: "Rendering ad images in a real browser" },
];

// Case study: the stats are real counts from the project logs on `asOf`. Update them as it keeps running.
export const REELS = {
  kicker: "Case study · NEXFORA Reels",
  heading: ["Content that ", "posts itself."],
  intro: "An AI agent I built runs NEXFORA's social media unattended. Every day it writes, voices, renders and posts a reel and four photo ads, then answers keyword comments with the right offer.",
  stats: [{ value: "4", label: "Reels posted" }, { value: "20", label: "Photo ads posted" }, { value: "3", label: "Comments auto-answered" }],
  asOf: "Counts as of 6 Nov 2026",
  links: [
    { label: "Watch a reel on Instagram", url: "https://www.instagram.com/reel/DfVpDlYAkeJ/" },
    { label: "Watch on Facebook", url: "https://www.facebook.com/reel/1149262971376455/" },
  ],
  ads: [
    { src: "/work/reels-ad-web-trust.webp", alt: "Generated ad: Do customers think you're legit?" },
    { src: "/work/reels-ad-web-247.webp", alt: "Generated carousel cover in Taglish about websites that work while you sleep" },
    { src: "/work/reels-ad-whatwedo.webp", alt: "Generated ad listing NEXFORA services" },
  ],
  sides: [{ key: "content", label: "Content" }, { key: "community", label: "Community" }],
  board: ["Topic to ", "auto-reply"],
  foot: "Runs every day",
  stages: [
    { name: "Create", note: "Topic, script and voiceover are produced with nobody at the keyboard." },
    { name: "Publish", note: "The reel is rendered from code and posted to Facebook, Instagram and TikTok." },
    { name: "Engage", note: "Keyword comments get an instant reply with the right offer." },
  ],
  steps: [
    { icon: "bulb", name: "Topic", sub: "42 planned", stage: 0, side: "content", detail: "Picks the next unused topic and one of the approved offers." },
    { icon: "doc", name: "Script", sub: "Taglish, 5 lines", stage: 0, side: "content", detail: "Writes a five-line script under strict rules: no invented stats, no real brands." },
    { icon: "mic", name: "Voice", sub: "Cloned voice", stage: 0, side: "content", detail: "Voices each line in my cloned voice with ElevenLabs, then times it to the music." },
    { icon: "film", name: "Render", sub: "Remotion", stage: 1, side: "content", detail: "Renders the reel from React components with Remotion, scored with music and sound effects." },
    { icon: "send", name: "Post", sub: "FB · IG · TikTok", stage: 1, side: "content", detail: "Publishes Facebook and Instagram Reels through the Meta Graph API and sends a TikTok draft." },
    { icon: "chat", name: "Comment", sub: "Viewer replies", stage: 2, side: "community", detail: "A viewer comments a keyword like FOUND, FLOW or CHECKUP." },
    { icon: "search", name: "Match", sub: "Keyword found", stage: 2, side: "community", detail: "The agent scans new comments and matches the keyword to its offer." },
    { icon: "reply", name: "Reply", sub: "Offer link sent", stage: 2, side: "community", detail: "It replies with the free offer link and never answers the same person twice." },
    { icon: "dash", name: "Logged", sub: "Office dashboard", stage: 2, side: "community", detail: "Every run is logged to a virtual-office dashboard for review." },
  ],
};

// Contact form options live in src/validate.js (TYPES), shared with the server function.
