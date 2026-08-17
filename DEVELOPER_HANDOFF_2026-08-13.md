# SMRT Website — Developer Handoff

**Site:** https://smrtsystems.com/
**Re-scanned:** 2026-08-13, all 48 pages currently in `sitemap.xml`
**Purpose:** get organic clean before paid traffic starts

Four parts:

1. **Re-scan status** — what is fixed, what is still open, what is new
2. **Step-by-step fixes** — one numbered procedure per item
3. **Schema markup** — sitewide plus page-by-page, copy-paste ready
4. **Meta titles and descriptions** — keyword-aligned rewrites

---

# Part 1 — Re-scan status

The sitemap is now **48 URLs** (was 49). `/shop` and `/releasenotes` were added;
`/blogs/decoding-local-seo…` and `/blogs/beat-the-summer-slump` were removed.

## Fixed since the audit

| # | Item | Now |
|---|---|---|
| 14 | Brand written "SMrt" | **Gone** — 0 occurrences |
| — | framer.link on 5 of 6 pages | **Gone** from `/testimonials`, `/tech/marketing`, `/tech/metalprogetti`, `/tech/reporting`, `/special-services` |
| — | `/sales-demo/` demo buttons | **Gone** |
| — | "Explore SMRT Marketing" dead CTA | **Gone** |
| — | Two renamed support-article links, growth-onomics citation | **Gone** |
| — | Breakpoint duplication | Anchors 5,373 → 1,216; images 2,668 → 286; `<h5>` 778 → 316 |
| — | Google Ads tag (`AW-`) | No longer firing on any page |

That is real progress — the duplication consolidation in particular fixes several problems at once.

## Still open

| # | Item | Current state |
|---|---|---|
| 1 | **No privacy policy, terms, or cookie notice** | 0 of 48 pages. No CMP. See note below. |
| 2 | **TEAMVIEWER 270 MB `.exe`** | Still on 17 pages, 33 refs |
| 3 | 80% growth testimonial | Still on homepage |
| 4 | "10,397,124 Satisfied Customers" | Still on homepage |
| 5 | **Duplicate title + description** | **33 pages** share `Dry Cleaning POS & Business Software \| SMRT` — now includes `/shop` and `/releasenotes` |
| 6 | Homepage FAQ answers | 6 questions present; answers still need checking after edits |
| 7 | **Zero structured data** | 0 of 48 pages |
| 8 | **No `og:image` / `twitter:image` / `og:site_name`** | 0 of 48, while `summary_large_image` is declared on all 48 |
| 9 | Images missing `alt` | 273 of 286 (95%) |
| 10 | No `lang` attribute | 0 of 48 |
| 11 | `<h5>` used for buttons/nav | 316 elements |
| 12 | Not exactly one `<h1>` | 48 of 48 pages; homepage still has 6 |
| 13 | Split-text space loss | `DryCleaning`, `Ecosystem.Built` still on homepage |
| 15 | Headline casing variants | 3 variants of "Your customers deserve the best" |
| 17 | Blog slug typo | `/blogs/improve-how-your-treat-your-customers` |
| 19 | Address / copyright format | `Suite 1600 Raleigh, NC - 27606`, `© SMRT Systems, Inc. - 2026` |
| 20 | Viewport | 47 pages `width=device-width` (no `initial-scale`), **1 page `width=1200`** |
| 21 | 404 page | Still "Page Not Found \| Framer" |

**On the cookie banner:** the homepage now contains Framer's `__framer-cookie-component` CSS,
but **only in a `<style>` block** — there is no banner element, no Accept/Decline control and
no consent text anywhere. The component has been styled but never enabled.

**Tracking has changed, and not in a helpful direction for compliance.** Google Ads is gone,
but **Microsoft Clarity is now on all 48 pages** (project `y07u5nx3wk`). Clarity does session
recording and heatmaps, which is materially higher-risk processing under GDPR than plain
analytics. It strengthens the case for consent, it does not weaken it.

| Tracker | Pages |
|---|---|
| Google Tag / GTM | 48/48 |
| gtag.js | 48/48 |
| **Microsoft Clarity (session recording)** | **48/48** |
| LinkedIn | 17/48 |

## New findings

### N1 — `/shop` is a live store built on the contact-page template (P0)

`https://smrtsystems.com/shop` returns 200, is in the sitemap, and is indexable. It is a
Shopify-backed store selling four hardware items:

| Product | Price |
|---|---|
| SMRT Credit Card Terminal | $300.00 |
| Heat Seal Machine | $1,050.00 |
| CAS PD-2Z60 Dual Range POS Scale | $600.00 |
| Epson TM-T20IV | $230.00 |

Five defects on one page:

1. **`<meta name="viewport" content="width=1200">`** — a hardcoded desktop viewport. This page
   will render zoomed-out and unusable on every phone. It is the only page on the site like
   this.
2. **The H1s are the contact page's** — "Let's Start a Conversation." / "See Where It Takes
   You." The page was duplicated from `/contact-us` and the hero was never rewritten.
