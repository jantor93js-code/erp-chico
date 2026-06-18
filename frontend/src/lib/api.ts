const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getToken() {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("token");
}

export async function apiGet(endpoint: string) {
  const token = getToken();

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      headers: {
        Authorization: token
          ? `Bearer ${token}`
          : "",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Error ${response.status}`
    );
  }

  return response.json();
}

export async function apiPost(
  endpoint: string,
  body: any
) {
  const token = getToken();

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        Authorization: token
          ? `Bearer ${token}`
          : "",
      },

      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Error ${response.status}`
    );
  }

  return response.json();
}