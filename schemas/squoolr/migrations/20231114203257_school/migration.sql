/*
  Warnings:

  - You are about to drop the column `is_deleted` on the `schoolaudit` table. All the data in the column will be lost.
  - You are about to drop the column `is_validated` on the `schoolaudit` table. All the data in the column will be lost.
  - You are about to drop the column `paid_amount` on the `schooldemandaudit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `school` ADD COLUMN `deleted_at` DATETIME(0) NULL,
    ADD COLUMN `deleted_by` VARCHAR(36) NULL,
    ADD COLUMN `validated_at` DATETIME(0) NULL,
    ADD COLUMN `validated_by` VARCHAR(36) NULL;

-- AlterTable
ALTER TABLE `schoolaudit` DROP COLUMN `is_deleted`,
    DROP COLUMN `is_validated`;

-- AlterTable
ALTER TABLE `schooldemandaudit` DROP COLUMN `paid_amount`;

-- AddForeignKey
ALTER TABLE `School` ADD CONSTRAINT `School_validated_by_fkey` FOREIGN KEY (`validated_by`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `School` ADD CONSTRAINT `School_deleted_by_fkey` FOREIGN KEY (`deleted_by`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;
