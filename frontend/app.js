/**
 * SentinelOps AI – Dashboard Application
 * Pure vanilla ES-module JavaScript. No build step required.
 *
 * Architecture:
 *  - ApiClient  : thin fetch wrapper (auth headers, error normalisation)
 *  - Auth       : login / logout / token refresh state machine
 *  - Dashboard  : page orchestration, data fetching, DOM rendering
 *  - UI helpers : toast, badge, date formatting
 */

'use strict';

// ════════════════════════════════════════════════════════════════════════════
// Configuration
// ════════════════════════════════════════════════════════════════════════════

const CONFIG = Object.freeze({
  API_BASE:       (window.ENV_API_BASE     || 'http://localhost:5000') + '/api/v1',
  AI_BASE:        window.ENV_AI_BASE       || 'http://localhost:8000',
  REFRESH_MS:     (parseInt(window.ENV_REFRESH_MS, 10) || 30) * 1000,
  PAGE_SIZE:      10,
});

// ════════════════════════════════════════════════════════════════════════════
// Token store (memory + localStorage)
// ════════════════════════════════════════════════════════════════════════════

const TokenStore = (() => {
  const K_ACCESS  = 'so_access';
  const K_REFRESH = 'so_refresh';

  return {
    getAccess:       () => sessionStorage.getItem(K_ACCESS),
    getRefresh:      () => localStorage.getItem(K_REFRESH),
    save(access, refresh) {
      sessionStorage.setItem(K_ACCESS, access);
      if (refresh) localStorage.setItem(K_REFRESH, refresh);
    },
    clear() {
      sessionStorage.removeItem(K_ACCESS);
      localStorage.removeItem(K_REFRESH);
    },
  };
})();

// ════════════════════════════════════════════════════════════════════════════
// API Client
// ════════════════════════════════════════════════════════════════════════════

const ApiClient = (() => {
  let _refreshPromise = null;

  async function _refreshTokens() {
    const refreshToken = TokenStore.getRefresh();
    if (!refreshToken) throw new Error('No refresh token available.');

    const res = await fetch(`${CONFIG.API_BASE}/auth/refresh`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      TokenStore.clear();
      throw new Error('Session expired. Please sign in again.');
    }

    const { data } = await res.json();
    TokenStore.save(data.accessToken, data.refreshToken);
    return data.accessToken;
  }

  async function request(method, url, body = null, retry = true) {
    const headers = { 'Content-Type': 'application/json' };
    const access  = TokenStore.getAccess();
    if (access) headers['Authorization'] = `Bearer ${access}`;

    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    // Token expired – attempt refresh once
    if (res.status === 401 && retry) {
      if (!_refreshPromise) {
        _refreshPromise = _refreshTokens().finally(() => { _refreshPromise = null; });
      }
      try {
        await _refreshPromise;
        return request(method, url, body, false);
      } catch {
        Auth.logout();
        throw new Error('Session expired. Please sign in again.');
      }
    }

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg = json?.message || json?.detail || `HTTP ${res.status}`;
      throw Object.assign(new Error(msg), { status: res.status, data: json });
    }

    return json;
  }

  return {
    get:    (path)         => request('GET',    `${CONFIG.API_BASE}${path}`),
    post:   (path, body)   => request('POST',   `${CONFIG.API_BASE}${path}`, body),
    patch:  (path, body)   => request('PATCH',  `${CONFIG.API_BASE}${path}`, body),
    delete: (path)         => request('DELETE', `${CONFIG.API_BASE}${path}`),

    // Direct AI service calls (no auth)
    aiGet:  async (path) => {
      const res = await fetch(`${CONFIG.AI_BASE}${path}`);
      if (!res.ok) throw new Error(`AI service: HTTP ${res.status}`);
      return res.json();
    },
    aiPost: async (path, body) => {
      const res = await fetch(`${CONFIG.AI_BASE}${path}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`AI service: HTTP ${res.status}`);
      return res.json();
    },
  };
})();

// ════════════════════════════════════════════════════════════════════════════
// UI Helpers
// ════════════════════════════════════════════════════════════════════════════

function showToast(message, type = 'info', durationMs = 4000) {
  const region = document.getElementById('toastRegion');
  if (!region) return;

  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<span aria-hidden="true">${icons[type] || ''}</span><span>${escHtml(message)}</span>`;
  region.appendChild(toast);

  setTimeout(() => toast.remove(), durationMs);
}

function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function badge(value) {
  const cls = String(value || '').replace(/_/g, '-');
  return `<span class="badge badge--${escHtml(value)}">${escHtml(value || '–')}</span>`;
}

function fmtDate(iso) {
  if (!iso) return '–';
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short', day: 'numeric',
      hour:  '2-digit', minute: '2-digit',
    }).format(new Date(iso));
  } catch { return iso; }
}

