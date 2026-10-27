/**
 * UI Field Guide · First-Time User Consent Mode v2 Physical Verification
 *
 * Verifies:
 * 1. A first-time user (zero historical consent in localStorage) receives regional default
 *    where analytics_storage='denied' for EEA/UK/CH, and global default for other regions.
 * 2. User consent toggle (setConsent(true)) transitions state to 'granted'.
 * 3. User consent toggle (setConsent(false)) transitions state to 'denied'.
 * 4. Pre-seeded states ('granted' / 'denied') are immediately applied on cold start.
 */

import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:3111';

console.log('============================================================');
console.log('First-Time User Consent Mode v2 Verification');
console.log('============================================================\n');

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) {
    console.log(`✓ ${msg}`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${msg}`);
    failed++;
  }
}

const browser = await chromium.launch();

// -------------------------------------------------------------
// Test 1: First-time user with zero historical consent
// -------------------------------------------------------------
console.log('Test 1: First-time user with NO historical consent in localStorage...');
const ctx1 = await browser.newContext();
const page1 = await ctx1.newPage();

await page1.goto(`${BASE}/patterns/modal/`, { waitUntil: 'networkidle' });
await page1.waitForTimeout(500);

// Check that localStorage is empty
const initialStored = await page1.evaluate(() => localStorage.getItem('uifg.consent.v1'));
assert(initialStored === null, 'First-time user: localStorage.getItem("uifg.consent.v1") is null');

// Inspect dataLayer consent commands
const consentCalls = await page1.evaluate(() => {
  return (window.dataLayer || []).filter(item => item[0] === 'consent');
});

assert(consentCalls.length >= 2, 'Consent Mode v2: Registered both regional and global defaults');

// Find regional default for EEA / UK / CH
const regionalDefault = consentCalls.find(
  c => c[1] === 'default' && Array.isArray(c[2]?.region) && c[2].region.includes('DE')
);
assert(!!regionalDefault, 'Consent Mode v2: Regional default exists for EEA/UK/CH');
assert(regionalDefault[2]?.analytics_storage === 'denied', 'Privacy Gate: Regional default analytics_storage is strictly "denied"');
assert(regionalDefault[2]?.ad_storage === 'denied', 'Privacy Gate: Regional default ad_storage is strictly "denied"');
assert(regionalDefault[2]?.ad_user_data === 'denied', 'Privacy Gate: Regional default ad_user_data is strictly "denied"');
assert(regionalDefault[2]?.ad_personalization === 'denied', 'Privacy Gate: Regional default ad_personalization is strictly "denied"');

// Find global fallback default for non-sensitive regions
const globalDefault = consentCalls.find(
  c => c[1] === 'default' && !c[2]?.region
);
assert(!!globalDefault, 'Consent Mode v2: Global fallback default exists');
assert(globalDefault[2]?.analytics_storage === 'granted', 'Consent Mode v2: Non-sensitive regions default analytics_storage is "granted"');
assert(globalDefault[2]?.ad_storage === 'denied', 'Privacy Gate: Global fallback ad_storage is strictly "denied"');
assert(globalDefault[2]?.ad_user_data === 'denied', 'Privacy Gate: Global fallback ad_user_data is strictly "denied"');
assert(globalDefault[2]?.ad_personalization === 'denied', 'Privacy Gate: Global fallback ad_personalization is strictly "denied"');

// Verify that NO update call was fired for first-time user (preserving default)
const updatesFirstTime = consentCalls.filter(c => c[1] === 'update');
assert(updatesFirstTime.length === 0, 'First-time user: No update call fired (defaults preserved)');

// -------------------------------------------------------------
// Test 2: User explicitly grants consent
// -------------------------------------------------------------
console.log('\nTest 2: User explicitly grants consent via window.setConsent(true)...');
await page1.evaluate(() => {
  window.setConsent(true);
});
await page1.waitForTimeout(300);

const storedAfterGrant = await page1.evaluate(() => localStorage.getItem('uifg.consent.v1'));
assert(storedAfterGrant === 'granted', 'Consent Transition: localStorage updated to "granted"');

const callsAfterGrant = await page1.evaluate(() => {
  return (window.dataLayer || []).filter(item => item[0] === 'consent' && item[1] === 'update');
});
assert(callsAfterGrant.length === 1, 'Consent Transition: gtag("consent", "update") fired on user grant');
assert(callsAfterGrant[0][2]?.analytics_storage === 'granted', 'Consent Transition: analytics_storage updated to "granted"');

// -------------------------------------------------------------
// Test 3: User explicitly revokes consent
// -------------------------------------------------------------
console.log('\nTest 3: User explicitly revokes consent via window.setConsent(false)...');
await page1.evaluate(() => {
  window.setConsent(false);
});
await page1.waitForTimeout(300);

const storedAfterRevoke = await page1.evaluate(() => localStorage.getItem('uifg.consent.v1'));
assert(storedAfterRevoke === 'denied', 'Consent Transition: localStorage updated to "denied"');

const callsAfterRevoke = await page1.evaluate(() => {
  return (window.dataLayer || []).filter(item => item[0] === 'consent' && item[1] === 'update');
});
assert(callsAfterRevoke.length === 2, 'Consent Transition: gtag("consent", "update") fired on user revoke');
assert(callsAfterRevoke[1][2]?.analytics_storage === 'denied', 'Consent Transition: analytics_storage updated to "denied"');

await ctx1.close();

// -------------------------------------------------------------
// Test 4: Returning user with pre-seeded 'granted'
// -------------------------------------------------------------
console.log('\nTest 4: Returning user with historical "granted" consent...');
const ctx2 = await browser.newContext();
const page2 = await ctx2.newPage();

await page2.addInitScript(() => {
  localStorage.setItem('uifg.consent.v1', 'granted');
});
await page2.goto(`${BASE}/patterns/tabs/`, { waitUntil: 'networkidle' });
await page2.waitForTimeout(500);

const callsReturningGranted = await page2.evaluate(() => {
  return (window.dataLayer || []).filter(item => item[0] === 'consent');
});
const defaultReturningGranted = callsReturningGranted.find(c => c[1] === 'default');
assert(defaultReturningGranted?.[2]?.analytics_storage === 'granted', 'Returning Granted: analytics_storage initialized as "granted" on startup');

await ctx2.close();

// -------------------------------------------------------------
// Test 5: Returning user with pre-seeded 'denied'
// -------------------------------------------------------------
console.log('\nTest 5: Returning user with historical "denied" consent...');
const ctx3 = await browser.newContext();
const page3 = await ctx3.newPage();

await page3.addInitScript(() => {
  localStorage.setItem('uifg.consent.v1', 'denied');
});
await page3.goto(`${BASE}/patterns/tabs/`, { waitUntil: 'networkidle' });
await page3.waitForTimeout(500);

const callsReturningDenied = await page3.evaluate(() => {
  return (window.dataLayer || []).filter(item => item[0] === 'consent');
});
const defaultReturningDenied = callsReturningDenied.find(c => c[1] === 'default');
assert(defaultReturningDenied?.[2]?.analytics_storage === 'denied', 'Returning Denied: analytics_storage initialized as "denied" on startup');

await ctx3.close();
await browser.close();

console.log('\n============================================================');
console.log(`Summary: ${passed} passed, ${failed} failed`);
console.log('============================================================\n');

if (failed > 0) process.exit(1);
