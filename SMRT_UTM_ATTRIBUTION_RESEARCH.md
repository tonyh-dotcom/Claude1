# SMRT Referral Attribution — Research Findings

**Prepared:** Aug 26, 2026 | **Tenant examined:** helenascleaners.smrtapp.com
**Question:** How does the SMRT customer app take in UTM / ad-source tracking, and how should it be improved without creating bad `referral_source` data?

---

## Headline finding — the planned fixes cannot work

The prior plan was to build (1) a dedicated paid landing page whose signup button hardcodes
`?referral_source=Google-Ads`, or (2) a dynamic button rewrite triggered by `gclid`.

**Neither would change a single customer record.**

The premise was that UTMs are lost at the domain hop and that smrtapp records whatever
`referral_source=` value is in the link. The first half is true; the second is not. The SMRT
customer app **never reads `referral_source` at all**:

- The customer app (`/custx/`, a React + TanStack Router SPA) validates its query string against
  a **hardcoded allow-list of ten parameters**. `referral_source` is not among them.
- The string `referral` appears **zero times** in the entire 1,099,369-byte application bundle
  (`/custx/assets/index-9cff5070.js`).
- So `?referral_source=Website` on helenascleaners.com is **inert**. Every website signup reads
  `Website` because nothing in the link can reach the customer record — not because the button
  hardcodes that value.

Same for `utm_source`, `utm_medium`, `utm_campaign`, `gclid`, `fbclid` — all stripped on arrival.

---

## What the customer sees

One signup surface; the legacy `/customer/` portal now redirects into `/custx/`.

1. **Arrival** — router runs `validateSearch`, rebuilding the search object from the allow-list
   only. Unknown params vanish from app state and from the visible URL.
2. **Phone or email** — mobile number (or email for existing accounts) → OTP.
   GraphQL `StartTextSignIn`.
3. **Code verification** — `VerifyTextSignIn`. Returning customers are done here.
4. **New customer: fields step** — first/last name, email, terms, SMS + email marketing opt-ins,
   plus any **custom fields** configured to show on website signup.
5. **Record created** — payload sent as `SignUpCustomerFields`; SMRT emits a
   `New Customer Signup` event with `source: "Website"` (vs `"POS"`) to Segment.

### Accepted query parameters (the complete allow-list)

| Parameter | Survives | Reaches the customer record |
|---|---|---|
| `street_address`, `street_address2` | ✅ | Prefills + saves address |
| `city_address`, `state_address`, `zip_address` | ✅ | Prefills + saves |
| `pc` | ✅ | Sent as `promotionCode` — **applies a real discount** |
| `group` | ✅ | Sent as `group` — **a real POS segment** |
| `agent` | ✅ | Sent as `agent` — **the booking employee** |
| `rack_id` | ✅ | Kiosk hardware context |
| `pos_token` | ✅ | In-store session handoff |
| `referral_source` | ❌ | **Nothing — not referenced anywhere in the bundle** |
| `utm_*`, `gclid`, `fbclid` | ❌ | Nothing |

Signup payload (`SignUpCustomerFields`): `firstName`, `lastName`, `email`, `group`, `agent`,
`promotionCode`, `streetAddress*`, `termsAccepted`, `smsMarketingOptIn`, `emailMarketingOptIn`,
`customFields: [{id, value}]`.

---

## The near miss (matters for the product fix)

The signup form already maps **leftover** query params into the custom-fields array written to
the customer record:

```js
const { streetAddress, …, promotionCode, group, agent, ...rest } = useSearch({ from: "/login" });
const custom = Object.entries(rest).map(([id, value]) => ({ id, value: String(value) }));
if (custom.length) payload.customFields = custom;   // → written to the customer

// but the route already filtered the URL:
validateSearch: (s) => allowListOnly(s)             // rest is always {}
```

A query-string → custom-field pipeline exists and is wired all the way to the database. `rest` is
always empty because `validateSearch` discarded the unknown keys first. **The product fix is not
"build attribution capture" — it is "stop deleting the input."**

---

## What SMRT already supports

Custom customer fields are configurable per business with:

- **Types:** `text`, `select`, `date`, `birthday`, `license_plate`
- **`possibleValues`** — a fixed list; a `select` field renders a dropdown built strictly from it
- **`isRequired`**
- **Four independent visibility flags:** `shown_profile`, `shown_customer_website`,
  `shown_pos_sign_up`, **`shown_customer_website_sign_up`**

SMRT's Segment docs use `"Referral Source: Website"` as the worked example of such a field, which
strongly suggests Helena's existing `Referral Source` **is** one of these.

---

## Recommendations

