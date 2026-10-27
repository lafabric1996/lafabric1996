// Isolated regression tests: no email or analytics network request is made.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import ts from 'typescript';
const calls = [];
let fail = false;
const resend = { Resend: class { emails = { send: async (...args) => { calls.push(args); return fail ? { error: { message: 'Simulated failure' } } : { data: { id: 'test' }, error: null }; } }; } };
function load(path, extras) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { exports, Object, console: { error() {} }, process: { env: { RESEND_API_KEY: 'mock-only' } }, ...extras });
  return exports;
}
const { sendContactMessage } = load('src/lib/actions/contact.ts', { require(name) {
  if (name === 'node:crypto') return crypto;
  if (name === 'resend') return resend;
  if (name === '@/lib/realisations') return { realisations: [{ slug: 'test-project', title: 'Test project' }] };
  throw new Error(name);
} });
const id = crypto.randomUUID();
function data(overrides = {}) {
  const f = new FormData();
  for (const [key, value] of Object.entries({ prenom: 'Test', nom: 'Technique', courriel: 'test@example.com', telephone: '', municipality: 'Montréal', service: 'resurfacage', message: 'TEST SIMULÉ — aucun envoi', source: 'google', requestId: id, projectReference: 'test-project', ...overrides })) f.set(key, value);
  return f;
}
for (const [overrides, errorKey] of [[{ municipality: '' }, 'missingFields'], [{ courriel: 'bad' }, 'invalidEmail'], [{ service: 'other' }, 'missingFields'], [{ municipality: 'x'.repeat(121) }, 'tooLong'], [{ source: '__proto__' }, 'missingFields']]) {
  const result = await sendContactMessage({}, data(overrides));
  assert.equal(result.status, 'error'); assert.equal(result.errorKey, errorKey);
}
assert.equal(calls.length, 0);
const spam = await sendContactMessage({}, data({ website: 'spam' }));
assert.equal(spam.requestId, undefined); assert.equal(calls.length, 0);
const result = await sendContactMessage({}, data());
assert.equal(result.requestId, id);
assert.deepEqual(Array.from(calls[0][0].to), ['info@lafabric.ca', 'louis@lafabric.ca']);
assert.match(calls[0][0].text, /Municipalité : Montréal/);
assert.match(calls[0][0].text, /Source déclarée par le client : Recherche Google/);
assert.match(calls[0][0].text, /Test project/);
await sendContactMessage({}, data());
assert.equal(calls[0][1].idempotencyKey, calls[1][1].idempotencyKey);
await sendContactMessage({}, data({ message: 'Corrected request', service: 'ebenisterie' }));
assert.notEqual(calls[0][1].idempotencyKey, calls[2][1].idempotencyKey);
assert.deepEqual(Array.from(calls[2][0].to), ['info@lafabric.ca']);
fail = true;
assert.equal((await sendContactMessage({}, data())).status, 'error');
const events = [];
let consent = 'declined';
const location = { hostname: 'www.lafabric.ca' };
const { trackContactEvent } = load('src/lib/analytics.ts', { window: { gtag: (...args) => events.push(args) }, location, localStorage: { getItem: (key) => key === "lafabric-analytics-consent-v2" ? consent : null } });
trackContactEvent('generate_lead', 'resurfacage'); assert.equal(events.length, 0);
consent = 'accepted'; location.hostname = 'preview.vercel.app';
trackContactEvent('generate_lead', 'resurfacage'); assert.equal(events.length, 0);
location.hostname = 'www.lafabric.ca';
trackContactEvent('generate_lead', 'resurfacage');
trackContactEvent('contact_phone_click', 'ebenisterie');
assert.equal(events.length, 2);
assert.equal(events[0][1], 'generate_lead');
assert.deepEqual(Object.keys(events[0][2]).sort(), ['contact_method', 'service']);
console.log('PASS: validation, honeypot, recipients, reference, idempotency, failure, consent, preview exclusion and event fields. No messages sent.');
