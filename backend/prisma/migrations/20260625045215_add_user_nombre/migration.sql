-- AlterTable
ALTER TABLE "conductores" ALTER COLUMN "nombre" DROP NOT NULL;

-- AlterTable
ALTER TABLE "detalle_servicios" ALTER COLUMN "nombre" DROP NOT NULL;

-- AlterTable
ALTER TABLE "pmo_clients" ADD COLUMN     "contacto" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "nit" TEXT,
ALTER COLUMN "nombre" DROP NOT NULL;

-- AlterTable
ALTER TABLE "tenants" ALTER COLUMN "nombre" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "nombre" TEXT;

-- CreateIndex
CREATE INDEX "pmo_initiatives_programId_idx" ON "pmo_initiatives"("programId");

-- CreateIndex
CREATE INDEX "pmo_initiatives_responsableId_idx" ON "pmo_initiatives"("responsableId");

-- CreateIndex
CREATE INDEX "pmo_programs_clientId_idx" ON "pmo_programs"("clientId");

-- CreateIndex
CREATE INDEX "pmo_projects_initiativeId_idx" ON "pmo_projects"("initiativeId");
