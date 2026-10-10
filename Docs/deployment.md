# deployment.md — Hosting, Domain, Redirects, Analytics

> Read with `CLAUDE.md`, `tech-stack.md` (sections 3.7 to 3.9), `seo.md` (sections 4, 7, 11), `connect-and-forms.md`.
> Facts about hosts and plans were checked in October 2026. Free-tier terms change, so re-check before relying on any limit.
> Tags: **LOCKED** = approved by Eklavya · **DECIDED** = approved default · **PROPOSED** = needs one OK · **ASK**.

---

## 1. Decisions

| Topic | Decision | Tag |
|---|---|---|
| Repository | The existing GitHub repo. The new portfolio replaces the old code. Built on a branch first. | LOCKED |
| Repo visibility | Private, switched **after** the new host is live | DECIDED |
| Host | Move off GitHub Pages to **Cloudflare** (Workers with static assets; Cloudflare Pages is the equal fallback) | PROPOSED |
| Domain | Keep `eklavya.dpdns.org` for now. No purchase. | LOCKED |
| Old-site redirect | Not needed: same domain, same repo, old code is replaced | LOCKED |
| Contact form | Cloudflare Worker plus Turnstile (`connect-and-forms.md`) | DECIDED |
| Analytics | Umami Cloud, free Hobby plan | DECIDED |
| Cost | 0 | |

## 2. Why leave GitHub Pages
- It serves static files only. There is no server code, so no contact-form endpoint and no server-side Turnstile check.
- On a free personal account, GitHub Pages works only from a **public** repository. That conflicts with the private-repo decision.
- Little control over headers and redirects.

## 3. What is possible

| Option | Works for this site? | Trade-off |
|---|---|---|
| **A. Cloudflare Workers with static assets** (recommended) | Yes: static pages, form endpoint, Turnstile, custom domain | Cloudflare now recommends it for new projects. Slightly newer setup than Pages. |
| B. Cloudflare Pages | Yes, same result for this site. Pages Functions can run the form. | Still supported, but new features go to Workers. |
| C. Stay on GitHub Pages | Static site only | Repo must stay public, form needs a third-party service, no own endpoint |
| D. Netlify or Vercel | Possible | Free-plan terms for a portfolio that wins paid work were not checked. **ASK** before considering. |

The choice between A and B is not visible to visitors. The agent uses A unless a framework adapter works better with B.

## 4. The domain: what to know
- `eklavya.dpdns.org` is a free name from DigitalPlat FreeDomain. DigitalPlat does not host DNS, so you point the name to an outside DNS provider by setting nameservers in their dashboard. Cloudflare's free DNS is the standard choice.
- **Renewal risk:** per community guides, a registration lasts one year and can be renewed within a window before it expires. **Confirm the exact rule in the DigitalPlat dashboard** and set a calendar reminder about 60 days before expiry. If it lapses, your site, resume and reel links all stop working.
- Free subdomains can be filtered by some security tools and look less trusted than your own domain. Accepted for now. Migration path is in section 11.

## 5. Before touching anything
- [ ] Work on a branch (`rebuild`). Keep `main` (the old site) live until cutover.
- [ ] Check the repo history for secrets: search commits for `.env`, tokens, keys, `data.md`. If anything sensitive was ever committed, rotate it and consider a fresh repo instead of rewriting history.
- [ ] Open the DigitalPlat dashboard and note where DNS is hosted now. **Screenshot all current DNS records** (this is the rollback).
- [ ] Add to `.gitignore`: `private-proofs/`, `data.md`, `.env`, `.env.local`, `.dev.vars`, `reels-out/`.

## 6. Cutover steps (do in order)
1. Create a free Cloudflare account.
2. In Cloudflare, create a new project from the GitHub repo. Start with the `rebuild` branch so you get a preview. Build command and output folder depend on the framework (set in `tech-stack.md` once chosen).
3. Add the secrets from section 7.
4. Test the preview address (the free `workers.dev` or `pages.dev` address) with `qa-checklist.md`. **Nothing changes for visitors yet.**
5. **Cutover day.** In Cloudflare, add `eklavya.dpdns.org` as a site on the **Free** plan. Copy the two nameservers it gives you.
6. In the DigitalPlat dashboard, replace the nameservers with Cloudflare's two. Wait until Cloudflare shows the site as **Active** (minutes to a few hours).
7. In the Cloudflare project, add `eklavya.dpdns.org` (and `www`) as custom domains. Wait for the certificate to become active.
8. Open the live address on your phone using mobile data. Run the quick checks in `qa-checklist.md` section 11.
9. Only now merge `rebuild` into `main`. Old code leaves `main`.
10. In GitHub: Settings, Pages, unpublish. Remove the custom domain there and delete any old `CNAME` file.
11. In GitHub: Settings, change visibility to **Private**. (Doing this before step 10 would take the old site down early.)
12. Add the domain to Google Search Console with the DNS TXT method, and submit the sitemap (`seo.md` section 11).
13. Add the new site to your LinkedIn Website field and GitHub profile.

