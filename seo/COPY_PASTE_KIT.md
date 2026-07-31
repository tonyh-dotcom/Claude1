# TSC Wetclean — Copy-Paste Kit (Steps 0–9)
Everything below is ready to paste. Values were verified against the live site crawl (July 30, 2026) and public YouTube data pulled today. The only things you must supply are marked `[FILL IN]` — there are very few.

> **New since the last doc:** I pulled the real publish dates and titles for all 8 episode videos from their public YouTube pages, so the episode schema blocks below are fully pre-filled — no placeholder dates. Video dates: Ep1 Apr 23 2026 · Ep2 Apr 29 · Ep3 May 8 · Ep4 Jun 4 · Ep5 Jun 9 · Ep6 Jun 20 · Ep7 Jul 18 · Ep8 Jul 27, 2026. (Double-check in YouTube Studio if you want; these came from the public watch pages.)

---

## STEP 0 — Fill in these blanks first (10 minutes)

```
0.1 Correct TikTok URL (or "none"):            [FILL IN]
    → Homepage currently links to https://www.tiktok.com/notfound (dead).
0.2 Canonical Instagram handle:                [FILL IN — site uses tscwetcleaners in schema+footer, but tscwetclean also appears]
0.3 I have GBP owner/manager access:           YES / NO — current primary category: [FILL IN]
0.5 /style-guide is: CUSTOMER-FACING / INTERNAL
0.6 /winter-whites is: ACTIVE SERVICE / STALE PROMO
0.7 GSC + Bing already verified:               YES / NO
0.8 Business facts confirmed current:          801 Dundas Street East, Mississauga, ON L4Y 4G9
                                               +1 (905) 896-9313 · info@tscwetclean.com
                                               Mon–Fri 7:00–18:00 · Sat 7:00–16:00 · Sun closed   ✅/✏️
```
*(0.4 — episode dates — is done; see the note above.)*

---

## STEP 1 — Baseline (open these, screenshot/record)

- Google Search Console: https://search.google.com/search-console — verify domain property → Sitemaps → submit: `https://www.tscwetclean.com/sitemap.xml`
- Bing Webmaster Tools: https://www.bing.com/webmasters — "Import from GSC" is the fast path.
- Rich Results Test (screenshot results for each): https://search.google.com/test/rich-results
  - `https://www.tscwetclean.com/`
  - `https://www.tscwetclean.com/contact`
  - `https://www.tscwetclean.com/services`
  - `https://www.tscwetclean.com/episode-1`
- From a local device, search and note your positions: `dry cleaners mississauga` · `laundry pickup and delivery mississauga` · `comforter cleaning mississauga` · `wet cleaning mississauga`

---

## STEP 2 — Brizy Project Settings (2 pastes)

**Site Title (global):**
```
TSC Wetclean | Eco-Friendly Dry Cleaning Alternative in Mississauga
```

**Site Description (global):**
```
Mississauga's eco-friendly alternative to dry cleaning. Wet cleaning, tailoring, wash & fold, and free pickup & delivery across the GTA. Call (905) 896-9313.
```

