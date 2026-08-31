# White-Label AI Phone Service — Build vs. Buy Research

**Prepared for:** SMRT Systems — new AI after-hours answering + call-intelligence product
**Date:** August 31, 2026
**Question:** Can we build a GoHighLevel-style AI voice product on Twilio, fully white-labeled, and sell it profitably to hundreds of laundry/dry-clean customers?

**Short answer:** Yes — build it on Twilio ConversationRelay inside SMRT. The deciding factor is not per-minute cost, it is **per-tenant cost**. Every white-label platform on the market taxes you $25–$100 per sub-account per month. At 500 small customers that tax is larger than your entire Twilio bill. Twilio subaccounts are free.

---

## 1. What we are actually building

Two products that share one pipeline:

| Product | What it does | Who it's for |
|---|---|---|
| **AI After-Hours Answering** | Answers calls when the store is closed. Quotes prices, checks order status, books pickup/delivery, takes messages, texts a booking link, escalates emergencies. | Every SMRT store |
| **Call Intelligence ("AI Overviews")** | Records + transcribes *all* calls (including staff-answered daytime calls), then produces per-call summaries and roll-up dashboards: missed calls, top intents, price-shoppers lost, unanswered questions, staff handling quality. | Upsell / higher tier |

The second one is the sneaky-valuable half. Answering is a commodity; **"here's the revenue you lost on the phone last month"** is not, and it's only possible because SMRT already holds the order and route data.

---

## 2. The Twilio stack

### 2.1 Call flow

```
Store's existing number (keep their carrier — no porting risk)
   └─ after-hours conditional forward ──▶ Twilio number in that store's SUBACCOUNT
                                              │
                                    TwiML: <Connect><ConversationRelay>
                                              │  (bidirectional websocket)
                                              ▼
                                    SMRT Voice Agent Service
                                    ├─ tenant config (hours, prices, services, zones)
                                    ├─ LLM loop (text in / text out)
                                    └─ tools ──▶ SMRT API
                                                 • order status by phone/ticket
                                                 • price quote from store price list
                                                 • book pickup/delivery on a route
                                                 • create lead / message
                                                 • warm transfer to on-call human
                                                 • send SMS booking link
                                              │
                                    call ends ─┴─▶ transcript → summarizer LLM
                                                    → structured record in SMRT
                                                    → owner digest (SMS/email)
                                                    → Call Intelligence dashboard
```

**ConversationRelay** is the key primitive. Twilio handles STT, TTS, barge-in/interruption, DTMF and session management; you hold the conversation over a websocket in plain text and bring your own LLM. Default providers are Deepgram (STT) and ElevenLabs (TTS), with Google/Amazon voices also available, plus automatic language detection in `multi` mode.

**Why forwarding, not porting:** conditional call forwarding from the store's existing line means zero number-porting risk, instant activation, instant rollback if the owner hates it, and no involvement from their current phone provider. Porting is the #1 reason SMB phone rollouts stall. Offer porting later as an option, never as a requirement.

### 2.2 Per-tenant isolation

One **Twilio subaccount per SMRT customer**. This is the standard Twilio ISV pattern and it gives us, for free:

- Per-customer usage reporting → clean rebilling and true per-customer COGS
- Blast-radius containment on credential compromise
- Per-customer geo-permissions and number inventory
- Independent Trust Hub / STIR-SHAKEN and A2P 10DLC registration per brand

Do **not** create Twilio Console logins for customers — that exposes account-wide data across all tenants. Customers only ever see the SMRT UI.

### 2.3 The "AI overview" layer — two ways, 5× cost difference

For **AI-handled calls** you already have the transcript for free: ConversationRelay hands you every utterance over the websocket. Log it, run your own summarizer. Cost per call ≈ **$0.002**. Do not pay Twilio to re-transcribe audio you already have in text.

For **human-answered calls** you need real transcription:

| Path | Transcription | Analysis | Total |
|---|---|---|---|
| Twilio native | $0.024/min batch | Conversational Intelligence operators ~$0.005/min | **~$0.029/min** |
| BYO | Deepgram Nova-3 batch $0.0043/min | own LLM ~$0.002/min | **~$0.006/min** |

Twilio's Conversational Intelligence is the faster path to a demo (prebuilt operators for summary, sentiment, competitor mentions). BYO is ~5× cheaper and gives you laundry-specific extraction — "asked about comforter pricing", "complained about a lost item", "wanted Saturday pickup" — which is what actually sells the dashboard. **Ship on Twilio CI, migrate the analysis layer to BYO once volume justifies it.**

---

## 3. Cost model

### 3.1 Verified component prices (Twilio, US, Aug 2026)

