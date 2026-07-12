// =============================================================================
// SentinelOps AI – AI Service HTTP Client
// Communicates with the Python FastAPI sentinel-ai service.
// All outbound calls go through this module so error handling,
// timeouts, and retries are centralized.
// =============================================================================

import config from '../config/index.js';
import logger from '../logger/index.js';
import { ServiceUnavailableError } from '../errors/index.js';

const BASE_URL = config.aiService.url;
const TIMEOUT  = config.aiService.timeout;
const API_KEY  = config.aiService.apiKey;

// ---------------------------------------------------------------------------
// Generic fetch wrapper with timeout and error normalisation
// ---------------------------------------------------------------------------
async function request(method, path, body = null) {
  const url = `${BASE_URL}${path}`;

  const headers = { 'Content-Type': 'application/json' };
  if (API_KEY) headers['X-API-Key'] = API_KEY;

  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const res = await fetch(url, {
      method,
      headers,
      body:   body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new ServiceUnavailableError(
        `AI service returned ${res.status}: ${text}`,
        'AI_SERVICE_ERROR',
      );
    }

    return res.json();
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new ServiceUnavailableError(
        `AI service timed out after ${TIMEOUT}ms.`,
        'AI_SERVICE_TIMEOUT',
      );
    }
    if (err instanceof ServiceUnavailableError) throw err;

    logger.error('AI service request failed', { url, error: err.message });
    throw new ServiceUnavailableError(
      `AI service is unreachable: ${err.message}`,
      'AI_SERVICE_UNAVAILABLE',
    );
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Check whether the sentinel-ai service is healthy.
 * @returns {Promise<{ status: string }>}
 */
export async function checkAiHealth() {
  try {
    return await request('GET', '/health');
  } catch {
    return { status: 'unavailable' };
  }
}

/**
 * Submit an alert payload to the AI for analysis and recovery.
 *
 * @param {{ alertname: string, [key: string]: any }} alert
 * @returns {Promise<{ alert: string, root_cause: string, recovery_action: string, recovery_status: string }>}
 */
export async function analyzeAlert(alert) {
  return request('POST', '/alert', alert);
}

/**
 * Fetch all incidents logged by the AI service.
 * @returns {Promise<Array>}
 */
export async function getAiIncidents() {
  return request('GET', '/incidents');
}

/**
 * Fetch AI service statistics.
 * @returns {Promise<{ service: string, total_incidents: number }>}
 */
export async function getAiStats() {
  return request('GET', '/stats');
}

/**
 * Trigger a recovery action via the AI service.
 * Translates our internal RecoveryAction enum to the AI action string.
 *
 * @param {{ action: string, targetService: string }} params
 * @returns {Promise<{ output: string }>}
 */
export async function triggerRecovery({ action, targetService }) {
  // Map our enum values to the action strings that recovery.py understands
  const actionMap = {
    RESTART:    'restart deployment',
    SCALE_UP:   'scale deployment',
    SCALE_DOWN: 'scale deployment',
    ROLLBACK:   'rollback deployment',
    FAILOVER:   'restart deployment',
    NOTIFY:     'notify',
    MANUAL:     'manual investigation',
  };

  const aiAction = actionMap[action] || 'manual investigation';

  // The AI service POST /alert endpoint triggers recovery automatically.
  // For direct recovery triggers we call with a synthetic alert payload.
  const result = await analyzeAlert({
    alertname:   action,
    service:     targetService,
    direct_action: aiAction,
  });

  return { output: result.recovery_status || JSON.stringify(result) };
}
