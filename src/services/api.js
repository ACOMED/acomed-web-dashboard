
const BASE_URL = 'https://api.acomed.tech/api';
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const req = async (url, opts = {}) => {
  const response = await fetch(`${BASE_URL}${url}`, { headers: getHeaders(), ...opts });
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.hash = '#/login';
    throw new Error('Unauthorized');
  }
  return response.json();
};

export const api = {
  // ── Auth ──────────────────────────────────────────
  login: (credentials) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }).then(r => r.json()),
  updateProfile: (data) => req('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // ── Knowledge Base ────────────────────────────────
  getKnowledgeBaseArticles: () => req('/knowledge-base/articles'),

  // ── Templates ─────────────────────────────────────
  getTemplates:  ()     => req('/templates'),
  saveTemplate:  (data) => req('/templates', { method: 'POST', body: JSON.stringify(data) }),
  getTemplate:   (id)   => req(`/templates/${id}`),
  deleteTemplate:(id)   => req(`/templates/${id}`, { method: 'DELETE' }),

  // ── Audits ────────────────────────────────────────
  getAudits:     ()            => req('/audits'),
  getAudit:      (id)          => req(`/audits/${id}`),
  createAudit:   (data)        => req('/audits', { method: 'POST', body: JSON.stringify(data) }),
  updateAuditStatus: (id, status) =>
    req(`/audits/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // ── CAPA ──────────────────────────────────────────
  getCapas:       ()           => req('/capas'),
  createCapa:     (data)       => req('/capas', { method: 'POST', body: JSON.stringify(data) }),
  updateCapaStatus: (id, status) =>
    req(`/capas/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // ── Analytics ─────────────────────────────────────
  getAnalyticsOverview: () => req('/analytics/overview'),

  // ── Tenants ───────────────────────────────────────
  getFacilities:   ()     => req('/tenants/facilities'),
  createFacility:  (data) => req('/tenants/facilities', { method: 'POST', body: JSON.stringify(data) }),
  assignInspector: (facilityId, inspector_id) =>
    req(`/tenants/facilities/${facilityId}/assign-inspector`, { method: 'POST', body: JSON.stringify({ inspector_id }) }),
  unassignInspector: (facilityId, inspectorId) =>
    req(`/tenants/facilities/${facilityId}/assign-inspector/${inspectorId}`, { method: 'DELETE' }),

  getUsers:      ()     => req('/tenants/users'),
  createUser:    (data) => req('/tenants/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUserRole:(id, role) =>
    req(`/tenants/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),

  // ── Search & Notifications ────────────────────────
  globalSearch:  (query) => req(`/search?q=${encodeURIComponent(query)}`),
  getNotifications: ()   => req('/notifications'),
  markNotificationRead: (id) => req(`/notifications/${id}/read`, { method: 'PATCH' }),
};
