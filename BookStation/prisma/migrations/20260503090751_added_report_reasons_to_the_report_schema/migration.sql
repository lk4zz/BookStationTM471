/*
  Warnings:

  - Added the required column `reason` to the `Reports` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reports` ADD COLUMN `comment` TEXT NULL,
    ADD COLUMN `reason` ENUM('SPAM', 'OFFENSIVE', 'COPYRIGHT', 'OTHER') NOT NULL;
