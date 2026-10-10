# content-brief.md — Eklavya Jha · Content Brief (FINAL v5)

> **STATUS: FINAL.** Eklavya will not edit this file again. Every decision he owed has been made or defaulted below.
> **For the coding agent:** build only from this file. Do not ask Eklavya to fill anything in. Ask in chat only if (a) a fact you need is genuinely absent from this file, (b) a proof link in section 19 cannot be opened (then ask for a screenshot), or (c) something you find contradicts this file.
> Global rules from `CLAUDE.md` still apply: never guess, never invent.

---

## 0. Tags and rules

| Tag | Meaning |
|---|---|
| `[CONFIRMED]` | Eklavya stated it in chat. Publishable. |
| `[PROOF-PROVIDED]` | He supplied a link or document (section 19). Publishable. The agent opens the link and uses the exact wording shown there. Proof documents themselves are not published without approval. |
| `[PUBLIC]` | From his own public GitHub or old site. Publishable for plain descriptions and links, never for ranks or numbers. |
| `AGENT-DRAFTS` | The agent writes 2 options from confirmed facts and Eklavya picks one in chat. |
| `SKIP` | Not on the site. |
| `EXCLUDED` | Must never appear. |

### Rules
1. **Only the projects listed in section 5.1 may appear on the site.** Any other project found on GitHub, his old site or `data.md` is excluded unless he adds it later.
2. **Never publish anything from section 15.** `data.md` holds private personal, family, financial and technical-environment details; none of it goes on the site, in code, metadata or structured data.
3. **No phone number. No WhatsApp. No Telegram.**
4. Never turn a participation into a result, a team build into a solo build, or a planned feature into a live one.
5. Anything in `data.md` that is not repeated in this file is `EXCLUDED`.

### What this draft was built from
His chat answers, his photo, the E-Cell IIT Bombay offer letter image (read by the assistant), his public GitHub profile and README, his old portfolio page, the public pages of the Viral AI repo, and `data.md`. LinkedIn and all `lnkd.in` links could not be opened by the assistant (they block automated access), so those proofs are as supplied by Eklavya.

---

## 1. Identity (PAGE: ALL)

| Field | Final value |
|---|---|
| Full name / name on site | Eklavya Jha `[CONFIRMED]`. Do not use the longer middle-name form. |
| Location shown publicly | Ahmedabad, Gujarat, India `[CONFIRMED]` |
| Lead role line | **AI-Powered Full Stack Developer** `[CONFIRMED]` (his words: "AI Powered Full Stack Dev") |
| Supporting line | **Learning AI Engineering** `[CONFIRMED]`. Never call him "AI Engineer". |
| Photo | `assets/eklavya-photo.png` `[CONFIRMED]` (black blazer, white shirt, plain white background). Alt text: "Portrait of Eklavya Jha in a black blazer and white shirt". Design note: the white background looks like a white box on the dark stage, so place it in a light rounded frame or remove the background. |
| Logo / initials mark | `AGENT-DRAFTS` (2 simple initials-mark options) |
| Tagline | `SKIP` |
| Site language | English |

### Bio and tags
- Draft bio (agent may refine, then he approves in chat): "AI-powered full stack developer, learning AI engineering. B.Tech CSE-AI student at Gandhinagar University. Finalist in five hackathons, including the Odoo Hackathon 2026 Grand Finale."
- Base tags: AI-Powered Full Stack Developer · Learning AI Engineering · B.Tech CSE-AI · 5x Hackathon Finalist
- Per-page extra tags: `AGENT-DRAFTS`

---

## 2. Education (PAGE: R, T)

| Field | Final value |
|---|---|
| University | Gandhinagar University `[CONFIRMED]` |
| Degree | B.Tech CSE-AI `[CONFIRMED]` |
| Start year | 2025 `[CONFIRMED]` |
| Current semester | 3rd `[CONFIRMED]` |
| Graduation | 2029 `[CONFIRMED]` |
| CGPA | `SKIP` |

---

## 3. Programs and certificates (PAGE: R, T)