function setEl(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function show(id) {
  const el = document.getElementById(id);
  if (el) el.hidden = false;
}

function hide(id) {
  const el = document.getElementById(id);
  if (el) el.hidden = true;
}

// ════════════════════════════════════════════════════════════════════════════
// Auth
// ════════════════════════════════════════════════════════════════════════════

const Auth = (() => {
  let _user = null;

  function _decodeJwt(token) {
    try {
      const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(b64));
    } catch { return null; }
  }

  async function init() {
    const access = TokenStore.getAccess();
    if (!access) {
      const refreshToken = TokenStore.getRefresh();
      if (refreshToken) {
        try {
          const { data } = await ApiClient.post('/auth/refresh', { refreshToken });
          TokenStore.save(data.accessToken, data.refreshToken);
          await _loadProfile();
          return true;
        } catch { TokenStore.clear(); }
      }
      return false;
    }
    await _loadProfile();
    return true;
  }

  async function _loadProfile() {
    try {
      const { data } = await ApiClient.get('/auth/me');
      _user = data;
      setEl('userNameDisplay', data.name);
      const roleEl = document.getElementById('userRoleDisplay');
      if (roleEl) {
        roleEl.textContent = data.role;
        roleEl.className   = `user-menu__role badge badge--${data.role}`;
      }
      show('userMenu');
    } catch { /* ignore */ }
  }

  async function login(email, password) {
    const { data } = await ApiClient.post('/auth/login', { email, password });
    TokenStore.save(data.accessToken, data.refreshToken);
    _user = data.user;

    setEl('userNameDisplay', data.user.name);
    const roleEl = document.getElementById('userRoleDisplay');
    if (roleEl) {
      roleEl.textContent = data.user.role;
      roleEl.className   = `user-menu__role badge badge--${data.user.role}`;
    }
    show('userMenu');
  }

  async function logout() {
    const refreshToken = TokenStore.getRefresh();
    try { await ApiClient.post('/auth/logout', { refreshToken }); } catch { /* ignore */ }
    TokenStore.clear();
    _user = null;
    hide('userMenu');
    hide('mainContent');
    show('authModal');
  }

  return { init, login, logout, getUser: () => _user };
})();

// ════════════════════════════════════════════════════════════════════════════
// Dashboard
// ════════════════════════════════════════════════════════════════════════════