3. **The literal word "None" renders four times**, once before each product name — an unset
   CMS/product field.
4. **Title and description are the homepage's**, so a store page is titled "Dry Cleaning POS &
   Business Software | SMRT".
5. **You are now selling goods with no Terms of Sale, no Refund/Return policy, no Shipping
   policy and no privacy policy.** For a marketing site the missing policies were a GDPR
   problem. For a store taking card payments they are also a consumer-protection and card-
   scheme problem.

### N2 — `/releasenotes` has the homepage's title and description

New page, returns 200, in the sitemap, and inherits the duplicate metadata.

### N3 — Sitemap still has no `<lastmod>`

0 of 48 entries. Google gets no recrawl signal, which matters more now that you have
submitted to Search Console and are about to spend on ads.

### N4 — Deleted posts now 404 with no redirect

`/blogs/beat-the-summer-slump` and `/blogs/decoding-local-seo-putting-your-business-on-the-map-in-2024`
were removed and both return 404. They are correctly out of the sitemap, but any inbound links
or existing rankings are now dead ends.

### N5 — Blog rendering under burst crawling (monitor, do not panic)

Worth knowing before Googlebot ramps up. When I requested 30 distinct blog URLs in
sequence, **all 30 returned HTTP 200 with a 54,412-byte shell** — `<div id="main"></div>`
and no content. Requested individually, the same URLs return 561–588 KB with a real `<h1>`,
22 `<h2>`s and a `<time datetime>`. Five rapid requests to a *single* URL all returned full
content, so it is tied to distinct cache-cold paths, not to request rate as such.

**This is almost certainly my crawler tripping Framer's edge cache, not a site defect** — and
for real visitors the pages are fine. But a 200 with no content is worse than an error,
because it looks valid, and Googlebot crawls exactly this pattern: many distinct URLs in
sequence. It is a plausible cause of "Crawled – currently not indexed".

**Verify, do not assume:** in Search Console, run **URL Inspection → Test live URL → View
crawled page** on five or six blog posts and confirm Google receives the full HTML. Only
Google's tooling can answer what Googlebot actually got. If you see shells, it is a Framer
hosting issue to escalate to them, not something to fix in the project.

*Correction to my earlier audit:* I previously reported blog posts as having no `<h1>` and no
`<time>`. That reading came from these shell responses. Blog posts **do** have one `<h1>` and
a real `<time datetime>` — which matters, because the BlogPosting schema below depends on it.

---

# Part 2 — Step-by-step fixes

## Fix 1 — Publish policies and enable consent *(P0, legal)*

1. Draft and publish three pages: **Privacy Policy**, **Terms of Service**, and — because
   `/shop` sells physical goods — **Refund & Shipping Policy**. Use counsel or a reputable
   generator, and make sure the privacy policy names Google Analytics/GTM, Google Ads and
   **Microsoft Clarity session recording** specifically.
2. In Framer, add all three to the **footer on every page** (edit the shared footer component
   once).
3. Enable a consent banner. Framer's built-in banner is under **Site Settings → General →
   Cookie Banner**. Its CSS is already shipping, so it only needs enabling and configuring.
   For EU traffic a full CMP (Cookiebot, Osano, Termly) is the safer choice because it can
   block scripts by category.
4. **Gate the tags behind consent.** Move GTM, gtag and Clarity so they fire only after
   opt-in. In GTM, use a consent-initialisation trigger; do not leave Clarity firing on load —
   session recording before consent is the highest-risk item on the page.
5. On the demo form, add a **consent checkbox** and a link to the privacy policy at the point
   of collection.
6. Add a **"Do Not Sell or Share My Personal Information"** link for California visitors.

## Fix 2 — Remove the TEAMVIEWER `.exe` link *(P0, trust)*

1. Edit the shared footer and **delete the `TEAMVIEWER` link**. It currently points at
   `https://smrt-releases.s3.amazonaws.com/tests/SMRT-Tool-Portable-0.3.0-x64.exe` — 270 MB,
   `/tests/` path, version 0.3.0.
2. If customers need a remote-support tool, publish it **behind the authenticated support
   portal**, not in a public footer.
3. Serve it from a domain you control, **code-sign the binary**, label it with its real name
   and file size, and point at a released build rather than `/tests/`.
4. If the label genuinely refers to TeamViewer, link to TeamViewer's own site instead — do not
   put a third-party trademark on your own executable.

## Fix 3 — Substantiate or replace the 80% testimonial *(P0, legal)*

1. Confirm with customer marketing that **Sarah Mitchell / Park Avenue Cleaners** is a real,
   consenting customer and that the 80% figure is documented in writing.
2. If real: keep it, and add a typicality qualifier — "Results vary; not typical of all
   customers." Store the substantiation where you can produce it.
3. If it is template copy: replace it with one of the eight verified quotes already on the page,
   and match their attribution format.

## Fix 4 — Relabel the customer counter *(P0, credibility)*

1. Find out what 10,397,124 actually counts.
2. Relabel to match — "Garments tracked", "Orders processed", "Customer notifications sent".
3. Add an as-of date, or make it update from live data.