### ✅ Option 1 — Ask the customer, with a locked list (recommended, available today)

Configure a required `select` field — "How did you hear about us?" — visible on website signup and
POS signup, with a short fixed list: `Google Search`, `Google Ads`, `Social Media`,
`Friend or Family`, `Drove By`, `Mailer`, `Other`.

- **Effort:** configuration screen. No engineering, no landing page, no new domain.
- **Data quality:** strongest available. A dropdown cannot invent a new source or misspell an old
  one — this is the direct answer to "random sources getting added."
- **Limit:** self-reported. Under-reports paid ads, over-reports "Google Search." Good for coarse
  channel mix; not click-level truth.
- **Watch:** adds a required signup step. Keep to ≤7 options.

### 🟡 Option 2 — Own the form, use the API (deterministic, real work)

SMRT supports redirecting the portal signup button to any URL — documented as "useful for
businesses using SMRT's API on sign up forms." Host the form on helenascleaners.com where UTMs and
`gclid` are readable, and create the customer via API with the source already set.

- **Deterministic** — the click decides the value, not the customer's memory.
- **Cost:** you own a signup flow (validation, OTP parity, maintenance) that SMRT otherwise
  maintains. Only worth it if paid spend justifies it.

### ❌ Do NOT overload `group`, `agent`, or `pc`

These survive the allow-list and reach the record, which makes them tempting. All three are live
operational fields and first-class Segment traits: `group` drives segmentation/pricing, `agent`
credits an employee, `pc` applies an actual discount. Stuffing ad channels into them corrupts
pricing, commissions, or promo reporting in order to fix attribution — precisely the bad-data
outcome this project exists to avoid.

---

## Product fix, scoped (file regardless — small, and unblocks every SMRT tenant running ads)

1. **Preserve, don't strip.** Add `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`,
   `utm_content`, `gclid` to the allow-list so they survive the router and persist across steps.
2. **Write to dedicated fields**, not into `Referral Source`. Machine-measured and self-reported
   source answer different questions and routinely disagree; merging destroys both.
3. **Map to a closed set server-side.** `utm_source=google` + `utm_medium=cpc` → `google-ads`, via
   a lookup table. Unrecognised values land in `unmapped` for review. Never let an inbound URL mint
   a new source value — that is how a reporting dimension becomes unusable.
4. **First touch is immutable.** Write once on creation, never overwrite. A three-year customer who
   clicks a retargeting ad must not silently become a Google Ads acquisition.

---

## Can the Google APIs / Google tags do this instead?

Partly — and the half they do is the more valuable half. But they cannot substitute for capture at
signup, because of one hard limit: **Google never tells you who an individual customer is.** Click
data comes back aggregated by campaign; no API returns "this person arrived from this ad."

**So this is a combination, not an either/or** — three separate pipes that succeed and fail
independently. Only pipe A is blocked by the parameter stripping.

| Pipe | Direction | Answers | Blocked by the strip? |
|---|---|---|---|
| **A · Capture** | click → SMRT record | Which channel this specific customer came from (the cohort dimension) | ❌ **Yes** |
| **B · Conversions out** | SMRT → Google | Which campaigns produced paying customers; feeds Smart Bidding | ✅ No |
| **C · Reporting in** | Google → SMRT | Spend, clicks, CPA, ROAS by campaign — aggregate only | ✅ No |

### Pipe B — the real unlock, and it needs no signup change (start here)

**Enhanced conversions for leads (ECL)** matches conversions back to ad clicks using **hashed email
or phone instead of a click ID**. SMRT already holds email, phone, signup time, and order revenue —
that is the entire required payload. The app stripping `gclid` does not block this at all.

Fastest route: SMRT is **already** a Segment source emitting `New Customer Signup` and order events
carrying revenue. Segment's Google Ads Conversions destination has an Upload Click Conversion action
that accepts email/phone when no `gclid` is present, hashes values automatically, batches (up to
2,000 events), and authenticates by OAuth into the business's Google Ads account. Close to a
configuration exercise on infrastructure that already exists.

- **Gives you:** true ad ROI (revenue, not signups) + materially better Smart Bidding, since Google
  learns which clicks became paying customers.
- **Does not give you:** a source value on the SMRT customer record. It reports inside Google Ads.
  Not a substitute for pipe A.
- **Deadline that already passed:** since **June 15, 2026**, Google Ads API conversion uploads are
  closed to developer tokens that weren't already using them (tokens needed traffic between
  Dec 2025–May 2026 to be allowlisted). A new SMRT-built uploader must target the **Data Manager
  API** (launched Dec 9, 2025). Segment's token may be grandfathered — confirm before choosing.
