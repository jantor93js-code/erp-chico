/*
  Warnings:

  - You are about to drop the column `pedido_id` on the `evidencias_servicio` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_entrega_real` on the `servicios` table. All the data in the column will be lost.
  - Added the required column `servicio_id` to the `evidencias_servicio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo_servicio` to the `servicios` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "evidencias_servicio" DROP CONSTRAINT "evidencias_servicio_pedido_id_fkey";

-- AlterTable
ALTER TABLE "evidencias_servicio" DROP COLUMN "pedido_id",
ADD COLUMN     "pedidoId" UUID,
ADD COLUMN     "servicio_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "servicios" DROP COLUMN "fecha_entrega_real",
ADD COLUMN     "fecha_fin" TIMESTAMP(3),
ADD COLUMN     "fecha_inicio" TIMESTAMP(3),
ADD COLUMN     "tipo_servicio" TEXT NOT NULL,
ALTER COLUMN "origen" DROP NOT NULL,
ALTER COLUMN "destino" DROP NOT NULL,
ALTER COLUMN "estado" SET DEFAULT 'PENDIENTE',
ALTER COLUMN "fecha_programada" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "evidencias_servicio" ADD CONSTRAINT "evidencias_servicio_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidencias_servicio" ADD CONSTRAINT "evidencias_servicio_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
