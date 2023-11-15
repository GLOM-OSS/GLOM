/*
  Warnings:

  - You are about to drop the column `configured_by` on the `annualacademicprofile` table. All the data in the column will be lost.
  - The primary key for the `annualminimummodulationscore` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `annual_minimummodulation_score_id` on the `annualminimummodulationscore` table. All the data in the column will be lost.
  - You are about to drop the column `configured_by` on the `annualminimummodulationscore` table. All the data in the column will be lost.
  - The primary key for the `annualminimummodulationscoreaudit` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `annual_minimummodulation_score_audit_id` on the `annualminimummodulationscoreaudit` table. All the data in the column will be lost.
  - You are about to drop the column `annual_minimummodulation_score_id` on the `annualminimummodulationscoreaudit` table. All the data in the column will be lost.
  - You are about to drop the column `configured_by` on the `annualminimummodulationscoreaudit` table. All the data in the column will be lost.
  - You are about to drop the column `configured_by` on the `annualsemesterexamacess` table. All the data in the column will be lost.
  - You are about to drop the column `configured_by` on the `annualweighting` table. All the data in the column will be lost.
  - Added the required column `created_by` to the `AnnualAcademicProfile` table without a default value. This is not possible if the table is not empty.
  - The required column `annual_minimum_modulation_score_id` was added to the `AnnualMinimumModulationScore` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `created_by` to the `AnnualMinimumModulationScore` table without a default value. This is not possible if the table is not empty.
  - The required column `annual_minimum_modulation_score_audit_id` was added to the `AnnualMinimumModulationScoreAudit` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `annual_minimum_modulation_score_id` to the `AnnualMinimumModulationScoreAudit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `AnnualMinimumModulationScoreAudit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `AnnualWeighting` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `annualacademicprofile` DROP FOREIGN KEY `AnnualAcademicProfile_configured_by_fkey`;

-- DropForeignKey
ALTER TABLE `annualminimummodulationscore` DROP FOREIGN KEY `AnnualMinimumModulationScore_configured_by_fkey`;

-- DropForeignKey
ALTER TABLE `annualminimummodulationscoreaudit` DROP FOREIGN KEY `AnnualMinimumModulationScoreAudit_annual_minimummodulation__fkey`;

-- DropForeignKey
ALTER TABLE `annualminimummodulationscoreaudit` DROP FOREIGN KEY `AnnualMinimumModulationScoreAudit_configured_by_fkey`;

-- DropForeignKey
ALTER TABLE `annualsemesterexamacess` DROP FOREIGN KEY `AnnualSemesterExamAcess_configured_by_fkey`;

-- DropForeignKey
ALTER TABLE `annualweighting` DROP FOREIGN KEY `AnnualWeighting_configured_by_fkey`;

-- AlterTable
ALTER TABLE `annualacademicprofile` DROP COLUMN `configured_by`,
    ADD COLUMN `created_by` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `annualminimummodulationscore` DROP PRIMARY KEY,
    DROP COLUMN `annual_minimummodulation_score_id`,
    DROP COLUMN `configured_by`,
    ADD COLUMN `annual_minimum_modulation_score_id` VARCHAR(36) NOT NULL,
    ADD COLUMN `created_by` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`annual_minimum_modulation_score_id`);

-- AlterTable
ALTER TABLE `annualminimummodulationscoreaudit` DROP PRIMARY KEY,
    DROP COLUMN `annual_minimummodulation_score_audit_id`,
    DROP COLUMN `annual_minimummodulation_score_id`,
    DROP COLUMN `configured_by`,
    ADD COLUMN `annual_minimum_modulation_score_audit_id` VARCHAR(36) NOT NULL,
    ADD COLUMN `annual_minimum_modulation_score_id` VARCHAR(36) NOT NULL,
    ADD COLUMN `created_by` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`annual_minimum_modulation_score_audit_id`);

-- AlterTable
ALTER TABLE `annualsemesterexamacess` DROP COLUMN `configured_by`,
    ADD COLUMN `created_by` VARCHAR(36) NOT NULL DEFAULT '34a7a60b-b93b-4e7d-8960-afcc7e986ab4';

-- AlterTable
ALTER TABLE `annualweighting` DROP COLUMN `configured_by`,
    ADD COLUMN `created_by` VARCHAR(36) NOT NULL;

-- AddForeignKey
ALTER TABLE `AnnualMinimumModulationScore` ADD CONSTRAINT `AnnualMinimumModulationScore_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualRegistry`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualMinimumModulationScoreAudit` ADD CONSTRAINT `AnnualMinimumModulationScoreAudit_annual_minimum_modulation_fkey` FOREIGN KEY (`annual_minimum_modulation_score_id`) REFERENCES `AnnualMinimumModulationScore`(`annual_minimum_modulation_score_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualMinimumModulationScoreAudit` ADD CONSTRAINT `AnnualMinimumModulationScoreAudit_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualRegistry`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualWeighting` ADD CONSTRAINT `AnnualWeighting_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualRegistry`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualAcademicProfile` ADD CONSTRAINT `AnnualAcademicProfile_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualRegistry`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSemesterExamAcess` ADD CONSTRAINT `AnnualSemesterExamAcess_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;