**Business info fields** (these feed Brizy's auto-schema): street address field = `801 Dundas Street East` only; put `Mississauga`, `ON`, `L4Y 4G9` in their own fields if the UI has them.

---

## STEP 3 — Site-wide schema (1 paste, global)

Paste this entire block into **Project Settings → Code Injection → Header**:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "DryCleaningOrLaundry",
      "@id": "https://www.tscwetclean.com/#local",
      "name": "TSC Wetclean",
      "alternateName": "TSC WETCLEAN",
      "description": "Eco-friendly alternative to dry cleaning in Mississauga. Professional wet cleaning, tailoring and alterations, wash & fold, comforter cleaning, and free pickup & delivery across the Greater Toronto Area.",
      "url": "https://www.tscwetclean.com/",
      "email": "info@tscwetclean.com",
      "telephone": "+1-905-896-9313",
      "image": "https://cloud-1de12d.becdn.net/media/original/87697da45dc571221641ba04b6104f6c.png",
      "logo": "https://cloud-1de12d.becdn.net/media/original/87697da45dc571221641ba04b6104f6c.png",
      "priceRange": "$$",
      "currenciesAccepted": "CAD",
      "hasMap": "https://www.google.com/maps?cid=4905697812649802137",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "801 Dundas Street East",
        "addressLocality": "Mississauga",
        "addressRegion": "ON",
        "postalCode": "L4Y 4G9",
        "addressCountry": "CA"
      },
      "geo": { "@type": "GeoCoordinates", "latitude": 43.5977, "longitude": -79.5981 },
      "openingHoursSpecification": [
        { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "07:00", "closes": "18:00" },
        { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "07:00", "closes": "16:00" }
      ],
      "areaServed": [
        { "@type": "City", "name": "Mississauga" },
        { "@type": "City", "name": "Toronto" },
        { "@type": "City", "name": "Etobicoke" },
        { "@type": "City", "name": "Oakville" },
        { "@type": "City", "name": "Brampton" },
        { "@type": "City", "name": "Burlington" },
        { "@type": "City", "name": "Vaughan" },
        { "@type": "City", "name": "Markham" },
        { "@type": "AdministrativeArea", "name": "Greater Toronto Area" }
      ],
      "sameAs": [
        "https://www.facebook.com/tscwetclean/",
        "https://x.com/DinoTSCWETCLEAN",
        "https://www.linkedin.com/in/konstadin-dino-kantzavelos-b32aa31a",
        "https://www.google.com/maps?cid=4905697812649802137",
        "https://www.youtube.com/user/TSCWetClean",
        "https://www.instagram.com/tscwetcleaners"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://www.tscwetclean.com/#website",
      "url": "https://www.tscwetclean.com/",
      "name": "TSC Wetclean",
      "publisher": { "@id": "https://www.tscwetclean.com/#local" }
    }
  ]
}
</script>
```

**Two edits before saving:**
1. If 0.1 confirmed an active TikTok, add this line inside `sameAs` (with a comma after the Instagram line): `"https://www.tiktok.com/@tscwetclean"` — using whatever the real URL is.
2. If 0.2 says the canonical Instagram is `tscwetclean` (not `tscwetcleaners`), change that line.
3. Optional: `"priceRange": "$$"` is my characterization — change to `"$$$"` or delete the line if you prefer.

**Then:** open the **Contact** page's per-page code injection and DELETE the old `@graph` block there (the one containing `DryCleaningOrLaundry` and `#pickup-delivery`) — it's now duplicated by the global block. Keep a copy in a note until validation passes.

---

## STEP 4 — Link fixes (find & replace)

| Where | Old | New |
|---|---|---|
| Homepage social icons | `https://www.tiktok.com/notfound` | Real TikTok URL from 0.1, or delete the icon |
| Anywhere | `https://www.instagram.com/tscwetclean/?hl=en` and/or `https://www.instagram.com/tscwetcleaners/#` | One canonical: `https://www.instagram.com/[HANDLE FROM 0.2]` |

After publishing: view page source, Ctrl-F `notfound` → expect 0 results.

---

## STEP 5 — Page-by-page (Page Settings → SEO tab; H1 = change the heading element's tag on canvas)

### / (Homepage)
Title:
```
Eco-Friendly Dry Cleaners in Mississauga | TSC Wetclean
```
Description:
```
Mississauga's eco-friendly alternative to dry cleaning. Expert wet cleaning, tailoring & free GTA pickup & delivery. 35+ years of garment care.
```
H1 (replace text of existing H1 "Welcome to TSC WETCLEAN"):
```
Mississauga's Eco-Friendly Alternative to Dry Cleaning
```

### /services
Title:
```
Dry Cleaning & Laundry Services in Mississauga | TSC Wetclean
```
Description:
```
Wet cleaning, delicates, tailoring & alterations, comforter cleaning, wash & fold, and free pickup & delivery across Mississauga & the GTA.
```
H1 (change "OUR SERVICES" from H2 to H1; optionally retext):
```
Our Garment Care Services
```

