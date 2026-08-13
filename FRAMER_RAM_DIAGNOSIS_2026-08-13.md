# SMRT Website — Browser Memory Exhaustion Diagnosis

**Site:** https://smrtwebsite.framer.website/
**Evidence:** Lighthouse 13.4.0 report, captured 2026-08-12T16:03:22Z, desktop, simulated throttling
**Date:** August 13, 2026

---

## Note on the evidence

The file supplied as "the test site code" is not the site's HTML. It is a **Lighthouse
report** for the site, with 1.6 MB of audit JSON embedded in it. That turned out to be
better evidence than the served markup, because it carries the full network waterfall,
main-thread trace, and script attribution — which is where a memory problem is actually
visible. The served HTML would not have shown any of this.

Every number below is extracted from that report. Nothing is estimated unless labeled
as such.

---

## Headline

The page transfers **40.5 MB across 1,090 requests**. Two independent problems account
for almost all of it, and they have different audiences:

| Path | Requests | Transfer | Who pays it |
|---|---|---|---|
| Site content | 162 | **30.4 MB** | every visitor |
| Framer editor runtime | 928 | **9.2 MB** | anyone logged into Framer |
| **Total** | **1,090** | **40.5 MB** | |

Performance score is 0.68. LCP 3.1 s, TTI 3.1 s, Speed Index 3.3 s, TBT 190 ms,
main-thread work **6.2 s**, JS bootup 1.5 s.

There is no leak in code that anyone at SMRT wrote. The site is not a badly built
webapp. It is a **statically published marketing site that boots the entire Framer
design editor inside itself**, on top of a 24 MB video that it downloads six times.

---

## Finding 1 — The published page loads the whole Framer editor (P0)

**This is the crash.**

The published HTML ships Framer's edit-mode bootstrap. From the waterfall:

```
  498 ms  Script    https://framer.com/edit/init.mjs
 2082 ms  Script    https://app.framerstatic.com/EditButton-NI7O4KK3.mjs
 2092 ms  Document  https://framer.com/edit?framerSiteId=a7a89f99...   <- 2nd document
 5069 ms  Document  https://site-a7a89f99....framercanvas.com/s/app.625f8...  <- 3rd document
 5744 ms  Fetch     https://api.framer.com/multiplayer/projects/rIPOJ8Cq5TjGpiou7t6A
                      /tree/1786550063540000.crdt          1.47 MB
```

That escalates into:

| What | Count | Bytes |
|---|---|---|
| `app.framerstatic.com` editor bundles | 269 req | 4.17 MB |
| `framercanvas.com` (editor app + compiled modules) | 291 req | — |
| `blob:` script URLs from in-browser compilation | **282** | — |
| `/modules/` project source, incl. 76 raw `.tsx` files | 338 req | 2.10 MB |
| Multiplayer CRDT project document | 2 req | 1.47 MB |
| Full Google Fonts catalog (editor font picker) | 4 req | 0.94 MB |
| Full Fontshare catalog (editor font picker) | 14 req | 0.47 MB |

Three separate documents are live in the tab at once: the site, `framer.com/edit`, and
the full editor application on `framercanvas.com`. Each carries its own JS heap, its own
React tree, and its own event listeners.

### Why this behaves as a leak rather than just as bloat

Four mechanisms, in descending order of confidence:

1. **282 `blob:` script URLs.** The editor fetches the project's TypeScript source and
   compiles it in the browser, publishing each compiled module as an object URL. A blob
   handed to `URL.createObjectURL()` is pinned in memory until `revokeObjectURL()` is
   called on it — garbage collection cannot reclaim it, because the URL string is a live
   reference. 282 retained compiled modules is a large floor that never drops. *(That
   blob URLs are never revoked is inference from the count and from RAM behavior; it is
   not directly observable in a Lighthouse trace.)*
2. **A live CRDT replica plus its websocket.** A CRDT keeps tombstones for deleted
   content so replicas can converge. The structure grows monotonically with the project's
   edit history and does not shrink. The initial snapshot alone is 1.47 MB, and the
   socket keeps applying deltas for as long as the tab is open.
