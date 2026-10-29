const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY || 'orbit_access_token';
const DEMO_TOKEN_KEY = 'demo_mode';

async function request(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const isDemo = localStorage.getItem(DEMO_TOKEN_KEY) === 'true';
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...(isDemo && !token && { 'Authorization': `Bearer demo` }),
      ...options.headers 
    },
    ...options
  });
  const payload = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(payload?.message || 'Request failed');
  return payload;
}

export function setDemoMode(enabled) {
  if (enabled) {
    localStorage.setItem(DEMO_TOKEN_KEY, 'true');
  } else {
    localStorage.removeItem(DEMO_TOKEN_KEY);
  }
}

export function isDemoMode() {
  return localStorage.getItem(DEMO_TOKEN_KEY) === 'true';
}

export function getGmailAuthUrl() {
  return request('/email/gmail/auth-url', { method: 'GET' });
}

export function connectGmail(code) {
  return request('/email/gmail/connect', { method: 'POST', body: JSON.stringify({ code }) });
}

export function syncEmails(emailAccountId, maxResults = 50) {
  return request('/email/sync', { method: 'POST', body: JSON.stringify({ emailAccountId, maxResults }) });
}

export function getEmailAccounts() {
  return request('/email/accounts', { method: 'GET' });
}

export function disconnectEmail(emailAccountId) {
  return request(`/email/accounts/${emailAccountId}`, { method: 'DELETE' });
}

export function getPendingConfirmations() {
  return request('/email/pending-confirmations', { method: 'GET' });
}

export function confirmParsedEmail(parsedEmailId, action, data = {}) {
  return request(`/email/confirm/${parsedEmailId}`, { method: 'POST', body: JSON.stringify({ action, ...data }) });
}