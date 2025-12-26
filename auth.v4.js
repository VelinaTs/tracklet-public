// auth.v4.js - cookie-based auth helper with double-submit CSRF
// Exposes window.Auth with helpers for login, logout, register, profile, and generic apiFetch

(function() {
  const API_URL = 'https://price-monitor-backend-production-e326.up.railway.app';
  console.log('[auth.v4] Loaded. API_URL =', API_URL);

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  async function ensureCsrfToken() {
    let token = getCookie('csrf_token');
    if (!token) {
      try {
        // Hit a CSRF endpoint that sets/readable token cookie
        await fetch(`${API_URL}/auth/csrf`, { credentials: 'include' });
        token = getCookie('csrf_token');
      } catch (e) {
        // Ignore; server may set CSRF on login only
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