3. **Editor requests were still firing at 12.8 s**, when Lighthouse stopped recording.
   The escalation had not finished. Memory was still climbing at the point measurement
   ended — consistent with a tab that grows until it is killed rather than one that
   settles at a high number.
4. **Garbage collection ran only 36 ms** out of 6.2 s of main-thread work. The heap is
   not being reclaimed, because almost none of it is reclaimable.

### Important scope caveat

This path is authentication-gated. It fired during this audit because the run was made
**in a signed-in Chrome profile** — confirmed by 5.9 MB of injected JavaScript from a
browser extension (`chrome-extension://ioalpmibngobedobkmbhgmadaphocjdn`) appearing in
the script treemap, which a clean Lighthouse profile would not have.

So: this is what crashes **your** browser and your team's, not necessarily an anonymous
visitor's. That distinction matters for prioritization but not for severity — it is
almost certainly the answer to "it keeps crashing the browser," because the people
loading this site most often are the people building it.

### Fix

1. **Verify the blast radius first.** Open the site in a clean incognito window with no
   Framer session and watch the Network panel. Filter for `framercanvas.com`. If those
   requests are absent, this is a logged-in-only problem — bad, but not a launch blocker.
   If they are present, it is a P0 for every visitor and the site cannot launch.
2. **Check Framer's edit-mode setting.** Framer's "Edit in Framer" / edit-button feature
   is what injects `framer.com/edit/init.mjs`. Turn it off for the published site in Site
   Settings. This is a toggle, not a code change.
3. **If no such toggle exists on the current plan**, raise it with Framer support with the
   waterfall above attached. A published marketing site loading a 1.5 MB collaborative
   document tree and compiling 338 source modules in the visitor's browser is not
   intended behavior for a published site.
4. **Day to day, work on the site in a separate browser profile** from the one used to
   view it, so an editor session is never attached to a normal page load.

---

## Finding 2 — A 24 MB hero video, downloaded six times (P0)

Eight media requests, **25.9 MB — 85% of the entire visitor payload.** All but two are
the same file:

```
status  transfer   resource   start      URL
206      3.00 MB    3.04 MB   2016 ms    wn1Qnn9RVuBbmppnl8PoCi0uLdk.mp4
206      0.03 MB    0.03 MB   2587 ms    wn1Qnn9RVuBbmppnl8PoCi0uLdk.mp4
206     21.28 MB   23.94 MB   3005 ms    wn1Qnn9RVuBbmppnl8PoCi0uLdk.mp4   <-- full file
206      0.00 MB    0.49 MB  11163 ms    uK3EmC6oURVtNKip3Y9EPF54vvI.mp4
206      0.00 MB    1.00 MB  11533 ms    wn1Qnn9RVuBbmppnl8PoCi0uLdk.mp4
206      1.51 MB    1.51 MB  11549 ms    wn1Qnn9RVuBbmppnl8PoCi0uLdk.mp4
206      0.01 MB    0.01 MB  12024 ms    uK3EmC6oURVtNKip3Y9EPF54vvI.mp4
206      0.03 MB    0.03 MB  12065 ms    wn1Qnn9RVuBbmppnl8PoCi0uLdk.mp4
```

`wn1Qnn9RVuBbmppnl8PoCi0uLdk.mp4` is **23.94 MB** and is requested **six times**. The
repeat requests are the signature of multiple `<video>` elements pointing at one source —
which matches finding 16 of the pre-launch audit, that desktop and mobile breakpoint
variants are both present in the DOM. Each element opens its own range requests and its
own decode pipeline.

**Transfer size is not the memory cost here — decoded frames are.** A 1080p frame is
~8 MB uncompressed in a decode buffer, and a player holds several at a time. Both videos
carry `loop`, so the buffers are never released for as long as the page is open. Multiple
elements decoding the same 24 MB loop simultaneously is a straightforward path to
hundreds of MB resident.

Compounding it: `preload="none"` with **no `poster`** (audit finding 17) means the hero
paints nothing until buffering starts, which is a significant part of the 3.1 s LCP.