| Item | Final wording and status |
|---|---|
| **IIT Roorkee + Microsoft Elite AI & DS program** | "Elite AI & DS", 2026 to 2027, in progress. Proof: https://lnkd.in/p/dSUsuuGY plus program emails he holds. Never imply an IIT degree. `[CONFIRMED]` `[PROOF-PROVIDED]` |
| Hackathon certificates | See sections 6 and 19 `[PROOF-PROVIDED]` |
| Everything else certificate-like in `data.md` (internship, IoT certificate, ViCoDathon) | `EXCLUDED` |

---

## 4. Skills (PAGE: R mainly; T and C selectively)

Technologies on his public GitHub README (`[PUBLIC]`):
- **Languages / core:** C, C++, Python, TypeScript, HTML, CSS, Git, GitHub, Linux, VS Code, Docker
- **AI / ML:** PyTorch, TensorFlow, OpenCV, NumPy, pandas, Hugging Face, Ollama, CrewAI, RAG with vector databases, n8n
- **Web / backend / data:** React, Flutter, Django, Flask, Express, FastAPI, Firebase, Supabase, MongoDB, MySQL
- **Cloud / deploy:** Vercel, Google Cloud

Evidence from the public Viral AI repo: FastAPI, SQLAlchemy + Alembic, Redis client, auth, pytest tests, Next.js App Router, TypeScript, Tailwind CSS, a frontend Dockerfile. His CourtFlow AI README adds Next.js, TypeScript and Python ML APIs.

Levels: `AGENT-DRAFTS`. The agent proposes Learning / Working / Strong with a proof project for each skill from repo evidence and he approves the list once in chat. Do not list a technology that no project evidences. Never publish percentages from his GitHub "roadmap".

---

## 5. Projects

### 5.1 Featured projects (the only projects allowed on the site)

| Id | Project | Final description | Links | Status and role |
|---|---|---|---|---|
| `vasudha-manager` | **Vasudha: The Manager** | Web app for firms' accounting and management. Manages invoices, bills, payments, financial reports, team access and backups `[CONFIRMED]`. Client work, shown anonymously as "a packaging trading business". | Live: https://vasudha-the-manager.vercel.app/ | **Live** `[CONFIRMED]`. **His role: full-stack development, plus debugging and security checks** `[CONFIRMED]`. **Coming soon (planned, NOT live): double-entry bookkeeping and an owner assistant.** Show them only under a "Coming soon" label. Stack: show only "MongoDB" and "full-stack"; omit other stack details (sources disagree). |
| `dealflow360` | **Dealflow360** (Team StackForge) | Internal workspace plus customer portal for quotes, approvals, inventory and billing. The project from the Odoo Hackathon 2026 **offline final (Grand Finale)** `[CONFIRMED]`. | Demo: https://dealflow360-iota.vercel.app/ `[CONFIRMED]` · No public repo (private): **never link a repo or show a GitHub button on this card** · Presentation video (`data.md`): https://youtu.be/ylkIJPtoX-8 | Role: "Team StackForge hackathon build". Do not claim "team lead" or specific modules. |
| `viral-content-ai` | **Viral AI** | "AI-powered content studio that scouts trends, designs strategy, generates content, and predicts virality" (repo README). Built for Craftathon 2k26. | https://github.com/EklavyajhaAI07/viral-content-ai (public, 2 screenshots in the README) | **In development** `[CONFIRMED]`. Approved wording: "multi-agent platform, in development". Do not use "7-agent" or "MongoDB". Do not claim solo or team: say "Eklavya's project". |

