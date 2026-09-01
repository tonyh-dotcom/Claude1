# White-Label AI Phone Service — Build vs. Buy Research (v2)

**Prepared for:** SMRT Systems
**Date:** August 31, 2026 · v3 — adds §8, prebuilt launch options · supersedes v1
**Scope correction in this revision:** the product is primarily **call monitoring, recording and AI overview with keyword/analytics data across ALL calls**, with **inbound after-hours answering** (FAQ + lead capture) as the secondary component. v1 modeled after-hours answering only. That was the wrong shape and the cost figures were correspondingly wrong.

---

## 0. What changed, and what I got wrong in v1

| v1 claim | v2 finding | Why |
|---|---|---|
| $8.19 / store / month | **$16–88, midpoint ~$38** | v1 modeled 80 min/mo of after-hours audio. Monitoring all calls is 200–1,500 min/mo *and* costs two call legs, not one. |
| 96% gross margin | **75–89%**, 83% at $199 with optimized stack | Direct consequence of the above. |
| $4,095/mo Twilio at 500 stores | **$17,000–25,000/mo** | Same. |
| "The LLM is 6% of cost" | True for answering, **misleading overall** | Across the blended product, telephony legs are the largest line, and AI is ~10%. |
| ConversationRelay $0.07/min | **Confirmed accurate** | Bundles STT + TTS + orchestration. This number held up. |

**Your instinct was right.** The per-minute arithmetic in v1 was correct but applied to the wrong minute count and the wrong call topology. The business is still good — 83% gross margin at $199 — but it is a *normal good SaaS business*, not the 96%-margin outlier v1 implied. Below is what I found when I pushed on it.

---

## 1. Capability inventory

### 1.1 Call monitoring + AI overview (the primary product)

**Capture layer**

| Capability | Status on Twilio | Notes |
|---|---|---|
| Record every inbound call | Yes | `<Dial record="record-from-answer">` on the forwarding leg |
| Dual-channel recording (caller vs. staff on separate tracks) | **Yes, default, no extra cost** | This is a genuine win — speaker separation without diarization guesswork, which makes staff-side analysis reliable |
| Ring time / talk time / hold time | Yes | Call resource timestamps |
| Missed / abandoned call detection | Yes | `DialCallStatus` = no-answer, busy, failed |
| Caller ID + repeat-caller detection | Yes | Match `From` across history |
| Per-source tracking numbers | Yes | One Twilio number per campaign/channel |
| Voicemail + transcription fallback | Yes | |

**Analysis layer** — two options, and they are not equivalent:

*Twilio Conversational Intelligence* ships prebuilt operators: Sentiment Analysis, Summarization, Entity Recognition (locations, organizations, goods, people, quantities, times), Agent Introduction (did staff introduce themselves), Escalation Request (did the caller ask for a manager), Conversation Transfer, and Outbound Call Disposition. Plus **Generative Custom Operators** — natural-language prompts for custom scoring, intent detection and competitive intelligence. PII redaction is available. 11 languages including US/UK/AU English and both Spanish variants. Real-time *and* post-call. Results via API and webhooks. Works on recordings from any provider, not just Twilio.

*BYO (Deepgram batch + our own LLM)* costs ~1/5 as much and produces laundry-specific output that generic operators can't:

| Extraction | Prebuilt operators | BYO |
|---|---|---|
| Summary, sentiment, entities | ✅ | ✅ |
| Manager escalation, staff greeting | ✅ | ✅ |
| "Asked about comforter / wedding gown / same-day" | ❌ | ✅ |
| Price-shopper detection + quoted price captured | ❌ | ✅ |
| Lost/damaged garment complaint | ❌ | ✅ |
| Pickup-and-delivery interest + zone | ❌ | ✅ |
| Store-specific keyword watchlist (competitors, promos) | Partial | ✅ |
| Was an order actually placed within 7 days? | ❌ | ✅ **SMRT-only** |
| New vs. existing customer | ❌ | ✅ **SMRT-only** |

