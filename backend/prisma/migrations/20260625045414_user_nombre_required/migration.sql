/*
  Warnings:

  - Made the column `nombre` on table `conductores` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nombre` on table `detalle_servicios` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nombre` on table `pmo_clients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nombre` on table `tenants` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nombre` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "conductores" ALTER COLUMN "nombre" SET NOT NULL;

-- AlterTable
ALTER TABLE "detalle_servicios" ALTER COLUMN "nombre" SET NOT NULL;

-- AlterTable
ALTER TABLE "pmo_clients" ALTER COLUMN "nombre" SET NOT NULL;

-- AlterTable
ALTER TABLE "tenants" ALTER COLUMN "nombre" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "nombre" SET NOT NULL;
