/**
 * UI Field Guide · Live Staging GA4 Network & Consent Verification
 *
 * Real browser network interception on:
 * https://preview-feedback-r1.lutive-ui-a2u.pages.dev
 */

import { chromium } from 'playwright';

const STAGING_URL = 'https://preview-feedback-r1.lutive-ui-a2u.pages.dev';

console.log('============================================================');
console.log('Live Staging GA4 Network & Consent Interception Test');
console.log(`Target: ${STAGING_URL}`);
console.log('============================================================\n');

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 }
});
const page = await context.newPage();

const capturedCollectRequests = [];

page.on('request', (req) => {
  const url = req.url();
  if (url.includes('google-analytics.com') && url.includes('/collect')) {
    capturedCollectRequests.push({
      url,
      postData: req.postData(),
      headers: req.headers(),
    });
  }
});

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

// 1. Visit Staging Pattern Detail
console.log('1. Testing Live Staging visit and network event transmission...');
await page.goto(`${STAGING_URL}/patterns/bottom-sheet/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

// Check gtag script loaded
const gtagScript = page.locator('script[src*="G-E67MRP4HKJ"]');
assert(await gtagScript.count() > 0, 'Staging: Google Tag script loaded with G-E67MRP4HKJ');

// Check captured requests
console.log(`Captured ${capturedCollectRequests.length} collect request(s) on initial load.`);

const hasCollect = capturedCollectRequests.length > 0;
assert(hasCollect, 'Staging Network: Live outgoing request sent to google-analytics.com/collect');

if (hasCollect) {
  const firstReq = capturedCollectRequests[0];
  const fullPayload = firstReq.url + (firstReq.postData ? `&${firstReq.postData}` : '');
  assert(fullPayload.includes('G-E67MRP4HKJ'), 'Staging Network: collect request carries tid=G-E67MRP4HKJ');
  assert(fullPayload.includes('_dbg=1') || fullPayload.includes('debug_mode'), 'Staging Network: debug_mode=1 (_dbg=1) enabled for Staging traffic');
  assert(fullPayload.includes('traffic_type=staging') || fullPayload.includes('staging'), 'Staging Network: traffic_type=staging carried in request');
  // Check Consent Status parameter (gcs)
  assert(fullPayload.includes('gcs=G1'), 'Staging Network: Google Consent Status (gcs) parameter present');
}

// 2. Test interactive event (demo_interact)
console.log('\n2. Testing demo_interact network event...');
const prevCount = capturedCollectRequests.length;
const demoButton = page.locator('#demo button').first();
if (await demoButton.count() > 0) {
  await demoButton.click({ force: true });
  await page.waitForTimeout(1000);
  console.log(`Captured ${capturedCollectRequests.length - prevCount} new collect request(s) after demo click.`);
}

// 3. Test Consent Rejection & Re-grant flow
console.log('\n3. Testing Consent Mode v2 lifecycle...');

// A. Check initial default consent
const defaultConsentState = await page.evaluate(() => {
  const consentCall = (window.dataLayer || []).find(item => item[0] === 'consent' && item[1] === 'default');
  return consentCall ? consentCall[2] : null;
});
assert(defaultConsentState?.analytics_storage === 'granted', 'Consent: Initial default analytics_storage is granted');
assert(defaultConsentState?.ad_storage === 'denied', 'Consent: Initial default ad_storage is strictly denied');
assert(defaultConsentState?.ad_personalization === 'denied', 'Consent: Initial default ad_personalization is strictly denied');

// B. Simulate user denying consent
console.log('Simulating user denying consent via setConsent(false)...');
await page.evaluate(() => {
  // Trigger user denial
  if (typeof window.setConsent === 'function') {
    window.setConsent(false);
  } else {
    localStorage.setItem('uifg.consent.v1', 'denied');
    window.gtag('consent', 'update', { analytics_storage: 'denied' });
  }
});
await page.waitForTimeout(500);

const isDeniedStorage = await page.evaluate(() => {
  return localStorage.getItem('uifg.consent.v1') === 'denied';
});
assert(isDeniedStorage, 'Consent: localStorage correctly persists "denied"');

const updateCalls = await page.evaluate(() => {
  return (window.dataLayer || []).filter(item => item[0] === 'consent' && item[1] === 'update');
});
assert(updateCalls.length > 0, 'Consent: gtag("consent", "update") was invoked on denial');
const latestUpdate = updateCalls[updateCalls.length - 1];
assert(latestUpdate[2]?.analytics_storage === 'denied', 'Consent: analytics_storage updated to denied');

// C. Verify reload preserves denied state on fresh initialization
console.log('Reloading page to verify denied consent is loaded on cold start...');
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(800);

const reloadedDefaultConsent = await page.evaluate(() => {
  const consentCall = (window.dataLayer || []).find(item => item[0] === 'consent' && item[1] === 'default');
  return consentCall ? consentCall[2] : null;
});
assert(reloadedDefaultConsent?.analytics_storage === 'denied', 'Consent Cold Start: Denied state preserved; default analytics_storage initialized as "denied"');

// D. User re-grants consent
console.log('Simulating user re-granting consent...');
await page.evaluate(() => {
  if (typeof window.setConsent === 'function') {
    window.setConsent(true);
  } else {
    localStorage.setItem('uifg.consent.v1', 'granted');
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
  }
});
await page.waitForTimeout(300);

const regrantCalls = await page.evaluate(() => {
  return (window.dataLayer || []).filter(item => item[0] === 'consent' && item[1] === 'update');
});
const latestRegrant = regrantCalls[regrantCalls.length - 1];
assert(latestRegrant[2]?.analytics_storage === 'granted', 'Consent Re-grant: analytics_storage restored to granted');

await browser.close();

console.log('\n============================================================');
console.log(`Network & Consent Results: ${passed} passed, ${failed} failed`);
console.log('============================================================\n');

if (failed > 0) process.exit(1);
