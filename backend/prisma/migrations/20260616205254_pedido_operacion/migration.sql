-- AlterTable
ALTER TABLE "pedidos" ADD COLUMN     "conductor_id" UUID,
ADD COLUMN     "fecha_programada" TIMESTAMP(3),
ADD COLUMN     "linea_negocio" TEXT NOT NULL DEFAULT 'MUDANZA',
ADD COLUMN     "vehiculo_id" UUID;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_conductor_id_fkey" FOREIGN KEY ("conductor_id") REFERENCES "conductores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
