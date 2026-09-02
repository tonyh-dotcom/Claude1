# Contracting for In-App Marketing — CFO Discussion Sheet

Goal: retention contracts for in-app marketing (Reviews, Broadcasts, Campaigns).
Average subscription **$682/mo**; cancellations cluster **April–September**
(~24 tickets logged last cycle). Every construct below is mapped to what our
billing actually supports today: monthly QB SKUs, percentage discount fields,
and manual credit memos — a "contract" is a signed term + a discount/credit
configuration, not a new billing engine.

## The options

| # | Construct | How it works | Customer pitch | 12-mo revenue @ $682 | Billing mechanics |
|---|---|---|---|---|---|
| 1 | **Season Saver** (lead offer) | 12-mo term, billed monthly; customer picks 2 slow months at 50% | "Don't cancel in July — your slow months are half price" | $7,502 (vs $6,138 for a 3-mo pauser) | 2 scheduled credit memos/yr, or discount % flipped on for 2 months — both exist today |
| 2 | **Risk-free first month + 1-yr term** (the discussed idea) | Month 1 free and fully cancellable; staying past day 30 starts a 12-month commitment | "Try it free; if it's not working, walk away — if you love it, you're locked at this rate" | $7,502 (11 paid + 1 free) | Month-1 credit memo; term tracked on the contract doc + a "contract end" date column (billing sheet already tracks start/cxl dates) |
| 3 | **Annual 15** | 12-mo term, monthly billing, 15% off | "Commit for a year, save 15%" | $6,956 | Existing per-service discount % field — zero new mechanics |
| 4 | **Prepaid annual** | 12 months invoiced upfront at 15–20% off | "One invoice, biggest savings" | $6,956–$6,547 + cash up front | Single QB invoice; needs CFO call on deferred-revenue handling |
| 5 | **13th month free** (loyalty credit) | Pay monthly at full rate; complete 12 consecutive months → month 13 free | "Stay the year, get a month on us" | $7,554/yr equivalent | One credit memo at month 13; only rewards customers who actually didn't churn — zero deadweight discount |
| 6 | **Hibernate clause** (add-on to any term) | Contract customers may suspend 1 month/yr at 50% (not $0) instead of cancelling | "Pause, don't cancel" | ~$7,843 with one 50% month | Credit memo on request; replaces today's ad-hoc full cancellations |
| 7 | **Save-desk deep discount** (not on the menu) | 20–30% off × 12-mo term, offered only when a customer is actively cancelling | Retention counter-offer | $6,547–$5,729 | Discount % field; requires an authority rule (who can grant what) |

## What we CAN do with current billing (no dev work)

- Percentage discounts per service per customer (already used: 5–75% exist today)
- One-off and scheduled **credit memos** (already used: "1/2 May–Aug credit" was issued this year)
- Start/cancel/contract dates tracked per account (billing sheet columns exist)
- Annual prepay as a single QB invoice
- Enforcement via **discount clawback**: early cancel → rebill the discounts/credits received (a manual invoice — same mechanism as today's back-billing, e.g. the Joey's reviews back-bill)

## What we CANNOT easily do (needs CFO/dev decision)

- **Automated proration or mid-month changes** — keep all terms whole-month
- **Automated clawback** — it's a manual invoice; keep constructs simple enough that clawback is rare (that's why Season Saver/13th-month beat deep discounts)
- **Auto-renew with formal notice tracking** — several states require advance
  notice for auto-renewing terms with penalties; safest design: term discount
  expires at month 12 and the account reverts to monthly rate unless re-signed
  (no penalty, no notice-law exposure)
- **Early-termination fees as liquidated damages** — legal review; clawback of
  discounts received is cleaner and easier to defend than ETFs

## Questions to settle with the CFO

1. **Free-month treatment:** credit memo (visible discount) vs $0 invoice — which does finance prefer for rev-rec and reporting?
2. **Discount authority:** what can marketing grant without sign-off (proposal: up to 15% self-serve; 20–30% save-desk requires CFO/controller approval)?
3. **Clawback policy:** on early cancel, do we (a) rebill discounts received, (b) require payout of remaining term, or (c) let them go? (Recommend (a) — self-enforcing and fair.)
4. **Prepaid annual:** acceptable as deferred revenue? Refund policy if they cancel mid-prepay?
5. **Contract paper:** DocuSign addendum to the existing SMRT agreement vs standalone marketing terms — who owns the template?
6. **Term-end behavior:** revert-to-monthly (recommended, avoids auto-renew law) vs auto-renew with notices?
7. **Floor:** what's the maximum blended discount finance will tolerate across the base (proposal: cap total contract discounting at 10% of marketing revenue = ~$6.7K/mo)?
8. **Credits calendar:** can accounting schedule the Season Saver 50% months at signing (two dated credit memos) so nothing depends on someone remembering in July?

## Recommended package to bring

- **Menu:** #2 (risk-free month + 1-yr) as the trial-conversion offer · #1 Season Saver as the seasonal-retention offer · #5 13th-month-free for accounts that refuse terms · #7 reserved for saves.
- **Guardrails:** discounts on the in-app subscription only (never SMS segments); whole months only; revert-to-monthly at term end; clawback on early cancel; save-desk discounts logged with approver.
- **The retention math for the room:** a summer canceller costs $2,046–$4,092/yr. Every construct on the menu costs less than that per retained customer — the only way to lose money is giving deep discounts to customers who were never leaving, which the menu design (lead with #1/#2/#5, gate #7) prevents.
