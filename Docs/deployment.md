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
| Host | **Cloudflare Workers with static assets**; `src/worker.ts` supplies the contact endpoint and serves the Astro build | DECIDED |
| Domain | Keep `eklavya.dpdns.org` for now. No purchase. | LOCKED |
| Old-site redirect | Not needed: same domain, same repo, old code is replaced | LOCKED |
| Contact form | Cloudflare Worker plus Turnstile and Web3Forms (`connect-and-forms.md`) | DECIDED |
| Analytics | Umami Cloud, free Hobby plan | DECIDED |
| Cost | 0 | |

## 2. Why leave GitHub Pages
- It serves static files only. There is no server code, so no contact-form endpoint and no server-side Turnstile check.
- On a free personal account, GitHub Pages works only from a **public** repository. That conflicts with the private-repo decision.
- Little control over headers and redirects.

## 3. What is possible

| Option | Works for this site? | Trade-off |
|---|---|---|
| A. Cloudflare Pages | Static hosting works, but the current contact Worker would not be deployed by a Pages-only configuration | Not selected. |
| **B. Cloudflare Workers with static assets** (selected) | Yes: `src/worker.ts` handles `/api/contact`; the `ASSETS` binding serves `dist/client` | Configuration lives in `wrangler.jsonc`. |
| C. Stay on GitHub Pages | Static site only | Repo must stay public, form needs a third-party service, no own endpoint |
| D. Netlify or Vercel | Possible | Free-plan terms for a portfolio that wins paid work were not checked. **ASK** before considering. |

The choice between A and B is not visible to visitors. This repository currently implements option B.

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
2. In Cloudflare: **Workers & Pages -> Create -> Import a repository**. Select this GitHub repository. Use root directory `/`, build command `npm run build`, deploy command `npx wrangler deploy`, and Node.js `22` or newer. `wrangler.jsonc` serves `dist/client` and routes `/api/*` through the Worker.
3. Add the secrets from section 7.
4. Test the generated `pages.dev` preview with `qa-checklist.md`, including a real contact-form submission. **Nothing changes for visitors yet.**
5. **Cutover day.** In Cloudflare, add `eklavya.dpdns.org` as a site on the **Free** plan. Copy the two nameservers it gives you.
6. In the DigitalPlat dashboard, replace the nameservers with Cloudflare's two. Wait until Cloudflare shows the site as **Active** (minutes to a few hours).
7. In the Cloudflare project, add `eklavya.dpdns.org` (and `www`) as custom domains. Wait for the certificate to become active.
8. Open the live address on your phone using mobile data. Run the quick checks in `qa-checklist.md` section 11.
9. Only now merge `rebuild` into `main`. Old code leaves `main`.
10. In GitHub: Settings, Pages, unpublish. Remove the custom domain there and delete any old `CNAME` file.
11. In GitHub: Settings, change visibility to **Private**. (Doing this before step 10 would take the old site down early.)
12. Add the domain to Google Search Console with the DNS TXT method, and submit the sitemap (`seo.md` section 11).
13. Add the new site to your LinkedIn Website field and GitHub profile.

**If the nameserver change does not work** (dashboard issue or domain problem): the site still works on its free `pages.dev` address. Share that address until the domain is fixed, and keep GitHub Pages running for the old domain meanwhile.

## 7. Secrets and environment (names only, no values in the repo)

| Name | Type | Purpose |
|---|---|---|
| `TURNSTILE_SITE_KEY` | public Worker variable | Public widget key served by `GET /api/contact/config`; available without rebuilding static HTML |
| `PUBLIC_TURNSTILE_SITE_KEY` | optional public alias | Supported as a runtime alias or build-time fallback for static previews |
| `TURNSTILE_SECRET` | secret | Server-side token check |
| `WEB3FORMS_ACCESS_KEY` | secret | Server-side delivery; Web3Forms links this key to the recipient inbox |
| `TURNSTILE_HOSTNAMES` | variable | Comma-separated production and preview hostnames accepted by server-side Turnstile validation |
| `UMAMI_WEBSITE_ID` | public | Analytics script |

Secrets are set in the Cloudflare dashboard. Local copies live in git-ignored files. A `.env.example` with empty values is committed so you can see what is needed.

For the existing production Worker `eklavya-jha-portfolio`, configure the site key and both secrets under **Settings > Variables and Secrets**, not only **Build > Variables and Secrets**. Local `.env` values are not uploaded as production secrets. `TURNSTILE_HOSTNAMES` is declared in `wrangler.jsonc`; `keep_vars` preserves dashboard-managed public variables during deployments. The widget must allow `eklavya-jha-portfolio.eklavya.dpdns.org`.

Verification order: request `/api/contact/config` (only the public key is returned), load a fresh Turnstile token with action `contact`, submit once, and check Worker logs for `contact_delivery_accepted`. Provider acceptance alone does not prove inbox arrival; inspect the received email and its Reply-To.

Production verification on 2026-10-17: the Worker originally had only the `ASSETS` binding, while the static frontend expected a missing `PUBLIC_TURNSTILE_SITE_KEY`. Restored both secret bindings, the public runtime site key and the exact hostname allowlist. All three live widgets generated tokens with action `contact` and the production hostname. A labelled Recruiter test was accepted by Web3Forms and Eklavya confirmed arrival in the primary inbox. Explicit Reply-To/audience/source fields are covered by Worker tests; received email headers were not independently inspected.

## 8. Branches, previews and checks
- `main` deploys to production when Cloudflare Git integration is enabled. Keep preview builds enabled for pull requests.
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
