/*
  Warnings:

  - Added the required column `requestId` to the `FarmingUpdates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FarmingUpdates" ADD COLUMN     "requestId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "FarmingUpdates" ADD CONSTRAINT "FarmingUpdates_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "FarmingRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
