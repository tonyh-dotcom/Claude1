# Station Marketing & Pricing Analysis

**Source:** Jira project `T4PO` ("4 Phase Onboarding") — smrtsystems.atlassian.net
**Extracted:** 2026-08-14 · 1,426 issues (full project export)
**Fields used:** Station Count (`customfield_10149`), Go Live Date (`customfield_10127`), Marketing Status (`customfield_10287`), issue type, status
**Raw data:** [`data/t4po_stations.csv`](data/t4po_stations.csv)

---

## 1. Dataset overview

| Issue type | Count | Done | Cancelled | Notes |
|---|---|---|---|---|
| New Customer v2 | 1,205 | 990 | 172 | Core onboarding record, 1 per customer |
| Station Add On | 102 | 92 | 10 | Post-go-live station expansions |
| Sub-task | 93 | — | — | No station data; excluded |
| Touch Control – New Customer | 26 | 24 | 2 | Small deployments (1–4 stations) |

Station Count is populated on 1,185 of 1,205 New Customer records (98%); a
handful of gaps were backfilled from summaries formatted like
"Customer Name - 12 st".

**Cancellation rate on new-customer onboardings: 14.3%** (172 of 1,205).

## 2. Headline numbers (active/completed new customers)

- **1,015 customers** with a station count > 0
- **5,099 total stations** deployed
- **Mean 5.0 stations / customer · median 3**
- Deciles: 10% of customers have 1 station; 50% have ≤3; 80% have ≤7; 90% have ≤11; max 58

## 3. Customer size segments

| Segment | Customers | % of customers | Stations | % of stations |
|---|---|---|---|---|
| 1 station | 211 | 20.8% | 211 | 4.1% |
| 2 stations | 210 | 20.7% | 420 | 8.2% |
| 3–5 stations | 311 | 30.6% | 1,195 | 23.4% |
| 6–10 stations | 173 | 17.0% | 1,287 | 25.2% |
| 11–20 stations | 83 | 8.2% | 1,170 | 22.9% |
| 21+ stations | 27 | 2.7% | 816 | 16.0% |

Key structural fact: **41.5% of customers are 1–2 station shops but they hold
only 12.3% of stations**, while the **10.9% of customers with 11+ stations
hold 38.9% of stations**. Per-station pricing therefore concentrates revenue
in a small number of large accounts; a per-location or tiered floor protects
revenue in the long tail.

## 4. Go-live trend by year (non-cancelled New Customer v2)

| Go-live year | New customers | Stations | Avg stations/customer |
|---|---|---|---|
| 2020 | 70 | 238 | 3.8 |
| 2021 | 158 | 792 | 5.0 |
| 2022 | 154 | 872 | 5.7 |
| 2023 | 165 | 813 | 4.9 |
| 2024 | 164 | 817 | 5.0 |
| 2025 | 170 | 858 | 5.0 |
| 2026 (partial, through Aug + scheduled) | 105 | 542 | 5.2 |

New-customer volume has been remarkably stable at **~155–170 customers and
~800–870 stations per year since 2021**, with average deal size flat at
~5 stations. Growth is not coming from bigger initial deals; expansion
revenue must come from add-ons or price.

## 5. Station add-ons (expansion)

- 92 completed add-on orders totaling **~300 stations** — roughly a **6%
  uplift** on the installed base, median order size **1 station** (mean 3.0,
  skewed by one 51-station order).
- Add-on issues recorded: 50 in 2022, 35 in 2023, 7 in 2024, none after —
  the tracking of add-ons in T4PO appears to have stopped rather than the
  expansion itself; treat post-2023 expansion data in this project as
  incomplete before drawing conclusions.

## 6. Marketing Status field

The Marketing Status field is only populated on 176 recent records
(T4PO-764 → T4PO-1458, go-lives Feb 2024 → Dec 2026), and only two values
occur: **New (166)** and **Canceled (10)**. It is currently functioning as a
new-vs-cancelled flag on recent onboardings, not as a funnel/marketing stage
tracker. If marketing attribution or campaign-driven pricing analysis is the
goal, this field needs either more states or consistent backfill.

## 7. Implications for pricing & marketing

1. **The median customer is small (3 stations).** Entry pricing and
   marketing messaging should be validated against the 1–2 station segment,
   which is 41% of logos.
2. **Revenue is top-heavy.** ~11% of customers (11+ stations) carry ~39% of
   stations — enterprise-style handling (negotiated tiers, dedicated
   onboarding) for this segment has outsized revenue impact.
3. **Initial deal size is flat since 2021.** Any per-customer revenue growth
   thesis should rest on expansion and pricing, not larger new deals.
4. **Add-on motion is under-instrumented.** ~6% station expansion is the
   measurable floor, but tracking stopped in 2024; fix instrumentation
   before pricing expansion.
5. **14% onboarding cancellation rate** is a meaningful leak; the 10
   "Canceled" marketing-status records in the 2024+ cohort suggest it
   continues at roughly the historical rate.
