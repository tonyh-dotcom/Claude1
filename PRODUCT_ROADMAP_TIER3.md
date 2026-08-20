# Tier 3 — Product Build Plan (Marketing)

Master backlog and sequencing for the marketing product build-out. Companion to
`MARKETING_TRANSFORMATION_PLAN.md` (pricing) and `TEAM_TRANSFORMATION_GAMEPLAN.md`
(team). Sizing: S ≈ <2 wks · M ≈ 2–6 wks · L ≈ 6–12 wks · XL ≈ quarter+.

## Master backlog

| # | Item | Size | Serves | Depends on | Notes |
|---|---|---|---|---|---|
| A1 | Pre-seeded default campaigns (winback, birthday, first-visit, review velocity) | S | Tier 1 attach | template library content | Ship with attach launch |
| A2 | Global quiet hours + frequency caps (all send types) | M | Launch gate | — | Generalizes the reviews safeguard; blocks mass attach until live |
| A3 | SMS segment tracker (usage + cost dashboard) | S–M | Tier 1 | SMRT-10131 counter | Per-send + monthly rollup, $0.014 math shown |
| A4 | SMS + email template library (searchable, branded) | M | Tier 1/2 | new hire (creative) | Hire produces the art; A1 draws from it |
| A5 | ROI calculator re-scope to per-station pricing | S | Tier 1 | SMRT-10004 (in master) | Investment = station price share + segments — the "easy ROI" you specified |
| A6 | Dashboard metric parity closeout | S | Trust | SMRT-10476 in review | Wrong numbers ×10 customers becomes ×100 at scale |
| B1 | Google Business Profile analytics (Performance API) | M | Reviews value | Google OAuth app verification (lead time!) | Impressions, calls, direction requests, search terms next to review stats |
| B2 | Referral system: templated referral campaign + manual POS mode | M–L | Growth loop | SMRT-10474 promo-link attribution (done) | Referral code = promo infra; attribute referrer→referee revenue |
| B3 | Facebook & Yelp review expansion (rating-gate) | M | Reviews depth | A2 safeguards | Sentiment gate first; positive → link out, negative → mitigation inbox. **Yelp = presence/link only (solicitation banned); Facebook allows requests.** Staggered optional campaigns inside SMRT Reviews |
| B4 | Review data → effectiveness score | S | Analytics | B3, SMRT-10269 | Closes the spec'd gap |
| C1 | Website analytics: first-party tagging on SMRT Sites → SMRT dashboard | L | Jason's product | SMRT Sites | Own tag > per-customer GA4 OAuth (less support surface, data in-app); GA export later |
| C2 | In-app "book a marketing expert" + learning-center tooltips | S | Tier 2 | learning center live | Calendly-class embed is fine for v1 |
| D1 | Ads analytics in SMRT (Google, Meta, LinkedIn) | L | Tony's product | OAuth apps per platform | Client-visible ROAS dashboard = retention engine for managed ads |
| D2 | Visual journey builder (CleanCloud / Customer.io class) | XL | Flagship moat | stable send infra, A2 | POS-native triggers (order events, garment types, visit cadence) are the differentiator CleanCloud can't copy |
| D3 | A/B testing (subject/offer split on campaigns) | M | Self-service quality | D2 or standalone | Can ship standalone before journey builder |
| E1 | Per-station billing mechanics (SKU retirement, proration, tier logic) | M | Tier 1 GA | pricing decision | Billing app work, not marketing module |
| E2 | 10DLC provisioning pipeline (cohort automation) | M | Tier 1 rollout | Twilio ops | The physical rate limiter on attach |
| F1 | **RCS Business Messaging** (rich cards, carousels, branded verified sender, read receipts, SMS fallback) | XL — long-term | Channel moat | carrier/aggregator RCS agent verification, Twilio RCS GA, internal R&D already underway | The industry is moving to RCS as the texting norm. Hurdles are real (per-carrier agent verification, iOS/Android coverage still maturing, per-message pricing TBD, template re-work) — but SMRT already has someone running RCS testing/development internally, so this is a parallel R&D track, not a quarter deliverable. Early payoff: verified branded sender improves trust/deliverability even before rich features; journey builder (D2) and template library (A4) should be designed channel-agnostic so RCS slots in as a send channel later without rebuilds |

