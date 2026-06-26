const API = process.env.NEXT_PUBLIC_API_URL;

export async function getComments(
  taskId: string
) {
  const token =
    localStorage.getItem("token");

  const res = await fetch(
    `${API}/pmo/tasks/${taskId}/comments`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(
      "Error cargando comentarios"
    );
  }

  return res.json();
}

export async function createComment(
  taskId: string,
  comentario: string
) {
  const token =
    localStorage.getItem("token");

  const res = await fetch(
    `${API}/pmo/tasks/${taskId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
        Authorization:
          `Bearer ${token}`,
      },
      body: JSON.stringify({
        comentario,
      }),
    }
  );

  if (!res.ok) {
    const error =
      await res.text();

    console.error(error);

    throw new Error(
      "Error creando comentario"
    );
  }

  return res.json();
}
