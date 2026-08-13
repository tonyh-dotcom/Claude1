# SMRT Website — Link Issues Worklist

**Site:** https://smrtsystems.com/
**Scanned:** 2026-08-13 — all 49 pages in `sitemap.xml`, 5,373 anchors, 91 unique destinations
**Method:** every destination status-checked **following redirects to the final response**; relative
hrefs resolved against the page they appear on, not the site root

---

## Summary

| # | Category | Instances | Pages | Severity |
|---|---|---|---|---|
| 1 | **Framer template affiliate links** (`framer.link/P8mvaz1`) | **33** | 6 | P0 — demo CTAs go to a Framer login |
| 2 | **Links to the old site that 404** | **19** | 3 | P0 — 2 are demo CTAs, 15 are blog card images |
| 3 | Malformed href — literal spaces in fragment | 49 | 49 | P2 — invalid URL, browsers cope |
| 4 | Anchor with no `href` — dead CTA | 2 | 1 | P1 — button does nothing |
| 5 | Anchor with no `href` — nav dropdown triggers | 147 | 49 | P2 — not keyboard accessible |
| 6 | External link renamed at destination | 6 | 2 | P2 — still resolves via 301 |

**Two things to fix today:** category 1 and the two `/sales-demo/` buttons in category 2. Those are
the only issues that actively cost you a lead.

---
## Category 1 — Framer template affiliate links

**The link, in every case:** `https://framer.link/P8mvaz1`

**Where it goes:** `302` → `https://framer.com/projects/new?duplicate=nMvDvF73IWn5Y1ISZg8W&via=p8mvaz1` → `https://framer.com/login/`

**What it is:** a "duplicate this template" link carrying a referral parameter. Left over from the template the site was built on.

**Replace every one with:** `/book-a-demo`

**Total:** 33 instances across 6 pages. Every one is a demo or sales CTA.

> **Reading the "Near heading" column:** it is the nearest heading *above* the button in the page
> source — a locator hint to help you find the right button in the Framer editor, not an exact
> section name. Where a button's own text is also a heading (e.g. "Schedule a Demo"), that means the
> button sits inside a CTA block of the same name.

### `https://smrtsystems.com/tech/reporting` — 6 bad buttons

| Button text | Instances | Near heading / section |
|---|---|---|
| **Schedule a Demo** | 1 | Know How Your Week Went Before It's Over. |
| **Schedule a Demo** | 1 | Schedule a Demo |
| **Schedule a Demo** | 1 | See Reporting Features |
| **Schedule a Demo** | 1 | See Your Week Before It Ends. |
| **See Reporting Features** | 1 | See Reporting Features |
| **See Reporting Features** | 1 | Start Seeing Live Data |

### `https://smrtsystems.com/tech/marketing` — 6 bad buttons

| Button text | Instances | Near heading / section |
|---|---|---|
| **Schedule a Demo** | 2 | You Deliver Excellence. We Spread the Word. |
| **Talk to Sales** | 2 | Talk to Sales |
| **Talk to Sales** | 2 | Turn Customers Into Revenue |

### `https://smrtsystems.com/tech/metalprogetti` — 6 bad buttons

| Button text | Instances | Near heading / section |
|---|---|---|
| **Schedule a Demo** | 1 | Go Further with Metalprogetti. |
| **Schedule a Demo** | 1 | Schedule a Demo |
| **Schedule a Demo** | 1 | See How It Works |
| **Schedule a Demo** | 1 | Take Metalprogetti Beyond Its Limits. |
| **See How It Works** | 1 | See How It Works |
| **See How It Works** | 1 | now enhanced by SMrt |

### `https://smrtsystems.com/testimonials` — 6 bad buttons

| Button text | Instances | Near heading / section |
|---|---|---|
| **Talk to Sales** | 2 | Schedule a Demo |
| **Book a Demo** | 1 | Book a Demo |
| **Book a Demo** | 1 | Support that CAN'T BE REPLACED BY AI. |
| **Schedule a Demo** | 1 | YOUR CUSTOMERS DESERVE THE BEST. so do you. |
| **Schedule a Demo** | 1 | Your customers deserve the best. So do you. |

