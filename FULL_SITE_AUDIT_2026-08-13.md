# SMRT Website — Full Site Audit

**Site:** https://smrtsystems.com/
**Scanned:** 2026-08-13 — all 49 pages, 5,373 anchors, 2,668 images, 4,064 headings
**Scope:** everything except the link breakage and the RAM/GPU work already documented separately

Findings are ordered by what they cost you. Two are legal exposure, one is a security and
trust problem I would treat as urgent, and the SEO section contains a defect affecting
34 of your 49 pages that no single-page tool would ever surface.

---

## Summary

| # | Finding | Scale | Severity |
|---|---|---|---|
| 1 | No privacy policy, terms, or cookie notice — while running four trackers | 49/49 pages | **P0 legal** |
| 2 | 270 MB `.exe` download labelled "TEAMVIEWER" from a `/tests/` bucket | 49/49 pages | **P0 security/trust** |
| 3 | Unsubstantiated "grew our business by 80%" testimonial | Homepage | **P0 legal** |
| 4 | "10,397,124 Satisfied Customers" — not a credible figure | Homepage | **P0 credibility** |
| 5 | All 34 blog pages share one identical title and meta description | 34/49 pages | **P0 SEO** |
| 6 | Four of five FAQ answers are empty in the DOM | Homepage | P1 content |
| 7 | Zero structured data sitewide | 49/49 | P1 SEO |
| 8 | `og:image` absent while `twitter:card=summary_large_image` is declared | 49/49 | P1 SEO |
| 9 | 2,592 of 2,668 images have no `alt` | 97% | P1 accessibility |
| 10 | No `lang` attribute | 49/49 | P1 accessibility |
| 11 | 778 `<h5>` elements are buttons and nav, not headings | 49/49 | P1 semantics |
| 12 | Multiple `<h1>` per page; homepage has six | 16 pages | P1 SEO |
| 13 | Split-text joins lose spaces — "DryCleaning", "Ecosystem.Built" | Homepage | P1 |
| 14 | Brand written "SMrt" | /tech/metalprogetti | P2 copy |
| 15 | One headline appears in three different casings | Sitewide | P2 copy |
| 16 | Six different labels for the same conversion action | Sitewide | P2 copy |
| 17 | Blog slug typo, and slug does not match the title | 1 post | P2 SEO |
| 18 | 24 of 33 blog posts predate 2024 | 73% | P2 content |
| 19 | Address, copyright and date-label formatting | Sitewide | P2 copy |
| 20 | Viewport missing `initial-scale=1` | 49/49 | P2 mobile |
| 21 | 404 page is branded "Framer" | Sitewide | P2 brand |

---

# P0 — Legal and trust

## 1. No privacy policy, no terms, no cookie notice — with four trackers running

I searched all 49 pages for the words *privacy, terms, cookie, GDPR, CCPA, legal,
do-not-sell, accessibility statement, DPA, sub-processor*. **Every one returns zero matches.**
There is no such link anywhere on the site, in the footer or otherwise.

Meanwhile, running on **all 49 pages**:

| Tracker | Pages |
|---|---|
| Google Tag Manager | 49 |
| gtag.js | 49 |
| Google Ads conversion (`AW-11131488593`) | 49 |
| LinkedIn | 49 |

And I found **no consent-management platform of any kind** — no Cookiebot, OneTrust, Osano,
Termly, Iubenda, Klaro, or Framer's own cookie banner.

Why this is more than a checkbox: your own footer advertises an **EMEA sales line (+46,
Sweden)** and an **AU sales line**, and the site captures leads through a demo form. That is
personal-data collection from EU and Australian visitors, with advertising and analytics
cookies set **before** any consent, and no published privacy notice. Under GDPR and the
ePrivacy Directive that is the straightforward version of the violation, not a marginal one.

**Fix:**

1. Publish a Privacy Policy and Terms of Service, and link both in the footer sitewide.
2. Add a consent banner that blocks GTM, gtag, Google Ads and LinkedIn until the visitor
   opts in. Framer has a built-in banner; a CMP is better given you have EU traffic.
3. Add a consent checkbox and a privacy-notice link at the point of collection on the demo
   form.
4. Given California traffic, add a "Do Not Sell or Share My Personal Information" link.

This is the single largest liability on the site and it is also among the cheapest to fix.

## 2. A 270 MB executable in the footer of every page, labelled "TEAMVIEWER"

The footer link reading **TEAMVIEWER** — on all 49 pages, 98 anchor instances, `target="_blank"` —
points to:

