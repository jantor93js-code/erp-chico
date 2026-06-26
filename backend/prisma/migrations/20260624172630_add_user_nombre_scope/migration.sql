-- CreateEnum
CREATE TYPE "UserScope" AS ENUM ('PMO', 'ERP_CHICO', 'PLATFORM');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "nombre" TEXT,
ADD COLUMN     "scope" "UserScope";
