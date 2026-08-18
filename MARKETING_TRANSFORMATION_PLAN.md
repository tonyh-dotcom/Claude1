# Marketing Department Transformation Plan

**The pricing model (Tier 1):** POS stays **$70/station/month** (3-year contract).
In-app marketing — SMRT Broadcasts, SMRT Campaigns, SMRT Reviews — becomes a single
add-on at **+$70/station/month** (marketing-enabled station = $140 all-in).
All flat marketing SKUs and bundles retire. Social, Websites, Ads, Screens, Chatbot
stay à la carte. SMS segments stay usage-billed passthrough.

Positioning: one simple per-station price attacks **CleanCloud** (POS+marketing
bundling) while the expanded access + self-service + expert sessions attack
**Cleaner Marketing / BC360** on services. ROI math becomes trivial for the
customer: "marketing costs me $70 × stations; the dashboard shows what it returned."

---

## Tier 1 — Pricing: what the data says

### Revenue on the current 99 in-app customers (852 stations, 556 documented / 296 est.)

| | Today | At $70/station | Delta |
|---|---|---|---|
| In-app marketing revenue | $69,092/mo | **$59,640/mo** | **−$9,452/mo (−13.7%)** |
| If stations are really 980 (+15%) | $69,092 | $68,600 | ≈ break-even |
| If stations are really 724 (−15%) | $69,092 | $50,680 | −$18,412 |

Confirmed: **$70/station is at/near break-even for the current base** (break-even
price $70.50–$95, central $81). The central estimate is a **modest −$9.5K/mo
(−14%) haircut**, not the −$60K of the $10 scenario — and it's recoverable
(below).

### Who goes up, who goes down (detail: `data/marketing_customer_deltas_70.csv`)