### /wetcleaning
Title:
```
What Is Wet Cleaning? Safe for "Dry Clean Only" | TSC Wetclean
```
Description:
```
Modern wet cleaning safely cleans wool, silk, cashmere & "dry clean only" garments—no toxic solvents. See why it beats traditional dry cleaning.
```
H1:
```
Professional Wet Cleaning for Delicate & Fine Fabrics
```

### /pickup-and-delivery
Title:
```
Free Laundry Pickup & Delivery in Mississauga & GTA
```
Description:
```
Free scheduled pickup & delivery for dry cleaning and laundry across Mississauga, Toronto, Oakville & the GTA. Set preferences once—we do the rest.
```
H1:
```
Free Laundry & Dry Cleaning Pickup & Delivery
```

### /laundry-subscription  ⚠️ current description is about bespoke tailoring — wrong page
Title:
```
Wash & Fold Laundry Subscription | Mississauga & GTA
```
Description:
```
Fill your bag, we handle the rest. Personalized wash & fold subscription with free pickup & delivery in Mississauga and the GTA.
```
H1 (page has no heading — add one):
```
Wash & Fold Laundry Subscription
```

### /comforter
Title:
```
Comforter, Duvet & Blanket Cleaning | Mississauga & GTA
```
Description:
```
Deep, gentle cleaning for comforters, duvets, blankets & household textiles. Careful drying and finishing—free pickup & delivery available.
```
H1:
```
Comforter, Blanket & Duvet Cleaning
```

### /contact
Title:
```
Contact | Dry Cleaners in Mississauga | TSC Wetclean
```
Description:
```
Visit us at 801 Dundas St E, Mississauga, call (905) 896-9313, or book free GTA pickup & delivery. Open Mon–Fri 7–6, Sat 7–4.
```
H1: already exists ("CONTACT US") — no change.

### /hollywood
Title:
```
Hollywood Garment Care | Studio-Grade Cleaning | TSC
```
Description:
```
25+ years cleaning for film & TV productions. Studio-grade finishing with discreet handling—now available for your finest garments.
```
H1:
```
Hollywood-Grade Garment Care
```

### /bespoke-custom-tailoring
Title: **keep current.** Description — trimmed version of the current one:
```
Bespoke tailoring in Canada year-round with Maxwell's Clothiers—custom suits and shirts from exclusive English & Italian fabrics, backed by TSC Wetclean's garment care.
```
H1 (promote existing "Bespoke Custom Suits & Shirts!" from H2):
```
Bespoke Custom Suits & Shirts
```

### /about-bespoke
Title:
```
Why Choose TSC for Bespoke Tailoring | TSC Wetclean
```
Description:
```
The TSC–Maxwell's bespoke partnership: precision fit, exclusive fabrics, and a lifetime maintenance guarantee on every garment we craft.
```
H1 (promote "Why US"):
```
Why Choose Us for Bespoke
```

### /about — Title & Description: **keep** (already localized). H1: promote "ABOUT US" from H2 to H1.

### /tsc-wetclean — Title & Description: **keep.** H1 (promote "ABOUT US" and retext):
```
Our Process & Clean Care Standards
```

### /book-an-appointment
Title:
```
Book an Appointment | TSC Wetclean Mississauga
```
Description:
```
Book garment care, tailoring fittings, or pickup & delivery online. Fast confirmation from Mississauga's eco-friendly cleaner.
```
H1 (promote existing "Book an Appointment").

### /blog
Title:
```
Garment Care Tips & News | TSC Wetclean Blog
```
Description:
```
Garment care tips from 35+ years of professional cleaning—stain advice, fabric care, and our "60 Seconds with Your Cleaner" video series.
```
H1 (page has no headings — add):
```
Garment Care Tips & News
```

### /updates — Title & Description: **keep.** Add H1:
```
Updates & Announcements
```

### /winter-whites — per 0.6:
- If **stale promo** → Page Settings → turn Search Visibility OFF (adds noindex). Done.
- If **active** → Title:
```
Winter Whites Cleaning & Storage | TSC Wetclean
```
Description — write one sentence from the page's actual offer, ending with `Mississauga & GTA pickup & delivery available.`

### /style-guide — per 0.5: if INTERNAL → Search Visibility OFF. If customer-facing, ask me for a rewrite pass.

