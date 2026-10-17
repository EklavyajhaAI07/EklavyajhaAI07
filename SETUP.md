# 🚀 Setup — Eklavya's animated GitHub profile

> Historical GitHub Pages setup guide. The current Astro portfolio runs on Cloudflare Workers at `https://eklavya-jha-portfolio.eklavya.dpdns.org/`; see `Docs/deployment.md`. The instructions below do not describe the current deployment.

Everything is already baked with the real username (`EklavyajhaAI07`) and real links — **no placeholders to replace**. Total time: ~4 minutes.

## ⚠️ Read this first

When this GitHub Pages profile kit was written, the repository was associated with a site at `eklavya.dpdns.org`. That is a historical setup note, not the current deployment; the Astro portfolio now runs on the Cloudflare Worker listed above.
This kit was intended to **add** profile files and **replace README.md**. Do **NOT** treat these legacy instructions as a deployment guide for the current portfolio:

- `index.html` · `style.css` · `script.js` — legacy GitHub Pages site files
- `CNAME` — legacy GitHub Pages domain mapping
- `.gitignore` · `package-lock.json`

The historical guide's `eklavya.dpdns.org/assets/…` references do not describe the current Cloudflare-hosted Astro site.

## 1. Add the new files

In the existing repo `EklavyajhaAI07/EklavyajhaAI07` (branch `main`):

```bash
git clone https://github.com/EklavyajhaAI07/EklavyajhaAI07.git
cd EklavyajhaAI07
# copy from this kit:
#   README.md            → replaces the old one
#   assets/              → 5 animated SVGs
#   .github/workflows/snake.yml
git add README.md assets .github
git commit -m "feat: handcrafted animated profile (agentic edition)"
git push
```

Or via the web UI: **Add file → Upload files** — upload `README.md`, the whole `assets` folder, and the hidden `.github` folder (drag the folder itself so paths stay intact).

## 2. Wake up the snake 🐍

1. Repo → **Settings → Actions → General → Workflow permissions** → **Read and write permissions** → Save.
2. **Actions** tab → "Generate contribution snake" → **Run workflow**.
3. ~1 minute later an `output` branch appears with a **purple snake** — the README picks it up automatically.

## 3. Final touches

- [ ] **mdgen-ai & Viral AI links**: search README.md for `ADD LIVE + REPO LINKS` / `ADD REPO LINK` and drop in the real URLs.
- [ ] The stats/trophy cards use his **self-hosted instances** (`github-readme-stats-eklavyajha.vercel.app`, `github-profile-trophy-eklavyajha.vercel.app`) — kept from the old README so there are no rate limits. If those Vercel deployments ever go down, swap the domains to the public `github-readme-stats.vercel.app` / `github-profile-trophy.vercel.app`.
- [ ] **Pin repos**: CourtFlow-x-PUCODE3.0, Analysis-Agent-FinPB, FinPlay-Bharat, mdgen-ai.

## How the animations work (no JavaScript!)

GitHub READMEs strip all JS — everything here is **hand-coded animated SVG** (SMIL), rendered natively:

| File | What it does |
|------|--------------|
| `assets/header.svg` | Neural constellation with **traveling signal pulses** between nodes, indigo→violet→cyan gradient name with a sweeping shimmer, twin orbiting particles, rotating hexagons, scrolling skill ticker |
| `assets/agent-pipeline.svg` | **Animated system architecture**: IDEA → ORCHESTRATOR (rotating dashed ring) → RESEARCH / ARCHITECT / BUILDER / CRITIC → SHIP, with flowing dashed edges, traveling data dots, and nodes glowing in sequence |
| `assets/terminal.svg` | An agent console: types `python run_crew.py --goal "ship something great"` character-by-character, then agents print their status lines one by one — ending on MISSION COMPLETE and a blinking cursor |
| `assets/divider.svg` | Indigo + cyan comets racing along a synapse line with a pulsing hexagon node |
| `assets/footer.svg` | `deploy --next-idea` → drifting indigo/cyan waves |

These SVG colors match the palette documented when this GitHub profile kit was written (`--accent: #6366f1`, `--secondary: #06b6d4`). They are README assets and do not control the current Astro site's styling. Want to tweak text or colors? They're plain SVG files — open in any editor.
