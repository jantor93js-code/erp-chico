-- CreateTable
CREATE TABLE "gastos_operativos" (
    "id" UUID NOT NULL,
    "servicio_id" UUID NOT NULL,
    "tipo" TEXT NOT NULL,
    "descripcion" TEXT,
    "valor" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gastos_operativos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "gastos_operativos" ADD CONSTRAINT "gastos_operativos_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