## Fix 5 — Unique titles and descriptions on the 33 duplicate pages *(P0, SEO)*

1. In the Framer CMS **blog collection**, open the post template's SEO settings.
2. Bind **SEO Title** to the post title field plus a suffix, and **SEO Description** to the
   post excerpt field. Do not leave them on site defaults. See Part 4 for the pattern.
3. Set unique metadata manually on **`/shop`** and **`/releasenotes`** — see Part 4.
4. Re-check: no two pages should share a title. Framer's page list shows SEO fields per page.

## Fix 6 — Write the missing FAQ answers *(P1)*

1. Open the homepage FAQ component and check each question has body content — four of five
   were empty at audit time.
2. Write the missing answers, 40–80 words each, and keep them **in the DOM collapsed by CSS**
   rather than mounted on click, so they stay crawlable.
3. Then add the FAQPage schema from Part 3. Do not add it before the answers exist.

## Fix 7 — Add structured data *(P1, SEO)*

Follow Part 3. Order: sitewide Organization + WebSite first, then per-page.

## Fix 8 — Social share images *(P1, SEO)*

1. Create a **1200×630** default share image with logo and value proposition. Export as PNG or
   JPG under 300 KB.
2. Framer: **Site Settings → SEO → Social Image**. This sets the site default.
3. Add **per-page** images for `/`, `/book-a-demo`, the seven `/tech/*` pages, `/shop`,
   `/testimonials`, `/blogs`. Page settings → SEO → Social Image.
4. Add `og:site_name` and `og:image:alt` via **Site Settings → Custom Code → head**:
   ```html
   <meta property="og:site_name" content="SMRT Systems">
   ```
5. Verify with Facebook Sharing Debugger and LinkedIn Post Inspector, and force a re-scrape.

## Fix 9 — Alt text on images *(P1, accessibility)*

1. Work page by page in the Framer layer panel; each image layer has an **Alt Text** field.
2. Describe what the image shows, in context: *"SMRT driver app showing today's delivery
   route"*, not *"screenshot"*.
3. For purely decorative images set alt to empty explicitly so it renders `alt=""`.
4. Priority order: homepage → `/tech/*` → `/shop` product images → blog featured images.
5. For CMS-driven images, bind alt to a CMS field so it populates automatically.

## Fix 10 — Set the document language *(P1, accessibility)*

**Site Settings → Language → English.** This emits `<html lang="en">`. One toggle, fixes all
48 pages, clears a WCAG Level A failure.

## Fix 11 — Stop using `<h5>` for buttons and nav *(P1, semantics)*

1. The 316 `<h5>` elements are all UI controls: "Contact Us", "Book a Demo", "Products",
   "Solutions", "Resources", "Home", "Testimonials", "Talk to Sales".
2. For each, select the text layer and change its tag from **Heading 5 → Paragraph**.
3. For the three dropdown triggers (Products / Solutions / Resources), use Framer's **menu
   component** so they render as `<button>` with `aria-expanded` — they currently have no
   `href` and are not keyboard reachable.
4. Fix the shared header and footer once; that removes most of the 316.

## Fix 12 — One `<h1>` per page *(P1, SEO)*

1. On each page, keep exactly one H1. Where a headline runs over two lines, put the second
   line in a `<span>` **inside** the same H1 rather than making it a second H1.
2. Homepage specifically: the H1 currently reads **"Get"** because the rotating word is
   injected by JavaScript. Rewrite it as a complete static sentence — e.g.
   *"Dry Cleaning POS and Business Management Software"* — and apply the animation to a styled
   span inside it.
3. Demote "Seeing is Believing." to H2.
4. `/shop`: replace the contact-page H1s with store-appropriate ones — e.g. *"SMRT Hardware &
   Accessories"*.

## Fix 13 — Fix split-text spacing *(P1)*

1. The reveal animation joins its spans without whitespace, so the markup contains
   `DryCleaning` and `Ecosystem.Built`.
2. Best fix, and it also resolves the GPU load documented separately: **animate whole headings
   instead of per character**, and turn off the blur on the appear effect.
3. If the per-character effect must stay, ensure the component preserves a space between
   segments, and wrap the output in a container carrying `aria-label` with the full string
   while marking the character spans `aria-hidden="true"`.

## Fix 14 — Headline casing *(P2)*

1. Standardise to one convention. Recommended: **Title Case for headings, Sentence case for
   body, Title Case for buttons.**
2. Fix `YOUR CUSTOMERS DESERVE THE BEST. so do you.` — currently all-caps then lowercase in
   one line.
3. Reduce the CTA label set. Use **"Book a Demo"** as primary and **"Talk to Sales"** as
   secondary everywhere outside blog body copy.

## Fix 15 — Blog slug typo *(P2, SEO)*

1. Change `/blogs/improve-how-your-treat-your-customers` to
   `/blogs/what-your-customers-want` (matches its actual title).
2. Add a **301** from the old slug.
3. Do this before the post accrues links.

