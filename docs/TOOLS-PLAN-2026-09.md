# Tools audit, new tools, and social — recommendation

**18 September 2026.** From a 96-agent audit (90 completed) plus my own verification of
every concrete claim before acting on it.

> **A caveat on the audit's own output.** My challenge prompt told agents to return
> `survives:false` if a recommendation should be dropped *"or substantially rethought"*.
> Almost anything can be rethought, so **84 of 85 challenges came back false** and the
> workflow's own verdict field is meaningless. The reasoning underneath is not — the
> challengers verified facts from the files and wrote better plans. Everything below is
> drawn from that reasoning, and I re-verified each factual claim myself. Where I could
> not verify something, it says so.

---

## 1. What to cut and merge

**Ranking of the 8 tools, most to least worth keeping:**

1. `solar-calculator` — the only tool a tradesperson cannot replace with mental arithmetic
2. `safety-calculator` CAT + wire tabs — highest-frequency task; the CAT tab's output *is* a product list
3. `instrument-finder` — open-once by design, but it is a sales funnel, and it has no numbers that can be wrong
4. `power-calculator` — real work, but tabs 1 and 2 are algebraic inverses of each other
5. `wiring-reference` — one high-value table wrapped in three commodity ones
6. `compare` — the most impressive-sounding and least decisive tool on the site
7. `knowledge-quiz` — filler

### DELETE: `knowledge-quiz.html`
15 questions served 10 at a time, so a second play repeats ~two-thirds of the first. All
definitional trivia. It is the only tool that teaches nothing a tradesperson needs on site,
and it is the one tool that carries share buttons — pointing social traffic at your weakest
asset.

### CUT BACK: the Unit Converter tab
Temperature, HP↔W and PSI↔bar are commodity conversions a phone does faster, and each is a
maintenance surface with no upside. **Keep AWG↔mm² only** — but fix it: it currently returns
exact geometric area (AWG 12 → 3.309 mm²), and no Philippine hardware store sells that. It
should return the **trade size you can actually buy** (3.5 mm²), which is a different and
more useful question.

### DO **NOT** merge the conductor tables into shared code
This was the audit's headline recommendation and I disagree, as did all three challengers.
The two columns answer **different questions** — `wiring-reference` rounds down to the
largest rating at or below ampacity; `safety-calculator` applies the next-size-up allowance,
which is a permitted *ceiling*. Unifying them would force one answer onto two questions.
**Already fixed the right way** (commit `2a93abf`): the column is renamed, the note explains
the difference and links across, and both keep their own logic.

---

## 2. New tools, ranked

| # | Tool | Sells | Effort | Risk |
|---|---|---|---|---|
| 1 | **Thermal ΔT triage** — classify a hotspot by ΔT over reference into advisory / repair / urgent | 44 thermal SKUs, your biggest high-ticket line | Medium | **Low** — the bands are published guidance, not code |
| 2 | **Power factor correction (kVAR)** — existing PF, target PF, kW → capacitor kVAR | UT285C, UT267B/UT268B analysers | Medium | Low — pure arithmetic |
| 3 | **Aircon circuit sizing** — read MCA/MOP off the nameplate → wire + breaker | Clamps, multimeters | Medium | Medium — must read the nameplate, not compute from HP |
| 4 | **Insulation acceptance + PI/DAR** — reading, temperature, voltage class → pass/fail | 16 insulation testers | Medium | Low |
| 5 | **Earth/ground result interpreter** — reading + soil + system type → verdict | 14 earth testers | Medium | Low |
| 6 | **Energy cost (kWh → ₱)** | UT230B plug-in meter | **Small** | Very low |
| 7 | **Neutral current / triplen harmonic check** | UT285C — five-figure sale | **Small** | Very low |

