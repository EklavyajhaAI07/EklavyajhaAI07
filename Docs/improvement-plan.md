# Improvement Plan

Ordered task list. Work top to bottom unless the user directs otherwise. Each task lists what to do and how to know it's done. Use `content-source.md` for every fact; never invent one.

## P0 — Do first

### Task 1: Build the dynamic content pipeline (Telegram → Cloudflare Worker → D1)
**Supersedes the old "static data.json" plan.** Follow `docs/dynamic-content-pipeline.md` in full — it has the schema, Telegram command format, Worker structure, and build order. Summary:
- Stand up D1 database + `entries` table.
- Deploy a Cloudflare Worker that receives Telegram webhook messages, validates sender against a whitelisted `chat_id`, parses `/add | /edit | /delete | /list` commands, writes to D1.
- Expose `GET /api/entries` (public, read-only, CORS-scoped to the site's domain).
- Update `script.js` to fetch from this endpoint instead of any hardcoded array, with a small static "last known good" fallback array for when the fetch fails.
- Backfill real starting data by sending `/add` commands for everything already listed in `content-source.md`.
- **Acceptance:** sending a Telegram `/add` message results in a new card appearing on the live site within seconds, with zero code edits or redeploys. Page source (JS disabled or fetch failing) still shows non-empty fallback content — the original empty-sections bug must not reappear even in a Worker-downtime scenario.

### Task 2: Remove the Admin login — replaced by Telegram as the only write path
- This is now a direct consequence of Task 1, not a separate decision: once the Worker's `/api/entries` is read-only and all writes happen via the Telegram-whitelist check, the public "Admin" login nav item, modal HTML, and related JS should be deleted outright.
- **Acceptance:** no login UI of any kind exists on the public site; the only way to add/edit/remove content is via Telegram.

### Task 3: Rewrite hero/about copy with specifics
- Replace generic AI buzzword copy with 2–3 sentences that use real facts from `content-source.md` (e.g. Odoo Hackathon Grand Finale Finalist, multi-agent systems shipped with real users, IIT Bombay E-Cell role).
- **Acceptance:** every claim in the new copy traces back to a line in `content-source.md`.

## P1 — Do next

### Task 4: Clean up `<head>`
- Remove the Impact.com affiliate script (`utt.impactcdn.com`) unless the user says it's intentional.
- Move `<meta charset="UTF-8">` to the first line inside `<head>`.
- Pin the Lucide script to a specific version instead of `@latest`.
- **Acceptance:** `<head>` has no unexplained third-party scripts; charset is first; all script versions are pinned.

### Task 5: Cut JS/CSS payload
- Check if Three.js is actually rendering anything visible (the glow sphere may be pure CSS) — remove if unused.
- Replace full Font Awesome with only the icons in use, or consolidate onto Lucide (already loaded) to avoid two icon systems.
- Defer/async non-critical scripts so they don't block first paint.
- **Acceptance:** run Lighthouse/PageSpeed before and after; target mobile Performance score 90+.

### Task 6: Self-host images
- Move hero photo, OG image, and favicon from `i.postimg.cc` into `/assets/`, compressed, served as WebP with a fallback.
- Update all `<img src>` and `og:image` references.
- **Acceptance:** no remaining references to `postimg.cc` in the codebase.

### Task 7: Accessibility pass
- Add `aria-label` to icon-only social links.
- Wrap custom-cursor JS in a `prefers-reduced-motion` check; verify Tab-key navigation works without the custom cursor.
- Add a visually-hidden skip-to-content link before the header.
- Check text contrast against WCAG AA for muted text colors.
- **Acceptance:** keyboard-only pass through the whole page works; no unlabeled interactive elements.

### Task 8: Structured data + basic SEO files
- Add JSON-LD `Person` schema (name, jobTitle, url, sameAs → LinkedIn/GitHub/Instagram).
- Add a minimal `robots.txt` and `sitemap.xml`.
- **Acceptance:** schema validates in Google's Rich Results Test; both files resolve at the site root.

## P2 — Then

### Task 9: Resume + direct contact
- Add a "Download Resume" button once the user supplies a PDF (do not fabricate one).
- Add a direct `mailto:eklavyaprivate22@gmail.com` link alongside the existing LinkedIn CTA.
- **Acceptance:** resume link works if provided; email link opens a mail client correctly.

### Task 10: Proof/metrics strip
- Add a compact stats section using only the callouts listed in `content-source.md` ("Grand Finale Finalist — Odoo Hackathon 2026," "50+ users onboarded — mdgen-ai," "7-agent CrewAI system shipped — Viral AI").
- **Acceptance:** every number shown has a matching line in `content-source.md`.

## P3 — User decision, no code yet

### Task 11: Domain upgrade
- Flag to the user that moving from `eklavya.dpdns.org` to a paid `.dev`/`.me`/`.com` domain would read more professionally, and that the current CNAME/GitHub Pages setup makes the swap low-effort whenever they're ready. Do not purchase or configure anything without explicit go-ahead.

---

## Verification checklist (run after P0 and after P1)
- [ ] Lighthouse: Performance, Accessibility, SEO, Best Practices all checked
- [ ] View page source with JS disabled — content is meaningful, not empty
- [ ] Keyboard-only navigation through the whole page
- [ ] No console errors in browser dev tools
- [ ] All links (project repos, social, email) resolve correctly
- [ ] Telegram `/add`, `/edit`, `/delete`, `/list` all tested end-to-end and reflected on the live site
- [ ] Non-whitelisted Telegram sender is silently ignored (no write, no reply) — security check for Task 1
