# Automatic Ad-to-Signup Attribution in SMRT — Architecture & Rollout Plan

**Prepared:** August 11, 2026 | **Author:** Tony Hadad (research compiled via Claude)
**Goal:** A customer clicks an ad (Google, Meta, LinkedIn, or any other channel), is tracked through the web journey, signs up in the SMRT customer portal, and their customer record automatically receives the correct **Referral Source** — so acquisition reporting can be built per channel/campaign with no manual entry.

---

## 1. The key discovery: SMRT already has the attribution "write" mechanism

Two existing SMRT capabilities make this achievable **without waiting on engineering**:

1. **Custom customer signup links** (documented in the SMRT Wiki, "How to make custom customer signup links"). The customer portal signup URL accepts query parameters that autofill the new customer's record, including:
   - `referral_source=google` — **autofills the Referral Source custom field**
   - `pc=10OFF` — attach a promotion (requires "Allow Customer to Set Themselves" ON)
   - `group=320`, `agent=route_2` — group and agent/route assignment
   - Address autofill params

   Example (per the wiki):
   `https://{tenant}.smrtapp.com/custx/login?referral_source=google_ads&pc=10OFF`

2. **`referral_source` is a default custom field** on every customer, free-text or dropdown, **importable/exportable/updatable**, and its documented purpose is exactly this: *"use reports to determine where you are getting customers from."* Dropdown options are managed in the CouchDB `CustomerFields_(bid)_primary` document (`possible_values`, `"type":"select"`).

So the problem reduces to: **capture the ad source at click time, persist it through the customer's browsing journey, and make sure it is present on the signup URL at the moment they create the account.** That is a tracking-parameter plumbing problem, solvable in three tiers.

---

## 2. Architecture — three tiers, each capturing more of the audience

### Tier 1 — Direct-to-portal links (works today, zero code)

For every ad/asset that points **directly at the customer portal** (e.g. the "Schedule a Pickup" sitelinks that already link to `/custx/login`), append the attribution params to the final URL:

| Channel | Final URL example |
|---|---|
| Google Ads | `https://{tenant}.smrtapp.com/custx/login?referral_source=google_ads` |
| Meta Ads | `https://{tenant}.smrtapp.com/custx/login?referral_source=meta_ads` |
| LinkedIn Ads | `https://{tenant}.smrtapp.com/custx/login?referral_source=linkedin_ads` |
| QR codes / print / brochures | `...?referral_source=print_qr` (per the wiki, clients already use these links for apartments/condos/hotels) |

**Captures:** everyone who clicks straight through to the portal and signs up in that visit.
**Misses:** anyone who lands on the marketing website first, or returns later — which is most of the audience. Hence Tier 2.

### Tier 2 — First-party capture + persistence on the marketing website (the core of this project)

A small JavaScript snippet on the business's marketing site (e.g. modellaundrycleaners.com) that:

