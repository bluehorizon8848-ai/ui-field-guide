interface Env {
  DB: D1Database;
  ADMIN_API_KEY?: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // Verify Admin Key
  const adminKey = env.ADMIN_API_KEY;
  if (!adminKey) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Admin export is disabled (no ADMIN_API_KEY configured).' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Strictly enforce Header-only Admin Key (URL query parameter key authentication is forbidden for security)
  const headerKey = request.headers.get('x-admin-key');
  if (headerKey !== adminKey) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Unauthorized. Required header "x-admin-key" missing or invalid.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!env.DB) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Database service unavailable.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const url = new URL(request.url);
  const table = url.searchParams.get('table') || 'all';
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '100', 10), 1000);
  const includeTest = url.searchParams.get('include_test') === 'true';

  try {
    let feedback = null;
    let requests = null;

    if (table === 'all' || table === 'feedback') {
      const fbSql = includeTest
        ? `SELECT feedback_id, created_at, pattern_id, vote, reason, optional_comment, locale, country, status
           FROM pattern_feedback
           ORDER BY created_at DESC
           LIMIT ?`
        : `SELECT feedback_id, created_at, pattern_id, vote, reason, optional_comment, locale, country, status
           FROM pattern_feedback
           WHERE status != 'staging_test' AND status != 'test'
           ORDER BY created_at DESC
           LIMIT ?`;

      const fbResult = await env.DB.prepare(fbSql).bind(limit).all();
      feedback = fbResult.results;
    }

    if (table === 'all' || table === 'feature_requests') {
      const reqSql = includeTest
        ? `SELECT request_id, created_at, request_type, query, pattern_name, use_case, reference_url, locale, country, status
           FROM feature_request
           ORDER BY created_at DESC
           LIMIT ?`
        : `SELECT request_id, created_at, request_type, query, pattern_name, use_case, reference_url, locale, country, status
           FROM feature_request
           WHERE status != 'staging_test' AND status != 'test'
           ORDER BY created_at DESC
           LIMIT ?`;

      const reqResult = await env.DB.prepare(reqSql).bind(limit).all();
      requests = reqResult.results;
    }

    return new Response(
      JSON.stringify({
        ok: true,
        timestamp: new Date().toISOString(),
        feedback,
        requests,
      }, null, 2),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, private',
        },
      }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Database query error';
    return new Response(
      JSON.stringify({ ok: false, error: 'Failed to query database.', details: errorMsg }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
