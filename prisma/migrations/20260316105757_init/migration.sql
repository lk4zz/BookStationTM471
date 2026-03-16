-- DropForeignKey
ALTER TABLE `books` DROP FOREIGN KEY `Books_userId_fkey`;

-- DropForeignKey
ALTER TABLE `chapters` DROP FOREIGN KEY `Chapters_bookId_fkey`;

-- DropForeignKey
ALTER TABLE `chapterunlocks` DROP FOREIGN KEY `ChapterUnlocks_chapterId_fkey`;

-- DropForeignKey
ALTER TABLE `chapterunlocks` DROP FOREIGN KEY `ChapterUnlocks_userId_fkey`;

-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `Comments_bookId_fkey`;

-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `Comments_userId_fkey`;

-- DropForeignKey
ALTER TABLE `followers` DROP FOREIGN KEY `Followers_followerId_fkey`;

-- DropForeignKey
ALTER TABLE `followers` DROP FOREIGN KEY `Followers_followingId_fkey`;

-- DropForeignKey
ALTER TABLE `library` DROP FOREIGN KEY `Library_userId_fkey`;

-- DropForeignKey
ALTER TABLE `library_books` DROP FOREIGN KEY `library_books_bookId_fkey`;

-- DropForeignKey
ALTER TABLE `library_books` DROP FOREIGN KEY `library_books_libraryId_fkey`;

-- DropForeignKey
ALTER TABLE `pages` DROP FOREIGN KEY `Pages_chapterId_fkey`;

-- DropIndex
DROP INDEX `ChapterUnlocks_chapterId_fkey` ON `chapterunlocks`;

-- DropIndex
DROP INDEX `Comments_bookId_fkey` ON `comments`;

-- DropIndex
DROP INDEX `Comments_userId_fkey` ON `comments`;

-- DropIndex
DROP INDEX `Followers_followingId_fkey` ON `followers`;

-- DropIndex
DROP INDEX `library_books_libraryId_fkey` ON `library_books`;

-- AddForeignKey
ALTER TABLE `Books` ADD CONSTRAINT `Books_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChapterUnlocks` ADD CONSTRAINT `ChapterUnlocks_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChapterUnlocks` ADD CONSTRAINT `ChapterUnlocks_chapterId_fkey` FOREIGN KEY (`chapterId`) REFERENCES `Chapters`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chapters` ADD CONSTRAINT `Chapters_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Books`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Books`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Followers` ADD CONSTRAINT `Followers_followerId_fkey` FOREIGN KEY (`followerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Followers` ADD CONSTRAINT `Followers_followingId_fkey` FOREIGN KEY (`followingId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Library` ADD CONSTRAINT `Library_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `library_books` ADD CONSTRAINT `library_books_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Books`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `library_books` ADD CONSTRAINT `library_books_libraryId_fkey` FOREIGN KEY (`libraryId`) REFERENCES `Library`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pages` ADD CONSTRAINT `Pages_chapterId_fkey` FOREIGN KEY (`chapterId`) REFERENCES `Chapters`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