- **Consent:** uploading hashed customer contact data requires accepting Google's customer-data
  terms and appropriate disclosure. SMRT already captures marketing opt-ins at signup — gate the
  upload on them.

### Pipe C — the ads dashboard inside SMRT (a real build)

The Google Ads API read path gives campaign/ad group/keyword metrics: impressions, clicks, cost,
conversions, ROAS. The business owner OAuths once; SMRT pulls on a schedule.

- **Effort:** developer token, OAuth flow, refresh-token storage, quota handling, reporting UI.
  Per-tenant OAuth, or a manager-account link if SMRT centralises access.
- **Hard limit:** aggregate only. `ClickView` maps a `gclid` to its campaign for 90 days (one day
  per query) — useful only to *enrich* click IDs captured in pipe A, never to discover who clicked.

### On Google tags: the app has none, and you can't add one

Checked the bundle specifically. The customer app loads **no tag manager, no Google Analytics, no
advertising pixel** — zero references to `googletagmanager`, `google-analytics`, `dataLayer`, or a
Facebook pixel. Its only third-party hosts are Sentry, Mapbox, reCAPTCHA, and Localize.

So a tenant cannot inject a Google tag into the signup flow, and GA4 cross-domain measurement from
the marketing site into smrtapp.com is not achievable from outside. A tag on helenascleaners.com can
measure the click through to the signup button — what the existing Sign Up Link Click conversion
already does — and visibility ends at the hop.

**Product ask worth raising alongside the allow-list fix:** if SMRT shipped a per-tenant tag
container in the customer app, every tenant running ads would get real signup-funnel measurement and
a genuine conversion event instead of a button-click proxy. Plausibly a larger win than the UTM
allow-list, serving the same customers.

### Sequence to argue for

1. **Now, no SMRT change:** pipe B via Segment. Turns spend into measurable revenue and improves
   bidding. Independent of everything else.
2. **Now, configuration only:** the locked-list dropdown (Option 1 above). Coarse but honest channel
   mix inside SMRT.
3. **Product backlog:** the allow-list fix + a tenant tag container — together these make pipes A
   and C properly possible for every tenant, not just this one.

---

## Review of the proposed attribution epic

The architecture is good and unusually honest. The problem is the foundation.

### 🔴 BLOCKER — the RESOLVED item is not resolved

The epic closes with: *"Does query-string prefill work? Yes — `?referral_source=Facebook` populates
the field. Confirmed. This is the basis of Phase 0."*

That cannot be true on the customer website. Evidence:

- Pulled the signup bundle from **four tenants** (helenascleaners, troycleaners, faziocleaners,
  thedrycleaningfactory). They run **two different releases** — distinct Sentry release SHAs
  (`d9bfc458…` vs `146702312b…`), byte-different files.
- **Both releases have the identical ten-parameter allow-list and zero occurrences of `referral`.**
- Traced the accessor: `useSearch` (minified `vl`) returns `Rc({...e, select: t => t.search})` — the
  route match's **validated** search object, which `validateSearch` rebuilds from the allow-list. So
  the `...rest` spread that would carry an unknown param into `customFields` is always empty.

**Stories 1, 2 and 7 are all of Phase 0, and all three depend on prefill.** Story 7 is explicitly
pulled into Phase 0 *because* prefill works. If it doesn't, Phase 0 ships nothing — and it ships
*looking* like it worked, because a link with an ignored parameter still loads a working signup page.

**Three ways the confirmation could still be right** (I only examined the customer-website app):

1. **It was tested on POS sign-up** — a separate application I have not examined. Story 1 itself asks
   whether prefill works on "POS sign-up and the customer website sign-up, or only the latter," so
   the uncertainty is already acknowledged. This is the most likely explanation.
2. **It was tested on staging**, on a build that already carries the fix.
3. **The value was seen in the URL or the form, not on the saved record.** The only test that counts
   is opening the created customer in POS and reading the field.

**The five-minute test that settles it:** open
`<tenant>.smrtapp.com/custx/login?referral_source=ZZTEST`, complete a real signup, then read that
customer's Referral Source in POS. If it says `ZZTEST`, I'm wrong and Phase 0 stands as written.
Do this before committing the epic, not during it.

### Issues worth fixing regardless

1. **🔴 The signup domain in Story 2 doesn't exist.** `signup.smrtsystems.com` does not resolve.
   Signup today is per-tenant at `<tenant>.smrtapp.com/custx/login`. If Phase 0 assumes a new central
   signup domain, that is a large unscoped dependency (tenant resolution, branding, routing, TLS)
   hiding inside a "days–weeks" phase. If the URL is illustrative, rewrite it with the real
   per-tenant host — *per-tenant* changes both Story 7's decorator target and Story 3's cookie scoping.

