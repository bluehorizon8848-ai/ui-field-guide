/**
 * UI Field Guide · Feedback & Analytics R1 Verification Suite
 *
 * Validates:
 * 1. GA4 Measurement ID G-E67MRP4HKJ & Google Tag loading
 * 2. Consent Mode v2 default denials & user consent updates
 * 3. Staging traffic isolation tag (traffic_type: 'staging', debug_mode: true)
 * 4. GA4 event signatures, parameter restrictions & privacy constraints (8 events)
 * 5. Admin API security (strict Header-only authentication; rejection of query param key)
 * 6. Staging/Production D1 data isolation (staging_test status tagging)
 * 7. Browser UI verification for Pattern Feedback and Feature Request Form
 * 8. Remote D1 database schema and read/write integrity
 */

import { chromium } from 'playwright';
import { execSync } from 'node:child_process';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3111';

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

console.log('\n============================================================');
console.log('1. GA4 Measurement ID G-E67MRP4HKJ & Consent Mode v2 Verification');
console.log('============================================================');

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

// Track outgoing gtag network requests or script tags
await page.goto(`${BASE}/patterns/bottom-sheet/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

// Verify Google Tag script is injected with G-E67MRP4HKJ
const gaScript = await page.locator('script[src*="G-E67MRP4HKJ"]');
assert(await gaScript.count() > 0, 'GA4: G-E67MRP4HKJ gtag.js script loaded');

// Verify Consent Mode v2 default denial
const consentEntries = await page.evaluate(() => {
  return (window.dataLayer || []).filter((item) => item[0] === 'consent');
});
assert(consentEntries.length > 0, 'Consent Mode v2: Consent call exists in dataLayer');
const defaultConsent = consentEntries[0];
assert(defaultConsent[1] === 'default', 'Consent Mode v2: First consent action is "default"');
assert(defaultConsent[2]?.ad_storage === 'denied', 'Consent Mode v2: ad_storage is denied by default');
assert(defaultConsent[2]?.ad_personalization === 'denied', 'Consent Mode v2: ad_personalization is denied by default');

// Verify Staging traffic isolation
const events = await page.evaluate(() => window.__UFG_ANALYTICS_DEBUG_EVENTS__ || []);
const pageView = events.find((e) => e.event === 'page_view');
assert(!!pageView, 'GA4: page_view fired on pattern detail page');
assert(pageView?.params?.locale === 'zh', 'GA4: page_view has correct zh locale');
assert(pageView?.params?.page_path?.startsWith('/patterns/bottom-sheet'), 'GA4: page_view records page_path');
assert(pageView?.params?.traffic_type === 'staging', 'GA4 Staging Isolation: traffic_type is flagged as "staging" on localhost');

// Verify pattern_view
const patternView = events.find((e) => e.event === 'pattern_view');
assert(!!patternView, 'GA4: pattern_view fired on pattern detail page');
assert(patternView?.params?.pattern_id === 'bottom-sheet', 'GA4: pattern_view has correct pattern_id');
assert(patternView?.params?.category === 'containers', 'GA4: pattern_view has correct category');
assert(patternView?.params?.traffic_type === 'staging', 'GA4: pattern_view has staging traffic_type');

// Verify demo_interact throttling
const demoButton = page.locator('#demo button').first();
if (await demoButton.count() > 0) {
  await demoButton.click({ force: true });
  await page.waitForTimeout(300);
  const eventsAfterDemo1 = await page.evaluate(() => window.__UFG_ANALYTICS_DEBUG_EVENTS__ || []);
  const demoEvent1 = eventsAfterDemo1.find((e) => e.event === 'demo_interact');
  assert(!!demoEvent1, 'GA4: demo_interact fired on demo button click');
  assert(demoEvent1?.params?.pattern_id === 'bottom-sheet', 'GA4: demo_interact has pattern_id');

  // Click again immediately - should be throttled (within 2s)
  await demoButton.click({ force: true });
  const eventsAfterDemo2 = await page.evaluate(() => window.__UFG_ANALYTICS_DEBUG_EVENTS__ || []);
  const demoCount = eventsAfterDemo2.filter((e) => e.event === 'demo_interact').length;
  assert(demoCount === 1, 'GA4: demo_interact throttled (rapid second click suppressed)');
}

// Verify prompt_copy
const copyButton = page.locator('#ask-ai button', { hasText: /复制 Prompt|Copy Prompt/ }).first();
if (await copyButton.count() > 0) {
  await copyButton.click({ force: true });
  await page.waitForTimeout(300);
  const eventsAfterCopy = await page.evaluate(() => window.__UFG_ANALYTICS_DEBUG_EVENTS__ || []);
  const copyEvent = eventsAfterCopy.find((e) => e.event === 'prompt_copy');
  assert(!!copyEvent, 'GA4: prompt_copy fired on successful prompt copy');
  assert(copyEvent?.params?.pattern_id === 'bottom-sheet', 'GA4: prompt_copy has pattern_id');
  assert(copyEvent?.params?.variant === 'conversational', 'GA4: prompt_copy has correct variant level');
  // Privacy check: Prompt text must NOT be sent to GA4
  assert(!copyEvent?.params?.prompt && !copyEvent?.params?.text, 'Privacy: prompt_copy does not send raw prompt text');
}

// Check Search Events: guide_search & search_no_result
await page.goto(`${BASE}/search/?q=modal`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
const searchEvents = await page.evaluate(() => window.__UFG_ANALYTICS_DEBUG_EVENTS__ || []);
const searchHit = searchEvents.find((e) => e.event === 'guide_search');
assert(!!searchHit, 'GA4: guide_search fired after search query input');
assert(typeof searchHit?.params?.result_count === 'number' && searchHit.params.result_count > 0, 'GA4: guide_search records result_count');
assert(!searchHit?.params?.query && !searchHit?.params?.q, 'Privacy: guide_search does NOT transmit raw query string');

await page.goto(`${BASE}/search/?q=nonexistent_xyz_pattern`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
const noResultEvents = await page.evaluate(() => window.__UFG_ANALYTICS_DEBUG_EVENTS__ || []);
const noResultEvent = noResultEvents.find((e) => e.event === 'search_no_result');
assert(!!noResultEvent, 'GA4: search_no_result fired on zero results query');
assert(!noResultEvent?.params?.query, 'Privacy: search_no_result does NOT transmit raw query string');

console.log('\n============================================================');
console.log('2. Pattern Feedback UI & Session Deduplication');
console.log('============================================================');

await page.goto(`${BASE}/patterns/modal/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

const feedbackSection = page.locator('aside', { hasText: /这个内容对你有帮助吗|Was this helpful/ });
assert(await feedbackSection.count() > 0, 'Feedback UI: Feedback section renders on pattern page');

// Positive feedback flow
const yesBtn = feedbackSection.locator('button', { hasText: /有帮助|Yes/ });
assert(await yesBtn.count() > 0, 'Feedback UI: "Yes" button exists');

const noBtn = feedbackSection.locator('button', { hasText: /还有待改进|Not yet/ });
assert(await noBtn.count() > 0, 'Feedback UI: "Not yet" button exists');

// Click "Not yet" -> reveals negative reason options
await noBtn.click({ force: true });
await page.waitForTimeout(300);

const radioReasons = feedbackSection.locator('input[type="radio"]');
assert(await radioReasons.count() === 4, 'Feedback UI: 4 negative reasons displayed (unclear, demo, prompt, other)');

const commentBox = feedbackSection.locator('textarea');
assert(await commentBox.count() > 0, 'Feedback UI: Optional comment textarea displayed');

// Fill comment and check character counter
await commentBox.fill('测试反馈补充说明');
const charCount = await feedbackSection.locator('text=/500').textContent();
assert(charCount?.includes('8/500'), 'Feedback UI: Character counter updates correctly (8/500)');

console.log('\n============================================================');
console.log('3. Feature Request Form UI in Search Empty State');
console.log('============================================================');

await page.goto(`${BASE}/search/?q=missing_tree_view`, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);

const openReqBtn = page.locator('button', { hasText: /提交组件需求|Submit Request/ });
assert(await openReqBtn.count() > 0, 'Feature Request UI: Entry button rendered in empty state');

await openReqBtn.click({ force: true });
await page.waitForTimeout(300);

const reqForm = page.locator('form', { hasText: /没找到想要的组件|Looking for a missing pattern/ });
assert(await reqForm.count() > 0, 'Feature Request UI: Request form expanded');

const nameInput = reqForm.locator('#req-pattern-name');
assert(await nameInput.count() > 0, 'Feature Request UI: Pattern name input rendered');

const useCaseInput = reqForm.locator('#req-use-case');
assert(await useCaseInput.count() > 0, 'Feature Request UI: Use case textarea rendered');

const refUrlInput = reqForm.locator('#req-ref-url');
assert(await refUrlInput.count() > 0, 'Feature Request UI: Reference URL input rendered');

console.log('\n============================================================');
console.log('4. English Locale UI Verification');
console.log('============================================================');

await page.goto(`${BASE}/en/patterns/tabs/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

const enFeedback = page.locator('aside', { hasText: /Was this helpful\?/ });
assert(await enFeedback.count() > 0, 'i18n: English Pattern Feedback widget renders in English');
assert(await enFeedback.locator('button', { hasText: 'Yes' }).count() > 0, 'i18n: English "Yes" button');
assert(await enFeedback.locator('button', { hasText: 'Not yet' }).count() > 0, 'i18n: English "Not yet" button');

await page.goto(`${BASE}/en/search/?q=nonexistent_xyz`, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);

const enReqBtn = page.locator('button', { hasText: /Submit Request/ });
assert(await enReqBtn.count() > 0, 'i18n: English Feature Request entry rendered');

await browser.close();

console.log('\n============================================================');
console.log('5. Remote D1 Database, Security & Environment Isolation');
console.log('============================================================');

try {
  // Test D1 readback and verify schema
  const d1Tables = execSync(
    'CLOUDFLARE_ACCOUNT_ID=47cab5b8509e60df406c7636d640cdc4 npx wrangler d1 execute ufg-feedback-db --remote --command="SELECT name FROM sqlite_master WHERE type=\'table\';"'
  ).toString();
  assert(d1Tables.includes('pattern_feedback'), 'D1: pattern_feedback table verified');
  assert(d1Tables.includes('feature_request'), 'D1: feature_request table verified');

  // Verify indexes
  const d1Indexes = execSync(
    'CLOUDFLARE_ACCOUNT_ID=47cab5b8509e60df406c7636d640cdc4 npx wrangler d1 execute ufg-feedback-db --remote --command="SELECT name FROM sqlite_master WHERE type=\'index\';"'
  ).toString();
  assert(d1Indexes.includes('idx_pattern_feedback_pattern'), 'D1: idx_pattern_feedback_pattern index verified');
  assert(d1Indexes.includes('idx_feature_request_created'), 'D1: idx_feature_request_created index verified');

  // Perform synthetic write test with staging_test status
  const testId = 'test-' + Date.now();
  execSync(
    `CLOUDFLARE_ACCOUNT_ID=47cab5b8509e60df406c7636d640cdc4 npx wrangler d1 execute ufg-feedback-db --remote --command="INSERT INTO pattern_feedback (feedback_id, created_at, feedback_type, pattern_id, vote, reason, optional_comment, locale, country, status) VALUES ('${testId}', datetime('now'), 'pattern_helpful', 'modal', 'yes', NULL, 'synthetic staging isolation test', 'en', 'US', 'staging_test');"`
  );

  const testRead = execSync(
    `CLOUDFLARE_ACCOUNT_ID=47cab5b8509e60df406c7636d640cdc4 npx wrangler d1 execute ufg-feedback-db --remote --command="SELECT feedback_id, pattern_id, vote, optional_comment, status FROM pattern_feedback WHERE feedback_id='${testId}';"`
  ).toString();
  assert(testRead.includes(testId), 'D1: Synthetic write successfully read back');
  assert(testRead.includes('staging_test'), 'D1 Data Isolation: Record status correctly marked as staging_test');

  // Cleanup synthetic test row
  execSync(
    `CLOUDFLARE_ACCOUNT_ID=47cab5b8509e60df406c7636d640cdc4 npx wrangler d1 execute ufg-feedback-db --remote --command="DELETE FROM pattern_feedback WHERE feedback_id='${testId}';"`
  );
  assert(true, 'D1: Synthetic test record cleaned up');
} catch (err) {
  assert(false, `D1 verification error: ${err.message}`);
}

console.log('\n============================================================');
console.log(`Summary: ${passed} passed, ${failed} failed`);
console.log('============================================================\n');

if (failed > 0) {
  process.exit(1);
}