```
https://smrt-releases.s3.amazonaws.com/tests/SMRT-Tool-Portable-0.3.0-x64.exe
```

Verified live:

| Property | Value |
|---|---|
| HTTP status | 200, publicly downloadable |
| `Content-Length` | **282,803,960 bytes (270 MB)** |
| `Content-Type` | `application/octet-stream` |
| Last modified | 2026-05-28 |
| Path segment | **`/tests/`** |
| Version | **0.3.0** |

Five separate problems stack up:

1. **The label does not match the file.** It says TeamViewer — a well-known third-party
   remote-support product — and delivers `SMRT-Tool-Portable`. That is a third-party
   trademark on a link to your own binary.
2. **It is served from a `/tests/` path** at version `0.3.0`. That is the URL of a test
   build, not a vetted release artifact.
3. **A 270 MB download starts with no warning** — no file size, no format, no confirmation.
4. **An unexpected `.exe` from an unfamiliar S3 bucket is exactly the shape of a malware
   delivery**, and it behaves that way to SmartScreen, corporate proxies and endpoint
   security. Some visitors will get a scary warning; some networks will block your domain.
5. **A public marketing footer is the wrong place for a support tool** at all.

**Fix:** remove the link from the footer today. If customers genuinely need a remote-support
tool, put it behind the authenticated support portal, serve it from a domain you control,
sign the binary, label it with its real name and size, and point it at a released version
rather than `/tests/`.

## 3. The 80% growth testimonial still has no substantiation

Unchanged from the pre-launch audit and still live on the homepage:

> "SMRT grew our business by 80%, and our customers genuinely love how easy everything is.
> After 10 years, we still wouldn't run our business without it."
> — Sarah Mitchell, Park Avenue Cleaners

Two things still make it stand out.

**It is formatted unlike every other testimonial.** The other eight on the homepage attribute
as `Elton Cerda / Owner · Dry Clean NYC`, `Eric D.`, `Harry B.`, `Phyllis F.`, `Gary M.`,
`Chad E. / Town & Country Cleaners – FL`, `Jason Y.` — first name plus last initial, which is
how genuinely collected reviews read. This one is a full name plus a full business name,
which is how template placeholder copy reads.

**It carries a quantified performance claim.** "Grew our business by 80%" is precisely what
the FTC Endorsement Guides require substantiation for, plus either evidence it reflects
typical results or a disclosure that it does not.

**Fix:** confirm Sarah Mitchell and Park Avenue Cleaners are a real, consenting customer and
that the 80% figure is documented. If so, keep it and add a typicality qualifier. If it is
template text, replace it with one of the eight verified quotes already on the page. Do not
launch a homepage with an unverified quantified claim.

## 4. "10,397,124 Satisfied Customers"

Still live. SMRT sells to dry-cleaning businesses; ten million satisfied *customers* is not a
credible reading of that number. It is almost certainly garments tracked, orders processed,
or end-consumers served across all customer plants — but the label says customers.

An implausible number does the opposite of what a proof point is for. Any prospect who does
the arithmetic discounts everything else on the page.

**Fix:** relabel to what the figure actually measures — "Garments tracked", "Orders
processed", "Customer notifications sent". Confirm the number with whoever owns the data and
consider an as-of date.

---

# P0 — SEO

## 5. All 34 blog pages share one identical title and meta description

This is the biggest technical SEO defect on the site, and no single-page tool will show it —
Lighthouse scored SEO 100 because it only ever looks at one page.

| | Value | Pages |
|---|---|---|
| `<title>` | `Dry Cleaning POS & Business Software \| SMRT` | **34** |
| `<meta description>` | `Cloud POS, routes, payments, assembly, and marketing built for dry cleaners…` | **34** |

That is the homepage's metadata, copied onto the blog index and all 33 posts. So a post
titled *"What Your Customers Want (From Their Perspective, Not Ours)"* tells Google it is
called *"Dry Cleaning POS & Business Software | SMRT"*.

Consequences: those 34 pages compete with each other and with the homepage for the same
phrase; none can rank for its own topic; and search results show the same meaningless title
and snippet for every one, which destroys click-through.

**The good news:** the other 15 pages have genuinely well-written, unique titles and
descriptions. Whoever wrote those did a good job — the blog template simply never got the
same treatment.

**Fix:** in the Framer CMS blog collection, bind the SEO title and description fields to the
post's own title and excerpt rather than the site defaults. This is a template-level change
that fixes all 34 at once.