### Episodes 1–3 — Titles/Descriptions: **keep** (already good). H1: on each page change the H2 "60 Seconds with your Cleaner" to H1. Schema: replace with the blocks in Step 6 (fixes the fake 2025-01-01 dates).

### /60-seconds-with-your-cleaner-episode-4
Title:
```
Why Garment Finishing Matters | 60 Seconds with Your Cleaner Ep. 4
```
Description:
```
Most people think the value of garment care is the cleaning. Dino from TSC WetClean explains why finishing—pressing, conditioning, restoring—is the real story. Mississauga eco-friendly wet cleaning.
```

### /60-seconds-with-your-cleaner-episode-5
Title:
```
The Sustainable Wardrobe: Curation Over Consumption | Ep. 5
```
Description:
```
Building a sustainable wardrobe doesn't mean throwing everything out and starting over. Dino from TSC WetClean shares how curation beats consumption. Mississauga eco-friendly wet cleaning.
```

### /60-seconds-with-your-cleaner-episode-6  ⚠️ page copy is a duplicate of Ep. 5's — watch the video (b0N0JdiucKw) and adjust the topic phrase
Title (safe until verified):
```
60 Seconds with Your Cleaner – Episode 6 | TSC WetClean
```
Description:
```
[ONE SENTENCE ON THE EPISODE'S ACTUAL TOPIC — watch youtu.be/b0N0JdiucKw]. Mississauga eco-friendly wet cleaning.
```

### /60-seconds-with-your-cleaner-episode-7  (verify framing against youtu.be/a-IDbL6d51A)
Title:
```
AI Can't Press a Suit: Garment Care Stays Human | Ep. 7
```
Description:
```
AI can write emails and automate workflows—but expert garment care is still human craft. Dino from TSC WetClean explains why. Mississauga eco-friendly wet cleaning.
```

### /60-seconds-with-your-cleaner-episode-8
Title:
```
The Dirty Secret on Your Bed: Comforter Care | Ep. 8
```
Description:
```
Let's talk about the dirty little secret lying on your bed. Dino from TSC WetClean on why comforters and bedding need professional cleaning. Mississauga eco-friendly wet cleaning.
```

**og:image for episodes 4–8** (Social tab — download and upload, or paste the URL if Brizy accepts external images):
```
https://img.youtube.com/vi/1YwGFaGtHT8/maxresdefault.jpg   ← Ep. 4
https://img.youtube.com/vi/hWsCSvk-DCU/maxresdefault.jpg   ← Ep. 5
https://img.youtube.com/vi/b0N0JdiucKw/maxresdefault.jpg   ← Ep. 6
https://img.youtube.com/vi/a-IDbL6d51A/maxresdefault.jpg   ← Ep. 7
https://img.youtube.com/vi/HS-d6RvBlWM/maxresdefault.jpg   ← Ep. 8
```
(All eight thumbnail URLs verified live today.)

---

## STEP 6 — Episode schema (one paste per episode page, into that page's per-page head code injection)

These replace the existing blocks on episodes 1–3 (their `uploadDate: 2025-01-01` was a placeholder) and add new ones on 4–8. Dates below are the videos' real YouTube publish dates.

