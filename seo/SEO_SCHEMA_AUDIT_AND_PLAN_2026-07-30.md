# TSC Wetclean — SEO & Schema Audit + Improvement Plan
**Site:** https://www.tscwetclean.com/ · **Platform:** Brizy Cloud (hosted) · **Audit date:** July 30, 2026
**Scope:** Full crawl of all 25 URLs in sitemap.xml — technical SEO, on-page SEO, structured data (schema), and local SEO.

---

## 1. Executive Summary

The site has a solid technical base (correct canonicals, auto sitemap, open robots.txt, no noindex accidents, alt text mostly present) and someone has already built a **genuinely good `DryCleaningOrLaundry` schema block — but it's only injected on the Contact page.** Meanwhile every page carries a weak, partially malformed site-wide `LocalBusiness` block that conflicts with it.

The five highest-impact problems, in order:

1. **The homepage (and most titles) never say where the business is.** The homepage title is "Eco-Friendly Wet Cleaning & Garment Care | TSC Wetclean" — no Mississauga, no Toronto. For a local service business this is the single biggest ranking handicap.
2. **Nobody searches "wet cleaning."** Search demand is for *dry cleaners Mississauga*, *dry cleaning near me*, *laundry pickup and delivery*, *comforter cleaning*. The site should target dry-cleaning terms and position wet cleaning as the superior eco-friendly method — not avoid the phrase.
3. **~10 pages share one identical default meta description** and inherit a long default title suffix (titles up to 98 characters). One page (`/laundry-subscription`) has a **wrong description entirely** — it describes bespoke tailoring.
4. **23 of 25 pages have no H1 at all** (top headings are H2s). Only the homepage ("Welcome to TSC WETCLEAN" — weak) and Contact have H1s.
5. **Schema is fragmented and conflicting:** a strong `DryCleaningOrLaundry` graph on one page, a weak `LocalBusiness` everywhere, wrong geo coordinates in one of them, human-text opening hours in the other, and blog schema on only 3 of 8 episode pages.

Everything below is fixable inside Brizy Cloud with no re-platforming.

---

## 2. How SEO Works on Brizy Cloud (what we can and can't control)

Researched against Brizy's documentation and verified against the live site's behavior:

| Capability | How it works in Brizy Cloud |
|---|---|
| **Per-page title & description** | Every page has an **SEO tab** in Page Settings (Title, Description, focus keyword). Custom values here **fully override** the global/default values — verified live: pages with custom SEO (about, comforter, hollywood) show clean titles with no appended suffix. |
| **Global fallbacks** | Project Settings → Site Title / Site Description. Pages **without** custom SEO get `Page Name | <Site Title>` and the global description — this is exactly what's producing the 98-char titles and duplicate descriptions. |
| **Search visibility / noindex** | Per-page toggle; disabling it adds a `noindex` meta tag. Use for utility pages. |
| **Social share image (og:image)** | Set per page in page settings (Social tab). Pages missing it today simply never had one uploaded. |
| **Code injection — global** | Project Settings → Code Injection → Header/Footer: injected on **every** page. This is where the site-wide schema `@graph` should live. |
| **Code injection — per page** | Page Settings allow per-page head code. **Proven working on this site** — the Contact page's `DryCleaningOrLaundry` graph, the episode pages' `BlogPosting`, and the service pages' `Service` blocks are all per-page injections. |
| **Sitemap.xml** | Auto-generated at `/sitemap.xml`; updates automatically. Priorities/changefreq are fixed at 1.0/daily and **not editable** — Google largely ignores these fields, so this is cosmetic, not a problem. |
| **Robots.txt** | Auto-generated from the Search Engine Visibility toggle. Currently correct (allow all). |
| **Canonical tags** | Auto-generated per page and correct on all 25 pages. Nothing to do. |
| **301 redirects** | Project Settings → Redirects supports manual 301s — needed if we ever rename URLs (e.g., episode slugs). |
| **Auto-generated schema** | Brizy emits the `Organization`, `WebSite` (+SearchAction) and the basic `LocalBusiness` blocks from project/business settings. The malformed hours/address in the site-wide `LocalBusiness` come from Brizy's business-info fields, so first try fixing them **in the settings UI**; if the UI can't produce proper values, the block gets superseded by our injected graph (see §4). |

