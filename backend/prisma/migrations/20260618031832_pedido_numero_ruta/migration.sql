/*
  Warnings:

  - A unique constraint covering the columns `[numero_pedido]` on the table `pedidos` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "evidencias_servicio" ADD COLUMN     "mime_type" TEXT,
ADD COLUMN     "nombre_archivo" TEXT,
ADD COLUMN     "tamano_archivo" INTEGER;

-- AlterTable
ALTER TABLE "pedidos" ADD COLUMN     "destino" TEXT,
ADD COLUMN     "numero_pedido" TEXT,
ADD COLUMN     "origen" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_numero_pedido_key" ON "pedidos"("numero_pedido");
