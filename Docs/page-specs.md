# page-specs.md — Page-by-Page Specification

> Facts, projects, proofs and exclusions: `content-brief.md` (FINAL v5, it wins on any conflict). Rules and structure: `CLAUDE.md`. Copy: `copy-deck.md`. Look: `brand.md`. Motion: `animation-spec.md`. Data shape: `content-schema.md` (to be read with this file).
> Tags: **LOCKED** = approved by Eklavya · **AGENT-DRAFTS** = the agent proposes 2 options, he picks in chat · **DECIDED** = chosen by Claude on his delegation.

---

## 1. Pages and rules that apply to all of them

| Page | Audience | Slug |
|---|---|---|
| Home | Web searchers and normal visitors | `/` |
| Recruiter / HR | Recruiters and HR | agent chooses (e.g. `/recruiter-hr/`) |
| Teams & Communities | Tech leads, communities, clubs, event management firms | agent chooses |
| Clients | People hiring a developer for their product | agent chooses |

- Slugs are lowercase, descriptive and stable once chosen.
- **Content isolation (LOCKED):** projects, details and cards on a dedicated page appear only on that page.
- **Static content first (LOCKED):** every page renders its full content as HTML before any animation runs.
- **No phone number, WhatsApp or Telegram. Email is never visible text** (click-to-mail button only).
- Sections with no data are not rendered (no empty headings, no placeholder text).
- Every claim on a page comes from `content-brief.md`. Status badges (`brand.md`) are required wherever a status is not "Live".

### Header and footer
- **Home:** a small wordmark ("Eklavya Jha") only. No navigation links.
- **Dedicated pages:** during the animation only Skip, Pause, Replay and the sound toggle are shown. After the animation ends (or Skip is pressed) a slim header appears with the wordmark, a link to Home, and links to the **other two** audience pages ("Not your path? See ...").
- **Footer (all pages):** © Eklavya Jha, the connect buttons (click-to-mail, LinkedIn, GitHub, X, Discord copy-username; Instagram on the Clients page only), and a one-line privacy note for the contact form (agent drafts the wording).

---

## 2. Home page (LOCKED: three cards, then connect)

No intro, no about section.

```
[wordmark]
[card: Recruiter / HR]   [card: Teams & Communities]   [card: Clients]
[connect section]
[footer]
```

**Cards**
- Each card: audience title, one line, a small icon, an arrow. The whole card is one link to its page (large touch target, visible focus state, keyboard operable).
- Layout: three columns on desktop, stacked on mobile. All three visible without scrolling on a typical laptop and visible near the top on a phone.
- Starter drafts (the agent refines, he approves in chat):
  - Recruiter / HR: "For recruiters and HR: projects, skills and resume."
  - Teams & Communities: "For teams and communities: team builds, hackathons and community work."
  - Clients: "For clients: live work and how I build."
- Hover and focus: lift of 2-4px (transform only), accent border.

**Connect section (below the cards)** shows the audience-neutral set from `content-brief.md` section 12: click-to-mail, LinkedIn, GitHub, X, Discord copy-username, and the contact form. **No Instagram on Home** (Clients page only). The audience dropdown on the form defaults to "Not sure".

**SEO job of Home:** it is the page web searchers land on. It still needs a real `<h1>` ("Eklavya Jha, AI-Powered Full Stack Developer"), visible text and structured data (see `seo.md`), without adding an intro section.

---

## 3. Shared skeleton of the three dedicated pages

| # | Block | Notes |
|---|---|---|
| A | **Hero stage** (dark) | Static content first: photo, name, role line, tags, college line, page headline, supporting line, availability, two hero CTAs. The 25-second animation plays on top (`animation-spec.md`). |
| B | **Proof strip** | 3 to 4 compact proof items (badges and numbers) specific to the page |
| C | **Page sections** (light) | Page-specific, listed below |
| D | **Connect block** | Page-specific CTA order |
| E | **Sticky CTA bar** | Appears after the animation, never covers content on mobile |
| F | **Footer** | As above |

