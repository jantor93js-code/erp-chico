-- CreateEnum
CREATE TYPE "DocumentEstado" AS ENUM ('VIGENTE', 'EN_REVISION', 'PENDIENTE_APROBACION', 'OBSOLETO', 'ARCHIVADO');

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "estadoDocumental" "DocumentEstado" NOT NULL DEFAULT 'VIGENTE',
ADD COLUMN     "responsable_id" UUID;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_responsable_id_fkey" FOREIGN KEY ("responsable_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
