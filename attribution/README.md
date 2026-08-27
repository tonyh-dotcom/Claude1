# Inbound ad tracking — signup-link decorator

One script on the client's marketing site. A tagged ad click lands on the **normal page**
(no duplicate landing pages), and every signup link on the site is rewritten to carry
where that visitor came from.

```
Ad click  →  helenascleaners.com/?utm_source=google&gclid=…   (normal page, tagged URL)
             ↓  script stores first touch
             browse /services, /pricing …                      (tag long gone from URL)
             ↓  script decorates from storage
Signup    →  helenascleaners.smrtapp.com/custx/login?referral_source=Google-Ads&utm_source=google&gclid=…
```

## Read this first — what it does and does not deliver today

| Outcome | Status |
|---|---|
| Per-ad Google Ads conversion tracking on signup-link clicks | ✅ Works now |
| On-site funnel measurement (which ad → which pages → clicked signup) | ✅ Works now |
| Signup links carry the correct source, per placement and per campaign | ✅ Works now |
| **The source landing on the SMRT customer record** | ⛔ **Blocked in SMRT** |

The SMRT customer app validates its query string against a hardcoded allow-list of ten
parameters and discards everything else, `referral_source` included. Verified across four
tenants on two different releases. See `../SMRT_UTM_ATTRIBUTION_RESEARCH.md`.

So this script is necessary but not sufficient for SMRT-side cohort analysis. It is
deliberately built so **nothing here changes** on the day SMRT accepts the parameter — the
link is already correct. Two things unblock the last row:

1. Run the five-minute test in the research doc. If prefill does work on some surface, this
   script already targets it.
2. Otherwise SMRT adds the params to the allow-list — a small change, since the
   query-string → custom-field plumbing already exists and runs.

**Do not** route the value through `group`, `agent`, or `pc` just because those survive.
`group` is master/sub **billing** (SMRT-dev configured), `agent` credits an employee, and
`pc` applies a real discount.

## Install

Paste before `</body>` on **every page**, not just the landing page:

```html
<script src="/js/smrt-link-decorator.js" defer></script>
```

Serving it from a versioned URL you control means mapping changes ship without the client
editing their site again.

Then edit `CONFIG` at the top of the file:

| Key | Set it to |
|---|---|
| `signupHosts` | Every signup hostname you use, e.g. `['helenascleaners.smrtapp.com']`. Exact hosts, no wildcards. |
| `sourceParam` | The param the signup link should carry. Default `referral_source`. |
| `replaceableDefaults` | Legacy values safe to overwrite. Ships as `['website','direct','']`. |
| `sourceMap` | `utm_source` → canonical value. Keep it a **closed list**. |
| `persistence` | `'local'` (survives visits, `ttlDays`) or `'session'` (this visit only). |
| `gtagEvent` | Event name fired on signup-link click, or `null` to disable. |

### The `replaceableDefaults` rule matters

Existing buttons already hardcode `?referral_source=Website`. A blanket "never overwrite an
existing param" rule — which is the obvious way to write this — would leave every paid
visitor stamped `Website` forever while the script looked like it was working. So the script
overwrites *known legacy defaults* and leaves *deliberate* values alone: a partner link
tagged `Hotel-Marriott-Downtown` is never touched.

## Google Ads setup — one config, not one link per ad

You do not need a separate URL or landing page per ad. Set a **final URL suffix** once at
account level and let ValueTrack fill it in per click:

```
utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}&utm_content={creative}
```

Keep auto-tagging on so `gclid` arrives too — the script infers `Google-Ads` from `gclid`
alone if `utm_source` is ever missing.

For QR codes, print signage, and partner placements where there is no ad platform, use the
explicit override instead: `?src=QR-Garment-Bag`. Values passed via `src` are used verbatim,
so keep them inside the canonical list.

## Verify it works

1. Load `https://<client-site>/?utm_source=google&gclid=TEST123`
2. Click through two other pages — the tag is gone from the address bar
3. Hover a Sign Up link: the href must show `referral_source=Google-Ads` and `gclid=TEST123`
4. Set `debug: true` and watch the console for `first touch stored` / `decorated N links`

## Tests

```
node attribution/test-decorator.mjs
```

17 cases covering: legacy-default replacement, deliberate values left alone, untagged no-op,
first-touch persistence across pages, first-touch beating a later tag, hash-routed targets,
unrelated hosts untouched, unmapped sources falling back while staying recoverable, `gclid`-only
auto-tagging, `src=` override, and TTL expiry. They stub the DOM, so no browser needed.

## Known gaps

- **Mobile click → desktop signup** is not recoverable by any script. This is the standing
  reason to keep a self-reported "How did you hear about us?" field.
- `sessionStorage` mode loses a visitor who returns days later; `local` mode catches them but
  is a harder consent conversation for EU clients. Decide deliberately.
- Storage sits on the **client's** domain, so their cookie/consent banner is what covers it.
- In-app browsers (Instagram, Facebook) sometimes strip referrers and isolate storage. The
  tagged URL still works; the cross-page persistence may not.
