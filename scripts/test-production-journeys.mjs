/**
 * UI Field Guide · Production User Journey Verification Suite (R1 Supplement)
 *
 * Target: https://ui.lutivelab.com
 * Scope:
 * 1. Pattern Detail: Positive Feedback ("有帮助" -> D1 pattern_feedback vote='yes', status='new')
 * 2. Pattern Detail: Negative Feedback ("还有待改进" -> Reason selection, Comment input, Submit -> D1 pattern_feedback vote='no', status='new')
 * 3. Search: No-results Feature Request ("提需求/建议新增" -> Form input -> D1 feature_request, status='new')
 * 4. Bilingual & Mobile: English locale & Mobile viewport (390x844) validation
 * 5. UX Resilience: Duplicate submission prevention (sessionStorage) & Network failure error prompt + Retry
 * 6. Security Gate: Admin API unauthorized access rejection
 * 7. D1 Hygiene: Clean physical deletion of all test records
 */

import { chromium, devices } from 'playwright';
import { execSync } from 'child_process';

const TARGET_URL = process.env.TARGET_URL || 'https://ui.lutivelab.com';
const D1_DB = 'ufg-feedback-db';
const ACCOUNT_ID = '47cab5b8509e60df406c7636d640cdc4';

console.log('============================================================');
console.log('UI Field Guide · Production User Journey Verification Suite');
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

function queryD1(sql) {
  const cmd = `CLOUDFLARE_ACCOUNT_ID=${ACCOUNT_ID} npx wrangler d1 execute ${D1_DB} --remote --json --command "${sql}"`;
  const out = execSync(cmd, { encoding: 'utf-8' });
  const data = JSON.parse(out);
  return data[0]?.results || [];
}

function executeD1(sql) {
  const cmd = `CLOUDFLARE_ACCOUNT_ID=${ACCOUNT_ID} npx wrangler d1 execute ${D1_DB} --remote --command "${sql}"`;
  execSync(cmd, { encoding: 'utf-8' });
}

const testTag = `smoke_journey_${Date.now()}`;
const insertedFeedbackIds = [];
const insertedRequestIds = [];

const browser = await chromium.launch();

