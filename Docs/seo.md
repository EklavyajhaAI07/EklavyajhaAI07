# seo.md — Search, Sharing and Structured Data

> Facts and wording limits: `content-brief.md` (FINAL v5, it wins on any conflict). Structure: `CLAUDE.md` section 10 and `page-specs.md`. Data: `content-schema.md`.
> Tags: **LOCKED** = approved by Eklavya · **AGENT-DRAFTS** = the agent proposes final copy, he picks in chat · **DECIDED** = chosen by Claude on his delegation.

---

## 1. Goals and honest expectations
- **LOCKED:** Home and all three dedicated pages are indexable by Google.
- Goal 1: someone who searches **"Eklavya Jha"** finds the site, his LinkedIn and GitHub, and they all tell one story.
- Goal 2: links shared on LinkedIn, Instagram DMs and email look good and load fast.
- Goal 3: the right audience lands on the right page when he sends a direct link.
- Honest note: a new site takes weeks to be indexed and longer to rank for a person's name. Competing pages with the same name may rank first at the start. Consistent profiles (section 9) and linking the site from LinkedIn and GitHub speed this up. No ranking is promised.

## 2. Indexing rules (LOCKED)
- Home, the Recruiter / HR page, the Teams & Communities page and the Clients page: `index, follow`.
- Each page has a self-referencing `<link rel="canonical">`.
- `noindex`: the 404 page, and (Phase 2) any reel mode URL, with a canonical pointing to its main page.
- The pages must contain **real visible text and real HTML at load time**. The animation is an enhancement; content is never only inside the animation, a canvas or an image.
- What search engines see must match what visitors see (no hidden or different text).
- `lang="en"`. No hreflang (English only).

## 3. Titles and descriptions
Rules: title up to 60 characters, description up to 155. One unique title, description and `<h1>` per page. Lead with the confirmed role line "AI-Powered Full Stack Developer". **Never use "AI Engineer".** Every claim must be in the brief.

Starter drafts (the agent may refine, Eklavya picks in chat):

| Page | Title (chars) | Description (chars) |
|---|---|---|
| Home | Eklavya Jha \| AI-Powered Full Stack Developer (45) | Eklavya Jha is an AI-powered full stack developer in Ahmedabad, learning AI engineering. Choose your path: recruiters, teams or clients. (136) |
| Recruiter / HR | Eklavya Jha \| AI-Powered Full Stack Developer Resume (52) | AI-powered full stack developer and 5x hackathon finalist. See Eklavya Jha's projects, skills and certificates, and download his resume. (136) |
| Teams & Communities | Eklavya Jha \| 5x Hackathon Finalist, Campus Ambassador (54) | 5x hackathon finalist and E-Cell IIT Bombay Campus Ambassador. See Eklavya Jha's team builds, hackathon record and community work. (130) |
| Clients | Eklavya Jha \| AI-Powered Web Apps for Real Business Needs (57) | AI-powered web apps and prototypes. See a live client system, demo templates and how to start a project with Eklavya Jha. (121) |

`<h1>` per page: the page headline from `page-specs.md` (Home: "Eklavya Jha, AI-Powered Full Stack Developer").
Headings use a logical order (one `h1`, then `h2` per section). Section names are descriptive ("Projects", "Hackathons and certificates", "Case study: Vasudha").

## 4. URLs
- The agent chooses clean, lowercase, descriptive slugs and keeps them stable (`CLAUDE.md` section 3). Use a trailing-slash convention consistently.
- Redirects: `www` and non-`www` resolve to one host; HTTP redirects to HTTPS.
- **Open technical item:** his old site `eklavya.dpdns.org` is public and may be indexed. When the new site goes live, decide in `deployment.md` whether to 301-redirect it to the new domain. This is not decided in the brief, and the agent proposes the option; it never silently deletes it.

## 5. Open Graph and social previews (DECIDED)
- Per page: `og:title`, `og:description`, `og:type` (`website`; `profile` for Home is optional), `og:url`, `og:image`, `og:locale` = `en_IN`, `og:site_name` = "Eklavya Jha".
- Twitter card: `summary_large_image` with the same title, description and image.
- **Images:** 1200x630, one per page, designed by the agent from `brand.md` (dark stage, one accent, Inter). Text large enough to read as a LinkedIn thumbnail. Include the page's audience line and his name; use his photo only inside the light rounded frame (the original has a white background). No fake logos.
- Alt text for every OG image.
- After launch, test previews with LinkedIn's Post Inspector and one messaging app. Previews are cached, so re-scrape after changes.