Two smaller title issues:

- `/special-services` — 77 characters, will truncate in search results, and reads awkwardly:
  *"Couture Dry Cleaning, Hotel, Uniform & Restoration Job in one platform | SMRT"*.
  "Restoration Job" should be plural, and the phrase needs restructuring. Aim for under 60.
- `/tech/metalprogetti` — *"Metalprogetti + SMRT Integration"* is the only page missing the
  `| SMRT` suffix every other page uses.

---

# P1 — Content and SEO structure

## 6. Four of the five homepage FAQ answers are empty

The pre-launch audit suspected this. **Now confirmed** — I measured the text between each
question and the next:

| Question | Answer text in the DOM |
|---|---|
| What is SMRT dry cleaning software? | 238 characters |
| Can SMRT manage pickup and delivery routes? | **0 characters** |
| Does SMRT support automated payments and customer billing? | **0 characters** |
| Can SMRT integrate with Metalprogetti equipment? | **0 characters** |
| Is SMRT suitable for both single- and multi-location dry cleaners? | **0 characters** |

They are not lazy-mounted — there is no content to mount. A visitor who clicks any of the
last four gets a blank panel.

**Fix:** write the four answers. Then add FAQPage schema (see below) — with real answers this
is the easiest rich result on the site to win.

## 7. Zero structured data sitewide

`application/ld+json` appears **0 times across all 49 pages.**

Missing at minimum:

- **Organization** — the Raleigh address, six phone numbers by department and region, logo,
  and `sameAs` for the four social profiles. All of it is already sitting in your footer as
  plain text.
- **SoftwareApplication** — this is a SaaS product site in a well-defined category. The single
  most relevant schema type available, and it is absent.
- **FAQPage** — homepage, once finding 6 is fixed.
- **BlogPosting** — 33 posts, with author and `datePublished`. You already have real `<time
  datetime="…">` values, so the data exists.
- **BreadcrumbList** — for `/tech/*` and `/blogs/*`.

## 8. No social share image anywhere, but a large-image card is declared

| Tag | Present on |
|---|---|
| `og:title`, `og:description`, `og:url`, `og:type` | 49/49 ✓ |
| `twitter:card` = `summary_large_image` | 49/49 ✓ |
| **`og:image`** | **0/49** |
| **`twitter:image`** | **0/49** |
| **`og:site_name`** | **0/49** |

This is the worst combination available: the site explicitly requests a large-image card and
then supplies no image. Every link shared to LinkedIn, Facebook, X, Slack or iMessage renders
as a blank or grey card. Given SMRT posts actively to LinkedIn, Facebook and Instagram, this
costs click-through on every organic and paid post.

**Fix:** a default 1200×630 `og:image` at site level, plus per-page images for the homepage,
`/book-a-demo`, the seven `/tech/*` pages and the blog index. Add `og:site_name` and
`og:image:alt`.

## 9. 2,592 of 2,668 images have no `alt` attribute

**97% missing.** Thirteen pages have no alt text on any image at all.

Not empty `alt=""`, which would at least be a deliberate decorative marker — the attribute is
absent. WCAG 1.1.1 Level A failure, and lost SEO value on product screenshots.

**Fix:** descriptive alt on every meaningful image; explicit `alt=""` on genuinely decorative
ones. Prioritise the product screenshots on the homepage and `/tech/*`.

## 10. No `lang` attribute on any page

All 49 pages serve `<html dir="ltr">` with no `lang`. WCAG 3.1.1 Level A. Screen readers fall
back to the user's default voice, so English content can be read with Swedish or Spanish
pronunciation. Flagged pre-launch, still unfixed.

**Fix:** `<html lang="en" dir="ltr">` — Framer Site Settings → Language.

## 11. 778 `<h5>` elements are buttons and navigation, not headings

Sitewide heading usage: **h1 × 76, h2 × 819, h3 × 2,391, h5 × 778.**

Every frequent `<h5>` is a UI control:

| `<h5>` content | Count |
|---|---|
| Contact Us | 138 |
| Products / Solutions / Resources | 98 each |
| See SMRT in Action | 66 |
| Book a Demo | 56 |
| Schedule a Demo | 50 |
| Home | 49 |
| Testimonials | 49 |
| Talk to Sales | 12 |

Only 37 distinct `<h5>` strings exist and **none of them is a content heading.** A screen
reader user who pulls up the heading list to navigate gets a list of buttons instead of an
outline of the page. It also means **all 49 pages have heading-order violations** (h1 → h5,
h2 → h5 jumps).