const Dashboard = (() => {
  let _refreshTimer = null;
  let _incidentPage = 1;
  let _incidentTotal = 0;

  // ── Bootstrap ──────────────────────────────────────────────────────────
  async function boot() {
    _bindAuthForm();
    _bindNavbar();
    _bindIncidentFilters();
    _bindCreateIncident();
    _bindTestAlert();

    const authed = await Auth.init();
    if (authed) {
      _showDashboard();
    } else {
      show('authModal');
    }
  }

  function _showDashboard() {
    hide('authModal');
    show('mainContent');
    refresh();
    _refreshTimer = setInterval(refresh, CONFIG.REFRESH_MS);
  }

  // ── Refresh all panels ─────────────────────────────────────────────────
  async function refresh() {
    setEl('lastUpdated', `Updated ${fmtDate(new Date().toISOString())}`);

    await Promise.allSettled([
      _loadHealth(),
      _loadStats(),
      _loadIncidents(),
      _loadAlerts(),
      _loadRecoveries(),
      _loadAiStats(),
    ]);
  }

  // ── Health ─────────────────────────────────────────────────────────────
  async function _loadHealth() {
    try {
      const { data } = await ApiClient.get('/health');
      const dot   = document.getElementById('systemStatusDot');
      const label = document.getElementById('systemStatusLabel');
      const env   = document.getElementById('envBadge');

      if (data.healthy) {
        dot.className   = 'status-dot status-dot--healthy';
        label.textContent = 'All systems operational';
      } else {
        dot.className   = 'status-dot status-dot--degraded';
        label.textContent = 'System degraded';
      }

      if (env) env.textContent = data.environment || 'development';
    } catch {
      const dot = document.getElementById('systemStatusDot');
      if (dot) dot.className = 'status-dot status-dot--error';
      setEl('systemStatusLabel', 'API unreachable');
    }
  }

  // ── Stats cards ────────────────────────────────────────────────────────
  async function _loadStats() {
    try {
      const { data } = await ApiClient.get('/stats');
      setEl('statTotalIncidents', data.incidents?.total ?? '–');
      setEl('statOpenIncidents',  data.incidents?.open  ?? '–');
      setEl('statFiringAlerts',   data.alerts?.firing   ?? '–');
      const rate = data.recovery?.successRatePct;
      setEl('statRecoveryRate', rate !== undefined ? `${rate}%` : '–');
    } catch { /* keep previous values */ }
  }

  // ── Incidents table ────────────────────────────────────────────────────
  async function _loadIncidents(page = _incidentPage) {
    const tbody = document.getElementById('incidentsTbody');
    if (!tbody) return;

    const status   = document.getElementById('incidentStatusFilter')?.value   || '';
    const severity = document.getElementById('incidentSeverityFilter')?.value || '';

    const params = new URLSearchParams({ page, limit: CONFIG.PAGE_SIZE });
    if (status)   params.set('status',   status);
    if (severity) params.set('severity', severity);

    try {
      const res = await ApiClient.get(`/incidents?${params}`);
      const { data: items, pagination } = res;

      _incidentPage  = page;
      _incidentTotal = pagination?.total ?? items.length;

      if (!items.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="table__empty">No incidents found.</td></tr>';
        document.getElementById('incidentPagination').innerHTML = '';
        return;
      }

      tbody.innerHTML = items.map((inc) => `
        <tr>
          <td class="table__title" title="${escHtml(inc.title)}">${escHtml(inc.title)}</td>
          <td>${badge(inc.severity)}</td>
          <td>${badge(inc.status)}</td>
          <td class="table__muted">${escHtml(inc.service || '–')}</td>
          <td class="table__muted">${fmtDate(inc.detectedAt)}</td>
          <td class="table__muted">${inc._count?.recoveries ?? 0}</td>
        </tr>
      `).join('');

      _renderPagination(
        'incidentPagination',
        pagination,
        (p) => _loadIncidents(p),
      );
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="6" class="table__empty">Failed to load incidents: ${escHtml(err.message)}</td></tr>`;
    }
  }

  // ── Alerts table ───────────────────────────────────────────────────────
  async function _loadAlerts() {
    const tbody = document.getElementById('alertsTbody');
    if (!tbody) return;

    try {
      const { data: items } = await ApiClient.get(`/alerts?limit=10&page=1`);

      if (!items.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="table__empty">No alerts found.</td></tr>';
        return;
      }

      tbody.innerHTML = items.map((a) => `
        <tr>
          <td class="table__title" title="${escHtml(a.alertname)}">${escHtml(a.alertname)}</td>
          <td>${badge(a.severity)}</td>
          <td class="table__muted">${escHtml(a.service || '–')}</td>
          <td>${badge(a.status)}</td>
          <td class="table__muted">${fmtDate(a.startsAt)}</td>
        </tr>
      `).join('');
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="5" class="table__empty">Failed to load alerts: ${escHtml(err.message)}</td></tr>`;
    }
  }

  // ── Recovery table ─────────────────────────────────────────────────────
  async function _loadRecoveries() {
    const tbody = document.getElementById('recoveryTbody');
    if (!tbody) return;

    try {
      const { data: items } = await ApiClient.get('/recovery?limit=10&page=1');

      if (!items.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="table__empty">No recovery records.</td></tr>';
        return;
      }

      tbody.innerHTML = items.map((r) => `
        <tr>
          <td>${badge(r.action)}</td>
          <td class="table__muted">${escHtml(r.targetService || '–')}</td>
          <td>${badge(r.status)}</td>
          <td class="table__muted">${r.automated ? 'Yes' : 'No'}</td>
          <td class="table__muted">${fmtDate(r.startedAt)}</td>
        </tr>
      `).join('');
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="5" class="table__empty">Failed to load recoveries: ${escHtml(err.message)}</td></tr>`;
    }
  }

  // ── AI stats panel ─────────────────────────────────────────────────────
  async function _loadAiStats() {
    const container  = document.getElementById('aiStats');
    const statusBadge = document.getElementById('aiStatusBadge');
    if (!container) return;

    try {
      const data = await ApiClient.aiGet('/stats');
      if (statusBadge) {
        statusBadge.textContent = 'Online';
        statusBadge.className   = 'badge badge--LOW';
      }

      const severityRows = Object.entries(data.by_severity || {})
        .map(([k, v]) => `<div class="ai-stat"><p class="ai-stat__label">${escHtml(k)}</p><p class="ai-stat__value">${v}</p></div>`)
        .join('');

      container.innerHTML = `
        <div class="ai-stat"><p class="ai-stat__label">Total incidents</p><p class="ai-stat__value">${data.total_incidents ?? 0}</p></div>
        ${severityRows || '<div class="ai-stat"><p class="ai-stat__label">No data</p><p class="ai-stat__value">–</p></div>'}
      `;
    } catch {
      if (statusBadge) {
        statusBadge.textContent = 'Offline';
        statusBadge.className   = 'badge badge--CRITICAL';
      }
      container.innerHTML = '<p class="ai-stats__loading">AI service is unavailable.</p>';
    }
  }

  // ── Pagination renderer ────────────────────────────────────────────────
  function _renderPagination(containerId, pagination, onPage) {
    const el = document.getElementById(containerId);
    if (!el || !pagination) return;

    const { page, totalPages } = pagination;
    if (totalPages <= 1) { el.innerHTML = ''; return; }

    const pages = [];
    // Always show first, last, current ±2
    const shown = new Set([1, totalPages, page, page - 1, page - 2, page + 1, page + 2]
      .filter((p) => p >= 1 && p <= totalPages));
    const sorted = [...shown].sort((a, b) => a - b);

    let prev = null;
    sorted.forEach((p) => {
      if (prev !== null && p - prev > 1) pages.push('…');
      pages.push(p);
      prev = p;
    });

    el.innerHTML = pages.map((p) => {
      if (p === '…') return `<span class="pagination__btn" style="pointer-events:none">…</span>`;
      return `<button class="pagination__btn ${p === page ? 'pagination__btn--active' : ''}"
        data-page="${p}" aria-label="Page ${p}" ${p === page ? 'aria-current="page"' : ''}>${p}</button>`;
    }).join('');

    el.querySelectorAll('[data-page]').forEach((btn) => {
      btn.addEventListener('click', () => onPage(parseInt(btn.dataset.page, 10)));
    });
  }

  // ── Bind auth form ─────────────────────────────────────────────────────
  function _bindAuthForm() {
    const form   = document.getElementById('loginForm');
    const errEl  = document.getElementById('authError');
    const loginBtn = document.getElementById('loginBtn');

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email    = document.getElementById('emailInput')?.value.trim();
      const password = document.getElementById('passwordInput')?.value;

      if (!email)    { setEl('emailError', 'Email is required.'); return; }
      if (!password) { setEl('passwordError', 'Password is required.'); return; }
      setEl('emailError', ''); setEl('passwordError', ''); setEl('authError', '');

      loginBtn.disabled = true;
      loginBtn.textContent = 'Signing in…';

      try {
        await Auth.login(email, password);
        _showDashboard();
      } catch (err) {
        setEl('authError', err.message || 'Login failed.');
      } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Sign in';
      }
    });
  }

  // ── Bind navbar ────────────────────────────────────────────────────────
  function _bindNavbar() {
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
      clearInterval(_refreshTimer);
      Auth.logout();
    });

    document.getElementById('refreshBtn')?.addEventListener('click', () => {
      refresh().then(() => showToast('Dashboard refreshed.', 'success', 2000));
    });
  }

  // ── Bind incident filters ──────────────────────────────────────────────
  function _bindIncidentFilters() {
    ['incidentStatusFilter', 'incidentSeverityFilter'].forEach((id) => {
      document.getElementById(id)?.addEventListener('change', () => {
        _incidentPage = 1;
        _loadIncidents(1);
      });
    });
  }

  // ── Create incident modal ──────────────────────────────────────────────
  function _bindCreateIncident() {
    const modal      = document.getElementById('createIncidentModal');
    const openBtn    = document.getElementById('newIncidentBtn');
    const closeBtn   = document.getElementById('closeCreateIncidentBtn');
    const cancelBtn  = document.getElementById('cancelCreateIncidentBtn');
    const form       = document.getElementById('createIncidentForm');
    const submitBtn  = document.getElementById('submitCreateIncidentBtn');
    const errorEl    = document.getElementById('createIncidentError');
    const titleErrEl = document.getElementById('incTitleError');

    const open  = () => { if (modal) modal.hidden = false; };
    const close = () => { if (modal) { modal.hidden = true; form?.reset(); setEl('createIncidentError', ''); setEl('incTitleError', ''); } };

    openBtn?.addEventListener('click', open);
    closeBtn?.addEventListener('click', close);
    cancelBtn?.addEventListener('click', close);
    modal?.addEventListener('click', (e) => { if (e.target === modal) close(); });

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('incTitle')?.value.trim();
      if (!title) { setEl('incTitleError', 'Title is required.'); return; }
      setEl('incTitleError', '');

      const body = {
        title,
        severity:    document.getElementById('incSeverity')?.value,
        service:     document.getElementById('incService')?.value.trim() || undefined,
        source:      document.getElementById('incSource')?.value.trim()  || undefined,
        description: document.getElementById('incDescription')?.value.trim() || undefined,
        rootCause:   document.getElementById('incRootCause')?.value.trim()   || undefined,
      };

      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating…';

      try {
        await ApiClient.post('/incidents', body);
        showToast('Incident created successfully.', 'success');
        close();
        await _loadIncidents(1);
        await _loadStats();
      } catch (err) {
        setEl('createIncidentError', err.message || 'Failed to create incident.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Incident';
      }
    });
  }

  // ── Test alert (sends to AI engine) ───────────────────────────────────
  function _bindTestAlert() {
    const testAlerts = [
      { alertname: 'PodCrashLooping', severity: 'critical', service: 'frontend', namespace: 'default' },
      { alertname: 'HighCPUUsage',    severity: 'warning',  service: 'backend',  namespace: 'default' },
      { alertname: 'OOMKilled',       severity: 'critical', service: 'worker',   namespace: 'default' },
      { alertname: 'NodeNotReady',    severity: 'critical', service: 'node-1',   namespace: 'kube-system' },
    ];

    document.getElementById('testAlertBtn')?.addEventListener('click', async () => {
      const alert = testAlerts[Math.floor(Math.random() * testAlerts.length)];
      try {
        // Send to AI engine for analysis + recovery
        await ApiClient.aiPost('/alert', alert);
        // Also ingest into the backend so it appears in the alerts table
        await ApiClient.post('/alerts', alert);
        showToast(`Test alert sent: ${alert.alertname}`, 'info');
        setTimeout(() => Promise.allSettled([_loadAlerts(), _loadStats(), _loadAiStats()]), 500);
      } catch (err) {
        showToast(`Failed to send test alert: ${err.message}`, 'error');
      }
    });
  }

  return { boot, refresh };
})();

// ════════════════════════════════════════════════════════════════════════════
// Entrypoint
// ════════════════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => Dashboard.boot());