**Key Brizy sources:** [SEO settings in Brizy Cloud](https://support.brizy.io/hc/en-us/community/posts/15628539909010-SEO-settings-in-Brizy-Cloud) · [SEO settings article](https://support.brizy.io/hc/en-us/articles/360042104792-SEO-settings) · [Sitemap XML](https://support.brizy.io/hc/en-us/articles/360041720332-Sitemap-XML) · [Redirects](https://support.brizy.io/hc/en-us/articles/360041684532-Redirects) · [How to add Schema in Brizy](https://www.brizy.io/add-schema-to-website) · [Custom links, redirects & sitemap](https://www.brizy.io/custom-links)

---

## 3. Detailed Findings

### 3.1 Technical (mostly healthy)
- ✅ robots.txt allows all crawling; canonicals correct on every page; `lang="en"` set; site serves over HTTPS with www canonical host.
- ✅ Sitemap contains all 25 pages, auto-updates.
- ⚠️ No Twitter card tags anywhere; og:image missing on 13 of 25 pages.
- ⚠️ Images missing alt text: `/blog` (3), `/updates` (8). Everything else is clean.
- ⚠️ `WebSite` schema advertises a `SearchAction` pointing at `?s={search_term_string}` — the site has no search results page. Harmless but pointless (Brizy default; remove only if Brizy exposes a toggle).

### 3.2 Titles & meta descriptions
- **Default-suffix pages** (98-char titles + identical 147-char description): all five `/60-seconds-...-episode-4…8`, `/about-bespoke`, `/blog`, `/book-an-appointment`, `/style-guide`, `/winter-whites`, `/laundry-subscription`.
- **Wrong description:** `/laundry-subscription` describes Maxwell's bespoke tailoring (399 chars) — copy/paste error from the bespoke page.
- **No geo modifiers:** Only `/about`, `/comforter`, and episodes 1–3 mention Mississauga/Toronto in title or description. The homepage, services, wetcleaning, pickup-and-delivery — the money pages — have none.
- **Contact title too thin:** "Contact TSC Wetclean" (20 chars) wastes the most valuable local slot ("Contact · Dry Cleaners Mississauga…").

### 3.3 Headings
- H1 missing on 23/25 pages; top-level content sits in H2s ("OUR SERVICES", "ABOUT WETCLEANING", "FREE PICKUP & DELIVERY", "HOLLYWOOD"...). In Brizy, select the heading text element and change the tag from H2 → H1 — content/pages don't need restructuring.
- Homepage H1 "Welcome to TSC WETCLEAN" carries zero keywords.

### 3.4 Schema (structured data)
Current state per block:

| Block | Where | Verdict |
|---|---|---|
| `Organization` (name+url only) | All pages (Brizy auto) | Thin; superseded by LocalBusiness graph. Harmless. |
| `WebSite` + SearchAction | All pages (Brizy auto) | SearchAction target doesn't exist; harmless. |
| `LocalBusiness` (basic) | All pages (Brizy auto) | **Malformed:** `streetAddress` crams in city+province ("801 Dundas Street East Mississauga, ON"), `openingHours` is human prose ("Monday - Friday: 7:00am - 6:00pm\n\nSaturday…") instead of schema format (`Mo-Fr 07:00-18:00`), no geo, no sameAs, no image, no priceRange, generic type. |
| `DryCleaningOrLaundry` @graph | **Contact page only** | **Excellent** — correct specific type, split address, openingHoursSpecification, hasMap, sameAs, areaServed, logo, plus a linked Pickup & Delivery `Service` node. Two defects: **geo coordinates are wrong** (43.5932, −79.596 vs. the actual 43.5977, −79.5981 from the Google listing), and `areaServed` is a 40-item postal-code text dump (works, but noisy — see fix). |
| `Service` blocks | hollywood, wetcleaning, pickup-and-delivery, bespoke, services (list), homepage (ItemList) | Present but skeletal — most are just `serviceType` with no `provider`, `areaServed`, `description`, or `url`. |
| `BlogPosting` | episodes 1–3 only | Good; episodes 4–8 have nothing. Video episodes should also get `VideoObject`. |
| `CollectionPage` | /updates | Fine. |
| **FAQPage** | Nowhere | Missed opportunity — the site already answers classic questions ("Can you wet clean dry-clean-only?"). |

**Conflict risk:** on Contact, Google sees *two* different local-business entities (weak `LocalBusiness` + rich `DryCleaningOrLaundry`) with different address formatting and hours formats. Consolidate to one canonical graph.

### 3.5 Local SEO signals
- ✅ NAP core is consistent: 801 Dundas Street East, Mississauga, ON L4Y 4G9 · +1 (905) 896-9313 · Google Maps CID link present (`cid=4905697812649802137`).
- ❌ **Broken TikTok link on the homepage:** `https://www.tiktok.com/notfound` (literally). Schema `sameAs` says `tiktok.com/@tscwetclean` — fix the homepage link to the real handle or remove it.
- ⚠️ **Two Instagram handles referenced:** `instagram.com/tscwetcleaners` (homepage link + schema sameAs) and `instagram.com/tscwetclean` (elsewhere on homepage). Confirm the canonical account and use it everywhere.
- ⚠️ No dedicated service-area pages despite serving the whole GTA (Toronto, Oakville, Brampton, Burlington, Vaughan, Markham per the areaServed list) — pickup & delivery demand in those cities currently has no landing page to rank.
- ⚠️ No visible review content/rating markup (do **not** add `AggregateRating` schema unless reviews are actually displayed on the page — Google penalizes rating markup without on-page reviews).

### 3.6 Information architecture
- Blog posts live at root level with two different slug conventions: `/episode-1…3` vs `/60-seconds-with-your-cleaner-episode-4…8`. Both exist alongside `/blog` and `/updates` hub pages. Don't rename existing URLs (they're indexed; renaming needs 301s) — but standardize future posts.
- Two "about" pages — `/about` (company story) and `/tsc-wetclean` (process/standards) — acceptable, but differentiate their targets: `/about` = brand/history, `/tsc-wetclean` = "what is wet cleaning process" education.
- `/style-guide` looks like an internal design reference (fabric swatches, "Featured Designer Fabrics"). If it's not meant for customers, **noindex it** via the per-page Search Visibility toggle.

