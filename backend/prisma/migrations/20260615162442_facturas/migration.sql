-- CreateTable
CREATE TABLE "facturas" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "pedido_id" UUID NOT NULL,
    "numero_factura" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "estado_pago" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "fecha_emision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_vencimiento" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "facturas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "facturas_numero_factura_key" ON "facturas"("numero_factura");

-- AddForeignKey
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