## 6. Structured data (JSON-LD)
Allowed: only facts that appear on the visible page and in the brief.

**Home (and optionally each page): `Person` + `WebSite`**
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Eklavya Jha",
  "jobTitle": "AI-Powered Full Stack Developer",
  "description": "AI-powered full stack developer, learning AI engineering.",
  "url": "https://<final-domain>/",
  "image": "https://<final-domain>/assets/eklavya-photo.png",
  "address": { "@type": "PostalAddress", "addressLocality": "Ahmedabad", "addressRegion": "Gujarat", "addressCountry": "IN" },
  "sameAs": [
    "https://www.linkedin.com/in/eklavya-jha-23a54b377",
    "https://github.com/EklavyajhaAI07",
    "https://x.com/EklavyajhaAI07"
  ],
  "knowsAbout": ["Full stack web development", "AI-powered applications", "FastAPI", "Next.js", "TypeScript", "Python"]
}
```
- `knowsAbout` lists only skills evidenced in `content-brief.md` section 4.
- **Never include** `email`, `telephone`, a street address, birth date, or anything from `content-brief.md` section 15.
- **Do not add** ratings, reviews, `AggregateRating`, awards he cannot prove, or an employer he does not have.
- Dedicated pages: add `BreadcrumbList` (Home > page). Optionally a `ProfilePage` wrapper pointing to the same `Person`.
- Validate with Google's Rich Results Test and the Schema Markup Validator before launch.

## 7. Sitemap and robots
- `sitemap.xml` with the four indexable URLs, each with `lastmod` updated on content change. Exclude 404 and reel-mode URLs.
- `robots.txt`: allow all, `Sitemap:` line pointing to the sitemap. Do not block CSS or JS.
- Favicon and app icons from the initials mark.

## 8. Content and linking (DECIDED)
- Each dedicated page has its own unique, substantial text (content isolation helps: no duplicate sections across audiences).
- Internal links: Home links to the three pages via the cards; after the animation each page links to Home and the other two pages. Use descriptive link text.
- External links to his proofs open in a new tab with `rel="noopener"`. Do not add `nofollow` to his own GitHub and LinkedIn.
- Image `alt` text is descriptive and truthful; screenshots show the real project.
- Do not stuff keywords. Natural phrases from the brief only: "AI-powered full stack developer", "Ahmedabad", "hackathon finalist", project names.

## 9. Make the whole web footprint match (his call, optional but valuable)
Search engines and recruiters compare profiles. The fixes listed in `content-brief.md` section 18 (GitHub README and LinkedIn: role line, 5x finalist, Odoo project, Cognivia 152, email shown as text) make every profile say the same thing as the site. Link the new site from LinkedIn (Website field and summary) and from the GitHub profile as soon as it is live.

## 10. Performance and search (Core Web Vitals)
- Targets: LCP under 2.5s, CLS near 0, INP under 200ms on a mid-range phone.
- The animation must not delay the first contentful paint or shift layout (reserve the stage height).
- Images WebP with correct dimensions, lazy-loaded below the fold; fonts with `font-display: swap`.
- Details and budgets: `tech-stack.md` section 6.

## 11. After launch
1. Verify the domain in Google Search Console and submit the sitemap.
2. Use URL Inspection to request indexing for the four pages.
3. Check coverage after about a week and fix any "Excluded" reasons.
4. Watch which queries bring visits (his name, project names) and which page they land on; this guides future copy changes.
5. Re-scrape link previews after any title or image change.

## 12. Privacy checks
- No email address or phone number in meta tags, Open Graph tags, structured data, `sitemap.xml` or any visible text.
- No proof documents (offer letter) in the sitemap or any public path.

## 13. Acceptance checklist
- [ ] Four indexable pages, each with a unique title, description, `<h1>` and canonical
- [ ] Titles up to 60 characters, descriptions up to 155
- [ ] No "AI Engineer" title anywhere (the phrase "Learning AI Engineering" is fine)
- [ ] OG image and Twitter card render correctly for every page
- [ ] `Person` JSON-LD validates and contains no email, phone or unprovable claims
- [ ] `sitemap.xml` and `robots.txt` work; 404 is noindex
- [ ] Content is real HTML at load time, identical to what visitors see
- [ ] Lighthouse SEO and Accessibility 90 or more on every page
- [ ] Search Console verified and sitemap submitted after launch