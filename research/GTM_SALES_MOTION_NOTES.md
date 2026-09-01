# AI Phone Service — Go-to-Market & Sales Motion Notes

**Status:** Working notes, captured Aug 31 2026. **Awaiting contracting details and options from Tony.**
**Companion to:** `AI_PHONE_SERVICE_RESEARCH.md` (build-vs-buy, cost model, vendor selection)

These are captured decisions, not yet a finished plan. Contract terms will be added and this doc revised.

---

## 1. In-app pop-up campaign

Promotional pop-up inside SMRT, targeted by customer tenure.

| Audience | Trigger | Frequency |
|---|---|---|
| **Existing clients** | — | **Once per year** |
| **New clients** | 30 days since go-live | Once |
| **New clients** | 60 days since go-live | Once |
| **New clients** | 90 days since go-live | Once |

New clients therefore see three pop-ups in their first quarter, then roll into the annual cadence.

## 2. Automated email

- An automated email is set up that can **trigger the message to customers about the marketing**.
- **Additionally: an email about marketing goes out at 60 days since go-live.**

Note: the 60-day mark carries **both** a pop-up and an email — assumed intentional as a coordinated double-touch at the midpoint of the new-client sequence. Confirm.

## 3. Free trial and contract

- **First 30 days free.**
- Sold **with a contract** — the customer signs up front.
- **Risk-free opt-out within the first 30 days.**
- After day 30, **the contract takes effect.**

## 4. Future — Q4 2026 or beyond

**Automated billing for in-app services**, with **customer self-serve opt-in inside SMRT**.

This is the piece that makes the pop-up campaign actually convert. Until self-serve opt-in and auto-billing exist, every pop-up has to hand off to a human to close, which caps conversion regardless of how good the targeting is. Worth treating as the unlock for §1 rather than as an unrelated roadmap item.

---

## Open items — to be supplied

- [ ] **Contracting details and options** (Tony to provide) — term length, pricing tiers, opt-out mechanics, what happens at renewal
- [ ] Anchor date for the "once per year" existing-client pop-up — contract anniversary, go-live date, or a fixed campaign window?
- [ ] Does the 30-day free trial start at signup or at go-live? These differ if provisioning takes time.
- [ ] Pop-up creative, copy, and dismissal behavior — does dismissing count as "shown" for the year?
- [ ] Suppression rules — a customer who opts out or cancels should presumably not see the annual pop-up

## Flagged dependencies

**Trial cost is real.** On the CTM path the service runs roughly **$62/store/month** at mid volume. A 30-day free trial costs about that per signup, unrecovered if they opt out. At 100 trial signups with a 60% conversion rate, that's ~$2,500 of unrecovered trial cost. Not a blocker — worth being deliberate about, and an argument for qualifying trial signups rather than opening it to everyone at once.

**Compliance does not pause during a trial.** AI disclosure and the recording-consent announcement apply from the first call, trial or not. See §6/§10 of the research doc.

**Sequencing.** The 30/60/90 pop-ups can launch against the CTM pilot without waiting for anything. Self-serve opt-in and auto-billing (§4) are the Q4+ item, and until they land the pop-ups need a human close path defined.
