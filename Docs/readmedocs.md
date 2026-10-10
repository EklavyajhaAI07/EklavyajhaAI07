# Eklavya Jha: Portfolio

Personal portfolio site: a home page with three audience cards, and three dedicated pages (Recruiter / HR, Teams & Communities, Clients), each with its own 25-second animation, cards and projects.

> **Rename this file to `README.md` inside the new private portfolio repo.** The GitHub profile README (public profile repo) is a different file.
> Source of truth for every fact: `docs/content-brief.md`. Rules: `docs/CLAUDE.md`. If anything here disagrees with the brief, the brief wins.

## 1. Where things are

| Path | What it holds |
|---|---|
| `docs/` | The spec files (`CLAUDE.md`, `content-brief.md`, `copy-deck.md`, `brand.md`, `animation-spec.md`, `page-specs.md`, `content-schema.md`, `seo.md`, `connect-and-forms.md`, `deployment.md`, `qa-checklist.md`, `tech-stack.md`, `reels-spec.md`) |
| `content/` | **All site content** as data files (`content-schema.md`). Edit these, not the code. |
| `src/` | Pages, components, animation timelines, styles |
| `public/` | Published assets: optimized images, resume PDF, favicons, OG images |
| `private-proofs/` | Proof images (offer letter, certificates). **Outside `public/`, never deployed.** |
| `scripts/` | Content validation, forbidden-pattern scan, reel export |

## 2. Run it locally
The framework is decided in `docs/tech-stack.md`. **The agent fills this section with the exact install, dev, build and preview commands once the framework is chosen.** Until then, do not guess commands.

## 3. Add or change content (no code changes)
All steps: edit or add a file in `content/`, run the content check, commit, push. The host redeploys automatically. Open the live page afterwards.

**New project**
1. Copy any file in `content/projects/` to `content/projects/<new-id>.json`.
2. Fill every required field. Set `status` honestly: `live`, `in-development`, `coming-soon` or `demo-template`.
3. Set `showOn` (which audience pages) and, only if it should appear in the animation, `featured: true` (max 4 per page).
4. Add real screenshots under `public/assets/projects/<new-id>/` with alt text. Add a `repo` link only if a public repo exists.
5. Add it to the pages' lists in `content/pages/*.json` if you want a specific order.

**New skill:** add an entry to `content/skills.json` with a real `proofProject`. Level is `learning`, `working` or `strong` (never a percentage).

**New hackathon, certificate or award:** add an entry to `content/hackathons.json`, `content/programs.json` or `content/community.json`. Finalist entries need a `proof`. Result is only `finalist` or `participant`.

**New milestone:** add a line to `content/journey.json`.

**A planned feature goes live** (for example Vasudha's double-entry bookkeeping): move that item out of the project's `roadmap` into its live description. Only change this when it is really live.

**Edit copy:** `content/copy/copy-deck.json` (mirrors `docs/copy-deck.md`).

## 4. Rules the build enforces
The build fails if any of these are broken (`content-schema.md` section 5):
- a required field is missing, or an id or reference is invalid
- more than 4 featured projects or more than 3 stats on a page
- a skill has no proof project, or a finalist entry has no proof
- a phone number, a plain-text email address, "WhatsApp" or "Telegram" appears
- "AI Engineer" is used as his title (the phrase "Learning AI Engineering" is fine)
- a demo template is described as client work

The email address is never stored in content files. It is set as a secret in the host (`CONTACT_TO_EMAIL`).

## 5. Deploy
Full steps in `docs/deployment.md`. In short: push to `main` of this private repo, Cloudflare builds and deploys, and every other branch gets a preview address. Secrets (names only here): `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET`, `CONTACT_TO_EMAIL`, the email provider key, `UMAMI_WEBSITE_ID`. Copy `.env.example` for local work; never commit real values.

## 6. Check quality
Before every launch or big change, run through `docs/qa-checklist.md`. After every deploy, do the 3-minute live check in its section 11.

## 7. Reels (Phase 2)
After all pages are live, `docs/reels-spec.md` describes the 15-second reels exported from the same data. Output goes to `reels-out/` (git-ignored).

## 8. Things that must never happen
- No phone number, WhatsApp or Telegram anywhere. The email is never shown as text.
- No project that is not in `content/projects/`.
- No planned feature shown as live, no demo shown as client work, no rank.
- No proof file inside `public/`.