## Fix 16 — Footer formatting *(P2)*

Edit the shared footer:

| Current | Change to |
|---|---|
| `1017 Main Campus Dr, Suite 1600 Raleigh, NC - 27606` | `1017 Main Campus Dr, Suite 1600, Raleigh, NC 27606` |
| `© SMRT Systems, Inc. - 2026` | `© 2026 SMRT Systems, Inc.` |
| Blog `Publishing Date` label | `Published` — or remove the label |

## Fix 17 — Viewport *(P2, mobile)*

1. **`/shop` first — it has `width=1200`, which breaks the page on every phone.** Find the
   page-level custom code or setting forcing this and remove it.
2. Sitewide, set:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1">
   ```
3. Test `/shop` at 390 px width afterwards.

## Fix 18 — Branded 404 page *(P2)*

1. Create a 404 page in Framer with your header and footer, a short message, links to
   Products / Solutions / Blog, and a **Book a Demo** CTA.
2. This matters more than usual: deleted posts and old-site URLs are landing here.

## Fix 19 — Sitemap and redirects *(P1, SEO)*

1. Add **`<lastmod>`** to sitemap entries, populated from CMS update timestamps.
2. Add 301s for the two deleted posts:
   - `/blogs/beat-the-summer-slump` → closest current post, or `/blogs`
   - `/blogs/decoding-local-seo-putting-your-business-on-the-map-in-2024` → `/blogs`
3. Build the old-site redirect map: `/marketing/*` and `/business-administration/*` →
   `/blogs/*`, `/sales-demo/` → `/book-a-demo`. Pull the real inventory from **Search Console
   → Indexing → Pages** and sort by impressions.
4. Resubmit the sitemap, then watch Coverage for 404 spikes.

## Fix 20 — Remaining link issues *(P1)*

1. Two `framer.link/P8mvaz1` buttons on `/blogs` ("Schedule a Demo", "See Marketing Tools") →
   point to `/book-a-demo`.
2. Nine dead `www.smrtsystems.com` URLs on `/blogs` featured-card image links → repoint to
   their `/blogs/{slug}` equivalents.
3. `#Couture Dry Cleaning` → rename the section id to `couture`, use `#couture`.

## Fix 21 — `/shop` cleanup *(P0, combined)*

1. Remove the `width=1200` viewport (Fix 17).
2. Replace the contact-page H1s (Fix 12).
3. Find the field rendering **"None"** four times and either populate or hide it.
4. Set a unique title and description (Part 4).
5. Add Product schema (Part 3).
6. Publish Terms of Sale, Refund and Shipping policies before promoting this page.

---

# Part 3 — Schema markup

## How to install

- **Sitewide blocks** → Framer **Site Settings → General → Custom Code → End of `<head>`**.
  They then appear on every page.
- **Page-specific blocks** → the individual page's **Settings → Custom Code → End of
  `<head>`**.
- **CMS template blocks** → the blog post template's custom code, using CMS variables so each
  post populates itself.
- Validate every block in **Google Rich Results Test** and **Schema.org Validator** before
  publishing. One malformed block can invalidate the rest of the page.

**On service area:** you serve globally, so the schema below states the countries you actively
support by name, adds the regions you cover broadly, and does **not** claim local-business
status — which would be wrong and could hurt you. `Organization` with `areaServed` is the
correct shape for a global SaaS company with one head office.

---

## 3.1 Sitewide — Organization *(every page)*

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://smrtsystems.com/#organization",
  "name": "SMRT Systems",
  "legalName": "SMRT Systems, Inc.",
  "alternateName": "SMRT",
  "url": "https://smrtsystems.com/",
  "logo": {
    "@type": "ImageObject",
    "url": "https://smrtsystems.com/logo-512.png",
    "width": 512,
    "height": 512
  },
  "description": "SMRT Systems builds cloud point-of-sale and business management software for dry cleaners and garment care businesses, covering order intake, production and assembly, pickup and delivery routing, payments, reporting and marketing.",
  "foundingDate": "2014",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "1017 Main Campus Dr, Suite 1600",
    "addressLocality": "Raleigh",
    "addressRegion": "NC",
    "postalCode": "27606",
    "addressCountry": "US"
  },
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "contactType": "sales",
      "telephone": "+1-919-849-5500",
      "areaServed": ["US", "CA"],
      "availableLanguage": ["en"]
    },
    {
      "@type": "ContactPoint",
      "contactType": "sales",
      "telephone": "+61-1800-841-874",
      "areaServed": ["AU", "NZ"],
      "availableLanguage": ["en"]
    },
    {
      "@type": "ContactPoint",
      "contactType": "sales",
      "telephone": "+46-40-620-84-02",
      "areaServed": ["SE", "GB", "IE", "NO", "DK", "FI", "NL", "BE", "DE", "FR", "ES", "IT", "PL", "AE"],
      "availableLanguage": ["en", "sv"]
    },
    {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "telephone": "+1-919-804-0002",
      "areaServed": ["US", "CA"],
      "availableLanguage": ["en"],
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        "opens": "00:00",
        "closes": "23:59"
      }
    },
    {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "telephone": "+61-344-22-2144",
      "areaServed": ["AU", "NZ"],
      "availableLanguage": ["en"]
    },
    {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "telephone": "+46-40-620-85-94",
      "areaServed": ["SE", "GB", "IE", "NO", "DK", "FI", "NL", "BE", "DE", "FR", "ES", "IT", "PL", "AE"],
      "availableLanguage": ["en", "sv"]
    }
  ],
  "areaServed": [
    { "@type": "Country", "name": "United States" },
    { "@type": "Country", "name": "Canada" },
    { "@type": "Country", "name": "Australia" },
    { "@type": "Country", "name": "New Zealand" },
    { "@type": "Country", "name": "United Kingdom" },
    { "@type": "Country", "name": "Ireland" },
    { "@type": "Country", "name": "Sweden" },
    { "@type": "Country", "name": "Norway" },
    { "@type": "Country", "name": "Denmark" },
    { "@type": "Country", "name": "Finland" },
    { "@type": "Country", "name": "Netherlands" },
    { "@type": "Country", "name": "Belgium" },
    { "@type": "Country", "name": "Germany" },
    { "@type": "Country", "name": "France" },
    { "@type": "Country", "name": "Spain" },
    { "@type": "Country", "name": "Italy" },
    { "@type": "Country", "name": "Poland" },
    { "@type": "Country", "name": "India" },
    { "@type": "Country", "name": "Japan" },
    { "@type": "Country", "name": "South Korea" },
    { "@type": "Country", "name": "Singapore" },
    { "@type": "Country", "name": "United Arab Emirates" },
    { "@type": "Country", "name": "Israel" },
    { "@type": "Country", "name": "Mexico" }
  ],
  "knowsAbout": [
    "Dry cleaning software",
    "Garment care point of sale",
    "Pickup and delivery route management",
    "Conveyor and assembly automation",
    "Metalprogetti integration",
    "Automated payments and autopay",
    "Dry cleaning marketing automation"
  ],
  "sameAs": [
    "https://www.facebook.com/smrtsystems",
    "https://www.linkedin.com/company/smrt-systems/",
    "https://www.instagram.com/smrtsystems/",
    "https://www.youtube.com/channel/UCfW87OTQMfFhI2RLb5uwJYQ"
  ]
}
</script>
```

**Before publishing:** replace `https://smrtsystems.com/logo-512.png` with a real, publicly
reachable square logo of at least 112×112 px. Google will not use an SVG here, so export a
PNG. Confirm `foundingDate` or delete the line — do not guess it.

## 3.2 Sitewide — WebSite *(every page)*

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://smrtsystems.com/#website",
  "url": "https://smrtsystems.com/",
  "name": "SMRT Systems",
  "publisher": { "@id": "https://smrtsystems.com/#organization" },
  "inLanguage": "en-US"
}
</script>
```

No `SearchAction` — the site has no on-site search, and declaring one you do not have is a
misrepresentation.

## 3.3 Sitewide — SoftwareApplication *(every page)*

This is the single most relevant type for the business and it is currently absent.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://smrtsystems.com/#software",
  "name": "SMRT",
  "applicationCategory": "BusinessApplication",
  "applicationSubCategory": "Point of Sale and Business Management Software",
  "operatingSystem": "Web browser, iOS, Android",
  "url": "https://smrtsystems.com/",
  "description": "Cloud point-of-sale and business management software for dry cleaners: order intake, production and assembly tracking, pickup and delivery routing, automated payments, live reporting, and customer marketing in one platform.",
  "publisher": { "@id": "https://smrtsystems.com/#organization" },
  "featureList": [
    "Point of sale for garment care",
    "Pickup and delivery route optimisation",
    "Assembly and conveyor tracking",
    "Automated payments and autopay",
    "Live reporting and analytics",
    "Email and SMS marketing",
    "Metalprogetti equipment integration",
    "Multi-location management"
  ],
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "0",
    "description": "Pricing provided on request. Book a demo for a quote.",
    "url": "https://smrtsystems.com/book-a-demo"
  }
}
</script>
```

**Important:** `"price": "0"` with a description is a placeholder because you do not publish
pricing. If Rich Results Test objects, remove the `offers` block entirely rather than
inventing a price. **Do not add `aggregateRating`** unless you have genuinely collected
ratings on your own site with a visible count — fabricated ratings are a manual-action risk.

## 3.4 Homepage — FAQPage *(only after Fix 6)*

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://smrtsystems.com/#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is SMRT dry cleaning software?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SMRT is a cloud-based POS and business management platform built specifically for dry cleaners. It connects order intake, production, assembly, payments, customer communication, reporting and marketing in one system."
      }
    },
    {
      "@type": "Question",
      "name": "Can SMRT manage pickup and delivery routes?",
      "acceptedAnswer": { "@type": "Answer", "text": "REPLACE WITH THE REAL ANSWER FROM THE PAGE" }
    },
    {
      "@type": "Question",
      "name": "Does SMRT support automated payments and customer billing?",
      "acceptedAnswer": { "@type": "Answer", "text": "REPLACE WITH THE REAL ANSWER FROM THE PAGE" }
    },
    {
      "@type": "Question",
      "name": "Can SMRT integrate with Metalprogetti equipment?",
      "acceptedAnswer": { "@type": "Answer", "text": "REPLACE WITH THE REAL ANSWER FROM THE PAGE" }
    },
    {
      "@type": "Question",
      "name": "Is SMRT suitable for both single-location and multi-location dry cleaners?",
      "acceptedAnswer": { "@type": "Answer", "text": "REPLACE WITH THE REAL ANSWER FROM THE PAGE" }
    }
  ]
}
</script>
```

The answer text in schema **must match the visible page text**. Mismatched FAQ schema is a
manual-action risk, so write the answers on the page first, then copy them in here.

## 3.5 Product/service pages — the seven `/tech/*` pages

Per-page block. Example for `/tech/point-of-sale`; repeat with the values from the table below.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://smrtsystems.com/tech/point-of-sale#webpage",
  "url": "https://smrtsystems.com/tech/point-of-sale",
  "name": "Dry Cleaning Point of Sale Software",
  "isPartOf": { "@id": "https://smrtsystems.com/#website" },
  "about": { "@id": "https://smrtsystems.com/#software" },
  "primaryImageOfPage": "https://smrtsystems.com/og/point-of-sale.png",
  "inLanguage": "en-US",
  "breadcrumb": { "@id": "https://smrtsystems.com/tech/point-of-sale#breadcrumb" },
  "mainEntity": {
    "@type": "Service",
    "name": "SMRT Point of Sale",
    "serviceType": "Dry cleaning point of sale software",
    "provider": { "@id": "https://smrtsystems.com/#organization" },
    "description": "Customizable check-in, garment photos, bulk mark-in and multi-location point of sale built for garment care.",
    "areaServed": { "@id": "https://smrtsystems.com/#organization" }
  }
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": "https://smrtsystems.com/tech/point-of-sale#breadcrumb",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://smrtsystems.com/" },
    { "@type": "ListItem", "position": 2, "name": "Products", "item": "https://smrtsystems.com/tech/point-of-sale" },
    { "@type": "ListItem", "position": 3, "name": "Point of Sale" }
  ]
}
</script>
```

Values for the other six:

| Page | `name` | `serviceType` |
|---|---|---|
| `/tech/pickup-delivery` | Pickup & Delivery Route Software | Dry cleaning delivery route management software |
| `/tech/conveyor-assembly` | Assembly & Conveyor Software | Garment assembly and conveyor automation software |
| `/tech/payments` | Dry Cleaning Payments & Autopay | Payment processing and autopay software |
| `/tech/reporting` | Live Reporting & Analytics | Business reporting and analytics software |
| `/tech/marketing` | Digital Marketing for Dry Cleaners | Marketing automation software |
| `/tech/metalprogetti` | Metalprogetti + SMRT Integration | Conveyor and bagger equipment integration |

Note `/tech/*` has no intermediate index page — `/tech` returns 404. Either create one and use
it as breadcrumb position 2, or point position 2 at the homepage.

## 3.6 `/shop` — Product schema

Add **one block per product**. Only publish this once the store has Terms of Sale, Refund and
Shipping policies, and confirm `availability` and `priceValidUntil` are accurate.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "SMRT Hardware & Accessories",
  "itemListElement": [
    {
      "@type": "Product",
      "name": "SMRT Credit Card Terminal",
      "url": "https://smrtsystems.com/shop",
      "brand": { "@type": "Brand", "name": "SMRT" },
      "category": "Point of sale hardware",
      "offers": {
        "@type": "Offer",
        "price": "300.00",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "seller": { "@id": "https://smrtsystems.com/#organization" }
      }
    },
    {
      "@type": "Product",
      "name": "Heat Seal Machine",
      "url": "https://smrtsystems.com/shop",
      "brand": { "@type": "Brand", "name": "SMRT" },
      "category": "Garment tagging equipment",
      "offers": {
        "@type": "Offer",
        "price": "1050.00",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "seller": { "@id": "https://smrtsystems.com/#organization" }
      }
    },
    {
      "@type": "Product",
      "name": "CAS PD-2Z60 Dual Range POS Scale",
      "url": "https://smrtsystems.com/shop",
      "brand": { "@type": "Brand", "name": "CAS" },
      "category": "Point of sale hardware",
      "offers": {
        "@type": "Offer",
        "price": "600.00",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "seller": { "@id": "https://smrtsystems.com/#organization" }
      }
    },
    {
      "@type": "Product",
      "name": "Epson TM-T20IV Receipt Printer",
      "url": "https://smrtsystems.com/shop",
      "brand": { "@type": "Brand", "name": "Epson" },
      "category": "Receipt printers",
      "offers": {
        "@type": "Offer",
        "price": "230.00",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "seller": { "@id": "https://smrtsystems.com/#organization" }
      }
    }
  ]
}
</script>
```

Add an `image` to each product once the product photos have stable URLs — Google requires an
image for most Product rich results.

## 3.7 Blog post template — BlogPosting

Put this in the **blog post CMS template**, with CMS variables in place of the placeholders.
The data already exists: each post has one `<h1>` and a real `<time datetime>`.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id": "{{page-url}}#post",
  "headline": "{{post-title}}",
  "description": "{{post-excerpt}}",
  "image": "{{post-featured-image}}",
  "datePublished": "{{post-date-iso}}",
  "dateModified": "{{post-updated-iso}}",
  "author": {
    "@type": "Person",
    "name": "{{post-author}}"
  },
  "publisher": { "@id": "https://smrtsystems.com/#organization" },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "{{page-url}}" },
  "inLanguage": "en-US",
  "isPartOf": { "@id": "https://smrtsystems.com/#website" }
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://smrtsystems.com/" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://smrtsystems.com/blogs" },
    { "@type": "ListItem", "position": 3, "name": "{{post-title}}" }
  ]
}
</script>
```

`headline` should stay under 110 characters. If `dateModified` is not tracked, use the same
value as `datePublished` rather than omitting it.

## 3.8 `/blogs` — Blog index

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": "https://smrtsystems.com/blogs#blog",
  "url": "https://smrtsystems.com/blogs",
  "name": "SMRT Blog",
  "description": "Operations, routes, marketing and growth guidance for dry cleaners, from the team behind SMRT Systems.",
  "publisher": { "@id": "https://smrtsystems.com/#organization" },
  "inLanguage": "en-US"
}
</script>
```

## 3.9 `/contact-us` and `/book-a-demo`

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": "https://smrtsystems.com/contact-us#webpage",
  "url": "https://smrtsystems.com/contact-us",
  "name": "Contact SMRT Systems",
  "isPartOf": { "@id": "https://smrtsystems.com/#website" },
  "about": { "@id": "https://smrtsystems.com/#organization" },
  "inLanguage": "en-US"
}
</script>
```

For `/book-a-demo`, use `WebPage` with a `potentialAction`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://smrtsystems.com/book-a-demo#webpage",
  "url": "https://smrtsystems.com/book-a-demo",
  "name": "Book a SMRT Demo",
  "isPartOf": { "@id": "https://smrtsystems.com/#website" },
  "about": { "@id": "https://smrtsystems.com/#software" },
  "inLanguage": "en-US",
  "potentialAction": {
    "@type": "ReserveAction",
    "name": "Book a demo",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://smrtsystems.com/book-a-demo",
      "actionPlatform": [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform"
      ]
    }
  }
}
</script>
```

## 3.10 `/testimonials`

**Do not** mark testimonials up as `Review` or `AggregateRating` attached to your own
`SoftwareApplication` — Google does not allow self-serving review snippets for your own
product, and it risks a manual action. Use a plain `WebPage` instead:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://smrtsystems.com/testimonials#webpage",
  "url": "https://smrtsystems.com/testimonials",
  "name": "Dry Cleaner Reviews & Results",
  "isPartOf": { "@id": "https://smrtsystems.com/#website" },
  "about": { "@id": "https://smrtsystems.com/#software" },
  "inLanguage": "en-US"
}
</script>
```

## 3.11 `/special-services` and `/smrt-marketing/*`

Use the `WebPage` + `Service` pattern from 3.5, with:

| Page | Service name | serviceType |
|---|---|---|
| `/special-services` | Specialty Garment Care Services | Couture, hotel, uniform and restoration garment processing |
| `/smrt-marketing/campaigns` | SMRT Campaigns | Email and SMS marketing automation for dry cleaners |
| `/smrt-marketing/reviews` | SMRT Reviews | Online review generation and management |
| `/smrt-marketing/socials` | SMRT Socials | Managed social media content for dry cleaners |

## Validation checklist

1. Rich Results Test on `/`, one `/tech/*`, one blog post, `/shop`.
2. Schema.org Validator for strict syntax.
3. Search Console → **Enhancements** after a week — watch for FAQ, Breadcrumb, Product reports.
4. Confirm exactly **one** `Organization` and one `WebSite` per page. Duplicate `@id` values
   across blocks will cause conflicts.

---

# Part 4 — Meta titles and descriptions

Your existing 15 non-blog pages are genuinely well written — good length, unique, keyword-led.
The work needed is: fix the 33 duplicates, shorten one, and align a few phrasings to search
demand.

**Conventions:** title ≤ 60 characters, description 140–158, primary keyword in the first 60
characters of the title, one clear differentiator plus an implicit or explicit action in the
description.

## Fix these first — the duplicates and outliers

| Page | Issue | Recommended title | Recommended description |
|---|---|---|---|
| `/shop` | Duplicate homepage metadata | `Dry Cleaning POS Hardware & Accessories \| SMRT` (46) | `Card terminals, heat seal machines, POS scales and receipt printers for dry cleaners. SMRT-compatible hardware, shipped and supported.` (137) |
| `/releasenotes` | Duplicate homepage metadata | `SMRT Product Updates & Release Notes` (36) | `What's new in SMRT: POS, routing, payments, assembly and customer portal improvements, released continuously and documented here.` (130) |
| `/special-services` | 77 chars, "Restoration Job" reads wrong | `Couture, Hotel, Uniform & Restoration Cleaning \| SMRT` (52) | `Run couture, hotel, uniform and restoration work in one system—garment-level billing, RFID tracking, inventory and production without switching tools.` (150) |
| `/tech/metalprogetti` | Only page missing the brand suffix | `Metalprogetti Integration for Dry Cleaners \| SMRT` (49) | `Connect Metalprogetti conveyors, baggers and kiosks to SMRT POS. Rail moves, bagging and dispatch driven from one order record.` (127) |
| 30 blog posts | All share homepage metadata | Bind in template: `{{post-title}} \| SMRT Blog` — truncate post title to 45 chars | Bind to `{{post-excerpt}}`; if empty, fall back to the first 155 characters of body copy |

## Keyword alignment on the pages that are already good

These are working. The changes below are small and aimed at matching how buyers actually
search — "software" and "system" carry commercial intent; feature words alone often do not.

| Page | Current title | Suggested title | Why |
|---|---|---|---|
| `/` | `Dry Cleaning POS & Business Software \| SMRT` | `Dry Cleaning POS & Management Software \| SMRT` (46) | "Management software" has meaningfully more volume than "business software" in this category, and matches the product |
| `/tech/reporting` | `Live Reporting & Analytics \| SMRT` | `Dry Cleaning Reporting & Analytics Software \| SMRT` (50) | Current title has no category term at all — it could be any industry. Add "Dry Cleaning" and "Software" |
| `/tech/conveyor-assembly` | `Assembly & Conveyor Software \| SMRT` | `Garment Assembly & Conveyor Software \| SMRT` (43) | "Garment" qualifies an otherwise generic phrase |
| `/tech/payments` | `Dry Cleaning Payments & Autopay \| SMRT` | Keep | Already strong |
| `/tech/pickup-delivery` | `Pickup & Delivery Route Software \| SMRT` | `Dry Cleaning Pickup & Delivery Software \| SMRT` (46) | Adds the category qualifier; "route" is retained in the description |
| `/tech/point-of-sale` | `Dry Cleaning Point of Sale Software \| SMRT` | Keep | This is the best title on the site |
| `/tech/marketing` | `Digital Marketing for Dry Cleaners \| SMRT` | Keep | Already strong |
| `/book-a-demo` | `Book a SMRT Demo \| Dry Cleaning Software` | Keep | Brand-first is correct for a conversion page |
| `/contact-us` | `Contact SMRT Systems \| Sales & Support` | Keep | Correct |
| `/testimonials` | `Dry Cleaner Reviews & Results \| SMRT` | Keep | Correct |
| `/blogs` | `Dry Cleaning Insights & Guides \| SMRT Blog` | Keep | Correct |
| `/smrt-marketing/*` | All three | Keep | All three are well targeted |

## Keyword coverage gaps

Comparing your metadata against the phrases this market searches, three commercially valuable
terms appear nowhere in any title or description:

1. **"dry cleaning software"** — unqualified, this is the head term for the category. It
   appears in body copy but not in any title. Consider working it into the homepage
   description.
2. **"garment care"** — the industry's own term, and it broadens you beyond "dry cleaning"
   into laundry and wash-and-fold. Worth a page or at least description coverage.
3. **"dry cleaning POS system"** — "system" and "software" are searched differently. Your
   `/tech/point-of-sale` description could carry "system" alongside "software".

Also worth noting: `/tech/reporting`, `/tech/conveyor-assembly` and `/tech/pickup-delivery`
titles currently omit the industry entirely, which makes them compete in far broader, more
expensive search spaces than they need to.

## Before ads launch

1. Fix the 33 duplicate titles and descriptions. **Do this before spending** — paid landing
   pages with duplicate metadata hurt Quality Score and organic simultaneously.
2. Install the sitewide schema, then per-page.
3. Add `og:image` — this affects paid social creative previews as well as organic shares.
4. Fix `/shop`'s viewport before driving any traffic to it. It is currently unusable on mobile,
   and mobile will be most of your paid traffic.
5. Verify blog rendering in Search Console URL Inspection (finding N5).
6. Re-run Rich Results Test and re-submit the sitemap with `<lastmod>`.

---

## What I could not verify

- **What Googlebot actually receives** for blog posts — only Search Console URL Inspection can
  answer that. See N5.
- **Search volume figures** — I have no keyword-tool access from this environment. The keyword
  recommendations above are based on category conventions and commercial-intent patterns, not
  measured volume. Validate in Keyword Planner before committing, especially the homepage
  title change.
- **Whether the 80% testimonial is genuine** — a question for customer marketing.
- **Rendered colour contrast, keyboard order and screen-reader output** — these still need a
  manual browser pass.
- **`foundingDate`** in the Organization schema is a placeholder. Confirm or remove it.
