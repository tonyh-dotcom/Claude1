# In-App Marketing Contracts — Options & Mechanics

Scope: **in-app marketing only** (Campaigns, Broadcasts, Reviews). Purpose:
retention through the slow season, offered (a) at day-30 of the opt-out trial
and (b) to current marketing customers before summer. Saved alongside this for
the next plan: **the opt-out trial** — 1 month free, card/billing already on
file, continues as a paid subscription unless they cancel.

## The problem, quantified

- Cancellation tickets cluster **April–September**: ~24 marketing cancels/
  downgrades logged across April (4), June (4), July (7), August (5), Sept (4+).
- Average in-app subscription: **$682/mo**. A summer canceller who never
  returns is worth $4,092/yr; a 3-month pauser $6,138/yr; a full-year customer
  $8,184/yr.

## What each construct earns per customer per year (at $682/mo)

| Construct | 12-mo revenue | vs full-year monthly | vs 3-mo summer pauser |
|---|---|---|---|
| Monthly, stays all year | $8,184 | — | +$2,046 |
| Monthly, pauses 3 summer months | $6,138 | −$2,046 | — |
| Monthly, cancels in summer for good | $4,092 | −$4,092 | −$2,046 |
| **A. 1-yr @ 20% off** (proposed) | $6,547 | −$1,637 | **+$409** |
| **B. 2-yr @ 30% off** (proposed) | $5,729/yr | −$2,455 | **−$409** |
| C. 1-yr @ 10% off | $7,366 | −$818 | +$1,228 |
| D. 1-yr @ 15% off | $6,956 | −$1,228 | +$818 |
| **E. Seasonal contract: 12-mo term, 2 summer months at 50%** | $7,502 | −$682 | **+$1,364** |
| **F. Loyalty: pay monthly, 13th month free on completion** | $7,554/yr eq. | −$630 | +$1,416 |
| G. 1-yr prepaid upfront @ 15% | $6,956 + cash now | −$1,228 | +$818 |

### The honest read on 20%/30%

- **1-yr @ 20% works, but only aimed at the right people.** It beats the
  pauser case by $409 — but costs $1,637/yr for every loyal customer who takes
  it. Offered blanket, most takers are people who were staying anyway.
- **2-yr @ 30% loses money even against the churn case** (−$409 vs a pauser).
  It only pays off against full cancellation — keep 30% as a *save offer* for
  accounts actively cancelling, not a menu item.
- **The seasonal and loyalty constructs (E, F) beat both discounts** on
  revenue while speaking directly to the summer problem: "don't cancel in
  July — July and August are half price on the annual plan" / "finish the year,
  get a month free."

## Recommended menu (three options a customer can pick from)

| Offer | Terms | Effective discount | Aimed at |
|---|---|---|---|
| **Season Saver** (lead offer) | 12-mo term, monthly billing, pick your 2 slow months at 50% off | ~8% | Everyone — the anti-summer-cancel product |
| **Annual 15** | 12-mo term, monthly billing, 15% off every month; +prepay option bumps to 20% | 15–20% | Post-trial converts & price-sensitive accounts |
| **Two-Year 20 + price lock** | 24-mo term, 20% off, rate locked against future increases | 20% | Large accounts, save situations; 30% reserved as a retention counter-offer only |

Why 15/20 instead of 20/30: every 5 points of discount across the 97-customer
base is ~$3.4K/mo ($40K/yr). Discounts should clear the churn they prevent —
20/30 blanket doesn't; 15/20 targeted does, and 30% stays in your pocket as
the last-resort save.

## How it works (mechanics)

1. **Term + auto-renew:** 12 or 24 months, auto-renews at term end at
   then-current rate (notice window 30 days). Monthly billing continues as
   today — the contract is a commitment, not a billing change (prepay optional).
2. **Enforcement = discount clawback, not lawsuits:** cancel mid-term and the
   discount received to date is rebilled (the gap between contract rate and
   monthly rate). Simple to administer, fair to the customer, and it makes the
   contract self-enforcing without collections drama.
3. **Pause instead of cancel:** contract customers get the hibernation valve
   (Season Saver months, or one 50% month/yr on Annual) — the release that
   prevents mid-term cancellation fights.
4. **Billing implementation:** one contract flag + rate override per account in
   the billing app; no new SKUs. Twilio/segment passthrough unchanged.
5. **Where it's offered:**
   - **Day-30 of the opt-out trial** — "keep it monthly at $X, or take 15% off
     with the annual plan" (contract capture at the moment of highest intent);
   - **Pre-summer campaign (March–April)** to the monthly base — Season Saver
     pitch before the cancellation window opens;
   - **Save desk** — any cancel request gets the 2-yr/deep-discount counter.
6. **Guardrails:** discounts apply to in-app subscription only (never to SMS
   segments or managed services); one contract per account (no stacking with
   legacy bundle discounts); AU/EU rate cards get equivalent percentages.

## What exploring this needs (2 weeks)

1. Pull every 2025–2026 marketing cancel/pause with month + reason → exact $
   lost to seasonality per year (the budget a discount may spend).
2. Interview 5 summer cancellers: would Season Saver have kept them?
3. Legal/billing sanity check on clawback language + auto-renew notice rules
   (state-by-state auto-renewal laws for the prepaid variant).
4. Pilot target: 10 contracts before summer — mix of post-trial and save-desk.
