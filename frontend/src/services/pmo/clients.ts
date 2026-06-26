const API = process.env.NEXT_PUBLIC_API_URL;

export async function getClients() {
  if (!API) {
    console.warn('NEXT_PUBLIC_API_URL is not set; getClients will return []');
    return [];
  }

  try {
    const res = await fetch(`${API}/pmo/clients`, { cache: 'no-store' });

    if (!res.ok) {
      console.error('getClients: non-ok response', res.status);
      return [];
    }

    return res.json();
  } catch (err) {
    console.error('getClients fetch failed', err);
    return [];
  }
}

export async function createClient(
  data: {
    nombre: string;
    nit?: string;
    contacto?: string;
    email?: string;
    estado?: string;
  }
) {

  const res = await fetch(
    `${API}/pmo/clients`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw new Error(
      "Error creando cliente"
    );
  }

  return res.json();
}

export async function updateClient(
  id: string,
  data: any,
) {

  const res = await fetch(
    `${API}/pmo/clients/${id}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw new Error(
      "Error actualizando cliente"
    );
  }

  return res.json();
}

export async function deleteClient(
  id: string,
) {

  const res = await fetch(
    `${API}/pmo/clients/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    throw new Error(
      "Error eliminando cliente"
    );
  }

  return true;
}