-- DropForeignKey
ALTER TABLE `book_genres` DROP FOREIGN KEY `book_genres_bookId_fkey`;

-- DropForeignKey
ALTER TABLE `notifications` DROP FOREIGN KEY `Notifications_userId_fkey`;

-- DropForeignKey
ALTER TABLE `reports` DROP FOREIGN KEY `Reports_bookId_fkey`;

-- DropForeignKey
ALTER TABLE `reports` DROP FOREIGN KEY `Reports_userId_fkey`;

-- DropIndex
DROP INDEX `book_genres_bookId_fkey` ON `book_genres`;

-- DropIndex
DROP INDEX `Notifications_userId_fkey` ON `notifications`;

-- DropIndex
DROP INDEX `Reports_bookId_fkey` ON `reports`;

-- AddForeignKey
ALTER TABLE `book_genres` ADD CONSTRAINT `book_genres_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Books`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notifications` ADD CONSTRAINT `Notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reports` ADD CONSTRAINT `Reports_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reports` ADD CONSTRAINT `Reports_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Books`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
