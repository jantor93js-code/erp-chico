-- CreateTable
CREATE TABLE "detalle_servicios" (
    "id" UUID NOT NULL,
    "pedido_id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "valor_unitario" DOUBLE PRECISION NOT NULL,
    "valor_total" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "detalle_servicios_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "detalle_servicios" ADD CONSTRAINT "detalle_servicios_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