Hackathon-linked builds shown only inside the hackathon rows (section 6): **CourtFlow AI** (PU CODE Hackathon 3.0; repo https://github.com/EklavyajhaAI07/CourtFlow-x-PUCODE3.0), **CiteMind** (HackBaroda 2026; demo https://cite-mind-six.vercel.app/), **AEGIS** (Bharatiya Antariksh Hackathon 2026).

### 5.2 Demo website templates (Clients page, clearly labelled)
Eklavya confirmed these are **demo pamphlet/theme websites, not real client projects**. Label them "Demo website templates". Never call them client work, never name clients.
- Sahi Gulab Jamun advertisement site: https://eklavyajhaai07.github.io/Advertisement-Website-Sahi-Gulab-Jamun/
- Eklavya Group Tuition institute site: https://eklavyajhaai07.github.io/eklavya-group-tuition-website/

### 5.3 Placement (final)
- **Animation (max 4 per page):** Vasudha, Dealflow360, Viral AI.
- **Recruiter / HR:** Vasudha, Dealflow360, Viral AI.
- **Teams & Communities:** Dealflow360 (hackathon team build), Viral AI, hackathon-linked builds.
- **Clients:** Vasudha as the case study, Viral AI as an AI example, plus the demo website templates.

### 5.4 Project cards
The agent drafts every card (title, one-line outcome, problem, solution, tech, role, status, links, screenshots, page angle) from the READMEs, the live demos and this file. Only provable numbers appear. Screenshots: the agent may capture them from live demos with private data removed; Viral AI's README already has two. No mock-ups.

---

## 6. Hackathons (PAGE: R, T; selectively C)

**Eklavya is a finalist in five hackathons: Cognivia, PU CODE 3.0, Odoo Hackathon 2026, HackBaroda 2026 and FlowZint AI** `[CONFIRMED]` `[PROOF-PROVIDED]`. Use "5x Hackathon Finalist". His GitHub README still says "3x"; recommend updating it. Use only the wording printed on each certificate or post.

| Event | What to show | Proof |
|---|---|---|
| **Odoo Hackathon 2026** (also called Odoo HQ Hackathon 2026), offline final | **Grand Finale Finalist** with Dealflow360 (Team StackForge), selected from 20,000+ applicants. The 47 in earlier notes is a team number, **never a rank**, never shown. Public Odoo pages describe a 24-hour final at Odoo India, Gandhinagar, with a certificate for grand finalists, so do not imply a podium. | https://lnkd.in/p/dmg9SvCY |
| Odoo Hackathon 2026, virtual round | Project: TransitOps. No result claim. | `[CONFIRMED]` |
| **PU CODE Hackathon 3.0** | Finalist, CourtFlow AI | https://lnkd.in/p/d5D8pskZ |
| **Cognivia** (IEEE WIE × PDPU) | Finalist, **4th of 152 teams** (proactive AI safety system for women) | https://lnkd.in/p/dp2KxQHM |
| **HackBaroda 2026** | Finalist, CiteMind (AI citation-memory platform). Demo: https://cite-mind-six.vercel.app/ | Certificate https://lnkd.in/p/dN8ekj3T · post https://lnkd.in/p/db_rpbvE |
| **FlowZint AI Hackathon 2026** | Finalist, support chatbot track. His README adds "Top 100 / Silver Tier": use that wording only if the certificate says it. | https://lnkd.in/p/d3qAGijh |
| Bharatiya Antariksh Hackathon 2026 (ISRO) | Participant, AEGIS (air-gapped predictive AI copilot). No ISRO affiliation claim. | https://lnkd.in/p/d5bMbe2e (certificate image promised, not yet shared) |
| SEMICON India 2026, Hacker House Goa 2026, Craftathon 2k26, India AI Impact Buildathon | Participant only, from his README `[PUBLIC]`. India AI Impact Buildathon: "among 40,000+ participants" is the field size, not a result. | No certificate links supplied; keep as plain participation or omit |

GitHub achievement badges **Pull Shark** and **Pair Extraordinaire** `[PUBLIC]` are verifiable on his profile.
A count of events attended ("13+") is `EXCLUDED`.

---

## 7. Stats (max 3 per page in the animation, all real)

1. **5x Hackathon Finalist** `[PROOF-PROVIDED]`
2. **Odoo Hackathon 2026 Grand Finale, selected from 20,000+ applicants** (word it as the field size)
3. **Cognivia: 4th of 152 teams** `[CONFIRMED]`

Which stats appear on which page: `AGENT-DRAFTS`. No other stats. No hours, streaks or user counts.

---

## 8. Hard-work journey / timeline (PAGE: ALL)

Real milestones (the agent takes exact dates from the certificates and posts):
- 2025: started B.Tech CSE-AI at Gandhinagar University
- 2026: hackathon finals (section 6)
- 29 June 2026: offer letter as Campus Ambassador, E-Cell IIT Bombay
- 2026: SIH Student Coordinator
- 2026 to 2027: IIT Roorkee + Microsoft Elite AI & DS program, in progress

---

## 9. Teams & Communities proof (PAGE: T)

- **Campus Ambassador, E-Cell IIT Bombay** `[PROOF-PROVIDED]`. Offer letter dated 29 June 2026, signed by two Overall Coordinators; a remote (work-from-home) position. Image: `assets/proofs/ecell-iitb-campus-ambassador-offer-letter.png`. Wording: "Campus Ambassador, E-Cell IIT Bombay (remote)". Never imply IIT Bombay enrolment. Do not publish the letter image without his approval.
- **SIH Student Coordinator 2026** `[PROOF-PROVIDED]` https://lnkd.in/p/dkZpTypz. Use exactly that phrase. No event-level numbers.
- **Google Student Ambassador: "Top Prompt Creator" award** `[PROOF-PROVIDED]` https://lnkd.in/p/da2ZM8tA
- **Google Student Ambassador "Fresher's Party Night Edition":** **Participant** `[CONFIRMED]`. A promotional event where he completed Gemini-based tasks and received a participation certificate (https://lnkd.in/p/dCu_MypE). Wording: "Participant". Never "Champion".
- **Founder's Crew, E-Cell Gandhinagar University:** content writer and Instagram manager `[PUBLIC]`.
- Team-lead roles and event-level figures from `data.md`: `EXCLUDED`.

"What I offer a team" (3 bullets): `AGENT-DRAFTS` from the facts above.

---

## 10. Clients page content (PAGE: C)

| Field | Final decision |
|---|---|
| What he builds | AI-powered full stack web apps and prototypes. His old site says "Available for AI & Web Prototypes". |
| Case study | **Vasudha** (live client system, role and live URL confirmed). Result: no number, only what is confirmed in 5.1. Client shown as "a packaging trading business". |
| Work samples | Viral AI (in development) and the two demo website templates (section 5.2, labelled as demos) |
| Real clients | None to name. Never present demo work as client work. |
| Process | `AGENT-DRAFTS` (plain discover → plan → build → deliver outline) |
| Pricing | Not shown. Use "on request". |
| Timelines, engagement types, support policy | `SKIP` |
| Testimonials | `SKIP` (none exist) |

---

## 11. Testimonials
`SKIP`. Fake testimonials are never allowed.

---

## 12. Connect details (PAGE: ALL, with rules)

| Channel | Final value | Pages |
|---|---|---|
| Email | **Never displayed as text.** A "Click to mail" action button only (address: eklavyaprivate22@gmail.com). Do not put it in visible text or structured data; assemble it on click. A mail link cannot be perfectly hidden, so the contact form is the stronger path. | ALL |
| LinkedIn | https://www.linkedin.com/in/eklavya-jha-23a54b377 | ALL |
| GitHub | Button: https://github.com/EklavyajhaAI07 | ALL |
| X | https://x.com/EklavyajhaAI07 (agent verifies it opens) | ALL |
| Instagram | https://www.instagram.com/eklavyajha_ | **Clients page only** (businesses hiring for contract work) |
| Discord | Username `eklavyajha0207` as a "Copy Discord username" button (no profile URL exists) | ALL |
| Contact form | Audience dropdown prefilled from the page | ALL |

`SKIP`: YouTube, Unstop, call booking, old-portfolio link, reply-time line. Resume PDF for the Recruiter CTA: the agent generates it from this file for his review.
**No phone number, no WhatsApp, no Telegram.** A separate business email in `data.md` is `EXCLUDED`.

---

## 13. Copy per page (PAGE: each)

All headlines, hero copy, CTAs, availability line and end-card lines are in **`copy-deck.md`** (written by Eklavya). The first option in each slot is the default. Home-page card text: the agent drafts it from the copy deck, with no new claims.
---

## 14. SEO basics (PAGE: ALL)

| Field | Final value |
|---|---|
| Site / brand name | "Eklavya Jha" |
| Title pattern | "Eklavya Jha | AI-Powered Full Stack Developer" (agent adapts per page) |
| Domain | Decided in `tech-stack.md` (current: eklavya.dpdns.org, a free subdomain) |
| Keywords and meta descriptions (home + 3 pages) | `AGENT-DRAFTS` from confirmed facts. Do not use "AI Engineer". |

---

## 15. Private: never publish
- Phone number, WhatsApp, Telegram
- Everything personal, family and financial in `data.md` (date of birth, family names, money and pricing discussions, earnings, savings, self-ratings)
- His private technical environment, local paths, internal addresses, credentials, tokens, API keys
- Internal debugging history, unpublished project data, NDA or client data
- The 47 team number as a ranking, and any `EXCLUDED` item

---

## 16. Assets

| Asset | Status |
|---|---|
| Professional photo | Received: `assets/eklavya-photo.png` |
| Offer letter (proof only) | Received: `assets/proofs/ecell-iitb-campus-ambassador-offer-letter.png` |
| Project screenshots | Agent captures from live demos; Viral AI README has two |
| Logo / initials mark | Agent proposes |
| Resume PDF | Agent generates for review |
| Open Graph images | Agent designs from `brand.md` |

---

## 17. Decisions log (all resolved)
- Role line: AI-Powered Full Stack Developer, learning AI Engineering (not "AI Engineer").
- Odoo: Grand Finale (offline final) = Dealflow360; virtual round = TransitOps. "47" is a team number, not a rank.
- Cognivia: 4th of 152 teams (not 153).
- Finalist count: five events (section 6), so "5x", replacing the old "3x".
- HackBaroda and FlowZint: finalist.
- Fresher's Party Night Edition: participant only.
- Websites: demo templates, not clients.
- Vasudha: live features as listed; double-entry bookkeeping and owner assistant are planned (coming soon).
- Removed from all documents at his request: two projects that are no longer part of the portfolio.
- Viral AI: "multi-agent platform, in development".
- Email: click-to-mail button only. Connect set: LinkedIn, GitHub, X, Instagram (Clients only), Discord, contact form.

## 18. Recommended fixes on his public profiles (his call, optional)
So recruiters see one consistent story: GitHub README says "AI Engineer" (should match the lead role line), lists TransitOps for the Odoo Grand Finale (should be Dealflow360), says Cognivia 153 (should be 152), says "3x finalist" (now 5), describes Viral AI as "7-agent" with MongoDB (should match the repo), shows the email in plain text, and still lists the two removed projects.

## 19. Proof register (supplied by Eklavya)

The assistant read only the offer-letter image. All `lnkd.in` links are **unverified by the assistant**. The agent opens each link, or asks for a screenshot if it is blocked, and uses the exact wording shown there.

| Claim | Proof |
|---|---|
| IIT Roorkee + Microsoft Elite AI & DS (2026 to 2027) | https://lnkd.in/p/dSUsuuGY, plus many program emails he holds |
| Bharatiya Antariksh Hackathon 2026 (ISRO) | https://lnkd.in/p/d5bMbe2e (certificate image promised, not yet shared) |
| HackBaroda 2026 finalist | Certificate https://lnkd.in/p/dN8ekj3T · CiteMind demo https://cite-mind-six.vercel.app/ · post https://lnkd.in/p/db_rpbvE |
| FlowZint AI finalist | https://lnkd.in/p/d3qAGijh |
| Cognivia finalist | https://lnkd.in/p/dp2KxQHM |
| PU CODE 3.0 finalist | https://lnkd.in/p/d5D8pskZ |
| Odoo Hackathon 2026 Grand Finale | https://lnkd.in/p/dmg9SvCY |
| SIH Student Coordinator 2026 | https://lnkd.in/p/dkZpTypz |
| Campus Ambassador, E-Cell IIT Bombay | Offer letter image dated 29 June 2026 (`assets/proofs/...`): position "Campus Ambassador", work-from-home, signed by two Overall Coordinators |
| Top Prompt Creator (Google Student Ambassador) | https://lnkd.in/p/da2ZM8tA |
| Fresher's Party Night Edition (participant) | https://lnkd.in/p/dCu_MypE |
| Vasudha live | https://vasudha-the-manager.vercel.app/ (not opened by the assistant) |