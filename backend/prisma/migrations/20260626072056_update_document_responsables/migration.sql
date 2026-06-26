/*
  Warnings:

  - You are about to drop the column `responsable` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `responsableCargo` on the `documents` table. All the data in the column will be lost.
  - You are about to drop the column `responsable_id` on the `documents` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_responsable_id_fkey";

-- AlterTable
ALTER TABLE "documents" DROP COLUMN "responsable",
DROP COLUMN "responsableCargo",
DROP COLUMN "responsable_id",
ADD COLUMN     "responsable_actualizacion" TEXT,
ADD COLUMN     "responsable_revision" TEXT;
