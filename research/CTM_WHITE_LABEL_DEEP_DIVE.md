# CTM White Label — Can We Make It Our Own?

**Date:** September 3, 2026
**Companion to:** `AI_PHONE_SERVICE_RESEARCH.md` §8 (why CTM), `GTM_SALES_MOTION_NOTES.md` (sales motion)

**Short answer: yes, substantially — but CTM's own white label gets you about 80% of the way, and the last 20% leaks in specific, identifiable places. The good news is the API is deep enough that we can close every one of those gaps ourselves, and doing so is the same work that buys us the exit path.**

---

## 1. Three tiers of "our own"

| Tier | What it is | Effort | Who the customer thinks they're using |
|---|---|---|---|
| **1 — CTM white label** | Their UI on our domain, our logo | $65/mo + $99 setup, 2 days | SMRT, until they look closely |
| **2 — Our dashboard on their API** | SMRT UI, CTM as invisible backend | Weeks of front-end work | SMRT, entirely |
| **3 — Our backend too** | The Twilio stack from the main doc | ~$200k, ~300 stores to justify | SMRT, entirely |

**Recommendation: launch on Tier 1, move to Tier 2 within 6–12 months, treat Tier 3 as the volume-triggered swap.** Tier 2 is the important one — it's what makes the branding total *and* what makes the eventual backend swap invisible to customers. Same work, two payoffs.

---

## 2. What CTM's white label actually covers

Verified from CTM's own documentation and support portal:

| Covered | Detail |
|---|---|
| **Custom domain** | The whole system runs on our domain |
| **Logo** | Displayed throughout the system |
| **Login pages** | White-labeled |
| **System emails** | Sent from our own email address |
| **Help / contact pages** | White-labeled with our content |
| **Client pricing** | We set what clients pay and keep the spread |
| **Sub-accounts** | Unlimited on Marketing Pro and above |

**Cost:** **$65/month plus a $99 one-time setup fee**, roughly 2 business days to provision. Requires Marketing Pro ($179/mo) or above — the white-label fee is flat, not per sub-account, so it barely moves the model.

**Correction to the §8 figures:** the main research doc modeled CTM at $179/mo platform fee. Add $65/mo for white label. At 500 stores this changes cost per store from $61.54 to $61.67 — immaterial, but the model should say $244/mo in fixed platform cost, not $179.

---

## 3. Where CTM still shows through

This is the part worth knowing before committing.

### 3.1 The Terms of Service follow the white label

CTM's ToS explicitly governs "**re-branded/white labeled versions**" of the software. It also states: *"Customers that rebrand, white label, or otherwise resell our services are responsible for ensuring their provision of services to their customers complies with all applicable laws."*

Two consequences:
- **The compliance burden is entirely ours.** Correct and expected — but it means the TCPA, AI disclosure and recording-consent obligations from the main doc sit on SMRT, not on CTM.
- **A customer who reads carefully will find CTM.** Not a dealbreaker for laundromat owners, but it's the reason Tier 2 matters if the brand story has to be airtight.

### 3.2 The mobile app is CTM-branded

The "CallTrackingMetrics Agent" app is listed publicly under CTM's name on the app stores, and there's no indication of a white-labeled build. **Mitigation:** our use case — passive monitoring plus an after-hours AI agent — probably doesn't need the agent app at all. Stores answer on the phones they already own. **Confirm this on the sales call**; if the app turns out to be required for any workflow we plan to sell, the brand leaks on day one.

### 3.3 CTM owns the phone numbers

The ToS reserves the right: *"CTM may need to change the telephone number assigned to the Customer."*

**Already mitigated** by the architecture in the main doc — the store's published number stays on their own carrier and forwards into CTM. Only the disposable per-campaign marketing numbers are CTM's, and those are meant to churn. This is a second, independent reason not to let CTM's numbers become anyone's primary line.

### 3.4 The agency subscription doesn't stop when sub-accounts do

ToS §8.3: *"In the case of an agency plan, the monthly subscription fee will continue to be charged to the Customer until the agency has been canceled (canceling just the sub-accounts will not stop the monthly subscription fee from being charged)."*

Operationally trivial, but worth a note in the runbook so nobody assumes churning every store ends the bill.

### 3.5 Support escalation

