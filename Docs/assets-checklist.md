# assets-checklist.md — Files, Owners and Folders

> Read with `content-brief.md` section 16 (it wins on any conflict), `brand.md` section 7, `content-schema.md` section 2, `deployment.md` section 5.
> Tags: **YOU** = Eklavya provides · **AGENT** = the coding agent produces · **BOTH** = agent drafts, he approves in chat.
> Current state (October 2026): no assets are being added yet. `public/` holds placeholder folders only.

---

## 1. Rules (LOCKED)
- **Everything inside `public/` goes live on the internet.** Never put proof documents, the offer letter, `data.md` or resume source files there.
- **Proof documents live in `private-proofs/`** at the repo root, outside `public/`, listed in `.gitignore`. Keep a second copy on your own drive.
- Folder name is **`public`, all lowercase.** Windows ignores letter case, but the host does not, so a wrong case breaks only after deploy.
- Real files only: no stock photos, no mock-ups, no fake logos (`brand.md`).
- Every image used on the site needs alt text in its data file.

## 2. Folder structure

```
public/
  assets/
    eklavya-photo.png
    projects/<project-id>/        screenshots, WebP
    og/                           home, recruiter, teams, clients  (1200x630)
    brand/                        mark.svg, favicons
  Eklavya-Jha-Resume.pdf
private-proofs/                   NOT published, NOT in public/
  ecell-iitb-campus-ambassador-offer-letter.png
  bharatiya-antariksh-certificate.png
  <screenshots of any proof link the agent cannot open>
```

Path note: `content-brief.md` (sections 9, 16) and `content-schema.md` (sections 2, 4.6) mention `assets/proofs/`. In this repo `assets/` sits inside `public/`, which is published, so proofs go in `private-proofs/` instead. The data files use the `private-proofs/` path with `"publish": false`, and the build never copies that folder.

## 3. Checklist

| # | Asset | Owner | Used on | Spec | Status |
|---|---|---|---|---|---|
| 1 | Professional photo | YOU | all dedicated pages, OG images | `eklavya-photo.png`, original quality. White background, so framed in a light rounded frame. Alt: "Portrait of Eklavya Jha in a black blazer and white shirt" | Received, move into `public/assets/` |
| 2 | Offer letter (proof only) | YOU | Teams page (text only, image never shown without approval) | private | Received at `assets/proofs/ecell-iitb-campus-ambassador-offer-letter.png` (the path named in `content-brief.md`); move it into `private-proofs/` in the repo |
| 3 | Bharatiya Antariksh certificate image | YOU | Teams, hackathon row | private | Promised, not shared. Until then the row shows "Participant" with no proof link. |
| 4 | Screenshots of blocked proof links | YOU, only if asked | Hackathon and certificate rows | private, PNG or JPG | As needed |
| 5 | Resume PDF | AGENT drafts, YOU review | Recruiter page | `Eklavya-Jha-Resume.pdf`, 1 to 2 pages, real selectable text, no phone number. **ASK:** does the resume show an email address, or only LinkedIn and GitHub? | Not started |
| 6 | Project screenshots | AGENT captures | project cards, animation | WebP, width 1600, 2 to 5 per project, under about 200 KB each, alt text. Projects: Vasudha, Dealflow360, Viral AI (its README already has two). | Not started |
| 7 | Logo / initials mark | BOTH | intro, favicon | 2 options as SVG, you pick one | Not started |
| 8 | Favicon and app icons | AGENT | all pages | from the chosen mark | After #7 |
| 9 | Open Graph images, 4 | AGENT | link previews | 1200x630, PNG or JPG, under about 300 KB, dark stage, one accent, Inter | Not started |
| 10 | Tech icons | AGENT | tech strip, animation | one free icon set, one consistent style | Not started |
| 11 | Demo-template screenshots | AGENT | Clients page | WebP, captured from the two demo sites, optional | Not started |
| 12 | Inter font files | AGENT | all pages | self-hosted, WOFF2, weights 400 to 700 | Not started |

Decisions only you can make: pick the logo option (#7), approve what to blur or hide in Vasudha screenshots (#6, it is client data), approve the per-page stat selection, and answer the resume email question (#5).

## 4. Simple steps for you (VS Code, Windows)
1. **Rename `Public` to `public`.** If VS Code keeps the old capital letter, run in the terminal: `git mv Public tmp` then `git mv tmp public`. (If the folder is not tracked yet, just rename it twice.)
2. **Create `private-proofs/`** at the project root, next to `public/`. Move the offer-letter image into it.
3. **Check `.gitignore`** contains `private-proofs/`, `data.md`, `.env`, `.env.local`, `.dev.vars`, `reels-out/`.
4. **Move `eklavya-photo.png`** into `public/assets/`.
5. Commit and push. Do not resize or convert images yourself; the agent optimizes them.
6. Later assets: drag them into the folder shown in section 2 using the exact file names above.

Your screenshot shows a `U` next to both files. That means Git has not tracked them yet, so if you move the offer letter before your first commit, it never reaches GitHub.

## 5. Placeholder behaviour
- Empty folders are kept with a `.gitkeep` file.
- Development build: a missing image shows a plain labelled box ("Image coming"), never a fake picture.
- Production build **fails** if a featured project has no screenshot, an image has no alt text, or a published proof points to a missing file (`content-schema.md` section 5). Missing assets can never silently ship.

## 6. Acceptance checklist
- [ ] Nothing from `private-proofs/` appears in `public/`, the built site, the sitemap or Git history
- [ ] Folder is named `public` in lowercase
- [ ] Every shipped image has alt text and a defined size
- [ ] Screenshots are real and contain no private client data
- [ ] Resume PDF has no phone number and follows the decision on #5
- [ ] OG image exists for Home and all three pages