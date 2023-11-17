/*
  Warnings:

  - You are about to drop the column `login_id` on the `teacheraudit` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[login_id,is_valid]` on the table `ResetPassword` will be added. If there are existing duplicate values, this will fail.
  - The required column `teacher_id` was added to the `Teacher` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `teacher_id` to the `TeacherAudit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `teacheraudit` DROP FOREIGN KEY `TeacherAudit_login_id_fkey`;

-- AlterTable
ALTER TABLE `teacher` ADD COLUMN `teacher_id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`teacher_id`);

-- AlterTable
ALTER TABLE `teacheraudit` DROP COLUMN `login_id`,
    ADD COLUMN `teacher_id` VARCHAR(36) NOT NULL;

-- CreateTable
CREATE TABLE `AnnualSchoolSetting` (
    `annual_school_setting_id` VARCHAR(36) NOT NULL,
    `can_pay_fee` BOOLEAN NOT NULL DEFAULT false,
    `mark_insertion_source` ENUM('Teacher', 'Registry') NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `academic_year_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `AnnualSchoolSetting_academic_year_id_key`(`academic_year_id`),
    PRIMARY KEY (`annual_school_setting_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualSchoolSettingAudit` (
    `annual_school_setting_audit_id` VARCHAR(36) NOT NULL,
    `can_pay_fee` BOOLEAN NOT NULL,
    `mark_insertion_source` ENUM('Teacher', 'Registry') NOT NULL,
    `annual_school_setting_id` VARCHAR(36) NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_school_setting_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualDocumentSigner` (
    `annual_document_signer_id` VARCHAR(36) NOT NULL,
    `signer_name` VARCHAR(199) NOT NULL,
    `signer_title` VARCHAR(45) NOT NULL,
    `honorific` VARCHAR(45) NOT NULL,
    `hierarchy_level` INTEGER NOT NULL,
    `annual_school_setting_id` VARCHAR(36) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` VARCHAR(36) NOT NULL,
    `deleted_by` VARCHAR(36) NULL,

    PRIMARY KEY (`annual_document_signer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `ResetPassword_login_id_is_valid_key` ON `ResetPassword`(`login_id`, `is_valid`);

-- AddForeignKey
ALTER TABLE `AnnualSchoolSetting` ADD CONSTRAINT `AnnualSchoolSetting_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `AcademicYear`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSchoolSetting` ADD CONSTRAINT `AnnualSchoolSetting_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSchoolSettingAudit` ADD CONSTRAINT `AnnualSchoolSettingAudit_annual_school_setting_id_fkey` FOREIGN KEY (`annual_school_setting_id`) REFERENCES `AnnualSchoolSetting`(`annual_school_setting_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSchoolSettingAudit` ADD CONSTRAINT `AnnualSchoolSettingAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualDocumentSigner` ADD CONSTRAINT `AnnualDocumentSigner_annual_school_setting_id_fkey` FOREIGN KEY (`annual_school_setting_id`) REFERENCES `AnnualSchoolSetting`(`annual_school_setting_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualDocumentSigner` ADD CONSTRAINT `AnnualDocumentSigner_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualDocumentSigner` ADD CONSTRAINT `AnnualDocumentSigner_deleted_by_fkey` FOREIGN KEY (`deleted_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherAudit` ADD CONSTRAINT `TeacherAudit_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `Teacher`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;
