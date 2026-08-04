/*
  Warnings:

  - Added the required column `landAddress` to the `FarmingRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `landSize` to the `FarmingRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preferredLanguage` to the `FarmingRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FarmingRequest" ADD COLUMN     "landAddress" TEXT NOT NULL,
ADD COLUMN     "landSize" TEXT NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "preferredLanguage" TEXT NOT NULL;
