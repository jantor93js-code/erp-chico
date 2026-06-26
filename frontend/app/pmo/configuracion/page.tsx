"use client";

import { useEffect, useState } from "react";

import PmoShell from "@/src/components/layout/PmoShell";
import PageHeader from "@/src/components/pmo/PageHeader";
import ExecutiveCard from "@/src/components/pmo/ExecutiveCard";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/src/services/pmo/users";

import {
  getRoles,
} from "@/src/services/pmo/roles";
interface User {
  id: string;

  nombre: string;

  email: string;

  scope: string;

  roleId: string;

  role?: {
    id: string;
    nombre: string;
    slug: string;
  };
}

interface Role {
  id: string;
  nombre: string;
  slug: string;
}
export default function ConfiguracionPage() {

  const [users, setUsers] =
    useState<User[]>([]);

  const [roles, setRoles] =
    useState<Role[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showModal, setShowModal] =
    useState(false);

  const [editingUserId,
    setEditingUserId] =
    useState<string | null>(null);

  const [email, setEmail] =
    useState("");

    const [nombre, setNombre] =
  useState("");

  const [password, setPassword] =
    useState("");

  const [roleId, setRoleId] =
    useState("");
  const [cargoMap, setCargoMap] = useState<Record<string, string>>({});
  const [cargo, setCargo] = useState("");

  useEffect(() => {
    loadData();
  }, []);
  async function loadData() {

  try {

    const [
      usersData,
      rolesData,
    ] = await Promise.all([
      getUsers(),
      getRoles(),
    ]);

    setUsers(usersData);
    setRoles(rolesData);
    // load cargo map from localStorage (visual only)
    try {
      const raw = localStorage.getItem('pmo_user_cargo');
      if (raw) setCargoMap(JSON.parse(raw));
    } catch (e) {
      // ignore
    }

  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);

  }
}
async function handleSaveUser() {

  try {

    if (editingUserId) {

      await updateUser(
  editingUserId,
  {
    nombre,
    email,
    roleId,

    ...(password
      ? { password }
      : {}),
  }
);

    } else {

      await createUser({
  nombre,
  email,
  password,

  scope: "PMO",

  roleId,

  tenantId:
    "d07d9ffa-9267-41d0-8b43-14ddbb0823a0",
});

    }

    setShowModal(false);

    setEditingUserId(null);

    setNombre("");
  setEmail("");
  setPassword("");
  setRoleId("");
  setCargo("");
     loadData();

  } catch (error) {

    console.error(error);

    alert(
      "Error guardando usuario"
    );
  }
  // Save cargo locally (visual only)
  try {
    if (editingUserId) {
      const next = { ...cargoMap, [editingUserId]: cargo };
      setCargoMap(next);
      localStorage.setItem('pmo_user_cargo', JSON.stringify(next));
    }
  } catch (e) {
    console.warn('Could not save cargo locally', e);
  }
}
async function handleDeleteUser(
  id: string,
) {

  const ok =
    confirm(
      "¿Eliminar usuario?"
    );

  if (!ok) return;

  try {

    await deleteUser(id);

    loadData();

  } catch (error) {

    console.error(error);

    alert(
      "No fue posible eliminar"
    );
  }
}
  return (
  <PmoShell>
    <PageHeader
      section="PMO · Configuración"
      title="Usuarios"
      description="Administración de usuarios del PMO"
    />

    <div className="space-y-6 px-8 py-6">

      <div className="grid gap-4 md:grid-cols-3">
        <ExecutiveCard
          label="Usuarios"
          value={String(users.length)}
          accent="gold"
        />

        <ExecutiveCard
          label="Roles"
          value={String(roles.length)}
          accent="green"
        />

        <ExecutiveCard
          label="Activos"
          value={String(users.length)}
          accent="gold"
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 text-white"
          style={{
            background: "#C89B2A",
          }}
        >
          + Nuevo Usuario
        </button>
      </div>

      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #D6D3D1",
        }}
      >
        {loading ? (
          <div className="p-8">
            Cargando...
          </div>
        ) : (
          <table className="w-full">
            <thead>
  <tr>
    <th className="px-6 py-3 text-left">
      Nombre
    </th>

    <th className="px-6 py-3 text-left">
      Email
    </th>

    <th className="px-6 py-3 text-left">
      Rol
    </th>

    <th className="px-6 py-3 text-left">
      Cargo
    </th>

    <th className="px-6 py-3 text-left">
      Acciones
    </th>
  </tr>
</thead>

            <tbody>

              {users.map((user) => (

               <tr key={user.id}>

  <td className="px-6 py-4">
    {user.nombre}
  </td>

  <td className="px-6 py-4">
    {user.email}
  </td>

  <td className="px-6 py-4">
    {user.role?.nombre}
  </td>

                <td className="px-6 py-4">
                  {cargoMap[user.id] || ""}
                </td>

  <td className="px-6 py-4">

                    <button
                      onClick={() => {

                        setEditingUserId(
                          user.id
                        );

setNombre(
  user.nombre
);

                        setEmail(
                          user.email
                        );

                        setRoleId(
                          user.roleId
                        );

                        setPassword("");

                        setShowModal(
                          true
                        );

                      }}
                    >
                      ✏️ Editar
                    </button>

                    <button
                      className="ml-4"
                      onClick={() =>
                        handleDeleteUser(
                          user.id
                        )
                      }
                    >
                      🗑️ Eliminar
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>
          </table>
        )}
      </div>

    </div>
    {showModal && (
  <div
    className="fixed inset-0 flex items-center justify-center"
    style={{
      background: "rgba(0,0,0,0.45)",
    }}
  >
    <div
      className="w-full max-w-lg p-6"
      style={{
        background: "#FFFFFF",
      }}
    >
      <h2 className="mb-4 text-lg font-semibold">
        {
          editingUserId
            ? "Editar Usuario"
            : "Nuevo Usuario"
        }
      </h2>

      <div className="space-y-4">

<input
  placeholder="Nombre"
  className="w-full border p-2"
  value={nombre}
  onChange={(e) =>
    setNombre(
      e.target.value
    )
  }
/>

            <input
              placeholder="Cargo (visual)"
              className="w-full border p-2"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
            />

        <input
          placeholder="Email"
          className="w-full border p-2"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

        <input
          type="password"
          placeholder={
            editingUserId
              ? "Nueva contraseña (opcional)"
              : "Contraseña"
          }
          className="w-full border p-2"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <select
          className="w-full border p-2"
          value={roleId}
          onChange={(e) =>
            setRoleId(
              e.target.value
            )
          }
        >
          <option value="">
            Seleccione rol
          </option>

          {roles
  .filter(
    (role) =>
      role.nombre === "PMO Admin" ||
      role.nombre === "PMO User"
  )
  .map((role) => (
    <option
      key={role.id}
      value={role.id}
    >
      {role.nombre}
    </option>
))}
        </select>

      </div>

      <div className="mt-6 flex justify-end gap-3">

        <button
          onClick={() => {

            setShowModal(false);

            setEditingUserId(
              null
            );

          }}
        >
          Cancelar
        </button>

        <button
          onClick={handleSaveUser}
        >
          {
            editingUserId
              ? "Actualizar"
              : "Crear"
          }
        </button>

      </div>

    </div>
  </div>
)}
  </PmoShell>
);

}