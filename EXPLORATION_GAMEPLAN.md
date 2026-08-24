# Exploration Gameplan — Trials & Contracts (replacing Tier 1)

Ownership direction: per-station pricing is dead. In-app marketing stays a paid
subscription. Three concepts to flush out before the new plan is written, plus
one Tier 2 adjustment.

**What we already know (do not skip this):** the billing sheet's trial tab shows
**125 SMRT Start one-month free trials** (mostly Sep–Dec 2025): **18 converted
(~16%), 94 discontinued**, and the notes say why — "never activated," "nothing
ran," "no conversation." The product didn't fail; **activation** failed. Both
new trial concepts are SMRT Start with a better hook, so the exploration's core
question is: *what makes a trial customer actually send something in week 1?*

Baseline economics for all three: average in-app subscription **$682/mo**
($67.5K / 99 customers). Trial hard cost ≈ $30–40 (Twilio number + A2P
registration + segments). **One conversion pays for ~20 trials** — even a 5%
conversion rate is profitable; 16% is a money printer *if* activation is fixed.

---

## Workstream A — New-customer trial (tied into implementation)

**Concept:** every new SMRT customer gets 1 month free of in-app marketing only
(Campaigns, Broadcasts, Reviews), wired into onboarding/implementation.

| Explore | Detail |
|---|---|
| Key questions | When does the trial start — go-live day, or +2 weeks when they're stable? Who provisions Twilio/10DLC during implementation? Opt-out or opt-in default? What's pre-loaded (templates, first campaign) so something sends without effort? Who owns the day-30 conversion conversation — implementation, sales, or marketing? |
| Data to pull | T4PO onboarding volume (~160 new customers/yr → ~13/mo trial flow); SMRT Start conversions cut by *how soon after go-live* the trial started; implementation team capacity |
| Design work | Trial-in-onboarding checklist; pre-seeded "first 30 days" campaign pack; day-7 / day-21 / day-30 touchpoints; conversion offer at trial end |
| Economics to model | 13 trials/mo × conversion % × $682 = new MRR (at SMRT Start's 16%: **+$1.4K/mo new MRR added every month**, compounding to ~$17K/mo run-rate by month 12); cost ≈ $500/mo of trial COGS |
| Risks | Onboarding overload (marketing on top of POS learning curve); 10DLC setup time eats the trial month — may need trial clock to start at first send, not signup |
| Decision gate | Trial timing + ownership defined, activation plan written, implementation team signed off |

## Workstream B — Existing-customer trial (dashboard launch)

**Concept:** the new Marketing Dashboard launch is the event — invite current
non-marketing customers (~790) to see the dashboard and run in-app marketing
free for 1 month, then decide.

| Explore | Detail |
|---|---|
| Key questions | Launch as one event or cohort waves (10DLC provisioning limits ~how many/week)? What does the trial dashboard show a customer with no history — pre-populated with their POS data (lapsed customers, review-ready customers) so it's compelling on day 1? What's the day-30 offer — standard pricing, or a launch price? Do SMRT Start discontinued accounts get re-invited? |
| Data to pull | **SMRT Start post-mortem first**: per-trial activation (did they send?), what converters did differently, re-contactable list of the 94; segment non-marketing base by fit (stores, station count, review volume) to rank invite order |
| Design work | Dashboard-launch campaign (email/in-app/webinar); "your data is already in here" first-open experience; activation checklist mirroring Workstream A; safeguards on by default |
| Economics to model | 790 candidates × invite-acceptance % × conversion % × $682. Example: 25% try (198), 16% convert (32) = **+$21.8K/mo (+32% marketing MRR)**; trial COGS ≈ $8K one-time |
| Risks | Mass 10DLC provisioning bottleneck; support surge from 200 novice senders (learning center must precede launch); a bad first week burns the one shot at "launch" energy |
| Decision gate | SMRT Start post-mortem done, cohort plan + provisioning capacity confirmed, dashboard first-open experience spec'd |

## Workstream C — In-app marketing contracts (seasonal-churn defense)

**Concept:** offer term contracts (e.g., 12 months) at a lower price; customer
saves money, we stop losing marketing subscriptions every slow season.

| Explore | Detail |
|---|---|
| Key questions | How big is seasonal churn actually? (Billing notes show the pattern: summer "xcels" and pauses — Kodiak "reviews for summer, may come back," Town & Country pause, River Oaks downgrade.) What discount buys a 12-month commitment — 10%? 15%? Does the contract allow a "hibernate" month at reduced rate instead of cancel? Align with the 3-year POS contract or standalone? Monthly billing with term commitment, or prepay? |
| Data to pull | From the billing sheet: every marketing cancel/downgrade/pause by month → seasonality curve and $ lost per year to seasonal churn; average months-paused before return; who came back vs left for good |
| Design work | 2–3 contract constructs to price (e.g., 12-mo at 10% off; 12-mo with one hibernation month at 50%; seasonal-business plan billed 10 of 12 months); legal/billing feasibility |
| Economics to model | Discount cost on the committed base vs churn saved. Example frame: if seasonal pauses/cancels cost ~2 months × N customers × $682/yr, a 10% discount breaks even when contracts prevent ~1.2 months of loss per customer per year |
| Risks | Discounting customers who were never going to churn (deadweight cost) — mitigate by offering contracts at renewal/save moments, not blanket; collections friction on terms |
| Decision gate | Seasonality quantified from billing data, break-even discount computed, one construct picked to pilot with ~10 accounts |

## Tier 2 adjustment (carry into the new plan)

- **Remove** the support-transition piece (no Tier 1 to hand off to).
- **Add:** Tony **reimplements the success workflow** — structured check-ins,
  usage reviews, and dashboard-driven touchpoints designed to **increase
  upsells and retention** across the marketing base (and to run the day-30
  conversion motion for Workstreams A/B).

## Sequence (3 weeks to a new plan)

| Week | Do |
|---|---|
| 1 | SMRT Start post-mortem (feeds A and B) · pull seasonal churn data (feeds C) · confirm 10DLC provisioning capacity |
| 2 | Design: trial-in-onboarding flow (A) · dashboard-launch cohort plan (B) · price 2–3 contract constructs (C) |
| 3 | Economics finalized for each · decision gates reviewed · write the new plan around what survives |

**Recommended priority if forced to sequence: B → A → C.** B has the biggest
immediate pool (790 customers) and a natural event (dashboard launch); A is the
compounding long-term engine; C protects whatever A and B create.
