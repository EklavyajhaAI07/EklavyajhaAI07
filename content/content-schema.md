# content-schema.md — Content Data Structure

> Facts and decisions: `content-brief.md` (FINAL v5, it wins on any conflict). Rules: `CLAUDE.md` section 8 (content is never hardcoded). Pages that consume this data: `page-specs.md`, `animation-spec.md`.
> The examples below use facts from the brief only. If an example ever disagrees with the brief, the brief decides.
> Format is framework-neutral: JSON shown here; Markdown with front matter or YAML is acceptable if `tech-stack.md` settles on it. The field names and rules stay the same.

---

## 1. Goal
Adding a project, skill, certificate, hackathon or milestone in 2027-28 means **editing or adding one data file, pushing to GitHub, and letting the host redeploy**. No component or animation code changes.

## 2. Folder layout

```
/content
  site.json              site name, language, default SEO fields
  identity.json          name, role line, tags, photo, location, college line
  education.json         degree, university, years
  programs.json          programs and certificates
  skills.json            skills, levels, proof project
  hackathons.json        events, results, proofs
  community.json         roles and awards (ambassador, coordinator, awards)
  stats.json             approved stats (max 3 shown per page)
  journey.json           timeline milestones
  connect.json           channels and rules (no email address inside)
  /projects
    vasudha-manager.json
    dealflow360.json
    viral-content-ai.json
    ...one file per project
  /pages
    home.json            card titles and lines
    recruiter.json       section order, which items show, CTA order
    teams.json
    clients.json
  /copy
    copy-deck.json       headlines, hero lines, CTAs, end-card lines (mirrors copy-deck.md)
/assets
  eklavya-photo.png
  /projects/<id>/        screenshots
/private-proofs/         proof images (offer letter, certificates): repo root, OUTSIDE the published folder, never deployed

```

## 3. Conventions
- **ids:** lowercase kebab-case, unique, stable (`vasudha-manager`). Pages reference items by id.
- **dates:** `YYYY-MM` (or `YYYY-MM-DD` when exact). Unknown dates are omitted, never guessed.
- **audience** enum: `recruiter`, `teams`, `clients`.
- **status** enum (projects): `live`, `in-development`, `coming-soon`, `demo-template`.
- **result type** enum (hackathons): `finalist`, `participant`.
- **links:** `{ "label": "...", "url": "https://...", "type": "live | repo | demo | video | certificate | post" }`.
- **images:** `{ "src": "...", "alt": "..." }`. `alt` is required.
- **proof:** `{ "url": "...", "publish": true | false }`. `publish: false` means the link is kept for verification and never shown on the site.
- **text fields:** plain text, no HTML, in English. Lengths are enforced (section 5).
- Optional fields may be omitted. Required fields may never be empty.

---

## 4. File schemas (with examples from the brief)

### 4.1 `identity.json`
```json
{
  "name": "Eklavya Jha",
  "roleLine": "AI-Powered Full Stack Developer",
  "supportingLine": "Learning AI Engineering",
  "location": { "city": "Ahmedabad", "region": "Gujarat", "country": "India" },
  "college": "Gandhinagar University",
  "tags": ["AI-Powered Full Stack Developer", "Learning AI Engineering", "B.Tech CSE-AI", "5x Hackathon Finalist"],
  "photo": { "src": "/assets/eklavya-photo.png", "alt": "Portrait of Eklavya Jha in a black blazer and white shirt" },
  "audienceTags": { "recruiter": [], "teams": [], "clients": [] }
}
```

### 4.2 `education.json` and `programs.json`
```json
{ "university": "Gandhinagar University", "degree": "B.Tech CSE-AI", "startYear": 2025, "currentSemester": 3, "graduationYear": 2029 }
```
```json
[
  { "id": "iitr-microsoft-elite-ai-ds", "title": "Elite AI & DS (IIT Roorkee + Microsoft)", "status": "in-progress",
    "start": "2026", "end": "2027", "proof": { "url": "https://lnkd.in/p/dSUsuuGY", "publish": true },
    "note": "Never imply an IIT degree." }
]
```

