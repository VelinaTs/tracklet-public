// auth.js - cookie-based auth helper with double-submit CSRF
// Exposes window.Auth with helpers for login, logout, register, profile, and generic apiFetch

(function() {
  const API_URL = 'https://price-monitor-backend-production-e326.up.railway.app';

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  async function ensureCsrfToken() {
    // Try common cookie names first (double-submit pattern)
    const cookieNames = ['csrf_token', 'XSRF-TOKEN', 'xsrf-token', 'csrfToken', 'X-CSRF-Token'];
    let token = null;
    for (const name of cookieNames) {
      token = getCookie(name);
      if (token) break;
    }

    // If not found in cookies, try common CSRF endpoints and read JSON payload if present
    if (!token) {
      const endpoints = ['/auth/csrf', '/csrf', '/csrf-token', '/api/csrf'];
      for (const ep of endpoints) {
        try {
          const res = await fetch(`${API_URL}${ep}`, { credentials: 'include' });
          const ct = res.headers.get('content-type') || '';
          if (ct.includes('application/json')) {
            const data = await res.json().catch(() => ({}));
            token = data.csrfToken || data.token || data.csrf || data.xsrfToken || null;
            if (token) break;
          }
          for (const name of cookieNames) {
            token = getCookie(name);
            if (token) break;
          }
          if (token) break;
        } catch (e) {
          // continue
        }
      }
    }
    return token;
  }

  function isMutating(method) {
    return /^(POST|PUT|PATCH|DELETE)$/i.test(method || 'GET');
  }

  async function apiFetch(endpoint, options = {}) {
    const method = options.method || 'GET';
    const headers = { ...(options.headers || {}) };
    const opts = { method, credentials: 'include', headers };

    if (options.body) {
      if (typeof options.body === 'object' && !(options.body instanceof FormData)) {
        opts.headers['Content-Type'] = 'application/json';
        opts.body = JSON.stringify(options.body);
      } else {
        opts.body = options.body;
      }
    }

    if (isMutating(method)) {
      const csrf = await ensureCsrfToken();
      if (csrf) {
        opts.headers['X-CSRF-Token'] = csrf;
        opts.headers['X-XSRF-TOKEN'] = csrf;
      }
    }

    return fetch(`${API_URL}${endpoint}`, opts);
  }

  async function login(email, password) {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
  }

  async function register(name, email, password) {
    return apiFetch('/auth/register', {
      method: 'POST',
      body: { name, email, password }
    });
  }

  async function logout() {
    return apiFetch('/auth/logout', { method: 'POST' });
  }

  async function getProfile() {
    return apiFetch('/auth/me', { method: 'GET' });
  }

  window.Auth = {
    API_URL,
    getCookie,
    ensureCsrfToken,
    apiFetch,
    login,
    register,
    logout,
    getProfile,
  };
})();