---

## 4. The Plan

### Phase 0 — Global foundations (Brizy Project Settings, ~1 hour)
1. **Global Site Title** → `TSC Wetclean | Eco-Friendly Dry Cleaning Alternative in Mississauga` (fallback only — every page below gets a custom title anyway).
2. **Global Site Description** → `Mississauga's eco-friendly alternative to dry cleaning. Wet cleaning, tailoring, wash & fold, and free pickup & delivery across the GTA. Call (905) 896-9313.`
3. **Business info fields** (source of the auto `LocalBusiness`): street = `801 Dundas Street East` only; city/region/postal in their own fields if Brizy provides them; hours in a structured format if possible.
4. Verify **Google Search Console** (domain property) and **Bing Webmaster Tools**; submit `/sitemap.xml` to both.
5. Fix homepage footer/header links: real TikTok URL, single canonical Instagram handle.

### Phase 1 — Site-wide schema overhaul (global head injection, ~1 hour)
Replace the per-page copy of the good graph with one **site-wide** injection: Project Settings → Code Injection → Header, using **`sitewide-localbusiness.jsonld`** in `seo/schema-snippets/` (corrected geo `43.5977, -79.5981`, cleaned `areaServed` as City objects, `priceRange`, `image`, `@id` anchor). Then:
- Remove the old per-page graph from Contact (now redundant).
- If Brizy's auto `LocalBusiness` block can't be fixed via settings, leave it — the rich graph with `@id` wins — but prefer emptying/correcting the business-info fields that generate it.

### Phase 2 — Page-by-page on-page SEO (the big one, ~4–6 hours)
Apply the table in §5: per-page SEO title, meta description, H1 tag fix, og:image upload, and per-page schema snippet where listed. All done in each page's Settings → SEO/Social tabs + per-page head code.

### Phase 3 — Local SEO (ongoing, start immediately)
1. **Google Business Profile:** primary category *Dry cleaner*, secondary *Laundry service*, *Clothing alteration service*; confirm hours match schema; add services & photos; enable messaging; post monthly (episode videos are perfect GBP posts).
2. **Citations:** consistent NAP on Yelp, YellowPages.ca, 411.ca, BBB, Apple Maps (Apple Business Connect), Bing Places, Facebook.
3. **Reviews:** ask-flow (QR on garment bags / pickup emails → GBP review link). Once reviews are embedded visibly on the site, *then* add `AggregateRating` to the LocalBusiness node.
4. **Service-area pages (month 2–3):** 4–6 unique pages targeting `laundry & dry cleaning pickup and delivery in <city>` for Toronto, Etobicoke, Oakville, Brampton, Burlington, Vaughan. Each: unique 400+ words, city-specific pickup schedule/route info, testimonial, map, `Service` schema with that city as `areaServed`, internal links from /pickup-and-delivery. **Do not** spin 40 postal-code doorway pages — quality over quantity.

