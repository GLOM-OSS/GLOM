/*
  Warnings:

  - You are about to drop the column `referral_code` on the `schooldemand` table. All the data in the column will be lost.
  - You are about to drop the column `referral_code` on the `schooldemandaudit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `inquiry` ADD COLUMN `name` VARCHAR(90) NULL,
    ADD COLUMN `phone` VARCHAR(45) NULL;

-- AlterTable
ALTER TABLE `schooldemand` DROP COLUMN `referral_code`,
    ADD COLUMN `ambassador_id` VARCHAR(36) NULL;

-- AlterTable
ALTER TABLE `schooldemandaudit` DROP COLUMN `referral_code`,
    ADD COLUMN `ambassador_id` VARCHAR(36) NULL;

-- CreateTable
CREATE TABLE `Ambassador` (
    `ambassador_id` VARCHAR(36) NOT NULL,
    `referral_code` VARCHAR(36) NOT NULL,
    `login_id` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `Ambassador_referral_code_key`(`referral_code`),
    PRIMARY KEY (`ambassador_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ambassador` ADD CONSTRAINT `Ambassador_login_id_fkey` FOREIGN KEY (`login_id`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SchoolDemand` ADD CONSTRAINT `SchoolDemand_ambassador_id_fkey` FOREIGN KEY (`ambassador_id`) REFERENCES `Ambassador`(`ambassador_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SchoolDemandAudit` ADD CONSTRAINT `SchoolDemandAudit_ambassador_id_fkey` FOREIGN KEY (`ambassador_id`) REFERENCES `Ambassador`(`ambassador_id`) ON DELETE CASCADE ON UPDATE CASCADE;
