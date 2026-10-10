# qa-checklist.md — Testing Before Launch and After Every Change

> Read with `animation-spec.md` section 12, `page-specs.md` section 11, `seo.md` section 13, `tech-stack.md` 3.10, `connect-and-forms.md` section 10, `deployment.md`.
> Tags: **MANUAL** = a person tests it · **AUTO** = runs in GitHub Actions · **GATE** = launch is blocked until it passes.
> Page list used below: Home `/`, Recruiter / HR, Teams & Communities, Clients (slugs chosen by the agent), plus the 404 page.

---

## 1. Test devices (DECIDED)

| Device | Browsers | Why |
|---|---|---|
| Android phone: Oppo | Chrome, and the phone's own browser | Mid-range Android, the real target (60 fps goal) |
| Android phone: Vivo | Chrome | Second Android screen size and vendor skin |
| iPhone | Safari | Audio, scrolling and viewport behave differently on iOS |
| Windows laptop | Chrome, Edge, Firefox | Main desktop check |
| Mac (borrowed, optional) | Safari desktop | Only for the final check |

Throttle CPU and network in Chrome DevTools (4x CPU slowdown, "Fast 4G") on the laptop before blaming a phone.

## 2. Direct URL test (GATE, MANUAL)
For each of the four pages and the 404:
- [ ] Open the URL directly in a new tab (not by clicking from Home)
- [ ] Full content is visible before the animation starts
- [ ] Only that page's projects, cards and links appear (content isolation)
- [ ] Other-page links appear only after the animation ends or Skip is pressed
- [ ] Refresh mid-animation and after the end: no broken state
- [ ] The page also opens correctly with and without `www`, and with `http://`
- [ ] 404 page shows a link to Home and is `noindex`

## 3. Animation and states (GATE, MANUAL)
- [ ] Total length is 25 seconds or less
- [ ] Skip jumps to the final state and reveals the content
- [ ] Replay restarts cleanly
- [ ] Pause by tapping the stage, and by Space on keyboard
- [ ] Sound is off by default; the toggle works; sound fades on Skip
- [ ] Tab hidden then shown: pauses and resumes
- [ ] Return visit in the same session: final state with a Replay button
- [ ] Reduced motion on (Windows: Settings, Accessibility, Visual effects, Animation effects off): final state, no motion
- [ ] JavaScript off: all content is readable
- [ ] No flashing faster than 3 times per second
- [ ] `seek(t)` gives the same frame every time (needed for reels)

## 4. Responsive (GATE, MANUAL)
Check at 360, 390, 768, 1024, 1280 and 1920 px wide.
- [ ] No sideways scroll on the page body; wide tables scroll inside their own box
- [ ] Hero stage fits one phone screen without clipping
- [ ] Text never smaller than 14px; touch targets at least 44x44px
- [ ] Sticky CTA bar never covers content on mobile and hides near the connect block
- [ ] Timeline is horizontal on desktop and vertical on mobile
- [ ] Portrait and landscape on a phone

## 5. Speed (GATE, AUTO + MANUAL)
Targets from `tech-stack.md` and `seo.md`:
- [ ] Lighthouse 90 or more for Performance, Accessibility, Best Practices, SEO on every page (mobile mode)
- [ ] LCP under 2.5 s, CLS close to 0, INP under 200 ms
- [ ] The animation never delays first paint and causes no layout shift (stage height reserved)
- [ ] Animation code loads after the main content
- [ ] Images are WebP, correctly sized, lazy-loaded below the fold
- [ ] On the real Oppo or Vivo phone, the animation stays smooth. If frames drop, the slow-device fallback shortens or skips it.

