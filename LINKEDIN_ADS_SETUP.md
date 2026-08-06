# Adspirer LinkedIn Ads Setup — SMRT Systems

Snapshot of the LinkedIn Ads account configuration as managed through Adspirer.
Captured: 2026-08-06.

## Connection

| Item | Value |
|---|---|
| Platform | LinkedIn Ads (via Adspirer MCP) |
| Ad Account | SMRT Systems — ID `549630143` |
| Status | Connected, active |
| Organization | `urn:li:organization:19229106` |

Other connected platforms in the same Adspirer workspace: Google Ads
(Model Laundry & Cleaners `9500365037`, active; SMRT Systems `8744786941`,
not activated) and Meta Ads (SMRT Systems `1419625035925738`, active).

## Campaign Groups

| Group | ID | Status |
|---|---|---|
| SMRT Geofencing - Platform A/B Test | `1197932214` | ACTIVE |
| New Campaign | `1197592954` | REMOVED |

## Campaign

**SMRT Geofencing - LI-AD - US Dry Cleaning Owners - 07/29**

| Setting | Value |
|---|---|
| Campaign ID | `839304494` |
| Group | SMRT Geofencing - Platform A/B Test (`1197932214`) |
| Status | ACTIVE (serving: RUNNABLE) |
| Objective | WEBSITE_VISIT |
| Format | Sponsored Content (STANDARD_UPDATE) |
| Cost type / bid | CPC, $10 unit cost, ENHANCED_CONVERSION optimization |
| Daily budget | $10 USD |
| Total budget | $183 USD |
| Schedule | Started 2026-07-29, ends 2026-08-15 |
| Audience expansion | Off |
| Offsite delivery (LAN) | Off |

### Targeting (all conditions AND-ed)

- **Seniority:** CXO, Partner, Owner (`urn:li:seniority:8/9/10`)
- **Industry:** `urn:li:industry:2258`, `urn:li:industry:2272` (laundry/dry-cleaning-related services)
- **Location:** United States (`urn:li:geo:103644278`)
- **Locale:** en_US

### Creatives (6 total — 3 active, 2 paused, 1 removed)

| Creative | ID | Status | CTA | UTM campaign/content |
|---|---|---|---|---|
| Geofencing End Card - LI-AD - Ad 1 | `1481560434` | ACTIVE (serving) | REQUEST_DEMO | geofencing_us_aug2026 / li_ad_us_routes |
| Geofencing Wk1 - V4 - Identity copy - on-brand image | `1486219764` | ACTIVE (serving) | REQUEST_DEMO | geofencing_us_aug2026 / li_ad_us_builtby |
| Geofencing Wk1 - V3 - ROI copy | `1486419184` | ACTIVE (serving) | REQUEST_DEMO | geofencing_us_aug2026 / li_ad_us_miles |
| Geofencing Horizontal - LI-AD - Ad 2 | `1481541714` | PAUSED | LEARN_MORE | geofencing_2wk_jul2026 / li_ad_la |
| Geofencing Wk1 - V4 - OFF-BRAND COLORS - do not run | `1486279334` | PAUSED | REQUEST_DEMO | geofencing_2wk_jul2026 / li_ad_la_v4 |
| Geofencing Map - LI-AD - Ad 1 | `1481465604` | REMOVED | LEARN_MORE | geofencing_2wk_jul2026 / li_ad_la |

All creatives land on `https://www.smrtsystems.com/sales-demo/` with
`utm_source=linkedin&utm_medium=paid_social` plus the per-ad campaign/content
values above.

## Conversion Tracking (LinkedIn Insight Tag, pid `9426258`)

| Conversion | ID | Type | Method | Value | Associated to campaign |
|---|---|---|---|---|---|
| SMRT Demo Booked (Demodesk) | `29183290` | LEAD | Insight Tag URL match | $50 fixed | Yes (`839304494`) |
| SMRT Geofencing 2wk - LI-AD - LA Metro - Wk1 - LEAD | `29183210` | LEAD | URL starts with `www.smrtsystems.com/sales-demo/` | none | Yes (`839304494`) |
| SMRT demo Booking page view | `29183202` | KEY_PAGE_VIEW | URL starts with `https://www.smrtsystems.com/` | $10 dynamic | No |
| auto-created - Lead | `29183322` | LEAD | Insight Tag website signal | dynamic | No |

Attribution windows: 30-day post-click / 7-day view-through on the LEAD rules;
90/90 on the page-view rule. The insight tag is firing (recent callbacks
recorded on `29183210` and `29183202`).

## Recent Performance (30-day lookback as of 2026-08-06)

- Impressions: 32
- Clicks: 1 (landing page clicks: 1)
- Spend: $16.20
- Conversions: 0

## Notes

- The campaign is optimized toward enhanced conversions with the demo-booked
  ($50) and sales-demo-page LEAD rules attached.
- The "SMRT demo Booking page view" and "auto-created - Lead" rules exist but
  are not associated with the campaign.
- The off-brand V4 creative is intentionally paused ("do not run").
- The campaign ends 2026-08-15; the A/B test group has no group-level budget
  cap (budgets are set at the campaign level).
