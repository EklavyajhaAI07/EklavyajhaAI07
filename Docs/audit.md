# Site Audit — eklavya.dpdns.org

Findings only — see `improvement-plan.md` for what to do about each one, and `content-source.md` for the real facts to use when fixing content gaps.

## 🔴 Critical

**1. Projects / Skills / Stack sections render empty.**
`#projects-container`, `#skills-container`, `#stack-container` in `index.html` have no static fallback — they depend entirely on `script.js` to populate at runtime. Confirmed empty when fetched independently of JS execution. Anyone viewing source, on slow JS, or via a crawler sees three headings and nothing else. This is the single biggest gap between the live site and the strong material in the GitHub README.

**2. Client-side "Admin" login is a credibility risk.**
Header nav has an "Admin" item opening a login modal (email input, "Access Denied" message). Any real credential check here runs in visible client-side JS and cannot be secure. On a public resume-facing site this either looks broken/confusing or is an actual security hole. Needs a decision from the user (real feature vs. leftover) before the agent touches it — see improvement plan Task 2.

**3. Portfolio content is far behind the GitHub README.**
Hero/About copy is generic ("Building intelligent systems... ML, DL, LLMs") while the README has specific, verifiable wins (Odoo Hackathon Grand Finale Finalist out of 20,000+, named projects with real user counts, leadership roles). None of it is used on the live site.

## 🟠 High Impact

**4. Unrelated affiliate tracking script.**
First thing in `<head>`, before `<meta charset>`: an Impact.com affiliate tracking script (`utt.impactcdn.com`). Unexplained third-party script, wrong position in `<head>`, no clear purpose for a portfolio.

**5. Heavy JS/CSS payload.**
Three.js (full build), GSAP + ScrollTrigger, Lenis, Lucide via `@latest` (unpinned), full Font Awesome — a lot of weight and render-blocking tags for a single-page site. Lucide unpinned means icons can change/break without warning.

**6. Hotlinked images.**
Hero photo, OG image, and favicon all point to `i.postimg.cc`. Fragile, no cache control, unprofessional for the site's positioning.

**7. Accessibility gaps.**
No `aria-label` on icon-only social links. Custom cursor implementation needs a `prefers-reduced-motion` check and a verified keyboard-navigation fallback. No skip-to-content link.

**8. Weak technical SEO.**
No JSON-LD `Person` schema, no `robots.txt`/`sitemap.xml` in the repo.

## 🟡 Medium

**9. Free subdomain.** `eklavya.dpdns.org` works but a paid `.dev`/`.me`/`.com` domain reads more professional — user decision, not urgent.

**10. No resume download, no direct contact form.** Only a LinkedIn CTA button currently.

**11. No proof/metrics section on-page.** Strong numbers exist (hackathon placements, user counts) but aren't surfaced visually anywhere on the live site.

**12. Stray `package-lock.json`** with no visible `package.json` in the repo — check whether it's unused cruft.

## ✅ Already working well
- Custom domain + GitHub Pages via CNAME is a solid, low-cost setup.
- Meta tags (description, OG title/description/image, article timestamps) are properly filled in.
- Distinctive dark "engineering console" visual identity — worth keeping, just needs to be lighter and backed by real content.
- The GitHub README itself is excellent: well-designed SVG banners, honest metrics, real hackathon record — a great source to mine from (see `content-source.md`).
- Clear nav structure and consistent branding ("EKLAVYA®").

## Benchmark: top portfolios vs. this site today
| What top portfolios do | This site today |
|---|---|
| Real project case studies with outcomes | Empty containers |
| Clear differentiator in first 5 seconds | Generic ML/DL/LLM line |
| Fast load, minimal blocking JS | 5+ heavy libraries loaded upfront |
| Custom professional domain | Free dpdns.org subdomain |
| Resume + clear contact path | LinkedIn button only |
| Social proof surfaced on-page | Buried in README only |
| Self-hosted, optimized images | Hotlinked postimg.cc images |
| Accessible by default | Gaps in labels/motion/keyboard nav |