### `https://smrtsystems.com/blogs` — 5 bad buttons

| Button text | Instances | Near heading / section |
|---|---|---|
| **Schedule a Demo** | 2 | Let's Invest your knowledge in What’s Next. |
| **Schedule a Demo** | 1 | See Marketing Tools |
| **Schedule a Demo** | 1 | You Have the Knowledge. Let’s Invest It in Your Futu |
| **See Marketing Tools** | 1 | to industry leader |

### `https://smrtsystems.com/special-services` — 4 bad buttons

| Button text | Instances | Near heading / section |
|---|---|---|
| **Let's Build Your Solution** | 1 | Let's Build Your Solution |
| **Let's Build Your Solution** | 1 | Neither Is SMRT. |
| **Schedule a Demo** | 1 | Your Craft Built It. We’ll Grow It. |
| **Schedule a Demo** | 1 | Your Craft Got You Here.We'll Take You Further. |

**Category 1 total: 33 instances.** Counts are roughly 2× the buttons you will edit, because the desktop and mobile breakpoint variants each carry their own copy — expect about 17 distinct buttons in the editor.


---

## Category 2 — Links to the old site that now 404

**Why they hide:** each returns `308` redirecting `www.smrtsystems.com` → `smrtsystems.com`, then a hard `404`. Any checker that does not follow redirects reports these as healthy.

**Total:** 19 instances, 10 unique dead URLs, across 3 pages.

> **On `/blogs`, identify these by their target URL, not by position.** The 15 bad links there are a
> contiguous block of image-only anchors — the featured-card artwork — so there is no button text to
> search for and no reliable nearest heading. Each card's *title* link immediately after it is
> correct, which is why the breakage is invisible on the page: every featured card has a working
> headline and a dead picture. In Framer, look for the CMS field driving the card image link.

### `https://smrtsystems.com/blogs` — 15 bad links

| Button / element | Instances | Currently points to | Should point to | Confidence |
|---|---|---|---|---|
| **IMAGE LINK (no text)** | 4 | `/marketing/sms-vs-email-marketing-dry-cleaners/` | `/blogs/does-sms-marketing-beat-email-marketing-for-dry-cleaning-customer-engagement` | NEEDS DECISION (58% match) |
| **IMAGE LINK (no text)** | 3 | `/marketing/grow-your-dry-cleaning-business-9-proven-text-email-marketing-tactics/` | `/blogs/grow-your-dry-cleaning-business-9-proven-text-email-marketing-tactics` | exact |
| **IMAGE LINK (no text)** | 2 | `/business-administration/keep-your-dry-cleaning-business-busy-and-thriving-during-summer-updated-2025/` | `/blogs/keep-your-dry-cleaning-business-busy-and-thriving-during-summer-updated-2025` | exact |
| **IMAGE LINK (no text)** | 1 | `/business-administration/get-to-know-the-new-smrt-customer-portal/` | `/blogs/get-to-know-the-new-smrt-customer-portal` | exact |
| **IMAGE LINK (no text)** | 1 | `/marketing/ai-for-marketing/` | `/blogs/ai-tools-for-marketing-a-starter-guide` | NEEDS DECISION (59% match) |
| **IMAGE LINK (no text)** | 1 | `/marketing/boost-your-business-reputation/` | `/blogs/boost-your-business-reputation` | exact |
| **IMAGE LINK (no text)** | 1 | `/marketing/decoding-local-seo-putting-your-business-on-the-map-in-2024/` | `/blogs/decoding-local-seo-putting-your-business-on-the-map-in-2024` | exact |
| **IMAGE LINK (no text)** | 1 | `/marketing/seo-in-2025-a-dry-cleaners-cheat-sheet-to-mastering-googles-algorithm/` | `/blogs/seo-in-2025-a-dry-cleaners-cheat-sheet-to-mastering-googles-algorithm` | exact |
| **IMAGE LINK (no text)** | 1 | `/marketing/transform-your-bottom-line-4-smrt-tactics-for-revenue-growth/` | `/blogs/transform-your-bottom-line-with-smrt-4-tactics-for-revenue-growth` | likely (94% slug match) |

