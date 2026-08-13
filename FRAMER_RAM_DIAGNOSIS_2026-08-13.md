# SMRT Website — Live Performance, Memory and Indexing Diagnosis

**Live site:** https://smrtsystems.com/
**Evidence:** Lighthouse 13.4.0 desktop + mobile, run 2026-08-13 11:35; production HTML/JS
fetched anonymously; live robots.txt, sitemap.xml and URL status checks
**Superseded:** the staging Lighthouse report for `smrtwebsite.framer.website` (2026-08-12)

---

## Three corrections to my earlier diagnosis

The live Lighthouse runs contradict three things I told you. Taking them first, because two
of them change what you should work on.

**1. The Framer editor does *not* fully boot on the live site.** I reported that the page
loads the entire Framer editor — three documents, 928 requests, 282 `blob:` scripts, a
1.47 MB CRDT tree. That was measured on **staging**. In both live runs, searching for the
escalation returns nothing:

| Marker | Live desktop | Live mobile |
|---|---|---|
| `framercanvas` | 0 | 0 |
| `multiplayer` / `crdt` | 0 | 0 |
| `blob:` scripts | 0 | 0 |
| `EditButton` | 0 | 0 |
| `edit/init.mjs` | **4 KiB, loaded** | **4 KiB, loaded** |

So the code path ships and the 4 KiB bootstrap does load, but it never escalates into the
editor. **The editor is therefore not the established cause of your crashes.** It remains a
real latent risk worth closing, but it drops from P0 to P2, and the fix order below changes
accordingly.

**2. unicorn.studio *is* on the live site.** I said it was absent, based on zero references
in the served HTML. That check was inadequate — it is loaded at runtime by a Framer code
component, so it never appears in the initial markup. Both live runs show it plainly:
`unicornStudio.umd.js` (36.2 KiB), `controls/controls.umd.js` (61.6–67.1 KiB),
`media/blue_noise_med.png` (206.6 KiB), plus its own Google font — **~331 KiB and a live
WebGL context**. The WebGL finding is reinstated, and it now has a measured consequence
(see CLS below).

**3. The images are not as badly mis-scaled as I said.** I claimed a phone downloads the
same asset a desktop does. Wrong: mobile is served `scale-down-to=1024` variants (164 KiB
vs 235 KiB), and Lighthouse **passes** "Serves images with appropriate resolution" on both
form factors. The real image problem is narrower — **compression**, not dimensions: PNG
where WebP belongs, worth 188 KiB on desktop and 244 KiB on mobile.

What survives unchanged: the video is the dominant payload problem, the per-character blur
animation is the dominant compositing problem, and the breakpoint duplication multiplies
both.

---

## Live scores

| | Desktop | Mobile |
|---|---|---|
| **Performance** | **24** | **42** |
| Accessibility | 83 | 83 |
| Best Practices | 77 | 77 |
| SEO | **100** | **100** |
| First Contentful Paint | 0.6 s | 2.1 s |
| Largest Contentful Paint | 3.2 s | 5.1 s |
| **Total Blocking Time** | **1,280 ms** | **3,940 ms** |
| **Cumulative Layout Shift** | **0.817** | 0.045 |
| Speed Index | 2.1 s | 7.4 s |
| Total payload | 19,168 KiB | 18,169 KiB |
| Main-thread work | 3.3 s | **10.5 s** |
| JavaScript execution | 0.9 s | 3.6 s |
| Long tasks | 6 | **20** |
| DOM | 1,207 elements, depth 20 | same |

For context, the staging run scored 68. **Desktop performance is now 24.** Good targets are
LCP under 2.5 s, TBT under 200 ms, CLS under 0.1. Desktop CLS is **8× the failure
threshold**; mobile TBT is **20×** it.

SEO at 100 on both is worth saying plainly: the metadata work is done and in good shape.

---

## Why PageSpeed Insights times out

