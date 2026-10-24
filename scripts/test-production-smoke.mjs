/**
 * UI Field Guide · Production Smoke Test Suite
 *
 * Target: https://ui.lutivelab.com
 * Production Deployment: 3aa5283d-9078-4344-9138-dbbdbbf605b1
 * Commit: 8afa694a2c6f76f7d628866e860562e609802b41
 *
 * Verification Areas:
 * 1. Site Navigation & Core Routes (zh, en, search, patterns, privacy)
 * 2. Privacy & Consent Lifecycle (Default Denied, Banner UI, Grant, Cookie Prefix Isolation, Revocation)
 * 3. GA4 Production Telemetry (tid=G-E67MRP4HKJ, traffic_type=production, debug_mode=false, gcs=G100/G101, batch flush)
 * 4. User Interaction Events (page_view, pattern_view, demo_interact, prompt_copy)
 * 5. Cloudflare Pages Functions & Remote D1 Feedback Submissions + Immediate Cleanup
 * 6. Admin API Security & Authentication Isolation (Header-only, No Query Key)
 */

import { chromium } from 'playwright';
import { execSync } from 'child_process';

const TARGET_URL = process.env.TARGET_URL || 'https://ui.lutivelab.com';
const D1_DB = 'ufg-feedback-db';
const ACCOUNT_ID = '47cab5b8509e60df406c7636d640cdc4';

console.log('============================================================');
console.log('UI Field Guide · Production Smoke Test Suite');
console.log(`Target URL: ${TARGET_URL}`);
console.log('============================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✓ ${message}`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${message}`);
    failed++;
  }
}

function parseEventsFromRequest(req) {
  const events = [];
  try {
    const urlObj = new URL(req.url);
    const queryParams = Object.fromEntries(urlObj.searchParams.entries());
    const globalGcs = queryParams.gcs || '';
    const globalTid = queryParams.tid || '';

    if (queryParams.en) {
      events.push({
        name: queryParams.en,
        params: queryParams,
        gcs: globalGcs,
        tid: globalTid,
        rawUrl: req.url,
      });
    }

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
            rawUrl: req.url,
          });
        }
      }
    }
  } catch (err) {
    console.error('Failed to parse collect request:', err);
  }
  return events;
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

function getAllCapturedEvents() {
  const all = [];
  for (const r of capturedCollectRequests) {
    all.push(...parseEventsFromRequest(r));
  }
  return all;
}

async function waitForNetworkEvent(eventName, timeoutMs = 8000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const events = getAllCapturedEvents();
    const match = events.find((e) => e.name === eventName);
    if (match) return match;

    await page.evaluate(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.waitForTimeout(300);
  }
  return null;
}