### 4.3 `skills.json`
```json
[
  { "id": "fastapi", "name": "FastAPI", "category": "Web / backend / data", "level": "working", "proofProject": "viral-content-ai", "audiences": ["recruiter", "clients"] }
]
```
- `level` enum: `learning`, `working`, `strong`. **No percentages.**
- A skill must name a `proofProject` that exists in `/projects`. A skill with no evidence is rejected at build time.

### 4.4 `projects/<id>.json`
```json
{
  "id": "vasudha-manager",
  "title": "Vasudha: The Manager",
  "oneLine": "A web app for firms' accounting and management.",
  "status": "live",
  "kind": "client-work",
  "clientLabel": "a packaging trading business",
  "description": "Manages invoices, bills, payments, financial reports, team access and backups.",
  "role": "Full-stack development, plus debugging and security checks.",
  "tech": ["MongoDB", "Full-stack web app"],
  "links": [{ "label": "Live", "url": "https://vasudha-the-manager.vercel.app/", "type": "live" }],
  "screenshots": [],
  "roadmap": [
    { "label": "Double-entry bookkeeping", "status": "coming-soon" },
    { "label": "Owner assistant", "status": "coming-soon" }
  ],
  "featured": true,
  "featuredOrder": 1,
  "showOn": ["recruiter", "clients"],
  "angles": { "recruiter": "", "teams": "", "clients": "" }
}
```
- `kind` enum: `client-work`, `hackathon-build`, `own-product`, `demo-template`.
- `roadmap` items are never rendered as live; they render only under a Coming soon badge.
- A project with no public repo has **no** `repo` link (Dealflow360). The renderer never shows a GitHub button without one.
- `tech` lists only technologies the brief or the repo evidences. Vasudha shows only "MongoDB" and "full-stack" because the sources disagree.
- Demo templates use `kind: demo-template`, `status: demo-template`, and never have `clientLabel`.

### 4.5 `hackathons.json`
```json
[
  { "id": "odoo-hackathon-2026-final", "event": "Odoo Hackathon 2026 (Odoo HQ Hackathon)", "round": "offline final (Grand Finale)",
    "project": "dealflow360", "result": "finalist", "note": "Selected from 20,000+ applicants.",
    "proof": { "url": "https://lnkd.in/p/dmg9SvCY", "publish": true } },
  { "id": "bharatiya-antariksh-2026", "event": "Bharatiya Antariksh Hackathon 2026 (ISRO)", "project": "AEGIS",
    "result": "participant", "proof": { "url": "https://lnkd.in/p/d5bMbe2e", "publish": true } }
]
```
- `result` is only `finalist` or `participant`. There is no rank field. The number 47 never appears anywhere.
- Finalist entries need `proof`. The renderer uses the wording on the certificate where available.

### 4.6 `community.json`
```json
[
  { "id": "ecell-iitb-campus-ambassador", "title": "Campus Ambassador, E-Cell IIT Bombay (remote)", "type": "role", "date": "2026-06",
    "proof": { "url": "private-proofs/ecell-iitb-campus-ambassador-offer-letter.png", "publish": false } },
  { "id": "fresher-party-night", "title": "Fresher's Party Night Edition (Google Student Ambassador)", "type": "participation", "result": "participant" }
]
```
- `type` enum: `role`, `award`, `participation`.

### 4.7 `stats.json`
```json
[
  { "id": "finalist-5x", "label": "Hackathon Finalist", "value": 5, "suffix": "x", "proof": "hackathons", "showOn": ["recruiter", "teams", "clients"] },
  { "id": "odoo-field", "label": "Odoo Grand Finale, selected from", "value": 20000, "prefix": "", "suffix": "+ applicants", "showOn": ["recruiter", "teams"] },
  { "id": "cognivia-rank", "label": "Cognivia: 4th of", "value": 152, "suffix": " teams", "showOn": ["teams"] }
]
```
- Every stat needs a basis in the brief. A hard cap of 3 stats per page is enforced.

### 4.8 `journey.json`
```json
[ { "date": "2025", "label": "Started B.Tech CSE-AI at Gandhinagar University" },
  { "date": "2026-06", "label": "Offer letter as Campus Ambassador, E-Cell IIT Bombay" } ]
```

