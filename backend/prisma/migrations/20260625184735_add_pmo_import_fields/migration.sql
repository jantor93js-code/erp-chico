-- CreateEnum
CREATE TYPE "TaskTipo" AS ENUM ('PROCEDIMIENTO', 'INSTRUCTIVO', 'MANUAL', 'FORMATO', 'MATRIZ', 'ACTIVIDAD', 'OTRO');

-- AlterTable
ALTER TABLE "pmo_projects" ADD COLUMN     "area" TEXT,
ADD COLUMN     "codigo" TEXT,
ADD COLUMN     "estadoDocumental" TEXT,
ADD COLUMN     "fuente" TEXT DEFAULT 'MANUAL',
ADD COLUMN     "liderId" TEXT,
ADD COLUMN     "liderNombreImportado" TEXT,
ADD COLUMN     "objetivo" TEXT,
ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "origenImportacion" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "pmo_tasks" ADD COLUMN     "area" TEXT,
ADD COLUMN     "codigoOrigen" TEXT,
ADD COLUMN     "fuente" TEXT DEFAULT 'MANUAL',
ADD COLUMN     "origenImportacion" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tipo" "TaskTipo" NOT NULL DEFAULT 'ACTIVIDAD';