**Hero copy rule (reading of `copy-deck.md`):** the page headline is the first option of that page's list (copy-deck sections 3 to 5) unless Eklavya picks another in chat. The supporting line, availability line and CTAs ("View My Work", "Let's Build Together") come from the master set (copy-deck section 1). "View My Work" scrolls to that page's projects; "Let's Build Together" scrolls to the connect block with the audience dropdown prefilled. The page's end-card line comes from copy-deck section 6.

**Photo:** `assets/eklavya-photo.png`, in a light rounded frame on the dark stage (white background) or cleanly background-removed.

---

## 4. Recruiter / HR page

Reader question: can he do the job, and is he growing fast? Optimise for scanning and verification.

| Order | Section | Content and source |
|---|---|---|
| A | Hero | As above, Recruiter headline |
| B | Proof strip | 5x Hackathon Finalist · B.Tech CSE-AI, Gandhinagar University (2025 to 2029) · IIT Roorkee + Microsoft Elite AI & DS (2026 to 2027, in progress) · Campus Ambassador, E-Cell IIT Bombay (remote) |
| C1 | **Projects** | Vasudha (Live), Dealflow360 (Odoo Grand Finale project), Viral AI (In development). Card: name, one-line outcome, tech, role, status badge, links, screenshots. Vasudha's "Coming soon" items sit inside its card under a Coming soon badge. |
| C2 | **Skills** | Grouped cards (Languages, AI/ML, Web/backend/data, Cloud/deploy) with Learning / Working / Strong levels and a proof project (agent drafts, he approves once). Never percentages. |
| C3 | **Hackathons and certificates** | Finalist events first, participation after, each with its proof link if he allowed it. Use the exact wording on each certificate. |
| C4 | **Education and program** | Degree, semester, expected graduation; the Elite AI & DS program line (never implying an IIT degree). |
| C5 | **Journey timeline** | Milestones from `content-brief.md` section 8 |
| D | Connect | **Primary: resume download** (PDF generated by the agent from the brief, reviewed by Eklavya). Then click-to-mail, LinkedIn, GitHub, X, Discord copy-username, contact form (dropdown = Recruiter). |

Not on this page: demo websites, pricing, Instagram, process section.

---

## 5. Teams & Communities page

Reader question: can he build, collaborate and add energy to a team?

| Order | Section | Content and source |
|---|---|---|
| A | Hero | As above, Teams headline |
| B | Proof strip | 5x Hackathon Finalist · Campus Ambassador, E-Cell IIT Bombay · SIH Student Coordinator 2026 · "Top Prompt Creator" (Google Student Ambassador) |
| C1 | **Team builds** | Dealflow360 (Team StackForge, Odoo Grand Finale), Viral AI. Hackathon-linked builds: CourtFlow AI, CiteMind, AEGIS. State the role honestly (hackathon team build; no "team lead" claim). |
| C2 | **Hackathon record** | Table: event, project, result as printed on the certificate (Finalist or Participant) |
| C3 | **Community and leadership** | Campus Ambassador (E-Cell IIT Bombay, remote); SIH Student Coordinator 2026; Founder's Crew content writer and Instagram manager; Google Student Ambassador "Top Prompt Creator"; "Fresher's Party Night Edition" as **Participant** |
| C4 | **What I offer a team** | 3 bullets, agent drafts from confirmed facts only |
| D | Connect | Primary: connect to collaborate. LinkedIn, Discord copy-username, click-to-mail, X, GitHub, contact form (dropdown = Teams). |

Do not publish event-level numbers from `data.md` (for example team counts) as his own. The architecture diagram that draws itself in the animation must show only systems that exist (for example Vasudha or Dealflow360 as described in the brief); no invented components.

---

## 6. Clients page

