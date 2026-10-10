# connect-and-forms.md — Connect Section, Contact Form, Spam Protection

> Read with `CLAUDE.md` section 9, `content-brief.md` section 12 (it wins on any conflict), `page-specs.md`, `content-schema.md` 4.9, `tech-stack.md` 3.6.
> Tags: **LOCKED** = approved by Eklavya · **DECIDED** = approved default · **PROPOSED** = agent suggestion, tune or ask · **ASK** = must ask, never assume.
> All labels, button text and wording live in the data files. Nothing here is hardcoded in components.

---

## 1. Rules (LOCKED)
- **Email is never visible text.** Click-to-mail button only. A mail link cannot be perfectly hidden, so the contact form is the stronger path.
- **No phone number, WhatsApp, Telegram, call booking or reply-time line.** Anywhere: code, meta tags, structured data, form.
- **Instagram appears on the Clients page only.**
- The connect block works without JavaScript for plain links and the form. Click-to-mail and Discord copy need JS; without JS the visitor still sees LinkedIn, GitHub, X and the form.
- Static content first: the connect block is real HTML at load time.

## 2. Which link on which page (LOCKED, from the brief)

| Channel | Home | Recruiter / HR | Teams & Communities | Clients | Type |
|---|---|---|---|---|---|
| Resume download | no | **Primary** | no | no | file link |
| Contact form | yes (dropdown "Not sure") | yes (Recruiter) | yes (Teams) | **Primary** (Client) | form |
| Click-to-mail | yes | secondary | yes | yes | action button |
| LinkedIn | yes | secondary | yes (first) | yes | link |
| GitHub | yes | yes | yes | yes | link |
| X | yes | yes | yes | yes | link |
| Discord | yes | yes | yes | yes | "Copy Discord username" button |
| Instagram | **no** | no | no | **Secondary** | link |

Order inside each page's connect block:
- **Home:** click-to-mail, LinkedIn, GitHub, X, Discord, form.
- **Recruiter:** resume, click-to-mail, LinkedIn, GitHub, X, Discord, form.
- **Teams:** LinkedIn, Discord, click-to-mail, X, GitHub, form.
- **Clients:** form, Instagram, click-to-mail, LinkedIn, GitHub, X, Discord.

The order comes from `pages/<page>.json` and `connect.json`, not from code.

**Sticky CTA bar (PROPOSED):** one primary button per page. Recruiter: resume download. Teams: scroll to the connect block. Clients: scroll to the form. Hidden once the connect block is on screen. Never covers content on mobile.

## 3. Behaviour of each channel

| Channel | Behaviour |
|---|---|
| Links (LinkedIn, GitHub, X, Instagram) | New tab, `rel="noopener"`. Descriptive label, not just an icon. |
| Click-to-mail | Address is assembled in the click handler from an encoded value. It never appears in HTML, JSON-LD, sitemap or visible text. **PROPOSED:** the value is injected at build time from a private environment value (`CONTACT_TO_EMAIL`), encoded. Test on Android Chrome and iPhone Safari that the mail app opens. |
| Discord | Button copies the username from `connect.json`. Shows a small confirmation ("copied"). If the clipboard API fails, fall back to a read-only field the visitor can select. |
| Resume | Stable URL, file name contains his name. Download is counted as an analytics event (see `deployment.md`). |

## 4. Contact form

| Field | Type | Required | Rules |
|---|---|---|---|
| Name | text | yes | 2 to 80 characters |
| Email | email | yes | valid format, max 120. Used only to reply. Never shown back on the page. |
| I am a... (audience) | select | yes | Recruiter / Teams & Communities / Client / Not sure. **Prefilled from the page** (Home = "Not sure"). Values: `recruiter`, `teams`, `clients`, `unsure`. |
| Organisation | text | no | max 100 |
| Message | textarea | yes | 20 to 2000 characters, plain text |
| Honeypot | hidden text | no | must stay empty (see section 5) |
| Source page | hidden | auto | page id, set by code |
| Render time | hidden | auto | timestamp when the form was shown |

