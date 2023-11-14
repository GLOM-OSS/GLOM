/*
  Warnings:

  - You are about to drop the column `annual_teacher_id` on the `annualcreditunithassubjectpartaudit` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `annualcreditunithassubjectpartaudit` DROP FOREIGN KEY `AnnualCreditUnitHasSubjectPartAudit_annual_teacher_id_fkey`;

-- AlterTable
ALTER TABLE `annualconfigurator` ADD COLUMN `disabled_by` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `annualcreditunithassubjectpartaudit` DROP COLUMN `annual_teacher_id`;

-- AddForeignKey
ALTER TABLE `AnnualConfigurator` ADD CONSTRAINT `AnnualConfigurator_disabled_by_fkey` FOREIGN KEY (`disabled_by`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;
