/*
  Warnings:

  - The values [PROGRESS] on the enum `SchoolDemandAudit_demand_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [PROGRESS] on the enum `SchoolDemandAudit_demand_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `schooldemand` MODIFY `demand_status` ENUM('PENDING', 'PROCESSING', 'REJECTED', 'VALIDATED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `schooldemandaudit` MODIFY `demand_status` ENUM('PENDING', 'PROCESSING', 'REJECTED', 'VALIDATED') NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE `Inquiry` (
    `inquiry_id` VARCHAR(36) NOT NULL,
    `email` VARCHAR(45) NOT NULL,
    `message` TEXT NULL,
    `created_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`inquiry_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