**Dashboard layer** — what the store owner actually sees:
- Missed calls, and estimated revenue behind them
- Intent mix by hour and weekday (drives staffing decisions)
- Price-shopper volume and conversion rate
- Questions nobody could answer (a content gap list)
- Repeat callers = unresolved issues
- Staff scorecards: greeting, quote given, callback promised, upsell offered
- Keyword trend lines on the store's own watchlist
- **Call → order attribution**, which nobody else in this market can do

### 1.2 After-hours answering (the secondary product)

FAQ (hours, location, turnaround, services), price quotes from the store's own list, order status lookup by phone or ticket, lead capture (name, number, service, address, preferred window), pickup/delivery booking onto a route, SMS follow-up with a booking link, warm transfer to an on-call human, voicemail fallback, and Spanish — which matters in this vertical and is a config flag, not a project.

### 1.3 The strategic capability

SMRT already runs Google Ads for these clients. Per-campaign tracking numbers turn phone calls into attributed conversions, which means the marketing package can finally prove ROAS on calls rather than just clicks and store visits. **That is CallRail's entire value proposition, and SMRT is already sitting on both halves of it.** This is the strongest argument for the monitoring product existing at all, and it should be built first.

---

## 2. The architecture problem v1 skipped

To analyze a daytime call you must be **in the call path**. That is a much bigger commitment than after-hours forwarding, and it is where the cost comes from.

| Option | How | Cost/min | Verdict |
|---|---|---|---|
| **A. Tracking number → forward to store** | Publish a Twilio number; it dials the store's existing line | **$0.0225** (2 legs) | ✅ **Recommended.** No porting, instant rollback, works with any phone they own |
| B. Port number → forward to their phones | Same economics, we own the number | $0.0225 | Locks the customer in but adds porting friction |
| C. Port → deliver over SIP to desk phones | Inbound + SIP leg | $0.0100 | Cheapest, but now we're their PBX: E911, hardware, uptime, support. **A different company.** |
| D. SIPREC from their existing PBX | Twilio as recording client | ~$0.005 | Only works if they have a modern SIP PBX. Most don't. |

**Option A is the answer, and the second leg at $0.014/min is the single largest line item in the whole product.** This is the fact v1 missed entirely.

---

## 3. Revised cost model

### 3.1 Per-minute truth

| | $/min |
|---|---|
| One **monitored** minute — 2 legs + recording + Deepgram + analysis | **$0.0308** |
| One **AI-answered** minute — 1 leg + ConversationRelay + LLM + recording | **$0.0860** |

An answered minute costs ~2.8× a monitored minute, but there are 5–10× more monitored minutes. Monitoring dominates the bill.

### 3.2 Per store, per month

Volumes are **estimates, not measured** — I could find no reliable published call-volume data for dry cleaners or laundromats. CallRail bundling only 250 tracking minutes in its base tiers is the best available proxy and suggests most small businesses land in the Low–Mid band.

| Scenario | Monitored | After-hrs AI | Telephony | ConvRelay | Transcr. | AI | Rec. | Storage | Surcharge | Number | **Total** |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Low** | 200 | 80 | $5.18 | $5.60 | $0.86 | $0.70 | $0.70 | $1.68 | $0.52 | $1.15 | **$16.39** |
| **Mid** | 600 | 150 | $14.78 | $10.50 | $2.58 | $1.65 | $1.88 | $4.50 | $1.48 | $1.15 | **$38.51** |
| **High** | 1,500 | 300 | $36.30 | $21.00 | $6.45 | $3.75 | $4.50 | $10.80 | $3.63 | $1.15 | **$87.58** |

Assumes Deepgram transcription, Twilio recording storage at 12-month retention, and a 10% carrier/regulatory surcharge.

### 3.3 Fleet economics at 500 stores, Mid volume

| Stack | COGS/mo | @ $199 | @ $299 |
|---|---|---|---|
| Naive — Twilio transcription, Twilio storage | $25,164 | 74.7% GM | 83.2% GM |
| **Optimized — Deepgram + S3 offload** | **$17,029** | **82.9% GM** | **88.6% GM** |

---

