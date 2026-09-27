# CLAUDE.md

This file is the entry point for any AI coding agent (Claude Code, etc.) working in this repository. Read this first, then pull in the referenced docs below before making changes.

## Project

**Eklavya Jha — AI Engineer Portfolio**
Live site: https://eklavya.dpdns.org/
Repo: `EklavyajhaAI07/EklavyajhaAI07` — this repo doubles as both the GitHub profile README *and* the source of the live portfolio site (deployed via GitHub Pages, custom domain via `CNAME`).

- Stack: **static HTML / CSS / JS frontend** (no framework, no build step) + a small **Cloudflare Worker + D1** backend for dynamic content, fed by Telegram. See `docs/dynamic-content-pipeline.md` for the full design.
- Entry point: `index.html`, styled by `style.css`, behavior in `script.js`. Worker code lives in a separate `/worker` folder (new — not yet in the repo).
- External libs currently loaded: Three.js, GSAP + ScrollTrigger, Lenis (smooth scroll), Lucide icons, Font Awesome — several of these are flagged for removal/trimming, see improvement plan.
- Visual identity: dark "engineering console" theme, Syne + Outfit fonts, glow sphere, marquee text, custom cursor. **Preserve this aesthetic** — the problems are content and performance, not the design direction.

## Context to load before working

Load these in order. Together they are the full brief — don't start editing code from this file alone.

- @docs/content-source.md — the ONLY source of truth for real facts (projects, hackathons, skills, links, bio). Never invent an achievement, number, or project that isn't in here.
- @docs/audit.md — what's currently wrong with the live site and why.
- @docs/improvement-plan.md — the ordered, actionable task list with acceptance criteria. Work through this in priority order (P0 → P1 → P2 → P3) unless the user asks for something specific.
- @docs/design-guidelines.md — visual/UX rules to keep the site's identity intact while fixing it.
- @docs/dynamic-content-pipeline.md — the site is moving from static to a Telegram-driven content pipeline (Cloudflare Worker + D1). This SUPERSEDES the old "Task 1: content engine" approach in `improvement-plan.md` — build this instead of a hardcoded JS array/data.json.

## Ground rules

1. **Facts only from `content-source.md`.** If a task needs a fact that isn't there (a metric, a project detail, a testimonial), stop and ask the user — do not fabricate or embellish.
2. **Don't flatten the design.** Dark theme, distinctive type, and the smooth-scroll feel are intentional. Fix performance/accessibility without turning this into a generic template.
3. **No client-side "auth."** Never ship a login/admin gate on a static public site that only checks credentials in JS. If a content-editing workflow is wanted, ask the user before building one — the previous "Admin" login was flagged as a credibility risk.
4. **Static-first.** Prefer a plain JS array or a `data.json` file for editable content (projects/skills/stack) over introducing a database or backend, unless the user explicitly asks for a CMS.
5. **Confirm before deleting anything ambiguous** — if it's unclear whether something is intentional (e.g. a section, a script, a feature), ask rather than removing it.
6. **Verify, don't assume.** After any perf/SEO change, re-check with Lighthouse and a "view source with JS disabled" pass — both are cheap ways to catch regressions on a static site.

## Working style

- Work one task at a time from `improvement-plan.md`, in priority order.
- After finishing a task, state which acceptance criteria you checked and how.
- Keep commits/edits scoped to one task at a time so changes are easy to review.
- If a task turns out to need a decision only the user can make (domain purchase, whether Admin login is real, resume content), flag it and move to the next task rather than blocking.

## How to preview locally

No build step — just serve the folder statically, e.g.:
```
python3 -m http.server 8000
```
then open `http://localhost:8000`.