Deep technical issues eventually route to CTM engineers. **Ask on the sales call** whether they will operate under our name for escalations, or whether the customer ends up in a CTM-branded ticket queue.

---

## 4. What the API lets us build — the real answer to "make it our own"

The CTM REST API exposes **nine collections: accounts, sub-accounts, numbers, calls, recordings, transcriptions, agents, reports, webhooks.** JSON throughout, with both single-account and **multi-account level access** for agencies.

That surface is deep enough to run the entire product from SMRT:

| We want to | API supports it |
|---|---|
| Onboard a store without anyone touching CTM's UI | ✅ Create sub-accounts programmatically |
| Assign tracking numbers per campaign | ✅ Provision numbers programmatically |
| Mirror everything into SMRT storage | ✅ Pull calls, recordings, transcriptions |
| React to calls in real time | ✅ Webhooks on call activity |
| Show our own dashboard | ✅ Reports + raw call data |
| Run our own laundry-specific analysis | ✅ Pull transcripts, analyze in SMRT |

**One structural quirk:** webhooks are **global only — they cannot be scoped to an individual sub-account**, so a global webhook fires for every sub-account in the agency. For us this is fine and arguably better: one endpoint into the SMRT pipeline, routed by sub-account on our side. It would be a problem only if we needed per-tenant webhook isolation, which we don't.

**Webhooks and API both require Marketing Pro or above.** Confirms the earlier finding — never take the Lite tier.

CTM also runs **API office hours every Wednesday with senior engineers**, which is a genuinely useful de-risker for the integration work.

---

## 5. VoiceAI configurability

The after-hours agent is configured per agent with name, description, welcome message, instructions, 47 voice options (including emotion-aware voices), knowledge sources from existing website content and documentation, prebuilt templates, and custom conversation flows. Tools let the agent modify activity records, pull insight, and transfer to a live agent.

**Open question:** whether VoiceAI agents can be templated and deployed across sub-accounts programmatically, or whether each store's agent must be built by hand in the UI. **At 500 stores this is the difference between a config push and a hiring plan.** Nothing in the public docs answers it — put it at the top of the sales-call list.

**Pricing discrepancy to resolve:** CTM's pricing page says $0.12/min with **60 minutes included per agent**; their VoiceAI launch announcement says **250 complimentary test minutes with every new agent created**. These are plausibly a one-time 250-minute test allowance plus 60 recurring minutes per month, but that's an inference. Confirm which is recurring — at 500 agents the difference between 60 and 250 free minutes per month is roughly $11,000/mo.

---

## 6. Real-world limitations users report

From published agency reviews, so treat as directional:

- **Agency accounts cannot have multiple sub-accounts open and reporting at once.** Real friction for anyone managing hundreds of stores in CTM's own UI — and another argument for Tier 2.
- **Limited report customization.** Same conclusion.
- **Complex setup**, and support access that can be inconsistent or carry extra fees.
- At least one report of **auto-renewal followed by an unfulfilled refund promise**. Read the renewal and termination clauses before signing.

Positives are also consistent: agencies describe CTM staff as knowledgeable and responsive, with named people doing custom white-label training.

---

## 7. The 10DLC problem — biggest hidden onboarding cost

If we send SMS follow-ups (booking links, confirmations — part of the spec), each store needs A2P 10DLC registration. CTM's Trust Center requires **one registration per sub-account**, and the underlying rule is **one EIN = one brand**. Agencies **cannot register all clients under the agency's own EIN**.

**So 500 stores means 500 brand registrations, each requiring that store's EIN.**

Two things follow:

1. **This is not a CTM limitation.** The Campaign Registry imposes it on everyone — the Twilio build path in the main doc carries exactly the same requirement. It doesn't affect the build-vs-buy call.
2. **It is real per-store onboarding friction and per-store recurring cost**, and it scales linearly with the fleet. Collecting an EIN from a laundromat owner is a sales-process problem as much as a technical one.

**Recommendation:** make 10DLC registration part of the automated onboarding flow from day one, and consider whether V1 ships SMS at all — the voice product works without it, and deferring SMS removes 500 registrations from the critical path.

---

## 8. Recommended posture: rented engine, our chassis

