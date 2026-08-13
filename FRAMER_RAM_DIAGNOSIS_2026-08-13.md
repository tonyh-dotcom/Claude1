# SMRT Website — Browser Memory Exhaustion Diagnosis

**Live site:** https://smrtsystems.com/ (confirmed serving 200, 449 KB of HTML)
**Staging evidence:** Lighthouse 13.4.0 report for `smrtwebsite.framer.website`, captured 2026-08-12
**Live evidence:** production HTML and JS fetched anonymously 2026-08-13
**Status:** Live and crashing machines. Two P0s, one with a 30-second personal workaround.

---

## Stop your PC crashing first — do this now

Your browser has a Framer flag set in local storage for `smrtsystems.com`. That flag,
and only that flag, is what makes the page boot the entire Framer design editor on every
load. Clearing it should stop your crashes immediately, without touching the site.

**Clear it without loading the page** (loading it is what crashes you):

1. In Chrome, go to `chrome://settings/content/all?searchSubpage=smrtsystems.com`
2. Find `smrtsystems.com` and click the trash icon to delete its stored data.
3. Also sign out of `framer.com` in that browser, or keep a separate browser profile for
   Framer work and never browse the live site from it.

The key being cleared is `__framer_force_showing_editorbar_since`. If you would rather
verify before deleting, open the site with JavaScript disabled for that origin, then run
`localStorage.getItem('__framer_force_showing_editorbar_since')` in the console — a
non-null value confirms it.

This is a workaround for you, not a fix for the site. The site still ships the code path
to every visitor, and the video problem below hits everyone regardless.

---

## Note on the evidence, and two corrections

The file supplied as "the test site code" was not the site's HTML — it was a **Lighthouse
report**, with 1.6 MB of audit JSON embedded. That proved more useful than markup would
have, because it carries the network waterfall and main-thread trace. Now that the site is
live, I also pulled the production HTML and JS directly and re-checked every claim.

Two corrections to what the staging evidence suggested:

- **`framer.link` is not on the live site.** An earlier grep of mine reported 530
  occurrences. That was a regex artifact — the `.` matched the hyphen in Framer's own
  `framer-link` CSS class. The literal count is **zero**. The affiliate-link P0 from the
  pre-launch audit appears resolved on production.
- **The unicorn.studio WebGL layer is not on the live homepage.** Zero references in
  production HTML. It was in the staging build. The WebGL finding below is retained for
  reference but **does not apply to the live homepage** — check other pages before acting
  on it.

Production is, however, **worse than staging in the one place that matters most**: the
hero video is bigger.

---

## The two P0s

### P0-1 — The live site ships Framer's On-Page Editing, which boots the whole editor

This is your crash, and it is now confirmed in production HTML fetched with no Framer
session at all.

The published page carries this gate in `<head>`:

```js
try{
  if(localStorage.getItem("__framer_force_showing_editorbar_since")){
    const n=document.createElement("link");
    n.rel="modulepreload";
    n.href="https://framer.com/edit/init.mjs";
    document.head.appendChild(n)
  }
}catch(e){}
```

And the site's main bundle, `script_main.DmvqdYT3.mjs`, contains the import that actually
runs it:

```js
EditorBar: a === void 0 ? void 0 : (() => {
  if (K) { console.log(`[Framer On-Page Editing] Unavailable because navigator is bot`); return }
  return w(async () => {
    a.__framer_editorBarDependencies = { __version: 3, framer: {…}, react: {…} };
    let { createEditorBar: e } = await import(`https://framer.com/edit/init.mjs`);
    return { default: e() }
  })
})()
```

Two guards, and neither protects a real user: `a === void 0` is a server-side-rendering
check, and `K` is a **bot user-agent check**.

**That bot check is why nobody caught this before launch.** Lighthouse, PageSpeed
Insights, and essentially every automated auditing tool identify as bots, so they take the
early return and never load the editor. The problem is invisible to automated testing by
construction. It only appears in a real browser — which is why it reached production and
why it is your machine that dies rather than a monitoring dashboard.

What loads once that import fires, measured from the staging trace where it did run:

| What it pulls in | Requests | Bytes |
|---|---|---|
| `app.framerstatic.com` editor bundles | 269 | 4.17 MB |
| `framercanvas.com` editor application | 291 | — |
| `blob:` scripts from in-browser compilation | **282** | — |
| Project source, including 76 raw `.tsx` files | 338 | 2.10 MB |
| Multiplayer CRDT project document | 2 | 1.47 MB |
| Full Google Fonts catalog (editor font picker) | 4 | 0.94 MB |
| Full Fontshare catalog (editor font picker) | 14 | 0.47 MB |
| **Total** | **928** | **9.15 MB** |

Three documents end up live in one tab — the site, `framer.com/edit`, and the full editor
app on `framercanvas.com` — each with its own JS heap, React tree, and listeners.

**Why it behaves as a leak rather than as bloat:**

1. **282 `blob:` script URLs.** The editor fetches the project's TypeScript and compiles it
   in-browser, publishing each module as an object URL. A blob passed to
   `createObjectURL()` is pinned until `revokeObjectURL()` is called — GC cannot reclaim
   it, because the URL string is a live reference. That is a floor of 282 retained modules
   that never drops. *(That they are never revoked is inference from the count and the RAM
   behavior, not directly observable in the trace.)*
2. **A live CRDT replica and its websocket.** A CRDT keeps tombstones so replicas
   converge, so the structure grows with edit history and never shrinks. The opening
   snapshot alone is 1.47 MB and deltas keep arriving.
3. **It had not finished.** Editor requests were still firing at 12.8 s when Lighthouse
   stopped recording — the signature of a tab that grows until killed, not one that
   settles high.
4. **Garbage collection got 36 ms out of 6.2 s** of main-thread work. The heap is not
   being reclaimed because almost none of it is reclaimable.

**Fix:**

1. **Turn off On-Page Editing** for the published site in Framer's site settings. That
   removes the code path for everyone. This is the actual fix.
2. **Clear the local-storage flag** on every machine that has browsed the site while
   signed into Framer — see the top of this document. This is what stops the crashes today.
3. **If Framer offers no toggle on the current plan**, escalate with the two code excerpts
   above. A published marketing site compiling 338 source modules and loading a 1.47 MB
   collaborative document in a visitor's browser is not intended behavior.
4. **Separate browser profiles** for building and for viewing, permanently.

### P0-2 — 38.6 MB of video, and the big file is wired to two elements

Confirmed in live production HTML. Three `<video>` elements, two pointing at the same file:

```html
<video src="…/wn1Qnn9RVuBbmppnl8PoCi0uLdk.mp4" loop preload="none" muted playsinline>
<video src="…/uK3EmC6oURVtNKip3Y9EPF54vvI.mp4" loop preload="none" muted playsinline>
<video src="…/wn1Qnn9RVuBbmppnl8PoCi0uLdk.mp4" loop preload="none" muted playsinline>
```

Actual properties, from `Content-Length` and the MP4 metadata on production:

| File | Size | Resolution | Duration | Audio | Elements |
|---|---|---|---|---|---|
| `wn1Qnn9RVuBbmppnl8PoCi0uLdk.mp4` | **28.90 MB** | 1280 × 720 | 29.3 s | none | **2** |
| `uK3EmC6oURVtNKip3Y9EPF54vvI.mp4` | **9.73 MB** | 1022 × 540 | 13.2 s | none | 1 |

Three important things follow from those numbers, and one of them **corrects the GPU
theory** — see the GPU section below.

**The resolution is fine. The bitrate is absurd.** 28.90 MB for 29.3 s of 720p with no
audio track is roughly **7.9 Mbps for 720p** — about eight times what that resolution
needs. The file is not too big because it is high-resolution; it is too big because it is
over-encoded and 29 seconds long. A 720p background loop should be 6–10 s at
1–1.5 Mbps, which is where the "under 1.5 MB" target comes from.

**The 28.90 MB file is loaded by two elements.** Desktop and mobile breakpoint variants
are both in the DOM (finding 16 of the pre-launch audit). The staging trace shows exactly
this: six range requests for one file, one pulling 23.94 MB.

**Neither file is fast-start optimized.** The `moov` metadata atom is not in the first
3 MB of either file — it sits at the end. A player therefore cannot begin until it has
fetched the tail, which is why the waterfall shows a small request, then a seek, then a
bulk transfer. Re-muxing with `-movflags +faststart` fixes this at zero quality cost.

Decoded-frame memory is real but modest here, because the resolution is modest: a 720p
RGBA frame is 3.5 MB, so a four-frame pipeline is ~14 MB per element, ~28 MB across all
three. All three carry `loop`, so those buffers are never released. And `preload="none"`
with **no `poster`** means the hero paints nothing until buffering starts — a large share
of the 3.1 s LCP.

**Fix:**

1. **Re-encode.** Keep 720p; cut duration to 6–10 s; H.264 at CRF 28–30; confirm no audio
   track; add a VP9/WebM alternate. Target under 1.5 MB, down from 28.90 MB.
2. **Re-mux with `-movflags +faststart`** so playback can begin without fetching the tail.
3. **One video element, not one per breakpoint.**
4. **Add a `poster`** — first frame as compressed WebP.
5. **Pause off-screen** with an `IntersectionObserver`.

---

## GPU load — you were right that it's the GPU, but it isn't the video

You asked me to check image and video scaling on the theory that oversized media is
saturating the GPU. Media scaling **is** a real problem here (details below), but it is not
what is loading your GPU. The videos are 720p and 540p — small. Their decoded frames total
roughly 28 MB. That does not saturate a modern GPU.

Here is what does.

### G1 — 252 elements animating a blur filter, all with the same signature

Every one of the 252 standalone `filter: blur()` declarations on the live homepage is an
inline style, and all 252 are structurally identical:

```
display:inline-block;
opacity:N;
filter:blur(Npx);
transform:translateX(Npx) translateY(Npx) scale(N) rotate(Ndeg) skewX(Ndeg) skewY(Ndeg)
```

Blur radii: 162 at `blur(10px)`, 90 at `blur(5px)`.

`display:inline-block` plus a per-element transform plus a blur is the signature of a
**per-character or per-word text reveal animation with the "blur" appear effect enabled**.
The page contains 1,074 `framer-text` spans; 252 of them are carrying an animated blur.

This is the GPU load, and the reason is how blur is implemented. A CSS blur filter cannot
be composited in place — the element must be rendered to an **offscreen render target**,
convolved in two passes (horizontal, then vertical), and composited back. That is three GPU
passes and one extra full-size texture allocation **per element, per frame**. With 252 such
elements animating simultaneously during a scroll reveal, the GPU is doing on the order of
750 render passes per frame, each with its own texture.

Every one of those elements also carries a `transform`, which promotes it to its own
compositor layer. Layers are not free: each holds a texture sized to its painted area.

### G2 — 32 `backdrop-filter: blur(14px)`

Separate from the above, and individually the most expensive compositing operation in CSS.
Unlike `filter`, `backdrop-filter` must **sample what is already painted behind the
element**, which forces the compositor to resolve and read back the backdrop, blur it, then
re-composite. It defeats most of the compositor's caching. Thirty-two of them on one page
is extreme.

### G3 — Display scaling multiplies every one of those textures

This is why it is *your* PC. Every compositor layer texture is allocated in **device**
pixels, not CSS pixels, so its memory scales with the square of the device pixel ratio.
At Windows display scaling of 150%, or on a HiDPI/4K panel at 200%, each of those 252 blur
render targets and every promoted layer is **2.25× to 4× larger** than on a 1× display.
The same page that is merely sluggish on a 1080p monitor can exhaust GPU memory on a
scaled 4K one.

### G4 — Images: no responsive variants, PNG, oversampled

Media scaling is genuinely wrong here, just not in the way that drives the GPU spike:

| Asset | Intrinsic | Megapixels | RGBA texture | `srcset` widths |
|---|---|---|---|---|
| `uRIbeeWITWmpS8EstcVwCV94A.png` | 1086 × 1448 | 1.57 MP | 6.0 MB | **[1086] only** |
| `K2AIthgGqNzPB5xQDcdacsBwpc.png` | 1086 × 1448 | 1.57 MP | 6.0 MB | **[1086] only** |
| `xHNc5yzExs1xiVmNkcB3qDIlY.png` | 1122 × 1402 | 1.57 MP | 6.0 MB | **[1122] only** |

Six `<img>` tags, three unique images — each one duplicated for the breakpoint variants.
Up to **36 MB of RGBA texture** for three screenshots.

Three defects:

1. **`srcset` offers exactly one width per image.** The `sizes` attribute is elaborate —
   `(min-width: 1200px) max(max((100vw - 192px) / 3, 1px), 100vw), …` — and completely
   inert, because there is only one candidate to choose from. A phone downloads and decodes
   the identical 1086 × 1448 asset a desktop does.
2. **They are PNG.** A 1.57 MP product screenshot as PNG is far larger than the same image
   as WebP or AVIF, and Lighthouse independently scores 351 KiB of savings on image
   delivery.
3. **They are oversampled against their display size.** `sizes` implies a three-column
   layout — roughly a 360 px column at 1200 px viewport — so a 1086 px-wide asset is about
   **3× wider than it is displayed**. Decoding and texturing happen at intrinsic size
   regardless of the CSS box, so the waste is paid in full.

### GPU fix, in order of impact

1. **Turn off the blur component of the text appear effect.** In Framer, the appear effect
   on those text layers has blur enabled; keep the fade and the slide, drop the blur. This
   removes ~750 GPU render passes per animated frame and is the single largest GPU win
   available. Visually it is a subtle change; measurably it is not.
2. **Animate whole headings instead of per character.** Takes 252 animated layers down to
   roughly a dozen — and independently fixes the screen-reader problem the pre-launch
   audit raised about split text being read one character at a time.
3. **Cut the `backdrop-filter` count.** For frosted panels over a static background, a
   semi-transparent solid fill is visually near-identical and costs nothing. Reserve
   `backdrop-filter` for the one or two places it genuinely reads as glass.
4. **Give the images real `srcset` variants** at 400 / 800 / 1200 px and serve WebP.
   Framer generates these automatically when the image is placed as a responsive image
   rather than a fixed asset — worth checking why it did not here.
5. **Re-encode the videos** per P0-2. Not the main GPU driver, but 38.6 MB of over-encoded
   video is worth removing anyway.
6. **Audit `will-change`.** 31 elements declare it (`transform` on 24, `transform, opacity`
   on 3, `width` on 3). `will-change` is meant to be applied immediately before an
   animation and removed after; left on permanently it pins a compositor layer and its
   texture for the life of the page.

### How to confirm this yourself in two minutes

In Chrome DevTools on the live site:

- **Rendering** panel → check **Layer borders**. Every orange/blue border is a compositor
  layer. Expect a great many over the animated headings.
- **Layers** panel → sort by memory. This gives the actual per-layer texture cost and will
  identify the worst offenders directly.
- **Performance** panel → record a scroll through the hero. Look for tall green
  "Composite Layers" and "Paint" bands, and check the GPU track.
- `chrome://gpu` → the process memory figure, watched while scrolling.