**Fix:** in Framer, switch these text layers from Heading 5 to Paragraph, or to a real
`<button>` for the menu triggers. This one change fixes the heading outline on every page.

## 12. Multiple `<h1>` elements on 16 pages

| Page | H1 count |
|---|---|
| `/` | **6** |
| `/tech/conveyor-assembly`, `/tech/point-of-sale` | 4 |
| `/contact-us`, `/special-services`, `/tech/reporting` | 3 |
| 10 more pages | 2 |

Two distinct causes. **Breakpoint duplication** doubles them. And **two-line headlines are
marked up as two separate H1s** — `/blogs` has "Ideas Worth Reading." and "Insights Worth
Using." as two H1s; `/tech/metalprogetti` has "The Best in Machinery." and "Now Enhanced with
SMRT.".

The homepage is worst: its H1s are `Get`, `The behind every great dry cleaner.`, `Seeing is
Believing.` ×2, `behind every great dry cleaner.`, `The behind every great dry cleaner.`
The primary H1 on your highest-value page is the single word **"Get"**, because the rotating
word is injected by JavaScript and never exists in the HTML.

**Fix:** one H1 per page. Make the second line of a two-line headline a `<span>` inside the
same H1, not a second H1. Rewrite the hero H1 as a complete, static, keyword-bearing sentence
with the animated word as a styled span inside it.

## 13. Split-text animation is joining words without spaces

The per-character reveal animation concatenates its spans, and the joins lose spaces. What
crawlers and screen readers actually receive:

| Rendered as | In the markup |
|---|---|
| For Your Dry Cleaning Business. | `For Your DryCleaning Business.` |
| Powerful Ecosystem. Built For Dry Cleaners. | `Powerful Ecosystem.Built For Dry Cleaners.` |

Note this is your **primary keyword phrase** — "Dry Cleaning" — being emitted as
"DryCleaning". On the highest-value page.

**Fix:** ensure the split-text component preserves whitespace between segments. Better, per
the GPU findings: animate whole headings rather than per character, which removes this class
of bug entirely.

---

# P2 — Copy, consistency and polish

## 14. The brand is written "SMrt" once

`/tech/metalprogetti` contains:

> "Your Trusted Metalprogetti **Now Enhanced with SMRT.**" … "now enhanced by **SMrt**"

Against 1,192 correct uses of "SMRT" sitewide, this is the only miscapitalisation — and it
sits next to a near-duplicate of itself with a different preposition ("with" vs "by"), which
suggests leftover alternate copy that was never deleted.

**Fix:** correct the capitalisation and delete whichever of the two lines is redundant.

## 15. The same headline appears in three different casings

| Casing | Where |
|---|---|
| `Your Customers Deserve the Best.` | Homepage |
| `Your customers deserve the best. So do you.` | Homepage / testimonials |
| `YOUR CUSTOMERS DESERVE THE BEST. so do you.` | Testimonials |

The third is the clear error — all-caps for the first sentence, lowercase for the second,
inside one line.

Sitewide, heading case style splits roughly **2,152 Title Case / 746 Mixed / 137 Sentence
case / 4 ALL CAPS**. Pick one convention for headings and one for buttons, then apply it.

## 16. Six different labels for the same conversion action

| Label | Instances |
|---|---|
| Book a Demo | 56 |
| Schedule a Demo | 50 |
| Talk to Sales | 12 |
| Book a demo *(sentence case)* | 4 |
| Book a SMRT demo | 2 |
| Book a SMRT Marketing demo | 2 |
| Schedule a demo *(sentence case)* | 2 |
| Let's kick-start your marketing | 2 |

All lead to the same destination. Some casing variation is legitimate — the ALL-CAPS footer
variants are a design treatment, and sentence case inside blog body copy reads correctly — but
**eight distinct label strings for one action** is not a design decision, it is drift.

One more, a genuine mismatch: on `/blogs/dominate-local-search` a link labelled
**"Contact us"** points to `/book-a-demo`.

**Fix:** settle on one primary CTA label and one secondary. Apply consistently outside blog
body copy. Fix the "Contact us" destination.

## 17. A blog slug has a typo and does not match its title

```
URL   : /blogs/improve-how-your-treat-your-customers
Title : "What Your Customers Want (From Their Perspective, Not Ours)"
```

`your-treat` should be `you-treat` — and beyond the typo, the slug describes a different
article than the title does.

