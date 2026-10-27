import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const code = ts.transpileModule(fs.readFileSync('src/lib/analytics-consent.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
function setup(hostname = 'www.lafabric.ca') {
  const window = {}, scripts = [], cookies = [];
  const document = {
    get cookie() { return '_ga=test; _gcl_au=test; preference=keep'; },
    set cookie(value) { cookies.push(value); },
    createElement() { return { remove() {} }; },
    head: { appendChild(script) {
      const queue = window.dataLayer.map(args => Array.from(args));
      assert.equal(queue[0][0], 'consent');
      assert.equal(queue[0][1], 'default');
      assert.equal(queue[0][2].ad_storage, 'denied');
      assert.equal(queue[1][1], 'update');
      assert.equal(queue[1][2].ad_personalization, 'denied');
      assert.equal(queue.at(-1)[0], 'config');
      scripts.push(script);
    } },
  };
  const exports = {};
  vm.runInNewContext(code, { exports, window, document, location: { hostname } });
  return { apply: exports.applyAnalyticsConsent, window, scripts, cookies };
}
const test = setup();
test.apply(null); test.apply('declined');
assert.equal(test.scripts.length, 0);
test.apply('accepted');
assert.equal(test.scripts.length, 1);
assert.equal(test.window['ga-disable-G-H3XMDY9CM0'], false);
test.apply('accepted');
assert.equal(test.scripts.length, 1);
test.apply(null);
assert.equal(test.window['ga-disable-G-H3XMDY9CM0'], true);
assert.equal(test.window.dataLayer.at(-1)[2].ad_storage, 'denied');
assert(test.cookies.some(c => c.startsWith('_ga=')));
assert(test.cookies.some(c => c.startsWith('_gcl_au=')));
assert(!test.cookies.some(c => c.startsWith('preference=')));
test.apply('accepted');
assert.equal(test.scripts.length, 1);
assert.equal(test.window.dataLayer.filter(a => a[0] === 'config').length, 1);
const preview = setup('preview.vercel.app');
preview.apply('accepted');
assert.equal(preview.scripts.length, 0);
console.log('PASS: consent before script, refusal, acceptance, withdrawal, reacceptance, cookies, single initialization, preview exclusion.');
