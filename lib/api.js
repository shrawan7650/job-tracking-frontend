const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const TOKEN_KEY = 'orbit_access_token';

export function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function saveAccessToken(token) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken() {
  if (typeof window !== 'undefined') window.localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = getAccessToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, {
    headers,
    ...options
  });
  const payload = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    const error = new Error(payload?.message || 'Request failed');
    error.status = response.status;
    throw error;
  }
  return payload;
}

export async function authenticateWithGoogle(credential) {
  const payload = await request('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ credential })
  });
  if (!payload?.data?.token) throw new Error('Authentication response did not include a token');
  saveAccessToken(payload.data.token);
  return payload.data;
}

export function getCurrentUser() {
  return request('/auth/me');
}

export function getApplications({ status, search } = {}) {
  const params = new URLSearchParams({ limit: '100' });
  if (status && status !== 'all') params.set('status', status);
  if (search?.trim()) params.set('search', search.trim());
  return request(`/applications?${params}`);
}

export function createApplication(data) {
  return request('/applications', { method: 'POST', body: JSON.stringify(data) });
}

export function deleteApplication(id) {
  return request(`/applications/${id}`, { method: 'DELETE' });
}
