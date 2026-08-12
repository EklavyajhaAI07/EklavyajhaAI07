# 🚀 Setup — Eklavya's animated GitHub profile

Everything is already baked with the real username (`EklavyajhaAI07`) and real links — **no placeholders to replace**. Total time: ~4 minutes.

## ⚠️ Read this first

The repo `EklavyajhaAI07/EklavyajhaAI07` is **also the live portfolio site** (GitHub Pages → eklavya.dpdns.org).
This kit only **adds** files and **replaces README.md**. Do **NOT** delete or modify:

- `index.html` · `style.css` · `script.js` — the live site
- `CNAME` — the custom domain mapping
- `.gitignore` · `package-lock.json`

The new `assets/` folder will also be publicly served at `eklavya.dpdns.org/assets/…` — harmless (they're just SVGs), and the site is untouched.

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

All colors come straight from the portfolio site's own palette (`--accent: #6366f1`, `--secondary: #06b6d4`) so the README and eklavya.dpdns.org feel like one brand. Want to tweak text or colors? They're plain SVG files — open in any editor.
