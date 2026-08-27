/*!
 * SMRT signup-link decorator
 * ---------------------------------------------------------------------------
 * Drop this on every page of the client's marketing site. It:
 *
 *   1. Detects a paid/tagged arrival (utm_*, gclid, fbclid, msclkid, or ?src=)
 *   2. Remembers it on FIRST touch, so it survives browsing to other pages
 *   3. Rewrites every signup link on the page to carry the campaign payload
 *   4. Replaces the legacy hardcoded default (?referral_source=Website) rather
 *      than leaving it in place — see REPLACEABLE_DEFAULTS
 *   5. Optionally fires a gtag event when a signup link is actually clicked
 *
 * IMPORTANT — read attribution/README.md before expecting SMRT records to
 * change. The SMRT customer app currently ignores unknown query parameters, so
 * today this script's value is Google-side conversion tracking and on-site
 * funnel measurement. The payload is deliberately shaped so that nothing here
 * needs to change on the day SMRT starts accepting it.
 *
 * No dependencies. Fails silently. Never blocks page render.
 */
(function () {
  'use strict';

  var CONFIG = {
    /* Every host that serves your signup flow. Exact hostnames, no wildcards. */
    signupHosts: ['helenascleaners.smrtapp.com'],

    /* Param carrying the canonical source. Name it for the field you intend to
       land in, so the link is already correct once SMRT accepts it. */
    sourceParam: 'referral_source',

    /* Values we are allowed to overwrite because they are legacy defaults, not
       deliberate per-placement tags. A hardcoded value NOT listed here (e.g.
       Hotel-Marriott-Downtown on a partner link) is left untouched. */
    replaceableDefaults: ['website', 'direct', ''],

    /* Closed vocabulary. Anything unmapped becomes fallbackSource, and the raw
       value is still forwarded so it stays recoverable. Keep this list in sync
       with whatever the canonical taxonomy ends up being. */
    sourceMap: {
      google: 'Google-Ads',
      bing: 'Bing-Ads',
      facebook: 'Facebook',
      fb: 'Facebook',
      instagram: 'Instagram',
      ig: 'Instagram',
      nextdoor: 'Nextdoor',
      yelp: 'Yelp',
      email: 'Email',
      mailer: 'Mailer',
      qr: 'QR-Code'
    },
    fallbackSource: 'Other',

    /* Params forwarded verbatim alongside the canonical value. */
    passthrough: [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid'
    ],

    /* 'local'  = survives across visits for ttlDays (catches delayed signups,
                  harder consent conversation in the EU)
       'session'= this visit only (no cross-visit persistence) */
    persistence: 'local',
    ttlDays: 30,
    storageKey: 'smrt_attr_v1',

    /* Set to null to disable. Requires gtag() already on the page. */
    gtagEvent: 'signup_link_click',

    debug: false
  };

  /* ----------------------------------------------------------------------- */

  function log() {
    if (!CONFIG.debug || typeof console === 'undefined') return;
    try { console.log.apply(console, ['[smrt-attr]'].concat([].slice.call(arguments))); } catch (e) {}
  }

  function store() {
    try {
      return CONFIG.persistence === 'session' ? window.sessionStorage : window.localStorage;
    } catch (e) {
      return null; // private mode, storage disabled, sandboxed iframe
    }
  }

  /* Read the tagged params off the current URL. Returns null when untagged. */
  function readCurrent() {
    var q;
    try { q = new URLSearchParams(window.location.search); } catch (e) { return null; }

    var found = {};
    var tagged = false;

    for (var i = 0; i < CONFIG.passthrough.length; i++) {
      var k = CONFIG.passthrough[i];
      var v = q.get(k);
      if (v) { found[k] = v; tagged = true; }
    }

    /* ?src=QR-Kiosk-3 — an explicit override for QR codes and partner links,
       where there is no ad platform to supply a utm_source. */
    var explicit = q.get('src');
    if (explicit) { found.src = explicit; tagged = true; }

    return tagged ? found : null;
  }

  /* Collapse a raw payload to one canonical source value. */
  function deriveSource(p) {
    if (p.src) return p.src;                       // explicit wins, already canonical

    var raw = (p.utm_source || '').toLowerCase().trim();
    if (raw && CONFIG.sourceMap[raw]) return CONFIG.sourceMap[raw];

    /* No usable utm_source but a click id is present — infer the network. */
    if (p.gclid || p.gbraid || p.wbraid) return CONFIG.sourceMap.google;
    if (p.fbclid) return CONFIG.sourceMap.facebook;
    if (p.msclkid) return CONFIG.sourceMap.bing;

    return raw ? CONFIG.fallbackSource : null;
  }

  /* First touch wins: never overwrite a stored, unexpired record. */
  function load() {
    var s = store();
    if (!s) return null;
    try {
      var rec = JSON.parse(s.getItem(CONFIG.storageKey) || 'null');
      if (!rec || !rec.t) return null;
      if (CONFIG.persistence === 'local' && CONFIG.ttlDays > 0) {
        var age = Date.now() - rec.t;
        if (age > CONFIG.ttlDays * 864e5) { s.removeItem(CONFIG.storageKey); return null; }
      }
      return rec;
    } catch (e) { return null; }
  }

  function save(rec) {
    var s = store();
    if (!s) return;
    try { s.setItem(CONFIG.storageKey, JSON.stringify(rec)); } catch (e) {}
  }

  function isSignupHost(host) {
    for (var i = 0; i < CONFIG.signupHosts.length; i++) {
      if (host.toLowerCase() === CONFIG.signupHosts[i].toLowerCase()) return true;
    }
    return false;
  }

  /* Rewrite one anchor. Uses the URL API, so params always land before any
     '#' fragment — a hash-routed target would otherwise never see them. */
  function decorateAnchor(a, rec) {
    var href = a.getAttribute('href');
    if (!href) return false;

    var u;
    try { u = new URL(href, window.location.href); } catch (e) { return false; }
    if (!isSignupHost(u.hostname)) return false;

    var existing = u.searchParams.get(CONFIG.sourceParam);
    var replaceable = existing === null ||
      CONFIG.replaceableDefaults.indexOf(String(existing).toLowerCase()) !== -1;

    if (replaceable && rec.source) {
      u.searchParams.set(CONFIG.sourceParam, rec.source);
    }

    /* Forward the raw payload, never clobbering something already on the URL. */
    for (var k in rec.raw) {
      if (!Object.prototype.hasOwnProperty.call(rec.raw, k)) continue;
      if (k === 'src') continue;
      if (!u.searchParams.get(k)) u.searchParams.set(k, rec.raw[k]);
    }

    var next = u.toString();
    if (next !== href) { a.setAttribute('href', next); return true; }
    return false;
  }

  function decorateAll(rec) {
    var links = document.querySelectorAll('a[href]');
    var n = 0;
    for (var i = 0; i < links.length; i++) { if (decorateAnchor(links[i], rec)) n++; }
    log('decorated', n, 'of', links.length, 'links ->', rec.source);
    return n;
  }

  function onClick(rec, e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;

    /* Re-decorate at click time so links injected after load are covered. */
    var u;
    try { u = new URL(a.getAttribute('href'), window.location.href); } catch (err) { return; }
    if (!isSignupHost(u.hostname)) return;

    decorateAnchor(a, rec);

    if (CONFIG.gtagEvent && typeof window.gtag === 'function') {
      try {
        window.gtag('event', CONFIG.gtagEvent, {
          source: rec.source || 'unknown',
          campaign: rec.raw.utm_campaign || '',
          medium: rec.raw.utm_medium || ''
        });
      } catch (err) {}
    }
  }

  function init() {
    var current = readCurrent();
    var rec = load();

    if (current && !rec) {
      rec = { source: deriveSource(current), raw: current, t: Date.now() };
      save(rec);
      log('first touch stored', rec);
    } else if (rec) {
      log('using stored first touch', rec);
    }

    /* Untagged visit with nothing remembered — do nothing at all. */
    if (!rec) { log('no attribution, no-op'); return; }

    decorateAll(rec);

    document.addEventListener('click', function (e) {
      try { onClick(rec, e); } catch (err) { log('click handler error', err); }
    }, true);
  }

  try {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        try { init(); } catch (e) { log('init error', e); }
      });
    } else {
      init();
    }
  } catch (e) {
    log('fatal, ignored', e);
  }
})();