### `https://smrtsystems.com/blogs/does-sms-marketing-beat-email-marketing-for-dry-cleaning-customer-engagement` — 2 bad links

| Button / element | Instances | Currently points to | Should point to | Confidence |
|---|---|---|---|---|
| **Book a SMRT demo** | 2 | `/sales-demo/` | `/book-a-demo` | exact intent |

### `https://smrtsystems.com/blogs/grow-your-dry-cleaning-business-9-proven-text-email-marketing-tactics` — 2 bad links

| Button / element | Instances | Currently points to | Should point to | Confidence |
|---|---|---|---|---|
| **Book a SMRT Marketing demo** | 2 | `/sales-demo/` | `/book-a-demo` | exact intent |

**Category 2 total: 19 instances.**

---

## Category 3 — Malformed href: literal spaces in the fragment

**Found on all 49 pages** (it is in the shared footer, Solutions column).

| Button text | Current href | Pages |
|---|---|---|
| **— Couture Dry Cleaning** | `./special-services#Couture Dry Cleaning` | 6 top-level pages |
| **— Couture Dry Cleaning** | `../special-services#Couture Dry Cleaning` | 43 sub-pages |

The three sibling links in the same footer column are correctly formed: `#hotels`, `#uniforms`,
`#restoration`.

**Why it matters, and why it looks fine.** The target `id="Couture Dry Cleaning"` does exist on
`/special-services`, spaces and all, so most browsers scroll to it and the link appears to work.
But spaces must be percent-encoded, so the URL is invalid as written. It breaks in link crawlers,
email clients, analytics reports, and anything that normalises URLs — `curl` cannot even issue the
request.

**Fix:** rename the section id on `/special-services` to `couture`, and change the href to
`#couture`. One id change plus one link change clears all 49 instances, because the footer is shared.

---

## Category 4 — Dead CTA: anchor with no `href` at all

**Page:** `https://smrtsystems.com/blogs/decoding-local-seo-putting-your-business-on-the-map-in-2024`

| Button text | Instances | href | Result |
|---|---|---|---|
| **Explore SMRT Marketing** | 2 (desktop + mobile) | *absent entirely* | Does nothing on click |

An `<a>` with no `href` is inert: no navigation, not in the tab order, and not announced as a link
by a screen reader.

**Fix:** point it at `/tech/marketing`, which is presumably the intent. *(That target is my
inference from the button text — confirm it is right.)*

---

## Category 5 — Nav dropdown triggers with no `href`

**Found on all 49 pages** — three per page, 147 total.

| Button text | Instances | href |
|---|---|---|
| **Products** | 49 | *absent* |
| **Solutions** | 49 | *absent* |
| **Resources** | 49 | *absent* |

These work with a mouse because JavaScript handles the click, but an `<a>` without `href` is not
focusable and is not exposed as an interactive control. This is the same concern the pre-launch audit
raised about the dropdowns, now confirmed in the markup on every page.

**Fix:** these are menu triggers, not links — they should be `<button>` elements with
`aria-expanded`. In Framer that usually means using the built-in menu component rather than a custom
text layer with a click handler.

---

## Category 6 — External links renamed at the destination

All three still resolve via a `301`, so nothing is visibly broken, but the link and its destination
have drifted apart.

| Page | Current link | Now redirects to |
|---|---|---|
| `https://smrtsystems.com/blogs/does-sms-marketing-beat-email-marketing-for-dry-cleaning-customer-engagement` | `growth-onomics.com/email-marketing-benchmarks-`**`2025`**`-open-rates-ctrs` | `…benchmarks-`**`2026`**`-open-rates-ctrs/` |
| `https://smrtsystems.com/tech/payments` | `support.smrtsystems.com/en/articles/9011377-setting-up-a-subscription-plan` | `…/9011377-how-to-setup-a-subscription` |
| `https://smrtsystems.com/tech/payments` | `support.smrtsystems.com/en/articles/9011486-autopay` | `…/9011486-how-autopay-works` |

