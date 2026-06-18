-- CreateTable
CREATE TABLE "evidencias_servicio" (
    "id" UUID NOT NULL,
    "pedido_id" UUID NOT NULL,
    "tipo" TEXT NOT NULL,
    "url_archivo" TEXT,
    "observacion" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evidencias_servicio_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "evidencias_servicio" ADD CONSTRAINT "evidencias_servicio_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