2. **🔴 The existing hardcoded value will silently defeat Story 7.** Story 7's AC says "does not
   overwrite a param already present on the target URL." Live client buttons already carry
   `?referral_source=Website` — Helena's does today. Paid traffic arriving via the client site keeps
   `Website` forever, and the snippet looks installed and working. Add an explicit story: audit and
   strip the hardcoded default from every client site and site template before Story 7 rolls out.

3. **🟡 Story 8 contradicts Story 4.** Story 4 accepts "single-touch only, no multi-visit history"
   for v1; Story 8 requires "both first-touch and last-touch derived." With one touch per customer
   those values are always identical. Either keep multi-visit rows (the table supports it) or defer
   the last-touch AC — as written it cannot be satisfied.

4. **🟡 The headline success metric is trivially gameable.** ">90% non-null derived attribution
   (including `Direct` and `Client Website`)" is guaranteed by Story 5's own AC of "zero nulls in
   derived source." Classifying everything as `Direct` scores 100%. Replace with something that can
   fail: share of paid-campaign signups carrying a campaign value, or a ceiling on the
   `Direct`/`Other` share of web signups.

5. **🟡 Story 4's consent rationale is wrong.** "Params read from `location.search` and POSTed to our
   endpoint; capture is server-side" is client-side collection with server-side storage — call it
   what it is. And a first-party `anon_id` cookie needs a lawful basis under ePrivacy whether set by
   script or `Set-Cookie`. Server-side setting buys resilience against Safari's cap on
   script-writable storage, **not** a consent exemption. Story 11 covers the obligation; fix the
   justification so nobody relies on it later.

6. **🟡 Cookie isolation must be host-only, explicitly.** Tenants are subdomains of a shared parent.
   A cookie scoped to `.smrtapp.com` is readable by every tenant — exactly the cross-attribution
   Story 3's AC forbids. Only a host-only cookie on the exact tenant host isolates them. Put that in
   the AC rather than leaving "scoped per business" to interpretation.

7. **🟡 Story 5 is a weaker safety net than it reads.** `document.referrer` is much thinner than it
   used to be: default referrer policy strips the path, Google organic often sends nothing usable,
   and in-app browsers and link shims lose it entirely. "Known search engine → Google (untagged)"
   will under-fire, and the residue lands in `Direct` — inflating the exact bucket the epic rightly
   warns is misleading. State an expected hit rate so Story 5 isn't treated as guaranteed coverage.

8. **🟡 Story 1 should test two field types, not one.** Custom fields carry a `fieldType`, and a
   `select` field renders its dropdown strictly from configured `possibleValues`. The fork is sharper
   than the story assumes: a `select` field gives clean data but may refuse an off-list prefilled
   value, while a `text` field accepts prefill *and* the junk the story's own note worries about.
   Test `select` and `text` separately — the answer decides whether Story 2 can have a strict
   allowlist at all.

9. **✅ Two open questions are answerable today.** "Do we have an existing account-type concept?" —
   the customer record already carries `group`, `paymentTerm` (POS/Statement/AutoPay), `brand` and
   `accountDiscount`; `group` and `paymentTerm` are strong candidates for Story 9's commercial split,
   likely with no new field. And "what share of new customers are created at POS vs the website?" —
   the `New Customer Signup` event already carries `source: POS | Website`, so the Segment stream
   answers it now. That number decides whether this epic addresses most of the problem or a
   minority of it.

### What the epic gets right (preserve through any rewrite)

- **Story 13's origin segmentation**, and holding `Direct` apart from `Not captured`. Counter-created
  customers diluting channel math is the most common way an attribution report becomes actively
  misleading, and this is the correct fix.
- **Normalize at read, not on write**, with a mapping table where correcting one row retroactively
  fixes all history.
- **`business_id` from day one** — cheap now, painful to backfill, and what makes Story 12 free.
- **Second-visit-within-60-days over first-order value** as the quality metric. Well judged for this
  vertical.
- **A versioned CDN loader** for the snippet, on the correct reasoning that client sites are the one
  surface you can't update on your own schedule.
- **Keeping self-reported and inferred independently reportable**, and stating the mobile→desktop gap
  as unfixable rather than burying it.

### Proposed resequencing

1. **Run the five-minute test first — hours, not a day.** Story 1 is timeboxed at a day and asks six
   questions; one of them decides whether Phase 0 exists. Answer that one first, on both the customer
   website and POS, and record which surface was tested.