`RPC::DEADLINE_EXCEEDED: context deadline exceeded` is not a bug in PSI and not a separate
problem to chase. PSI runs Lighthouse on Google's infrastructure under a hard backend
deadline. This page ships a **17 MB video**, spends **10.5 s of main-thread time** on
mobile, and produces **20 long tasks**. It does not reach a stable state inside the
deadline, so the RPC is killed.

Your local Lighthouse runs succeed because a local run has no server-side deadline — it
waits as long as the page needs. **The timeout is a symptom of the same payload problem,
and it will resolve itself once the video is fixed.** It is also a useful canary: when PSI
starts completing again, the page has genuinely improved.

---

## P0-1 — One video is 90% of the page

This is now unambiguously the top problem, on both form factors.

| | Desktop | Mobile |
|---|---|---|
| `wn1Qnn9RV….mp4` | 17,313.9 KiB | 15,508.2 KiB + 948.2 KiB (two ranges) |
| Total page payload | 19,168 KiB | 18,169 KiB |
| **Video share** | **90.3%** | **90.6%** |

Confirmed properties from production: **28.90 MB**, **1280 × 720**, **29.3 seconds**, **no
audio track**, `moov` atom at the end of the file (not fast-start optimized). A second file,
`uK3EmC6o….mp4`, is 9.73 MB at 1022 × 540, 13.2 s. Three `<video>` elements, two pointing
at the 28.90 MB file, all `loop`, all `preload="none"`, none with a `poster`.

The resolution is fine. **7.9 Mbps for 720p is roughly eight times what that resolution
needs.** The file is big because it is over-encoded and 29 seconds long.

And it is not only a bandwidth problem — **the video is the second-largest CLS contributor
on desktop** (0.255 of 0.817), because with no `poster` and no reserved aspect-ratio box,
the layout reflows when the video finally paints.

**Fix:**

1. Re-encode: keep 720p, cut to 6–10 s, H.264 CRF 28–30, confirm no audio, add a VP9/WebM
   alternate. Target under 1.5 MB, from 28.90 MB.
2. Re-mux with `-movflags +faststart` so playback can start without fetching the tail.
3. Add a `poster` and an explicit aspect ratio — this is also a CLS fix.
4. One video element, not one per breakpoint.
5. Pause off-screen with an `IntersectionObserver`.

Fixing this one asset takes the page from ~19 MB to ~2.5 MB and should move desktop
performance from 24 into the 60s on its own.

---

## P0-2 — Desktop CLS is 0.817, and fonts are the trigger

Mobile CLS is fine at 0.045. Desktop is catastrophic. Lighthouse attributes it precisely:

| Element | Layout shift score |
|---|---|
| `div.framer-37j7oc` | **0.562** |
| `video` | **0.255** |
| `span.framer-text` | 0.000 |
| **Total** | **0.817** |

The named culprits are **web fonts arriving late**: `or3yQ6H-1….woff2` (430 ms of savings
available), `gyBjhwUxI….woff2` (340 ms), and — notably — **unicorn.studio's own bundled
Google font** `google_fonts/JTUSjIg69….ttf` (70 ms). Text renders in a fallback face, the
real face arrives, everything reflows.

Lighthouse also flags `font-display` directly: **430 ms of savings** on desktop.

**Fix:**

1. Set `font-display: swap` on all faces, and add **font metric overrides**
   (`size-adjust`, `ascent-override`) so the fallback occupies the same space as the real
   face. This is what actually kills font-driven CLS rather than merely hiding it.
2. Give the video and `div.framer-37j7oc` explicit dimensions or `aspect-ratio` so their
   boxes are reserved before content arrives.
3. Cut the font set — see P1-2. Fewer faces, fewer shift opportunities.
4. Remove unicorn.studio (P1-1) and its bundled font goes with it.

---

## P1-1 — WebGL is live, and it is costing more than it looks

Reinstated after correction 2. Present in both live runs:

