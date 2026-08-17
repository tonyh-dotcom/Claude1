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

*Caveats: 296 of 852 marketing-client stations are estimates (client-level list
flagged in `data/scenario_detail.csv`); active-station total inferred from 2,535
stores × 2.13 stations/store; Social, Ads, Websites, Screens, Chatbot revenue
excluded from "in-app marketing" per scope; AUD at 0.65.*