Do this before and after step 1. It is the cheapest way to prove where the load is.

---

## The compounding layer

### P1 — 85 font requests, 3.16 MB

| Family | Requests |
|---|---|
| Geist | 29 |
| Plus Jakarta Sans | 16 |
| Fira Sans Extra Condensed | 4 (~150 KB each) |
| Geist Mono | 2 |
| Inter | 2 |
| Space Grotesk, Instrument Sans | 1 each |
| Editor font pickers | 30 |

Twenty-nine Geist requests is not a decision anyone made — it is every weight and italic
of a variable family shipped as separate static files. The live HTML still references 51
font files. Fira Sans Extra Condensed is a fourth family that no audited part of the
design appears to use. Lighthouse scores 590 ms available from `font-display` alone.

**Fix:** audit which families and weights are actually used (expect two families, three or
four weights); drop Fira Sans Extra Condensed; move to variable fonts; set
`font-display: swap` and subset to Latin.

### P1 — Framer Motion at 3,002 ms of main-thread time

Main-thread work, 6.2 s total: Other 3,105 ms · Script evaluation 1,273 ms · Style &
layout 853 ms · Rendering 522 ms · Parse & compile 362 ms · **Garbage collection 36 ms**.

`motion.C_WWXFrT.mjs` alone accounts for 3,002 ms — more than the whole document's
1,425 ms — and appears twice in the forced-reflow table. The likely amplifier is finding 19
of the pre-launch audit: heading text split into per-character spans, each becoming an
animated node with its own transform and style recalculation, doubled across breakpoints.

