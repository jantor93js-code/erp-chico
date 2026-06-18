/*
  Warnings:

  - Added the required column `ejecutivoId` to the `Cotizacion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cotizacion" ADD COLUMN     "ejecutivoId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Cotizacion" ADD CONSTRAINT "Cotizacion_ejecutivoId_fkey" FOREIGN KEY ("ejecutivoId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