## 6. Accessibility (GATE, AUTO + MANUAL)
- [ ] axe check passes on every page
- [ ] Every interactive element is reachable by Tab, in a sensible order, with a visible focus ring
- [ ] Skip, Replay and Sound are reachable by keyboard
- [ ] Contrast meets WCAG AA for every text and background pair (check each token pair, `brand.md` section 3)
- [ ] All images, diagrams and screenshots have meaningful alt text
- [ ] One `h1` per page, logical heading order
- [ ] Animated text is real text in the page (not an image)
- [ ] Quick screen-reader pass: TalkBack on Android or VoiceOver on iPhone, on one page

## 7. Content and honesty rules (GATE, AUTO + MANUAL)
- [ ] Planned features carry "Coming soon" and never appear as live
- [ ] The two demo websites carry "Demo template" and are never called client work
- [ ] Viral AI carries "In development"
- [ ] Dealflow360 has no repo link and no GitHub button
- [ ] Hackathon rows show only Finalist or Participant, never a rank. The number 47 appears nowhere.
- [ ] No percentages for skills; every skill has a proof project
- [ ] Every number on the site exists in `content-brief.md`
- [ ] Instagram appears on the Clients page only
- [ ] Resume download is primary on Recruiter; the contact form is primary on Clients

## 8. Forbidden-pattern scan (GATE, AUTO)
A script (`scripts/check-forbidden`, written by the agent) scans `/content` and the **built HTML, JS and JSON-LD**, and fails the build if it finds:
- a phone-number pattern
- any plain-text email address (pattern `name@domain.tld`)
- the whole phrase "AI Engineer" as his title (whole-word match, so "Learning AI Engineering" stays allowed)
- "rank 47", "WhatsApp", "Telegram"
- anything from `content-brief.md` section 15

MANUAL, once before launch: open each page, press Ctrl+U (view source) and search for `@`, `tel:`, `whatsapp`, `telegram`. Also run the same search on the page after clicking the form and the Discord button.

## 9. Connect and form (GATE, MANUAL)
Full list in `connect-and-forms.md` section 10. Minimum before launch:
- [ ] Click-to-mail opens the mail app on Android and iPhone
- [ ] Discord copy works (and the fallback field works)
- [ ] Form: valid submit arrives in the inbox with the correct audience and reply-to
- [ ] Form: empty fields, bad email and too-short message show clear errors
- [ ] Spam: a filled honeypot and a sub-3-second submit are dropped
- [ ] Spam: a failed Turnstile check is rejected
- [ ] Success and error states are readable and keyboard-friendly
- [ ] External links open in a new tab with `rel="noopener"`

## 10. SEO and sharing (GATE, MANUAL + AUTO)
- [ ] Unique title (60 characters or less), description (155 or less), `h1` and canonical on each page
- [ ] `sitemap.xml` lists the four pages only; `robots.txt` points to it
- [ ] JSON-LD validates in Google's Rich Results Test and the Schema Markup Validator, with no email or phone
- [ ] Share each page link in LinkedIn Post Inspector and one chat app: image, title and description are right
- [ ] Reel-mode URLs are `noindex` with a canonical to the main page
- [ ] Search Console verified, sitemap submitted

## 11. Quick live check after every deploy (MANUAL, 3 minutes)
- [ ] Open all four pages on your phone using mobile data
- [ ] Skip works, one CTA works, the form page loads
- [ ] No console errors (laptop DevTools)
- [ ] The green check showed in GitHub before you opened the page

## 12. Automated checks in GitHub Actions (PROPOSED)
Install, lint, type-check, content validation (`content-schema.md` section 5), build, forbidden-pattern scan, Lighthouse CI, axe, link check. **PROPOSED:** make them required on `main`. A failed link check on a third-party site (for example a blocked `lnkd.in` link) should warn, not block.

## 13. Adding content later (MANUAL, every time)
- [ ] After adding a project, skill, certificate or milestone: the build passes without any code change
- [ ] The new item shows only on the pages listed in its `showOn`
- [ ] The animation is still 25 seconds or less (max 4 projects, 3 stats)
- [ ] Open the live page, not only the preview

## 14. Launch gate
Launch only when every GATE section above is fully ticked on all four pages, on Android, iPhone and Windows.