### /episode-1 — REPLACE existing block
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "The Hidden Stains You Might Be Missing: A 60-Second Tip from Your Cleaner",
  "description": "TSC WetClean's Dino explains why turning your clothes inside out before cleaning treats hidden sweat, skin oils, and dry skin buildup that cause long-term fabric damage.",
  "datePublished": "2026-04-23",
  "author": { "@type": "Person", "name": "Dino Kantzavelos", "url": "https://www.linkedin.com/in/konstadin-dino-kantzavelos-b32aa31a" },
  "publisher": { "@id": "https://www.tscwetclean.com/#local" },
  "image": "https://img.youtube.com/vi/HW98XPlgQoI/maxresdefault.jpg",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.tscwetclean.com/episode-1" },
  "video": {
    "@type": "VideoObject",
    "name": "The Hidden Stains You Might Be Missing",
    "description": "Dino from TSC WetClean shares a garment care tip about hidden stains caused by sweat, skin oils, and dry skin.",
    "embedUrl": "https://www.youtube.com/embed/HW98XPlgQoI",
    "thumbnailUrl": "https://img.youtube.com/vi/HW98XPlgQoI/maxresdefault.jpg",
    "uploadDate": "2026-04-23"
  }
}
</script>
```

### /episode-2 — REPLACE existing block
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "The Secret to Affordable Garment Care? It's in the Hangers",
  "description": "Dino from TSC WetClean explains how reusable premium hangers replace single-use wire hangers, keeping garment care affordable and eco-friendly for customers in Mississauga.",
  "datePublished": "2026-04-29",
  "author": { "@type": "Person", "name": "Dino Kantzavelos", "url": "https://www.linkedin.com/in/konstadin-dino-kantzavelos-b32aa31a" },
  "publisher": { "@id": "https://www.tscwetclean.com/#local" },
  "image": "https://img.youtube.com/vi/HaJ4AftTcdQ/maxresdefault.jpg",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.tscwetclean.com/episode-2" },
  "video": {
    "@type": "VideoObject",
    "name": "The Secret to Affordable Garment Care? It's in the Hangers",
    "description": "Dino from TSC WetClean shares how reusable premium hangers reduce operating costs and keep dry cleaning affordable.",
    "embedUrl": "https://www.youtube.com/embed/HaJ4AftTcdQ",
    "thumbnailUrl": "https://img.youtube.com/vi/HaJ4AftTcdQ/maxresdefault.jpg",
    "uploadDate": "2026-04-29"
  }
}
</script>
```

### /episode-3 — REPLACE existing block
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Can You Trust Water With a $7,000 Suit?",
  "description": "Dino from TSC WetClean explains why modern wet cleaning is safe for Dry Clean Only luxury garments, using controlled water, temperature, agitation, and hand pressing to restore garment structure.",
  "datePublished": "2026-05-08",
  "author": { "@type": "Person", "name": "Dino Kantzavelos", "url": "https://www.linkedin.com/in/konstadin-dino-kantzavelos-b32aa31a" },
  "publisher": { "@id": "https://www.tscwetclean.com/#local" },
  "image": "https://img.youtube.com/vi/bqMOEB_VhDc/maxresdefault.jpg",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.tscwetclean.com/episode-3" },
  "video": {
    "@type": "VideoObject",
    "name": "Can You Trust Water With a $7,000 Suit?",
    "description": "Dino from TSC WetClean explains how modern wet cleaning safely handles luxury Dry Clean Only garments using controlled processes and hand pressing.",
    "embedUrl": "https://www.youtube.com/embed/bqMOEB_VhDc",
    "thumbnailUrl": "https://img.youtube.com/vi/bqMOEB_VhDc/maxresdefault.jpg",
    "uploadDate": "2026-05-08"
  }
}
</script>
```

### /60-seconds-with-your-cleaner-episode-4 — ADD
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Why Garment Finishing Matters",
  "description": "Most people think the value of garment care is the cleaning. Dino from TSC WetClean explains why finishing—pressing, conditioning, restoring—is the real story.",
  "datePublished": "2026-06-04",
  "author": { "@type": "Person", "name": "Dino Kantzavelos", "url": "https://www.linkedin.com/in/konstadin-dino-kantzavelos-b32aa31a" },
  "publisher": { "@id": "https://www.tscwetclean.com/#local" },
  "image": "https://img.youtube.com/vi/1YwGFaGtHT8/maxresdefault.jpg",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.tscwetclean.com/60-seconds-with-your-cleaner-episode-4" },
  "video": {
    "@type": "VideoObject",
    "name": "60 Seconds with Your Cleaner - Episode 4",
    "description": "Dino from TSC WetClean explains why the real value of professional garment care is in the finishing: pressing, conditioning, and restoring.",
    "embedUrl": "https://www.youtube.com/embed/1YwGFaGtHT8",
    "thumbnailUrl": "https://img.youtube.com/vi/1YwGFaGtHT8/maxresdefault.jpg",
    "uploadDate": "2026-06-04"
  }
}
</script>
```

