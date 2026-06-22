/*
  Warnings:

  - The `estado` column on the `pmo_tasks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `prioridad` column on the `pmo_tasks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[codigo]` on the table `pmo_tasks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "TaskEstado" AS ENUM ('PENDIENTE', 'EN_CURSO', 'BLOQUEADO', 'FINALIZADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TaskPrioridad" AS ENUM ('BAJA', 'MEDIA', 'ALTA', 'CRITICA');

-- DropForeignKey
ALTER TABLE "pmo_task_comments" DROP CONSTRAINT "pmo_task_comments_task_id_fkey";

-- DropForeignKey
ALTER TABLE "pmo_tasks" DROP CONSTRAINT "pmo_tasks_creador_id_fkey";

-- DropIndex
DROP INDEX "pmo_tasks_tenant_codigo_key";

-- AlterTable
ALTER TABLE "pmo_tasks" ADD COLUMN     "project_id" UUID,
DROP COLUMN "estado",
ADD COLUMN     "estado" "TaskEstado" NOT NULL DEFAULT 'PENDIENTE',
DROP COLUMN "prioridad",
ADD COLUMN     "prioridad" "TaskPrioridad" NOT NULL DEFAULT 'MEDIA';

-- CreateTable
CREATE TABLE "pmo_clients" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "razonSocial" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pmo_clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pmo_programs" (
    "id" UUID NOT NULL,
    "clientId" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pmo_programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pmo_initiatives" (
    "id" UUID NOT NULL,
    "programId" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
    "avance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pmo_initiatives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pmo_projects" (
    "id" UUID NOT NULL,
    "initiativeId" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
    "avance" INTEGER NOT NULL DEFAULT 0,
    "fechaInicio" TIMESTAMP(3),
    "fechaFin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pmo_projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pmo_tasks_codigo_key" ON "pmo_tasks"("codigo");

-- AddForeignKey
ALTER TABLE "pmo_tasks" ADD CONSTRAINT "pmo_tasks_creador_id_fkey" FOREIGN KEY ("creador_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pmo_tasks" ADD CONSTRAINT "pmo_tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "pmo_projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pmo_task_comments" ADD CONSTRAINT "pmo_task_comments_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "pmo_tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pmo_programs" ADD CONSTRAINT "pmo_programs_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "pmo_clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pmo_initiatives" ADD CONSTRAINT "pmo_initiatives_programId_fkey" FOREIGN KEY ("programId") REFERENCES "pmo_programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pmo_projects" ADD CONSTRAINT "pmo_projects_initiativeId_fkey" FOREIGN KEY ("initiativeId") REFERENCES "pmo_initiatives"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
