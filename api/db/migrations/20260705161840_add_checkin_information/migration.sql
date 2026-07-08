/*
  Warnings:

  - The values [quartier] on the enum `UserRoleEnum` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `user_roles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "BandColourEnum" AS ENUM ('red', 'orange', 'green', 'blue', 'white');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRoleEnum_new" AS ENUM ('admin', 'checkin', 'quartier_boys', 'quartier_girls', 'none');
ALTER TABLE "user_roles" ALTER COLUMN "role" TYPE "UserRoleEnum_new" USING ("role"::text::"UserRoleEnum_new");
ALTER TYPE "UserRoleEnum" RENAME TO "UserRoleEnum_old";
ALTER TYPE "UserRoleEnum_new" RENAME TO "UserRoleEnum";
DROP TYPE "UserRoleEnum_old";
COMMIT;

-- AlterTable
ALTER TABLE "participants" ADD COLUMN     "bandColour" "BandColourEnum",
ADD COLUMN     "checkinConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "price" DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_userId_key" ON "user_roles"("userId");
