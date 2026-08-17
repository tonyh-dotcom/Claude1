# Per-Station In-App Marketing Pricing — Revenue Scenarios

**Question:** If in-app marketing (SMRT Campaigns/Trigger, SMRT Broadcasts, SMRT Reviews)
moved from flat monthly subscriptions to **+$10 per station**, what happens to revenue?
(CleanCloud-style bundled pricing, keeping our $70/station base.)

**Sources:** Marketing billing sheet (Google Sheets, all tabs), Marketing Price List
(Reviews $299, Campaigns $599, Broadcasts $199, Review Add-on $135/extra location,
Trigger Add-on $300, 5%/10% multi-product bundle discounts, special bundles at their
listed rates); station counts from Jira T4PO onboarding + Station Add-On records,
Close CRM Stations fields/opportunities, plus flagged estimates. AUD converted at 0.65.
Per-client detail: `data/scenario_detail.csv`.

---

## Baseline: what in-app marketing earns today

| | |
|---|---|
| Active in-app marketing clients | **99** |
| Current in-app marketing revenue | **≈ $69,100 / month** (≈ $829K / yr) |
| Average per client | ≈ $698 / month |
| Stations across those 99 clients | **≈ 852** (556 documented in Jira/Close, 296 estimated) |
| Current effective rate | **≈ $81 per station per month** |

Composition: ~63 clients on Campaigns ($599 or bundle-discounted), ~55 on Reviews
($299 + $135 per extra location), 2 Broadcasts-only, several heavily discounted
legacy/AU accounts.

## Scenario 1 — Only current marketing customers move to $10/station

| Stations assumed | New revenue /mo | Change /mo | Change /yr |
|---|---|---|---|
| 724 (−15%) | $7,240 | **−$61,850 (−90%)** | −$742K |
| **852 (best est.)** | **$8,520** | **−$60,570 (−88%)** | **−$727K** |
| 980 (+15%) | $9,800 | −$59,290 (−86%) | −$712K |

**You lose ~88% of marketing revenue.** Not one of the 99 clients would pay more
at $10/station than they pay today — every single bill drops, so there is no
offsetting gain anywhere in the base.

**Break-even price: ≈ $81 per station per month** (range $71–95 across the
station-count uncertainty). To keep today's ~$69K/mo from only these 99 customers
on a per-station model, marketing must be ~$80/station, not $10.

## Scenario 2 — Everyone gets in-app marketing at +$10/station (on the $70/station contract)

Installed base: you report **2,535 stores** on SMRT. T4PO shows 5,388 stations
ever installed (≈2.13 stations/store), so active stations ≈ **5,300–5,400**;
with a 20% station-churn haircut, ≈ 4,300.

| Active stations assumed | New marketing revenue /mo | Change vs today /mo | Change /yr |
|---|---|---|---|
| 4,310 (20% churn) | $43,100 | −$26,000 | −$312K |
| **5,390 (best est.)** | **$53,900** | **−$15,200** | **−$182K** |

Even with 100% of the base paying (mandatory bundling), $10/station yields
**≈ $54K/mo vs today's $69K/mo → ≈ −$15K/mo (−$182K/yr)**.
In percentage-of-total terms: total revenue goes from ≈ $377K base + $69K
marketing = $446K/mo to ≈ $431K/mo, **−3.4%**.

**Break-even adder: ≈ $12.80–13/station.** At **$15/station** across everyone,
marketing revenue becomes ≈ $81K/mo (**+$12K/mo vs today**) and an $85/station
all-in price still undercuts nothing structurally.

## Bottom line

1. **$10/station only for current marketing customers: lose ≈ $60.6K/mo (−88%).**
   Break-even is **≈ $81/station** — which is what those customers already
   effectively pay.
2. **$10/station for everyone (bundled into an $80/station contract): lose
   ≈ $15K/mo (≈ $182K/yr)**, best case; −$26K/mo if station churn is ~20%.
   **$13/station is revenue-neutral; $15/station is +$12K/mo.**
3. Since in-app marketing has near-zero marginal cost (SMS segments are billed
   through separately at $0.014/segment), these revenue changes are effectively
   profit changes.
4. The unmodeled upside of bundling-for-everyone: attach-rate today is only
   99 of ~1,000 customers (~10%). The bet is competitive positioning vs
   CleanCloud and reduced churn — that upside needs to be worth ≥$15K/mo
   at $10/station, or you price at $13–15/station and it's free.

## Follow-up: required price points

Scope note: Social, Sites/Websites, Ads, Screens, and Chatbot stay à la carte and
are already excluded from the $69.1K baseline (bundles were decomposed to their
Campaigns/Reviews share), so they don't move in either calculation.

**A. Break-even per-station price, charging only the current 99 marketing customers**
(replace their flat subscriptions with per-station pricing, keep revenue flat at ≈$69.1K/mo):

| Station count assumption | Required price |
|---|---|
| 724 (−15%) | $95.43 / station / mo |
| **852 (best estimate)** | **$81.09 / station / mo** |
| 980 (+15%) | $70.50 / station / mo |