1. **On every landing**, reads the URL for `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, and platform click IDs (`gclid` Google, `fbclid` Meta, `li_fat_id` LinkedIn, `msclkid` Microsoft, `ttclid` TikTok), plus `document.referrer` as fallback.
2. **Classifies** the visit into a controlled referral-source taxonomy (see §4). Paid click IDs/UTMs win; otherwise referrer-based (`google.com` referrer + no UTM → `organic_search`, facebook/instagram referrer → `social_organic`, no referrer → `direct`).
3. **Persists** it first-party: cookie + localStorage on the site's own domain, ~90-day window. Store **first-touch** (never overwritten — best answer to "where did this customer come from") and **last-touch** (overwritten each new sourced visit), plus full UTM set and click ID with timestamps.
4. **Decorates every portal link on the page** (`a[href*=".smrtapp.com"]`) at click time, appending `referral_source=<first-touch value>` — and optionally additional autofill custom fields (`utm_campaign`, click ID) if those custom fields are created (§6 verify item V3).

**Captures:** paid clicks that browse first and sign up later (same browser), plus organic search, social, direct, and referral traffic — i.e., "as much of the audience as possible," not just paid. Every new web signup gets *some* referral source.
**Misses:** cross-device (click ad on phone, sign up on laptop) and cross-browser journeys, and in-store signups. Cross-device is partially recoverable in Phase 2 via click-ID matching; in-store stays manual (staff dropdown — keep existing values).

Deployment options, in order of preference:
- **a)** Add the snippet to the site template directly (Jason owns the Model Laundry site — pairs well with the W&F page work already in flight).
- **b)** Google Tag Manager custom HTML tag, if GTM is already on the site.
- **c)** Productize inside SMRT (Tier 3) so every client with a SMRT-built site gets it automatically.

### Tier 3 — Native support in the customer portal (product ask; makes it universal)

The highest-capture version, proposed as a SMRT product feature so **every tenant** benefits with zero per-client setup:

1. `custx` reads `utm_*` + click IDs + `referral_source` on **any** entry URL (not just `/custx/login`), and persists them in `sessionStorage`/`localStorage` through the whole phone-number → OTP → account-creation flow (the new portal is phone-first; params must survive the multi-step flow — verify item V1).
2. At account creation, the portal writes `referral_source` (classified value) plus raw `utm_campaign`/`utm_source`/click ID into customer fields automatically.
3. Optional signup-form fallback: if no source was captured, show a "How did you hear about us?" dropdown fed from the same `possible_values` list — catches app-store installs and cross-device signups that arrive with no parameters.

This turns "tracking until they sign up inside the app" from a per-client JS project into a platform capability — and is the piece that makes the feature sellable as part of the SMRT marketing package.

---

## 3. Ad-platform configuration (the "capture at click" side)

Consistent UTMs on everything; click IDs come free. **None of this touches bidding, budgets, goals, or existing conversion setup** — URL/tracking-template changes are serving-neutral and additive.

| Platform | Setup |
|---|---|
| **Google Ads** | Keep auto-tagging ON (`gclid`). Add a campaign-level **Final URL suffix** (PMax supports this): `utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_content={creative}&utm_term={keyword}`. Account-level suffix is an option once all campaigns should carry it. |
| **Meta** | Ad-level URL parameters: `utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}`. `fbclid` is appended automatically. |
| **LinkedIn** | Manual UTMs per ad: `utm_source=linkedin&utm_medium=paid_social&utm_campaign=<name>`. `li_fat_id` appended when the Insight Tag setting is on. |
| **Other (Yelp, local directories, email, QR/print)** | Same UTM convention; for offline media use dedicated short links / QR codes with params baked in (SMRT's link generator already supports QR). |

UTM convention: lowercase, snake_case, no PII ever in URLs. `utm_source` = platform, `utm_medium` = `cpc`/`paid_social`/`email`/`qr`, `utm_campaign` = platform campaign name/id.

---

## 4. Referral-source taxonomy (do this FIRST)

Autofill writes whatever text is in the URL, but the POS shows Referral Source as a **dropdown**. If URLs write values that aren't in the dropdown's `possible_values`, reporting fragments and staff see values they can't re-select. So before any links go live:

1. Agree the taxonomy, e.g.: `google_ads`, `meta_ads`, `linkedin_ads`, `microsoft_ads`, `organic_search`, `social_organic`, `direct_website`, `email`, `print_qr`, `friend_referral`, plus each client's existing manual options (walk-in, drive-by, etc.).
2. Add them to `CustomerFields_(bid)_primary` → `possible_values` (CouchDB Editor per the How-To; ensure `"type":"select"`).
3. Keep the value set **channel-level, small, and stable**. Campaign-level detail belongs in separate custom fields (`utm_campaign`, click ID), not in referral_source — that keeps the dropdown clean for staff and reports while preserving granularity for analysis.

---

## 5. Reporting

- **Today:** referral_source is exportable via Customer Export and usable in customer reports — "new customers by referral source per month" is immediately buildable. Cross-reference `registerDate` for cohorting.
- **Dashboard integration (product ask):** the Marketing Analytics Dashboard's Customer Insights section already computes New Registered Customers from the `customers` ES index. Adding a "New customers by referral source" breakdown (and revenue by referral source via `orders` joined on customer) is a natural extension — verify the custom field is (or can be) indexed into the `customers` index (verify item V2).
- **North-star reports this unlocks:** CAC per channel (ad spend ÷ attributed signups), LTV by acquisition channel, signup→first-order conversion by channel ("Sign Up No Orders" already exists as a dashboard metric — slice it by source).

## Phase 2 — Closing the loop back to the ad platforms (recommended follow-on)

Storing the **click ID** (`gclid`/`fbclid`/`li_fat_id`) on the customer record at signup enables offline conversion uploads:

- **Google:** upload "new customer signup" and "first order" as offline conversions (or Enhanced Conversions for Leads with hashed email/phone — SMRT signup is phone-first, ideal for this).
- **Meta:** Conversions API events for CompleteRegistration / Purchase.
- **LinkedIn:** Conversions API for lead events.

This teaches smart bidding to optimize for **actual signed-up customers (and first orders), not clicks** — typically the single biggest performance unlock after attribution itself. It's additive (new conversion actions; existing conversion setup untouched) and should only be turned on per-client with explicit approval, per the standing guardrails.

---

## 6. Verification items before build (DevSupport / engineering)

| # | Item | Why |
|---|---|---|
| **V1** | Confirm the **new phone-first portal** preserves signup-link query params (`referral_source`, `pc`, `group`, `agent`) all the way through the OTP flow to account creation. The wiki examples predate the redesign. | The entire mechanism depends on it. Test on a sandbox tenant end-to-end and confirm the field lands on the customer record. |
| **V2** | Confirm whether `referral_source` (custom fields generally) is indexed into the `customers` Elasticsearch index. | Determines whether dashboard reporting is a config change or an indexing change. |
| **V3** | Confirm whether **arbitrary** custom fields (e.g. `utm_campaign`, `gclid`) can be autofilled via signup-link params the same way `referral_source` is, and whether new custom fields can be added per tenant for this. | Enables campaign-level granularity and Phase 2 offline conversions. |
| **V4** | Confirm behavior when a **returning/existing** customer hits a signup link with `referral_source` set — it must never overwrite an existing value (first-touch integrity). | Prevents paid channels stealing credit for existing customers. |
| **V5** | Mobile app signups: confirm what (if any) parameters/deferred deep links the customer app supports. Until then, point ad traffic at the **web portal**, not app stores. | App-store installs lose URL params entirely. |

## 7. Safety & privacy guardrails

- **Additive only.** No changes to bid strategies, budgets, goals, or existing conversion actions (standing rule from the Model Laundry engagement; applies to every client). URL suffixes and UTM parameters do not affect ad serving.
- **Verify every write with a follow-up read** — including test signups on a sandbox tenant before any client rollout.
- **First-party data only, no PII in URLs.** UTMs and click IDs only; names/emails/phones never appear in query strings. Referral source is ordinary business data, not sensitive data.
- **Consent:** the site snippet uses first-party storage for attribution (legitimate-interest territory in most US contexts), but it must respect any consent banner the site runs, and EU/UK tenants need it gated on consent.
- **Never overwrite manual entries** — staff-set or customer-set referral sources take precedence over automated backfill.

## 8. Suggested rollout

| Phase | Scope | Owner-level effort |
|---|---|---|
| **0. Taxonomy + verification** | Agree value list; run V1–V5 on a sandbox tenant | Days |
| **1. Pilot (Model Laundry)** | Tier 1 links on all ads/sitelinks + UTM templates; Tier 2 snippet on modellaundrycleaners.com (coordinate with Jason's site work); dropdown values added; monthly "new customers by referral source" export | 1–2 weeks |
| **2. Reporting** | Referral-source report/dashboard panel; validate counts vs. ad-platform click data for sanity | 1–2 weeks after pilot data accrues |
| **3. Productize (Tier 3)** | `custx` native UTM capture + persistence + write-at-signup + fallback dropdown; ship to all tenants; bundle into the marketing package | Product/eng cycle |
| **4. Close the loop** | Store click IDs; offline conversion upload to Google/Meta/LinkedIn per client opt-in | After Tier 3 |

---

**Bottom line:** the best path runs *through* SMRT's existing signup-link autofill (`referral_source=`) rather than around it. Tier 1 turns it on today for direct ad clicks; a small first-party capture script (Tier 2) extends it to the whole browsing audience — paid, organic, social, and direct; and productizing capture inside the customer portal (Tier 3) plus offline-conversion feedback (Phase 2) makes it a platform-level capability every SMRT client gets automatically.
