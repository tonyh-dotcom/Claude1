import fs from 'fs';
const SRC = fs.readFileSync('/home/user/Claude1/attribution/smrt-link-decorator.js','utf8');

function makeAnchor(href){
  return {
    _h: href,
    getAttribute(){ return this._h; },
    setAttribute(_,v){ this._h = v; },
  };
}

function run({search, links, storageSeed=null, persistence='local'}) {
  const mem = { [ 'smrt_attr_v1' ]: storageSeed };
  const anchors = links.map(makeAnchor);
  const listeners = [];
  const sandbox = {
    window: {
      location: { search, href: 'https://www.helenascleaners.com/services' + search },
      localStorage: {
        getItem: k => (mem[k] === undefined ? null : mem[k]),
        setItem: (k,v) => { mem[k]=v; },
        removeItem: k => { delete mem[k]; },
      },
      sessionStorage: null,
      gtag: null,
    },
    document: {
      readyState: 'complete',
      querySelectorAll: () => anchors,
      addEventListener: (t,f) => listeners.push([t,f]),
    },
    URL, URLSearchParams, JSON, Date, Object, String, console,
  };
  sandbox.window.sessionStorage = sandbox.window.localStorage;
  const fn = new Function(...Object.keys(sandbox), SRC);
  fn(...Object.values(sandbox));
  return { hrefs: anchors.map(a=>a._h), stored: mem['smrt_attr_v1'] };
}

const SIGNUP = 'https://helenascleaners.smrtapp.com/custx/login';
let pass=0, fail=0;
function check(name, got, want){
  const ok = got === want;
  ok ? pass++ : fail++;
  console.log(`${ok?'PASS':'FAIL'}  ${name}`);
  if(!ok){ console.log(`   got:  ${got}\n   want: ${want}`); }
}

// 1. Google Ads click replaces the legacy hardcoded Website default
let r = run({
  search: '?utm_source=google&utm_medium=cpc&utm_campaign=brand&gclid=ABC123',
  links: [SIGNUP + '?referral_source=Website'],
});
check('replaces legacy ?referral_source=Website with Google-Ads',
  new URL(r.hrefs[0]).searchParams.get('referral_source'), 'Google-Ads');
check('forwards gclid', new URL(r.hrefs[0]).searchParams.get('gclid'), 'ABC123');
check('forwards utm_campaign', new URL(r.hrefs[0]).searchParams.get('utm_campaign'), 'brand');

// 2. Deliberate per-placement value must NOT be clobbered
r = run({
  search: '?utm_source=google&gclid=X',
  links: [SIGNUP + '?referral_source=Hotel-Marriott-Downtown'],
});
check('leaves deliberate partner value alone',
  new URL(r.hrefs[0]).searchParams.get('referral_source'), 'Hotel-Marriott-Downtown');

// 3. Untagged visit, nothing stored -> no change at all
r = run({ search: '', links: [SIGNUP + '?referral_source=Website'] });
check('untagged visit is a no-op', r.hrefs[0], SIGNUP + '?referral_source=Website');

// 4. First-touch persistence: later untagged page still decorates
const seeded = JSON.stringify({source:'Facebook', raw:{utm_source:'facebook',utm_campaign:'spring'}, t:Date.now()});
r = run({ search: '', links: [SIGNUP], storageSeed: seeded });
check('stored first touch decorates an untagged later page',
  new URL(r.hrefs[0]).searchParams.get('referral_source'), 'Facebook');

// 5. First touch wins over a new tag mid-session
r = run({
  search: '?utm_source=nextdoor',
  links: [SIGNUP],
  storageSeed: seeded,
});
check('first touch (Facebook) beats later Nextdoor tag',
  new URL(r.hrefs[0]).searchParams.get('referral_source'), 'Facebook');

// 6. Hash-routed signup URL: params must land before the '#'
r = run({
  search: '?utm_source=facebook&fbclid=F1',
  links: [SIGNUP + '#/step1'],
});
const u6 = new URL(r.hrefs[0]);
check('hash preserved', u6.hash, '#/step1');
check('params land in search, not hash', u6.searchParams.get('referral_source'), 'Facebook');

// 7. Non-signup hosts are never touched
r = run({
  search: '?utm_source=google&gclid=X',
  links: ['https://www.helenascleaners.com/pricing', 'https://facebook.com/helenas'],
});
check('leaves unrelated link 1 alone', r.hrefs[0], 'https://www.helenascleaners.com/pricing');
check('leaves unrelated link 2 alone', r.hrefs[1], 'https://facebook.com/helenas');

// 8. Unmapped utm_source -> fallback, raw still forwarded
r = run({ search: '?utm_source=weirdnetwork', links: [SIGNUP] });
const u8 = new URL(r.hrefs[0]);
check('unmapped source falls back to Other', u8.searchParams.get('referral_source'), 'Other');
check('raw unmapped value still recoverable', u8.searchParams.get('utm_source'), 'weirdnetwork');

// 9. gclid only, no utm_source at all (common with auto-tagging)
r = run({ search: '?gclid=AUTOTAG1', links: [SIGNUP + '?referral_source=Website'] });
check('gclid alone infers Google-Ads',
  new URL(r.hrefs[0]).searchParams.get('referral_source'), 'Google-Ads');

// 10. Explicit ?src= override for QR codes
r = run({ search: '?src=QR-Garment-Bag', links: [SIGNUP] });
check('explicit src= wins',
  new URL(r.hrefs[0]).searchParams.get('referral_source'), 'QR-Garment-Bag');
check('src not forwarded as junk param',
  new URL(r.hrefs[0]).searchParams.get('src'), null);

// 11. Expired localStorage record is discarded
const old = JSON.stringify({source:'Facebook', raw:{}, t: Date.now() - 40*864e5});
r = run({ search: '', links: [SIGNUP], storageSeed: old });
check('expired record ignored (>30d)', r.hrefs[0], SIGNUP);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
