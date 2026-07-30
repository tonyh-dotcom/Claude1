# Session Change Log — July 30, 2026

**Campaign:** SMRT Marketing Pmax (23591020213) | **Account:** 950-036-5037
All changes additive; budget, bid strategy, goals, conversion setup untouched.

## ✅ Changes made via API (verified with read-backs)

### Main asset group (6677742762) text refresh
- **Removed** description: "Dry cleaning, professional laundry, wash-dry-fold, stain removal, home fabrics care" (moves W&F messaging to the dedicated new group — de-overlap)
- **Added** description: "Dry cleaning, expert garment care, stain removal, wedding gowns, bedding & drapery care."
- **Removed** headline: "NC Dry Cleaners" (weak/generic)
- **Added** headline: "Coastal Pickup & Delivery" (matches coastal-route positioning without naming a town)
- Note: **no "Hampstead" text existed in the asset group via API** — the Jul 23 de-localization appears already done. Group re-entered normal review after edits (serving: PENDING — ASSET_GROUP_UNDER_REVIEW, temporary).
- Headlines/long headlines/descriptions otherwise at caps (15/5/5) and performing (Ad Strength was EXCELLENT) — no further churn by design.

### Sitelinks rebuilt for the new website
- **Removed 11 campaign-level sitelinks** (old duplicates/stale anchors).
- **Added 9 clean sitelinks, all with 2-line descriptions**: Home, Schedule a Pickup (→ smrtapp /custx/login), Our Services (→ /services), Pricing, Coastal Route, Wash-Dry-Fold (→ /services#wash-dry-fold), Uniform Services (→ /services#uniform-services), Locations, Contact Us (→ /contact).
- Stale `/#services` and `/#contact` anchors replaced with real pages confirmed live on the new site.

## ⚠️ Requires UI (known Adspirer limitations)

1. **Old sitelinks still attached at account level** — read-back after removal still lists the legacy 14 (3× SMRT-app links, dup Contact/Services, About). Remove in UI: Assets → Sitelinks → account-level associations. Also purge the unrelated Canva-demo sitelinks sitting in the asset library (punggolgolfacademy / lucky7pizza / emergencydentist / finestshinedetail / jcpromo222).
2. **Create the Wash & Fold asset group** — blocked via API because Brand Guidelines campaigns reject group-level business-name/logo links that Adspirer always sends. Full paste-ready build sheet: `WASH_FOLD_BUILD_SHEET.md`. Create it **PAUSED**.
3. **Verify image performance labels** — API returns UNSPECIFIED for all 20 main-group images (tool did not return data). June baseline said 13 LOW / 2 BEST. Confirm in UI before swapping.

## 🎯 Targeting verification (read-only — no changes)

**Geo (resolved from criterion IDs):**
- Targeted: Holly Ridge (city), Surf City (city), Topsail Beach (city), Hampstead (zip 28443), N. Wilmington/Porters Neck-Ogden (zip 28411), **Leland (zip 28451)**, Landfall Wilmington (neighborhood)
- Excluded: Castle Hayne (28429), Rocky Point (28457)
- **Flag 1:** Leland zip is actively targeted despite the Jul 23 "wait for 100–1,000 search volume" decision. Wes edits areas himself — confirm with him whether this stays.
- **Flag 2:** Jacksonville, Wallace, Sneads Ferry, Kenansville, Camp Lejeune are NOT geo-targeted, yet 20 of the 50 search themes reference them. If location targeting is "presence only," those themes can't do their job — check the campaign's location option in UI (likely "presence or interest," in which case it works as designed).
- The geo set reads as a deliberate affluent-coastal-corridor build (Landfall, Porters Neck, waterfront towns) — consistent with Wes's high-end-clientele direction.

**Audience signal (main group):** Fashion (90101), Fashionistas (92504), Business Professionals (92913), Business Travelers (92924), Apparel (93036), + 2 segments in the fashion/travel families (90109, 91500 — names not resolvable via API, verify in UI; likely Formalwear and Travel Buffs) + 5 custom audiences. Matches the agreed high-end persona. **No changes made; DC-trips/car-rental overlap left alone per standing rule.**

## 🖼️ Creative produced (Canva, delivered as PNG)

**Wash & Fold set** (for the new group): wf_landscape 1200×628, wf_square 1200×1200, wf_portrait 1080×1350 — folded towels, coastal teal, "Wash & Fold" + brand line.
**Dry cleaning refresh set** (for main group image swaps once LOW labels are confirmed in UI): dc_landscape 1200×628, dc_square 1200×1200, dc_portrait 1080×1350 — premium pressed shirts/suits on rack, no text overlay (Google best practice).
Main group is at its 20-image cap — remove confirmed-LOW images in UI first, then upload replacements (API can do the upload once slots free up).

## Asset assessment (Task: keep vs replace)
- **Keep:** storefront landscape (1536×803) and Logo on Garment Bag Tag — the two BEST-rated at June baseline; all 5 videos; refreshed text assets.
- **Replace-first candidates (pending UI label confirm):** the near-duplicate "Logo on X" square mockup series (Counter Sign, Packaging Seal, Laundry Bag, Dry Cleaning Rack) — 4-5 similar logo mockups add little signal diversity; and the low-res 864px "Vintage Charm"/"Personal Service" AI renders. Swap toward real photography when Jason's photos arrive (still priority #1).

## Still open
- Jason's photos (blocks the full image refresh) — priority 1
- SEO re-optimization of new site
- Leland targeting confirmation with Wes
- Enable Wash & Fold group after Wes's review, then remove the 5 W&F themes from the main group