| Asset | Size |
|---|---|
| `assets.unicorn.studio/media/blue_noise_med.png` | 206.6 KiB |
| `assets.unicorn.studio/controls/controls.umd.js` | 61.6–67.1 KiB |
| `cdn.jsdelivr.net/…/unicornStudio.umd.js` | 36.2 KiB |
| `assets.unicorn.studio/google_fonts/JTUSjIg69….ttf` | ~56 KiB |
| **Total** | **~331 KiB** |

Three things make this poor value for a decorative gradient:

1. **`controls.umd.js` is the library's authoring panel**, not its runtime — 71% unused in
   the staging trace. It has no business on a published page.
2. **Its bundled font is a measured CLS contributor** (70 ms), so the effect is actively
   degrading a Core Web Vital.
3. **A live WebGL context** allocates GPU textures and framebuffers that never appear in JS
   heap figures, and if the component remounts without `loseContext()`, contexts accumulate
   until the browser starts discarding them.

**Fix:** remove `controls.umd.js` at minimum. Then decide whether the effect earns 331 KiB,
a GPU context, and a CLS penalty — a static WebP gradient costs none of those. If it stays,
verify context teardown by resizing across the mobile breakpoint repeatedly and watching the
context count.

---

## P1-2 — The GPU compositing load

Unchanged from my earlier analysis, and consistent with the new numbers. On the live
homepage: **252 inline `filter: blur()` declarations** (162 at `blur(10px)`, 90 at
`blur(5px)`), all sharing one signature —

```
display:inline-block; opacity:N; filter:blur(Npx);
transform:translateX(Npx) translateY(Npx) scale(N) rotate(Ndeg) skewX(Ndeg) skewY(Ndeg)
```

— which is the per-character text reveal with the blur appear-effect enabled. Plus **32
`backdrop-filter: blur(14px)`** and **31 permanent `will-change`** declarations.

A CSS blur cannot composite in place: the element renders to an offscreen target, is
convolved in two passes, then composites back. That is three GPU passes and an extra
texture **per element, per frame** — on the order of 750 render passes per animated frame.
Layer textures are allocated in *device* pixels, so Windows display scaling at 150%
multiplies every one by 2.25×, and 200% on a 4K panel by 4×. That is why this bites your
machine specifically.

This is also very likely a large share of the **3,940 ms mobile TBT** and **10.5 s mobile
main-thread time**.

**Fix:** turn off the blur component of the text appear effect (keep the fade and slide);
animate whole headings rather than per character, which also fixes the screen-reader
problem with split text; cut `backdrop-filter` to the one or two places that need glass;
audit `will-change` so it is applied before an animation and removed after.

Confirm it in DevTools → **Layers** panel sorted by memory, and **Rendering** → Layer
borders, before and after.

---

## P1-3 — Everything else Lighthouse flags

| Finding | Desktop | Mobile |
|---|---|---|
| Unused JavaScript | — | **2,074 KiB** |
| Improve image delivery (compression) | 188 KiB | 244 KiB |
| Font display | 430 ms | — |
| Unused `preconnect` hints | — | **4** (`fonts.gstatic.com` ×2, `framerusercontent.com` ×2) |
| Legacy JavaScript / polyfills | flagged | flagged |
| Unminified CSS and JS | flagged | flagged |
| Duplicated JavaScript | flagged | flagged |
| Cache TTL | flagged (`licence-management.js`, 1 h) | flagged |
| Forced reflow | flagged | flagged |
| DOM size | 1,207 elements, depth 20, max 32 children | same |

**Images:** convert the three PNGs to WebP. Dimensions are fine; compression is not.

**Unused preconnect:** four hints point at origins the page does not end up requesting
early. Each wastes a connection slot. Remove them.

**Accessibility, 83 on both.** Still failing, and all of these were in the pre-launch audit:

