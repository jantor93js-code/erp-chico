/*
  Warnings:

  - You are about to drop the column `contacto` on the `pmo_clients` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `pmo_clients` table. All the data in the column will be lost.
  - You are about to drop the column `nit` on the `pmo_clients` table. All the data in the column will be lost.
  - You are about to drop the column `cliente_id` on the `pmo_programs` table. All the data in the column will be lost.
  - You are about to drop the column `pmo_client_id` on the `pmo_projects` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `scope` on the `users` table. All the data in the column will be lost.
  - Added the required column `clientId` to the `pmo_programs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "pmo_programs" DROP CONSTRAINT "pmo_programs_cliente_id_fkey";

-- DropForeignKey
ALTER TABLE "pmo_projects" DROP CONSTRAINT "pmo_projects_pmo_client_id_fkey";

-- DropForeignKey
ALTER TABLE "pmo_task_comments" DROP CONSTRAINT "pmo_task_comments_task_id_fkey";

-- AlterTable
ALTER TABLE "pmo_clients" DROP COLUMN "contacto",
DROP COLUMN "email",
DROP COLUMN "nit",
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "razonSocial" TEXT;

-- AlterTable
ALTER TABLE "pmo_initiatives" ADD COLUMN     "responsableId" UUID;

-- AlterTable
ALTER TABLE "pmo_programs" DROP COLUMN "cliente_id",
ADD COLUMN     "avance" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "clientId" UUID NOT NULL,
ADD COLUMN     "fechaFin" TIMESTAMP(3),
ADD COLUMN     "fechaInicio" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "pmo_projects" DROP COLUMN "pmo_client_id";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "nombre",
DROP COLUMN "scope";

-- DropEnum
DROP TYPE "UserScope";

-- AddForeignKey
ALTER TABLE "pmo_task_comments" ADD CONSTRAINT "pmo_task_comments_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "pmo_tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pmo_programs" ADD CONSTRAINT "pmo_programs_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "pmo_clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pmo_initiatives" ADD CONSTRAINT "pmo_initiatives_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
