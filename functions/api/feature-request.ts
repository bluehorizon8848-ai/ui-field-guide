interface Env {
  DB: D1Database;
  TURNSTILE_SECRET_KEY?: string;
  ALLOWED_ORIGIN?: string;
}

/**
 * In-memory rate limiting cache for Cloudflare Edge worker isolates.
 *
 * Architecture & Boundary Note:
 * - Provides isolate-level burst protection (mitigating connection-level spam and rapid loop submissions).
 * - Cloudflare Pages Functions run across globally distributed V8 isolates; in-memory state is local to each isolate.
 * - For global multi-datacenter rate limiting, Cloudflare WAF Rate Limiting rules can be enabled in the dashboard.
 * - Cache size is capped at 1,000 entries with automatic expired entry pruning to prevent edge memory exhaustion.
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_RATE_LIMIT_ENTRIES = 1000;

function isRateLimited(ip: string, limit = 10, windowMs = 5 * 60 * 1000): boolean {
  const now = Date.now();

  // Prune map if size exceeds threshold
  if (rateLimitMap.size > MAX_RATE_LIMIT_ENTRIES) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (val.resetAt <= now) {
        rateLimitMap.delete(key);
      }
    }
  }

  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt <= now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }
  if (entry.count >= limit) {
    return true;
  }
  entry.count += 1;
  return false;
}

function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = [
    'https://ui.lutivelab.com',
    'https://lutive-ui-a2u.pages.dev',
  ];
  const isAllowed = origin && (
    allowed.includes(origin) ||
    origin.endsWith('.pages.dev') ||
    origin.startsWith('http://localhost:') ||
    origin.startsWith('http://127.0.0.1:')
  );

  return {
    'Access-Control-Allow-Origin': isAllowed && origin ? origin : 'https://ui.lutivelab.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-turnstile-token',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  };
}

export const onRequestOptions: PagesFunction<Env> = async ({ request }) => {
  const origin = request.headers.get('Origin');
  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const origin = request.headers.get('Origin');
  const headers = corsHeaders(origin);

  // Rate Limiting by IP
  const clientIp = request.headers.get('CF-Connecting-IP') || '0.0.0.0';
  if (isRateLimited(clientIp)) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Too many requests. Please try again later.' }),
      { status: 429, headers }
    );
  }

  // Parse Body
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: 'Invalid JSON body.' }),
      { status: 400, headers }
    );
  }

  const {
    pattern_name,
    query,
    use_case,
    reference_url,
    locale,
    turnstile_token,
  } = body;

  // Validate pattern_name (Required)
  if (typeof pattern_name !== 'string' || !pattern_name.trim()) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Pattern name is required.' }),
      { status: 400, headers }
    );
  }
  const cleanPatternName = pattern_name.trim().slice(0, 100).replace(/[\x00-\x1F\x7F]/g, '');

  // Validate query (Optional)
  let cleanQuery: string | null = null;
  if (typeof query === 'string' && query.trim()) {
    cleanQuery = query.trim().slice(0, 100).replace(/[\x00-\x1F\x7F]/g, '');
  }

  // Validate use_case (Optional)
  let cleanUseCase: string | null = null;
  if (typeof use_case === 'string' && use_case.trim()) {
    cleanUseCase = use_case.trim().slice(0, 500).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  }

  // Validate reference_url (Optional, must be valid http/https)
  let cleanUrl: string | null = null;
  if (typeof reference_url === 'string' && reference_url.trim()) {
    const rawUrl = reference_url.trim();
    if (rawUrl.length <= 300 && (/^https?:\/\//i.test(rawUrl))) {
      cleanUrl = rawUrl;
    } else {
      return new Response(
        JSON.stringify({ ok: false, error: 'Invalid reference URL (must start with http:// or https://).' }),
        { status: 400, headers }
      );
    }
  }

  // Validate locale
  const loc = locale === 'en' ? 'en' : 'zh';

  // Optional Turnstile Verification
  if (env.TURNSTILE_SECRET_KEY && typeof turnstile_token === 'string' && turnstile_token) {
    try {
      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET_KEY,
          response: turnstile_token,
          remoteip: clientIp,
        }),
      });
      const verifyOutcome = await verifyRes.json() as { success: boolean };
      if (!verifyOutcome.success) {
        return new Response(
          JSON.stringify({ ok: false, error: 'Turnstile verification failed.' }),
          { status: 403, headers }
        );
      }
    } catch {
      // In case of verification timeout, allow submission
    }
  }

  if (!env.DB) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Database service unavailable.' }),
      { status: 503, headers }
    );
  }

  const requestId = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const country = typeof request.cf?.country === 'string' ? request.cf.country : 'XX';

  // Staging / Production data isolation
  const isStaging =
    (origin && (origin.includes('pages.dev') || origin.includes('localhost') || origin.includes('127.0.0.1'))) ||
    request.url.includes('pages.dev') ||
    request.url.includes('localhost') ||
    request.headers.get('x-test-mode') === 'true';
  const initialStatus = isStaging ? 'staging_test' : 'new';

  try {
    await env.DB.prepare(
      `INSERT INTO feature_request (request_id, created_at, request_type, query, pattern_name, use_case, reference_url, locale, country, status)
       VALUES (?, ?, 'missing_pattern', ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        requestId,
        createdAt,
        cleanQuery,
        cleanPatternName,
        cleanUseCase,
        cleanUrl,
        loc,
        country,
        initialStatus
      )
      .run();

    return new Response(
      JSON.stringify({ ok: true, request_id: requestId }),
      { status: 201, headers }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Database error';
    return new Response(
      JSON.stringify({ ok: false, error: 'Failed to record feature request.', details: errorMsg }),
      { status: 500, headers }
    );
  }
};
