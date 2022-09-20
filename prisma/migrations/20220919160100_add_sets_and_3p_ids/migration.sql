/*
  Warnings:

  - You are about to drop the column `condition` on the `collectibles` table. All the data in the column will be lost.
  - You are about to drop the column `featured` on the `collectibles` table. All the data in the column will be lost.
  - You are about to drop the column `grade` on the `collectibles` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `collectibles` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `collectibles` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `collectibles` table. All the data in the column will be lost.
  - You are about to drop the column `wishlist` on the `collectibles` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "collectibles" DROP CONSTRAINT "collectibles_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_collectibleId_fkey";

-- DropForeignKey
ALTER TABLE "tags" DROP CONSTRAINT "tags_collectibleId_fkey";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "public" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "collectibles" DROP COLUMN "condition",
DROP COLUMN "featured",
DROP COLUMN "grade",
DROP COLUMN "ownerId",
DROP COLUMN "quantity",
DROP COLUMN "updatedAt",
DROP COLUMN "wishlist",
ADD COLUMN     "setId" INTEGER;

-- AlterTable
ALTER TABLE "tags" ADD COLUMN     "collectibleUserId" INTEGER,
ALTER COLUMN "collectibleId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "third_party_collectible_identifiers" (
    "id" SERIAL NOT NULL,
    "collectibleId" INTEGER NOT NULL,
    "thirdPartyId" TEXT NOT NULL,
    "thirdPartyName" TEXT NOT NULL,

    CONSTRAINT "third_party_collectible_identifiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collectible_user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "grade" TEXT,
    "description" TEXT,
    "condition" TEXT,
    "wishlist" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "collectibleId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "setId" INTEGER,

    CONSTRAINT "collectible_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sets" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "set_user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "setId" INTEGER NOT NULL,

    CONSTRAINT "set_user_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "third_party_collectible_identifiers" ADD CONSTRAINT "third_party_collectible_identifiers_collectibleId_fkey" FOREIGN KEY ("collectibleId") REFERENCES "collectibles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collectibles" ADD CONSTRAINT "collectibles_setId_fkey" FOREIGN KEY ("setId") REFERENCES "sets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collectible_user" ADD CONSTRAINT "collectible_user_collectibleId_fkey" FOREIGN KEY ("collectibleId") REFERENCES "collectibles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collectible_user" ADD CONSTRAINT "collectible_user_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collectible_user" ADD CONSTRAINT "collectible_user_setId_fkey" FOREIGN KEY ("setId") REFERENCES "set_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_collectibleId_fkey" FOREIGN KEY ("collectibleId") REFERENCES "collectibles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_collectibleUserId_fkey" FOREIGN KEY ("collectibleUserId") REFERENCES "collectible_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_collectibleId_fkey" FOREIGN KEY ("collectibleId") REFERENCES "collectible_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "set_user" ADD CONSTRAINT "set_user_setId_fkey" FOREIGN KEY ("setId") REFERENCES "sets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
