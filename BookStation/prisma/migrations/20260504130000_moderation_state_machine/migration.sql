-- Migrate existing OPEN -> AWAITING_AUTHOR before altering the enum
UPDATE `ModerationLog` SET `status` = 'AWAITING_AUTHOR' WHERE `status` = 'OPEN';

-- AlterTable: replace enum values and add history column
ALTER TABLE `ModerationLog`
  MODIFY COLUMN `status` ENUM('AWAITING_AUTHOR', 'UNDER_REVIEW', 'CLOSED') NOT NULL DEFAULT 'AWAITING_AUTHOR',
  ADD COLUMN `history` LONGTEXT NULL;