**≈ $81 per station** — i.e., today's flat pricing already averages out to ~$81/station
across the marketing base.

**B. Per-station price across ALL stations to grow in-app marketing revenue +20%**
(target = $69.1K × 1.2 ≈ **$82,900/mo**, marketing bundled into every station):

| Active stations assumption | Required price |
|---|---|
| 4,310 (20% station churn) | $19.24 / station / mo |
| **5,390 (best estimate: 2,535 stores × 2.13 st/store)** | **$15.38 / station / mo** |

**≈ $15.50 per station** (call it **$16**, which yields ≈ $86.2K/mo, +25%) turns the
$70/station contract into ≈ $85–86/station all-in with Campaigns + Broadcasts +
Reviews included, while Social/Sites/Ads remain add-on subscriptions on top.

---

## Recommended methodology: tiered all-in station price, grandfather the 99

**Goals:** marketing wrapped in for everyone · one-line billing · affordable for
small shops · scale benefits for big customers · steadily rising revenue ·
marketing team redeployed to external marketing + paid success sessions.

### Why $70 all-in (marketing free) can't hit the revenue goal

Folding Campaigns/Broadcasts/Reviews into the existing $70 with no adder gives up
the entire **$69.1K/mo ($829K/yr)** marketing software line. Paid success sessions
at $100/hr cannot fill that hole: two people fully half-billable is ~160 hrs/mo =
$16K; even a theoretical 320 hrs/mo = $32K. Net **−$37K to −$61K/mo** — you'd need
~987 net-new stations (+18% installed-base growth) at $70 just to get back to even.
Services revenue is linear in hours; software revenue isn't. Don't trade the second
for the first.

### The model

1. **One SKU: the station, all-in, volume-tiered.** Campaigns + Broadcasts +
   Reviews + Notifications included in every station. Suggested card:
   stations 1–10 **$85**, 11–25 **$80**, 26+ **$75** per station/mo.
   Small shops: a 2-station cleaner pays $170 all-in — vs $70×2 + $599 Campaigns
   (impossible) today; marketing stops being priced out of the small end.
   Big customers: the tier discount is the "more benefits at scale," replacing
   today's ad-hoc 5–20% negotiated discounts with a published curve.
   Social, Sites, Ads, Screens, Chatbot stay à la carte on top. SMS segments stay
   usage-billed passthrough.
2. **Existing non-marketing customers: migrate $70 → $80 all-in at renewal.**
   A $10 increase delivered with $199–$599/mo of formerly-paid product included —
   the increase comes with a gift, not a takeaway. 4,538 stations × $10 =
   **+$45.4K/mo (+$545K/yr)**; at $85 flat it's +$68K/mo.
3. **Grandfather the 99 current marketing customers.** They pay ≈$81/station
   effective today ($70 base + subscriptions). Moving them to $80–85 all-in hands
   back ~$60K/mo. Leave them on legacy pricing; offer the new tiers only at renewal
   or churn-risk moments, account by account. This single rule protects the
   **$69.1K/mo** baseline.
4. **New customers sign at the new card from day one** (~160 customers/yr ×
   ~5 stations ≈ 800 stations/yr → **+$12K/mo run-rate by end of year 1** vs $70).
5. **Self-serve enablement replaces high-touch onboarding.** Marketing knowledge
   base + guides owned by support; in-app templates and default automations; DIY
   included in the station price. Tony + Jason move to external/brand marketing and
   **paid success sessions at $100/hr**, plus productized packages (campaign setup
   $499, quarterly marketing review $299) — realistically **+$8–16K/mo**, positioned
   as margin and stickiness, not as the revenue engine.
6. **Measure the flywheel:** marketing attach today is ~10% of customers; bundled,
   it's 100%. Track usage-per-customer, churn on bundled vs legacy cohorts, and
   session bookings. The strategic bet (CleanCloud parity, lower churn, easier
   sales) now costs nothing because the bundle is priced above break-even
   ($13/station) instead of below it ($10).

### Net effect vs today

| Lever | Monthly |
|---|---|
| Existing base $70→$80 all-in (4,538 st) | **+$45.4K** |
| New customers at $85 card (yr-1 exit rate) | +$12K |
| Grandfathered marketing accounts | $0 (protects $69.1K) |
| Paid success sessions + packages | +$8–16K |
| **Total vs today** | **≈ +$53K to +$96K/mo (+12% to +22%)** |

Compared with **−$53K to −$61K/mo** under free-inclusion at $70. Same customer story
("marketing is now included in your station price"), opposite revenue outcome.

---

*Caveats: 296 of 852 marketing-client stations are estimates (client-level list
flagged in `data/scenario_detail.csv`); active-station total inferred from 2,535
stores × 2.13 stations/store; Social, Ads, Websites, Screens, Chatbot revenue
excluded from "in-app marketing" per scope; AUD at 0.65.*
