# White-Label AI Phone Service — Build vs. Buy Research (v2)

**Prepared for:** SMRT Systems
**Date:** August 31, 2026 · supersedes v1 of the same date
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
