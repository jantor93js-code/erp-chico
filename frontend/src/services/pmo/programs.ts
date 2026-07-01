const API = process.env.NEXT_PUBLIC_API_URL;

export async function getPrograms() {

  const res = await fetch(
    `${API}/pmo/programs`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(
      "Error cargando programas"
    );
  }

  return res.json();
}

export async function 
  createProgram(
  data: {
    clientId: string;
    nombre: string;
    descripcion?: string;
    estado?: string;
  }
) {

  const res = await fetch(
    `${API}/pmo/programs`,
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
      "Error creando programa"
    );
  }

  return res.json();
}

export async function updateProgram(
  id: string,
  data: unknown,
) {

  const res = await fetch(
    `${API}/pmo/programs/${id}`,
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
      "Error actualizando programa"
    );
  }

  return res.json();
}

export async function deleteProgram(
  id: string,
) {

  const res = await fetch(
    `${API}/pmo/programs/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    throw new Error(
      "Error eliminando programa"
    );
  }

  return true;
}