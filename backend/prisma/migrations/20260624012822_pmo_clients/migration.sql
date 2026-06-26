/*
  Warnings:

  - You are about to drop the column `logoUrl` on the `pmo_clients` table. All the data in the column will be lost.
  - You are about to drop the column `razonSocial` on the `pmo_clients` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `pmo_programs` table. All the data in the column will be lost.
  - You are about to drop the column `cliente_id` on the `pmo_projects` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "pmo_programs" DROP CONSTRAINT "pmo_programs_clientId_fkey";

-- DropForeignKey
ALTER TABLE "pmo_projects" DROP CONSTRAINT "pmo_projects_cliente_id_fkey";

-- AlterTable
ALTER TABLE "pmo_clients" DROP COLUMN "logoUrl",
DROP COLUMN "razonSocial",
ADD COLUMN     "contacto" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "nit" TEXT;

-- AlterTable
ALTER TABLE "pmo_programs" DROP COLUMN "clientId",
ADD COLUMN     "cliente_id" UUID;

-- AlterTable
ALTER TABLE "pmo_projects" DROP COLUMN "cliente_id",
ADD COLUMN     "pmo_client_id" UUID;

-- AddForeignKey
ALTER TABLE "pmo_programs" ADD CONSTRAINT "pmo_programs_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "pmo_clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pmo_projects" ADD CONSTRAINT "pmo_projects_pmo_client_id_fkey" FOREIGN KEY ("pmo_client_id") REFERENCES "pmo_clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