| Phase | White-label posture | What the customer sees |
|---|---|---|
| **0 — Pilot (weeks 1–4)** | Tier 1: CTM white label, $65/mo + $99 | SMRT-branded CTM |
| **1 — Scale (months 2–9)** | Tier 1 + build mirroring pipeline and SMRT attribution join | Same, but our data is already safe |
| **2 — Own the chassis (months 6–12)** | Tier 2: SMRT dashboard on CTM's API. Onboarding, reporting and analysis all in SMRT | SMRT only. CTM invisible |
| **3 — Own the engine (month 18+, ~300 stores)** | Tier 3: swap CTM for Twilio behind the same UI | No change — they never notice |

The through-line: **every gap in CTM's white label is closed by the same work that buys us the exit.** Building our own dashboard on their API isn't a separate project from migration insurance — it's the same project, and it pays off twice.

---

## 9. Questions for the CTM sales call

**Blocking — these change the plan:**
1. Can VoiceAI agents be **templated and deployed programmatically across sub-accounts**, or is each one hand-built in the UI?
2. Is the recurring VoiceAI allowance **60 minutes/agent/month or 250**? (≈$11k/mo swing at 500 agents.)
3. Real **per-minute rate at our volume** — published range is $0.05–0.08, a 60% spread that moves the whole model.
4. Are the **3,000 included transcription minutes per-account or per-sub-account**? Also a five-figure swing.

**Important:**
5. Is the **mobile agent app** required for any workflow we plan to sell? Is a white-labeled build available at any tier?
6. **Tracking number pricing at 500+ numbers**, and volume discounts on VoiceAI minutes.
7. **API rate limits** at agency scale — 500 sub-accounts, continuous mirroring, a global webhook firing on every call.
8. Will support **operate under our brand** for escalations?
9. **Data retention limits** on Marketing Pro, and what happens to recordings and transcripts on cancellation.
10. **Renewal and termination terms** — given the auto-renewal complaint in the reviews.
11. Do they support **10DLC registration in bulk / via API**, given one-per-sub-account with the client's EIN?

---

## Sources

- [CTM — plans and pricing](https://www.ctm.com/plans-pricing/)
- [CTM — Terms of Service](https://www.ctm.com/legal/tos/)
- [CTM support — Custom Domain White Labeling](https://calltrackingmetrics.zendesk.com/hc/en-us/articles/7013443979661-Custom-Domain-White-Labeling)
- [CTM support — How to Resell CTM](https://calltrackingmetrics.zendesk.com/hc/en-us/articles/7014340894093-How-to-Resell-CTM)
- [CTM support — Webhooks API Integration](https://calltrackingmetrics.zendesk.com/hc/en-us/articles/6021057338125-Webhooks-API-Integration)
- [CTM support — Trust Center: A2P 10DLC Registration](https://calltrackingmetrics.zendesk.com/hc/en-us/articles/15819191005965-Trust-Center-A2P-10DLC-Registration-Text-Messages)
- [CTM support — VoiceAI](https://calltrackingmetrics.zendesk.com/hc/en-us/articles/37410874369421-VoiceAI)
- [CTM support — Adding a New Account (Sub-Account)](https://calltrackingmetrics.zendesk.com/hc/en-us/articles/6468079917965-Adding-a-New-Account-Sub-Account)
- [CTM — VoiceAI product page](https://www.calltrackingmetrics.com/features/lead-management/voiceai)
- [CTM — Developer API support and resources](https://www.ctm.com/solutions/developers/)
- [CTM API — Postman collection](https://postman.calltrackingmetrics.com/)
- [CTM launches VoiceAI — press release](https://www.prnewswire.com/news-releases/calltrackingmetrics-launches-voiceai-solution-to-transform-contact-center-operations-with-responsible-ai-automation-302547808.html)
- [Best white-label call tracking software 2026 — AvidTrak](https://avidtrak.com/resource/best-white-label-call-tracking-software)
- [CTM reviews — G2](https://www.g2.com/products/ctm-formerly-calltrackingmetrics/reviews)
- [CTM reviews — Capterra](https://www.capterra.com/p/152004/Call-tracking-software/reviews/)
- [A2P 10DLC registration for agencies](https://a2pgenius.com/blog/highlevel-a2p-registration-guide-for-agencies/)
