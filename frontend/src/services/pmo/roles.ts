const API =
  process.env.NEXT_PUBLIC_API_URL;

export async function getRoles() {

  const token =
    localStorage.getItem("token");

  const res = await fetch(
    `${API}/roles`,
    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(
      "Error cargando roles"
    );
  }

  return res.json();
}