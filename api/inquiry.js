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

// Strip CR/LF before any value reaches an email subject line.
function oneLine(s) {
  return String(s || '').replace(/[\r\n]+/g, ' ').trim();
}

// Best-effort rate limiting. Serverless instances are ephemeral and there may be
// several running at once, so this is a speed bump against naive floods, NOT a
// guarantee. For hard limits put Vercel WAF / a KV store in front of it.
const RATE = { windowMs: 10 * 60 * 1000, maxPerIp: 5, maxPerInstance: 120 };
const hits = new Map();            // ip -> number[] (timestamps)
let instanceCount = 0;
let instanceWindowStart = Date.now();

function clientIp(req) {
  const fwd = (req.headers['x-forwarded-for'] || '').toString();
  return fwd.split(',')[0].trim() || req.headers['x-real-ip'] || 'unknown';
}

function rateLimited(req) {
  const now = Date.now();
  if (now - instanceWindowStart > RATE.windowMs) { instanceWindowStart = now; instanceCount = 0; }
  if (++instanceCount > RATE.maxPerInstance) return true;

  const ip = clientIp(req);
  const arr = (hits.get(ip) || []).filter(t => now - t < RATE.windowMs);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();   // bound memory
  return arr.length > RATE.maxPerIp;
}

const ALLOWED_ORIGINS = [
  'https://unit-philippines-blog.vercel.app',
  'https://www.unit-philippines-blog.vercel.app',
];

module.exports = async function handler(req, res) {
  const origin = (req.headers.origin || '').toString();
  const allowed = ALLOWED_ORIGINS.includes(origin);
  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  // Reject cross-origin posts from anywhere but the site itself. Same-origin
  // browser requests may omit Origin, so only block when it is present and wrong.
  if (origin && !allowed) {
    return res.status(403).json({ ok: false, error: 'Forbidden' });
  }

  if (rateLimited(req)) {
    res.setHeader('Retry-After', '600');
    return res.status(429).json({
      ok: false,
      error: 'Too many submissions from this connection. Please try again in a few minutes, or email us directly.',
    });
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
          subject: oneLine(`New inquiry: ${product || 'general'} — ${name}${company ? ' (' + company + ')' : ''}`).slice(0, 200),
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
    // Log it. Swallowing this silently meant a broken webhook or an expired API
    // key looked identical to "no destination configured", so lead loss was
    // invisible in the Vercel function logs.
    console.error('INQUIRY DELIVERY FAILED:', e && e.message ? e.message : e,
      '| lead:', JSON.stringify({ name: lead.name, email: lead.email, product: lead.product, submittedAt: lead.submittedAt }));
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