| Line item | Price |
|---|---|
| Local number | $1.15 / mo |
| Inbound local voice | $0.0085 / min |
| ConversationRelay (STT + TTS + orchestration) | $0.07 / min |
| Call recording | $0.0025 / min |
| Recording storage | $0.0005 / min / mo |
| Batch transcription | $0.024 / min |
| Streaming transcription | $0.027 / min |
| Conversational Intelligence — Twilio operators | $0.005 / 1K chars (≈1K chars/min) |
| Elastic SIP inbound (if we move off PSTN later) | $0.0015 / min |

⚠️ **Verify with a Twilio rep:** whether ElevenLabs voices are included in the flat $0.07 or carry an upcharge, and what volume-committed pricing looks like at 100k+ min/mo. Both materially change the model.

### 3.2 All-in cost per AI-answered minute

| Component | Cost/min |
|---|---|
| Inbound voice | $0.0085 |
| ConversationRelay | $0.0700 |
| LLM (Haiku-class, text-only, prompt-cached: ~4 turns/min) | ~$0.0050 |
| Recording + storage | $0.0030 |
| Post-call summary (amortized, ~$0.002/call) | ~$0.0010 |
| **Total** | **≈ $0.088 / min** |

The LLM is *not* the cost driver — it's about 6% of the total. **ConversationRelay is 80% of COGS.** That's where any future optimization has to go.

### 3.3 Why per-tenant fees matter more than per-minute rates

After-hours-only usage is inherently tiny. A laundromat gets maybe **20–60 after-hours calls/month at ~2 min** = **40–120 minutes**.

At 80 min/month, one customer's variable cost is **$7.04 + $1.15 number = $8.19/month**.

Now layer on what each option charges *per tenant*:

| Approach | Per-tenant platform fee | Variable | **Monthly cost @ 80 min** | **@ 500 customers** |
|---|---|---|---|---|
| **Twilio (build)** | $0 | $0.088/min + $1.15 | **$8.19** | **$4,095** |
| Vapi + VoiceAIWrapper | ~$25 (at $499/20 accts) | ~$0.15/min | $38.15 | $19,075 |
| Retell + SeldonFrame | ~$10–25 | ~$0.13–0.31/min | $22–50 | $11,000–25,000 |
| Synthflow white-label | $2,000/mo ÷ 500 = $4 | ~$0.12/min | $14.75 | $7,375 |
| Trillet Agency | $299/mo ÷ 500 = $0.60 | ~$0.12/min | $11.35 | $5,675 |
| GoHighLevel | $50–97 per sub-account | $0.13/min | $60–107 | $30,000–53,500 |

**This is the whole argument.** Wrapper platforms are priced for agencies with 10–30 clients doing thousands of minutes each. We have the inverse shape: *hundreds of clients doing almost no minutes*. Their per-seat pricing model is actively hostile to us. GoHighLevel is the worst fit of all at $50–97 per sub-account.

### 3.4 Revenue and margin

Proposed SKU: **$199/mo, 300 after-hours minutes included, $0.50/min overage.**

| Scenario | Minutes | COGS | Revenue | Gross margin |
|---|---|---|---|---|
| Typical | 80 | $8.19 | $199 | **95.9%** |
| Heavy | 300 | $27.55 | $199 | **86.2%** |
| Abusive | 800 | $71.55 | $199 + $250 overage | **84.1%** |

At **500 customers**: ~$99,500/mo revenue, ~$4,100/mo Twilio COGS, before hosting (~$500–1,500/mo) and support. Even at 30% of the base tier ($99/mo) the margin holds above 90%.

This sits naturally alongside the existing $1,198/mo marketing package and $299/mo social SKU — same buyer, same invoice, no new sales motion.

### 3.5 When does going deeper (self-hosted) pay off?

A fully self-hosted pipeline — LiveKit or Pipecat + Deepgram Nova-3 streaming ($0.0077/min) + Cartesia or Deepgram Aura TTS (~$0.005/min) + own LLM + Elastic SIP inbound ($0.0015/min) + compute — lands around **$0.035–0.05/min**, roughly half of ConversationRelay.

At 500 customers × 80 min = 40,000 min/mo, that saves ~$1,700/mo. Against an engineering quarter (~$60k) plus permanent on-call and latency-tuning burden, payback is ~3 years. **Not worth it now.** It becomes worth it around 300k+ min/mo (≈ heavy usage across 1,000+ customers, or if we ever go outbound).

**Design implication:** keep the media/transport layer behind an interface from day one. The agent service should not know or care that ConversationRelay is on the other end of the websocket. That preserves the option cheaply.

---

