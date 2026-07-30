# TSC Wetclean — Step-by-Step SEO & Schema Implementation Guide
**Companion to:** `SEO_SCHEMA_AUDIT_AND_PLAN_2026-07-30.md` · **Site:** https://www.tscwetclean.com/ · **Platform:** Brizy Cloud

Every value in this guide comes from one of two sources: (a) the July 30, 2026 crawl of all 25 live pages, or (b) Brizy's published documentation. Anything that could **not** be verified is marked **`[VERIFY]`** with instructions on how to confirm it — do not guess these values.

**Honesty notes up front:**
- Exact Brizy UI labels below come from Brizy's public docs; their support center blocked direct access during research, so if a menu label differs slightly in your account, look for the equivalent setting — the capability itself is confirmed (your site already uses per-page code injection on Contact and the episode pages).
- Episode publish dates are **not** in the page source. Episode 1's existing schema says `uploadDate: 2025-01-01`, which looks like a placeholder — pull real dates from YouTube Studio before reusing.
- I could not verify your Google Business Profile state, the correct TikTok/Instagram handles, or the purpose of `/style-guide` and `/winter-whites`. Those are Step 0 questions for you.

---

## Step 0 — Gather inputs (owner, ~30 min, blocks later steps)

Answer these before touching anything. Record answers in this file or a shared doc.

