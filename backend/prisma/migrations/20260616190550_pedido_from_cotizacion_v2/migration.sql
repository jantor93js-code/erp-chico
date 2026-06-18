-- AlterTable
ALTER TABLE "pedidos" ADD COLUMN     "cotizacion_id" UUID,
ADD COLUMN     "origen_pedido" TEXT;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_cotizacion_id_fkey" FOREIGN KEY ("cotizacion_id") REFERENCES "Cotizacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