## 4. Three cost traps in the list prices

These are all real, all absent from Twilio's pricing page, and together they are a **28–34% swing**.

**1. Recording storage compounds, and it's the worst one.**
$0.0005/min/month sounds like nothing. It is charged *every month the recording exists*, on the running total. At 500 stores × 750 min/mo with 12-month retention, steady state is 4.5M minutes held:

- Twilio storage: **$2,250/mo**
- Same data in S3 (~1.07 TB): **$25/mo**

That's a **90× difference** and it grows linearly with tenure. Only the first 10,000 stored minutes per parent account are free — we'd exhaust that in the first week. **Offload recordings to S3 on a schedule and delete from Twilio.** Build this into the pipeline from day one; retrofitting it means paying the compounding bill in the meantime.

**2. Twilio transcription is 5.6× Deepgram.**
$0.024/min vs $0.0043/min. At 500 stores × 600 monitored minutes that is **$7,200/mo vs $1,290/mo — $5,910/mo of pure margin.** Use Twilio's Conversational Intelligence to get to a demo fast, then move the transcription layer. The analysis layer should be ours regardless, because the laundry-specific extraction in §1.1 is what sells the dashboard.

**3. Carrier and regulatory surcharges add 5–15% to voice.**
Not on the pricing page. Modeled at 10% above. Budget it.

**Working the other way:** committed-use discounts of 15–30% are available above ~$3,000/mo of spend, and we'd cross that at roughly 100 stores. That partially offsets traps 1 and 3 — but only if someone actually negotiates it, so put it on the roadmap rather than in the model.

**Not in any per-minute number at all:** always-on low-latency hosting for the websocket service, concurrency headroom, 24/7 on-call, and support. A phone product has phone-product uptime expectations — if the after-hours agent dies at 2am, the store's line is dead and they find out from a customer. Budget engineering and ops separately; the per-minute math never captures it.

---

## 5. Competitive reality: CallRail is the real rival here

v1 framed this against voice-AI platforms. For the *monitoring* half — which is now the primary product — the actual competitor is call tracking:

| | Price | Included | Overage |
|---|---|---|---|
| CallRail Lead Tracking | $50/mo | 5 numbers, 250 tracking minutes, transcription | $0.05/extra min, $3/extra number |
| CallRail Lead Tracking Complete | $95/mo | + keyword spotting, 7,500 transcription min | |
| CallRail Lead Conversion | $150/mo | + AI summaries, sentiment, conversion tagging, 10,000 min | $0.04/analysis min |
| CallRail Lead Conversion Complete | $195/mo | Full suite | |

Three things follow:

1. **$199 is a defensible price** — it sits at CallRail's top tier, and we bundle after-hours answering, which CallRail does not have at all.
2. **Sell included minutes with overage, not unlimited.** CallRail's model is the industry norm and it caps our tail risk. 500 monitored minutes + 150 AI minutes included, then $0.10/min, mirrors the market and keeps the High-volume store from eating the margin.
3. **CallRail cannot attribute a call to an order.** We can. That's the wedge.

---

## 6. Does the build-vs-buy answer change?

**No — it gets stronger.** The v1 argument was that per-tenant fees dominate. That still holds, and monitoring adds two more reasons:

- Voice-AI platforms (Vapi, Retell, Bland, Synthflow) are built for *agents*, not *call analytics on human conversations*. Using one for the monitoring half means paying agent-platform rates for something they aren't designed to do.
- The recording pipeline, the S3 offload, and the SMRT-side attribution join all have to be ours anyway. Once you're building that, ConversationRelay for the answering half is a small marginal addition.

The one revision: **build the monitoring product first, not the answering product.** It's the larger revenue driver, it's the one with a proven market price, it's technically simpler (no realtime latency budget, no conversation design), and it plugs straight into the Google Ads work already being sold. After-hours answering is the follow-on.

**Unchanged from v1:** ship inbound-only. No outbound AI calling until there's a real consent architecture.

