/*
  Warnings:

  - You are about to drop the column `text` on the `comments` table. All the data in the column will be lost.
  - Added the required column `comment` to the `Comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `comments` DROP COLUMN `text`,
    ADD COLUMN `comment` VARCHAR(191) NOT NULL;