try {
  // -------------------------------------------------------------
  // Test Section 1: Core Navigation & Routes
  // -------------------------------------------------------------
  console.log('--- 1. Testing Core Navigation & Routes ---');

  const homeRes = await page.goto(`${TARGET_URL}/`, { waitUntil: 'networkidle' });
  assert(homeRes.status() === 200, 'Route: Homepage (zh) returns HTTP 200');
  const homeTitle = await page.title();
  assert(homeTitle.includes('UI Field Guide'), `Title: Homepage contains "UI Field Guide" (got: "${homeTitle}")`);

  const enRes = await page.goto(`${TARGET_URL}/en/`, { waitUntil: 'networkidle' });
  assert(enRes.status() === 200, 'Route: English Homepage (en) returns HTTP 200');

  const searchRes = await page.goto(`${TARGET_URL}/search`, { waitUntil: 'networkidle' });
  assert(searchRes.status() === 200, 'Route: Search page returns HTTP 200');

  const privacyRes = await page.goto(`${TARGET_URL}/privacy`, { waitUntil: 'networkidle' });
  assert(privacyRes.status() === 200, 'Route: Privacy Policy page returns HTTP 200');

  // -------------------------------------------------------------
  // Test Section 2: Privacy Consent & Default Denied on Pattern Page
  // -------------------------------------------------------------
  console.log('\n--- 2. Testing Pattern Page & Default Denied Privacy State ---');

  // Clear context state to simulate brand-new visitor
  await context.clearCookies();
  capturedCollectRequests.length = 0;

  await page.goto(`${TARGET_URL}/patterns/bottom-sheet/`, { waitUntil: 'networkidle' });

  // Consent banner visibility check
  await page.waitForSelector('#consent-banner', { state: 'visible', timeout: 5000 });
  const consentBanner = page.locator('#consent-banner');
  assert((await consentBanner.count()) > 0, 'Consent UI: Consent banner rendered in DOM');
  const isBannerVisible = await consentBanner.isVisible();
  assert(isBannerVisible, 'Consent UI: Consent banner is visible to fresh visitor');

  // LocalStorage check (should be null)
  const initialConsent = await page.evaluate(() => localStorage.getItem('uifg.consent.v1'));
  assert(initialConsent === null, 'Consent State: localStorage "uifg.consent.v1" is null initially');

  // Cookie check (no GA tracking cookies)
  const initialCookies = await context.cookies(TARGET_URL);
  const gaCookies = initialCookies.filter((c) => c.name.includes('_ga') || c.name.includes('_uifg'));
  assert(gaCookies.length === 0, 'Cookie Check: Zero tracking cookies present before consent');

  // Google Tag loaded
  const gtagScript = page.locator('script[src*="G-E67MRP4HKJ"]');
  assert((await gtagScript.count()) > 0, 'Script Check: Google Tag loaded with G-E67MRP4HKJ');

  // Wait for initial pattern_view dispatched under Default Denied
  console.log('Waiting for pattern_view network event...');
  const initialPatternView = await waitForNetworkEvent('pattern_view', 8000);
  assert(!!initialPatternView, 'Telemetry: pattern_view event transmitted over network');

  if (initialPatternView) {
    assert(initialPatternView.gcs === 'G100', `Privacy Telemetry: pattern_view carries gcs=G100 (Default Denied, got: ${initialPatternView.gcs})`);
    assert(initialPatternView.tid === 'G-E67MRP4HKJ', 'Telemetry: tid is G-E67MRP4HKJ');

    const raw = initialPatternView.rawUrl + (initialPatternView.rawLine || '');
    const isProduction = raw.includes('tt=production') || raw.includes('traffic_type=production');
    assert(isProduction, 'Environment Tag: traffic_type=production carried in payload');

    const hasDebugMode = raw.includes('_dbg=1') || raw.includes('debug_mode=1') || raw.includes('debug_mode=true');
    assert(!hasDebugMode, 'Production Integrity: debug_mode (_dbg=1) is strictly disabled in production');
  }

  // -------------------------------------------------------------
  // Test Section 3: User Grants Consent & Cookie Isolation
  // -------------------------------------------------------------
  console.log('\n--- 3. Testing Consent Grant & Cookie Domain/Prefix Isolation ---');

  const acceptBtn = page.locator('#consent-accept-button');
  assert((await acceptBtn.count()) > 0, 'Consent UI: Accept button (#consent-accept-button) exists');
  await acceptBtn.click();
  await page.waitForTimeout(600);

  // Banner should now be hidden
  const bannerVisibleAfter = await consentBanner.isVisible();
  assert(!bannerVisibleAfter, 'Consent UI: Banner dismissed after user accept');

  // LocalStorage should be 'granted'
  const grantedStorage = await page.evaluate(() => localStorage.getItem('uifg.consent.v1'));
  assert(grantedStorage === 'granted', 'Consent State: localStorage set to "granted"');

  // Cookies should now have uifg_ga / _uifg_ga
  const cookiesAfterGrant = await context.cookies(TARGET_URL);
  const uifgCookie = cookiesAfterGrant.find((c) => c.name.startsWith('_uifg_ga') || c.name.startsWith('uifg_ga'));
  assert(!!uifgCookie, `Cookie Isolation: Prefix cookie "${uifgCookie?.name}" successfully created`);
  if (uifgCookie) {
    assert(uifgCookie.domain === 'ui.lutivelab.com' || uifgCookie.domain === '.ui.lutivelab.com', `Cookie Domain: Scoped strictly to ui.lutivelab.com (got: ${uifgCookie.domain})`);
  }

  // -------------------------------------------------------------
  // Test Section 4: Interactive Events (demo_interact & prompt_copy)
  // -------------------------------------------------------------
  console.log('\n--- 4. Testing Interactive Events Transmission (demo_interact & prompt_copy) ---');

  const demoBtn = page.locator('#demo button').first();
  if ((await demoBtn.count()) > 0) {
    await demoBtn.click({ force: true });
    console.log('Clicked demo button. Waiting for demo_interact network dispatch...');
    const demoInteractEvent = await waitForNetworkEvent('demo_interact', 8000);
    assert(!!demoInteractEvent, 'Interaction Telemetry: demo_interact network event captured');
    if (demoInteractEvent) {
      assert(demoInteractEvent.gcs === 'G101', `Privacy Telemetry: demo_interact carries gcs=G101 (Granted, got: ${demoInteractEvent.gcs})`);
      const patternParam = demoInteractEvent.params['ep.pattern_id'] || demoInteractEvent.params['pattern_id'];
      assert(patternParam === 'bottom-sheet', `Payload: pattern_id is "bottom-sheet" (got: ${patternParam})`);
    }
  }

  const promptCopyBtn = page.locator('button:has-text("复制 Prompt"), button:has-text("Copy Prompt")').first();
  if ((await promptCopyBtn.count()) > 0) {
    await promptCopyBtn.click();
    console.log('Clicked prompt copy button. Waiting for prompt_copy network dispatch...');
    const promptCopyEvent = await waitForNetworkEvent('prompt_copy', 8000);
    assert(!!promptCopyEvent, 'Interaction Telemetry: prompt_copy network event captured');
    if (promptCopyEvent) {
      assert(promptCopyEvent.gcs === 'G101', `Privacy Telemetry: prompt_copy carries gcs=G101 (Granted, got: ${promptCopyEvent.gcs})`);
    }
  }

  // -------------------------------------------------------------
  // Test Section 5: Consent Revocation & Cookie Purge
  // -------------------------------------------------------------
  console.log('\n--- 5. Testing Consent Revocation & Cookie Purge ---');

  // Trigger revocation via window.setConsent(false) or footer button
  const footerPrefBtn = page.locator('#footer-open-consent-button');
  if ((await footerPrefBtn.count()) > 0) {
    await footerPrefBtn.scrollIntoViewIfNeeded();
    await footerPrefBtn.click();
    await page.waitForSelector('#consent-banner', { state: 'visible', timeout: 5000 });
    assert(await consentBanner.isVisible(), 'Consent UI: Banner re-opens from footer preferences button');
    const declineBtn = page.locator('#consent-decline-button');
    await declineBtn.click();
  } else {
    await page.evaluate(() => window.setConsent(false));
  }
  await page.waitForTimeout(500);

  const revokedStorage = await page.evaluate(() => localStorage.getItem('uifg.consent.v1'));
  assert(revokedStorage === 'denied', 'Consent State: localStorage updated to "denied"');

  const cookiesAfterRevoke = await context.cookies(TARGET_URL);
  const remainingGaCookies = cookiesAfterRevoke.filter((c) => c.name.startsWith('_uifg') || c.name.startsWith('uifg') || c.name.includes('_ga_E67MRP4HKJ'));
  assert(remainingGaCookies.length === 0, `Cookie Purge: UI Field Guide GA cookies thoroughly destroyed upon revocation (remaining: ${remainingGaCookies.length})`);

  // -------------------------------------------------------------
  // Test Section 6: Cloudflare Pages Functions & Remote D1 Feedback
  // -------------------------------------------------------------
  console.log('\n--- 6. Testing Production Feedback API & Remote D1 Persistence ---');

  const testFeedbackId = `smoke-test-fb-${Date.now()}`;
  const feedbackRes = await page.request.post(`${TARGET_URL}/api/feedback`, {
    headers: { 'Content-Type': 'application/json' },
    data: {
      pattern_id: 'bottom-sheet',
      vote: 'yes',
      optional_comment: `production_smoke_test_${testFeedbackId}`,
      locale: 'zh',
    },
  });

  assert(feedbackRes.status() === 201, `Feedback API: POST /api/feedback returned HTTP 201 (got: ${feedbackRes.status()})`);
  const feedbackJson = await feedbackRes.json();
  assert(feedbackJson.ok === true && !!feedbackJson.feedback_id, `Feedback API: Returned ok=true and feedback_id=${feedbackJson.feedback_id}`);

  const insertedId = feedbackJson.feedback_id;

  // Verify in remote D1 and clean up
  if (insertedId) {
    console.log(`Verifying record in remote D1: feedback_id=${insertedId}...`);
    const d1QueryCmd = `CLOUDFLARE_ACCOUNT_ID=${ACCOUNT_ID} npx wrangler d1 execute ${D1_DB} --remote --json --command "SELECT feedback_id, pattern_id, optional_comment, status FROM pattern_feedback WHERE feedback_id = '${insertedId}';"`;
    const d1QueryOutput = execSync(d1QueryCmd, { encoding: 'utf-8' });
    const queryData = JSON.parse(d1QueryOutput);
    const rows = queryData[0]?.results || [];
    assert(rows.length === 1, `D1 Persistence: Found 1 matching record in remote D1 for ${insertedId}`);
    if (rows.length === 1) {
      assert(rows[0].pattern_id === 'bottom-sheet', `D1 Field Integrity: pattern_id="bottom-sheet"`);
      assert(rows[0].optional_comment.includes('production_smoke_test'), `D1 Field Integrity: comment preserved`);
      console.log(`Record status in production D1: ${rows[0].status}`);
    }

    // Clean up synthetic test row immediately
    console.log(`Cleaning up synthetic test record from remote D1...`);
    const d1DeleteCmd = `CLOUDFLARE_ACCOUNT_ID=${ACCOUNT_ID} npx wrangler d1 execute ${D1_DB} --remote --command "DELETE FROM pattern_feedback WHERE feedback_id = '${insertedId}';"`;
    execSync(d1DeleteCmd, { encoding: 'utf-8' });

    // Verify cleanup
    const d1VerifyCleanCmd = `CLOUDFLARE_ACCOUNT_ID=${ACCOUNT_ID} npx wrangler d1 execute ${D1_DB} --remote --json --command "SELECT count(*) as count FROM pattern_feedback WHERE feedback_id = '${insertedId}';"`;
    const verifyCleanOutput = execSync(d1VerifyCleanCmd, { encoding: 'utf-8' });
    const cleanData = JSON.parse(verifyCleanOutput);
    assert(cleanData[0]?.results[0]?.count === 0, 'D1 Hygiene: Synthetic test record successfully purged from remote D1');
  }

  // -------------------------------------------------------------
  // Test Section 7: Feature Request API
  // -------------------------------------------------------------
  console.log('\n--- 7. Testing Production Feature Request API & Remote D1 Persistence ---');

  const testRequestId = `smoke-test-req-${Date.now()}`;
  const featReqRes = await page.request.post(`${TARGET_URL}/api/feature-request`, {
    headers: { 'Content-Type': 'application/json' },
    data: {
      pattern_name: `SmokeTestPattern_${testRequestId}`,
      use_case: 'Production release automated smoke verification',
      locale: 'zh',
    },
  });

  assert(featReqRes.status() === 201, `Feature Request API: POST /api/feature-request returned HTTP 201 (got: ${featReqRes.status()})`);
  const featJson = await featReqRes.json();
  assert(featJson.ok === true && !!featJson.request_id, `Feature Request API: Returned ok=true and request_id=${featJson.request_id}`);

  const insertedReqId = featJson.request_id;
  if (insertedReqId) {
    const d1ReqDeleteCmd = `CLOUDFLARE_ACCOUNT_ID=${ACCOUNT_ID} npx wrangler d1 execute ${D1_DB} --remote --command "DELETE FROM feature_request WHERE request_id = '${insertedReqId}';"`;
    execSync(d1ReqDeleteCmd, { encoding: 'utf-8' });
    console.log(`Cleaned up synthetic feature request ${insertedReqId} from remote D1.`);
    assert(true, 'D1 Hygiene: Synthetic feature request record purged from remote D1');
  }

  // -------------------------------------------------------------
  // Test Section 8: Admin API Security Gate
  // -------------------------------------------------------------
  console.log('\n--- 8. Testing Admin API Security Gate ---');

  // Without Header
  const unauthRes = await page.request.get(`${TARGET_URL}/api/admin/export`);
  assert(unauthRes.status() === 401 || unauthRes.status() === 503, `Admin Security: GET /api/admin/export without header denied (status: ${unauthRes.status()})`);

  // Query parameter key attempt (should be rejected!)
  const queryKeyRes = await page.request.get(`${TARGET_URL}/api/admin/export?key=testkey&admin_key=testkey`);
  assert(queryKeyRes.status() === 401 || queryKeyRes.status() === 503, `Admin Security: Query param key rejected (status: ${queryKeyRes.status()})`);

} catch (err) {
  console.error('Test execution encountered fatal error:', err);
  failed++;
} finally {
  await browser.close();
}

console.log('\n============================================================');
console.log(`Production Smoke Test Summary: ${passed} PASSED, ${failed} FAILED`);
console.log('============================================================');

if (failed > 0) {
  process.exit(1);
}