**New compliance note:** recording *all* calls is a materially higher exposure than recording only after-hours bot calls. All-party consent states require notice on every call, staff included. Announce on every recorded call, without exception, and make the announcement non-configurable by the store owner.

---

## 7. Open questions to settle before Phase 1

1. Does the flat $0.07 ConversationRelay include ElevenLabs voices, or is there an upcharge?
2. What committed-use rate card is available at ~$20k/mo of voice spend?
3. Actual call volumes — instrument 5 real stores for 30 days before pricing is fixed. Every number in §3.2 rests on an estimate.
4. Retention policy: 12 months assumed. Legal should set it; it drives storage cost linearly.
5. Concurrency limits and CPS on the parent account at 500 subaccounts — confirm with Twilio and request increases early.

---

## 8. Prebuilt options — launching without building the backend

Added after the v2 review. The question: is there something off-the-shelf that does **both** halves, white-labeled, that we can launch on now and migrate off later?

**Yes. CallTrackingMetrics (CTM), Marketing Pro tier.**

Because the primary product is call monitoring, the right category to shop is **white-label call tracking**, not voice-AI platforms. That's a mature market with real agency/reseller infrastructure — and one vendor in it has since added an AI voice agent, which closes the gap to our full spec.

### 8.1 CTM Marketing Pro — $179/mo

| | |
|---|---|
| Platform fee | **$179/mo total** (annual $149) — not per sub-account |
| Sub-accounts | **Unlimited** |
| White label | Included: custom domain, our logo throughout, white-labeled login pages, emails from our address, white-labeled help pages |
| Billing | Custom billing — we set client prices and keep the spread |
| API | Open API + developer resources (Marketing Pro and above; **not** on Lite) |
| Transcription | 3,000 minutes included, then $0.02/min |
| Tracking minutes | ~$0.05–0.08/min |
| Tracking numbers | Small monthly fee each (~$2–3 modeled) |
| **VoiceAI agent** | **$0.12/min, 60 min included per agent** — answers calls, books appointments, qualifies leads, FAQ, routes and transfers |
| Call handling | IVRs, queues, geo-routing, schedule/intent/history-based flows |
| Analytics | Speech-to-text, keyword spotting, call scoring, AskAI summaries |

That is essentially the entire v2 spec, prebuilt. The white-label story is genuinely complete — custom domain, our branding end to end — and unlimited sub-accounts on a flat $179 means **no per-tenant tax**, which was the exact trap that disqualified every voice-AI platform in v1.

### 8.2 CTM vs. building, at every scale

Modeled at 600 monitored + 150 AI minutes per store per month. Build figures use the v2 optimized stack plus $2,000/mo hosting and on-call.

| Stores | CTM/mo | $/store | Build/mo | $/store | Delta | GM @ $199 (CTM) | GM @ $199 (build) |
|---|---|---|---|---|---|---|---|
| 10 | $732 | $73.20 | $2,341 | $234.06 | −$1,609 | 63.2% | −17.6% |
| 25 | $1,652 | $66.06 | $2,852 | $114.06 | −$1,200 | 66.8% | 42.7% |
| 50 | $3,184 | $63.68 | $3,703 | $74.06 | −$519 | 68.0% | 62.8% |
| 100 | $6,249 | $62.49 | $5,406 | $54.06 | +$843 | 68.6% | 72.8% |
| 200 | $12,379 | $61.90 | $8,812 | $44.06 | +$3,567 | 68.9% | 77.9% |
| 300 | $18,509 | $61.70 | $12,218 | $40.73 | +$6,291 | 69.0% | 79.5% |
| 500 | $30,769 | $61.54 | $19,030 | $38.06 | +$11,739 | 69.1% | 80.9% |
| 1,000 | $61,419 | $61.42 | $36,060 | $36.06 | +$25,359 | 69.1% | 81.9% |

**Payback on a ~$200k build, versus staying on CTM:**

| At this many stores | Monthly saving from building | Payback |
|---|---|---|
| 100 | $843 | 237 months — never |
| 200 | $3,567 | 56 months |
| 300 | $6,291 | 32 months |
| 500 | $11,739 | **17 months** |
| 1,000 | $25,359 | 8 months |

