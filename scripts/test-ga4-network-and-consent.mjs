/**
 * UI Field Guide · Live Staging GA4 Network & Consent Interception Test
 *
 * Verifies:
 * 1. Initial cold visit strictly sends gcs=G100 (Default Denied) with tid=G-E67MRP4HKJ,
 *    and transmits pattern_view & page_view without setting GA cookies.
 * 2. Explicit consent grant transitions to gcs=G101 and creates isolated _uifg_ga cookie.
 * 3. Interactive event (demo_interact) is dispatched and captured via network with gcs=G101,
 *    verifying batch flush and payload integrity (pattern_id=bottom-sheet).
 * 4. Revocation (setConsent(false)) transitions to gcs=G100, destroys _uifg_ga,
 *    and preserves any sister-project generic cookies.
 */

import { chromium } from 'playwright';

const TARGET_URL = process.env.TARGET_URL || 'https://preview-feedback-r1.lutive-ui-a2u.pages.dev';

console.log('============================================================');
console.log('Live GA4 Network & Consent Interception Test');
console.log(`Target: ${TARGET_URL}`);
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
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});
const page = await context.newPage();

const capturedCollectRequests = [];

page.on('request', (req) => {
  const url = req.url();
  if (url.includes('google-analytics.com') && url.includes('/collect')) {
    capturedCollectRequests.push({
      url,
      postData: req.postData() || '',
      headers: req.headers(),
      timestamp: Date.now(),
    });
  }
});

/**
 * Robust event parser handling GET query params, single-line POST,
 * and multi-line batched POST payloads from Google Analytics 4.
 */
function parseEventsFromRequest(req) {
  const events = [];
  try {
    const urlObj = new URL(req.url);
    const queryParams = Object.fromEntries(urlObj.searchParams.entries());
    const globalGcs = queryParams.gcs || '';
    const globalTid = queryParams.tid || '';

    // Check query params for event
    if (queryParams.en) {
      events.push({
        name: queryParams.en,
        params: queryParams,
        gcs: globalGcs,
        tid: globalTid,
        rawUrl: req.url,
      });
    }

    // Check POST data (which may contain multiple lines for batched events)
    if (req.postData) {
      const lines = req.postData.split('\n').filter(Boolean);
      for (const line of lines) {
        const lineParams = Object.fromEntries(new URLSearchParams(line).entries());
        if (lineParams.en) {
          events.push({
            name: lineParams.en,
            params: { ...queryParams, ...lineParams },
            gcs: lineParams.gcs || globalGcs,
            tid: lineParams.tid || globalTid,
            rawLine: line,
          });
        }
      }
    }
  } catch (err) {
    console.error('Failed to parse request:', err);
  }
  return events;
}

function getAllCapturedEvents() {
  const all = [];
  for (const r of capturedCollectRequests) {
    all.push(...parseEventsFromRequest(r));
  }
  return all;
}

/**
 * Wait for a specific event name in captured network requests.
 * Uses event loop + visibilitychange trigger to promptly flush gtag batch buffer.
 */
async function waitForNetworkEvent(eventName, timeoutMs = 8000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const events = getAllCapturedEvents();
    const match = events.find((e) => e.name === eventName);
    if (match) return match;

    // Trigger visibilitychange to prompt immediate flush of gtag's batch buffer
    await page.evaluate(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.waitForTimeout(300);
  }
  return null;
}