### Fix

1. **Re-encode.** 24 MB is roughly 20x too large for a background loop. Target under
   1.5 MB: cap at 1080p (720p is fine for a blurred/overlaid background), 6–10 seconds,
   H.264 CRF 28–30, **strip the audio track**, and ship a WebM/VP9 alternate. Most of
   24 MB is usually excess duration and an unnecessary audio stream.
2. **One video element, not one per breakpoint.** Consolidate the hero to a single
   component with responsive properties. This is the same consolidation the pre-launch
   audit recommends for the header, footer, and testimonial marquee.
3. **Add a `poster`** — first frame as a compressed WebP. Fixes the empty hero box and
   the LCP.
4. **Pause off-screen.** Use an `IntersectionObserver` to `pause()` when the hero scrolls
   out of view. A paused element stops accumulating decode buffers.
5. **Check `uK3EmC6oURVtNKip3Y9EPF54vvI.mp4`** — 0.49 MB was pulled at 11.2 s, well after
   load. Confirm it is intentional and not a second hidden breakpoint variant.

---

## Finding 3 — A WebGL canvas layer with no teardown path (P1)

Three libraries, loaded twice each:

```
173 KB  cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.2.6/dist/unicornStudio.umd.js
248 KB  assets.unicorn.studio/controls/controls.umd.js   (177 KB of it unused, 71%)
207 KB  assets.unicorn.studio/media/blue_noise_med.png   (requested twice)
```

`unicornStudio.umd.js` costs 164 ms of bootup and 55 ms of long-task time; combined with
`controls.umd.js` it triggers **forced synchronous reflow from seven distinct call sites**.

WebGL is the concerning part for memory. A context allocates GPU-side textures and
framebuffers that do not appear in JS heap measurements. A `blue_noise` texture indicates
a shader-based dithered gradient or displacement effect, running continuously.

The specific risk: **if the effect's container remounts** — on a breakpoint change, a
route transition, or a scroll-triggered re-render — and the old context is not released
with `WEBGL_lose_context.loseContext()`, contexts accumulate. Browsers cap concurrent
contexts at ~16 and then begin discarding the oldest, which produces exactly the
"renders fine, then goes black or crashes" behavior. That `controls.umd.js` is loaded at
all is itself suspicious — it is the library's *authoring* control panel, 71% unused, and
has no business on a published page.

### Fix

1. **Drop `controls.umd.js`.** It is the editor UI for the effect, not the runtime.
2. **Confirm teardown.** In DevTools, resize the window across the mobile breakpoint
   several times, then check the WebGL context count. If it climbs, the component needs an
   unmount handler calling `loseContext()`.
3. **Deduplicate.** All three assets load twice — again the breakpoint-variant duplication.
4. **Gate it.** Disable the effect under `prefers-reduced-motion`, and consider skipping
   it on mobile entirely, where the RAM ceiling is lowest and the effect is least visible.
5. **Weigh it honestly.** ~630 KB, a permanent GPU allocation, and seven forced reflows
   for a decorative gradient is a poor trade. A static WebP gradient is free.

---

## Finding 4 — 85 font requests, 3.16 MB (P1)

| Family | Requests |
|---|---|
| Geist | 29 |
| Plus Jakarta Sans | 16 |
| Fira Sans Extra Condensed | 4 (~150 KB each) |
| Geist Mono | 2 |
| Inter | 2 |
| Space Grotesk, Instrument Sans | 1 each |
| (host-level / editor picker) | 30 |

29 weights of Geist is not a design decision anyone made — it is every weight and italic
of a variable family being served as separate static files. Fira Sans Extra Condensed at
~150 KB per file is a fourth family that no part of the audited design appears to use.

Lighthouse separately flags 590 ms of savings available from `font-display`.

### Fix

1. **Audit which families and weights the design actually uses.** Expect the real answer
   to be two families and three or four weights.
2. **Remove Fira Sans Extra Condensed** unless a specific element needs it.
3. **Prefer variable fonts** — one file covers the full weight range instead of 29.
4. **Set `font-display: swap`** and subset to Latin.

