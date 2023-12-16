/*
  Warnings:

  - You are about to drop the column `maximum_score` on the `annualacademicprofile` table. All the data in the column will be lost.
  - You are about to drop the column `minimum_score` on the `annualacademicprofile` table. All the data in the column will be lost.
  - You are about to drop the column `maximum_score` on the `annualacademicprofileaudit` table. All the data in the column will be lost.
  - You are about to drop the column `minimum_score` on the `annualacademicprofileaudit` table. All the data in the column will be lost.
  - The primary key for the `annualevaluationsubtype` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `academic_year_id` on the `annualevaluationsubtype` table. All the data in the column will be lost.
  - You are about to drop the column `annual_evaluation_sub_type_id` on the `annualevaluationsubtype` table. All the data in the column will be lost.
  - You are about to drop the column `evaluation_sub_type_name` on the `annualevaluationsubtype` table. All the data in the column will be lost.
  - You are about to drop the column `evaluation_sub_type_weight` on the `annualevaluationsubtype` table. All the data in the column will be lost.
  - You are about to drop the column `evaluation_type_id` on the `annualevaluationsubtype` table. All the data in the column will be lost.
  - You are about to drop the column `annual_evaluation_sub_type_id` on the `annualevaluationsubtypeaudit` table. All the data in the column will be lost.
  - You are about to drop the column `evaluation_sub_type_name` on the `annualevaluationsubtypeaudit` table. All the data in the column will be lost.
  - You are about to drop the column `evaluation_sub_type_weight` on the `annualevaluationsubtypeaudit` table. All the data in the column will be lost.
  - You are about to drop the column `grade_id` on the `annualgradeweighting` table. All the data in the column will be lost.
  - You are about to drop the column `observation` on the `annualgradeweighting` table. All the data in the column will be lost.
  - You are about to alter the column `minimum` on the `annualgradeweighting` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `maximum` on the `annualgradeweighting` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to drop the column `grade_id` on the `annualgradeweightingaudit` table. All the data in the column will be lost.
  - You are about to drop the column `observation` on the `annualgradeweightingaudit` table. All the data in the column will be lost.
  - You are about to alter the column `minimum` on the `annualgradeweightingaudit` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `maximum` on the `annualgradeweightingaudit` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to drop the column `annual_major_id` on the `annualmodule` table. All the data in the column will be lost.
  - You are about to drop the column `annual_semester_number` on the `annualsemesterexamacessaudit` table. All the data in the column will be lost.
  - You are about to drop the column `annual_evaluation_sub_type_id` on the `evaluation` table. All the data in the column will be lost.
  - You are about to drop the `annualcarryoversytem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `annualcarryoversytemaudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `annualevaluationtypeweighting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `annualevaluationtypeweightingaudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `annualminimummodulationscore` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `annualminimummodulationscoreaudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `evaluationtype` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `grade` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[academic_year_id,cycle_id,grade]` on the table `AnnualGradeWeighting` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[academic_year_id,cycle_id,annual_semester_number]` on the table `AnnualSemesterExamAcess` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[academic_year_id,cycle_id]` on the table `AnnualWeighting` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cycle_id` to the `AnnualAcademicProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maximum_point` to the `AnnualAcademicProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minimum_point` to the `AnnualAcademicProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maximum_point` to the `AnnualAcademicProfileAudit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minimum_point` to the `AnnualAcademicProfileAudit` table without a default value. This is not possible if the table is not empty.
  - The required column `annual_evaluation_subtype_id` was added to the `AnnualEvaluationSubtype` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `annual_evaluation_type_id` to the `AnnualEvaluationSubtype` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `AnnualEvaluationSubtype` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evaluation_subtype_name` to the `AnnualEvaluationSubtype` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evaluation_subtype_weight` to the `AnnualEvaluationSubtype` table without a default value. This is not possible if the table is not empty.
  - Added the required column `annual_evaluation_subtype_id` to the `AnnualEvaluationSubtypeAudit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `audited_by` to the `AnnualEvaluationSubtypeAudit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evaluation_subtype_name` to the `AnnualEvaluationSubtypeAudit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evaluation_subtype_weight` to the `AnnualEvaluationSubtypeAudit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grade` to the `AnnualGradeWeighting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grade` to the `AnnualGradeWeightingAudit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `annual_classroom_id` to the `AnnualModule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cycle_id` to the `AnnualSemesterExamAcess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cycle_id` to the `AnnualWeighting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `annual_evaluation_subtype_id` to the `Evaluation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `annualcarryoversytem` DROP FOREIGN KEY `AnnualCarryOverSytem_academic_year_id_fkey`;

-- DropForeignKey
ALTER TABLE `annualcarryoversytem` DROP FOREIGN KEY `AnnualCarryOverSytem_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `annualcarryoversytemaudit` DROP FOREIGN KEY `AnnualCarryOverSytemAudit_annual_carry_over_system_id_fkey`;

-- DropForeignKey
ALTER TABLE `annualcarryoversytemaudit` DROP FOREIGN KEY `AnnualCarryOverSytemAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `annualevaluationsubtype` DROP FOREIGN KEY `AnnualEvaluationSubType_academic_year_id_fkey`;

-- DropForeignKey
ALTER TABLE `annualevaluationsubtype` DROP FOREIGN KEY `AnnualEvaluationSubType_evaluation_type_id_fkey`;

-- DropForeignKey
ALTER TABLE `annualevaluationsubtypeaudit` DROP FOREIGN KEY `AnnualEvaluationSubTypeAudit_annual_evaluation_sub_type_id_fkey`;

-- DropForeignKey
ALTER TABLE `annualevaluationtypeweighting` DROP FOREIGN KEY `AnnualEvaluationTypeWeighting_academic_year_id_fkey`;

-- DropForeignKey
ALTER TABLE `annualevaluationtypeweighting` DROP FOREIGN KEY `AnnualEvaluationTypeWeighting_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `annualevaluationtypeweighting` DROP FOREIGN KEY `AnnualEvaluationTypeWeighting_cycle_id_fkey`;

-- DropForeignKey
ALTER TABLE `annualevaluationtypeweighting` DROP FOREIGN KEY `AnnualEvaluationTypeWeighting_evaluation_type_id_fkey`;

-- DropForeignKey
ALTER TABLE `annualevaluationtypeweightingaudit` DROP FOREIGN KEY `AnnualEvaluationTypeWeightingAudit_annual_evaluation_type_w_fkey`;

-- DropForeignKey
ALTER TABLE `annualevaluationtypeweightingaudit` DROP FOREIGN KEY `AnnualEvaluationTypeWeightingAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `annualgradeweighting` DROP FOREIGN KEY `AnnualGradeWeighting_grade_id_fkey`;

-- DropForeignKey
ALTER TABLE `annualgradeweightingaudit` DROP FOREIGN KEY `AnnualGradeWeightingAudit_grade_id_fkey`;

-- DropForeignKey
ALTER TABLE `annualminimummodulationscore` DROP FOREIGN KEY `AnnualMinimumModulationScore_academic_year_id_fkey`;

-- DropForeignKey
ALTER TABLE `annualminimummodulationscore` DROP FOREIGN KEY `AnnualMinimumModulationScore_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `annualminimummodulationscore` DROP FOREIGN KEY `AnnualMinimumModulationScore_cycle_id_fkey`;

-- DropForeignKey
ALTER TABLE `annualminimummodulationscoreaudit` DROP FOREIGN KEY `AnnualMinimumModulationScoreAudit_annual_minimum_modulation_fkey`;

-- DropForeignKey
ALTER TABLE `annualminimummodulationscoreaudit` DROP FOREIGN KEY `AnnualMinimumModulationScoreAudit_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `annualmodule` DROP FOREIGN KEY `AnnualModule_annual_major_id_fkey`;

-- DropForeignKey
ALTER TABLE `annualsemesterexamacess` DROP FOREIGN KEY `AnnualSemesterExamAcess_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `evaluation` DROP FOREIGN KEY `Evaluation_annual_evaluation_sub_type_id_fkey`;

-- DropForeignKey
ALTER TABLE `annualsemesterexamacess` DROP FOREIGN KEY `AnnualSemesterExamAcess_academic_year_id_fkey`;

-- DropIndex
DROP INDEX `AnnualSemesterExamAcess_academic_year_id_annual_semester_num_key` ON `annualsemesterexamacess`;

-- AlterTable
ALTER TABLE `annualacademicprofile` DROP COLUMN `maximum_score`,
    DROP COLUMN `minimum_score`,
    ADD COLUMN `cycle_id` VARCHAR(36) NOT NULL,
    ADD COLUMN `maximum_point` DOUBLE NOT NULL,
    ADD COLUMN `minimum_point` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `annualacademicprofileaudit` DROP COLUMN `maximum_score`,
    DROP COLUMN `minimum_score`,
    ADD COLUMN `maximum_point` DOUBLE NOT NULL,
    ADD COLUMN `minimum_point` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `annualevaluationsubtype` DROP PRIMARY KEY,
    DROP COLUMN `academic_year_id`,
    DROP COLUMN `annual_evaluation_sub_type_id`,
    DROP COLUMN `evaluation_sub_type_name`,
    DROP COLUMN `evaluation_sub_type_weight`,
    DROP COLUMN `evaluation_type_id`,
    ADD COLUMN `annual_evaluation_subtype_id` VARCHAR(36) NOT NULL,
    ADD COLUMN `annual_evaluation_type_id` VARCHAR(36) NOT NULL,
    ADD COLUMN `created_by` VARCHAR(36) NOT NULL,
    ADD COLUMN `evaluation_subtype_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `evaluation_subtype_weight` INTEGER NOT NULL,
    ADD PRIMARY KEY (`annual_evaluation_subtype_id`);

-- AlterTable
ALTER TABLE `annualevaluationsubtypeaudit` DROP COLUMN `annual_evaluation_sub_type_id`,
    DROP COLUMN `evaluation_sub_type_name`,
    DROP COLUMN `evaluation_sub_type_weight`,
    ADD COLUMN `annual_evaluation_subtype_id` VARCHAR(36) NOT NULL,
    ADD COLUMN `audited_by` VARCHAR(36) NOT NULL,
    ADD COLUMN `evaluation_subtype_name` VARCHAR(45) NOT NULL,
    ADD COLUMN `evaluation_subtype_weight` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `annualgradeweighting` DROP COLUMN `grade_id`,
    DROP COLUMN `observation`,
    ADD COLUMN `grade` CHAR(2) NOT NULL,
    MODIFY `minimum` DOUBLE NULL,
    MODIFY `maximum` DOUBLE NULL;

-- AlterTable
ALTER TABLE `annualgradeweightingaudit` DROP COLUMN `grade_id`,
    DROP COLUMN `observation`,
    ADD COLUMN `grade` VARCHAR(36) NOT NULL,
    MODIFY `minimum` DOUBLE NULL,
    MODIFY `maximum` DOUBLE NULL;

-- AlterTable
ALTER TABLE `annualmajor` ADD COLUMN `uses_module_system` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `annualmajoraudit` ADD COLUMN `teaching_system_audited_by` VARCHAR(36) NULL,
    ADD COLUMN `uses_module_system` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `audited_by` VARCHAR(36) NULL;

-- AlterTable
ALTER TABLE `annualmodule` DROP COLUMN `annual_major_id`,
    ADD COLUMN `annual_classroom_id` VARCHAR(36) NOT NULL,
    MODIFY `semester_number` INTEGER NULL;

-- AlterTable
ALTER TABLE `annualsemesterexamacess` ADD COLUMN `cycle_id` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `annualsemesterexamacessaudit` DROP COLUMN `annual_semester_number`;

-- AlterTable
ALTER TABLE `annualweighting` ADD COLUMN `cycle_id` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `evaluation` DROP COLUMN `annual_evaluation_sub_type_id`,
    ADD COLUMN `annual_evaluation_subtype_id` VARCHAR(36) NOT NULL;

-- DropTable
DROP TABLE `annualcarryoversytem`;

-- DropTable
DROP TABLE `annualcarryoversytemaudit`;

-- DropTable
DROP TABLE `annualevaluationtypeweighting`;

-- DropTable
DROP TABLE `annualevaluationtypeweightingaudit`;

-- DropTable
DROP TABLE `annualminimummodulationscore`;

-- DropTable
DROP TABLE `annualminimummodulationscoreaudit`;

-- DropTable
DROP TABLE `evaluationtype`;

-- DropTable
DROP TABLE `grade`;

-- CreateTable
CREATE TABLE `AnnualModuleSetting` (
    `annual_module_setting_id` VARCHAR(36) NOT NULL,
    `carry_over_system` ENUM('SUBJECT', 'MODULE') NOT NULL,
    `minimum_modulation_score` INTEGER NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `cycle_id` VARCHAR(36) NOT NULL,
    `academic_year_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `AnnualModuleSetting_academic_year_id_cycle_id_key`(`academic_year_id`, `cycle_id`),
    PRIMARY KEY (`annual_module_setting_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualModuleSettingAudit` (
    `annual_module_setting_audit_id` VARCHAR(36) NOT NULL,
    `carry_over_system` ENUM('SUBJECT', 'MODULE') NOT NULL,
    `minimum_modulation_score` INTEGER NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_module_setting_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_module_setting_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualEvaluationType` (
    `annual_evaluation_type_id` VARCHAR(36) NOT NULL,
    `evaluation_type_weight` INTEGER NOT NULL,
    `evaluation_type` ENUM('CA', 'EXAM', 'RESIT') NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `cycle_id` VARCHAR(36) NOT NULL,
    `academic_year_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `AnnualEvaluationType_academic_year_id_cycle_id_evaluation_ty_key`(`academic_year_id`, `cycle_id`, `evaluation_type`),
    PRIMARY KEY (`annual_evaluation_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualEvaluationTypeAudit` (
    `annual_evaluation_type_audit_id` VARCHAR(36) NOT NULL,
    `evaluation_type_weight` INTEGER NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_evaluation_type_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_evaluation_type_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `AnnualGradeWeighting_academic_year_id_cycle_id_grade_key` ON `AnnualGradeWeighting`(`academic_year_id`, `cycle_id`, `grade`);

-- CreateIndex
CREATE UNIQUE INDEX `AnnualSemesterExamAcess_academic_year_id_cycle_id_annual_sem_key` ON `AnnualSemesterExamAcess`(`academic_year_id`, `cycle_id`, `annual_semester_number`);

-- CreateIndex
CREATE UNIQUE INDEX `AnnualWeighting_academic_year_id_cycle_id_key` ON `AnnualWeighting`(`academic_year_id`, `cycle_id`);

-- AddForeignKey
ALTER TABLE `AnnualMajorAudit` ADD CONSTRAINT `AnnualMajorAudit_teaching_system_audited_by_fkey` FOREIGN KEY (`teaching_system_audited_by`) REFERENCES `AnnualRegistry`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualModule` ADD CONSTRAINT `AnnualModule_annual_classroom_id_fkey` FOREIGN KEY (`annual_classroom_id`) REFERENCES `AnnualClassroom`(`annual_classroom_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualModuleSetting` ADD CONSTRAINT `AnnualModuleSetting_cycle_id_fkey` FOREIGN KEY (`cycle_id`) REFERENCES `Cycle`(`cycle_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualModuleSetting` ADD CONSTRAINT `AnnualModuleSetting_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `AcademicYear`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualModuleSetting` ADD CONSTRAINT `AnnualModuleSetting_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualRegistry`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualModuleSettingAudit` ADD CONSTRAINT `AnnualModuleSettingAudit_annual_module_setting_id_fkey` FOREIGN KEY (`annual_module_setting_id`) REFERENCES `AnnualModuleSetting`(`annual_module_setting_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualModuleSettingAudit` ADD CONSTRAINT `AnnualModuleSettingAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualRegistry`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualEvaluationType` ADD CONSTRAINT `AnnualEvaluationType_cycle_id_fkey` FOREIGN KEY (`cycle_id`) REFERENCES `Cycle`(`cycle_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualEvaluationType` ADD CONSTRAINT `AnnualEvaluationType_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `AcademicYear`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualEvaluationType` ADD CONSTRAINT `AnnualEvaluationType_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualRegistry`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualEvaluationTypeAudit` ADD CONSTRAINT `AnnualEvaluationTypeAudit_annual_evaluation_type_id_fkey` FOREIGN KEY (`annual_evaluation_type_id`) REFERENCES `AnnualEvaluationType`(`annual_evaluation_type_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualEvaluationTypeAudit` ADD CONSTRAINT `AnnualEvaluationTypeAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualRegistry`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualEvaluationSubtype` ADD CONSTRAINT `AnnualEvaluationSubtype_annual_evaluation_type_id_fkey` FOREIGN KEY (`annual_evaluation_type_id`) REFERENCES `AnnualEvaluationType`(`annual_evaluation_type_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualEvaluationSubtype` ADD CONSTRAINT `AnnualEvaluationSubtype_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualRegistry`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualEvaluationSubtypeAudit` ADD CONSTRAINT `AnnualEvaluationSubtypeAudit_annual_evaluation_subtype_id_fkey` FOREIGN KEY (`annual_evaluation_subtype_id`) REFERENCES `AnnualEvaluationSubtype`(`annual_evaluation_subtype_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualEvaluationSubtypeAudit` ADD CONSTRAINT `AnnualEvaluationSubtypeAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualRegistry`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualWeighting` ADD CONSTRAINT `AnnualWeighting_cycle_id_fkey` FOREIGN KEY (`cycle_id`) REFERENCES `Cycle`(`cycle_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualAcademicProfile` ADD CONSTRAINT `AnnualAcademicProfile_cycle_id_fkey` FOREIGN KEY (`cycle_id`) REFERENCES `Cycle`(`cycle_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSemesterExamAcess` ADD CONSTRAINT `AnnualSemesterExamAcess_cycle_id_fkey` FOREIGN KEY (`cycle_id`) REFERENCES `Cycle`(`cycle_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSemesterExamAcess` ADD CONSTRAINT `AnnualSemesterExamAcess_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualRegistry`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation` ADD CONSTRAINT `Evaluation_annual_evaluation_subtype_id_fkey` FOREIGN KEY (`annual_evaluation_subtype_id`) REFERENCES `AnnualEvaluationSubtype`(`annual_evaluation_subtype_id`) ON DELETE CASCADE ON UPDATE CASCADE;
