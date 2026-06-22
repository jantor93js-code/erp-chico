-- CreateTable pmo_tasks
CREATE TABLE "pmo_tasks" (
    "id" UUID NOT NULL,
    "codigo" TEXT NOT NULL,
    "tenant_id" UUID NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "prioridad" TEXT NOT NULL DEFAULT 'MEDIA',
    "fecha_limite" TIMESTAMP(3),
    "responsable_id" UUID,
    "creador_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pmo_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable pmo_task_comments
CREATE TABLE "pmo_task_comments" (
    "id" UUID NOT NULL,
    "task_id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "comentario" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pmo_task_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pmo_tasks_tenant_codigo_key" ON "pmo_tasks"("tenant_id","codigo");

-- AddForeignKey
ALTER TABLE "pmo_tasks" ADD CONSTRAINT "pmo_tasks_responsable_id_fkey" FOREIGN KEY ("responsable_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pmo_tasks" ADD CONSTRAINT "pmo_tasks_creador_id_fkey" FOREIGN KEY ("creador_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey tenant
ALTER TABLE "pmo_tasks" ADD CONSTRAINT "pmo_tasks_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pmo_task_comments" ADD CONSTRAINT "pmo_task_comments_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "pmo_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pmo_task_comments" ADD CONSTRAINT "pmo_task_comments_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
