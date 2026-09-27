# Portfolio content worker

This Worker is the only write path for portfolio entries. The public site reads `GET /api/entries`; Telegram commands are accepted only from `TELEGRAM_CHAT_ID`.

## Deploy

From `worker/`:

```powershell
npx wrangler d1 create eklavya-portfolio
```

Copy the returned database ID into `wrangler.toml`, then initialize the schema:

```powershell
npx wrangler d1 execute eklavya-portfolio --remote --file=./schema.sql
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_CHAT_ID
npx wrangler secret put TELEGRAM_WEBHOOK_SECRET
npx wrangler deploy
```

After deployment, set the Telegram webhook to `https://<worker-subdomain>.workers.dev/telegram-webhook` with the same secret token configured in `TELEGRAM_WEBHOOK_SECRET`. Put that API origin in the portfolio document as `data-api-url` on the `<html>` element before publishing.

## Commands

```text
/add project | title | description | tags | link
/list project
/edit 14 | description | updated description
/delete 14
/undo
```

`/delete` archives the entry rather than removing its database row. Unknown senders are ignored without a Telegram response.
