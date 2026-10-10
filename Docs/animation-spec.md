# animation-spec.md — Intro Animation Specification

> Read together with `CLAUDE.md` and `brand.md`. Global rules there apply here.
> Facts, stats, projects and proofs: `content-brief.md` (it wins on any conflict). Headlines, CTAs and end-card lines: `copy-deck.md`.
> Tags: **LOCKED** = approved by Eklavya · **PROPOSED** = timing/motion suggestion, the agent may tune it · **AGENT-DRAFTS** = the agent proposes 2 options, he picks in chat.
> All words, names, numbers and project names shown in the animation come from the page's data file (see `CLAUDE.md` section 8). Never hardcode them.

---

## 1. Purpose
In about 25 seconds, each audience page answers three questions for its visitor: who is he, what proof exists, how do I act. Then it hands over to the page content below.

## 2. Core decisions (LOCKED)
- Three pages, three separate animations: Recruiter / HR, Teams & Communities, Clients. Same skeleton, different content. Nothing from one page's animation appears on another.
- Length: about 25 seconds (in-page). Skip and Replay always available.
- Plays once, no endless loop.
- DOM and SVG only. No `<canvas>` (SEO).
- One master timeline per page, driven by a single time value `t`, so play, pause, seek, skip, replay and rewind are consistent.
- The page's static content renders first. The animation is an enhancement on top.
- Sound: muted by default with an optional toggle.

## 3. Engine requirements
- One master timeline object per page with the API: `play()`, `pause()`, `seek(t)`, `restart()`, `skip()` (jumps to the final state), `progress()`.
- Deterministic: the same `t` always produces the same frame. No unseeded randomness. (This makes the Phase 2 reels possible.)
- Library: GSAP or Framer Motion (free). If neither fits, **ASK**.
- Timeline is built from data. Durations adapt to the data (see section 7), but total length never exceeds 25 seconds.
- Animate `transform` and `opacity` only. No layout-triggering properties (no animating `width`, `height`, `top`, `left`).
- Use `will-change` sparingly and remove it after use.
- Target 60 fps on mid-range phones.

## 4. Controls and states
| Element | Behaviour |
|---|---|
| Skip | Always visible. Jumps to the final state and reveals the page content. |
| Replay | Appears at the end. Restarts the timeline. |
| Pause / play | Tap on the stage toggles. Keyboard: Space. |
| Sound toggle | Off by default. Remembers choice for the session. |
| Progress indicator | Thin bar in `--accent` showing timeline progress. |

States to handle:
- **Loading:** content visible immediately, the animation starts when its assets are ready. Never show a blank page.
- **Reduced motion:** skip the timeline, show the final state with static content.
- **No JavaScript:** the full content is still readable (static HTML).
- **Slow device / low battery:** if frames drop, shorten or skip automatically (**PROPOSED**).
- **Tab hidden:** pause and resume on return.
- **Return visit in the same session:** show the final state directly with a Replay button (**PROPOSED**).

## 5. Stage skeleton (LOCKED, content per page below)

| Stage | Time | What the visitor learns |
|---|---|---|
| 1. Identity | 0-5s | Who he is, what he does, where he studies |
| 2. Proof of work | 5-15s | What he has built, with real evidence |
| 3. Hard work | 15-21s | How he got here |
| 4. Action | 21-25s | What to do next |

### Stage 1 · Identity (0-5s)
| Time | Beat | Motion (PROPOSED) |
|---|---|---|
| 0.0-1.0 | Logo / initials mark | Draws in, then settles to the corner |
| 1.0-2.5 | Name | Letter by letter or masked line reveal |
| 2.0-3.5 | Role line | Types in word by word, key words in `--accent` |
| 3.0-4.5 | Profession tags | Pop in one by one, 0.15s stagger |
| 3.5-5.0 | College name and details, professional photo | Photo slides in, details fade up |

Content sources: role line, tags, college and education from `content-brief.md` sections 1 and 2; hero lines and end-card lines from `copy-deck.md` (first option is the default). Photo: `assets/eklavya-photo.png`. It has a white background, so place it in a light rounded frame on the dark stage or remove the background.

### Stage 2 · Proof of work (5-15s)
Beat order is the same, content differs per page (section 6).
| Time | Beat | Motion (PROPOSED) |
|---|---|---|
| 5.0-8.0 | Stat cards (real numbers only) | Count up with ease-out |
| 8.0-13.0 | Featured project cards (real screenshots) | Slide in one at a time with soft blur, hold about 1.2s each |
| 13.0-15.0 | Tools / tech | Pills fly past, or icons assemble into a system |

Content sources (`content-brief.md`): stats from section 7, max 3 (5x Hackathon Finalist; Odoo Grand Finale selected from 20,000+ applicants; Cognivia 4th of 152 teams). Featured projects from section 5.1: Vasudha, Dealflow360, Viral AI (cap 4, three exist), each with its status badge (Live / In development). Dealflow360 shows no repo or GitHub button. Planned features (double-entry bookkeeping, owner assistant) never animate as live; show them only under "Coming soon" outside the animation. Demo templates never appear in the animation. Tools/tech only from the skills evidenced in section 4.

