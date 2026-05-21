-- AlterTable
ALTER TABLE `User` ADD COLUMN `isBanned` BOOLEAN NOT NULL DEFAULT false;

-- Insert SUPER_ADMIN role (idempotent for re-runs)
INSERT INTO `user_role` (`id`, `name`, `createdAt`, `updatedAt`)
VALUES (4, 'SUPER_ADMIN', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
ON DUPLICATE KEY UPDATE `name` = 'SUPER_ADMIN';
