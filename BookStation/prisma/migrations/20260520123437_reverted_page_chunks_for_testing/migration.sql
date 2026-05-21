/*
  Warnings:

  - Added the required column `pageNumber` to the `PageChunk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pagechunk` ADD COLUMN `pageNumber` INTEGER NOT NULL;
