-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "area_id_ref" UUID,
ADD COLUMN     "estado_documental_id" UUID,
ADD COLUMN     "process_id" UUID,
ADD COLUMN     "tipo_id" UUID;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_area_id_ref_fkey" FOREIGN KEY ("area_id_ref") REFERENCES "areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_process_id_fkey" FOREIGN KEY ("process_id") REFERENCES "processes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_tipo_id_fkey" FOREIGN KEY ("tipo_id") REFERENCES "document_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_estado_documental_id_fkey" FOREIGN KEY ("estado_documental_id") REFERENCES "document_statuses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
