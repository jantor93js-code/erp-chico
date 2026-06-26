-- AlterTable
ALTER TABLE "pmo_projects" ADD COLUMN     "cliente_id" UUID;

-- AddForeignKey
ALTER TABLE "pmo_projects" ADD CONSTRAINT "pmo_projects_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