- **72 customers pay LESS** (−$23.2K/mo total). Biggest winners are
  multi-location, few-station Reviews customers (Dry Clean NYC −$834, TSC
  −$738, Carr's −$650) and every small shop on $599 Campaigns. **The
  "affordable for small customers" goal is fully met** — a 2-station shop gets
  the whole suite for $140/mo vs $599+ today.
- **27 customers pay MORE** (+$13.7K/mo total) — and these are the **big-station
  operators**: D.O. Summers +$1,690 (40 st), Master's Mark +$1,571 (31 st),
  Burke +$1,501 (30 st), Steamer +$941 (22 st), Gibson's +$621 (17 st).
  ⚠️ Under this model **large plants do not get a cost reduction — they fund
  the model.** Their consolation: it's still far below à la carte agency cost,
  and reinvestment into Social/Ads/Websites is a separate pitch, not a savings
  they'll feel. Expect negotiation from the top 10 (+$500+ each).

### Migration design (protects the downside)

1. **New attach at $70/station from day 1** — pure upside; no existing revenue at risk.
2. **The 72 reductions migrate immediately** — instant goodwill, simpler billing.
3. **The 27 increases migrate at contract renewal** (the 3-year cycle is the
   natural vehicle); until renewal they may keep legacy pricing. No station caps —
   a cap-at-10 variant costs $26K/mo and mostly subsidizes the largest plants.
4. **Recovery math:** the −$9.5K gap closes with **135 newly attached stations ≈
   27 average customers ≈ 3% of the ~900 non-marketing customers**. Every 1% of
   non-marketing stations attached = **+$3,150/mo**. At 25% attach (realistic
   year-1 with default-on templates and onboarding push): **+$79K/mo** —
   marketing revenue roughly **doubles** vs today.

| Year-1 attach of the ~4,538 non-marketing stations | New marketing revenue | vs today's $69.1K |
|---|---|---|
| 3% (135 st) | $69.1K | break-even |
| 10% (454 st) | $91.4K | **+$22K/mo** |
| 25% (1,135 st) | $139K | **+$70K/mo** |
| 50% (2,269 st) | $218K | +$149K/mo |

The strategic point: at $70/station, **attach growth is real revenue** (unlike
the $10 model where even 100% attach lost money). Marketing becomes a second
$70 rail on the same billing infrastructure.

## Tier 2 — Team: one owner per external service + self-service in-app

- **Jason → SMRT Websites** ($2.8K/mo, 26 clients today). Owns templates, SEO
  baseline, and the website tagging/analytics roadmap item.
- **Dayana (new hire, design-focused) → SMRT Social** ($5.4K/mo, 21 clients).
  Design capacity also feeds template library, web, and ad creative — set the
  split explicitly (suggest 60% Social / 40% shared design).
- **Tony → SMRT Ads** ($1.1K/mo, 3 clients — most headroom). Productize:
  setup fee + monthly management tiers, not hourly.
- Owned-services target: **$9.5K → $33K/mo** by month 12 (Social $15K,
  Websites $8K, Ads $10K) — funded by the reinvestment pitch to the 72
  customers whose in-app bill just dropped.
- **Self-service enablement:** marketing knowledge base + guides owned by main
  SMRT support; tier-1 marketing questions transfer to support with an
  escalation path; in-app templates pre-seeded so $70 buys a loaded gun, not
  an empty one.
- **Paid success sessions $100/hr (Tony + Jason)** + productized packages
  (campaign setup $499, quarterly review $299). Realistic +$8–16K/mo. This is
  margin and stickiness — attach growth is the revenue engine.

## Tier 3 — Software roadmap (quarterly)

| Qtr | Ship | Notes |
|---|---|---|
| Q1 | **Google Business Profile analytics** (Performance API) | Free API, direct SMRT Reviews synergy; visible value for every $70 attach |
| Q1 | **SMS segment tracker + SMS template library** | Pulled forward: cost transparency + instant time-to-value for new attachers; builds on the live segment counter (SMRT-10131) |
| Q2 | **Referral system** | Templated referral campaign + manual POS mode; promo-link attribution (SMRT-10474) is the tracking backbone |
| Q2 | **Facebook & Yelp review expansion** | Rating-gate: capture sentiment first; positive → link out, negative → mitigation inbox. Optional staggered campaigns inside SMRT Reviews with over-messaging safeguards. ⚠️ Yelp bans review solicitation — Yelp is presence/link only, never "review us on Yelp" sends; Facebook allows requests |
| Q3 | **Website analytics** | First-party tagging on SMRT Sites (page views, clicks, conversions → SMRT dashboard). Prefer own tagging over per-customer GA4 OAuth: less support surface, data in-app, differentiates Jason's product; GA export later |
| Q4 | **Ads analytics in SMRT** (Google, Meta, LinkedIn) | Client-visible ROAS dashboard is the retention engine for Tony's managed-ads revenue |
| Q4+ | **Visual journey builder** (CleanCloud / Customer.io class) | Flagship; POS-native journey data is the moat CleanCloud can't copy when they respond on price |

**Features from earlier discussions missing from the original list:**
live SMS segment counter in compose (SMRT-10131); marketing ROI/investment
calculator (SMRT-10004 — *simplifies massively under per-station pricing:
investment = $70 × stations + segments, exactly the "easier ROI" you called
out*); campaign Effectiveness Score (0–100) + per-campaign detail views
(SMRT-10269); promo click-vs-auto-apply attribution and CTR fix (SMRT-10474,
SMRT-10400); review data feeding the effectiveness score; dashboard↔report
metric parity (SMRT-10476, 10389, 10388). Worth adding: email template library
alongside SMS, A/B testing, global quiet-hours/frequency caps as a launch gate,
win-back + birthday templates in the default seed set.

## Phased execution

- **Phase 0 (weeks 1–4):** finish dashboard metric-parity work (wrong numbers
  ×10 customers becomes wrong numbers ×1,000); lock the migration policy
  (reductions now / increases at renewal); 10DLC/Twilio provisioning audit and
  COGS decision; baseline KPIs.
- **Phase 1 (weeks 4–12):** knowledge base + guides live; templates pre-seeded;
  frequency caps + quiet hours + segment counter shipped (launch gates);
  support tier-1 transfer trained; pilot ~50 attachers at $70/station.
- **Phase 2 (weeks 8–20):** pricing GA — retire flat SKUs, migrate the 72
  reductions, renewal-schedule the 27 increases, attach campaign to the ~900;
  hire Dayana; ownership split live; paid sessions launched with in-app booking.
- **Phase 3 (quarterly):** roadmap above; re-scope SMRT-10004 to per-station ROI.

## KPIs

| Metric | Target (12 mo) |
|---|---|
| Marketing-attached stations | 852 → ≥ 2,000 (of 5,390) |
| In-app marketing MRR | $69.1K → ≥ $139K (25% attach case) |
| Retention of the 27 increase accounts at renewal | ≥ 80% |
| Owned services (Social+Web+Ads) MRR | $9.5K → $33K |
| Sessions + packages | $8–16K/mo |
| Marketing tickets resolved by tier-1 support | ≥ 80% |
| Customers actively sending campaigns | ≥ 50% of attached |

## Issues & risks

1. **The "big customers save money" assumption is inverted at $70/st** — the 27
   largest-station accounts pay +$13.7K/mo more. This is the plan's main churn
   risk and negotiation surface; renewal-timed migration + effectiveness/ROI
   dashboards are the defense. If the top 10 all walked from marketing entirely,
   that's −$11.6K/mo of today's revenue — worse than just keeping them legacy,
   so *legacy-until-renewal must be a real option, not a bluff*.
2. **Station-count uncertainty matters here:** 296 of 852 stations are estimates.
   Before GA, pull true station counts from billing for the 99 — the difference
   between 724 and 980 stations is the difference between −$18K and break-even.
3. **Attach is the whole upside** — resource it like a product launch (default-on
   templates, onboarding motion, 90-day free trial for existing customers?).
   3% attach = break-even; everything above is growth.
4. **10DLC provisioning bottleneck + COGS** (~$5–15/customer/mo): cohort rollout,
   explicit pass-through decision.
5. **Sequencing:** enablement and safeguards ship before pricing GA or support
   drowns and novice senders spam their lists.
6. **Capacity conflicts:** move the billing sheet to finance (Tony), and
   subscription shutoffs out of Jason's lap, or the efficiency goal fails.
7. **Yelp solicitation ban** — hard product rule (rating-gate, presence-only).
8. **AU/EU price cards** need their own migration line (AUD/EUR/GBP rates exist
   on all retiring SKUs).

*Sources: billing sheet + price list (`data/`), T4PO/Close station analysis,
SMRT Jira in-flight tickets. Per-customer deltas at $70/st:
`data/marketing_customer_deltas_70.csv`.*