Not in the form (LOCKED): phone, budget, file upload, call-booking choice.
Under the button: one privacy line (agent drafts the wording): what is collected, used only to reply, not shared.

## 5. Spam protection (DECIDED: honeypot + Turnstile)

Layers, all server-checked (client checks are only for convenience):
1. **Honeypot:** off-screen field, `tabindex="-1"`, `aria-hidden="true"`, `autocomplete="off"`. If filled, drop silently.
2. **Time trap:** a submission under about 3 seconds after render is dropped silently.
3. **Cloudflare Turnstile:** token is verified server-side with the secret key. A failed check shows "Please retry the check".
4. **Server validation:** same rules as section 4, HTML stripped, length limits enforced. **PROPOSED:** reject messages with more than 2 links.
5. **Origin check:** accept requests only from the site's own domain.
6. **Rate limit (PROPOSED):** a few submissions per visitor per hour. **ASK** before using any paid rate-limiting feature.
7. **No logging of message text or email** in server logs.

Silent drops return a normal-looking success so bots learn nothing. Real people never hit layers 1 and 2.

## 6. Delivery (PROPOSED, agent confirms free limits before building)

```
Browser -> POST /api/contact -> validate -> verify Turnstile -> send mail to Eklavya -> { ok: true }
```
- The endpoint is a Cloudflare Worker in the same project as the site (see `deployment.md`).
- **Email sending provider: ASK.** The agent proposes free options (for example a transactional email service with a free tier, or Cloudflare email features) and checks current limits and terms first.
- Mail to Eklavya: subject like `[Portfolio] <audience> - <name>`, body with all fields, **reply-to = the sender's email**.
- **No auto-reply** (DECIDED). The brief has no reply-time promise.
- Nothing is stored after sending (DECIDED). If he later wants a record, **ASK** first.

Secrets (names only, never values in the repo): `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET`, `CONTACT_TO_EMAIL`, and the email provider's key. Local copies live in git-ignored files.

## 7. Form states

| State | Behaviour |
|---|---|
| Idle | Labels visible, audience prefilled |
| Invalid | Inline message per field, `aria-live`, focus moves to the first error |
| Sending | Button disabled with a spinner label, fields locked |
| Success | Inline message on the same page, form cleared, focus moves to the message. No separate page. |
| Error | Plain message, the text the visitor typed is kept, retry possible. Offer LinkedIn as another route. Never print the email address. |
| Turnstile failed | Message to retry the check |
| Rate limited | Message to try again later |

Accessibility: real `<label>` for every field, error text linked with `aria-describedby`, 44x44px touch targets, full keyboard use, visible focus ring in `--accent-strong`.

## 8. Not used, and how to add later
- **Call booking is skipped** (brief section 12). If he ever wants it: he updates the brief first, then a `booking` channel is added to `connect.json` for the Clients page only. No component code should need to change.

## 9. Data
- Channels, order and audiences: `connect.json` (no email address inside).
- Page-level CTAs: `pages/<page>.json` (`primaryCta`, `secondaryCta`).
- Dropdown options: `connect.json` > `form.audienceOptions`.

## 10. Acceptance checklist
- [ ] Each page shows exactly the channels in section 2 (Instagram on Clients only)
- [ ] View-source and built output contain no email address, phone number, WhatsApp or Telegram
- [ ] Click-to-mail opens the mail app on Android and iPhone
- [ ] Discord copy works, with the fallback
- [ ] Form: success, error, invalid, Turnstile-fail and rate-limit states all tested
- [ ] A filled honeypot and a sub-3-second submit are both dropped
- [ ] Audience dropdown is prefilled correctly on every page
- [ ] No secrets in the repository
- [ ] Form and connect buttons work by keyboard only