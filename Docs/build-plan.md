# Eklavya Jha Portfolio — Phase 1 Build Plan

> Built from all 14 Docs files. Every decision here traces back to them.
> Rules in force: `CLAUDE.md §1`. Source of truth: `content-brief.md FINAL v5`.

---

## Stack (all decisions locked)

| Layer | Choice | Reason |
|---|---|---|
| Framework | **Astro** (static generation) | Lightest possible; ships near-zero JS; static HTML at load time for SEO; file-based routes; push-to-deploy |
| Language | TypeScript | Type safety, schema validation at build time |
| Animation | **GSAP** (free tier) | Master timeline with `play/pause/seek/restart/skip`; deterministic for Phase 2 reels; DOM + SVG only (no `<canvas>`) |
| Styling | Vanilla CSS + CSS variables | `brand.md` tokens, no framework lock-in |
| Font | Inter, self-hosted WOFF2 | `brand.md §4`; `font-display: swap`; no render-blocking external sheet |
| Contact form | **Web3Forms** (free, 250/month) | Zero-code HTML form; no server function needed for delivery |
| Spam protection | Honeypot + time-trap + Cloudflare Turnstile | `connect-and-forms.md §5` |
| Hosting | **Cloudflare Pages** (free) | Static + Pages Functions for the contact endpoint; auto-deploy from GitHub |
| Domain | `eklavya.dpdns.org` (keep existing) | `deployment.md §1` |
| Analytics | **Umami Cloud, Hobby** (free) | `deployment.md §10`; no cookies; 100k events/month |
| Repo | Existing GitHub repo, `rebuild` branch | `deployment.md §5`; `main` stays live until cutover |

---

## Repo & folder structure

Derived from `content-schema.md §2`, `tech-stack.md §4`, `assets-checklist.md §2`, `deployment.md §7`.

```
eklavyajhaAI07/
|
+-- .env.example             (committed — empty values only)
+-- .gitignore               (must include: private-proofs/, data.md, .env, .env.local, .dev.vars, reels-out/)
+-- Docs/                    (spec files — unchanged)
+-- content/                 (ALL editable content; no code changes needed to add items)
|   +-- site.json
|   +-- identity.json
|   +-- education.json
|   +-- programs.json
|   +-- skills.json
|   +-- hackathons.json
|   +-- community.json
|   +-- stats.json
|   +-- journey.json
|   +-- connect.json         (NO email address inside this file)
|   +-- projects/
|   |   +-- vasudha-manager.json
|   |   +-- dealflow360.json
|   |   +-- viral-content-ai.json
|   |   +-- courtflow-ai.json
|   |   +-- citemind.json
|   |   +-- aegis.json
|   |   +-- demo-sahi-gulab-jamun.json
|   |   +-- demo-eklavya-tuition.json
|   +-- pages/
|   |   +-- home.json
|   |   +-- recruiter.json
|   |   +-- teams.json
|   |   +-- clients.json
|   +-- copy/
|       +-- copy-deck.json   (mirrors copy-deck.md; first option is default)
|
+-- src/
|   +-- layouts/
|   |   +-- Base.astro       (head, SEO meta, JSON-LD, fonts, Umami)
|   +-- pages/
|   |   +-- index.astro      (Home)
|   |   +-- recruiter-hr/index.astro
|   |   +-- teams-communities/index.astro
|   |   +-- clients/index.astro
|   +-- components/
|   |   +-- animation/
|   |   |   +-- AnimationStage.astro
|   |   |   +-- AnimationControls.astro
|   |   |   +-- timeline/
|   |   |       +-- stage-identity.ts
|   |   |       +-- stage-proof.ts
|   |   |       +-- stage-journey.ts
|   |   |       +-- stage-action.ts
|   |   |       +-- master-timeline.ts
|   |   +-- cards/
|   |   |   +-- ProjectCard.astro
|   |   |   +-- CaseStudyCard.astro
|   |   |   +-- SkillCard.astro
|   |   |   +-- HackathonRow.astro
|   |   |   +-- TimelineCard.astro
|   |   |   +-- StatCard.astro
|   |   |   +-- StatusBadge.astro
|   |   +-- connect/
|   |   |   +-- ConnectBlock.astro
|   |   |   +-- ContactForm.astro
|   |   |   +-- DiscordCopy.astro
|   |   +-- layout/
|   |   |   +-- Header.astro
|   |   |   +-- Footer.astro
|   |   |   +-- StickyCtaBar.astro
|   |   +-- home/
|   |       +-- AudienceCard.astro
|   +-- styles/
|   |   +-- tokens.css       (all CSS variables from brand.md §3)
|   |   +-- base.css         (reset, fluid type scale with clamp())
|   |   +-- animations.css   (stage height reserved; prefers-reduced-motion)
|   +-- lib/
|       +-- content.ts       (type-safe JSON loaders)
|       +-- schema.ts        (Zod; build fails on violations)
|       +-- forbidden.ts     (scans content + built HTML for forbidden patterns)
|
+-- public/
|   +-- assets/
|   |   +-- eklavya-photo.png
|   |   +-- projects/
|   |   |   +-- vasudha-manager/
|   |   |   +-- dealflow360/
|   |   |   +-- viral-content-ai/
|   |   +-- og/
|   |   +-- brand/
|   +-- Eklavya-Jha-Resume.pdf
|
+-- private-proofs/          (NOT published; in .gitignore)
|   +-- ecell-iitb-campus-ambassador-offer-letter.png
|   +-- bharatiya-antariksh-certificate.png
|
+-- functions/api/contact.ts (Cloudflare Pages Function)
+-- scripts/check-forbidden.mjs
+-- scripts/export-reel.mjs  (Phase 2 only)
+-- .github/workflows/ci.yml
+-- astro.config.mjs
+-- tsconfig.json
+-- package.json
+-- README.md
+-- robots.txt
+-- sitemap.xml
```

---

## 13-Step Build Order

1.  **Branch & Repo Hygiene:** `rebuild` branch, `.gitignore` updates.
2.  **Project Scaffold:** Astro, TypeScript, minimal template.
3.  **Design System:** CSS variables, typography, font self-hosting.
4.  **Content Data Files:** All 12 JSON data files populated, Zod schema validation.
5.  **Logo/Initials Mark:** Generate options, select one.
6.  **Base Layout & Shared Components:** Header, Footer, Cards, Form, Connect.
7.  **Home Page (`/`)**: 3 audience cards + connect section.
8.  **25-second GSAP Animation System:** 4 stages (Identity, Proof, Journey, Action).
9.  **Three Dedicated Pages:** `/recruiter-hr/`, `/teams-communities/`, `/clients/`.
10. **Assets:** Move photo/proofs, capture screenshots, draft resume.
11. **SEO:** Titles, descriptions, Open Graph, JSON-LD, sitemap, `check-forbidden.mjs`.
12. **Contact Form Wiring:** Web3Forms + Turnstile + Cloudflare Pages Function.
13. **CI & Deployment:** GitHub Actions, Cloudflare Pages integration.
