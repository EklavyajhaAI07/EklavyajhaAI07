# tech-stack.md — Technology Decisions

> Read together with `CLAUDE.md`. Global rules there apply here. Facts and decisions about Eklavya and the site content: `content-brief.md` (FINAL v5, it wins on any conflict).
> **Nothing in section 3 is final.** Eklavya has not approved a stack yet. The agent must present the options and get his approval BEFORE installing or scaffolding anything.
> Tags: **LOCKED** = approved · **PROPOSED** = needs his approval · **ASK** = must ask, never assume.

---

## 1. Requirements the stack must satisfy (LOCKED)
1. **All four pages indexable by Google** (home plus three dedicated pages). Content must be in the HTML at load time (static generation or server rendering), not only built by client-side JavaScript.
2. **Per-audience dedicated routes** that open directly from a shared URL.
3. **Animation as an enhancement** on top of already rendered content. DOM and SVG, no `<canvas>`.
4. **Content in data files**, not in code. Adding a project, skill or certificate must need no code change.
5. **Push-to-deploy:** push to GitHub and the site redeploys automatically.
6. **Free and lightweight first.** Ask before adding any paid service or credit-consuming tool.
7. Fast, mobile-first, accessible.
8. Easy for Eklavya to maintain alone in 2027-28 and beyond.
9. **No phone number** anywhere (code, meta, structured data).

## 2. Decision principles
- Choose the simplest tool that meets section 1.
- Prefer technology Eklavya can maintain himself. His existing experience should weigh in the choice (**ASK** what he is comfortable with).
- Fewer dependencies, smaller bundles, no vendor lock-in for content.
- Every external service must have a free tier that is enough for a portfolio. Verify current free-tier limits and terms before depending on them, especially whether a portfolio used to attract paid freelance work is allowed on the free plan.

## 3. Proposed stack (PROPOSED, pending approval)

### 3.1 Framework
| Option | Why | Trade-off |
|---|---|---|
| **A. Next.js (React) with static generation** | React-based, static HTML for SEO, file-based routes for the three audience pages, large ecosystem | Heavier than needed for a mostly static site |
| **B. Astro** | Ships very little JavaScript, excellent for content-heavy SEO sites, animation can be loaded as isolated islands | Different mental model if he wants to stay fully in React |

**Suggested default:** Option A if Eklavya wants to stay in React, Option B if he prefers the lightest possible site. **Decision: ASK.**

### 3.2 Language and quality
- TypeScript (**PROPOSED**), ESLint and Prettier.
- Data validation: content files are validated against a schema at build time, so a malformed entry fails the build instead of breaking the page (**PROPOSED**).

### 3.3 Styling
- CSS variables for the design tokens in `brand.md`.
- Utility CSS (such as Tailwind) or plain CSS modules. **ASK** which he prefers.
- Self-hosted or framework-optimized Inter font (no render-blocking font stylesheet).

### 3.4 Animation
- GSAP or Framer Motion (both free). One master timeline per page, DOM and SVG only, as defined in `animation-spec.md`.
- Final library choice: **ASK** or present a short comparison and let him choose.

### 3.5 Content
- JSON or Markdown/MDX files, one set per audience page, plus shared files where content is genuinely shared (identity, links).
- Structure to be defined in `content-schema.md` (to be drafted).
- Optional later: a free headless CMS if he wants a browser form instead of editing files. Not needed for launch.

### 3.6 Forms and connect actions (details in `connect-and-forms.md`, to be drafted)
- Contact form: a free form service or small serverless function, with spam protection (honeypot or CAPTCHA). Audience dropdown prefilled from the page. It delivers to Eklavya's email without exposing the address in the page.
- Email is a click-to-mail action button only; the address is never shown as text and not placed in plain markup or structured data.
- Discord is a "Copy Discord username" button. LinkedIn, GitHub, X and (Clients page only) Instagram are plain links.
- No call-booking tool (decided: skipped). No WhatsApp or Telegram.
- Form service: **ASK** (agent proposes free options).

### 3.7 Hosting, domain, deployment
- Candidate hosts with free tiers: Vercel, Netlify, Cloudflare Pages. **Verify each plan's free-tier terms for this use case before choosing.** Final choice: **ASK**.
- Auto-deploy from a GitHub repository (main branch to production, pull requests to previews).
- Custom domain: needed or not, name, and budget: **ASK**. Domain purchase is a paid item and requires his approval.
- HTTPS enforced, `www` and non-`www` redirect rules defined.

### 3.8 Analytics
- Goal: see which audience page gets visits and which CTA gets clicked.
- Options: the host's built-in analytics, a privacy-friendly tool, or Google Analytics. **ASK**, and respect cookie/consent rules for the chosen tool.
- Track events: page view per audience, CTA clicks, resume downloads, form submissions, Skip/Replay usage.

### 3.9 SEO tooling
- Per-page metadata and Open Graph images, `Person` JSON-LD, `sitemap.xml`, `robots.txt`.
- Google Search Console verification after launch.

### 3.10 Testing and quality gates (PROPOSED)
- Lighthouse (performance, accessibility, SEO) on every page.
- Automated accessibility check (axe or equivalent).
- Link checker for all external links.
- Manual device test: phone, tablet, desktop; each audience URL opened directly.
- CI runs lint, type-check, schema validation and build before deploy.

## 4. Repository structure (PROPOSED)
```
/content        data files per audience page + shared identity/links
/src            pages/routes, components, animation timelines, styles
/public         images (optimized), resume PDF, favicons, OG images
/docs           these spec files (CLAUDE.md, brand.md, animation-spec.md, ...)
README.md       how to run, deploy, and add a project/skill/certificate
```
Exact layout depends on the chosen framework.

## 5. Security and privacy
- No secrets in the repository. Use environment variables for any form or analytics keys.
- Do not expose a phone number or any private data in code, metadata or structured data.
- Spam protection on forms. Validate input server-side if a function is used.
- Minimal third-party scripts, each justified and loaded after critical content.

## 6. Performance budget (PROPOSED)
- Largest Contentful Paint under 2.5s on a mid-range phone over a mid-speed connection.
- Minimal layout shift. Responsive WebP/AVIF images, lazy-loaded below the fold.
- Animation code loaded after the main content.
- Lighthouse score of 90 or more on performance, accessibility, best practices and SEO for each page.

## 7. Approval needed before any setup (ASK Eklavya)
1. Framework: Next.js (React) or Astro?
2. Comfort level: what is he comfortable maintaining? React, TypeScript, Tailwind, Markdown?
3. Animation library: GSAP or Framer Motion?
4. Hosting provider (after verifying free-tier terms)?
5. Custom domain: yes or no, name, budget?
6. Analytics tool?
7. Form service? (call booking is out of scope)
8. GitHub: new repository name and visibility?

The agent must not scaffold the project until questions 1-4 are answered.

**Update:** `deployment.md` now proposes answers for 4 (Cloudflare Workers with static assets), 5 (keep `eklavya.dpdns.org`), 6 (Umami Cloud Hobby) and 8 (a new private portfolio repo; the profile repo stays public). Questions 1, 2, 3 and 7 are still open (7 is the email-sending provider, see `connect-and-forms.md` section 6).