**Fix:** animate whole headings rather than characters (which also fixes the screen-reader
problem the pre-launch audit raised); restrict animation to `transform` and `opacity`;
unmount reveal animations once played; honor `prefers-reduced-motion`.

### P1 — Breakpoint duplication multiplies everything above

Logged at P2 in the pre-launch audit. **Raise it to P1.** Live HTML is still 449 KB, so the
duplication survived launch. It is a multiplier, not an isolated issue: the 29 MB video
fetched by two elements, every font file requested twice, every animated span doubled.
Consolidating header, hero, footer, and marquee into single responsive components reduces
several problems at once.

### P1 — Retained for reference: WebGL layer (not on the live homepage)

The staging build loaded `unicornStudio.umd.js` (173 KB), `controls.umd.js` (248 KB, 71%
unused) and a 207 KB noise texture, together causing forced reflow from seven call sites.
**None of it appears in the live homepage HTML.** If it exists on other pages: remove
`controls.umd.js` (it is the authoring panel, not runtime), and verify contexts are
released via `loseContext()` on unmount, since browsers cap concurrent WebGL contexts
around sixteen and then start discarding them.

### P2 — New on production: a third-party licence-enforcement script

The live site loads `frameship-backend.account-ba7.workers.dev/static/js/licence-management.js`
(14.4 KB). It contains a `BANNER_HTML` template that renders a fixed-position overlay in
the lower-left of the page. This is a Framer template vendor's licence check, and it can
inject a visible banner onto your production marketing site under conditions you do not
control. Worth a decision before it surprises someone. Unrelated to memory.

