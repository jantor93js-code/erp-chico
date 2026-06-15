-- CreateTable
CREATE TABLE "servicios" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "pedido_id" UUID NOT NULL,
    "vehiculo_id" UUID,
    "origen" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PROGRAMADO',
    "fecha_programada" TIMESTAMP(3) NOT NULL,
    "fecha_entrega_real" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "servicios_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "servicios" ADD CONSTRAINT "servicios_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicios" ADD CONSTRAINT "servicios_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicios" ADD CONSTRAINT "servicios_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
