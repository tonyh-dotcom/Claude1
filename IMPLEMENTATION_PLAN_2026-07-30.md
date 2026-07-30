# Model Laundry & Cleaners — Campaign Update Implementation Plan

**Account:** 950-036-5037 | **Campaign:** SMRT Marketing Pmax (23591020213)
**Prepared:** July 30, 2026 | **Sources:** Gemini meeting notes July 15, July 23, July 30 (Wes Bowen / Tony Hadad)

---

## What was agreed in the meetings

### July 23 meeting (primary source of campaign changes)
1. **Headline fix (Decision — aligned):** Search results show "Model Laundry Cleaners Hampstead," but there is no physical Hampstead location and it may be turning off customers in other towns. Headlines are to be simplified to **"Model Laundry and Cleaners"** with no location suffix (Wes suggested optionally pairing with "Pickup & Delivery"). Goal: location-agnostic headlines so new service areas can be added without rewriting ad copy.
2. **New Wash & Fold asset group (Decision — aligned):** Add a separate asset group inside the existing PMax campaign targeting wash-and-fold customers and coin-laundry/laundromat users — different audience signal, different search themes, W&F-focused images and videos. Tony committed to rolling this out within two weeks (≈ **Aug 6 due date**), then monitoring that asset group's analytics for traction.
3. **W&F offer framing:** By-the-pound pricing (~$3/lb today, subscription rate ~10–15% lower) plus tiered monthly subscriptions with free pickup & delivery. Wes is coordinating a W&F/subscription page with Jason for the website.
4. **Leland decision (resolves handoff Item 7):** Do **not** optimize for Leland yet — search volume is only 10–100. Revisit when volume reaches 100–1,000 range. No negative location either; just monitor.
5. **High-end clientele:** Confirmed strategy is affinity-based targeting (formalwear, business travelers, fashionistas, top-income when available). Wes wants this preserved as expansion continues (Wilmington is on the 5-year radar).
6. **Location-area workflow:** Wes may add areas (e.g., Jacksonville) himself but will notify Tony so search-term optimization follows.

### July 30 meeting (SMRT system, not Google Ads — context only)
- Marketing package upgraded to **trigger-based marketing + review management, $1,198/mo, effective Aug 1**. Onboarding call July 31 @ 1 PM ET to configure trigger campaigns.
- Review management launches at start of month; Wes must connect his Google Business Profile. (Indirectly helps organic SEO — star rating, review count, response rate.)
- Social media management ($299/mo) deferred.

### July 15 meeting (carry-over items, already in handoff)
- Jason to supply new website photos → unlocks ad image refresh.
- SEO re-optimization of the new website version.
- Conversion focus: store visits + TechSol sign-up button; unused misconfigured conversions intentionally left alone.

---

## Implementation plan

### Phase 1 — Headline de-localization (now; API-executable)
| Step | Action | Tool |
|------|--------|------|
| 1.1 | Read all text assets on asset group 6677742762; identify any headline/long-headline/description containing "Hampstead" (or other town names) | `list_pmax_asset_group_assets` |
| 1.2 | Replace location-specific headlines with generic ones: "Model Laundry & Cleaners", "Free Pickup & Delivery", "Dry Cleaning Delivered" etc. (add new, then remove old — additive-first order) | `add_pmax_asset_group_asset` / `remove_pmax_asset_group_asset` |
| 1.3 | Verify with follow-up read; confirm Ad Strength unchanged (Excellent) in UI | read + UI check |

Guardrails: no changes to bid strategy, goals, budget, or existing search themes. Asset edits only — explicitly agreed with client on July 23.

### Phase 2 — Wash & Fold asset group (due ≈ Aug 6; API-executable)
| Step | Action | Notes |
|------|--------|-------|
| 2.1 | Draft copy | Headlines: "Wash & Fold, Done For You", "Laundry by the Pound", "Free Laundry Pickup & Delivery", "Skip the Laundromat", "Wash & Fold Subscriptions". Descriptions built around by-the-pound pricing, subscription savings, free pickup & delivery, family time savings |
| 2.2 | Produce W&F images | Canva/AI pipeline for interim images (folded laundry stacks, filled laundry bags, route van); swap in Jason's real photos when delivered |
| 2.3 | Create asset group "Wash & Fold" on campaign 23591020213 | Final URL: modellaundrycleaners.com/services#wash-dry-fold (until Jason ships a dedicated W&F/subscription page — then update) |
| 2.4 | Add audience signal | Coin-laundry/laundromat users, laundry services in-market, household services; keep separate from the dry-cleaning group's formalwear signal |
| 2.5 | Add asset-group-scoped search themes | wash and fold service, laundry service near me, laundry pickup and delivery, wash dry fold, laundromat alternative |
| 2.6 | Verify all writes with follow-up reads; confirm asset group serving in UI | Standing rule |
| 2.7 | Monitoring: check W&F asset-group analytics at +7 and +14 days for traction (Tony committed to this on Jul 23) | `get_pmax_asset_performance` scoped to new group |

### Phase 3 — Audience signal verification (read-only, now)
- Read current PMax audience signals and confirm the high-end affinity set is present: formalwear, suits/business attire, men's apparel, business travelers, fashionistas, top-income tier.
- Do **not** remove the DC-trips/car-rental overlap audiences (military activity explains them — standing rule).
- Add any missing high-end affinity segments (additive only).

### Phase 4 — Carry-over items (blocked or UI-only)
| Item | Status | Blocker/Owner |
|------|--------|---------------|
| New website photos | 🔴 Waiting on Jason | Tony to follow up (requested Jul 15) |
| Replace LOW-rated images | Blocked by photos; current API ratings unavailable (verify in UI) | After photos arrive |
| Sitelink cleanup (14 → ~8, dedupe SMRT-app links) | UI only (Adspirer can't fully clear account-level sitelinks) | Tony, in Google Ads UI |
| SEO re-optimization of new site | Open | Tony; review-management launch (Aug 1) complements this |
| Structured snippets | ✅ Done (Service catalog snippet live) | Close item |
| Leland | ✅ Decided Jul 23: monitor only, no action until 100–1,000 searches | Close item; recheck volume monthly |
| Identify "Campaign #1" | Likely legacy/removed (API lists only the PMax campaign) | Quick UI confirm |

### Sequencing
1. **Today/tomorrow:** Phase 1 (headlines) + Phase 3 (audience verification) — small, additive, unblockable.
2. **By Aug 6:** Phase 2 (W&F asset group) — hard commitment from Jul 23 meeting.
3. **Aug (ongoing):** Phase 4 as blockers clear; W&F analytics checks at +7/+14 days.

### Out of scope for Google Ads (tracked elsewhere)
- Trigger-based marketing campaign configuration (SMRT system; onboarding Jul 31, 1 PM ET).
- Review management launch + Wes's Google Business Profile connection (Aug 1).
- W&F subscription documentation to Wes (Tony committed Jul 23).
- Website W&F/subscription page (Wes + Jason).

### Standing guardrails (unchanged)
- Never change budget via API (currently $62/day, owner-set).
- No structural changes: bid strategy, goals, existing search themes stay untouched.
- Verify every write with a follow-up read.
- Don't report fields as missing on tool data alone — flag "verify in UI."
- Conversion setup untouched.