**Why #1 first:** thermal imagers are your second-largest category (44 of 504 models) and
**not one of the eight tools touches thermography**. A UTi720M buyer is worth many multiples
of a multimeter buyer. The physics is bounded — ΔT bands are published guidance, so unlike
the ampacity tables there is no paid standard to get wrong.

**Why power factor second:** "power factor" appears **once across 45 posts**, for a company
whose other business is AVR and power quality. That is the largest commercial hole on the site.

**One I'd add that wasn't on your list:** a **superheat/subcooling calculator**. The PH
aircon service trade is enormous, you already stock for it (6 anemometers, 2 leak detectors,
contact thermometers), and unlike every tool above it gets opened *on every single job*.

---

## 3. Social — my recommendation is: **do not embed**

This is not caution, it's arithmetic:

- Your privacy notice says the site *"sets no cookies and does not store anything that
  identifies you personally, so there is nothing here for you to consent to or opt out of."*
  A Facebook Page Plugin, Instagram `embed.js` or TikTok `embed.js` makes that sentence
  **false on load** — and not because of cookies. The request itself hands Meta or ByteDance
  the visitor's IP plus the URL of the page they're on. That is processing under RA 10173.
  You would need a consent banner — the exact thing cookieless analytics was chosen to avoid.
- **A seamless Instagram grid does not exist.** The unauthenticated oEmbed endpoint was shut
  off in 2020 and Basic Display API died in December 2024. What remains is a Facebook app,
  a linked Page, App Review, and tokens that expire every 60 days. On a static site with no
  build step, that is a recurring breakage you'd have to babysit.
- An Instagram grid on an electrical calculator page is **noise to a technical audience**
  anyway. They came to size a conductor.

### Do this instead

1. **Footer social links** on all pages + `sameAs` in the Organization JSON-LD. You have
   **128 outbound links to kinmo.com and zero to any social profile** — for a distributor
   whose own blog runs a "5 red flags for fake testers" post, that is a missing trust signal.
2. **Per-tool Open Graph images.** Seven of eight tool pages share one generic
   `og-default.jpg`. When someone drops the solar calculator into a PH electricians' Facebook
   group, the card should show the tool and a job-site question — not a generic logo. This is
   the honest substitute for embedding, and it's the highest-value item in the whole section.
3. **Short URLs** via `vercel.json` rewrites — `/solar`, `/wire`, `/power`. You cannot share
   a link *into* TikTok; traffic comes from someone typing what they saw on screen. That makes
   the URL the bottleneck.
4. **A share row on all eight tools** (Web Share API first — Android Chrome dominates PH).
   Right now only the quiz has one, and it's the least useful thing to share.
5. **If you want one embed**, put a **click-to-load Facebook Page facade on `about.html`
   only** — nothing loads until the visitor taps. That is where "are these people real?" is
   the actual question.
6. **Then add a CSP** with `frame-src 'none'` so a future edit cannot silently reintroduce a
   tracker and quietly falsify the privacy notice.

---

## 4. Something you need to fix on kinmo.com, not here

Your store search **now works** (it didn't in July — `?s=MODEL&post_type=product` returns
real results). But testing 20 models the tools reference: **15 hit, 5 miss.**

**Missing from the store entirely: UT-CS07, UT673PV, UT381PV, UT197PV, UT890C, UTi716S.**

Four of those are solar instruments the new picker actively recommends. A customer reads
"use the UT381PV to measure irradiance", searches your store, and finds nothing. **The
pricelist has them; the shop doesn't.** That's a bigger revenue leak than anything on the
site, and it's a shop fix.

---

## 5. Build order

1. Add the missing SKUs to kinmo.com *(yours, highest value)*
2. Delete `knowledge-quiz`, trim the Unit Converter *(small, removes maintenance surface)*
3. Per-tool OG images + short URLs + footer social links + share row *(one afternoon, compounding)*
4. Thermal ΔT triage tool
5. Power factor correction tool
6. Energy cost + harmonics widgets *(small, high traffic)*
7. CSP + Maps facade