Also still outstanding from the pre-launch audit: the document root is `<html dir="ltr">`
with **no `lang` attribute** (WCAG 3.1.1, Level A).

---

## Fix order

**RAM (your crashes):**

1. **Clear the local-storage flag** on affected machines — stops your crashes today.
2. **Disable On-Page Editing** in Framer site settings — removes the path for everyone.

**GPU (the load you saw in Task Manager):**

3. **Disable the blur on the text appear effect** — removes ~750 render passes per frame.
4. **Animate whole headings, not per character** — 252 animated layers down to ~12.
5. **Cut the 32 `backdrop-filter` blurs** to the one or two that genuinely need glass.
6. **Fix image delivery** — real `srcset` variants at 400/800/1200 px, WebP not PNG.

**Payload (every visitor):**

7. **Re-encode both videos** — 38.6 MB to under 3 MB, and re-mux with `+faststart`.
8. **Consolidate the hero to one video element.**
9. Cut the font set to what is used; move to variable fonts.
10. Consolidate remaining breakpoint variants.
11. Decide on the frameship licence script; add `lang="en"`.

**Expected result:** visitor payload from roughly 30 MB to 3–4 MB; requests from 1,090 to
under 120; main-thread work from 6.2 s toward 2 s; GPU compositing from 252 animated blur
layers to roughly a dozen plain ones; and a heap that settles rather than climbing.

---

## Confirmed vs. inferred

**Measured directly.** From live production: the local-storage gate and the
`framer.com/edit/init.mjs` import with its SSR and bot guards; three `<video>` elements
with two sharing one source; 28.90 MB and 9.73 MB video sizes from `Content-Length`;
449 KB of HTML; 51 font file references; no `lang` attribute; zero `framer.link`; zero
unicorn.studio; the frameship licence script and its banner template. From the staging
trace: all request counts, byte totals, timings, the three live documents, 282 `blob:`
URLs, the 1.47 MB CRDT fetch, six range requests for one video, seven forced-reflow call
sites, 36 ms of GC.

Also measured on live: 252 inline `filter: blur()` declarations (162 at 10px, 90 at 5px),
all sharing one signature; 32 `backdrop-filter: blur(14px)`; 31 `will-change` declarations;
1,074 `framer-text` spans; six `<img>` tags over three unique 1.57 MP PNGs, each with a
single-width `srcset`; both videos' resolution, duration, absent audio track, and
`moov`-at-end layout.

**Inferred — worth verifying.** That blob URLs are never revoked. That the 252 blurred
elements are the per-character text reveal (the style signature is strong evidence, but
confirm in the Layers panel). That clearing the local-storage flag is sufficient on its own
(an authenticated Framer session may re-set it — hence also signing out). The render-pass
and texture-memory figures are arithmetic from the declaration counts and standard blur
implementation, not measurements — the DevTools Layers panel will give you real numbers.

**Not verified.** I could not run a live browser measurement: this environment's proxy
refuses headless Chromium connections (it resets even on `example.com`), so I have no
before/after heap number, no layer-memory readout, and no GPU-process figure from
`smrtsystems.com` itself. Everything above is from static analysis of the served HTML and
JS plus the staging trace. Worth capturing on a real machine — a DevTools Memory timeline
with heap snapshots 30 s apart on an idle tab, before and after steps 1–4 — both to
confirm the growth rate and to prove the fix landed.