## 4. Side-by-side: the alternatives

| | White-label completeness | Per-tenant fee | Effective $/min | SMRT data integration | Verdict |
|---|---|---|---|---|---|
| **Twilio ConversationRelay (build)** | **Total — no third party ever visible** | **$0** | $0.088 | Native, unlimited | ✅ **Recommended** |
| Vapi | None native; needs a wrapper vendor | ~$25 | $0.13–0.30 | Via API/webhooks | Wrapper tax + two vendors to blame |
| Retell AI | None native; needs a wrapper vendor | ~$10–25 | $0.11–0.31 | Via API/webhooks | Same problem; good latency |
| Bland AI | Enterprise only | Negotiated | $0.07–0.12 all-in | Limited | Cheapest per-minute, least control |
| Synthflow | Yes — $2,000/mo add-on | $2,000/mo flat | ~$0.12 | Moderate | Only sane above ~300 customers, still worse than Twilio |
| Trillet | Yes, native, unlimited sub-accounts | $299/mo flat | ~$0.12 | Moderate | Best packaged option — but vendor-published claims, unverified |
| ElevenLabs Agents | Enterprise negotiation | Custom | ~$0.08 + telephony | Via API | Best voice quality; pricing opaque |
| GoHighLevel | Agency-branded, but GHL-shaped | $50–97/sub-acct | $0.13 | Poor for laundry ops | ❌ The thing we're replacing |
| Self-hosted (LiveKit/Pipecat) | Total | $0 | $0.035–0.05 | Native | Right answer at 10× our volume, wrong answer today |

**On the wrapper platforms generally:** they add a second vendor between us and the customer with no contractual relationship to us, no SLA we control, and a branding surface that can leak. For a product where "it's SMRT's phone system" is the entire pitch, that's an unacceptable dependency. If Vapi has an outage, our customer's phones go dead and we can't do anything but file a ticket.

**One honest hedge:** the fastest way to validate demand is *not* to build. Spin up Retell or Vapi with 5–10 friendly stores as a labelled beta for 4–6 weeks. Learn what callers actually ask, what the escalation rules need to be, how often it fails. Then build with that knowledge. The conversation design is the hard part, not the plumbing — and it's fully portable.

---

## 5. Compliance — read this before writing code

| Requirement | What it means for us |
|---|---|
| **TCPA / FCC 2024 ruling** | AI voices are "artificial voice" under TCPA. Violations run **$500–$1,500 per call, uncapped.** This applies to **outbound**. |
| **Inbound-only V1** | Inbound calls the customer initiates carry a fraction of the risk. **Do not ship outbound AI calling in V1.** Reminder calls, win-back campaigns, review requests by AI voice — all deferred until there's a real consent architecture. Outbound SMS via 10DLC is the safer channel for those. |
| **AI disclosure** | California requires disclosure within the first 15 seconds; Texas SB 140 within 30. Colorado, Illinois, Utah, Washington have overlapping rules. **Disclose in the opening line, everywhere, always** — one script, no state logic to get wrong. |
| **Recording consent** | All-party consent states require it. Same fix: bake "this call is recorded" into the same opening line. |
| **STIR/SHAKEN + Trust Hub** | Register each subaccount via the Trust Hub API (ISV/subaccount flow). Mostly an outbound concern, but do it at provisioning so it's never a blocker. |
| **A2P 10DLC** | Required for the SMS follow-ups (booking links, confirmations). Per-brand registration under the ISV flow. |
| **PCI** | **Never take card numbers through the AI.** Hand off to a payment link over SMS or to a human. |
| **Data retention** | Recordings and transcripts are customer PII. Set a default retention window (90 days?), make it configurable, document it, and put it in the MSA. |

Suggested universal opening: *"Thanks for calling [Store] — you've reached our automated assistant, and this call is recorded. How can I help?"* One sentence, satisfies AI disclosure and recording consent in every state.

---

## 6. Build plan

**Phase 0 — Validate (4–6 weeks, ~$500)**
Retell or Vapi beta with 5–10 friendly stores. Instrument everything. Output: the real intent taxonomy, escalation rules, and a demo that sells. Also settles the Twilio commercial questions in §3.1 in parallel.

**Phase 1 — Core answering (6–10 weeks)**
Twilio subaccount provisioning automation → ConversationRelay websocket service → tenant config model (hours, price list, services, zones, escalation number) → the 6 core tools against the SMRT API → post-call summary → owner SMS/email digest. Ship to the Phase 0 stores on SMRT infrastructure.

**Phase 2 — Call Intelligence (4–6 weeks)**
Ingest business-hours calls. Recording + transcription + laundry-specific extraction. Dashboard: missed calls, intent mix, price-shopper conversion, unanswered questions, staff handling. This is the upsell tier and the retention hook.

