/*
  Warnings:

  - You are about to drop the column `setId` on the `collectibles` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "collectibles" DROP CONSTRAINT "collectibles_setId_fkey";

-- AlterTable
ALTER TABLE "collectibles" DROP COLUMN "setId";

-- CreateTable
CREATE TABLE "collectible_set" (
    "id" SERIAL NOT NULL,
    "collectibleId" INTEGER NOT NULL,
    "setId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "collectible_set_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "collectible_set" ADD CONSTRAINT "collectible_set_collectibleId_fkey" FOREIGN KEY ("collectibleId") REFERENCES "collectibles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collectible_set" ADD CONSTRAINT "collectible_set_setId_fkey" FOREIGN KEY ("setId") REFERENCES "sets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
