# Turning on lead delivery

Until one of the two environment variables below is set in Vercel, every inquiry
lands in the function log and nowhere else. The site tells the visitor so and
gives them a copy/email/Viber/phone panel, so a lead is never *silently* lost —
but nothing reaches an inbox on its own. **Set one of these.**

## Check the current state

```bash
curl -s https://unit-philippines-blog.vercel.app/api/inquiry
```

- `{"ok":true,"configured":false,...}` → nothing configured, inquiries are log-only.
- `{"ok":true,"configured":true,"destinations":{"webhook":true,"email":false}}` → live.

The endpoint never reports the URL, key or address — only whether one exists.

## Option A — Google Sheet (free, no account to create)

1. New Google Sheet → name it e.g. **UNI-T PH Leads**.
2. **Extensions → Apps Script**, delete the placeholder, paste
   [`scripts/lead-webhook.gs`](../scripts/lead-webhook.gs).
3. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**  ← required; Vercel calls it unauthenticated
4. Copy the `/exec` URL it gives you.
5. Vercel → Project → Settings → Environment Variables → add
   `LEAD_WEBHOOK_URL` = that URL (all environments) → **Redeploy**.

Set `NOTIFY_EMAIL` at the top of the script to also get an email per lead.

## Option B — Email via Resend

1. resend.com → API Keys → create one.
2. Vercel env vars: `RESEND_API_KEY` = the key.
3. Optional: `LEAD_TO` (default `e2shop.kinmo@gmail.com`),
   `LEAD_FROM` (default `onboarding@resend.dev`).
4. Redeploy.

> The default `onboarding@resend.dev` sender only delivers to the address that
> owns the Resend account. To send to anyone else, verify a domain in Resend and
> set `LEAD_FROM` to something on it, e.g. `UNI-T Philippines <leads@kinmo.com>`.

Both can be set at once — the lead goes to both, and it counts as delivered if
either succeeds.

## After setting it

1. Re-run the `curl` above → `configured: true`.
2. Send one real inquiry through [/contact.html](https://unit-philippines-blog.vercel.app/contact.html).
   You should get **"Thanks — your inquiry has been sent."** Anything else means
   the destination rejected it.
3. If it failed, Vercel → Deployments → Functions → `api/inquiry` logs. Look for
   `INQUIRY DELIVERY FAILED:` — it carries the exact HTTP status and response
   body from the destination (`401` = bad key, `403` = unverified sender domain,
   `500` = the Apps Script threw).

## Recovering a lead that never got delivered

Every undelivered inquiry is written to the function log in full:

```
INQUIRY NOT DELIVERED (…) — full lead follows: {"name":…,"email":…,"message":…}
```

Vercel → Deployments → Functions → `api/inquiry` → filter for `INQUIRY NOT`.
Note the retention limit on the Hobby plan — this is a safety net, not storage.
