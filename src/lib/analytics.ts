/**
 * UI Field Guide · GA4 Analytics & Consent Core
 *
 * Provides type-safe event tracking for the core user journey:
 * Discovery (search) → Exploration (pattern_view) → Engagement (demo_interact, prompt_copy) → Feedback (feedback_submit, feature_request_submit)
 *
 * Privacy Guarantees:
 * - Never transmits free-form user comments, emails, or personal identifiers.
 * - Does not send raw search queries to GA4 (only result_count & status).
 * - Implements strict client-side throttling to prevent event spam (e.g. demo dragging).
 * - Respects Google Consent Mode v2 (ad_storage denied by default).
 */

export type GAEventMap = {
  page_view: {
    page_location?: string;
    page_path: string;
    page_title?: string;
    locale: 'zh' | 'en';
  };
  pattern_view: {
    pattern_id: string;
    category: string;
    locale: 'zh' | 'en';
  };
  demo_interact: {
    pattern_id: string;
    interaction_type: string;
  };
  prompt_copy: {
    pattern_id: string;
    variant: 'conversational' | 'detailed' | 'implementation' | 'basic' | 'better_prompt';
  };
  guide_search: {
    result_count: number;
    locale: 'zh' | 'en';
  };
  search_no_result: {
    locale: 'zh' | 'en';
  };
  feedback_submit: {
    pattern_id: string;
    vote: 'yes' | 'no';
    reason?: 'unclear_explanation' | 'demo_issue' | 'prompt_not_useful' | 'other';
  };
  feature_request_submit: {
    request_type: 'missing_pattern' | 'general_request';
  };
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __UFG_ANALYTICS_DEBUG_EVENTS__?: Array<{ event: string; params: Record<string, unknown>; timestamp: number }>;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

/**
 * Record event to in-memory debug buffer for test verification
 */
function recordDebugEvent<E extends keyof GAEventMap>(event: E, params: GAEventMap[E]) {
  if (typeof window !== 'undefined') {
    window.__UFG_ANALYTICS_DEBUG_EVENTS__ = window.__UFG_ANALYTICS_DEBUG_EVENTS__ || [];
    window.__UFG_ANALYTICS_DEBUG_EVENTS__.push({
      event,
      params: params as Record<string, unknown>,
      timestamp: Date.now(),
    });
  }
}

/**
 * Type-safe trackEvent wrapper
 */
export function trackEvent<E extends keyof GAEventMap>(
  eventName: E,
  eventParams: GAEventMap[E]
) {
  if (typeof window === 'undefined') return;

  const host = window.location.hostname;
  const isStaging = host.includes('pages.dev') || host.includes('localhost') || host === '127.0.0.1';
  const enrichedParams = {
    ...eventParams,
    traffic_type: isStaging ? 'staging' : 'production',
  };

  recordDebugEvent(eventName, enrichedParams as unknown as GAEventMap[E]);

  if (process.env.NODE_ENV === 'development' || !GA_MEASUREMENT_ID) {
    // Development or staging without GA ID: log for developer visibility
    console.debug(`[Analytics: ${eventName}]`, enrichedParams);
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, enrichedParams);
  }
}

// Throttle tracker for demo interactions
const demoLastFiredMap = new Map<string, number>();

/**
 * Throttled demo interaction tracker (at most once every 2 seconds per pattern)
 */
export function trackDemoInteractThrottled(
  patternId: string,
  interactionType: string,
  intervalMs = 2000
) {
  const now = Date.now();
  const key = `${patternId}:${interactionType}`;
  const last = demoLastFiredMap.get(key) || 0;

  if (now - last >= intervalMs) {
    demoLastFiredMap.set(key, now);
    trackEvent('demo_interact', {
      pattern_id: patternId,
      interaction_type: interactionType,
    });
  }
}

/**
 * Check if analytics storage consent is granted
 */
export function isConsentGranted(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const val = localStorage.getItem('uifg.consent.v1');
    if (val === 'denied') return false;
  } catch {
    // Ignore localStorage access issues
  }
  return true;
}

/**
 * Update user consent state
 */
export function setConsent(granted: boolean) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('uifg.consent.v1', granted ? 'granted' : 'denied');
  } catch {
    // Ignore
  }

  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
    });
  }
}

if (typeof window !== 'undefined') {
  (window as unknown as { setConsent?: typeof setConsent }).setConsent = setConsent;
}
