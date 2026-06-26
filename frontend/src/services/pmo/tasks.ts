const API = process.env.NEXT_PUBLIC_API_URL;

export async function getTasks() {
  if (!API) {
    console.warn('NEXT_PUBLIC_API_URL is not set; getTasks will return []');
    return [];
  }

  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`${API}/pmo/tasks`, {
      cache: 'no-store',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.error('getTasks non-ok response', res.status);
      return [];
    }

    return res.json();
  } catch (err) {
    console.error('getTasks fetch failed', err);
    return [];
  }
}

export async function createTask(data: any) {
  const token =
    localStorage.getItem("token");

  const res = await fetch(
    `${API}/pmo/tasks`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    let message = text;

    try {
      const body = JSON.parse(text);
      message = body.message || body.error || text;
    } catch {
      message = text;
    }

    throw new Error(
      message || `Error creando tarea (${res.status})`,
    );
  }

  return res.json();
}
export async function deleteTask(
  id: string,
) {
  const token =
    localStorage.getItem("token");

  const res = await fetch(
    `${API}/pmo/tasks/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Error eliminando tarea");
  }

  return true;
}



export async function updateTask(
  id: string,
  data: any,
) {
  const token =
    localStorage.getItem("token");

  const res = await fetch(
    `${API}/pmo/tasks/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    let message = text;

    try {
      const body = JSON.parse(text);
      message = body.message || body.error || body?.error?.message || text;
    } catch {
      message = text;
    }

    throw new Error(
      message || `Error actualizando tarea (${res.status})`,
    );
  }

  return res.json();
}