- `<iframe>` elements have no `title`
- Links have no discernible name (the logo and social icons)
- Heading elements are not in sequentially-descending order
- **`<html>` has no `[lang]` attribute** — still `<html dir="ltr">` in live HTML
- No `main` landmark
- Images missing `[alt]`
- ARIA attribute issues

These are cheap, they are WCAG Level A failures, and they have survived two audits.

**One note on the runs themselves:** three Chrome extensions appear in both traces,
including one contributing **1,951 KiB of JavaScript (1,865 KiB unused)** on mobile. That
inflates the totals somewhat. Re-run in a clean profile or incognito with extensions
disabled for a cleaner baseline — though it does not change any conclusion above, since the
video and the blur layers dominate regardless.

---

## Indexing — you asked whether the sitemap is new or stale

**It is the new one.** Not a leftover from the previous site.

| Check | Result |
|---|---|
| `robots.txt` | `User-agent: * / Allow: /`, sitemap declared — correct |
| Sitemap URLs | **49**, all on `smrtsystems.com` |
| Sitemap URL status | **49 of 49 return 200** |
| Structure | 34 `/blogs/*`, 7 `/tech/*`, 3 `/smrt-marketing/*`, plus `/`, `/special-services`, `/contact-us`, `/book-a-demo`, `/testimonials` |
| `<lastmod>` | **absent on every entry** |
| Internal links vs sitemap | consistent — all 7 `/tech/*` correctly linked, no unexpected orphans |
| Old staging domain | `smrtwebsite.framer.website` now returns **404 "Site Not Found"** |

Two pieces of good news. The staging domain is gone, which closes the duplicate-content and
wrong-canonical P0 from the pre-launch audit — those URLs will fall out of the index on
their own. And the sitemap matches the live site exactly, so there is nothing stale to
clean up.

### The real indexing risk: there are no redirects at all

I probed 22 plausible old-site paths. **Every single one returns a hard 404**, with no
`Location` header anywhere:

```
/blog  /blog/{slug}  /pos  /point-of-sale  /pricing  /about  /about-us
/features  /products  /solutions  /demo  /request-a-demo  /contact
/dry-cleaning-software  /resources  /careers  /support  /login
/tech  /smrt-marketing  /testimonials-page          → all 404
```

That means **no redirect map was built for the relaunch.** Every URL the old site had
indexed that is not one of the new 49 is now a dead end, and its accumulated ranking equity
is being discarded rather than passed forward.

Two patterns in that list are near-misses and so are the highest-probability old URLs:

- **`/blog/{slug}` → `/blogs/{slug}`** — the new site pluralised the path. If the old site
  used `/blog/`, all 34 posts are currently 404ing for Google. This is the single most
  likely and most valuable redirect set.
- **`/contact` → `/contact-us`**

Also worth noting: **`/tech` and `/smrt-marketing` themselves 404** even though they have
children in the sitemap. Section index pages are natural breadcrumb and internal-link
targets, and their absence is a small structural gap.

I could not enumerate the actual old URLs — this environment's egress policy blocks
`web.archive.org`, so I could not pull the historical inventory. **You can get the real
list in ten minutes**, and you should before building the map:

1. **Search Console → Indexing → Pages**, and the **Performance → Pages** report filtered
   to the 16 months before cutover. That is the authoritative list of what Google had
   indexed and what was actually earning clicks.
2. Sort by impressions and redirect the top pages first. A long tail of zero-traffic URLs
   can 404 without consequence; the top 20 cannot.
3. Any old URL with no sensible new equivalent should 301 to the nearest relevant page, not
   to the homepage — blanket homepage redirects get treated as soft 404s.

### Indexing checklist

1. **Build the redirect map** from Search Console data. Highest priority item here.
2. **Add `/blog/{slug}` → `/blogs/{slug}`** (verify the old path first) and
   `/contact` → `/contact-us`.
3. **Add `<lastmod>`** to sitemap entries so Google has a recrawl signal. Framer should
   populate this from CMS timestamps.