### /60-seconds-with-your-cleaner-episode-5 — ADD
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "The Sustainable Wardrobe: Curation Over Consumption",
  "description": "Building a sustainable wardrobe doesn't mean throwing everything out and starting over. Dino from TSC WetClean shares how curation beats consumption.",
  "datePublished": "2026-06-09",
  "author": { "@type": "Person", "name": "Dino Kantzavelos", "url": "https://www.linkedin.com/in/konstadin-dino-kantzavelos-b32aa31a" },
  "publisher": { "@id": "https://www.tscwetclean.com/#local" },
  "image": "https://img.youtube.com/vi/hWsCSvk-DCU/maxresdefault.jpg",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.tscwetclean.com/60-seconds-with-your-cleaner-episode-5" },
  "video": {
    "@type": "VideoObject",
    "name": "60 Seconds with Your Cleaner - Episode 5",
    "description": "Dino from TSC WetClean on building a sustainable wardrobe through curation rather than consumption.",
    "embedUrl": "https://www.youtube.com/embed/hWsCSvk-DCU",
    "thumbnailUrl": "https://img.youtube.com/vi/hWsCSvk-DCU/maxresdefault.jpg",
    "uploadDate": "2026-06-09"
  }
}
</script>
```

### /60-seconds-with-your-cleaner-episode-6 — ADD ⚠️ replace the two `[TOPIC…]` fields after watching youtu.be/b0N0JdiucKw
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "[TOPIC OF EPISODE 6]",
  "description": "[ONE SENTENCE ON EPISODE 6'S TOPIC]. From TSC WetClean's 60 Seconds with Your Cleaner series.",
  "datePublished": "2026-06-20",
  "author": { "@type": "Person", "name": "Dino Kantzavelos", "url": "https://www.linkedin.com/in/konstadin-dino-kantzavelos-b32aa31a" },
  "publisher": { "@id": "https://www.tscwetclean.com/#local" },
  "image": "https://img.youtube.com/vi/b0N0JdiucKw/maxresdefault.jpg",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.tscwetclean.com/60-seconds-with-your-cleaner-episode-6" },
  "video": {
    "@type": "VideoObject",
    "name": "60 Seconds With Your Cleaner - Episode 6",
    "description": "[ONE SENTENCE ON EPISODE 6'S TOPIC]",
    "embedUrl": "https://www.youtube.com/embed/b0N0JdiucKw",
    "thumbnailUrl": "https://img.youtube.com/vi/b0N0JdiucKw/maxresdefault.jpg",
    "uploadDate": "2026-06-20"
  }
}
</script>
```

### /60-seconds-with-your-cleaner-episode-7 — ADD
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "AI Can't Press a Suit: Why Garment Care Stays Human",
  "description": "AI can write emails and automate workflows—but expert garment care is still human craft. Dino from TSC WetClean explains why.",
  "datePublished": "2026-07-18",
  "author": { "@type": "Person", "name": "Dino Kantzavelos", "url": "https://www.linkedin.com/in/konstadin-dino-kantzavelos-b32aa31a" },
  "publisher": { "@id": "https://www.tscwetclean.com/#local" },
  "image": "https://img.youtube.com/vi/a-IDbL6d51A/maxresdefault.jpg",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.tscwetclean.com/60-seconds-with-your-cleaner-episode-7" },
  "video": {
    "@type": "VideoObject",
    "name": "60 Seconds With Your Cleaner - Episode 7",
    "description": "Dino from TSC WetClean on why expert garment care remains human craft in the age of AI.",
    "embedUrl": "https://www.youtube.com/embed/a-IDbL6d51A",
    "thumbnailUrl": "https://img.youtube.com/vi/a-IDbL6d51A/maxresdefault.jpg",
    "uploadDate": "2026-07-18"
  }
}
</script>
```

### /60-seconds-with-your-cleaner-episode-8 — ADD
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "The Dirty Secret on Your Bed: Why Comforters Need Professional Cleaning",
  "description": "Let's talk about the dirty little secret lying on your bed. Dino from TSC WetClean on why comforters and bedding need professional cleaning.",
  "datePublished": "2026-07-27",
  "author": { "@type": "Person", "name": "Dino Kantzavelos", "url": "https://www.linkedin.com/in/konstadin-dino-kantzavelos-b32aa31a" },
  "publisher": { "@id": "https://www.tscwetclean.com/#local" },
  "image": "https://img.youtube.com/vi/HS-d6RvBlWM/maxresdefault.jpg",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.tscwetclean.com/60-seconds-with-your-cleaner-episode-8" },
  "video": {
    "@type": "VideoObject",
    "name": "TSC 60 Seconds Episode 8",
    "description": "Dino from TSC WetClean on the dirty little secret lying on your bed—and why bedding needs professional cleaning.",
    "embedUrl": "https://www.youtube.com/embed/HS-d6RvBlWM",
    "thumbnailUrl": "https://img.youtube.com/vi/HS-d6RvBlWM/maxresdefault.jpg",
    "uploadDate": "2026-07-27"
  }
}
</script>
```

