// =============================================================================
// SentinelOps AI – AI Service Client
//
// Handles communication with the optional AI service.
// If AI service is not deployed/configured, it gracefully returns unavailable.
// =============================================================================

import config from '../config/index.js';
import logger from '../logger/index.js';
import { ServiceUnavailableError } from '../errors/index.js';

const BASE_URL = config.aiService.url || null;
const TIMEOUT  = config.aiService.timeout;
const API_KEY  = config.aiService.apiKey;

// ---------------------------------------------------------------------------
// Generic fetch wrapper with timeout and error normalisation
// ---------------------------------------------------------------------------

async function request(method, path, body = null) {
  if (!BASE_URL) {
    throw new ServiceUnavailableError(
      'AI service is not configured.',
      'AI_SERVICE_UNAVAILABLE',
    );
  }

  const url = `${BASE_URL}${path}`;

  const headers = {
    'Content-Type': 'application/json',
  };

  if (API_KEY) {
    headers['X-API-Key'] = API_KEY;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');

      throw new ServiceUnavailableError(
        `AI service returned ${res.status}: ${text}`,
        'AI_SERVICE_ERROR',
      );
    }

    return await res.json();

  } catch (err) {
    if (err.name === 'AbortError') {
      throw new ServiceUnavailableError(
        `AI service timed out after ${TIMEOUT}ms.`,
        'AI_SERVICE_TIMEOUT',
      );
    }

    if (err instanceof ServiceUnavailableError) {
      throw err;
    }

    logger.error('AI service request failed', {
      url,
      error: err.message,
    });

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
 * Check whether the AI service is healthy.
 */
export async function checkAiHealth() {

  // AI service is optional
  if (!BASE_URL) {
    return {
      status: 'unavailable',
      message: 'AI service not configured',
    };
  }

  try {
    return await request('GET', '/health');

  } catch {
    return {
      status: 'unavailable',
    };
  }
}


/**
 * Submit an alert payload to AI analysis.
 */
export async function analyzeAlert(alert) {
  return request('POST', '/alert', alert);
}


/**
 * Fetch incidents from AI service.
 */
export async function getAiIncidents() {
  return request('GET', '/incidents');
}


/**
 * Fetch AI statistics.
 */
export async function getAiStats() {
  return request('GET', '/stats');
}


/**
 * Trigger recovery action through AI service.
 */
export async function triggerRecovery({ action, targetService }) {

  const actionMap = {
    RESTART: 'restart deployment',
    SCALE_UP: 'scale deployment',
    SCALE_DOWN: 'scale deployment',
    ROLLBACK: 'rollback deployment',
    FAILOVER: 'restart deployment',
    NOTIFY: 'notify',
    MANUAL: 'manual investigation',
  };


  const aiAction = actionMap[action] || 'manual investigation';


  const result = await analyzeAlert({
    alertname: action,
    service: targetService,
    direct_action: aiAction,
  });


  return {
    output: result.recovery_status || JSON.stringify(result),
  };
}