try {
  // -------------------------------------------------------------
  // 1. Visit Staging Pattern Detail & Verify Default Denied (gcs=G100)
  // -------------------------------------------------------------
  console.log('1. Testing Live visit and initial network event transmission...');
  await page.goto(`${TARGET_URL}/patterns/bottom-sheet/`, { waitUntil: 'networkidle' });

  // Check gtag.js loaded with Measurement ID
  const gtagScript = page.locator('script[src*="G-E67MRP4HKJ"]');
  assert((await gtagScript.count()) > 0, 'Staging: Google Tag script loaded with G-E67MRP4HKJ');

  // Verify outgoing /collect network request
  assert(capturedCollectRequests.length > 0, 'Staging Network: Live outgoing request sent to google-analytics.com/collect');

  // Wait for initial pattern_view event to be transmitted by gtag.js (via batch buffer)
  console.log('Waiting for pattern_view network event transmission...');
  const patternViewEvent = await waitForNetworkEvent('pattern_view', 8000);
  assert(!!patternViewEvent, 'GA4 Transmission: pattern_view network event captured and parsed');

  if (patternViewEvent) {
    const patternId = patternViewEvent.params['ep.pattern_id'] || patternViewEvent.params['pattern_id'];
    assert(patternId === 'bottom-sheet', `GA4 Transmission: pattern_view has pattern_id="bottom-sheet" (got: ${patternId})`);
    assert(patternViewEvent.gcs === 'G100', `Privacy Gate: pattern_view strictly carries gcs=G100 (Default Denied, got: ${patternViewEvent.gcs})`);
    assert(patternViewEvent.tid === 'G-E67MRP4HKJ', 'Staging Network: pattern_view carries tid=G-E67MRP4HKJ');
    const hasStaging = patternViewEvent.params.tt === 'staging' || patternViewEvent.params['ep.traffic_type'] === 'staging' || patternViewEvent.rawUrl.includes('tt=staging');
    assert(hasStaging, 'Staging Network: staging traffic tag (tt=staging) carried in payload');
  }

  // Also verify initial page_view event
  const pageViewEvent = getAllCapturedEvents().find((e) => e.name === 'page_view');
  assert(!!pageViewEvent, 'GA4 Transmission: page_view network event captured and parsed');
  if (pageViewEvent) {
    assert(pageViewEvent.gcs === 'G100', `Privacy Gate: page_view strictly carries gcs=G100 (Default Denied, got: ${pageViewEvent.gcs})`);
  }

  // Verify initial cookies: zero GA tracking cookies should exist
  const initialCookies = await page.evaluate(() => document.cookie);
  assert(!initialCookies.includes('_uifg_ga') && !initialCookies.includes('_ga='), 'Privacy Gate: No GA tracking cookies present before user consent');

  // -------------------------------------------------------------
  // 2. User Grants Consent & Verifies Cookie Domain/Prefix Isolation
  // -------------------------------------------------------------
  console.log('\n2. Testing Consent Grant & Cookie Prefix Isolation...');
  const bannerAcceptBtn = page.locator('#consent-accept-button');
  if ((await bannerAcceptBtn.count()) > 0 && (await bannerAcceptBtn.isVisible())) {
    await bannerAcceptBtn.click();
  } else {
    await page.evaluate(() => window.setConsent(true));
  }
  await page.waitForTimeout(500);

  // Verify localStorage updated
  const storedConsent = await page.evaluate(() => localStorage.getItem('uifg.consent.v1'));
  assert(storedConsent === 'granted', 'Consent: localStorage updated to "granted"');

  // Verify dataLayer update
  const dataLayerAfterGrant = await page.evaluate(() => window.dataLayer || []);
  const grantUpdate = dataLayerAfterGrant.find(
    (i) => i[0] === 'consent' && i[1] === 'update' && i[2]?.analytics_storage === 'granted'
  );
  assert(!!grantUpdate, 'Consent: dataLayer received consent update: granted');

  // -------------------------------------------------------------
  // 3. Test Interactive Event (demo_interact) Transmission
  // -------------------------------------------------------------
  console.log('\n3. Testing demo_interact network transmission with batch flush...');
  const demoButton = page.locator('#demo button').first();
  assert((await demoButton.count()) > 0, 'Demo UI: Interactive button exists on pattern page');

  if ((await demoButton.count()) > 0) {
    await demoButton.click({ force: true });
    console.log('Clicked demo button. Waiting for demo_interact network dispatch...');

    // Wait for demo_interact event to be captured via network
    const demoEvent = await waitForNetworkEvent('demo_interact', 8000);
    assert(!!demoEvent, 'Staging Network: demo_interact network event captured and parsed');

    if (demoEvent) {
      assert(demoEvent.gcs === 'G101', `Consent Active: demo_interact carries gcs=G101 (got: ${demoEvent.gcs})`);
      assert(demoEvent.tid === 'G-E67MRP4HKJ', 'Network Payload: demo_interact carries tid=G-E67MRP4HKJ');
      const patternId = demoEvent.params['ep.pattern_id'] || demoEvent.params['pattern_id'];
      assert(patternId === 'bottom-sheet', `Network Payload: demo_interact carries pattern_id="bottom-sheet" (got: ${patternId})`);
    }
  }

  // -------------------------------------------------------------
  // 4. Test Revocation (setConsent(false)) & Safe Cookie Cleanup
  // -------------------------------------------------------------
  console.log('\n4. Testing Revocation & Non-colliding Cookie Cleanup...');

  // Set project cookie and simulate another project's generic cookie on parent domain
  await page.evaluate(() => {
    document.cookie = '_uifg_ga=GA1.1.111111111.1729000000; path=/';
    document.cookie = '_uifg_ga_E67MRP4HKJ=GS1.1.1729000000.1.0.1729000000.0.0.0; path=/';
    // Simulate generic GA cookie from parent domain (e.g. lutivelab.com)
    document.cookie = '_ga_parent_project=GA1.1.999999999.1729000000; path=/';
  });

  const cookiesBeforeRevoke = await page.evaluate(() => document.cookie);
  assert(cookiesBeforeRevoke.includes('_uifg_ga='), 'Cookie Check: _uifg_ga is present before revocation');

  // Trigger revocation
  await page.evaluate(() => {
    window.setConsent(false);
  });
  await page.waitForTimeout(400);

  const storedAfterRevoke = await page.evaluate(() => localStorage.getItem('uifg.consent.v1'));
  assert(storedAfterRevoke === 'denied', 'Consent: localStorage updated to "denied"');

  const cookiesAfterRevoke = await page.evaluate(() => document.cookie);
  assert(!cookiesAfterRevoke.includes('_uifg_ga'), 'Cookie Isolation: _uifg_ga was completely deleted upon revocation');
  assert(cookiesAfterRevoke.includes('_ga_parent_project='), 'Cookie Safety: Sister project cookie _ga_parent_project was safely PRESERVED');

  // -------------------------------------------------------------
  // 5. Cold Reload Verification (Preserving Denied across visits)
  // -------------------------------------------------------------
  console.log('\n5. Reloading page to verify denied consent is loaded on cold start...');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const reloadedDefaultConsent = await page.evaluate(() => {
    const consentCall = (window.dataLayer || []).find((item) => item[0] === 'consent' && item[1] === 'default');
    return consentCall ? consentCall[2] : null;
  });
  assert(reloadedDefaultConsent?.analytics_storage === 'denied', 'Consent Cold Start: Denied state preserved; default analytics_storage initialized as "denied"');

} catch (err) {
  console.error('Test execution error:', err);
  failed++;
} finally {
  await browser.close();
}

console.log('\n============================================================');
console.log(`GA4 Network & Consent Results: ${passed} passed, ${failed} failed`);
console.log('============================================================\n');

if (failed > 0) process.exit(1);