---

## STEP 7 — FAQs: add VISIBLE text first, then the matching schema

**Rule: the schema text must match the visible on-page text exactly. Fill the `[…]` placeholders with your real policies in BOTH places — never publish the schema without the visible FAQ.**

### 7a. /wetcleaning — visible FAQ copy (paste into a new accordion/section):
```
Q: Can you clean garments labelled "dry clean only"?
A: Yes. Modern wet cleaning uses precisely controlled water temperature, gentle detergents, and hand pressing to safely clean most garments labelled dry clean only — including luxury suits.

Q: Is wet cleaning safe for wool, silk, and cashmere?
A: Yes. Wet cleaning is designed for delicate and fine fabrics, with controlled agitation and careful finishing to protect fabric structure.

Q: How is wet cleaning different from traditional dry cleaning?
A: Dry cleaning uses chemical solvents. Wet cleaning uses water with computer-controlled temperature, agitation, and biodegradable detergents — an eco-friendly process that's gentle on fabrics and the planet.
```
Then paste into the page's head code injection:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Can you clean garments labelled \"dry clean only\"?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. Modern wet cleaning uses precisely controlled water temperature, gentle detergents, and hand pressing to safely clean most garments labelled dry clean only — including luxury suits." } },
    { "@type": "Question", "name": "Is wet cleaning safe for wool, silk, and cashmere?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes. Wet cleaning is designed for delicate and fine fabrics, with controlled agitation and careful finishing to protect fabric structure." } },
    { "@type": "Question", "name": "How is wet cleaning different from traditional dry cleaning?",
      "acceptedAnswer": { "@type": "Answer", "text": "Dry cleaning uses chemical solvents. Wet cleaning uses water with computer-controlled temperature, agitation, and biodegradable detergents — an eco-friendly process that's gentle on fabrics and the planet." } }
  ]
}
</script>
```

### 7b. /pickup-and-delivery — visible FAQ copy (fill the 2 placeholders, then mirror into schema):
```
Q: Which areas do you pick up and deliver in?
A: We serve Mississauga and the Greater Toronto Area, including Toronto, Etobicoke, Oakville, Brampton, Burlington, Vaughan, and Markham.

Q: How much does pickup and delivery cost?
A: Pickup and delivery is free. You only pay for the cleaning.

Q: How do I schedule a pickup?
A: [YOUR REAL PROCESS — e.g. book online, call (905) 896-9313, or use the customer app.]

Q: How long does it take?
A: [YOUR REAL TURNAROUND TIME]
```
Matching schema (edit the two bracketed answers to match what you wrote above, then paste):
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Which areas do you pick up and deliver in?",
      "acceptedAnswer": { "@type": "Answer", "text": "We serve Mississauga and the Greater Toronto Area, including Toronto, Etobicoke, Oakville, Brampton, Burlington, Vaughan, and Markham." } },
    { "@type": "Question", "name": "How much does pickup and delivery cost?",
      "acceptedAnswer": { "@type": "Answer", "text": "Pickup and delivery is free. You only pay for the cleaning." } },
    { "@type": "Question", "name": "How do I schedule a pickup?",
      "acceptedAnswer": { "@type": "Answer", "text": "[SAME TEXT AS ON PAGE]" } },
    { "@type": "Question", "name": "How long does it take?",
      "acceptedAnswer": { "@type": "Answer", "text": "[SAME TEXT AS ON PAGE]" } }
  ]
}
</script>
```