## Quarter-by-quarter

| Quarter | Ships | Theme |
|---|---|---|
| **Q1 — "Ready to scale"** | A6 parity closeout · A2 quiet hours/caps · A3 segment tracker · A4 template library v1 · A1 seeded campaigns · A5 ROI re-scope · E1 billing · E2 10DLC pipeline | Everything the pricing launch needs. Small items, high leverage — this quarter IS the Tier 1 launch gate. |
| **Q2 — "Visible value"** | B1 GBP analytics · B2 referral system · C2 expert booking + tooltips | New attaches see fresh value fast; referrals turn the newly-attached base into a growth loop. Start Google/Meta OAuth app verification now (lead time for D1). |
| **Q3 — "Own the data"** | B3 FB/Yelp rating-gate · B4 reviews→score · C1 site tagging/analytics | Reviews depth + Jason's site analytics differentiator. Begin D2 journey-builder design/spec with real usage data from Q1–Q2. |
| **Q4 — "The moat"** | D1 ads analytics · D3 A/B testing · D2 journey builder (build; GA Q1 next year if needed) | Tony's ads retention dashboard + the flagship. Journey builder lands when attach is high, so it compounds across the whole base. |
| **Ongoing — "Next channel"** | F1 RCS Business Messaging (R&D track) | Runs in parallel all year with the existing internal tester/developer: Q1–Q2 keep evaluating (Twilio RCS capability, agent verification path, cost model); Q3 decide pilot scope; pilot with 3–5 marketing customers when carrier coverage justifies it. Design A4 templates and D2 journeys channel-agnostic now so RCS plugs in as a send channel without rebuilding. |

## Sequencing logic (why this order)

1. **Q1 is enablement, not features** — every item de-risks the pricing flip:
   safeguards stop novice-sender disasters, the segment tracker kills billing
   surprises, seeded campaigns + templates make "included marketing" feel loaded
   on day 1, parity makes the dashboard trustworthy, E1/E2 are the launch machinery.
2. **Referrals before journey builder**: B2 rides on already-shipped promo
   attribution (SMRT-10474) — cheap now, and it multiplies the newly attached base.
3. **Own tagging (C1) over GA4 OAuth**: per-customer Google OAuth is a support
   tax forever; first-party tagging keeps data in the SMRT dashboard and makes
   SMRT Sites genuinely better than a generic site builder. GA export can come later.
4. **Journey builder last but designed early**: it's the biggest lift and the
   deepest moat (POS-event triggers). Building it after attach scales means every
   improvement lands on 5× the audience; spec starts Q3 using real usage data.
5. **OAuth verification lead times** (Google GBP, Google/Meta/LinkedIn ads) are
   weeks-long external clocks — file early even though the features land later.

## Compliance guardrails (product rules, not suggestions)

- Yelp: never a "review us on Yelp" send — presence/link only. Rating-gate keeps it safe.
- Quiet hours + frequency caps are global and on by default; staggered scheduling
  for review campaigns so multi-campaign customers can't bombard one consumer.
- TCPA/opt-out handling documented in the learning center as part of Q1.

## Open decisions

| Decision | Options | Needed by |
|---|---|---|
| Final per-station price/tier card | $55 BE · $60.50 (+10%) · $70 (+27%) · tiers $25/$50/$75 (+26%) | before E1 build |
| GA connection vs own tagging only | own tagging (recommended) / both | Q3 kickoff |
| Journey builder scope v1 | trigger-flows only vs full canvas w/ branching | Q3 spec |
| Referral reward mechanics | promo credit / dollar credit / free service | Q2 kickoff |
| A/B testing standalone in Q2? | pull forward if eng capacity allows | Q2 planning |
