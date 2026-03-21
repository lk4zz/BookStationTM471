/*
  Warnings:

  - You are about to drop the column `veiws` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `chapters` table. All the data in the column will be lost.
  - You are about to alter the column `isLocked` on the `chapters` table. The data in that column could be lost. The data in that column will be cast from `Int` to `TinyInt`.
  - Added the required column `views` to the `Books` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `books` DROP COLUMN `veiws`,
    ADD COLUMN `views` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `chapters` DROP COLUMN `userId`,
    MODIFY `isLocked` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `pages` MODIFY `text` LONGTEXT NOT NULL;
