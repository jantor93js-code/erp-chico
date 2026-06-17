const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiGet(endpoint: string) {
  const response = await fetch(`${API_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`Error ${response.status}`);
  }

  return response.json();
}