2. **If prefill fails on the customer website, Phase 0 gains a dependency.** It becomes a small
   signup-app change: add the params to the allow-list and write them to a dedicated field. Genuinely
   small — the query-string-to-custom-field plumbing already exists and runs — but it is a release in
   the signup app, not a config change, and Stories 2 and 7 cannot ship until it lands.
3. **Ship the zero-code win in parallel.** A required `select` field with a locked value list needs no
   prefill, no snippet, and no release. Self-reported and coarse, but real data next week and the only
   option with no engineering dependency.

---

## Rules that keep the data clean (apply to whichever path ships)

1. **One owner per field.** Decide whether `Referral Source` is operator-set, customer-set, or
   machine-set. Today it is ambiguous, which is why nobody trusts it.
2. **Closed vocabularies only.** `select`, never `text`, on anything you group a report by. Free
   text guarantees `Google`, `google`, `Google Ad`, `GoogleAds` within a quarter.
3. **Adding a value is a deliberate act.** Extending the list requires a named person's decision,
   not a new campaign URL. Review quarterly; retire unused values.
4. **Two naming conventions, on purpose.** Customer-facing dropdown values human-readable
   (`Google Ads`); machine fields lowercase-hyphen (`google-ads`). Write both down before the first
   campaign URL exists — the failure mode is `google_ads` and `Paid-Search` arriving later and
   splitting the cohort.
5. **Cookies won't help across the hop.** helenascleaners.com and helenascleaners.smrtapp.com are
   different registrable domains, so a first-party cookie on the marketing site is unreadable at
   signup. Anything crossing the hop must ride in the URL — and decorate links *conditionally*,
   only when a `gclid`/`utm_*` is actually present, so organic visits don't arrive carrying stale
   campaign tags.
6. **Keep the Google-side conversion separate.** The Sign Up Link Click conversion feeds Smart
   Bidding and is measured independently. It is not a cohort source and should never be reconciled
   against the SMRT field.

---

## Confirm before building

Findings above are read from the shipped client bundle and SMRT's public docs. The server is the one
thing not visible here.

- **Is `referral_source` read anywhere server-side?** The client provably never sends it; confirm no
  ingestion path reads it off the landing request. (It could not be associated with a signup
  happening minutes later over GraphQL — but rule it out in code, not by inference.)
- **Where does `Website` actually come from?** Likely a field default or an auto-stamp from the
  platform's `source: "Website"`. Run one test signup and read the record in POS. This determines
  whether the existing field is safe to repurpose.
- **What is Helena's `Referral Source` field configured as today?** Type, `possibleValues`, and which
  visibility flags. The tenant field config requires authentication (`business.customerFields`
  returned "not authorized"), so it could not be read here. It decides whether Option 1 is a
  five-minute edit or a new field.

**Method caveat:** a browser walk-through of the signup (to show params vanishing from the address
bar) was blocked by sandbox network egress. The finding rests on the router configuration and the
total absence of any `referral` reference in the bundle, which is unambiguous — but a two-minute
click-through should confirm it visually before reporting upstream.

---

## Sources

- Live: `https://helenascleaners.smrtapp.com/custx/login`; bundle
  `/custx/assets/index-9cff5070.js` (1,099,369 bytes, retrieved Aug 26, 2026); signup link found on
  helenascleaners.com
- [SMRT Segment Integration](https://support.smrtsystems.com/en/articles/9011372-segment-integration)
  — customer fields, `New Customer Signup` event, `source` = POS/Website, traits
- [SMRT Spring 2021 release notes](https://blog.smrtsystems.com/post/647197547940708352/spring-2021-release-notes)
  — Customer Fields UI; Sept 2021 signup-button redirect
- [UTM capture & lead-source attribution](https://www.terminusapp.com/blog/salesforce-utm-capture-lead-source-attribution/)
- [Conditional link decoration for cross-domain tracking](https://www.optizent.com/blog/how-to-set-up-conditional-link-decoration-for-cross-domain-tracking/)
- [UTM parameter best practices](https://web.utm.io/blog/utm-parameters-best-practices/)
- [Google Ads API — offline conversions & ECL uploads](https://developers.google.com/google-ads/api/docs/conversions/upload-offline)
- [Google Ads Developer Blog — June 2026 offline conversion import changes / Data Manager API](https://ads-developers.googleblog.com/2026/05/changes-to-offline-click-conversion.html)
- [Segment → Google Ads Conversions destination](https://www.twilio.com/docs/segment/connections/destinations/catalog/actions-google-enhanced-conversions)
- [Google Ads API ClickView reference](https://developers.google.com/google-ads/api/reference/rpc/v22/ClickView)
