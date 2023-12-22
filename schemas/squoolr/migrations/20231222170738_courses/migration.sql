/*
  Warnings:

  - You are about to drop the column `is_deleted` on the `annual_subject_audits` table. All the data in the column will be lost.
  - You are about to drop the column `objective` on the `annual_subject_audits` table. All the data in the column will be lost.
  - You are about to drop the column `subject_code` on the `annual_subject_audits` table. All the data in the column will be lost.
  - You are about to drop the column `weighting` on the `annual_subject_audits` table. All the data in the column will be lost.
  - You are about to drop the column `annual_module_id` on the `annual_subjects` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `annual_subjects` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `annual_subjects` table. All the data in the column will be lost.
  - You are about to drop the column `objective` on the `annual_subjects` table. All the data in the column will be lost.
  - You are about to drop the column `weighting` on the `annual_subjects` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[module_code,annual_classroom_id]` on the table `annual_modules` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subject_part_id,annual_subject_id]` on the table `annual_subject_parts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subject_code,academic_year_id]` on the table `annual_subjects` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `annual_teacher_id` to the `annual_subject_part_audits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `annual_teacher_id` to the `annual_subject_parts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `academic_year_id` to the `annual_subjects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `annual_modules` DROP FOREIGN KEY `annual_modules_created_from_fkey`;

-- DropForeignKey
ALTER TABLE `annual_subjects` DROP FOREIGN KEY `annual_subjects_annual_module_id_fkey`;

-- AlterTable
ALTER TABLE `annual_module_audits` MODIFY `semester_number` INTEGER NULL;

-- AlterTable
ALTER TABLE `annual_modules` MODIFY `semester_number` INTEGER NULL;

-- AlterTable
ALTER TABLE `annual_subject_audits` DROP COLUMN `is_deleted`,
    DROP COLUMN `objective`,
    DROP COLUMN `subject_code`,
    DROP COLUMN `weighting`;

-- AlterTable
ALTER TABLE `annual_subject_part_audits` ADD COLUMN `annual_teacher_id` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `annual_subject_parts` ADD COLUMN `annual_teacher_id` VARCHAR(36) NOT NULL,
    ADD COLUMN `is_deleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `annual_subjects` DROP COLUMN `annual_module_id`,
    DROP COLUMN `created_at`,
    DROP COLUMN `is_deleted`,
    DROP COLUMN `objective`,
    DROP COLUMN `weighting`,
    ADD COLUMN `academic_year_id` VARCHAR(36) NOT NULL;

-- CreateTable
CREATE TABLE `annual_module_has_subjects` (
    `annual_modules_subject_id` VARCHAR(36) NOT NULL,
    `weighting` DOUBLE NOT NULL,
    `objective` MEDIUMTEXT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` VARCHAR(36) NOT NULL,
    `annual_module_id` VARCHAR(36) NOT NULL,
    `annual_subject_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `annual_module_has_subjects_annual_module_id_annual_subject_i_key`(`annual_module_id`, `annual_subject_id`),
    PRIMARY KEY (`annual_modules_subject_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_module_has_subject_audits` (
    `annual_modules_subject_audit_id` VARCHAR(36) NOT NULL,
    `weighting` DOUBLE NOT NULL,
    `objective` MEDIUMTEXT NULL,
    `is_deleted` BOOLEAN NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `audited_by` VARCHAR(36) NOT NULL,
    `annual_modules_subject_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`annual_modules_subject_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `annual_modules_module_code_annual_classroom_id_key` ON `annual_modules`(`module_code`, `annual_classroom_id`);

-- CreateIndex
CREATE FULLTEXT INDEX `annual_modules_module_name_idx` ON `annual_modules`(`module_name`);

-- CreateIndex
CREATE FULLTEXT INDEX `annual_modules_module_name_module_code_idx` ON `annual_modules`(`module_name`, `module_code`);

-- CreateIndex
CREATE UNIQUE INDEX `annual_subject_parts_subject_part_id_annual_subject_id_key` ON `annual_subject_parts`(`subject_part_id`, `annual_subject_id`);

-- CreateIndex
CREATE UNIQUE INDEX `annual_subjects_subject_code_academic_year_id_key` ON `annual_subjects`(`subject_code`, `academic_year_id`);

-- CreateIndex
CREATE FULLTEXT INDEX `annual_subjects_subject_name_idx` ON `annual_subjects`(`subject_name`);

-- CreateIndex
CREATE FULLTEXT INDEX `annual_subjects_subject_name_subject_code_idx` ON `annual_subjects`(`subject_name`, `subject_code`);

-- AddForeignKey
ALTER TABLE `annual_modules` ADD CONSTRAINT `annual_modules_created_from_fkey` FOREIGN KEY (`created_from`) REFERENCES `annual_module_has_subjects`(`annual_modules_subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_subjects` ADD CONSTRAINT `annual_subjects_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_module_has_subjects` ADD CONSTRAINT `annual_module_has_subjects_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_module_has_subjects` ADD CONSTRAINT `annual_module_has_subjects_annual_module_id_fkey` FOREIGN KEY (`annual_module_id`) REFERENCES `annual_modules`(`annual_module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_module_has_subjects` ADD CONSTRAINT `annual_module_has_subjects_annual_subject_id_fkey` FOREIGN KEY (`annual_subject_id`) REFERENCES `annual_subjects`(`annual_subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_module_has_subject_audits` ADD CONSTRAINT `annual_module_has_subject_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_module_has_subject_audits` ADD CONSTRAINT `annual_module_has_subject_audits_annual_modules_subject_id_fkey` FOREIGN KEY (`annual_modules_subject_id`) REFERENCES `annual_module_has_subjects`(`annual_modules_subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_subject_parts` ADD CONSTRAINT `annual_subject_parts_annual_teacher_id_fkey` FOREIGN KEY (`annual_teacher_id`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_subject_part_audits` ADD CONSTRAINT `annual_subject_part_audits_annual_teacher_id_fkey` FOREIGN KEY (`annual_teacher_id`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;
