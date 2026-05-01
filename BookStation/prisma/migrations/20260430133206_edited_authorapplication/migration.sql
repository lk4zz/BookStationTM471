/*
  Warnings:

  - You are about to drop the column `bio` on the `authorapplication` table. All the data in the column will be lost.
  - Added the required column `penName` to the `AuthorApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `writingIntent` to the `AuthorApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `authorapplication` DROP COLUMN `bio`,
    ADD COLUMN `agreedToPolicy` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `penName` VARCHAR(191) NOT NULL,
    ADD COLUMN `writingIntent` TEXT NOT NULL,
    MODIFY `documentUrl` VARCHAR(191) NULL;