**Fix:** update all three. For the benchmarks citation, also check whether the surrounding copy
quotes 2025 figures that the 2026 edition has since revised.

---

## What I checked and found clean

Stated explicitly so nobody re-investigates these.

- **All internal navigation resolves.** Framer's `./` and `../` hrefs look risky — `./point-of-sale`
  on a `/tech/*` page, `./tech/point-of-sale` on a root page — but resolved against their own page,
  all 75 on-site destinations return 200.
- **All 10 fragment targets exist:** `#pos-features`, `#route-features`, `#payment-features`,
  `#assembly-features`, `#vision`, `#hotels`, `#uniforms`, `#restoration`, `#special-services`, and
  `#Couture Dry Cleaning`.
- **All 49 sitemap URLs return 200.**
- **No `http://` links** — everything external is HTTPS.
- **No empty `href=""`, no `href="#"`, no `javascript:void(0)`.**
- **All 8 `tel:` and `mailto:` links are well-formed** — six phone numbers in E.164 format, plus
  `support@smrtsystems.com` and `marketing@smrtsystems.com`.

### Three that look broken in my scan but are not

My requests were rate-limited or bot-blocked by these hosts. That is normal behaviour toward
crawlers and **not** evidence of a bad link. I am not reporting these as failures — they need a
check from a real browser:

| Link | What my scan saw |
|---|---|
| `instagram.com/smrtsystems/` | 429, then a login redirect |
| `youtu.be/sKMifdZBOCs` | Google "sorry" interstitial; the sibling video link resolved fine |
| `facebook.com/smrtsystems` | 302 to a login page |

The `support.smrtsystems.com` help-centre links were also unreachable from my environment by egress
policy, apart from the two 301s in category 6 which I could observe. Spot-check those from a browser.

---

## Bonus — category 2 answers the redirect-map question

When I audited indexing I could not determine the previous site's URL structure, because
`web.archive.org` is unreachable from my environment. I guessed `/blog/{slug}`. **That guess was
wrong.** The ten hardcoded URLs in category 2 are direct evidence of the real taxonomy:

```
/marketing/{slug}/
/business-administration/{slug}/
/sales-demo/
```

The old site organised posts by **topic category**, not under `/blog/`. So the redirect map you need
is `/marketing/*` and `/business-administration/*` → `/blogs/*`, plus `/sales-demo/` →
`/book-a-demo`.

There are almost certainly more categories than these two — these ten URLs are only the ones that
happened to be hardcoded into the new site. Confirm the full inventory in **Search Console →
Indexing → Pages**, but the pattern is now known rather than assumed.

---

## Fix order

1. **Repoint the 33 `framer.link/P8mvaz1` buttons to `/book-a-demo`** — 6 pages, ~17 distinct
   buttons. These send prospects to a Framer sign-up page.
2. **Fix the two `/sales-demo/` demo buttons** on the two blog posts — also dead, also demo CTAs.
3. **Repoint the 15 blog card image links** using the mapping table in category 2. Seven are exact
   slug matches; two need an editorial decision; one is a 94% match.
4. **Give "Explore SMRT Marketing" an `href`.**
5. **Rename the Couture section id to `couture`** — clears 49 malformed URLs in one change.
6. **Update the three renamed external links.**
7. **Convert the three nav dropdown triggers to `<button>`** with `aria-expanded`.
8. **Final sweep:** search the project for `framer.link`, `duplicate=`, `via=`, and
   `www.smrtsystems.com`. That last one is the one to watch — any absolute link to your own old
   domain is a 404 waiting to be found.

---

## Limits of this scan

- **Only pages in `sitemap.xml`** were crawled. The internal link graph turned up no on-site
  destinations outside those 49, so the sitemap appears complete.
- **Static fetch only.** Links injected by JavaScript after load are invisible to this method. Given
  that `unicornStudio` proved able to hide from the served HTML entirely, a browser-based pass is a
  reasonable double-check.
- **Suggested replacement targets** in category 2 are slug matches, not confirmed editorial
  mappings. The two marked *NEEDS DECISION* have no close equivalent.
- **Social and help-centre links** could not be verified from this environment.
