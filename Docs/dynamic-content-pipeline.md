# Dynamic Content Pipeline — Telegram → Cloudflare Worker → D1

**Decision:** This replaces the static hardcoded array from Task 1 in `improvement-plan.md`. Projects/skills/experience/tasks are now added by sending a Telegram message — no code edits, no redeploy, no admin login on the site.

**Architecture:**
```
Telegram (you) → Cloudflare Worker (webhook) → Cloudflare D1 (SQLite)
                                                        ↓
                          Portfolio site → GET /api/entries → renders cards
```

One Worker, one D1 database, one repo for the Worker code. Site stays static; it just fetches from the Worker's public read endpoint on load.

---

## 1. D1 Schema

```sql
CREATE TABLE entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,          -- 'project' | 'skill' | 'experience' | 'task' | custom
  title TEXT NOT NULL,
  description TEXT,
  tags TEXT,                   -- comma-separated, split client-side
  link TEXT,                   -- repo/demo URL, optional
  image_url TEXT,              -- optional, for photo-attached entries
  status TEXT DEFAULT 'active',-- 'active' | 'archived' (soft delete)
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
```

`type` is free text on purpose — new categories (e.g. `certification`, `talk`) don't need a schema change, just a new render branch on the frontend.

---

## 2. Telegram command format

Keep it dead simple, regex-parseable, no AI call needed for the base case:

```
/add <type> | <title> | <description> | <tags> | <link>
```
Example:
```
/add project | mdgen-ai | AI readme generator, 50+ users | Next.js, Supabase | github.com/EklavyajhaAI07/mdgen-ai
```

Other commands the Worker should support:
- `/list <type>` — reply with recent entries of that type + their `id` (needed for edit/delete)
- `/edit <id> | <field> | <new value>`
- `/delete <id>` — soft delete (`status = 'archived'`), not a hard row delete
- `/undo` — re-activate the most recently archived entry (safety net)
- Sending a **photo with a caption** starting with `/add` → Worker downloads the photo, uploads to Cloudflare Images or R2, stores the resulting URL in `image_url`.

**Confirmation UX:** every successful command gets a reply in Telegram, e.g. `✅ Added [project] mdgen-ai (id: 14)`. This is your only "did it save" feedback — make sure the Worker always replies, success or failure, with a clear reason on failure (e.g. `❌ Missing description — format: /add type | title | desc | tags | link`).

---

## 3. Security model

- Worker's webhook handler checks the incoming Telegram `chat_id` (or `from.id`) against a single hardcoded/env-var whitelist value — your own Telegram user ID. Any other sender is ignored (no reply, no write) so the bot can't be discovered and abused.
- Telegram bot token and your whitelisted `chat_id` are stored as Worker **secrets** (`wrangler secret put`), never committed to the repo.
- The `GET /api/entries` endpoint is public and **read-only** — no auth needed there, it's meant to be fetched by the static site. Never add a write path reachable without the Telegram check.
- This is what fully replaces the old "Admin login" from the original audit — there is no login UI on the public site at all anymore.

---

## 4. Worker structure (single `worker.js`, deployed via Wrangler)

```
/worker
  ├── src/
  │   ├── index.js          -- routes: POST /telegram-webhook, GET /api/entries
  │   ├── telegram.js        -- parses commands, sends replies via Telegram Bot API
  │   ├── db.js               -- D1 queries (insert/list/update/archive)
  │   └── media.js            -- optional: photo download + upload to R2/Images
  ├── wrangler.toml
  └── schema.sql               -- the CREATE TABLE above, run once via `wrangler d1 execute`
```

- `POST /telegram-webhook` — set as the bot's webhook URL (via `setWebhook` API call once, manually or via a setup script). Validates sender, parses command, writes to D1, replies to Telegram.
- `GET /api/entries?type=project` — returns JSON array of active entries, optionally filtered by `type`. This is what `script.js` on the portfolio site calls.
- CORS: `GET /api/entries` needs `Access-Control-Allow-Origin: https://eklavya.dpdns.org` so the site's fetch call isn't blocked.

---

## 5. Frontend change (`script.js`)

Replace the hardcoded array approach from the old Task 1 with:

```js
async function loadEntries(type) {
  const res = await fetch(`https://<your-worker>.workers.dev/api/entries?type=${type}`);
  const data = await res.json();
  return data; // render into the matching container
}
```

Call this once per section on page load (`project`, `skill`, `experience`, etc.) and render cards from whatever comes back — no rebuild, no redeploy, updates go live the moment you send the Telegram message.

**Fallback:** if the fetch fails (Worker down, network issue), fall back to a small hardcoded "last known good" array baked into the page at last deploy time, so the site never shows a blank section — this directly fixes the original empty-sections audit finding even under failure conditions.

---

## 6. Build order for this pipeline
1. Create D1 database + run `schema.sql`.
2. Create Telegram bot via BotFather, get token.
3. Write and deploy Worker with webhook handler + whitelist check.
4. Set Telegram webhook to the deployed Worker URL.
5. Test `/add`, `/list`, `/edit`, `/delete` end-to-end from Telegram.
6. Build `GET /api/entries` + CORS.
7. Update `script.js` to fetch from the Worker instead of a static array.
8. Add the static fallback array for fetch-failure cases.
9. Backfill initial real data (from `content-source.md`) by sending the `/add` commands for each existing project/skill.

---

## 7. Nice-to-have, later
- Weekly digest: Worker cron trigger that DMs you a Telegram summary of what was added that week — good habit-check since you're adding ~5 things/month.
- `/add` without a type could default to an AI-classification step (single Claude API call) if you want more natural free-text input later — not needed for v1.
