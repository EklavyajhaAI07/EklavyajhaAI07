# CLAUDE.md — Eklavya Jha · Personal Portfolio

> Rules and structure for the coding agent. Read fully before starting any task.
> **`content-brief.md` (FINAL v5) is the centre of this project.** It is the single source of truth for every fact, decision and proof. If any file disagrees with it, the brief wins.

### File index and precedence
| Priority | File | Owns |
|---|---|---|
| 1 | `content-brief.md` | All facts about Eklavya, decisions, proofs, connect details, what is excluded |
| 2 | `CLAUDE.md` (this file) | Rules, site structure, behaviour, phases |
| 3 | `copy-deck.md` | Headlines, hero copy, CTAs, end-card lines (first option in each slot is the default; the brief overrides any line that conflicts) |
| 4 | `brand.md`, `animation-spec.md`, `tech-stack.md` | Look, motion, technology |
| 4 | `page-specs.md`, `content-schema.md`, `seo.md`, `connect-and-forms.md`, `deployment.md`, `qa-checklist.md` | Page layouts, data structure, search rules, connect and form, hosting, testing |
| 5 | `reels-spec.md` | Phase 2 only: 15-second reels |
| - | `portfolio-README.md` | Becomes `README.md` inside the new private portfolio repo (how to run, deploy, add content) |
| - | `README.md` (profile) | The GitHub profile README in the public profile repo; not part of the site build |

---

## 1. Global rules (apply to every task, always)

1. **Facts come from `content-brief.md`, never from guessing.** Any fact about Eklavya (identity, photo, education, programs, projects, numbers, certificates, achievements, hard-work proof, links, contact details, testimonials, tags) must be taken from the brief. If a fact you need is missing from the brief, ASK him in chat before writing it. Do not ask him to fill or edit the brief; it is final.
2. **No invented facts.** Never use placeholder facts as if they were real. If something is missing or contradicts the brief, stop and ask. Continue only after he answers.
3. **Unclear product or design decision?** Ask what he is thinking and what he wants. No false guesses.
4. **Phone number: never** appear anywhere on the site, in code, in meta tags or in structured data.
5. **All proof must be real and verifiable** (numbers, claims, links, demos, screenshots).
6. **Free and lightweight first.** Ask before adding any paid service or credit-consuming tool.
7. **Content never lives in code.** See section 8.
8. **Only the projects listed in `content-brief.md` section 5 may appear.** Anything else found on GitHub, his old site or `data.md` is excluded.
9. **Honest labels:** a planned feature is "Coming soon", never live; a project in progress is "In development"; the two demo websites are "Demo templates", never client work; a participation is "Participant", never a result. Never use the 47 team number as a rank.
10. **Title:** he is an "AI-Powered Full Stack Developer, learning AI Engineering". Never call him "AI Engineer".

---

## 2. Goal and audiences

A personal portfolio that wins work and opportunities from three audiences. Each audience gets its own dedicated page with its own animation, cards, details and projects.

| Audience | Page | Wants to know |
|---|---|---|
| Recruiters / HR | Recruiter / HR | Can he do the job? Fast proof, resume |
| Tech leads, communities, clubs, event management firms | Teams & Communities | Can he build, lead and collaborate? |
| People hiring freelancers/developers for their products | Clients | Will he solve my problem and deliver? |

---

## 3. Site map (locked)

```
/                      Home: for web searchers and normal visitors
/<recruiter-slug>/     Recruiter / HR page
/<teams-slug>/         Teams & Communities page
/<clients-slug>/       Clients page
```

- **Slugs:** the coding agent chooses clean, lowercase, descriptive slugs (e.g. `/recruiter-hr/`). Keep them stable once chosen.
- **Home page contains ONLY:** (1) three audience cards, (2) the connect section below them. No intro, no about section.
- Eklavya sends a hirer the specific page URL directly, so every dedicated page must work as a standalone landing page.
- **Content isolation:** projects, details, animation and cards on a page exist ONLY on that page. Nothing meant for one audience appears on another audience's page.
- A visitor moves to the other pages only after the current page's animation has been seen.

---

## 4. Page load behavior

1. **Static content renders first** (identity, text, SEO content) so the page is ready the moment the URL opens and fully readable by search engines.
2. The **animation runs on top as an enhancement**, once (no endless loop), about **25 seconds**.
3. Always provide **Skip** and **Replay**. Respect `prefers-reduced-motion` (show the final state, no motion).
4. After the animation, scrolling down shows that page's dedicated projects and cards.
5. **Mobile-first.** The animation must never block content or the main CTA.
6. Animation assets load after the critical content (cards, text, CTA).

---

## 5. Animation system (approved)

### 5.1 Engine
- One **master timeline per page**, driven by a single time value `t` (seconds), so play, pause, seek, skip, replay and rewind are all simple and consistent. GSAP's master timeline or an equivalent is acceptable; the choice of library: **ASK** if unsure. GSAP or Framer Motion preferred (free).
- **DOM/SVG only. No `<canvas>`.** Canvas text is invisible to Google, and this site must be indexed.
- Animation is data-driven: it reads names, stats, projects and tools from the page's data file (section 8), never hardcoded.

### 5.2 Stages (same skeleton on all three pages, customized content per page)

