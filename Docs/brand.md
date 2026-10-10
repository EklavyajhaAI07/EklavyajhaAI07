# brand.md — Eklavya Jha Portfolio · Brand & Design System

> Read together with `CLAUDE.md`. Global rules there apply here.
> Facts and decisions: `content-brief.md` (it wins on any conflict). Copy: `copy-deck.md`.
> Status tags: **LOCKED** = approved by Eklavya · **DECIDED** = chosen by Claude on his delegation, final unless he says otherwise (change in one place via tokens) · **AGENT-DRAFTS** = the agent proposes 2 options, he picks in chat.

---

## 1. Brand intent
- A developer who builds real systems and delivers. The look must feel confident, clean and credible, never flashy for its own sake.
- Proof beats decoration: real photo, real screenshots, real numbers.
- One site, three audiences. The brand stays identical across all pages. Only copy, proof and CTA change per audience.

## 2. Visual direction (LOCKED)
- **Animation stage:** dark. Charcoal background, off-white text.
- **Sections below the animation (cards, projects, details):** light.
- **Accent:** one colour only, electric blue.
- **Font:** Inter.
- Contrast between dark stage and light content is intentional: the dark stage is the "hook", the light sections are the "proof you can read".

## 3. Colour tokens (DECIDED, delegated to Claude by Eklavya)
Define as CSS variables. Never hardcode hex values in components.

| Token | Value | Use |
|---|---|---|
| `--stage-bg` | `#0B0D12` | Dark animation stage background |
| `--stage-text` | `#F4F5F7` | Text on the dark stage |
| `--stage-muted` | `#9AA3B2` | Secondary text on dark |
| `--accent` | `#3B82F6` | Accent on dark surfaces (electric blue) |
| `--surface-bg` | `#F7F8FA` | Light section background |
| `--surface-card` | `#FFFFFF` | Card background on light |
| `--ink` | `#0E1116` | Primary text on light |
| `--ink-muted` | `#5B6472` | Secondary text on light |
| `--accent-strong` | `#1D4ED8` | Accent on light surfaces (links, buttons, focus rings) |
| `--border` | `#E3E6EB` | Dividers and card borders |
| `--success` / `--error` | `#16A34A` / `#DC2626` | Form states only |

- Only one accent hue is allowed. `--accent` and `--accent-strong` are the same colour family tuned for contrast on dark vs light.
- **Verify every text/background pair with a contrast checker (WCAG AA minimum)** and adjust the hex values if any pair fails. The ratios above are estimates, not measured.
- Do not add extra brand colours without asking Eklavya.

## 4. Typography (Inter, LOCKED)
- Load Inter with `font-display: swap`. Prefer self-hosting or the framework's font optimizer over a render-blocking external stylesheet.
- Weights used: 400, 500, 600, 700.
- Fallback stack: `Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
- Fluid type scale using `clamp()`. Roles (DECIDED):

| Role | Size range | Weight |
|---|---|---|
| Display (hero name on stage) | 40-88px | 700 |
| H1 / H2 | 28-48px | 600-700 |
| H3 | 20-28px | 600 |
| Body | 16-18px | 400 |
| Small / meta | 13-14px | 500 |

- Line height: 1.1-1.2 for headings, 1.5-1.65 for body. Max line length about 65-75 characters.

## 5. Spacing, shape, depth (DECIDED)
- 4px base unit, scale: 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Radius: 12px cards, 999px pills and tags, 10px buttons.
- Light sections: soft, low-opacity shadows plus a 1px `--border`. No heavy drop shadows.
- Dark stage: depth through subtle gradients and blue glow at low opacity, not heavy effects.
- Generous whitespace. One clear focal point per screen.

## 6. Components (style rules)
- **Cards:** white surface, 1px border, 12px radius, consistent inner padding, hover lift of 2-4px (transform only).
- **Buttons:** primary = `--accent-strong` fill with white text; secondary = outline. Visible focus ring in `--accent-strong`. Minimum touch target 44x44px.
- **Tags / pills:** pill shape, small type, muted background.
- **Tech icons:** consistent single style (monochrome or brand colour, pick one and keep it). Use a free icon set.
- **Sticky CTA bar:** appears after the animation, never covers content on mobile.
- **Status badges** (small pill on cards and in the animation): `Live`, `In development`, `Coming soon`, `Demo template`, `Finalist`, `Participant`. Use the neutral muted style for `Demo template`, `Coming soon` and `Participant`; accent only for `Live` and `Finalist`. A badge is required wherever the status is not "Live".
- Card types and which pages they appear on: see `CLAUDE.md` section 7 and `content-brief.md` section 5.3.

## 7. Imagery
- **Photo:** `assets/eklavya-photo.png` (received). It has a plain white background, which looks like a white box on the dark stage. Place it in a light rounded frame, or remove the background cleanly. Consistent crop, rounded-square or circular on the stage. Alt text: "Portrait of Eklavya Jha in a black blazer and white shirt".
- **Project visuals:** real screenshots only, no mock-ups, no stock images (the agent captures them from live demos with private data removed; the Viral AI README already has two). WebP, responsive sizes, lazy-load below the fold, always with alt text.
- **Logo mark:** a simple mark for the intro. **AGENT-DRAFTS**: 2 initials-mark options, Eklavya picks in chat.

## 8. Tone of voice (final copy: `copy-deck.md`; facts: `content-brief.md`)
- Clear, short, confident. Outcomes over buzzwords. Numbers over adjectives.
- Avoid filler like "passionate developer".
- Same voice everywhere, with the emphasis shifting per audience:
  - Recruiter / HR: factual, scannable, skills and growth.
  - Teams & Communities: collaborative, how he builds and works with others.
  - Clients: plain language, problem to result, no jargon.
- Site language: English only (decided).
- Lead with "AI-Powered Full Stack Developer, learning AI Engineering". Never "AI Engineer".

## 9. Motion principles (details in `animation-spec.md`)
- Motion explains, it does not decorate. Every movement introduces information.
- Smooth ease-out for entrances, short durations, no bounce overload.
- Animate `transform` and `opacity` only.

## 10. Accessibility (non-negotiable)
- WCAG AA contrast, visible focus states, full keyboard navigation.
- `prefers-reduced-motion` respected everywhere.
- No flashing content. Text never relies on colour alone.
- Alt text on all images, meaningful link labels.

## 11. Don'ts
- No second accent colour, no gradients on text blocks that hurt legibility.
- No stock photos, fake logos, or invented client names.
- No phone number, WhatsApp or Telegram anywhere (see `CLAUDE.md`). Never show the email address as text.
- No demo template presented as client work, no planned feature presented as live, no 47 team number shown as a rank.
- No hardcoded colours, fonts or spacing outside tokens.

## 12. Open items
- None that need Eklavya to edit files. Logo mark: the agent proposes 2 options and he picks in chat. Icon style: the agent chooses one consistent set.