**Fix:** reslug to something matching the title, e.g.
`/blogs/what-your-customers-want`, and 301 the old slug. Do it now rather than after the
post accrues links.

## 18. 24 of 33 blog posts predate 2024

| Year | Posts |
|---|---|
| 2021 | 11 |
| 2022 | 8 |
| 2023 | 5 |
| 2024 | 4 |
| 2025 | 5 |

**73% of the blog is three or more years old**, and every post displays its date, so visitors
see it. Two slugs also carry stale years in the URL itself:
`seo-in-2025-a-dry-cleaners-cheat-sheet…` and `decoding-local-seo-…-in-2024`. A 2024 SEO guide
and a 2021 inflation piece are not assets on a freshly relaunched site.

**Fix:** triage into refresh / archive / delete. Refresh and re-date the ones with search
value; remove the rest from the main index. Decide on the year-stamped slugs before they
accumulate links.

## 19. Footer formatting details

| Item | Current | Should be |
|---|---|---|
| Address | `1017 Main Campus Dr, Suite 1600 Raleigh, NC - 27606` | `1017 Main Campus Dr, Suite 1600, Raleigh, NC 27606` |
| Copyright | `© SMRT Systems, Inc. - 2026` | `© 2026 SMRT Systems, Inc.` |
| Blog date label | `Publishing Date` above the date | `Published` — or drop the label |

The address is missing the comma after the suite and uses a hyphen before the ZIP. "Publishing
Date" reads like a CMS field name that escaped into the interface.

Phone formatting is otherwise consistent and correct across all six numbers.

## 20. Viewport is missing `initial-scale=1`

All 49 pages serve:

```html
<meta name="viewport" content="width=device-width">
```

The conventional pairing is `width=device-width, initial-scale=1`. Without `initial-scale`,
iOS Safari can apply an unexpected zoom level, most visibly after an orientation change.

**Fix:** `<meta name="viewport" content="width=device-width, initial-scale=1">`.

## 21. The 404 page is branded Framer

```
URL    : any non-existent path
Status : 404  (correct)
Title  : "Page Not Found | Framer"
Body   : "The page you are looking for does not exist or may have been moved."
Links  : 1 — "Back to Home". No nav, no search, no suggested content.
```

The status code is right, which matters most. But the page carries **Framer's brand rather
than SMRT's**, has no navigation, and offers a single link. Given there is currently no
redirect map from the old site, this page is receiving real traffic from every stale inbound
link.

**Fix:** build a branded 404 in Framer with the site header and footer, a search box or links
to the main sections, and a demo CTA. Given the missing redirects, this is worth more than it
normally would be.

---

## One thing worth saying plainly

Several things on this site are done well and should not get lost in a list this long:

- The **15 non-blog pages have genuinely good, unique, well-sized titles and meta
  descriptions** — someone did careful work there.
- **Canonicals are correct on all 49 pages** and point at the right host.
- **Blog posts have real `<time datetime>` values and visible authors** — the data for
  BlogPosting schema already exists.
- **The 404 returns a proper 404 status**, which many Framer sites get wrong.
- **Phone numbers are consistently formatted** in E.164 across all six.
- **`robots.txt` and `sitemap.xml` are correct** and the sitemap matches the live site.

---

## Method and limits

**Measured.** All 49 pages fetched from `sitemap.xml` and parsed: 5,373 anchors, 2,668
`<img>` elements, 4,064 headings, all meta tags, all visible text. The executable's size and
headers came from a live request. FAQ answer lengths were measured as the text between each
question and the next in the DOM.

**Judgement calls.** Which CTA-label variants are design versus drift — I have called the
ALL-CAPS footer treatment deliberate and the eight distinct label strings drift, but that is a
brand decision. The suggested address and copyright formats follow US convention. Whether the
80% testimonial is real is a question only you can answer.

**Not checked.** Rendered colour contrast, keyboard tab order and focus indicators, actual
screen-reader output, and the demo-form submission path all need a real browser and are worth
a manual pass. Content injected by JavaScript after load is invisible to a static fetch, which
already caught me out once this project — `unicornStudio` does not appear in the served HTML
at all. Copy was reviewed for consistency, mechanics and specific error patterns rather than
line-edited for style; a human editorial pass would still find more.

**Corrected during this audit.** Two things I nearly reported and verified were wrong: a
stray `')">` fragment that turned out to be inside an SVG data-URI in a style attribute, not
visible text; and "Publishing Date", which I first read as an unbound CMS placeholder but is
a visible field label with a real date rendered beneath it.
