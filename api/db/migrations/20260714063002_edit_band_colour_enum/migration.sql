/*
  Warnings:

  - The values [dark_green_ue16] on the enum `BandColourEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BandColourEnum_new" AS ENUM ('red_mitarbeiter', 'white_team', 'yellow_tagesgaeste', 'blue_ue18', 'darkgreen_ue16', 'lime_ue14');
ALTER TABLE "participants" ALTER COLUMN "bandColour" TYPE "BandColourEnum_new" USING ("bandColour"::text::"BandColourEnum_new");
ALTER TYPE "BandColourEnum" RENAME TO "BandColourEnum_old";
ALTER TYPE "BandColourEnum_new" RENAME TO "BandColourEnum";
DROP TYPE "BandColourEnum_old";
COMMIT;