### Stage 3 · Hard work (15-21s)
| Time | Beat | Motion (PROPOSED) |
|---|---|---|
| 15.0-21.0 | Learning and building journey (education, programs, milestones) | Timeline travels left to right, one node per milestone |

Content: the milestones in `content-brief.md` section 8. No invented hours, streaks or numbers.

### Stage 4 · Action (21-25s)
| Time | Beat | Motion (PROPOSED) |
|---|---|---|
| 21.0-23.0 | End-card line | Fades up |
| 22.0-25.0 | Primary CTA (+ secondary) | Gentle pulse, then a sticky CTA bar remains |

CTA labels and end-card lines come from `copy-deck.md`. Connect actions follow `content-brief.md` section 12: email only as a click-to-mail button (the address is never shown as text), LinkedIn, GitHub, X, Discord as a "Copy Discord username" button, Instagram on the Clients page only, and the contact form. No call booking.

## 6. Per-page storyboard (focus differs, skeleton identical)

### Recruiter / HR
- Stage 2 emphasis: skills, tech stack, projects, education.
- Stage 3 emphasis: education, programs, certifications.
- CTA: Resume download (primary), click-to-mail or LinkedIn (secondary).
- Reader mindset: scan fast, verify fast. Show the stack early and make the resume one click.

### Teams & Communities
- Stage 2 emphasis: architecture diagram that draws itself (SVG), teamwork, leadership, events.
- Stage 3 emphasis: collaboration and event/club involvement.
- CTA: Connect to collaborate: LinkedIn, Discord (copy username), click-to-mail, contact form.
- Reader mindset: can he build, lead and work with a team?

### Clients
- Stage 2 emphasis: the Vasudha case study (live client system; confirmed features and role only, no invented results), plus Viral AI as an AI example. Demo templates sit below the animation, labelled "Demo template".
- Stage 3 emphasis: how he works (process), reliability.
- CTA: Contact form (primary), Instagram (secondary). No call booking.
- Reader mindset: will he solve my problem? Plain language, minimal jargon.

Projects per page: `content-brief.md` section 5.3. Stats per page: **AGENT-DRAFTS** from section 7 (max 3), approved in chat. Copy: `copy-deck.md`.

## 7. Data bindings and future-proofing (PROPOSED)
The timeline reads from the page's data file. Suggested fields:
- `identity`: name, role line, tags[], college, photo, mark
- `stats[]`: label, value (real only)
- `projects[]`: title, one-line outcome, screenshot, `featured` flag, `status` (live / in-development / coming-soon / demo-template)
- `tools[]`: name, icon
- `journey[]`: label, date, short text
- `cta`: primary, secondary

Rules:
- Only items marked `featured: true` appear in the animation, **capped at 4 projects and 3 stats**, so the animation never grows beyond 25 seconds when Eklavya adds more projects in 2027-28. All other items still appear in the page content below.
- Beat durations are computed from the item count within the stage's time window. Missing optional data (for example no certificates) removes that beat instead of leaving a gap.
- Adding or removing items must never require changing animation code.

## 8. Sound (LOCKED: muted by default)
- Optional toggle, never autoplays.
- If on: Web Audio API only (soft background beat, light whoosh on stage changes), no audio files.
- Volume low. Respect the system mute state. Fades out on Skip.

## 9. Accessibility
- Never hide essential content behind the animation. The static content is complete without it.
- No flashing faster than 3 times per second.
- Reduced-motion users get the final state.
- Keyboard: Tab reaches Skip, Replay, Sound; Space pauses.
- Meaningful text alternatives for the photo, diagrams and screenshots.
- Animated text is real text in the DOM (readable by screen readers and Google). Avoid duplicating it for screen readers.

## 10. Performance budget (PROPOSED)
- Critical content paints before animation assets load.
- No layout shift from the animation (reserve space for the stage).
- Animation code lazy-loaded after the main content.
- Images in WebP, correct dimensions, lazy-loaded off-screen.
- Test on a mid-range phone with throttled CPU and network.

## 11. Phase 2 hooks (shareable reels)
- The same timeline must be able to run in a "reel mode" at 1920x1080 for a 15-second cut, using the same data files.
- Therefore the timeline must expose `seek(t)` and be fully deterministic.
- Reel mode must not create a duplicate indexable URL (canonical to the main page).
- Reel timing guideline: 0-3s identity, 3-9s proof, 9-12s tools and hard work, 12-15s CTA. Final timing: **ASK** later.

## 12. Acceptance checklist
- [ ] Opening the page URL directly shows content first, animation after
- [ ] Total length does not exceed 25s with any amount of data
- [ ] Skip, Replay, Pause and Sound toggle work with mouse, touch and keyboard
- [ ] Reduced-motion and no-JS states are complete
- [ ] 60 fps on a mid-range phone, no layout shift
- [ ] All text and numbers come from the data file
- [ ] Nothing from another audience's page appears
- [ ] No phone number, WhatsApp or Telegram anywhere
- [ ] The email address is never visible as text anywhere
- [ ] No "AI Engineer" title; planned features carry "Coming soon"; demo templates carry "Demo template"

## 13. Open items
- None that need Eklavya to edit files. The agent proposes the per-page stat selection and any timing or motion tweaks, and he approves in chat.