### 7c. /comforter — same pattern. Suggested visible questions (write answers from your real policies):
```
Q: Do you clean all sizes of comforters and duvets?      A: [FILL IN]
Q: Blankets, comforters and duvets are excluded from the wash & fold subscription — how are they priced?   A: [FILL IN]
Q: How long does comforter cleaning take?                A: [FILL IN]
```
Once the answers are written, mirror them into a FAQPage block using the same format as 7a/7b.

---

## STEP 8 — Cleanup (15 minutes)

1. **Alt text:** All 11 missing alts on `/blog` (3) and `/updates` (8) are the **same repeated episode-card thumbnail**. Select each card image and set alt:
```
60 Seconds with Your Cleaner — garment care video series by TSC WetClean
```
2. **/style-guide:** if 0.5 = INTERNAL → Page Settings → Search Visibility OFF.
3. **/winter-whites:** if 0.6 = STALE → Search Visibility OFF.
4. Do **not** rename any URLs.

---

## STEP 9 — Local SEO (GBP, citations, reviews)

### 9a. Google Business Profile (business.google.com)
- Primary category: `Dry cleaner` · Secondary: `Laundry service`, `Clothing alteration service`
- Hours: `Mon–Fri 7:00 AM–6:00 PM · Sat 7:00 AM–4:00 PM · Sun Closed`
- Website: `https://www.tscwetclean.com/` · Appointments: `https://www.tscwetclean.com/book-an-appointment`
- **Business description (paste — 646 chars, limit is 750):**
```
TSC Wetclean is Mississauga's eco-friendly alternative to traditional dry cleaning. For over 35 years we've cared for everything from everyday wear to luxury "dry clean only" garments using modern wet cleaning: controlled water temperature, biodegradable detergents, and expert hand finishing — no harsh solvents. Services include wet cleaning, delicates and fine fabrics, bespoke tailoring and alterations, wash & fold subscription, comforter and household cleaning, and free pickup & delivery across Mississauga and the GTA. Our team has also provided studio-grade garment care for film and television productions for more than 25 years.
```
- **Services list (add each):**
```
Wet cleaning
Delicates & fine fabric care
Tailoring & alterations
Bespoke custom suits & shirts
Wash & fold laundry subscription
Comforter, duvet & blanket cleaning
Free pickup & delivery
```
- **Monthly posts:** share each episode video with 2–3 sentences + link to its page. (8 ready-made posts.)

### 9b. Citations — use this NAP block verbatim everywhere:
```
TSC Wetclean
801 Dundas Street East, Mississauga, ON L4Y 4G9
(905) 896-9313
info@tscwetclean.com
https://www.tscwetclean.com/
Mon–Fri 7:00 AM–6:00 PM · Sat 7:00 AM–4:00 PM · Sun Closed
```
Create/claim listings at: https://biz.yelp.ca · https://business.yellowpages.ca · https://411.ca · https://www.bbb.org/get-accredited (or free profile) · https://businessconnect.apple.com · https://www.bingplaces.com · your Facebook page's About section.

### 9c. Review requests
Get your short review link first: GBP dashboard → "Ask for reviews" (don't guess the URL).

**SMS/receipt text:**
```
Thanks for choosing TSC Wetclean! If you were happy with your garment care, a quick Google review helps our small business a lot: [YOUR GBP REVIEW LINK]
```
**Email footer / pickup-confirmation line:**
```
Happy with your clean? Leave us a quick Google review — it takes 30 seconds and means the world to our team: [YOUR GBP REVIEW LINK]
```
⚠️ Do NOT add star-rating (AggregateRating) schema to the site until reviews are visibly embedded on a page.

---

## After each step: validate
Paste the changed page's URL into https://search.google.com/test/rich-results — fix any errors before moving to the next step. When Steps 2–6 are done, expect: one DryCleaningOrLaundry entity site-wide, Article+Video on all 8 episodes, FAQ on the pages from Step 7.