CTM holds a flat ~69% gross margin at any scale — its cost is almost entirely variable. Building trades that for 81% but demands the capital up front. **The crossover is around 300 stores; it becomes compelling at 500.**

### 8.3 The recommendation

**Launch on CTM. Build when the fleet justifies it.**

- A 10-store, 3-month pilot costs about **$2,200 total** with zero engineering.
- Building to the same point is **~$200k and 4–6 months before the first call connects.**
- 69% gross margin from day one is a real business. Waiting six months for 81% is not obviously better, and it is definitely riskier.

### 8.4 Protecting the exit — the one decision that matters

The whole plan depends on being able to leave. Porting numbers away from a call tracking provider takes **4–6 weeks** and LOA paperwork that losing carriers scrutinize and reject over trivial mismatches. Doing that for 500 numbers is a project measured in quarters, and it is the mechanism by which platforms keep agencies they've stopped serving well.

**So never let CTM's numbers become the store's published number.**

Keep the store's own existing number as the one on their door, their van and their Google listing, and **forward it into CTM**. Then:

- Migrating later means **changing a forwarding rule**, not porting anything.
- The store keeps the number they've had for twenty years, which also removes the biggest objection at the point of sale.
- Marketing tracking numbers (per-campaign, for the Google Ads attribution play) *can* be CTM's — those are disposable by design and nobody has them memorized.

Four more exit disciplines, cheap to maintain from day one:

1. **Mirror all data out continuously.** Export call logs, recordings and transcripts into SMRT storage on a schedule via the open API — don't wait for a migration. Most providers delete data shortly after cancellation.
2. **Keep the analysis layer ours where possible.** Even on CTM, run our own extraction against exported transcripts for the laundry-specific and SMRT-join fields. Then the differentiated product never lived inside CTM and never has to move.
3. **Own the customer-facing dashboard.** Use CTM white-label at first, but plan for SMRT's own UI reading the CTM API. Customers should be looking at SMRT, not at a reskinned CTM.
4. **Require Marketing Pro, not Lite.** Lite has no API access, which forfeits every point above.

Do these four and the migration is a backend swap the customer never sees. Skip them and CTM owns the product.

### 8.5 Alternatives considered

| Option | Verdict |
|---|---|
| **CTM Marketing Pro** | ✅ **Recommended.** Only option covering both halves with real white label, unlimited sub-accounts, and an open API |
| **Nimbata** | Strong white-label call tracking — $149/mo Agency + $55/mo white-label add-on, and a per-*answered-call* model that suits our low-volume stores. **But no AI voice agent**, so the after-hours half would need a second vendor |
| **CallRail** | Best-known, but agency pricing scales poorly and white label is weaker. Also our closest competitor's product |
| **WhatConverts** | $149 Agency + $50 white label. More lead tracking than call analytics; no answering |
| **Vapi / Retell / Synthflow / Bland** | Wrong category. Built for agents, not analytics on human conversations, and all carry the per-tenant tax |
| **GoHighLevel** | $50–97 per sub-account. Disqualified on the same grounds as v1 |

**Open questions for a CTM sales call:** the real per-minute rate at our volume (published range is $0.05–0.08 — a 60% spread that swings the model), tracking number pricing at 500+ numbers, whether VoiceAI minutes carry volume discounts, whether the 3,000 included transcription minutes are per-account or per-sub-account, and data retention limits on Marketing Pro.

### 8.6 Revised build plan

| Phase | What | When |
|---|---|---|
| **0** | CTM Marketing Pro, 10 stores, forwarding into CTM from their own numbers. Prove demand and learn real call volumes. | Weeks 1–4 |
| **1** | Sell to 100+. Build only the mirroring pipeline (API → SMRT storage) and the SMRT-side attribution join — small work, high differentiation. | Months 2–9 |
| **2** | SMRT-native dashboard reading CTM's API. Customers now see our product, not CTM's. | Months 6–12 |
| **3** | At ~300 stores, revisit. Swap the CTM backend for the Twilio stack in v2, keeping the same UI and the same forwarding rules. | Month 18+ |