**If the nameserver change does not work** (dashboard issue or domain problem): the site still works on the free `workers.dev` / `pages.dev` address. Share that address until the domain is fixed, and keep GitHub Pages running for the old domain meanwhile.

## 7. Secrets and environment (names only, no values in the repo)

| Name | Type | Purpose |
|---|---|---|
| `TURNSTILE_SITE_KEY` | public | Turnstile widget on the form |
| `TURNSTILE_SECRET` | secret | Server-side token check |
| `CONTACT_TO_EMAIL` | secret | Where form messages go, and the click-to-mail value |
| Email provider key | secret | Sending form mail (name depends on provider) |
| `UMAMI_WEBSITE_ID` | public | Analytics script |

Secrets are set in the Cloudflare dashboard. Local copies live in git-ignored files. A `.env.example` with empty values is committed so you can see what is needed.

## 8. Branches, previews and checks
- `main` deploys to production. Any other branch or pull request gets its own preview address.
- On every push, GitHub Actions runs: install, lint, type-check, content validation (`content-schema.md` section 5), build, forbidden-pattern scan, Lighthouse, axe accessibility check, link check (details in `qa-checklist.md`).
- **PROPOSED:** make these checks required on `main`, so a red build never goes live.

## 9. Redirects, HTTPS, headers
- HTTP redirects to HTTPS (Cloudflare "Always Use HTTPS").
- **Canonical host: `eklavya.dpdns.org` without `www`.** `www` redirects (301) to it.
- Trailing-slash style is consistent across all pages (`seo.md` section 4).
- **Old URLs:** the old site's paths will return 404 on the new site. The custom 404 page (noindex) links to Home. After launch, check Search Console for old URLs still indexed and add 301s to the nearest new page. **ASK** at that point.
- **Security headers (PROPOSED):** HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a minimal `Permissions-Policy`, and a Content-Security-Policy that allows only the site, Turnstile and Umami scripts. The agent checks how the chosen host sets headers (a `_headers` file or Worker code).
- Reel mode pages carry `noindex` and a canonical to the main page (`reels-spec.md`).

## 10. Analytics (DECIDED: Umami Cloud, free Hobby)
- Free plan as of October 2026: about 100,000 events per month, 6 months of history, no cookies. Page views and custom events both count toward the limit. **Check usage monthly.**
- Script loaded with `defer`, after the critical content, with Do-Not-Track respected (**PROPOSED**).
- Events (names only, never personal data):

| Event | Data sent |
|---|---|
| Page view | automatic, per audience page |
| `cta_click` | page, which CTA |
| `resume_download` | none |
| `form_submit` | page, audience (never name, email or message) |
| `animation_skip`, `animation_replay` | page |
| `sound_toggle` | page, on or off |

## 11. Later: moving to your own domain
1. Buy the domain (needs Eklavya's approval, **ASK**).
2. Add it as a custom domain on the same project.
3. Add a Cloudflare redirect rule: old `eklavya.dpdns.org` to the new domain (301).
4. Change `siteUrl` in `site.json`. Canonical tags, sitemap, Open Graph and JSON-LD all read from it, so this is one edit.
5. Update LinkedIn, GitHub, the resume PDF and the reel end cards. Re-scrape link previews. Re-submit the sitemap in Search Console.

## 12. Rollback
- Bad deploy: redeploy the previous version from the Cloudflare dashboard, or revert the commit in Git.
- Bad cutover: while GitHub Pages is still enabled (before step 10), put the old DNS records back from your screenshot.

## 13. Ongoing
- Domain renewal reminder in the calendar.
- Monthly: Lighthouse on all four pages, Umami event count, dependency updates.
- After every content change: push, wait for the green check, open the live page.

## 14. Spec changes this file implies
- `tech-stack.md`: host = Cloudflare (3.7), analytics = Umami (3.8), repo = private (section 7, question 8). Questions 4 to 8 are answered except the framework.
- `CLAUDE.md` file index: add `assets-checklist.md` and mark the six new files as written.

## 15. Acceptance checklist
- [ ] Live site opens on `https://eklavya.dpdns.org/` for all four pages
- [ ] `http://` and `www` both redirect to the canonical address
- [ ] 404 page works and is noindex
- [ ] Contact form works on the live site (all states)
- [ ] Repo is private, GitHub Pages is unpublished
- [ ] No secrets in the repo
- [ ] Umami receives page views and the listed events
- [ ] Search Console verified and sitemap submitted
- [ ] Domain renewal reminder set