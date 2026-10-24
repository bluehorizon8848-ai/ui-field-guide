/**
 * UI Field Guide · Consent Mode v2 & Race Condition Independent Audit Test
 *
 * Verifies all 5 findings from Gemini 4 Audit Report (UFG_CONSENT_BROWSER_AUDIT_REPORT.md):
 * - P0-1: Bilingual Consent Banner with equal buttons, Footer & Privacy controls, persistent choice.
 * - P0-2: Zero-loss GA4 event queueing under React hydration race conditions (pattern_view).
 * - P1-1: Active GA4 cookie cleanup on revocation.
 * - P1-2: Real dataLayer order & parameter assertions (no tautological debug checks).
 * - P2-1: Universal default denied consent registration before any measurement event.
 */

import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:3111';

console.log('============================================================');
console.log('Consent Mode v2 & GA4 Race Condition Physical Audit');
console.log(`Target: ${BASE}`);
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

try {
  // -------------------------------------------------------------
  // Test Suite 1: Fresh Visitor Universal Denied & Banner Visibility (P0-1 & P2-1)
  // -------------------------------------------------------------
  console.log('--- Test Suite 1: Fresh Visitor Universal Denied & Banner ---');
  const ctx1 = await browser.newContext();
  const page1 = await ctx1.newPage();

  await page1.goto(`${BASE}/patterns/bottom-sheet/`, { waitUntil: 'networkidle' });
  await page1.waitForTimeout(500);

  // 1.1 LocalStorage is empty on cold start
  const initialStorage = await page1.evaluate(() => localStorage.getItem('uifg.consent.v1'));
  assert(initialStorage === null, '1.1 Fresh visitor: localStorage uifg.consent.v1 is null');

  // 1.2 dataLayer inspection: Consent Default is strictly denied
  const dataLayer = await page1.evaluate(() => window.dataLayer || []);
  const consentDefaults = dataLayer.filter(i => i[0] === 'consent' && i[1] === 'default');
  assert(consentDefaults.length >= 1, '1.2 Consent Default: Registered in window.dataLayer');
  const defaultCmd = consentDefaults[0][2];
  assert(defaultCmd?.analytics_storage === 'denied', '1.3 Universal Policy: Default analytics_storage is strictly "denied"');
  assert(defaultCmd?.ad_storage === 'denied', '1.4 Universal Policy: Default ad_storage is strictly "denied"');
  assert(defaultCmd?.ad_user_data === 'denied', '1.5 Universal Policy: Default ad_user_data is strictly "denied"');
  assert(defaultCmd?.ad_personalization === 'denied', '1.6 Universal Policy: Default ad_personalization is strictly "denied"');

  // 1.3 Consent Banner UI is rendered
  const banner = page1.locator('aside[role="region"]');
  assert(await banner.isVisible(), '1.7 Consent Banner: Visible on first visit with zero historical choice');

  const acceptBtn = page1.locator('#consent-accept-button');
  const declineBtn = page1.locator('#consent-decline-button');
  assert(await acceptBtn.isVisible(), '1.8 Consent Banner: "Accept Analytics" button is visible and accessible');
  assert(await declineBtn.isVisible(), '1.9 Consent Banner: "Decline" button is visible and accessible');

  // -------------------------------------------------------------
  // Test Suite 2: Race Condition Elimination (P0-2)
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 2: GA4 Event Queueing & Race Condition ---');
  // Check that pattern_view exists in window.dataLayer
  const patternViewEvent = dataLayer.find(i => i[0] === 'event' && i[1] === 'pattern_view');
  assert(!!patternViewEvent, '2.1 Race Condition Fixed: pattern_view is present in window.dataLayer on first load');
  assert(patternViewEvent?.[2]?.pattern_id === 'bottom-sheet', '2.2 pattern_view payload: pattern_id is "bottom-sheet"');
  assert(patternViewEvent?.[2]?.category === 'containers', '2.3 pattern_view payload: category is "containers"');
  assert(patternViewEvent?.[2]?.traffic_type === 'staging', '2.4 pattern_view payload: traffic_type is "staging"');

  // Check event ordering in dataLayer: consent default MUST precede pattern_view
  const defaultIdx = dataLayer.findIndex(i => i[0] === 'consent' && i[1] === 'default');
  const patternViewIdx = dataLayer.findIndex(i => i[0] === 'event' && i[1] === 'pattern_view');
  assert(defaultIdx >= 0 && patternViewIdx > defaultIdx, `2.5 Ordering: consent default (index ${defaultIdx}) precedes pattern_view (index ${patternViewIdx})`);

  // -------------------------------------------------------------
  // Test Suite 3: User Explicit Grant Flow & Network / Cookie Effect (P0-1)
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 3: Explicit Consent Grant Flow ---');
  await acceptBtn.click();
  await page1.waitForTimeout(300);

  // Banner should disappear
  assert(!(await banner.isVisible()), '3.1 Banner: Automatically hides after user clicks Accept');

  // LocalStorage updated
  const storedAfterGrant = await page1.evaluate(() => localStorage.getItem('uifg.consent.v1'));
  assert(storedAfterGrant === 'granted', '3.2 Storage: uifg.consent.v1 updated to "granted"');

  // dataLayer has consent update with granted
  const dataLayerAfterGrant = await page1.evaluate(() => window.dataLayer || []);
  const grantUpdate = dataLayerAfterGrant.find(i => i[0] === 'consent' && i[1] === 'update' && i[2]?.analytics_storage === 'granted');
  assert(!!grantUpdate, '3.3 dataLayer: gtag("consent", "update", { analytics_storage: "granted" }) fired');

  // -------------------------------------------------------------
  // Test Suite 4: Footer Re-opening & Revocation with Cookie Cleanup (P1-1)
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 4: Footer Re-opening & Cookie Revocation ---');
  // Re-open from Footer
  const footerBtn = page1.locator('#footer-open-consent-button');
  assert(await footerBtn.isVisible(), '4.1 Footer: "Cookie / 隐私设置" button is visible in Footer');
  await footerBtn.click();
  await page1.waitForTimeout(300);

  assert(await banner.isVisible(), '4.2 Banner: Successfully re-opened via Footer button');

  // Set synthetic GA cookies to test cleanup
  await page1.evaluate(() => {
    document.cookie = '_ga=GA1.1.123456789.1729000000; path=/';
    document.cookie = '_ga_E67MRP4HKJ=GS1.1.1729000000.1.0.1729000000.0.0.0; path=/';
  });

  const cookiesBeforeRevoke = await page1.evaluate(() => document.cookie);
  assert(cookiesBeforeRevoke.includes('_ga='), '4.3 Cookie Setup: Simulated _ga cookie is present before revocation');

  // Click Decline button
  await declineBtn.click();
  await page1.waitForTimeout(300);

  assert(!(await banner.isVisible()), '4.4 Banner: Hides after clicking Decline');

  const storedAfterDecline = await page1.evaluate(() => localStorage.getItem('uifg.consent.v1'));
  assert(storedAfterDecline === 'denied', '4.5 Storage: uifg.consent.v1 updated to "denied"');

  const cookiesAfterRevoke = await page1.evaluate(() => document.cookie);
  const gaStillExists = cookiesAfterRevoke.split(';').some(c => c.trim().startsWith('_ga'));
  assert(!gaStillExists, '4.6 Cookie Cleanup: _ga and _ga_* cookies are thoroughly deleted upon revocation');

  await ctx1.close();

  // -------------------------------------------------------------
  // Test Suite 5: Cold Start Retention for Denied and Granted States
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 5: Cold Start Retention ---');
  // 5A: Cold start with pre-existing 'granted'
  const ctxGranted = await browser.newContext();
  const pageGranted = await ctxGranted.newPage();
  await pageGranted.addInitScript(() => {
    localStorage.setItem('uifg.consent.v1', 'granted');
  });
  await pageGranted.goto(`${BASE}/patterns/modal/`, { waitUntil: 'networkidle' });
  await pageGranted.waitForTimeout(300);

  const bannerGranted = pageGranted.locator('aside[role="region"]');
  assert(!(await bannerGranted.isVisible()), '5.1 Returning Granted: Consent Banner does NOT re-prompt');

  const dataLayerGranted = await pageGranted.evaluate(() => window.dataLayer || []);
  const initialConsentGranted = dataLayerGranted.find(i => i[0] === 'consent' && i[1] === 'default');
  assert(initialConsentGranted?.[2]?.analytics_storage === 'granted', '5.2 Returning Granted: Cold start initialized with analytics_storage: "granted"');
  await ctxGranted.close();

  // 5B: Cold start with pre-existing 'denied'
  const ctxDenied = await browser.newContext();
  const pageDenied = await ctxDenied.newPage();
  await pageDenied.addInitScript(() => {
    localStorage.setItem('uifg.consent.v1', 'denied');
  });
  await pageDenied.goto(`${BASE}/patterns/modal/`, { waitUntil: 'networkidle' });
  await pageDenied.waitForTimeout(300);

  const bannerDenied = pageDenied.locator('aside[role="region"]');
  assert(!(await bannerDenied.isVisible()), '5.3 Returning Denied: Consent Banner does NOT re-prompt');

  const dataLayerDenied = await pageDenied.evaluate(() => window.dataLayer || []);
  const initialConsentDenied = dataLayerDenied.find(i => i[0] === 'consent' && i[1] === 'default');
  assert(initialConsentDenied?.[2]?.analytics_storage === 'denied', '5.4 Returning Denied: Cold start initialized with analytics_storage: "denied"');
  await ctxDenied.close();

  // -------------------------------------------------------------
  // Test Suite 6: Privacy Policy Page Interactive Hub
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 6: Privacy Policy Hub Controls ---');
  const ctxPrivacy = await browser.newContext();
  const pagePrivacy = await ctxPrivacy.newPage();
  await pagePrivacy.goto(`${BASE}/privacy/`, { waitUntil: 'networkidle' });
  await pagePrivacy.waitForTimeout(500);

  const grantBtnPrivacy = pagePrivacy.locator('#privacy-grant-button');
  assert(await grantBtnPrivacy.isVisible(), '6.1 Privacy Page: Direct consent management control is visible in Section 3');
  await grantBtnPrivacy.click();
  await pagePrivacy.waitForTimeout(300);

  const revokeBtnPrivacy = pagePrivacy.locator('#privacy-revoke-button');
  assert(await revokeBtnPrivacy.isVisible(), '6.2 Privacy Page: State updates to Granted, "Revoke" button appears');
  await revokeBtnPrivacy.click();
  await pagePrivacy.waitForTimeout(300);

  const notice = pagePrivacy.locator('text=已成功撤销同意');
  assert(await notice.isVisible(), '6.3 Privacy Page: Feedback notice confirms consent revoked & cookies cleared');
  await ctxPrivacy.close();

  // -------------------------------------------------------------
  // Test Suite 7: Cold Start Stress Test (10 Rapid Reloads for pattern_view)
  // -------------------------------------------------------------
  console.log('\n--- Test Suite 7: Cold Start Stress Test (10 Iterations) ---');
  let stressSuccess = 0;
  for (let i = 1; i <= 10; i++) {
    const stressCtx = await browser.newContext();
    const stressPage = await stressCtx.newPage();
    await stressPage.goto(`${BASE}/patterns/tabs/`, { waitUntil: 'domcontentloaded' });
    await stressPage.waitForTimeout(150);

    const events = await stressPage.evaluate(() => {
      const dl = window.dataLayer || [];
      return dl.filter(item => item[0] === 'event' && item[1] === 'pattern_view');
    });

    if (events.length >= 1 && events[0][2]?.pattern_id === 'tabs') {
      stressSuccess++;
    }
    await stressCtx.close();
  }
  assert(stressSuccess === 10, `7.1 Cold Start Stress Test: 10/10 rapid cold starts reliably queued pattern_view in dataLayer (${stressSuccess}/10)`);

} catch (err) {
  console.error('Test execution error:', err);
  failed++;
} finally {
  await browser.close();
}

console.log('\n============================================================');
console.log(`Audit Test Results: ${passed} passed, ${failed} failed`);
console.log('============================================================\n');

if (failed > 0) process.exit(1);
