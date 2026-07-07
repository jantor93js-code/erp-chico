const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
if (!process.env.NEXT_PUBLIC_API_URL) {
  console.warn('NEXT_PUBLIC_API_URL no definido en tiempo de build, usando fallback:', API_URL);
}

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function headers(json = false) {
  const token = getToken();
  const h: Record<string, string> = {};
  if (token) h["Authorization"] = `Bearer ${token}`;
  if (json) h["Content-Type"] = "application/json";
  return h;
}

function parseBody(text: string) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function handle(res: Response) {
  const text = await res.text();
  const body = parseBody(text);

  if (!res.ok) {
    const error = new Error(
      body?.message || (typeof body === 'string' ? body : `Error ${res.status}`),
    );
    Object.assign(error, { status: res.status, body });
    throw error;
  }

  return body;
}

async function fetchWithUrl(url: string, init: RequestInit) {
  try {
    return await fetch(url, init);
  } catch (error) {
    console.error('Fetch error', { url, init, error });
    throw error;
  }
}

export async function apiGet(endpoint: string) {
  const url = `${API_URL}${endpoint}`;
  return handle(await fetchWithUrl(url, { headers: headers() }));
}

export async function apiPost(endpoint: string, body: unknown) {
  const url = `${API_URL}${endpoint}`;
  return handle(
    await fetchWithUrl(url, {
      method: "POST",
      headers: headers(true),
      body: JSON.stringify(body),
    }),
  );
}

export async function apiPostForm(endpoint: string, body: FormData) {
  return handle(
    await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: headers(),
      body,
    }),
  );
}

export async function apiPatch(endpoint: string, body: unknown) {
  const url = `${API_URL}${endpoint}`;
  console.log("PATCH URL", url);
  console.log("PATCH PAYLOAD", body);
  
  const response = await fetch(url, {
    method: "PATCH",
    headers: headers(true),
    body: JSON.stringify(body),
  });
  
  const result = await handle(response);
  console.log("PATCH RESPONSE", result);
  
  return result;
}

export async function apiDelete(endpoint: string) {
  return handle(
    await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers: headers(),
    }),
  );
}