**Phase 3 — Scale & margin (ongoing)**
Twilio committed-use pricing. Migrate transcription/analysis to BYO (§2.3). Keep the media layer swappable. Revisit self-hosting only past ~300k min/mo.

**Gate before Phase 1:** Twilio confirms ElevenLabs inclusion in the $0.07 and gives a committed-use quote. If ConversationRelay turns out to be $0.10+/min for the voices we want, re-run §3 — Trillet at $299/mo flat becomes genuinely competitive.

---

## 7. Recommendation

**Build on Twilio ConversationRelay, inside SMRT.**

1. **White-label is absolute.** No third-party branding surface exists to leak, because there is no third party.
2. **No per-tenant tax.** Twilio subaccounts are free. Every competing platform charges $10–97 per customer per month, which at our customer shape costs more than the entire service does to run.
3. **The integration is the moat.** Order status, price lists, route scheduling — a generic voice platform can't do these. That's what makes the product sticky and what stops a customer from buying a $49/mo AI receptionist off the internet instead.
4. **Margins are excellent and volume-insensitive.** 86–96% gross margin across realistic usage. Overage pricing caps the downside.
5. **The risk is conversation design, not engineering.** So de-risk it with a rented platform for six weeks before committing (Phase 0), not by renting forever.

**Do not ship outbound AI calling in V1.** The TCPA exposure at $500–1,500 per call across hundreds of customers we don't control is the single largest risk in this product, and it is entirely avoidable by staying inbound.

---

## Sources

- [Twilio Conversational AI pricing](https://www.twilio.com/en-us/products/conversational-ai/pricing)
- [Twilio US Voice pricing](https://www.twilio.com/en-us/voice/pricing/us)
- [TwiML `<ConversationRelay>` docs](https://www.twilio.com/docs/voice/twiml/connect/conversationrelay)
- [Conversation Intelligence billing](https://www.twilio.com/docs/conversations/intelligence/understanding-billing)
- [Twilio ISV setup guide](https://www.twilio.com/en-us/blog/isv-getting-started-with-twilio)
- [STIR/SHAKEN onboarding for ISVs using subaccounts](https://www.twilio.com/docs/voice/trusted-calling-with-shakenstir/shakenstir-onboarding/shaken-stir-trust-hub-api-isvs-subaccounts)
- [Twilio + ElevenLabs for ConversationRelay](https://elevenlabs.io/blog/twilio-conversation-relay)
- [Vapi vs Retell vs Bland true cost per minute 2026](https://medium.com/@automation.labs/vapi-vs-retell-vs-bland-in-2026-the-true-cost-per-minute-578f38af3523)
- [AI voice agent cost per minute 2026](https://ainora.lt/blog/ai-voice-agent-cost-per-minute-2026)
- [VoiceAIWrapper pricing](https://voiceaiwrapper.com/pricing)
- [SeldonFrame — Retell AI pricing & agency plans](https://www.seldonframe.com/retell-ai-pricing)
- [Synthflow AI pricing 2026](https://zeeg.me/en/blog/post/synthflow-ai-pricing)
- [Voice AI white-label pricing breakdown 2026 (Trillet)](https://www.trillet.ai/blogs/voice-ai-white-label-pricing-breakdown-2026)
- [GoHighLevel Voice AI pricing 2026](https://netpartners.marketing/gohighlevel-voice-ai-conversation-ai-pricing-2026/)
- [GoHighLevel Voice AI real total cost breakdown](https://www.sympana.com/blog/gohighlevel-voice-ai-pricing-real-total-cost-breakdown-2026)
- [ElevenLabs Agents pricing](https://elevenlabs.io/pricing/agents)
- [Deepgram Nova-3 pricing 2026](https://diyai.io/ai-tools/speech-to-text/deepgram-pricing-2026/)
- [OpenAI Realtime API pricing 2026](https://www.layer3labs.io/guides/openai-realtime-api-pricing)
- [Vapi vs Pipecat vs LiveKit 2026](https://inworld.ai/resources/vapi-vs-pipecat-vs-livekit)
- [US Voice AI regulations founders' guide](https://softcery.com/lab/us-voice-ai-regulations-founders-guide)
- [TCPA compliance for AI voice agents 2026](https://www.henson-legal.com/ai-voice-compliance)
- [AI disclosure requirements for voice agents](https://thoughtly.com/blog/ai-disclosure-requirements-what-to-tell-callers)
- [AI receptionist pricing guide 2026](https://voksha.com/guide/ai-receptionist-pricing-guide/)
