#!/usr/bin/env node
/**
 * UI Field Guide · Data Review & Feedback Export CLI
 *
 * Usage:
 *   node scripts/query-feedback.mjs summary
 *   node scripts/query-feedback.mjs feedback [--limit 50]
 *   node scripts/query-feedback.mjs requests [--limit 50]
 *   node scripts/query-feedback.mjs export-json
 *   node scripts/query-feedback.mjs export-csv
 */

import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '47cab5b8509e60df406c7636d640cdc4';
const DB_NAME = 'ufg-feedback-db';

function executeD1(sql) {
  const cmd = `CLOUDFLARE_ACCOUNT_ID=${ACCOUNT_ID} npx wrangler d1 execute ${DB_NAME} --remote --json --command="${sql.replace(/"/g, '\\"')}"`;
  const out = execSync(cmd).toString();
  try {
    const parsed = JSON.parse(out);
    return parsed[0]?.results || [];
  } catch (err) {
    console.error('Failed to parse D1 output:', out);
    throw err;
  }
}

const action = process.argv[2] || 'summary';
const isAll = process.argv.includes('--all');
const isStagingOnly = process.argv.includes('--staging');

const statusFilterFeedback = isAll
  ? ''
  : isStagingOnly
  ? "WHERE status = 'staging_test'"
  : "WHERE status != 'staging_test' AND status != 'test'";

const statusFilterFeedbackAnd = isAll
  ? ''
  : isStagingOnly
  ? "AND status = 'staging_test'"
  : "AND status != 'staging_test' AND status != 'test'";

const statusFilterRequest = isAll
  ? ''
  : isStagingOnly
  ? "WHERE status = 'staging_test'"
  : "WHERE status != 'staging_test' AND status != 'test'";

switch (action) {
  case 'summary': {
    console.log('\n============================================================');
    console.log(`UI Field Guide · Feedback & Feature Request Summary (${isAll ? 'ALL DATA' : isStagingOnly ? 'STAGING ONLY' : 'PRODUCTION ONLY'})`);
    console.log('============================================================\n');

    const totalVotes = executeD1(`
      SELECT vote, count(*) as count
      FROM pattern_feedback
      ${statusFilterFeedback}
      GROUP BY vote;
    `);

    const topPatterns = executeD1(`
      SELECT pattern_id,
             count(*) as total,
             sum(CASE WHEN vote = 'yes' THEN 1 ELSE 0 END) as yes_count,
             sum(CASE WHEN vote = 'no' THEN 1 ELSE 0 END) as no_count
      FROM pattern_feedback
      ${statusFilterFeedback}
      GROUP BY pattern_id
      ORDER BY total DESC
      LIMIT 10;
    `);

    const negativeReasons = executeD1(`
      SELECT reason, count(*) as count
      FROM pattern_feedback
      WHERE vote = 'no' AND reason IS NOT NULL ${statusFilterFeedbackAnd}
      GROUP BY reason
      ORDER BY count DESC;
    `);

    const requests = executeD1(`
      SELECT pattern_name, count(*) as count, max(created_at) as latest
      FROM feature_request
      ${statusFilterRequest}
      GROUP BY pattern_name
      ORDER BY count DESC
      LIMIT 10;
    `);

    console.log('--- 投票总览 ---');
    console.table(totalVotes);

    console.log('\n--- 负面反馈原因分布 ---');
    console.table(negativeReasons);

    console.log('\n--- 反馈最多 Pattern Top 10 ---');
    console.table(topPatterns);

    console.log('\n--- 需求征集 Top 10 ---');
    console.table(requests);
    break;
  }

  case 'feedback': {
    const limitArg = process.argv.find(a => /^\d+$/.test(a));
    const limit = parseInt(limitArg || '30', 10);
    const rows = executeD1(`
      SELECT feedback_id, created_at, pattern_id, vote, reason, optional_comment, locale, country, status
      FROM pattern_feedback
      ${statusFilterFeedback}
      ORDER BY created_at DESC
      LIMIT ${limit};
    `);
    console.table(rows);
    break;
  }

  case 'requests': {
    const limitArg = process.argv.find(a => /^\d+$/.test(a));
    const limit = parseInt(limitArg || '30', 10);
    const rows = executeD1(`
      SELECT request_id, created_at, pattern_name, query, use_case, reference_url, locale, country, status
      FROM feature_request
      ${statusFilterRequest}
      ORDER BY created_at DESC
      LIMIT ${limit};
    `);
    console.table(rows);
    break;
  }

  case 'export-json': {
    const dir = join(process.cwd(), 'docs', 'feedback-r1-20261023', 'exports');
    mkdirSync(dir, { recursive: true });

    const feedback = executeD1(`SELECT * FROM pattern_feedback ${statusFilterFeedback} ORDER BY created_at DESC;`);
    const requests = executeD1(`SELECT * FROM feature_request ${statusFilterRequest} ORDER BY created_at DESC;`);

    const outFile = join(dir, `ufg_feedback_export_${Date.now()}.json`);
    writeFileSync(outFile, JSON.stringify({ exported_at: new Date().toISOString(), mode: isAll ? 'all' : isStagingOnly ? 'staging' : 'production', feedback, requests }, null, 2));
    console.log(`Exported JSON to: ${outFile}`);
    break;
  }

  default:
    console.log(`Unknown action: ${action}`);
    console.log('Usage: node scripts/query-feedback.mjs [summary|feedback|requests|export-json]');
}