try {
  // -------------------------------------------------------------------------
  // Journey 1: Pattern Detail - Positive Feedback ("有帮助") [ZH / Desktop]
  // -------------------------------------------------------------------------
  console.log('--- Journey 1: Positive Feedback ("有帮助") [ZH Desktop] ---');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    // Intercept /api/feedback to capture the returned feedback_id
    let capturedId = null;
    page.on('response', async (res) => {
      if (res.url().includes('/api/feedback') && res.request().method() === 'POST') {
        const json = await res.json().catch(() => null);
        if (json?.feedback_id) capturedId = json.feedback_id;
      }
    });

    await page.goto(`${TARGET_URL}/patterns/bottom-sheet/`, { waitUntil: 'networkidle' });

    // Locate Positive Feedback button
    const helpfulBtn = page.locator('aside[aria-label*="有帮助"] button:has-text("有帮助")').first();
    assert((await helpfulBtn.count()) > 0, 'UI: "有帮助" button exists in Pattern feedback section');

    await helpfulBtn.click();
    await page.waitForTimeout(1000);

    // Verify UI reflects success
    const thankYouMsg = page.locator('aside[aria-label*="有帮助"] :has-text("感谢你的反馈")').first();
    assert((await thankYouMsg.count()) > 0, 'UI: Thank you confirmation displayed after positive vote');

    // Verify duplicate prevention in same session
    const alreadyVotedNotice = page.locator('aside[aria-label*="有帮助"] :has-text("你已为该模式提交过反馈")').first();
    assert((await alreadyVotedNotice.count()) > 0, 'Duplicate Prevention: "你已为该模式提交过反馈" notice shown');

    // Verify in Remote D1
    if (capturedId) {
      insertedFeedbackIds.push(capturedId);
      const rows = queryD1(`SELECT feedback_id, pattern_id, vote, locale, status FROM pattern_feedback WHERE feedback_id='${capturedId}';`);
      assert(rows.length === 1, `D1 Persistence: Positive feedback found in remote D1 (id=${capturedId})`);
      if (rows.length === 1) {
        assert(rows[0].pattern_id === 'bottom-sheet', 'D1 Field: pattern_id is "bottom-sheet"');
        assert(rows[0].vote === 'yes', 'D1 Field: vote is "yes"');
        assert(rows[0].locale === 'zh', 'D1 Field: locale is "zh"');
        assert(rows[0].status === 'new', `D1 Isolation: status is strictly "new" (not staging_test, got: ${rows[0].status})`);
      }
    } else {
      assert(false, 'Network: Failed to capture /api/feedback response');
    }

    await context.close();
  }

  // -------------------------------------------------------------------------
  // Journey 2: Pattern Detail - Negative Feedback ("还有待改进") [EN / Desktop]
  // -------------------------------------------------------------------------
  console.log('\n--- Journey 2: Negative Feedback ("Not yet" / Needs Improvement) [EN Desktop] ---');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    let capturedId = null;
    page.on('response', async (res) => {
      if (res.url().includes('/api/feedback') && res.request().method() === 'POST') {
        const json = await res.json().catch(() => null);
        if (json?.feedback_id) capturedId = json.feedback_id;
      }
    });

    await page.goto(`${TARGET_URL}/en/patterns/toast/`, { waitUntil: 'networkidle' });

    // Locate "Not yet" button
    const notYetBtn = page.locator('aside button:has-text("Not yet")').first();
    assert((await notYetBtn.count()) > 0, 'UI (EN): "Not yet" button exists on English pattern page');

    await notYetBtn.click();
    await page.waitForTimeout(300);

    // Verify form expanded
    const reasonRadio = page.locator('input[name="feedback-reason"][value="demo_issue"]');
    assert((await reasonRadio.count()) > 0, 'UI (EN): Reason radio options visible');
    await reasonRadio.check();

    const commentBox = page.locator('textarea[id*="feedback-comment"]');
    assert((await commentBox.count()) > 0, 'UI (EN): Comment textarea visible');
    const commentText = `${testTag}_en_negative_feedback_comment`;
    await commentBox.fill(commentText);

    // Submit negative feedback
    const submitBtn = page.locator('button[type="submit"]:has-text("Submit Feedback")');
    assert((await submitBtn.count()) > 0, 'UI (EN): "Submit Feedback" button available');
    await submitBtn.click();
    await page.waitForTimeout(1000);

    // Verify success UI
    const thankYouMsg = page.locator('aside :has-text("Thank you")').first();
    assert((await thankYouMsg.count()) > 0, 'UI (EN): Success confirmation displayed');

    // Verify in Remote D1
    if (capturedId) {
      insertedFeedbackIds.push(capturedId);
      const rows = queryD1(`SELECT feedback_id, pattern_id, vote, reason, optional_comment, locale, status FROM pattern_feedback WHERE feedback_id='${capturedId}';`);
      assert(rows.length === 1, `D1 Persistence: Negative feedback found in remote D1 (id=${capturedId})`);
      if (rows.length === 1) {
        assert(rows[0].pattern_id === 'toast', 'D1 Field: pattern_id is "toast"');
        assert(rows[0].vote === 'no', 'D1 Field: vote is "no"');
        assert(rows[0].reason === 'demo_issue', 'D1 Field: reason is "demo_issue"');
        assert(rows[0].optional_comment === commentText, 'D1 Field: optional_comment matched');
        assert(rows[0].locale === 'en', 'D1 Field: locale is "en"');
        assert(rows[0].status === 'new', `D1 Isolation: status is strictly "new" (not staging_test, got: ${rows[0].status})`);
      }
    } else {
      assert(false, 'Network: Failed to capture negative /api/feedback response');
    }

    await context.close();
  }

  // -------------------------------------------------------------------------
  // Journey 3: Search No-Results Feature Request [ZH / Mobile Viewport (iPhone 13)]
  // -------------------------------------------------------------------------
  console.log('\n--- Journey 3: Search No-Results Feature Request [ZH Mobile 390x844] ---');
  {
    const mobileContext = await browser.newContext({
      ...devices['iPhone 13'],
      viewport: { width: 390, height: 844 },
    });
    const page = await mobileContext.newPage();

    let capturedReqId = null;
    page.on('response', async (res) => {
      if (res.url().includes('/api/feature-request') && res.request().method() === 'POST') {
        const json = await res.json().catch(() => null);
        if (json?.request_id) capturedReqId = json.request_id;
      }
    });

    const missingPatternQuery = `quantum-dial-${Date.now()}`;
    await page.goto(`${TARGET_URL}/search?q=${encodeURIComponent(missingPatternQuery)}`, { waitUntil: 'networkidle' });

    // Verify empty state display
    const noResultMsg = page.locator(`:has-text("没找到")`).first();
    assert((await noResultMsg.count()) > 0, 'UI (Mobile): No-results empty state message shown');

    // Verify Feature Request prompt & expand button
    const openFormBtn = page.locator('button:has-text("提交组件需求")').first();
    assert((await openFormBtn.count()) > 0, 'UI (Mobile): "提交组件需求" button available on empty search');

    await openFormBtn.click();
    await page.waitForTimeout(300);

    // Form fields validation
    const nameInput = page.locator('#req-pattern-name');
    assert((await nameInput.count()) > 0, 'UI (Mobile): Pattern name input rendered');
    const prefilledValue = await nameInput.inputValue();
    assert(prefilledValue === missingPatternQuery, `UI (Mobile): Pattern name input auto-prefilled with search query ("${prefilledValue}")`);

    const useCaseInput = page.locator('#req-use-case');
    const useCaseText = `${testTag}_mobile_zh_usecase_description`;
    await useCaseInput.fill(useCaseText);

    // Submit form
    const submitReqBtn = page.locator('form button[type="submit"]:has-text("提交组件需求")');
    assert((await submitReqBtn.count()) > 0, 'UI (Mobile): "提交组件需求" button present');
    await submitReqBtn.click();
    await page.waitForTimeout(1000);

    // Verify success confirmation
    const successMsg = page.locator(':has-text("需求提交成功")').first();
    assert((await successMsg.count()) > 0, 'UI (Mobile): Feature request success message displayed');

    // Verify in Remote D1
    if (capturedReqId) {
      insertedRequestIds.push(capturedReqId);
      const rows = queryD1(`SELECT request_id, pattern_name, use_case, locale, status FROM feature_request WHERE request_id='${capturedReqId}';`);
      assert(rows.length === 1, `D1 Persistence: Feature request found in remote D1 (id=${capturedReqId})`);
      if (rows.length === 1) {
        assert(rows[0].pattern_name === missingPatternQuery, `D1 Field: pattern_name is "${missingPatternQuery}"`);
        assert(rows[0].use_case === useCaseText, 'D1 Field: use_case matched');
        assert(rows[0].locale === 'zh', 'D1 Field: locale is "zh"');
        assert(rows[0].status === 'new', `D1 Isolation: status is strictly "new" (not staging_test, got: ${rows[0].status})`);
      }
    } else {
      assert(false, 'Network: Failed to capture /api/feature-request response');
    }

    await mobileContext.close();
  }

  // -------------------------------------------------------------------------
  // Journey 4: Search No-Results Feature Request [EN / Desktop]
  // -------------------------------------------------------------------------
  console.log('\n--- Journey 4: Search No-Results Feature Request [EN Desktop] ---');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    let capturedReqId = null;
    page.on('response', async (res) => {
      if (res.url().includes('/api/feature-request') && res.request().method() === 'POST') {
        const json = await res.json().catch(() => null);
        if (json?.request_id) capturedReqId = json.request_id;
      }
    });

    const enMissingQuery = `hologram-hud-${Date.now()}`;
    await page.goto(`${TARGET_URL}/en/search?q=${encodeURIComponent(enMissingQuery)}`, { waitUntil: 'networkidle' });

    // Open EN Request form
    const openFormBtnEn = page.locator('button:has-text("Submit Request")').first();
    assert((await openFormBtnEn.count()) > 0, 'UI (EN): "Submit Request" button exists');

    await openFormBtnEn.click();
    await page.waitForTimeout(300);

    const useCaseInputEn = page.locator('#req-use-case');
    const enUseCaseText = `${testTag}_desktop_en_usecase_description`;
    await useCaseInputEn.fill(enUseCaseText);

    const refUrlInput = page.locator('#req-ref-url');
    await refUrlInput.fill('https://example.com/hologram-hud-spec');

    const submitEnBtn = page.locator('form button[type="submit"]:has-text("Submit Request")');
    await submitEnBtn.click();
    await page.waitForTimeout(1000);

    const successEnMsg = page.locator(':has-text("Request submitted successfully")').first();
    assert((await successEnMsg.count()) > 0, 'UI (EN): Feature request success message displayed');

    if (capturedReqId) {
      insertedRequestIds.push(capturedReqId);
      const rows = queryD1(`SELECT request_id, pattern_name, use_case, reference_url, locale, status FROM feature_request WHERE request_id='${capturedReqId}';`);
      assert(rows.length === 1, `D1 Persistence (EN): Feature request found in remote D1 (id=${capturedReqId})`);
      if (rows.length === 1) {
        assert(rows[0].pattern_name === enMissingQuery, `D1 Field (EN): pattern_name is "${enMissingQuery}"`);
        assert(rows[0].use_case === enUseCaseText, 'D1 Field (EN): use_case matched');
        assert(rows[0].reference_url === 'https://example.com/hologram-hud-spec', 'D1 Field (EN): reference_url matched');
        assert(rows[0].locale === 'en', 'D1 Field (EN): locale is "en"');
        assert(rows[0].status === 'new', `D1 Isolation (EN): status is strictly "new" (got: ${rows[0].status})`);
      }
    } else {
      assert(false, 'Network: Failed to capture EN /api/feature-request response');
    }

    await context.close();
  }

  // -------------------------------------------------------------------------
  // Journey 5: Resilience & Error Handling - Network Failure Prompt & Retry
  // -------------------------------------------------------------------------
  console.log('\n--- Journey 5: Resilience & Error Handling - Network Failure Prompt & Retry ---');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    await page.goto(`${TARGET_URL}/patterns/accordion/`, { waitUntil: 'networkidle' });

    // Open negative feedback form
    const notYetBtn = page.locator('aside button:has-text("还有待改进")').first();
    await notYetBtn.click();
    await page.waitForTimeout(300);

    // Intercept /api/feedback: Abort first request to simulate network failure
    let attempt = 0;
    await page.route('**/api/feedback', async (route) => {
      attempt++;
      if (attempt === 1) {
        console.log('Simulating network failure on first attempt...');
        await route.abort('failed');
      } else {
        console.log('Allowing second attempt through...');
        await route.continue();
      }
    });

    const submitBtn = page.locator('button[type="submit"]:has-text("提交反馈")');
    await submitBtn.click();
    await page.waitForTimeout(1000);

    // Verify error prompt displayed
    const errorAlert = page.locator('aside [role="alert"]');
    assert((await errorAlert.count()) > 0, 'Resilience: Error alert displayed upon network failure');

    // Verify submit button changed to Retry
    const retryBtn = page.locator('button[type="submit"]:has-text("重试")');
    assert((await retryBtn.count()) > 0, 'Resilience: Submit button transitioned to "重试" (Retry)');

    // Capture successful id on retry
    let retryFeedbackId = null;
    page.on('response', async (res) => {
      if (res.url().includes('/api/feedback') && res.request().method() === 'POST') {
        const json = await res.json().catch(() => null);
        if (json?.feedback_id) retryFeedbackId = json.feedback_id;
      }
    });

    // Click Retry
    await retryBtn.click();
    await page.waitForTimeout(1000);

    // Verify recovered to success state
    const successMsg = page.locator('aside :has-text("感谢你的反馈")').first();
    assert((await successMsg.count()) > 0, 'Resilience: Successfully recovered and submitted on retry');

    if (retryFeedbackId) {
      insertedFeedbackIds.push(retryFeedbackId);
    }

    await context.close();
  }

  // -------------------------------------------------------------------------
  // Journey 6: Admin API Security Gate (Header-only requirement)
  // -------------------------------------------------------------------------
  console.log('\n--- Journey 6: Admin API Security Gate ---');
  {
    const context = await browser.newContext();
    const page = await context.newPage();

    // GET without Header
    const resNoHeader = await page.request.get(`${TARGET_URL}/api/admin/export`);
    assert(resNoHeader.status() === 401 || resNoHeader.status() === 503, `Security: GET /api/admin/export without header denied (status=${resNoHeader.status()})`);

    // GET with URL Query Key (Attack Vector: Should be rejected)
    const resQueryKey = await page.request.get(`${TARGET_URL}/api/admin/export?key=malicious_probe&admin_key=test`);
    assert(resQueryKey.status() === 401 || resQueryKey.status() === 503, `Security: Query param key attempt rejected (status=${resQueryKey.status()})`);

    await context.close();
  }

  // -------------------------------------------------------------------------
  // Journey 7: Data Hygiene & Physical Purge of Test Records
  // -------------------------------------------------------------------------
  console.log('\n--- Journey 7: Data Hygiene & Physical Purge of Test Records ---');
  {
    console.log(`Cleaning up ${insertedFeedbackIds.length} feedback records: [${insertedFeedbackIds.join(', ')}]`);
    for (const id of insertedFeedbackIds) {
      executeD1(`DELETE FROM pattern_feedback WHERE feedback_id='${id}';`);
    }

    console.log(`Cleaning up ${insertedRequestIds.length} feature requests: [${insertedRequestIds.join(', ')}]`);
    for (const id of insertedRequestIds) {
      executeD1(`DELETE FROM feature_request WHERE request_id='${id}';`);
    }

    // Double check row counts in remote D1
    const fbCountRows = queryD1(`SELECT count(*) as count FROM pattern_feedback;`);
    const reqCountRows = queryD1(`SELECT count(*) as count FROM feature_request;`);
    const remainingFb = fbCountRows[0]?.count || 0;
    const remainingReq = reqCountRows[0]?.count || 0;

    assert(remainingFb === 0, `D1 Hygiene: pattern_feedback table completely clean (remaining: ${remainingFb})`);
    assert(remainingReq === 0, `D1 Hygiene: feature_request table completely clean (remaining: ${remainingReq})`);
  }

} catch (err) {
  console.error('Fatal error during user journeys verification:', err);
  failed++;
} finally {
  await browser.close();
}

console.log('\n============================================================');
console.log(`User Journey Verification Summary: ${passed} PASSED, ${failed} FAILED`);
console.log('============================================================');

if (failed > 0) {
  process.exit(1);
}
