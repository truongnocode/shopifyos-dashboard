const API_BASE = import.meta.env.VITE_API_URL || '';

async function fetchJSON(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function postJSON(path, data) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function putJSON(path, data) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getDashboard: () => fetchJSON('/api/shopify'),
  getStores: () => fetchJSON('/api/shopify/stores'),
  getProducts: (storeId) => fetchJSON(`/api/shopify/products${storeId ? `?storeId=${storeId}` : ''}`),
  getProduct: (id) => fetchJSON(`/api/shopify/products/${id}`),
  updateProduct: (id, data) => putJSON(`/api/shopify/products/${id}`, data),
  getRuns: () => fetchJSON('/api/shopify/runs'),
  getInsights: () => fetchJSON('/api/shopify/insights'),
  getCompetitors: () => fetchJSON('/api/shopify/competitors'),
  getThemes: () => fetchJSON('/api/shopify/themes'),
  getSkillOutputs: (skill) => fetchJSON(`/api/shopify/skill-outputs${skill ? `?skill=${skill}` : ''}`),
  syncStore: (storeId) => postJSON('/api/shopify', { action: 'sync', storeId }),
  crawlCompetitor: (url, storeId) => postJSON('/api/shopify', { action: 'crawl', url, storeId }),
  optimizeStore: (storeId) => postJSON('/api/shopify', { action: 'optimize', storeId }),
  createInsight: (data) => postJSON('/api/shopify/insights', data),
  saveSkillOutput: (data) => postJSON('/api/shopify/skill-outputs', data),
  getNiches: () => fetchJSON('/api/shopify/niches'),
  createNiche: (data) => postJSON('/api/shopify/niches', data),
  deleteNiche: (id) => fetch(`${API_BASE}/api/shopify/niches?id=${id}`, { method: 'DELETE' }).then(r => r.json()),
  createStore: (data) => postJSON('/api/shopify/stores', data),
  deleteStore: (id) => fetch(`${API_BASE}/api/shopify/stores?id=${id}`, { method: 'DELETE' }).then(r => r.json()),
  importCrawled: (storeId, sessionId) => postJSON('/api/shopify', { action: 'import-crawled', storeId, sessionId }),
  exportCrawl: (sessionId, format = 'json') => fetchJSON(`/api/shopify/crawl-export?sessionId=${sessionId}&format=${format}`),
  downloadCrawlCsv: async (sessionId) => {
    const res = await fetch(`${API_BASE}/api/shopify/crawl-export?sessionId=${sessionId}&format=csv`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `crawl-${sessionId}.csv`;
    a.click();
  },
};
