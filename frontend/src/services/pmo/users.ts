const API = process.env.NEXT_PUBLIC_API_URL;

export async function getUsers() {
  if (!API) {
    console.warn('NEXT_PUBLIC_API_URL is not set; getUsers will return []');
    return [];
  }

  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`${API}/users?scope=PMO`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.error('getUsers non-ok response', res.status);
      return [];
    }

    return res.json();
  } catch (err) {
    console.error('getUsers fetch failed', err);
    return [];
  }
}


export async function createUser(
  data: any,
) {

  const token =
    localStorage.getItem("token");

  const res = await fetch(
    `${API}/users`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
        Authorization:
          `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw new Error(
      "Error creando usuario"
    );
  }

  return res.json();
}

export async function updateUser(
  id: string,
  data: any,
) {

  const token =
    localStorage.getItem("token");

  const res = await fetch(
    `${API}/users/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type":
          "application/json",
        Authorization:
          `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw new Error(
      "Error actualizando usuario"
    );
  }

  return res.json();
}

export async function deleteUser(
  id: string,
) {

  const token =
    localStorage.getItem("token");

  const res = await fetch(
    `${API}/users/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(
      "Error eliminando usuario"
    );
  }

  return true;
}
