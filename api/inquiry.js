// Vercel serverless function: receives quote/inquiry submissions from the site.
// Zero-config on Vercel (any .js in /api becomes a function). Uses only global
// fetch (Node 18+) — no dependencies.
//
// Delivery is progressive: it works the moment ONE of these env vars is set in
// the Vercel project (Settings -> Environment Variables), and needs no code change:
//   LEAD_WEBHOOK_URL  – POSTs the lead JSON to a URL (e.g. a Google Apps Script
//                       web app that appends a row to a Google Sheet, or Zapier).
//   RESEND_API_KEY    – emails the lead via Resend (set LEAD_TO / LEAD_FROM too).
// If neither is set, it returns {ok:true, delivered:false} and the browser falls
// back to opening the user's mail client with the inquiry pre-filled, so no lead
// is ever silently lost.

function isEmail(s) {
  return typeof s === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  // Honeypot: real users never fill this hidden field. Silently accept + drop.
  if (body.company_website) return res.status(200).json({ ok: true, delivered: true });

  const name = (body.name || '').toString().trim().slice(0, 200);
  const email = (body.email || '').toString().trim().slice(0, 200);
  const message = (body.message || '').toString().trim().slice(0, 5000);
  const company = (body.company || '').toString().trim().slice(0, 200);
  const phone = (body.phone || '').toString().trim().slice(0, 60);
  const product = (body.product || '').toString().trim().slice(0, 200);
  const quantity = (body.quantity || '').toString().trim().slice(0, 60);

  if (!name || !isEmail(email) || !message) {
    return res.status(400).json({ ok: false, error: 'Please provide your name, a valid email, and a message.' });
  }

  const lead = {
    name, company, email, phone, product, quantity, message,
    submittedAt: new Date().toISOString(),
    source: (req.headers['referer'] || '').toString().slice(0, 300),
    userAgent: (req.headers['user-agent'] || '').toString().slice(0, 300),
  };

  const webhook = process.env.LEAD_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  let delivered = false;

  try {
    if (webhook) {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });
      delivered = true;
    }
    if (resendKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + resendKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.LEAD_FROM || 'UNI-T Philippines <onboarding@resend.dev>',
          to: [process.env.LEAD_TO || 'e2shop.kinmo@gmail.com'],
          reply_to: email,
          subject: `New inquiry: ${product || 'general'} — ${name}${company ? ' (' + company + ')' : ''}`,
          text: [
            `Name: ${name}`, `Company: ${company}`, `Email: ${email}`, `Phone: ${phone}`,
            `Product/model: ${product}`, `Quantity: ${quantity}`, '', 'Message:', message, '',
            `Submitted: ${lead.submittedAt}`, `From page: ${lead.source}`,
          ].join('\n'),
        }),
      });
      delivered = true;
    }
  } catch (e) {
    // Delivery attempt failed — tell the client so it can use the mailto fallback.
    return res.status(200).json({ ok: true, delivered: false });
  }

  if (!delivered) {
    // No destination configured yet. Surface in Vercel function logs and let the
    // browser fall back to mailto so the lead still reaches Kinmo.
    console.log('INQUIRY (no delivery destination configured):', JSON.stringify(lead));
    return res.status(200).json({ ok: true, delivered: false });
  }
  return res.status(200).json({ ok: true, delivered: true });
}