| # | Question | Why it matters | Where used |
|---|---|---|---|
| 0.1 | What is the **correct TikTok URL**? The homepage currently links to `https://www.tiktok.com/notfound` (a dead link); the Contact-page schema claims `tiktok.com/@tscwetclean`. Open that URL and confirm it's yours — if there's no active TikTok, we remove it everywhere. | Broken outbound social link + schema pointing at an unverified profile | Steps 3, 4 |
| 0.2 | Which **Instagram** is canonical? The site references both `instagram.com/tscwetcleaners` and `instagram.com/tscwetclean`. Log in and check which one you own/post to (or both). | `sameAs` schema and site links must agree | Steps 3, 4 |
| 0.3 | Do you have **owner/manager access to the Google Business Profile** for "TSC Wetclean" at 801 Dundas St E (the site links to Maps CID `4905697812649802137`)? What is its current primary category? | All of Step 9 | Step 9 |
| 0.4 | **Real publish dates + episode topics** for episodes 1–8. Get upload dates from YouTube Studio for these confirmed video IDs: Ep1 `HW98XPlgQoI`, Ep2 `HaJ4AftTcdQ`, Ep3 `bqMOEB_VhDc`, Ep4 `1YwGFaGtHT8`, Ep5 `hWsCSvk-DCU`, Ep6 `b0N0JdiucKw`, Ep7 `a-IDbL6d51A`, Ep8 `HS-d6RvBlWM`. Also: Ep6's page description is a copy of Ep5's — watch `b0N0JdiucKw` and note its actual topic. | Schema dates must be real; Ep6 needs its own title/description | Step 6 |
| 0.5 | Is `/style-guide` meant for customers, or is it an internal design/fabric reference? | Decides noindex vs. rewrite | Step 8 |
| 0.6 | Is `/winter-whites` an active service/offer or a stale seasonal promo? | Decides optimize vs. noindex | Step 5 |
| 0.7 | Do you have **Google Search Console** and **Bing Webmaster Tools** access for tscwetclean.com already? | Baseline before changes | Step 1 |
| 0.8 | Confirm business facts used in schema (from your live site — re-confirm they're current): 801 Dundas Street East, Mississauga, ON L4Y 4G9 · +1 (905) 896-9313 · info@tscwetclean.com · Mon–Fri 7:00–18:00, Sat 7:00–16:00, Sun closed. | These get amplified everywhere; must be right | Steps 2, 3, 9 |

---

## Step 1 — Baseline before any changes (~45 min)

1. Verify the domain in **Google Search Console** (domain property) and **Bing Webmaster Tools** if not already done (per 0.7).
2. Submit `https://www.tscwetclean.com/sitemap.xml` in both.
3. Record a baseline you can compare against at day 30/60/90:
   - GSC → Performance: export last 3 months of queries/pages (if the property already has history).
   - Run https://search.google.com/test/rich-results on `/`, `/contact`, `/services`, `/episode-1` and screenshot the detected items. (Expected today: the weak LocalBusiness everywhere; DryCleaningOrLaundry on Contact only; BlogPosting on episodes 1–3 only.)
   - Manually search from a local device: `dry cleaners mississauga`, `laundry pickup and delivery mississauga`, `comforter cleaning mississauga`, `wet cleaning mississauga` — note where (if anywhere) the site and the GBP listing appear.

**Do not skip this.** Without a baseline we can't prove the changes worked.

---

## Step 2 — Brizy global settings (~30 min)

In Brizy Cloud, open your project → **Project Settings**:

1. **Site Title (global):** `TSC Wetclean | Eco-Friendly Dry Cleaning Alternative in Mississauga`
   *(This is the fallback that gets appended to pages without custom SEO — today it's "Eco-Friendly Wet Cleaning & Garment Care | TSC Wetclean", which is what creates the 98-character titles.)*
2. **Site Description (global):** `Mississauga's eco-friendly alternative to dry cleaning. Wet cleaning, tailoring, wash & fold, and free pickup & delivery across the GTA. Call (905) 896-9313.`
   *(Today's global description is duplicated verbatim on ~10 pages.)*
3. **Business info fields** — Brizy auto-generates a `LocalBusiness` schema block from these; the live output is malformed, so fix at the source:
   - Street address field should contain **only** `801 Dundas Street East` (today the generated schema shows "801 Dundas Street East Mississauga, ON" crammed into streetAddress).
   - City/Region/Postal in their own fields if the UI provides them: `Mississauga` / `ON` / `L4Y 4G9`.
   - Hours: today's generated schema outputs prose ("Monday - Friday: 7:00am - 6:00pm…"). If the settings UI only accepts free text, leave it readable for humans — Step 3's injected graph supplies the machine-readable hours. **`[VERIFY]`** what the business-info fields actually offer; docs don't specify field-by-field.
4. Confirm **Search Engine Visibility** is ON project-wide (it is today — robots.txt allows all; don't change it).
5. Republish and spot-check one previously-default page (e.g. `/winter-whites`): its title should now end with the new suffix.

---

## Step 3 — Site-wide schema injection (~45 min)

1. Open `seo/schema-snippets/sitewide-localbusiness.jsonld` from this repo.
2. **First, apply Step 0 answers:** set the final `sameAs` list — remove TikTok if 0.1 says there's no active account; use the canonical Instagram from 0.2. Everything else in the file is verified from the live site, with two deliberate corrections: geo is `43.5977, -79.5981` (the coordinates in your existing Contact-page schema, `43.5932, -79.596`, don't match your own Google Maps link) and `areaServed` is simplified from the 40-line postal-code dump to named cities.
   Note: `priceRange: "$$"` is my characterization, not scraped data — change or delete it if you disagree.
3. Wrap the JSON in `<script type="application/ld+json"> … </script>`.
4. Paste into **Project Settings → Code Injection → Header** (injects into `<head>` of every page).
5. **Remove the old per-page graph from the Contact page** (the `@graph` block with `DryCleaningOrLaundry` + the Pickup & Delivery Service node) — it's now redundant and would declare the entity twice. It lives in that page's per-page code injection; keep a copy of the old block in a scratch file until Step 11 validation passes.
6. Republish. Validate `/`, `/contact`, and one service page in the Rich Results Test: you should see **one** DryCleaningOrLaundry entity, with no errors. The Brizy-generated basic `LocalBusiness` block may still appear alongside it (see Step 2.3); that's acceptable because the rich node carries an `@id` and consistent NAP, but if Step 2.3 cleaned the source fields, both blocks will now agree.

---

## Step 4 — Fix broken and inconsistent links (~20 min)

On the homepage (and footer/header if shared globally):

1. Replace the `https://www.tiktok.com/notfound` link with the real TikTok URL from 0.1, or delete the TikTok icon if none exists.
2. Make every Instagram link point to the canonical handle from 0.2.
3. Recrawl-check: after publishing, view page source and search for `notfound` — zero hits expected.

---

## Step 5 — Page-by-page titles, descriptions, H1s, og:images

Work in this order (money pages first). For each page in Brizy: **Page Settings → SEO tab** for Title/Description; **Social tab** (or equivalent) for share image; edit the top heading element on the canvas and change its tag to **H1** for the heading fix.

Rules:
- Titles ≤ 60 characters where possible; descriptions 120–158.
- The H1 change is a *tag* change on the existing heading element — don't rewrite page copy unless noted.
- og:image: reuse each page's existing hero image; pages marked ✅ already have one.

### 5A. Money pages (do first)

| Page | SEO Title | Meta Description | H1 |
|---|---|---|---|
| `/` | `Eco-Friendly Dry Cleaners in Mississauga \| TSC Wetclean` | `Mississauga's eco-friendly alternative to dry cleaning. Expert wet cleaning, tailoring & free GTA pickup & delivery. 35+ years of garment care.` | Change existing H1 text "Welcome to TSC WETCLEAN" → `Mississauga's Eco-Friendly Alternative to Dry Cleaning` |
| `/services` | `Dry Cleaning & Laundry Services in Mississauga \| TSC Wetclean` | `Wet cleaning, delicates, tailoring & alterations, comforter cleaning, wash & fold, and free pickup & delivery across Mississauga & the GTA.` | H2 "OUR SERVICES" → H1 `Our Garment Care Services` |
| `/wetcleaning` | `What Is Wet Cleaning? Safe for "Dry Clean Only" \| TSC Wetclean` | `Modern wet cleaning safely cleans wool, silk, cashmere & "dry clean only" garments—no toxic solvents. See why it beats traditional dry cleaning.` | H2 "ABOUT WETCLEANING" → H1 `Professional Wet Cleaning for Delicate & Fine Fabrics` |
| `/pickup-and-delivery` | `Free Laundry Pickup & Delivery in Mississauga & GTA` | `Free scheduled pickup & delivery for dry cleaning and laundry across Mississauga, Toronto, Oakville & the GTA. Set preferences once—we do the rest.` | H2 "FREE PICKUP & DELIVERY" → H1 `Free Laundry & Dry Cleaning Pickup & Delivery` |
| `/laundry-subscription` | `Wash & Fold Laundry Subscription \| Mississauga & GTA` | **This page's current description is wrong — it describes bespoke tailoring.** Replace with: `Fill your bag, we handle the rest. Personalized wash & fold subscription with free pickup & delivery in Mississauga and the GTA.` | Add H1 `Wash & Fold Laundry Subscription` (page currently has no H1 or H2) |
| `/comforter` | `Comforter, Duvet & Blanket Cleaning \| Mississauga & GTA` | `Deep, gentle cleaning for comforters, duvets, blankets & household textiles. Careful drying and finishing—free pickup & delivery available.` | Promote first heading → H1 `Comforter, Blanket & Duvet Cleaning` |
| `/contact` | `Contact \| Dry Cleaners in Mississauga \| TSC Wetclean` | `Visit us at 801 Dundas St E, Mississauga, call (905) 896-9313, or book free GTA pickup & delivery. Open Mon–Fri 7–6, Sat 7–4.` | H1 exists ("CONTACT US") — keep |

### 5B. Secondary pages

| Page | SEO Title | Meta Description | H1 |
|---|---|---|---|
| `/hollywood` | `Hollywood Garment Care \| Studio-Grade Cleaning \| TSC` | `25+ years cleaning for film & TV productions. Studio-grade finishing with discreet handling—now available for your finest garments.` | H2 "HOLLYWOOD" → H1 `Hollywood-Grade Garment Care` |
| `/bespoke-custom-tailoring` | Keep current title (good) | Keep current, trim to ≤160 chars | Promote "Bespoke Custom Suits & Shirts!" → H1 |
| `/about-bespoke` | `Why Choose TSC for Bespoke Tailoring \| TSC Wetclean` | Write 1–2 sentences from the page's actual content (lifetime maintenance guarantee, Maxwell's partnership) — currently the generic default | H2 "Why US" → H1 |
| `/about` | Keep (already localized: "About TSC WetClean \| Sustainable Dry Cleaners in Mississauga") | Keep | H2 "ABOUT US" → H1 |
| `/tsc-wetclean` | Keep ("About TSC Wetclean \| Our Process & Clean Care Standards") | Keep | H2 "ABOUT US" → H1 `Our Process & Clean Care Standards` |
| `/book-an-appointment` | `Book an Appointment \| TSC Wetclean Mississauga` | `Book garment care, tailoring fittings, or pickup & delivery online. Fast confirmation from Mississauga's eco-friendly cleaner.` | Promote "Book an Appointment" → H1 |
| `/blog` | `Garment Care Tips & News \| TSC Wetclean Blog` | `Garment care tips from 35+ years of professional cleaning—stain advice, fabric care, and our "60 Seconds with Your Cleaner" video series.` | Add H1 `Garment Care Tips & News` (page has no headings at all) |
| `/updates` | Keep ("Updates & Announcements \| TSC Wetclean") | Keep | Add H1 |
| `/winter-whites` | Per 0.6: if active → `Winter Whites Cleaning & Storage \| TSC Wetclean` + description written from the page's actual offer; if stale → **noindex** via the page's Search Visibility toggle and skip the rest | — | Add H1 if kept |

### 5C. Episode pages — titles/descriptions
Episodes 1–3 already have good custom titles/descriptions — leave them; just fix H1 (H2 "60 Seconds with your Cleaner" → H1 on each).

Episodes 4–8 currently have default titles/descriptions. Titles below are derived from each episode's own on-page summary (the og:description Brizy generated from page content); **confirm each against the actual video (0.4) before publishing**:

| Page | Proposed title (verify topic) | Description source |
|---|---|---|
| `…-episode-4` | `Why Garment Finishing Matters \| 60 Seconds with Your Cleaner Ep. 4` | Page copy: value is in finishing, pressing, conditioning, restoring after cleaning |
| `…-episode-5` | `The Sustainable Wardrobe: Curation Over Consumption \| Ep. 5` | Page copy: building a sustainable wardrobe without starting over |
| `…-episode-6` | **`[VERIFY]`** — page description duplicates Ep. 5's; get real topic from video `b0N0JdiucKw` | — |
| `…-episode-7` | `AI Can't Press a Suit: Why Garment Care Stays Human \| Ep. 7` — **verify framing against video** `a-IDbL6d51A` | Page copy: AI transforms industries, but garment care… |
| `…-episode-8` | `The Dirty Secret on Your Bed: Comforter Care \| Ep. 8` — **verify against video** `HS-d6RvBlWM` | Page copy: "the dirty little secret lying on your bed" |

For each: write a 1–2 sentence description summarizing the actual episode, ending with `Mississauga eco-friendly wet cleaning.` (matches the pattern already used on episodes 1–3). Upload each episode's YouTube thumbnail as the og:image (episodes 4–8 have none today).

**After each batch:** republish and check 3–4 pages in Google's Rich Results Test + view-source for the new title/description.

---

## Step 6 — Episode schema (episodes 4–8, plus VideoObject check on 1–3)

Episodes 1–3 already carry a well-formed `BlogPosting` with an embedded `VideoObject` (verified on `/episode-1`). Episodes 4–8 have **no** article schema.

For each of episodes 4–8, use `seo/schema-snippets/blogposting-template.jsonld` and fill with **only verified values**:

- `headline` / `description`: the final values you set in Step 5C.
- `datePublished` / `uploadDate`: real dates from YouTube Studio (0.4). **Do not** use placeholder dates — Episode 1's existing schema has `uploadDate: 2025-01-01`, which looks fabricated; fix it there too while you're in that page.
- `embedUrl`: use the confirmed IDs — Ep4 `1YwGFaGtHT8`, Ep5 `hWsCSvk-DCU`, Ep6 `b0N0JdiucKw`, Ep7 `a-IDbL6d51A`, Ep8 `HS-d6RvBlWM`.
- `thumbnailUrl`: `https://img.youtube.com/vi/<VIDEO_ID>/maxresdefault.jpg` (same pattern episodes 1–3 already use).
- `author`: `Dino Kantzavelos` — matches the existing episode schema. Only include the LinkedIn URL if it's really his profile (it appears in your site's own sameAs list).
- Since Step 3's site-wide graph defines the business at `https://www.tscwetclean.com/#local`, set `publisher: { "@id": "https://www.tscwetclean.com/#local" }` instead of repeating the address block.

Paste each into that page's per-page head code injection (same mechanism episodes 1–3 already use). Republish, validate each in the Rich Results Test — expect **Article** and **Video** detections with no errors.

---

## Step 7 — FAQ content, then FAQ schema (in that order)

**Rule: FAQ schema may only mark up questions and answers that are visibly rendered on the page.** Adding `FAQPage` markup for content that isn't on the page violates Google's guidelines.

1. Write and add a visible FAQ section (a Brizy accordion or plain headings+text) to:
   - `/wetcleaning` — e.g. "Can you clean 'dry clean only' garments?", "Is wet cleaning safe for wool and silk?", "How is wet cleaning different from dry cleaning?" (the page's existing copy already answers these; turn it into explicit Q&A).
   - `/comforter` — sizes handled, turnaround, allergy benefits.
   - `/pickup-and-delivery` — service area, scheduling, pricing, turnaround.
   Write answers from your real policies — **not from this document**; I don't know your turnaround times or pricing.
2. Only after the visible FAQs are live, fill `seo/schema-snippets/faqpage-template.jsonld` with the *identical* question/answer text and paste into that page's per-page head injection.
3. Validate each page — Rich Results Test should detect **FAQ**.

---

## Step 8 — Cleanup items (~1 hour)

1. **Alt text:** add descriptive alt text to the 3 images missing it on `/blog` and 8 on `/updates` (all other pages passed the crawl check). Describe what's in the image; include a location/service keyword only when it's genuinely what the image shows.
2. **`/style-guide`:** per 0.5 — if internal, toggle Search Visibility OFF for that page (Brizy then adds `noindex`); if customer-facing, give it a real title/description targeting garment-care queries and an H1.
3. **Do not rename any existing URLs.** The mixed episode slugs (`/episode-1` vs `/60-seconds-with-your-cleaner-episode-4`) are cosmetic; the pages are indexed and renaming requires 301s for zero ranking benefit. Just pick one convention for *future* posts.

---

## Step 9 — Local SEO off-site (start same week, ongoing)

1. **Google Business Profile** (requires 0.3 access):
   - Primary category: `Dry cleaner`. Add secondaries as applicable: `Laundry service`, `Clothing alteration service`. (Check what's currently set before changing — record it in your baseline.)
   - Confirm hours exactly match the site/schema: Mon–Fri 7–6, Sat 7–4, Sun closed.
   - Website field → `https://www.tscwetclean.com/`; appointment link → `https://www.tscwetclean.com/book-an-appointment`.
   - Add the services list (wet cleaning, alterations, wash & fold, comforter cleaning, pickup & delivery), photos, and post the episode videos as monthly GBP posts.
2. **Citations** — same NAP everywhere (`TSC Wetclean · 801 Dundas Street East, Mississauga, ON L4Y 4G9 · (905) 896-9313`): Yelp, YellowPages.ca, 411.ca, BBB, Apple Business Connect, Bing Places, Facebook page info.
3. **Reviews:** set up a review ask (QR code on garment bags / link in pickup-confirmation emails → the GBP review URL). **Do not add `AggregateRating` schema** unless/until reviews are visibly embedded on the site — rating markup without on-page reviews risks a manual action.

---

## Step 10 — Service-area pages (month 2–3, after Steps 1–9 are live)

Build 4–6 pages, one per real service area (the areas come from your own delivery coverage): Toronto, Etobicoke, Oakville, Brampton, Burlington, Vaughan. For each:
- URL pattern: `/laundry-pickup-and-delivery-<city>`.
- Minimum 400 words of **unique** content: that city's pickup days/routes, landmarks you serve, a real customer testimonial from that city if you have one, embedded map.
- Title: `Laundry & Dry Cleaning Pickup & Delivery in <City> | TSC Wetclean`; matching H1 and description.
- Per-page `Service` schema from `service-page-template.jsonld` with that city as `areaServed`.
- Internal links: from `/pickup-and-delivery` body copy and the footer.
- **Do not** mass-produce postal-code doorway pages (the 40-item FSA list in the old schema is not a page list) — thin duplicated local pages get filtered or penalized.

---

## Step 11 — Validate, monitor, iterate

1. **Immediately after each publish:** Rich Results Test + https://validator.schema.org/ on every changed page. Fix errors before moving on.
2. **Within 1 week:** GSC → URL Inspection → Request indexing for the money pages; confirm sitemap shows "Success."
3. **Day 30 / 60 / 90 review** against the Step 1 baseline:
   - GSC queries: impressions/clicks for the "dry cleaner mississauga", "laundry pickup", "comforter cleaning" clusters.
   - GSC → Enhancements/Rich results: LocalBusiness, FAQ, Video reports error-free and growing.
   - Repeat the manual local searches from Step 1; note local-pack and organic positions.
4. Iterate: pages with impressions but low CTR → sharpen title/description; queries ranking 5–15 → add content/internal links to that page.

---

## Guardrails — things this plan deliberately does NOT do

- **No fabricated data in schema:** no invented review counts/ratings, no placeholder dates, no unverified social profiles, no services you don't offer.
- **No FAQ markup without visible FAQs** (Step 7 ordering is mandatory).
- **No URL renames** without 301 redirects and a reason.
- **No doorway pages** per postal code.
- **No keyword stuffing:** each title uses one primary phrase + location + brand, once.
- Anything marked `[VERIFY]` must be confirmed before it ships — if a value can't be confirmed, omit that field rather than guessing.