Note what this preserves: **the v2 Twilio architecture is still the destination.** CTM is the on-ramp, not a change of direction. Every number in §1–7 remains the plan for Phase 3.

---

## Sources

- [Twilio — Conversational AI pricing](https://www.twilio.com/en-us/products/conversational-ai/pricing)
- [Twilio — US Voice pricing](https://www.twilio.com/en-us/voice/pricing/us)
- [Twilio docs — TwiML `<ConversationRelay>`](https://www.twilio.com/docs/voice/twiml/connect/conversationrelay)
- [Twilio — Conversational Intelligence product page](https://www.twilio.com/en-us/products/conversational-ai/conversational-intelligence)
- [Twilio docs — Conversation Intelligence billing](https://www.twilio.com/docs/conversations/intelligence/understanding-billing)
- [Twilio docs — Prebuilt Operator subresource](https://www.twilio.com/docs/conversational-intelligence/api/prebuilt-operator-subresource)
- [Twilio docs — Generative Custom Operators](https://www.twilio.com/docs/conversational-intelligence/generative-custom-operators)
- [Twilio — dual-channel call recordings by default](https://www.twilio.com/en-us/changelog/dual-channel-voice-recordings-by-default)
- [Twilio support — cost to record a call](https://support.twilio.com/hc/en-us/articles/223132527-How-Much-Does-It-Cost-to-Record-a-Call)
- [Twilio — external call recording storage in AWS S3](https://www.twilio.com/en-us/changelog/external-storage-for-call-recording-is-now-available)
- [Twilio docs — `<Siprec>`](https://www.twilio.com/docs/voice/twiml/siprec)
- [Twilio docs — Elastic SIP Trunking](https://www.twilio.com/docs/sip-trunking)
- [Twilio — ISVs: set up for success](https://www.twilio.com/en-us/blog/isv-getting-started-with-twilio)
- [CallRail pricing 2026 — CloudTalk](https://www.cloudtalk.io/blog/callrail-pricing/)
- [CallRail pricing guide — Nimbata](https://www.nimbata.com/blog/callrail-pricing-guide)
- [CallRail pricing, plans and overages — Call Tracker](https://calltracker.io/blog/2026-08-08-callrail-pricing/)
- [Deepgram pricing 2026](https://diyai.io/ai-tools/speech-to-text/deepgram-pricing-2026/)
- [Twilio pricing — hidden fees breakdown](https://bonvoice.com/insights/twilio-pricing/)
- [Twilio pricing and cost guides — Telphi](https://www.telphiconsulting.com/blog/twilio-pricing)
- [Twilio software pricing and plans — Vendr](https://www.vendr.com/marketplace/twilio)
- [US voice AI regulations — founders' guide](https://softcery.com/lab/us-voice-ai-regulations-founders-guide)
- [TCPA compliance for AI voice agents 2026](https://www.henson-legal.com/ai-voice-compliance)
- [CTM — plans and pricing](https://www.ctm.com/plans-pricing/)
- [CTM — VoiceAI](https://www.calltrackingmetrics.com/features/lead-management/voiceai)
- [CTM — agency and white-label program](https://www.ctm.com/agencies-and-affiliates/white-label/)
- [CTM support — porting numbers away](https://calltrackingmetrics.zendesk.com/hc/en-us/articles/7258332647821-Porting-Numbers-Away-from-CallTrackingMetrics)
- [Nimbata — pricing](https://www.nimbata.com/pricing)
- [Nimbata — best call tracking software for agencies](https://www.nimbata.com/blog/best-call-tracking-software-for-agencies)
- [Best white-label call tracking software 2026 — AvidTrak](https://avidtrak.com/resource/best-white-label-call-tracking-software)
- [Switching call tracking providers: a migration guide](https://www.callflux.net/blog/switching-call-tracking-providers-migration-guide)
- [CallRail help — port a number away](https://support.callrail.com/hc/en-us/articles/5711677430669-Port-a-phone-number-away-from-CallRail)
