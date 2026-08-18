# Marketing Department Transformation Plan

Three tiers: **Pricing** ($70/station all-in, in-app marketing included) ·
**Team** (one owner per external service + self-service enablement) ·
**Software** (analytics integrations, referral, journey builder, review expansion).

Positioning: the bundle attacks **CleanCloud** (POS + marketing in one price) on
one flank and **Cleaner Marketing / BC360** (agency services) on the other —
software included, experts optional.

---

## The numbers this plan has to respect

| Fact | Value |
|---|---|
| In-app marketing revenue today (Campaigns/Broadcasts/Reviews) | **$69.1K/mo** from 99 customers |
| À la carte revenue that stays paid (Social $5.4K · Websites $2.8K · Ads $1.1K · Screens $0.3K) | **$9.5K/mo** |
| Customers gaining marketing access at $70 all-in | ~900 (attach goes ~10% → 100%) |
| Effective rate the 99 pay today | ≈ $81/station |
| Max realistic paid-sessions revenue (2 people × $100/hr) | $8–16K/mo |

**The core issue to manage:** $70 all-in eventually gives up the $69.1K/mo line,
and the three retained services earn only $9.5K/mo today — they'd need ~8×
growth to replace it. The plan closes this gap three ways: (1) grandfather the
99 and **convert them to "Managed Marketing" retainers** — what they're really
paying for is expertise and execution, which doesn't become free; (2) grow the
three owned services with dedicated owners; (3) paid success sessions and
productized packages. Target: exit year 1 with ≥ 60% of the $69.1K retained as
services/managed revenue.

---

## Phase 0 — Foundations (Weeks 1–4)

1. **Finish the dashboard truth layer.** Mass rollout multiplies every metrics
   bug by 10×. The parity work is nearly done — close out SMRT-10476 (report
   parity), and confirm SMRT-10474 (promo click attribution), SMRT-10400 (CTR
   definition), SMRT-10389/10388 (review + insights reconciliation) hold in prod.
2. **Migration policy decision (the big one).** For each of the 99: default =
   grandfather (no change) with a renewal-window offer to convert the software
   subscription into a **Managed Marketing plan** (e.g., Starter $299/mo:
   monthly campaign calendar + quarterly review; Growth $599/mo: everything
   managed). The pitch to them: "the software is now included in your stations;
   your fee now buys our team running it for you."
3. **10DLC / Twilio audit.** ~900 new senders need numbers, A2P campaign
   registration, and deliverability setup. Price the COGS (number + campaign
   fees ≈ $5–15/customer/mo at Twilio list), decide pass-through vs absorb,
   and design a cohort-based provisioning pipeline — this is the physical rate
   limiter on rollout speed.
4. **Baseline KPIs:** support tickets/week tagged marketing, campaigns sent per
   active customer, segment volume, reviews captured, session pipeline.

## Phase 1 — Self-service before free (Weeks 4–12)

The order matters: **enablement ships before pricing flips**, or support drowns.

1. **Marketing Knowledge Base + guides** (owned by support, written by the
   marketing team): setup wizards, campaign playbooks per use-case (winback,
   birthday, first-visit, referral), deliverability/compliance guide.
2. **In-app template seeding:** default trigger campaigns + broadcast templates
   installed on every instance so "free" comes pre-loaded, not blank.
