
const API = process.env.NEXT_PUBLIC_API_URL;

export async function getProjects() {
  if (!API) {
    console.warn('NEXT_PUBLIC_API_URL is not set; getProjects will return []');
    return [];
  }

  try {
    const res = await fetch(`${API}/pmo/projects`, { cache: 'no-store' });
    if (!res.ok) {
      console.error('getProjects non-ok response', res.status);
      return [];
    }
    return res.json();
  } catch (err) {
    console.error('getProjects fetch failed', err);
    return [];
  }
}

export async function createProject(
  data: {
    initiativeId: string;
    nombre: string;
    descripcion?: string;
    estado?: string;
    avance?: number;
    fechaInicio?: string;
    fechaFin?: string;
    codigo?: string;
    area?: string;
    objetivo?: string;
    observaciones?: string;
    estadoDocumental?: string;
    fuente?: string;
    liderId?: string;
  }
) {

  const token =
    localStorage.getItem("token");

  const res = await fetch(
    `${API}/pmo/projects`,
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

    const error =
      await res.text();

    throw new Error(error);
  }

  return res.json();
}
export async function updateProject(
  id: string,
  data: {
    initiativeId?: string;
    nombre?: string;
    descripcion?: string;
    estado?: string;
    avance?: number;
    fechaInicio?: string;
    fechaFin?: string;
    codigo?: string;
    area?: string;
    objetivo?: string;
    observaciones?: string;
    estadoDocumental?: string;
    fuente?: string;
    liderId?: string;
  },
) {
  const token =
    localStorage.getItem("token");

  const res = await fetch(
    `${API}/pmo/projects/${id}`,
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
      "Error actualizando proyecto"
    );
  }

  return res.json();
}

export async function deleteProject(
  id: string,
) {
  const token =
    localStorage.getItem("token");

  const res = await fetch(
    `${API}/pmo/projects/${id}`,
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
      "Error eliminando proyecto"
    );
  }

  return true;
}