Reader question: will he solve my problem and deliver something that works? Plain language, minimal jargon.

| Order | Section | Content and source |
|---|---|---|
| A | Hero | As above, Clients headline |
| B | Proof strip | A live client system (Vasudha) · 5x Hackathon Finalist · AI-powered full stack builds |
| C1 | **What I build** | AI-powered full stack web apps and prototypes (brief section 10). Short, outcome-first. |
| C2 | **Case study: Vasudha** | A web app for firms' accounting and management: invoices, bills, payments, financial reports, team access, backups. Client shown as "a packaging trading business". His role: full-stack development, debugging and security checks. Blocks: *The need* (agent drafts one neutral line from the description, no invented pain points) · *What I built* · *What's live now* · *Coming soon* (double-entry bookkeeping, owner assistant, with a Coming soon badge). **No result numbers and no client name.** |
| C3 | **AI example** | Viral AI, "multi-agent platform, in development" |
| C4 | **Demo templates** | Sahi Gulab Jamun advertisement site and Eklavya Group Tuition institute site, under the heading "Demo website templates" with a Demo template badge. Never call them client work. |
| C5 | **How I work** | 4 to 5 step process, agent drafts (discover, plan, build, deliver) |
| C6 | **Pricing** | One line: "On request." |
| D | Connect | **Primary: contact form** (dropdown = Client). Secondary: **Instagram** (this page only). Also click-to-mail, LinkedIn, GitHub, X, Discord copy-username. No call booking. |

Not on this page: resume download as the main action, hackathon table, certificates, testimonials (none exist).

---

## 7. Shared components

| Component | Rules |
|---|---|
| Project card | Title, one-line outcome, tech, role, status badge, links, 2-5 real screenshots (WebP, lazy-loaded, alt text). No repo button when no public repo exists (Dealflow360). |
| Status badge | Live, In development, Coming soon, Demo template, Finalist, Participant (`brand.md`) |
| Proof link | "View certificate" opens the supplied link in a new tab (`rel="noopener"`), only if the data file marks it publishable. The offer-letter image is never shown without his approval. |
| Skill card | Category, skills, level, proof project |
| Timeline | Horizontal on desktop, vertical on mobile |
| Connect block | Buttons only. Click-to-mail assembles the address on click; Discord copies the username with a confirmation toast; the contact form has spam protection, validation, a success state and an error state |
| Sticky CTA bar | Appears after the animation; one primary button; hides near the connect block |

---

## 8. Responsive behaviour
- Mobile first. Breakpoints roughly at 640, 1024 and 1280 px.
- The hero stage fits one screen on phones without clipping; the headline stays readable.
- Animation scales to the viewport; text never smaller than 14px.
- Horizontal scroll never appears on the page body; wide tables scroll inside their own container.
- Touch targets at least 44x44px.

## 9. Data rules
- Content comes only from the data files (`content-schema.md`). Adding a project, skill or certificate never needs a code change.
- Order and visibility per page come from the page data files, not from code.
- Missing optional data removes that block cleanly.

## 10. Utility pages
- **404:** short message, link to Home, noindex.
- **Form success state:** inline message; no separate page needed.
- **Resume file:** a stable URL; the file name includes his name.

## 11. Acceptance checklist
- [ ] Home shows only the wordmark, three cards, connect section and footer
- [ ] Each dedicated page opens directly from its URL with full content before the animation
- [ ] Only that page's projects and details appear on it
- [ ] Other-page links appear only after the animation ends or is skipped
- [ ] Recruiter: resume download is primary. Clients: contact form is primary. Instagram appears on Clients only
- [ ] Vasudha's planned features carry "Coming soon"; the demo websites carry "Demo template"; Viral AI carries "In development"
- [ ] No repo link or GitHub button on Dealflow360
- [ ] No email as text, no phone number, no "AI Engineer", no 47 as a rank
- [ ] Every page passes the checks in `animation-spec.md` section 12