| Stage | Time | Content | Motion |
|---|---|---|---|
| 1. Identity | 0-5s | Initials/logo mark, name, role line, profession tags, college name and details, professional photo | Mark animates in, name and role type word by word with key words in the accent colour, tags pop in one by one, photo slides in |
| 2. Proof of work | 5-15s | Real stats, systems he built, backend work, project cards, tools | Stat cards count up, project cards slide in one at a time with a soft blur (real screenshots), architecture diagram draws itself (SVG), tools appear as pills flying past |
| 3. Hard work | 15-21s | Learning and building journey | Timeline moves left to right |
| 4. Action | 21-25s | Click-to-action | Pulsing CTA, end card with connect options, then a sticky CTA bar stays on the page |

### 5.3 Per-page focus (copy: `copy-deck.md`; facts: `content-brief.md`)

| | Recruiter / HR | Teams & Communities | Clients |
|---|---|---|---|
| Stage 2 focus | Skills, stack, projects | Architecture, teamwork, events | Vasudha case study (live client system), plus Viral AI |
| Connect CTA | Resume download (primary), click-to-mail or LinkedIn | Connect to collaborate: LinkedIn, Discord, click-to-mail, contact form | Contact form (primary), Instagram (secondary). No call booking. |

### 5.4 Sound
- **Muted by default.** Provide an optional sound toggle.
- If sound is enabled: Web Audio API only (soft beat, light whooshes on scene changes), no audio files.
- Sound never autoplays.

---

## 6. Design system (approved)

- **Animation stage:** dark. Charcoal background, off-white text.
- **Sections below the animation (cards, projects, details):** light.
- **Accent:** one colour only, electric blue. Exact tokens are decided in `brand.md`.
- **Font:** Inter.
- Strong contrast and accessible text sizes (WCAG AA minimum).
- Use design tokens (CSS variables) for colour, spacing and type so the look can change in one place.
- Project cards use **real screenshots**, not mock-ups. The agent may capture them from live demos with private data removed (see `content-brief.md` section 5.4). Optimize them (WebP, responsive sizes, lazy loading below the fold).
- Status badges on cards: Live, In development, Coming soon, Demo template, Finalist, Participant (see `brand.md`).

---

## 7. Cards

Card types available (which projects go on which page is decided in `content-brief.md` section 5.3):
- Project card: name, one-line outcome, tech, role, Live / GitHub / Case study links
- Case-study card: problem → solution → result (Clients page)
- Skill card: grouped by category (Frontend, Backend, Database, DevOps)
- Tech-stack strip
- Stat card (real numbers only)
- Timeline card
- Certificate card
- Process card (Clients page)
- Availability card
- Testimonial card

---

## 8. Content must be data-driven (future updates in 2027-28 and beyond)

- Keep ALL content (projects, skills, certificates, timeline, stats, testimonials, tags, copy) in **separate data files** (JSON or Markdown), organized per audience page. Never hardcode content in components.
- Cards and the animation are generated from those data files.
- Adding a new project or skill must **never require code changes**: Eklavya adds one entry to the data file, pushes to GitHub, and the host redeploys automatically.
- Write a `README.md` that documents exactly how to add a project, skill, certificate or timeline entry for each page, with copy-paste examples.

---

## 9. Connect section (finalized)

Exact values: `content-brief.md` section 12.
- **Email:** never displayed as text. A "Click to mail" action button only; the address is assembled on click and never appears in visible text, markup or structured data.
- **LinkedIn, GitHub, X** as buttons. **Discord** as a "Copy Discord username" button (no profile URL exists).
- **Instagram:** Clients page only (businesses hiring for contract work).
- **Contact form** with an audience dropdown prefilled from the page the visitor came from.
- **No WhatsApp. No Telegram. No phone number. No call-booking link. No reply-time line.**
- Forms must have spam protection and a clear success state.

---

## 10. SEO (all pages indexed)

- Home and all three dedicated pages must be **indexable** by Google.
- Unique `<title>`, meta description and Open Graph image per page, so shared links look good on LinkedIn and messaging apps.
- `Person` structured data (JSON-LD), `sitemap.xml`, `robots.txt`, clean semantic HTML with proper heading order.
- SEO content (name, profession, college, location) comes only from `content-brief.md`. No email or phone number in structured data. Never "AI Engineer" in titles or descriptions.
- Core Web Vitals: fast load, no layout shift from the animation.

---

## 11. Shareable reels (Phase 2, approved)

- Each audience page can export a **15-second reel** (Recruiter, Teams, Clients) from the **same timeline and the same data files**, for LinkedIn, resume links, DMs and email.
- Reel timing guideline: 0-3s identity, 3-9s proof, 9-12s tools and hard work, 12-15s CTA. Final timing is set when Phase 2 starts.
- Reel mode must not create duplicate indexable URLs (use a canonical tag pointing to the main page).
- Export workflow (record to WebM/MP4) to be agreed with Eklavya before building.
- Build reels only after the three pages are live.

---

## 12. Quality bar

- Accessibility: keyboard navigation, focus states, alt text, reduced-motion support.
- Performance: fast first paint, small bundles, lazy-load heavy assets.
- Responsive: phone first, then tablet and desktop.
- No console errors. Test every audience page by opening its URL directly.
- Never ship invented content.

---

## 13. Build phases

1. **Phase 1:** site foundation, data files, home page, three dedicated pages with animation, connect section, SEO.
2. **Phase 2:** shareable 15-second reels.
3. **Ongoing:** add projects/skills through the data files.

---

## 14. Open decisions

Everything about Eklavya's content, positioning, proofs, links and copy is **decided** in `content-brief.md` and `copy-deck.md`. What is still open is technical and is handled in `tech-stack.md`:
- Framework, animation library, hosting, domain, analytics tool, form service, repository name and visibility.

Page slugs are the agent's choice. The agent proposes the stack options and gets Eklavya's approval in chat before scaffolding anything.