3. **Safeguards ship here** (they're launch gates, not roadmap items):
   frequency caps / quiet hours / staggered sends so 900 novice senders can't
   bombard customers; the live SMS segment counter (SMRT-10131) so cost
   surprises don't become support tickets.
4. **Support transfer:** tier-1 marketing questions to main SMRT support with
   an escalation path; marketing team trains support, then stops taking dailies.
5. **Pilot cohort:** flip ~50 customers to bundled-free marketing. Measure
   support load, activation %, segment costs. Fix, then scale.

## Phase 2 — Pricing + team GA (Weeks 8–20, overlapping)

1. **Announce $70/station all-in** — "every station now includes SMRT
   Campaigns, Broadcasts, and Reviews." Roll out in provisioning cohorts
   (10DLC constraint), new customers first, then existing base by segment.
2. **Grandfathered 99:** renewal-window conversations using the per-customer
   delta table (`data/marketing_customer_deltas.csv`) — every one of them
   gains value; the conversion target is Managed Marketing, not cancellation.
3. **Team structure:**
   - **Jason → SMRT Websites** (product owner: templates, SEO baseline, the
     tagging/analytics roadmap item is his product's differentiator)
   - **Dayana (new hire, design-focused) → SMRT Social** (owner; design
     capacity also serves websites, ad creative, and template library art)
   - **Tony → SMRT Ads** (owner; productize: setup fee + monthly management
     tiers rather than pure hourly)
   - Each owner carries a P&L target: suggested year-1 exits — Social
     $5.4K→$15K, Websites $2.8K→$8K, Ads $1.1K→$10K (≈ $33K/mo combined).
4. **Paid success sessions at $100/hr (Tony + Jason)** + productized packages
   (campaign setup $499, quarterly marketing review $299, managed plans above).
   Booking flow inside the app ("Talk to a marketing expert").

## Phase 3 — Software roadmap (quarterly)

Re-sequenced slightly from the original list: cheap high-leverage items that
support the mass rollout come first; the journey builder is the flagship.

| Qtr | Ship | Notes |
|---|---|---|
| Q1 | **Google Business Profile analytics** (Performance API) | Free API, direct Reviews-module synergy, visible value for every bundled customer |
| Q1 | **SMS segment tracker + SMS template library** | Pulled forward: cost transparency + fast time-to-value for 900 new senders; builds on SMRT-10131 |
| Q2 | **Referral system** | Templated referral campaign (promo-link attribution from SMRT-10474 is the tracking backbone) + manual POS mode |
| Q2 | **Facebook & Yelp review expansion** | Rating-gate flow: capture sentiment first; positive → link out, negative → mitigation inbox. Staggered/optional campaigns inside SMRT Reviews with over-messaging safeguards. ⚠️ **Yelp compliance:** Yelp prohibits soliciting reviews — Yelp must be link-in-profile/footer presence only, never "leave us a Yelp review" sends; Facebook allows requests |
| Q3 | **Website analytics** | Own first-party tagging on SMRT Sites (page views, clicks, conversions → SMRT dashboard). Prefer own tagging over per-customer GA4 OAuth — less support surface, data stays in-app, differentiates Jason's product; offer GA export later |
| Q4 | **Ads analytics in SMRT** (Google, Meta, LinkedIn) | Feeds Tony's Ads product: client-visible ROAS dashboard is the retention mechanism for managed-ads revenue |
| Q4+ | **Visual journey builder** (CleanCloud / Customer.io class) | Flagship differentiator; biggest eng lift; by now attach is 100% so every improvement compounds across the whole base |

**Features discussed previously that were missing from your list:**
- Live SMS segment counter in the compose UI (SMRT-10131 — companion to the tracker)
- Marketing ROI / investment calculator with per-business price history
  (SMRT-10004) — *needs rework under bundling: investment becomes station-price
  share + segments instead of subscription fees*
- Campaign Effectiveness Score (0–100 A–D grading) and per-campaign/broadcast
  detail views (SMRT-10269) from the Campaign Analytics spec
- Promotion revenue attribution & click-vs-auto-apply stamping (SMRT-10474,
  SMRT-10400) — also the backbone for referral tracking
- Review data feeding the effectiveness score (spec'd as future release)
- Dashboard ↔ report metric parity (SMRT-10476, 10389, 10388)
- Worth adding: **email** template library alongside SMS; A/B subject/offer
  testing; global quiet-hours + frequency-cap policy (generalize the reviews
  safeguard to all sends); win-back and birthday templates in the default seed
  set.

---

## KPIs

| Tier | Metric | Target (12 mo) |
|---|---|---|
| Pricing | Customers actively sending campaigns | ≥ 50% of base (from ~10%) |
| Pricing | Revenue retained from the 99 (managed plans + grandfathered) | ≥ 60% of $69.1K |
| Pricing | Churn on bundled vs pre-bundle cohorts | −2pts+ |
| Team | Owned-services MRR (Social+Web+Ads) | $9.5K → $33K/mo |
| Team | Paid sessions + packages | $8–16K/mo run-rate |
| Team | Marketing tickets handled by tier-1 support | ≥ 80% |
| Software | Segment volume (usage-billed revenue) | 3–5× |
| Software | Reviews captured/customer/mo | 2× |

## Issues & risks (the honest list)

1. **The revenue hole is real and front-loaded.** Free-at-$70 forfeits up to
   $69.1K/mo; services replace it slowly and linearly. The Managed Marketing
   conversion of the 99 is the single most important commercial motion in the
   whole plan — resource it like a launch, not an afterthought. Without it,
   year-1 net is deeply negative; with 60% conversion, the plan is roughly
   revenue-neutral in year 1 and grows from there.
2. **Sequencing risk:** pricing before enablement = support flood + SMS
   compliance incidents. Hold the line: KB, templates, safeguards, pilot, then GA.
3. **10DLC provisioning is the rollout bottleneck** and a per-customer COGS
   (~$5–15/mo) the $70 price now absorbs — decide pass-through explicitly.
4. **Owner capacity conflicts:** Tony owns Ads *and* paid sessions *and* the
   billing sheet today; Jason owns Websites *and* subscription shutoffs. Move
   billing operations to finance as part of Tier 2 or the "efficiency" goal fails.
5. **One new hire carrying Social + all design** is thin; her design backlog
   (templates, web, ad creative) will compete with Social growth targets —
   set the split explicitly (e.g., 60% Social / 40% shared design).
6. **Yelp solicitation ban** (above) — build the rating-gate so Yelp is
   presence-only; violating it risks customers' Yelp standing.
7. **CleanCloud will respond on price.** The durable moat is POS-native data
   (order history, garment types, visit cadence) powering journeys they can't
   replicate from a lighter POS — which argues for pulling the journey builder
   forward if engineering capacity allows.
8. **Watch AU/EU:** bundling changes the AUD/EUR/GBP price cards too; the AU
   accounts are on special rates that need their own migration line.

*Sources: billing sheet + price list (this repo's `data/`), T4PO/Close station
analysis, SMRT Jira in-flight tickets. All monthly figures from
`PER_STATION_MARKETING_PRICING.md`.*