### Phase 4 — Content & blog architecture (ongoing)
1. Standardize future episode slugs (pick one pattern; keep old URLs as-is — no renames without 301s).
2. Add `BlogPosting` + `VideoObject` schema to episodes 4–8 (template in `seo/schema-snippets/blogposting-template.jsonld`).
3. Make `/blog` the hub: link all episodes from it with descriptive anchor text; add the 3 missing alt texts there and 8 on `/updates`.
4. FAQ blocks + `FAQPage` schema on `/wetcleaning`, `/comforter`, `/pickup-and-delivery` (template provided; only mark up questions actually shown on the page).
5. Noindex `/style-guide` (or rewrite it as a customer-facing "Garment Care Guide" targeting *how to care for silk/cashmere* queries).

### Measurement
- GSC: track impressions/clicks for "dry cleaner mississauga", "laundry pickup toronto", "comforter cleaning" clusters; Rich Results report for LocalBusiness/FAQ/Video.
- Validate every schema change with Google's Rich Results Test + Schema.org validator before and after deploying.
- Baseline now, review at 30/60/90 days. Expect local-pack movement in 4–8 weeks after GBP + schema + title fixes.

---

## 5. Page-by-Page Worksheet

Character counts in parentheses. Titles target ≤60 chars, descriptions 120–158. **Bold** = biggest single fix on that page.

| # | Page | New SEO Title | New Meta Description | H1 fix | Schema action | og:image |
|---|---|---|---|---|---|---|
| 1 | `/` (Home) | Eco-Friendly Dry Cleaners in Mississauga \| TSC Wetclean (56) | Mississauga's eco-friendly alternative to dry cleaning. Expert wet cleaning, tailoring & free GTA pickup & delivery. 35+ years of garment care. (144) | **Change H1 to:** "Mississauga's Eco-Friendly Alternative to Dry Cleaning" | Site-wide graph covers it; keep ItemList | ✅ has one |
| 2 | `/services` | Dry Cleaning & Laundry Services in Mississauga \| TSC Wetclean (61) | Wet cleaning, delicates, tailoring & alterations, comforter cleaning, wash & fold, and free pickup & delivery across Mississauga & the GTA. (140) | H2 "OUR SERVICES" → H1 "Our Garment Care Services" | Enrich Service list: add `provider`, `url` per service (snippet 2) | ✅ |
| 3 | `/wetcleaning` | What Is Wet Cleaning? Safe for "Dry Clean Only" \| TSC Wetclean (62) | Modern wet cleaning safely cleans wool, silk, cashmere & "dry clean only" garments—no toxic solvents. See why it beats traditional dry cleaning. (145) | H2 → H1 "Professional Wet Cleaning for Delicate & Fine Fabrics" | Enrich Service + **add FAQPage** (snippet 4) | add |
| 4 | `/pickup-and-delivery` | Free Laundry Pickup & Delivery in Mississauga & GTA (52) | Free scheduled pickup & delivery for dry cleaning and laundry across Mississauga, Toronto, Oakville & the GTA. Set preferences once—we do the rest. (148) | H2 → H1 "Free Laundry & Dry Cleaning Pickup & Delivery" | Enrich Service: areaServed cities, provider @id | ✅ |
| 5 | `/laundry-subscription` | Wash & Fold Laundry Subscription \| Mississauga & GTA (53) | **Replace wrong description:** Fill your bag, we handle the rest. Personalized wash & fold subscription with free pickup & delivery in Mississauga and the GTA. (127) | Add H1 "Wash & Fold Laundry Subscription" | Add Service (wash & fold) | add |
| 6 | `/comforter` | Comforter, Duvet & Blanket Cleaning \| Mississauga & GTA (56) | Deep, gentle cleaning for comforters, duvets, blankets & household textiles. Careful drying and finishing—free pickup & delivery available. (139) | Add H1 "Comforter, Blanket & Duvet Cleaning" | Add Service + FAQPage | ✅ |
| 7 | `/bespoke-custom-tailoring` | Bespoke Suits & Custom Shirts \| Maxwell's × TSC Wetclean (57) | Keep current (good), trim to ≤160 | Add H1 "Bespoke Custom Suits & Shirts" | Keep Service ×2; add `provider` @id | ✅ |
| 8 | `/about-bespoke` | Why Choose TSC for Bespoke Tailoring \| TSC Wetclean (52) | Custom description about the bespoke partnership & lifetime maintenance guarantee | H2 "Why US" → H1 | none | add |
| 9 | `/hollywood` | Hollywood Garment Care \| Studio-Grade Cleaning \| TSC (53) | 25+ years cleaning for film & TV productions and A-list wardrobes. Studio-grade finishing with discreet handling—now for your finest garments. (143) | H2 "HOLLYWOOD" → H1 "Hollywood-Grade Garment Care" | Enrich Service | ✅ |
| 10 | `/about` | About TSC WetClean \| Eco Dry Cleaners in Mississauga (53) | Keep (already good) | H2 "ABOUT US" → H1 | none (site-wide covers) | add |
| 11 | `/tsc-wetclean` | Our Wet Cleaning Process & Care Standards \| TSC Wetclean (57) | Keep (good) | H2 "ABOUT US" → H1 "Our Process & Clean Care Standards" | none | ✅ |
| 12 | `/contact` | Contact TSC Wetclean \| Dry Cleaners Mississauga \| (905) 896-9313 (65→trim: "Contact \| Dry Cleaners in Mississauga \| TSC Wetclean", 52) | Visit us at 801 Dundas St E, Mississauga, call (905) 896-9313, or book free GTA pickup & delivery. Open Mon–Fri 7–6, Sat 7–4. (127) | H1 ✅ exists | **Remove per-page graph** once site-wide is live (avoid duplicate entity) | add |
| 13 | `/book-an-appointment` | Book an Appointment \| TSC Wetclean Mississauga (46) | Book garment care, tailoring fittings, or pickup & delivery online. Fast confirmation from Mississauga's eco-friendly cleaner. (127) | H2 → H1 | none | add |
| 14 | `/blog` | Garment Care Tips & News \| TSC Wetclean Blog (44) | Garment care tips from 35+ years of professional cleaning—stain advice, fabric care, and our "60 Seconds with Your Cleaner" video series. (137) | Add H1 "Garment Care Tips & News" | Add `Blog`/CollectionPage | add |
| 15 | `/updates` | Updates & Announcements \| TSC Wetclean (38) | Keep | Add H1 | ✅ CollectionPage exists | add |
| 16 | `/winter-whites` | Winter Whites Cleaning & Storage \| TSC Wetclean (47) | Custom copy about the winter-whites service/promo (currently default) | Add H1 | Add Service if it's a service; noindex if it's a stale promo | add |
| 17 | `/style-guide` | — | — | — | **Noindex** (internal reference) or rebuild as customer care guide | — |
| 18–20 | `/episode-1…3` | Keep (already good) | Keep | H2 → H1 per episode | Keep BlogPosting; add `VideoObject` | ✅ |
| 21–25 | `/60-seconds-…-episode-4…8` | Custom per episode: `<Topic> \| 60 Seconds with Your Cleaner Ep. N` — pull topic from each og:description (e.g., Ep. 4: "Why Finishing Matters in Garment Care \| 60 Seconds Ep. 4") | Custom 1–2 sentence summary per episode ending with "Mississauga eco-friendly wet cleaning." | H2 → H1 | **Add BlogPosting + VideoObject** (currently none) | add episode thumbnail |