4. **Resubmit the sitemap** in Search Console, then watch Coverage for a 404 spike — that
   spike is your redirect to-do list, arriving for free.
5. **Request indexing** for the homepage and the seven `/tech/*` pages to prime the crawl.
6. **Create `/tech` and `/smrt-marketing` index pages**, or remove them from the URL
   hierarchy.
7. Two blog slugs still carry stale years — `seo-in-2025-a-dry-cleaners-cheat-sheet` and
   `decoding-local-seo-…-in-2024`. Refresh or accept as archive, but decide now, since
   reslugging later means more redirects.

---

## Fix order

**Do first — biggest measured wins:**

1. **Re-encode the hero video.** 28.90 MB → under 1.5 MB, `+faststart`, add a `poster`.
   Removes 90% of the payload, fixes 0.255 of desktop CLS, and should end the PageSpeed
   timeout.
2. **Fix font loading** — `font-display: swap` plus metric overrides. Attacks the 0.562
   CLS contributor and 430 ms.
3. **Turn off the blur on the text appear effect.** Largest GPU win; big TBT win.
4. **Build the redirect map** from Search Console. Every day without it leaks ranking.

**Then:**

5. Consolidate the hero to one video element; then header, footer, marquee.
6. Remove `controls.umd.js`; decide whether the WebGL effect stays at all.
7. Animate whole headings, not per character.
8. Convert the three PNGs to WebP; remove the four unused `preconnect` hints.
9. Fix the seven accessibility failures — `lang="en"`, `alt` text, `aria-label` on the logo
   and social icons, `<iframe title>`, heading order, `main` landmark.
10. Add `<lastmod>` to the sitemap and resubmit.
11. Cut the font set to what is actually used; move to variable fonts.
12. **Close the editor path** — disable On-Page Editing in Framer settings. Now P2, since
    it does not escalate on live, but the bootstrap still ships and staging proved what
    happens when it does fire.

**Expected result:** desktop performance from 24 into the 70s, payload from 19 MB to
2–3 MB, desktop CLS from 0.817 under 0.1, mobile TBT from 3,940 ms toward the hundreds, and
PageSpeed Insights completing instead of timing out.

---

## Confirmed vs. inferred

**Measured.** All scores, metrics, payload figures, CLS attributions per element, long-task
counts, DOM statistics and per-asset sizes come from the two Lighthouse 13.4.0 runs. Video
properties (28.90 MB, 1280×720, 29.3 s, no audio, `moov` at end) from production
`Content-Length` and MP4 metadata. The 252 blur declarations, 32 `backdrop-filter`s, 31
`will-change`es, three `<video>` elements and missing `lang` from production HTML.
robots.txt, all 49 sitemap URL statuses, the 22 probed 404s, the staging 404, and the
internal-link comparison from live requests made today.

**Inferred.** That the 252 blurred elements are the per-character text reveal — the style
signature is strong evidence, but the Layers panel will confirm. That the blur work is a
large share of mobile TBT — plausible from the counts, not separately attributed by
Lighthouse. Render-pass and texture-memory figures are arithmetic, not measurements. That
`/blog/{slug}` was the old blog path — a near-miss inference from the 404 probe, **verify in
Search Console before building redirects on it**.

**Not established.** The cause of the RAM crashes specifically. The editor escalation I
originally blamed does not reproduce on live, so while the 19 MB payload, the WebGL context
and 10.5 s of main-thread work are all plausible contributors, I have no heap measurement
from your machine. This environment's proxy blocks headless Chromium, so I cannot capture
one. **A DevTools Memory timeline with heap snapshots 30 s apart on an idle tab would settle
it** — and is worth doing before and after step 1, since if RAM keeps climbing on an idle
tab after the video is fixed, something else is retaining memory and we should look again.

**Not checkable here.** `web.archive.org` (egress-blocked), so no historical URL inventory;
`support.smrtsystems.com` (egress-blocked), so its links are unverified — I am not claiming
they are broken.
