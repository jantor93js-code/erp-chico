const API = process.env.NEXT_PUBLIC_API_URL;

export async function getInitiatives() {

  const res = await fetch(
    `${API}/pmo/initiatives`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(
      "Error cargando iniciativas"
    );
  }

  return res.json();
}

export async function createInitiative(
  data: {
    programId: string;
    nombre: string;
    descripcion?: string;
    responsable?: string;
    estado?: string;
    avance?: number;
  }
) {

  const res = await fetch(
    `${API}/pmo/initiatives`,
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
      "Error creando iniciativa"
    );
  }

  return res.json();
}

export async function updateInitiative(
  id: string,
  data: any,
) {

  const res = await fetch(
    `${API}/pmo/initiatives/${id}`,
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
      "Error actualizando iniciativa"
    );
  }

  return res.json();
}

export async function deleteInitiative(
  id: string,
) {

  const res = await fetch(
    `${API}/pmo/initiatives/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) {
    throw new Error(
      "Error eliminando iniciativa"
    );
  }

  return true;
}