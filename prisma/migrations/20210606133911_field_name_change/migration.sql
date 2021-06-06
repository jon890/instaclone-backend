/*
  Warnings:

  - You are about to drop the column `catpion` on the `Photo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "catpion",
ADD COLUMN     "caption" TEXT;
