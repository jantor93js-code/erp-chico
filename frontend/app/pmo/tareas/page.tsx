"use client";

import { useEffect, useState } from "react";

import PmoShell from "@/src/components/layout/PmoShell";
import StatusBadge from "@/src/components/pmo/StatusBadge";
import PageHeader from "@/src/components/pmo/PageHeader";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/src/services/pmo/tasks";

interface Task {
  id: string;
  titulo: string;
  descripcion?: string;
  estado: string;
  prioridad: string;
  fechaLimite?: string;

  responsableId?: string;
projectId?: string;
  responsable?: {
    id: string;
    email: string;
    nombre?: string;
  };
proyecto?: {
  id: string;
  nombre: string;
};
  comentarios?: any[];
}

export default function TareasPage() {
  

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
const [showModal, setShowModal] =
  useState(false);

const [titulo, setTitulo] =
  useState("");

const [descripcion, setDescripcion] =
  useState("");

useEffect(() => {
  loadTasks();
  loadUsers();
  loadProjects();
}, []);

const [users, setUsers] =
  useState<any[]>([]);

const [projects, setProjects] =
  useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const [projectId, setProjectId] = useState("");

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const sp = new URLSearchParams(window.location.search);
        const id = sp.get("projectId");
        setSelectedProjectId(id);
        if (id) setProjectId(id);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

const [responsableId,
  setResponsableId] =
  useState("");

const [prioridad, setPrioridad] =
  useState("MEDIA");

const [fechaLimite, setFechaLimite] =
  useState("");

  const [showCommentsModal, setShowCommentsModal] =
  useState(false);

const [selectedTask, setSelectedTask] =
  useState<Task | null>(null);

const [comments, setComments] =
  useState<any[]>([]);

const [newComment, setNewComment] =
  useState("");

const [editingTaskId, setEditingTaskId] =
  useState<string | null>(null);

  async function loadTasks() {
  try {

    const data =
      await getTasks();

    console.log(
      "TASKS:",
      data
    );

    setTasks(data);

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}

async function loadUsers() {
  try {

    const {
      getUsers,
    } = await import(
      "@/src/services/pmo/users"
    );

    console.log(
      "CARGANDO USERS"
    );

    const usersData =
      await getUsers();

    console.log(
      "USERS:",
      usersData
    );

    setUsers(
      usersData
    );

  } catch (error) {
    console.error(error);
  }
}

async function loadProjects() {
  try {

    const {
      getProjects,
    } = await import(
      "@/src/services/pmo/projects"
    );

    const data =
      await getProjects();

    setProjects(data);

  } catch (error) {
    console.error(error);
  }
}

async function handleCreateTask() {
  try {

    if (!titulo.trim()) {
      alert("Ingrese un título");
      return;
    }

    if (editingTaskId) {

      const updatedTask =
        await updateTask(
          editingTaskId,
          {
  titulo,
  descripcion,
  prioridad,
  fechaLimite,
}
        );

      await loadTasks();

    } else {

      const newTask =
        await createTask({
  titulo,
  descripcion,
  estado: "PENDIENTE",
  prioridad,
  fechaLimite,
  responsableId,
  projectId,
});

      await loadTasks();

    }

    setTitulo("");
    setDescripcion("");

    setPrioridad("MEDIA");

    setEditingTaskId(null);

    setShowModal(false);

    setResponsableId("");

    setProjectId("");

  } catch (error: any) {
    console.error(error);
    alert(error?.message || "Error creando tarea");
  }
}
  async function handleDeleteTask(
  id: string
) {
  const confirmDelete =
    window.confirm(
      "¿Eliminar esta tarea?"
    );

  if (!confirmDelete) {
    return;
  }

  try {

    await deleteTask(id);

setTasks((prev) =>
  prev.filter(
    (task) => task.id !== id
  )
);

  } catch (error) {
    console.error(error);
  }
}

async function changeStatus(
  task: Task,
  estado: string
) {
  try {
    const payload = {
      estado,
    };

    console.log('changeStatus payload', payload);

    const updatedTask =
      await updateTask(
        task.id,
        payload,
      );

    console.log('updateTask()', updatedTask);

    await loadTasks();

  } catch (error: any) {
    console.error(error);
    alert(error?.message || 'Error actualizando tarea');
  }
}

function handleEditTask(
  task: Task
) {
  setEditingTaskId(task.id);

  setTitulo(task.titulo);

  setDescripcion(
    task.descripcion || ""
  );

  setResponsableId(
  task.responsableId || ""
);

  setFechaLimite(
  task.fechaLimite || ""
);

setPrioridad(
  task.prioridad || "MEDIA"
);

setProjectId(
  task.proyecto?.id || ""
);

  setShowModal(true);
}

async function openComments(
  task: Task
) {
  try {

    setSelectedTask(task);

    const {
      getComments,
    } = await import(
      "@/src/services/pmo/comments"
    );

    const data =
  await getComments(
    task.id
  );

console.log(
  "COMMENTS:",
  data
);

console.log(data);

setComments(data);

    setComments(data);

    setShowCommentsModal(true);

  } catch (error) {
    console.error(error);
  }
}

async function handleCreateComment() {
  try {

    if (!selectedTask) {
      return;
    }

    if (!newComment.trim()) {
      alert(
        "Ingrese un comentario"
      );
      return;
    }

    const {
      createComment,
      getComments,
    } = await import(
      "@/src/services/pmo/comments"
    );

    const result =
      await createComment(
        selectedTask.id,
        newComment
      );

    console.log(
      "COMENTARIO CREADO:",
      result
    );

    const updatedComments =
      await getComments(
        selectedTask.id
      );

    setComments(
      updatedComments
    );

    setNewComment("");

  } catch (error) {
    console.error(error);
  }
}

  const filteredTasks =
  selectedProjectId
    ? tasks.filter(
        (t: any) =>
          t.projectId === selectedProjectId
      )
    : tasks;

const columns = [
  {
    id: "PENDIENTE",
    label: "Pendiente",
    accentBg: "#F5F3EF",
    accentText: "#6B7280",
    accentBorder: "#D6D3D1",
    dot: "#9CA3AF",
    tasks: filteredTasks.filter(
      (t) => t.estado === "PENDIENTE"
    ),
  },

  {
    id: "EN_CURSO",
    label: "En Curso",
    accentBg: "#FEF3C7",
    accentText: "#92400E",
    accentBorder: "#FDE68A",
    dot: "#C89B2A",
    tasks: filteredTasks.filter(
      (t) => t.estado === "EN_CURSO"
    ),
  },

  {
    id: "BLOQUEADO",
    label: "Bloqueado",
    accentBg: "#FEE2E2",
    accentText: "#991B1B",
    accentBorder: "#FECACA",
    dot: "#B91C1C",
    tasks: filteredTasks.filter(
      (t) => t.estado === "BLOQUEADO"
    ),
  },

  {
    id: "FINALIZADO",
    label: "Finalizado",
    accentBg: "#DCFCE7",
    accentText: "#15803D",
    accentBorder: "#BBF7D0",
    dot: "#16A34A",
    tasks: filteredTasks.filter(
      (t) => t.estado === "FINALIZADO"
    ),
  },
];
  return (
    <PmoShell>
      <PageHeader
        section="PMO · Tareas"
        title="Tablero de Tareas"
        description="Vista Kanban del estado de ejecución de todas las tareas del programa."
      />
      {selectedProjectId && (
        
  <div
    className="mx-8 mt-4 p-4"
    style={{
      background: "#FEF3C7",
      border: "1px solid #FDE68A",
    }}
  >
    <button
  onClick={() =>
    window.location.href =
      "/pmo/proyectos"
  }
  className="mb-2 text-sm"
>
  ← Volver a proyectos
</button>
    <div
      style={{
        fontWeight: 600,
      }}
    >
      Proyecto:
      {" "}
      {selectedProject?.nombre}
    </div>

    <div
      style={{
        fontSize: "12px",
        color: "#6B7280",
      }}
    >
      {
        filteredTasks.length
      } tareas
    </div>
  </div>
)}
      <div className="px-8 pt-4">

  <div className="grid gap-4 md:grid-cols-4">

    <div className="border p-4">
      <div className="text-xs text-gray-500">
        Total
      </div>
      <div className="text-2xl font-bold">
        {tasks.length}
      </div>
    </div>

    <div className="border p-4">
      <div className="text-xs text-gray-500">
        Pendientes
      </div>
      <div className="text-2xl font-bold">
        {
          tasks.filter(
            t => t.estado === "PENDIENTE"
          ).length
        }
      </div>
    </div>

    <div className="border p-4">
      <div className="text-xs text-gray-500">
        En Curso
      </div>
      <div className="text-2xl font-bold">
        {
          tasks.filter(
            t => t.estado === "EN_CURSO"
          ).length
        }
      </div>
    </div>

    <div className="border p-4">
      <div className="text-xs text-gray-500">
        Finalizadas
      </div>
      <div className="text-2xl font-bold">
        {
          tasks.filter(
            t => t.estado === "FINALIZADO"
          ).length
        }
      </div>
    </div>

  </div>

</div>
<div className="px-8 pt-4">
  <button
    onClick={() =>
      setShowModal(true)
    }
    className="px-4 py-2 text-sm font-medium"
    style={{
      background: "#C89B2A",
      color: "#FFFFFF",
    }}
  >
    
    + Nueva Tarea
  </button>
</div>
      <div className="px-8 py-6">

  {loading ? (
    <div>Cargando tareas...</div>
  ) : (

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

      {columns.map((col) => (

        <div
          key={col.id}
          className="flex flex-col gap-2"
        >

          <div
            className="flex items-center justify-between px-3 py-2.5"
            style={{
              background: col.accentBg,
              border: `1px solid ${col.accentBorder}`,
            }}
          >
            <div className="flex items-center gap-2">

              <span
                className="h-2 w-2"
                style={{
                  background: col.dot,
                  borderRadius: "50%",
                  display: "inline-block",
                }}
              />

              <span
                className="text-xs font-bold"
                style={{
                  color: col.accentText,
                }}
              >
                {col.label}
              </span>

            </div>

            <span
              className="px-1.5 py-0.5 text-[10px] font-semibold"
              style={{
                background: "#FFFFFF",
                color: "#6B7280",
                border: "1px solid #D6D3D1",
              }}
            >
              {col.tasks.length}
            </span>

          </div>

          {col.tasks.map((task) => (

            <div
  key={task.id}
  className="p-3.5"
  style={{
    background: "#FFFFFF",
    border:
      task.prioridad === "ALTA"
        ? "2px solid #DC2626"
        : task.prioridad === "MEDIA"
        ? "2px solid #D97706"
        : "2px solid #16A34A",
  }}
>

              <p
                className="text-xs font-semibold leading-snug"
                style={{
                  color: "#1F2937",
                }}
              >
                {task.titulo}
              </p>

          

              <div className="mt-2.5">

                <div className="flex items-center justify-between gap-2">

                  <span
                    className="text-[11px]"
                    style={{
                      color: "#9CA3AF",
                    }}
                  >
                    {task.descripcion || "Sin descripción"}
                    <div className="mt-2 text-xs text-gray-500">

  {task.fechaLimite && (
    <div>
      📅 {
        new Date(
          task.fechaLimite
        ).toLocaleDateString(
          "es-CO"
        )
      }
    </div>
    
  )}
  {task.responsable && (
  <div>
    👤 {task.responsable.nombre}
  </div>
)}

{task.proyecto && (
  <div>
    📁 {task.proyecto.nombre}
  </div>
)}

<div
  className="mt-2 text-xs"
  style={{
    color: "#9CA3AF",
  }}
>
  💬 {task.comentarios?.length || 0} comentarios
</div>
</div>
                    
 

                  </span>

                  <StatusBadge
  status={task.prioridad}
  dot={false}
/>

                </div>

               <div className="mt-3 flex gap-3">

  <button
    onClick={() =>
      handleEditTask(task)
    }
    className="text-xs"
  >
    ✏️ Editar
  </button>

  <button
    onClick={() =>
      handleDeleteTask(task.id)
    }
    className="text-xs text-red-600"
  >
    🗑️ Eliminar
  </button>

<button
  onClick={() =>
    openComments(task)
  }
  className="text-xs text-blue-600"
>
  💬 Comentarios
</button>

</div>

<div className="mt-2 flex gap-2 flex-wrap">

  {task.estado === "PENDIENTE" && (
    <button
      onClick={() =>
        changeStatus(
          task,
          "EN_CURSO"
        )
      }
      className="text-xs text-blue-600"
    >
      ▶ Iniciar
    </button>
  )}

  {task.estado === "EN_CURSO" && (
    <>
      <button
        onClick={() =>
          changeStatus(
            task,
            "FINALIZADO"
          )
        }
        className="text-xs text-green-600"
      >
        ✓ Finalizar
      </button>

      <button
        onClick={() =>
          changeStatus(
            task,
            "BLOQUEADO"
          )
        }
        className="text-xs text-red-600"
      >
        ⛔ Bloquear
      </button>
    </>
  )}

  {task.estado === "BLOQUEADO" && (
    <button
      onClick={() =>
        changeStatus(
          task,
          "EN_CURSO"
        )
      }
      className="text-xs text-orange-600"
    >
      ↺ Reanudar
    </button>
  )}

</div>
                </div>

              </div>

       

          ))}

        </div>

      ))}

    </div>

  )}

</div>
       {showModal && (

  <div
    className="fixed inset-0 z-50 flex items-center justify-center"
    style={{
      background: "rgba(0,0,0,0.4)",
    }}
  >

    <div
      className="w-full max-w-md p-6"
      style={{
        background: "#FFFFFF",
      }}
    >

      <h2 className="mb-4 text-lg font-semibold">
        {editingTaskId
  ? "Editar Tarea"
  : "Nueva Tarea"}
      </h2>

      <input
        placeholder="Título"
        value={titulo}
        onChange={(e) =>
          setTitulo(e.target.value)
        }
        className="mb-3 w-full border p-2"
      />

      <textarea
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) =>
          setDescripcion(
            e.target.value
          )
        }
        className="mb-4 w-full border p-2"
      />

<select
  value={prioridad}
  onChange={(e) =>
    setPrioridad(
      e.target.value
    )
  }
  className="mb-4 w-full border p-2"
>



  <option value="BAJA">
    Baja
  </option>

  <option value="MEDIA">
    Media
  </option>

  <option value="ALTA">
    Alta
  </option>
</select>

<select
  value={responsableId}
  onChange={(e) =>
    setResponsableId(
      e.target.value
    )
  }
  className="mb-4 w-full border p-2"
>

  <option value="">
    Sin responsable
  </option>

  {users.map((user) => (

    <option
      key={user.id}
      value={user.id}
    >
      {user.nombre}
    </option>

  ))}

</select>
{!selectedProjectId && (

<select
  value={projectId}
  onChange={(e) =>
    setProjectId(
      e.target.value
    )
  }
  className="mb-4 w-full border p-2"
>
  <option value="">
    Seleccione proyecto
  </option>

  {projects.map((project) => (
    <option
      key={project.id}
      value={project.id}
    >
      {project.nombre}
    </option>
  ))}
</select>

)}
<input
  type="date"
  value={fechaLimite}
  onChange={(e) =>
    setFechaLimite(
      e.target.value
    )
  }
  className="mb-4 w-full border p-2"
/>

      <div className="flex gap-2">

        <button
          onClick={handleCreateTask}
          className="px-4 py-2"
          style={{
            background: "#15803D",
            color: "#FFFFFF",
          }}
        >
          {editingTaskId
  ? "Actualizar"
  : "Guardar"}
        </button>

        <button
          onClick={() =>
            setShowModal(false)
          }
          className="px-4 py-2 border"
        >
          Cancelar
        </button>

      </div>

    </div>

  </div>

)}
{showCommentsModal &&
 selectedTask && (

  <div
    className="fixed inset-0 z-50 flex items-center justify-center"
    style={{
      background:
        "rgba(0,0,0,0.4)",
    }}
  >

    <div
      className="w-full max-w-lg p-6"
      style={{
        background:
          "#FFFFFF",
      }}
    >

      <h2 className="mb-4 text-lg font-semibold">
        Comentarios
      </h2>

      <div className="space-y-2 mb-4">

        {comments.map((comment) => (

  <div
    key={comment.id}
    className="mb-3 rounded border p-3"
  >

    <div className="flex justify-between mb-2">

      <span
        className="text-xs font-semibold"
      >
        {
          comment.usuario?.nombre ||
          comment.usuario?.email ||
          "Usuario"
        }
      </span>

      <span
        className="text-xs"
        style={{
          color: "#9CA3AF",
        }}
      >
        {new Date(
          comment.createdAt
        ).toLocaleString(
          "es-CO"
        )}
      </span>

    </div>

    <p className="text-sm">
      {comment.comentario}
    </p>

  </div>

))}

      </div>

      <textarea
        value={newComment}
        onChange={(e) =>
          setNewComment(
            e.target.value
          )
        }
        placeholder="Escriba un comentario..."
        className="w-full border p-2 mb-4"
      />

      <div className="flex gap-2">

        <button
  onClick={handleCreateComment}
  className="px-4 py-2"
  style={{
    background: "#15803D",
    color: "#FFFFFF",
  }}
>
  Guardar
</button>

        <button
          onClick={() =>
            setShowCommentsModal(
              false
            )
          }
          className="border px-4 py-2"
        >
          Cerrar
        </button>

      </div>

    </div>

  </div>

)}
    </PmoShell>
  );
}