---

## Finding 5 — Framer Motion is the largest single main-thread cost (P1)

Main-thread breakdown, 6.2 s total:

| Category | Time |
|---|---|
| Other | 3,105 ms |
| Script evaluation | 1,273 ms |
| Style & layout | 853 ms |
| Rendering | 522 ms |
| Script parse & compile | 362 ms |
| **Garbage collection** | **36 ms** |

By script, `motion.C_WWXFrT.mjs` (Framer Motion) accounts for **3,002 ms** — more than
the whole document's 1,425 ms — and shows up in the forced-reflow table twice.

The likely amplifier is finding 19 of the pre-launch audit: heading text split into
per-character spans for reveal animations. Each character becomes an animated node with
its own transform and style recalculation. Across several headings, duplicated for two
breakpoints, that is thousands of animated nodes. It explains the 853 ms of style and
layout, and it is a steady allocation load rather than a one-time cost.

### Fix

1. **Animate whole headings, not characters.** A single opacity/transform on the heading
   element gets most of the visual effect at a fraction of the cost — and it fixes the
   accessibility problem the pre-launch audit raised about screen readers reading split
   text character by character.
2. **Animate only `transform` and `opacity`**, which stay on the compositor and skip
   layout entirely.
3. **Unmount reveal animations once they have played.** A one-shot intro animation should
   not stay mounted and observed for the life of the page.
4. **Honor `prefers-reduced-motion`.**

---

## Finding 6 — Breakpoint duplication multiplies all of the above (P1)

Already logged as finding 16 of the pre-launch audit at P2. **On this evidence it should
be raised to P1.** It is not merely a DOM-size and duplicate-H1 issue; it is a multiplier
on every item in this document:

- the 24 MB video, fetched by two sets of elements
- the WebGL effect, initialized twice, its assets fetched twice
- every font file, requested twice
- every animated character span, doubled
- 441 KB of HTML where ~220 KB would do

Consolidating the header, hero, footer, and testimonial marquee to single responsive
components is the highest-leverage structural change available, because it reduces
several independent problems at once.

---

## Fix order

**Do first — these are the crash:**

1. Determine whether the editor runtime loads for anonymous visitors (incognito, no
   Framer session, filter Network for `framercanvas.com`). This decides whether item 2
   is a launch blocker or a team-workflow problem.
2. Disable Framer edit mode on the published site. Escalate to Framer support if there is
   no toggle on the current plan.
3. Re-encode the hero video from 24 MB to under 1.5 MB, strip audio, add a `poster`.
4. Consolidate the hero to one video element instead of one per breakpoint.

**Then:**

5. Remove `controls.umd.js`; verify WebGL contexts are released on unmount.
6. Cut the font set to the families and weights actually used; move to variable fonts.
7. Replace per-character text animation with per-heading animation.
8. Consolidate the remaining breakpoint variants — header, footer, marquee.

**Expected result:** visitor payload from 30.4 MB to roughly 3–4 MB; total requests from
1,090 to under 120; main-thread work from 6.2 s to somewhere near 2 s; and, most
importantly, a heap that settles instead of climbing.

---

## Confirmed vs. inferred

**Directly confirmed in the Lighthouse data:** all request counts, byte totals, status
codes, timings, and main-thread attributions; the three live documents; the 282 `blob:`
script URLs; the 1.47 MB CRDT fetch; the six requests for one 23.94 MB video; the
forced-reflow call sites; the 85 font requests.

**Inferred, and worth verifying in a browser:** that blob URLs are never revoked; that
WebGL contexts leak on remount (needs the resize test); that per-character spans are what
drives the style-and-layout cost; and whether the editor runtime loads for anonymous
visitors. That last one is the single most important thing to check, and it takes about
thirty seconds.

**Not measurable from this report:** actual resident memory over time. A DevTools Memory
timeline with heap snapshots taken 30 s apart on an idle tab would confirm the growth rate
directly and is worth capturing before and after the fixes above.
