/*
  Warnings:

  - A unique constraint covering the columns `[followerId,followingId]` on the table `Followers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Followers_followerId_followingId_key` ON `Followers`(`followerId`, `followingId`);
