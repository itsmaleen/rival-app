/*
  Warnings:

  - You are about to drop the column `setId` on the `collectible_user` table. All the data in the column will be lost.
  - Added the required column `userId` to the `set_user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "collectible_user" DROP CONSTRAINT "collectible_user_setId_fkey";

-- AlterTable
ALTER TABLE "collectible_user" DROP COLUMN "setId";

-- AlterTable
ALTER TABLE "set_user" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "set_user" ADD CONSTRAINT "set_user_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
