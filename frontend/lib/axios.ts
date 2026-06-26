const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

function buildQuery(params?: Record<string, unknown>) {
  if (!params) return '';
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
}

function headers(json = false) {
  const h: Record<string, string> = {
    Accept: 'application/json',
  };
  if (json) h['Content-Type'] = 'application/json';
  return h;
}

async function handleResponse(response: Response) {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const error = new Error(data?.message || `Request failed with status ${response.status}`);
    throw error;
  }

  return data;
}

async function request(method: string, endpoint: string, options: { params?: Record<string, unknown>; data?: unknown } = {}) {
  const url = `${API_URL}${endpoint}${buildQuery(options.params)}`;
  
  // Get token from localStorage if available
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }
  
  const h = headers(method !== 'GET');
  if (token) {
    h['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    method,
    headers: h,
    body: method === 'GET' || options.data === undefined ? undefined : JSON.stringify(options.data),
  });
  const data = await handleResponse(response);
  return { data };
}

export const api = {
  get(endpoint: string, config?: { params?: Record<string, unknown> }) {
    return request('GET', endpoint, { params: config?.params });
  },

  post(endpoint: string, data?: unknown) {
    return request('POST', endpoint, { data });
  },

  patch(endpoint: string, data?: unknown) {
    return request('PATCH', endpoint, { data });
  },

  delete(endpoint: string) {
    return request('DELETE', endpoint);
  },
};