---

## 6. Ready-to-Paste Schema Snippets

Stored in `seo/schema-snippets/` in this repo:

| File | Purpose | Where to paste in Brizy |
|---|---|---|
| `sitewide-localbusiness.jsonld` | Canonical DryCleaningOrLaundry graph (fixed geo, clean areaServed, priceRange, image) | Project Settings → Code Injection → **Header** (global) |
| `service-page-template.jsonld` | Enriched Service node template | Per-page head code on each service page |
| `blogposting-template.jsonld` | BlogPosting + VideoObject for episodes | Per-page head code on episodes 4–8 (and VideoObject on 1–3) |
| `faqpage-template.jsonld` | FAQPage template | Per-page on wetcleaning / comforter / pickup-and-delivery — only for Q&As visibly on the page |

Wrap each in `<script type="application/ld+json">…</script>` when pasting. Validate at https://search.google.com/test/rich-results after publishing.

---

## 7. Rollout Order & Effort

| Week | Work | Effort |
|---|---|---|
| 1 | Phase 0 + Phase 1 (global settings, site-wide schema, GSC/Bing, broken social links) | ~2–3 hrs |
| 1–2 | Phase 2 pages 1–13 (money pages first: home, services, wetcleaning, pickup, subscription, comforter, contact) | ~3–4 hrs |
| 2–3 | Phase 2 remainder (episodes, blog, updates, winter-whites, style-guide noindex) + alt texts | ~2–3 hrs |
| 2–4 | Phase 3: GBP optimization, citations, review flow | ~3 hrs + ongoing |
| Month 2–3 | Service-area pages (Toronto, Oakville, Brampton, Burlington…) | ~2 hrs/page |
| Day 30/60/90 | GSC review vs. baseline; iterate | 1 hr each |
