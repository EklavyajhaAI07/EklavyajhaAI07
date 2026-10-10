# reels-spec.md — 15-Second Shareable Reels (Phase 2)

> Read with `animation-spec.md` sections 3 and 11, `CLAUDE.md` section 11, `seo.md` section 2, `qa-checklist.md` section 3.
> **Build only after all three pages are live** (`CLAUDE.md` section 13).
> Tags: **LOCKED** = approved by Eklavya · **DECIDED** = approved default · **PROPOSED** = agent suggestion, tune it · **ASK** = ask before building.

---

## 1. Goal
One 15-second video per audience page (Recruiter, Teams, Clients) for LinkedIn, DMs, email and resume links. It is made from the **same timeline and the same data files** as the page. No separate video editing.

## 2. Formats (DECIDED)

| Format | Size | Use |
|---|---|---|
| Landscape 16:9 | 1920x1080 | Master. Email, DMs, LinkedIn desktop |
| Portrait 9:16 | 1080x1920 | LinkedIn on mobile, Instagram, Stories |

- Frame rate **30 fps** (PROPOSED). Because the timeline is deterministic, 60 fps is possible later if wanted.
- Output: **MP4, H.264, silent.** (`CLAUDE.md` mentions WebM or MP4; MP4 is accepted by all platforms.)
- 3 pages x 2 formats = 6 files.
- File names: `Eklavya-Jha_<page>_<landscape|portrait>_15s.mp4`.
- Output folder `reels-out/` is git-ignored. Keep finished files on your own drive.

## 3. Timing (PROPOSED; `animation-spec.md` says final timing is set when Phase 2 starts, so **ASK** then)

| Time | Stage | Content |
|---|---|---|
| 0.0 to 3.0 s | Identity | Mark, name, role line, one or two tags, photo in its light rounded frame |
| 3.0 to 9.0 s | Proof | Up to 2 stats (count up), then up to 2 featured projects with real screenshots and status badges |
| 9.0 to 12.0 s | Tools and journey | Tool pills, then 2 or 3 milestones on a short timeline |
| 12.0 to 15.0 s | Action | End-card line, primary CTA, **the page URL as text** |

- Per-page focus follows `animation-spec.md` section 6 (Recruiter: skills and projects. Teams: team builds and community. Clients: Vasudha case study plus Viral AI).
- Items come from the page's `animation` block in `pages/<page>.json`, taking the first items that fit each window. **No schema change needed.** If he later wants different picks for reels, add an optional `reel` block (that edit must also update `content-schema.md` and the README).
- Beat lengths are computed from item counts, so the total is always exactly 15 s.
- A reel is a video, so the CTA is not clickable. The end card shows the URL (read from `siteUrl` in `site.json`). The link goes in the post text.

## 4. Content rules (LOCKED, same as the site)
- Real data only. Status badges stay (Live, In development, Finalist).
- No email address, phone number, WhatsApp or Telegram. No resume link as text other than the page URL.
- No planned feature shown as live. No demo template. No rank. No "AI Engineer".
- Nothing from another audience's page.
- Screenshots contain no private client data.

## 5. Reel mode in the site (PROPOSED)
- Reached with a query switch on the page URL, for example `?reel=landscape` or `?reel=portrait`.
- **Must not create an indexable duplicate** (`seo.md`): `<meta name="robots" content="noindex">` plus a canonical tag pointing to the main page. Not listed in `sitemap.xml`. Do **not** block it in `robots.txt`, because search engines must be able to read the noindex tag.
- Reel mode hides everything that is not the stage: no header, Skip, Replay, sound toggle, progress bar, sticky CTA bar or cursor.
- The stage is a fixed 1920x1080 or 1080x1920 canvas of normal DOM and SVG (no `<canvas>`).
- Portrait is a layout variant of the same timeline (same data, same beats, different arrangement).
- **Safe area for portrait:** keep key text inside the middle of the frame, away from the top 12% and bottom 22%, where social apps place their buttons (platform layouts change, so check before publishing).

## 6. Determinism requirements (from `animation-spec.md`)
- `seek(t)` always produces the identical frame.
- No `Date.now()`, no unseeded random values, no animation driven by real time.
- Count-up numbers, typing and pill positions are all computed from `t`.
- Fonts and images are fully loaded before the first frame is captured.
- No flashing faster than 3 times per second.

## 7. Export method (DECIDED: automated; manual recording is the fallback)

Tools (all free, Windows):
- Node.js LTS, Playwright with Chromium, ffmpeg.
- Install ffmpeg with `winget install Gyan.FFmpeg` (agent verifies the command at setup). Mac works the same with Homebrew.

How the script (`scripts/export-reel.mjs`, written by the agent) works:
1. Starts the site locally (or opens the live page).
2. Opens the page in headless Chromium at 1920x1080 (or 1080x1920) with `?reel=...`.
3. Waits until fonts, images and the timeline are ready.
4. For each frame `i` from 0 to 449: calls `timeline.seek(i / 30)`, waits for the browser to paint, saves a PNG.
5. Runs ffmpeg to turn the PNGs into MP4:
```powershell
ffmpeg -framerate 30 -i frames/%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart reels-out/Eklavya-Jha_recruiter_landscape_15s.mp4
```
6. Deletes the temporary frames.

Why this way: every frame is exact, so the result is perfectly smooth and can be recreated after any content change. It takes a few minutes per reel on a normal laptop.

**Fallback:** record the screen with OBS while the page plays. Needs no setup, but it can drop frames and is hard to reproduce. Use it only if the script fails.

## 8. Posting notes
- Silent by default. Platforms autoplay muted, and the text is already on screen. Optional music later: **ASK**.
- Put the page URL in the post text or comment. Check each platform's current upload limits when posting.
- Add a one-line text description of the reel when the platform allows alt text.
- Re-export all reels when the domain changes or when content shown in them changes (`deployment.md` section 11).

## 9. Acceptance checklist
- [ ] Six MP4 files, correct sizes (1920x1080 and 1080x1920), 15 seconds each
- [ ] The same data produces the same video on every run
- [ ] Only that audience's content appears
- [ ] URL on the end card is correct and readable on a phone
- [ ] No email, phone number, WhatsApp, Telegram, rank or planned feature shown as live
- [ ] Portrait text is clear of the top and bottom safe areas
- [ ] Reel-mode URL is `noindex`, canonical to the main page, absent from the sitemap
- [ ] Files play on Android, iPhone and the target platform's preview