/*
  Warnings:

  - You are about to drop the column `lead_funnel` on the `schoolaudit` table. All the data in the column will be lost.
  - Added the required column `school_id` to the `SchoolAudit` table without a default value. This is not possible if the table is not empty.
  - Made the column `audited_by` on table `schoolaudit` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `schoolaudit` DROP FOREIGN KEY `SchoolAudit_audited_by_fkey`;

-- AlterTable
ALTER TABLE `annualsemesterexamacess` ALTER COLUMN `created_by` DROP DEFAULT;

-- AlterTable
ALTER TABLE `school` ALTER COLUMN `created_by` DROP DEFAULT;

-- AlterTable
ALTER TABLE `schoolaudit` DROP COLUMN `lead_funnel`,
    ADD COLUMN `school_id` VARCHAR(36) NOT NULL,
    MODIFY `audited_by` VARCHAR(36) NOT NULL;

-- AddForeignKey
ALTER TABLE `SchoolAudit` ADD CONSTRAINT `SchoolAudit_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `School`(`school_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SchoolAudit` ADD CONSTRAINT `SchoolAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;