### 4.9 `connect.json`
```json
{
  "channels": [
    { "id": "email", "mode": "click-to-mail", "audiences": ["recruiter", "teams", "clients", "home"] },
    { "id": "linkedin", "url": "https://www.linkedin.com/in/eklavya-jha-23a54b377", "audiences": ["recruiter", "teams", "clients", "home"] },
    { "id": "github", "url": "https://github.com/EklavyajhaAI07", "audiences": ["recruiter", "teams", "clients", "home"] },
    { "id": "x", "url": "https://x.com/EklavyajhaAI07", "audiences": ["recruiter", "teams", "clients", "home"] },
    { "id": "discord", "mode": "copy-username", "username": "eklavyajha0207", "audiences": ["recruiter", "teams", "clients", "home"] },
    { "id": "instagram", "url": "https://www.instagram.com/eklavyajha_", "audiences": ["clients"] }
  ],
  "form": { "enabled": true, "audienceOptions": ["Recruiter", "Teams & Communities", "Client", "Not sure"] }
}
```
- **The email address is never stored in these files and never appears in the shipped HTML as plain text.** It is kept in a private environment value and delivered through an encoded value assembled in the click handler, or through a server-side redirect.
- No phone number, WhatsApp or Telegram fields exist in the schema.

### 4.10 `pages/<page>.json`
```json
{
  "page": "recruiter",
  "slug": "recruiter-hr",
  "sections": ["proofStrip", "projects", "skills", "hackathons", "education", "journey", "connect"],
  "projects": ["vasudha-manager", "dealflow360", "viral-content-ai"],
  "animation": { "projects": ["vasudha-manager", "dealflow360", "viral-content-ai"], "stats": ["finalist-5x", "odoo-field"] },
  "primaryCta": { "type": "resume-download" },
  "secondaryCta": { "type": "connect" }
}
```
- Only items that exist in the other files may be referenced. Items listed under another audience's `showOn` cannot appear here.

### 4.11 `copy/copy-deck.json`
Mirrors `copy-deck.md`: slots with an ordered `options` array; the first option is the default; `chosen` is set only when Eklavya picks another in chat.

---

## 5. Validation (the build must fail on any violation)
1. Required fields present; enums valid; ids unique; every reference resolves.
2. Featured projects in an animation: max 4. Stats per page: max 3.
3. Every finalist hackathon has a `proof`. Every skill has a `proofProject`.
4. `status: coming-soon` or `roadmap` items are never rendered as live.
5. A `demo-template` project never has `clientLabel` and always carries the Demo template badge.
6. No project outside `/content/projects` is rendered (exclusion rule from the brief).
7. Forbidden patterns anywhere in `/content` and in built HTML: a phone number pattern, a plain-text email address, the exact title "AI Engineer" as his role (match it as a whole word, so "Learning AI Engineering" stays allowed), "rank 47", the words WhatsApp or Telegram as contact channels.
8. Text lengths: titles up to 80 characters, one-liners up to 140, descriptions up to 400, stat labels up to 60.
9. Images have `alt`; screenshots are WebP and under the size budget.
10. A schema change requires updating this file and the README.

## 6. Adding things later (the README will give copy-paste versions)
- **New project:** copy a file in `/projects`, fill every required field, set `showOn` and optionally `featured`, add screenshots, push.
- **New skill:** add an entry in `skills.json` with a real `proofProject`.
- **New certificate or hackathon:** add an entry with its proof link and `publish` flag.
- **Feature finished** (for example Vasudha's double-entry bookkeeping goes live): change that `roadmap` item to a live feature and update the project description. Only Eklavya confirms this.
- **Keep the animation short:** only items flagged `featured` appear in it, within the caps above.

## 7. Privacy
- Proof images live in `/private-proofs` at the repo root, **outside** the folder that the host publishes, so they are never reachable by URL. (`content-brief.md` calls this location `assets/proofs/`; in the repo it maps to `private-proofs/`.) A proof image is shown on the site only if `publish: true` and Eklavya approves; in that case copy a resized version into the published assets.
- `data.md` is never copied into `/content`.
- Nothing in `/content` may contain private details listed in `content-brief.md` section 15.