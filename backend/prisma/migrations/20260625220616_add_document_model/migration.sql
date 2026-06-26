-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('MANUAL', 'PROCEDIMIENTO', 'FORMATO', 'POLITICA', 'CONTRATO', 'MATRIZ', 'ACTIVIDAD', 'OTRO');

-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "tipo" "DocumentType" NOT NULL DEFAULT 'OTRO',
    "proceso" TEXT,
    "area" TEXT,
    "version" TEXT,
    "responsable" TEXT,
    "responsableCargo" TEXT,
    "fechaCreacion" TIMESTAMP(3),
    "fechaRevision" TIMESTAMP(3),
    "observaciones" TEXT,
    "enlace" TEXT,
    "fuente" TEXT DEFAULT 'MANUAL',
    "origenImportacion" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "cliente_id" UUID,
    "program_id" UUID,
    "initiative_id" UUID,
    "project_id" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "documents_codigo_key" ON "documents"("codigo");

-- CreateIndex
CREATE INDEX "documents_cliente_id_idx" ON "documents"("cliente_id");

-- CreateIndex
CREATE INDEX "documents_program_id_idx" ON "documents"("program_id");

-- CreateIndex
CREATE INDEX "documents_initiative_id_idx" ON "documents"("initiative_id");

-- CreateIndex
CREATE INDEX "documents_project_id_idx" ON "documents"("project_id");

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "pmo_clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "pmo_programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_initiative_id_fkey" FOREIGN KEY ("initiative_id") REFERENCES "pmo_initiatives"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "pmo_projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
