/*
  Warnings:

  - You are about to drop the column `rating` on the `books` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,name]` on the table `Books` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bookId,chapterNum]` on the table `Chapters` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[chapterId,pageNum]` on the table `Pages` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Books_name_key` ON `books`;

-- AlterTable
ALTER TABLE `books` DROP COLUMN `rating`,
    ADD COLUMN `ratingAverage` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `ratingCount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `views` BIGINT NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `ChapterUnlocks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `chapterId` INTEGER NOT NULL,

    UNIQUE INDEX `ChapterUnlocks_userId_chapterId_key`(`userId`, `chapterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Books_userId_name_key` ON `Books`(`userId`, `name`);

-- CreateIndex
CREATE UNIQUE INDEX `Chapters_bookId_chapterNum_key` ON `Chapters`(`bookId`, `chapterNum`);

-- CreateIndex
CREATE UNIQUE INDEX `Pages_chapterId_pageNum_key` ON `Pages`(`chapterId`, `pageNum`);

-- AddForeignKey
ALTER TABLE `ChapterUnlocks` ADD CONSTRAINT `ChapterUnlocks_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChapterUnlocks` ADD CONSTRAINT `ChapterUnlocks_chapterId_fkey` FOREIGN KEY (`chapterId`) REFERENCES `Chapters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
