# What Earl needs to do

**As of 21 September 2026.** Everything here is something I cannot do for you —
it needs your accounts, your credentials, or your business decision. Ordered by
what actually moves the needle.

Verify state any time:

```bash
curl -s https://unit-philippines-blog.vercel.app/api/inquiry
```

---

## 1. Turn on lead delivery  ⏱ ~5 min  🔴 blocking

Right now the endpoint reports `"configured": false`. Every quote request, RFQ
button and contact form falls back to the visitor's own mail app. **The site is
generating leads you are not receiving.**

The Google Sheet and script are already built and saved. Only the final
authorisation is missing.

1. Open the script:
   <https://script.google.com/u/0/home/projects/1l9zYyJ3q1IbKnSFrwdHZ_IkmmTR90GgXxwC3NZdi_CNCp8Tt7Q4xU5pV/edit>
2. **Deploy → New deployment → ⚙ (gear) → Web app**
3. Set:
   - **Execute as:** Me
   - **Who has access:** **Anyone**  ← people get this wrong; it must be "Anyone", not "Anyone with Google account"
4. **Deploy**, then **Authorize access**
5. Choose your account → *"Google hasn't verified this app"* → **Advanced** →
   **Go to UNI-T PH Lead Webhook (unsafe)** → **Allow**
   *(The warning is expected. It is your own script, not a third party.)*
6. Copy the URL ending in **`/exec`**
7. <https://vercel.com> → project **unit-philippines-blog** → **Settings →
   Environment Variables → Add**
   - Name: `LEAD_WEBHOOK_URL`
   - Value: the `/exec` URL
   - Apply to all environments → **Save**
8. **Deployments → ⋯ → Redeploy** (environment variables only apply to new builds)

**Check it worked:** run the curl above. You want `"configured": true`. Then
submit one real inquiry — you should see *"Thanks — your inquiry has been
sent."* and a row should appear in the **UNI-T PH Leads** sheet, plus an email.

**If it fails:** Vercel → Deployments → Functions → `api/inquiry`. Look for
`INQUIRY DELIVERY FAILED` — it names the exact cause (401 = bad key,
403 = unverified domain, 500 = script error, HTML page = access not set to "Anyone").

### Alternative, if the Google popup keeps fighting you
1. <https://resend.com> → sign up → **API Keys** → create one
2. Vercel env vars: `RESEND_API_KEY` = the key, `LEAD_TO` = `e2shop.kinmo@gmail.com`
3. Redeploy

⚠️ Resend's default sender only delivers to the address that owns the Resend
account. To send anywhere else you must verify a domain and set `LEAD_FROM`.

---

## 2. Turn on analytics  ⏱ ~1 min  🔴 blocking

You have seven tools, 517 products and **no idea which anyone uses.** Every
recommendation — mine included — is guesswork until this exists.

1. <https://vercel.com> → project → **Analytics** (left sidebar) → **Enable**
2. That's it. The tracking code is already on all 60+ pages and starts
   reporting on the next deploy.

**Cost:** Hobby plan = 50,000 events/month free, and you *cannot* be billed
past it — collection simply pauses. Pro = $0.03 per 1,000 events. Check which
plan the project is on before enabling if that matters.

**Check it worked:**

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://unit-philippines-blog.vercel.app/_vercel/insights/script.js
```

`200` = on. `404` = still off.

---

## 3. Add the site to Google Search Console  ⏱ ~5 min  🟠 high

Nothing has told Google the site exists. The sitemap is live and correct but
unsubmitted.

1. <https://search.google.com/search-console> → **Add property** → URL prefix →
   `https://unit-philippines-blog.vercel.app`
2. Choose **HTML tag** verification and copy the `content="..."` value
3. **Send me that value** and I will add the meta tag and redeploy
4. Come back → **Verify** → then **Sitemaps** → submit `sitemap.xml`

---

## 4. Add the missing products to kinmo.com  🟠 high, ongoing

**307 of your 517 catalogued products are not on kinmo.com.** I tested every
one. That means "Buy on Kinmo" — the primary button on your product cards —
lands on an empty search for the majority of the range, including instruments
the solar picker actively recommends (UT381PV, UT673PV, UT-CS07, UT197PV).

Ask me for:
- **the full 307-model list**, or
- **a WooCommerce import CSV** built from your pricelist with names,
  descriptions, categories and images — one upload instead of 307 manual entries

In the meantime the product modal now also offers **Message on Facebook** and
**Request a quote**, which work for all 517.

---

## 5. Name a technical reviewer  🟡 credibility

The single biggest credibility gap. *"Reviewed by [name], PEE Licence No. X"*
on the safety and calculator pages is worth more than any SEO work done so far.
The site currently says "Kinmo Technical Team", which is honest but anonymous.

I will not invent a name or a licence number. Give me the real ones and I will
add them properly, with the review date.

---

## 6. Get the conductor tables checked against a real PEC  🟡 accuracy

The ampacity values for **50 mm² and above** rest on a single Philippine
website. I refused to change them on that basis, so they are published as-is
and unverified.

1. Buy **PEC 2017 Part 1** from IIEE
2. Have a PEE check the conductor and breaker tables for one afternoon
3. Send me any corrections

Cheaper than more research, and it is the only thing that turns "probably
right" into "signed off". It also solves item 5 at the same time.

**Also worth ten minutes:** ring Royu or Schneider PH and ask what temperature
their panelboard and breaker terminals are listed at (60 °C or 75 °C). A week
of searching could not settle it, and it changes every conductor figure between
8 and 50 mm².

---

## 7. Align the Facebook page wording  🟢 small

Your Facebook page says **"Authorized Distributor"**; the site says
**"Exclusive"** throughout, which you chose deliberately as contractual. A
customer checking the page sees a different claim.

---

## Quick reference

| Thing | Where |
|---|---|
| Live site | https://unit-philippines-blog.vercel.app |
| Repo | github.com/earlthepearl08/UNI-T_Blog |
| Lead sheet | Google Drive → "UNI-T PH Leads" |
| Lead script | script.google.com → "UNI-T PH Lead Webhook" |
| Health check | `curl -s .../api/inquiry` |
| Full audit | `docs/PEC-AUDIT-2026-09.md` |
| Tools plan | `docs/TOOLS-PLAN-2026-09.md` |
| Lead setup detail | `docs/LEAD-DELIVERY.md` |
