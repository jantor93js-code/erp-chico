const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

export async function apiGet(endpoint: string) {
  return handle(await fetch(`${API_URL}${endpoint}`, { headers: headers() }));
}

export async function apiPost(endpoint: string, body: unknown) {
  return handle(
    await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: headers(true),
      body: JSON.stringify(body),
    }),
  );
}

export async function apiPatch(endpoint: string, body: unknown) {
  return handle(
    await fetch(`${API_URL}${endpoint}`, {
      method: "PATCH",
      headers: headers(true),
      body: JSON.stringify(body),
    }),
  );
}

export async function apiDelete(endpoint: string) {
  return handle(
    await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers: headers(),
    }),
  );
}
