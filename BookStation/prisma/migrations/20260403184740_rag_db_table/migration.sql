-- CreateTable
CREATE TABLE `PageChunk` (
    `id` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `embedding` JSON NOT NULL,
    `pageNumber` INTEGER NOT NULL,
    `pageId` INTEGER NOT NULL,
    `chapterId` INTEGER NOT NULL,
    `bookId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `PageChunk_chapterId_idx`(`chapterId`),
    INDEX `PageChunk_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PageChunk` ADD CONSTRAINT `PageChunk_pageId_fkey` FOREIGN KEY (`pageId`) REFERENCES `Pages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PageChunk` ADD CONSTRAINT `PageChunk_chapterId_fkey` FOREIGN KEY (`chapterId`) REFERENCES `Chapters`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PageChunk` ADD CONSTRAINT `PageChunk_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Books`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PageChunk` ADD CONSTRAINT `PageChunk_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
