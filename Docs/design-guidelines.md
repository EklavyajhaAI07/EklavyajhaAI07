# Design Guidelines

The site's current aesthetic direction is a strength — keep it. These are the elements to preserve while fixing content/performance/accessibility, and the boundaries for how far visual changes should go.

## Preserve
- **Dark "engineering console" theme** — dark background, monospace-adjacent technical feel.
- **Typography pairing** — Syne (display/headings) + Outfit (body) via Google Fonts.
- **Brand mark** — "EKLAVYA®" wordmark in nav/footer.
- **Signature motion details** — glow sphere in hero, marquee text band ("CREATIVITY — VIRTUALIZATION — AI ENGINEERING"), smooth-scroll feel (Lenis), scroll-triggered reveals (GSAP ScrollTrigger).
- **Section structure** — Hero → immersive marquee → About → Projects → Skills → Stack → CTA → Footer. Don't reorder without a stated reason.
- **"Broken grid" project layout style** already implied by the `project` section class — an asymmetric, non-generic-template layout is part of the differentiation vs. typical portfolio templates.

## Fix without abandoning
- **Performance:** the motion/interaction layer should feel the same to a visitor but cost far less to load. Prefer trimming unused libraries (e.g. Three.js if not actually rendering anything) over removing the effects visitors actually see.
- **Custom cursor:** keep it, but make it respect `prefers-reduced-motion` and never be the only way to interact with something (keyboard nav must work independently).
- **Icon system:** consolidate on one (Lucide is already loaded and used) rather than running Font Awesome + Lucide side by side — visually this should be close to invisible to the end user if icon choices are matched carefully.

## New elements — how to fit them into the existing style
- **Proof/metrics strip:** style as compact stat blocks or a horizontal ticker, consistent with the console/terminal aesthetic (e.g. monospace numbers, thin dividers) — not generic rounded "card" stats that would clash with the sharp/technical look.
- **Resume/contact CTA:** style as a secondary button consistent with the existing `.cta-btn` / `.btn-minimal` classes — don't introduce a new button style.
- **Project case study content:** if expanding beyond a card (e.g. modal or expanded view), keep the terminal/console visual language (monospace tags for tech stack, sharp corners, existing color palette) rather than switching to a soft/rounded card system.

## Explicitly avoid
- Don't turn this into a generic "template" look (rounded soft-UI cards, stock gradient backgrounds, generic sans-serif) to fix performance — the distinctive look is doing real work for a portfolio in a crowded field.
- Don't add content sections not backed by `content-source.md` just to "fill space" (e.g. fake testimonials, placeholder logos).
- Don't silently drop the motion/interaction identity in the name of performance — trim libraries, don't gut the feel.
