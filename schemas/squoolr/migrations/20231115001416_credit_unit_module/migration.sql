/*
  Warnings:

  - The values [CREDIT_UNIT] on the enum `AnnualCarryOverSytemAudit_carry_over_system` will be removed. If these variants are still used in the database, this will fail.
  - The values [CREDIT_UNIT] on the enum `AnnualCarryOverSytemAudit_carry_over_system` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `annual_credit_unit_subject_id` on the `assessment` table. All the data in the column will be lost.
  - You are about to drop the column `annual_credit_unit_subject_id` on the `chapter` table. All the data in the column will be lost.
  - You are about to drop the column `cycle_type` on the `cycle` table. All the data in the column will be lost.
  - The values [BTS,DOCTORAT] on the enum `Cycle_cycle_name` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `annual_credit_unit_subject_id` on the `evaluation` table. All the data in the column will be lost.
  - You are about to drop the column `annual_credit_unit_subject_id` on the `presencelist` table. All the data in the column will be lost.
  - You are about to drop the column `annual_credit_unit_subject_id` on the `resource` table. All the data in the column will be lost.
  - You are about to drop the `annualcreditunit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `annualcreditunitaudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `annualcreditunithassubjectpart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `annualcreditunithassubjectpartaudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `annualcreditunitsubject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `annualcreditunitsubjectaudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `annualstudenthascreditunit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `presencelisthascreditunitstudent` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `annual_subject_id` to the `Assessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `annual_subject_id` to the `Chapter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `annual_subject_id` to the `Evaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `annual_subject_id` to the `PresenceList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `annual_subject_id` to the `Resource` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `annualcreditunit` DROP FOREIGN KEY `AnnualCreditUnit_academic_year_id_fkey`;

-- DropForeignKey
ALTER TABLE `annualcreditunit` DROP FOREIGN KEY `AnnualCreditUnit_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `annualcreditunit` DROP FOREIGN KEY `AnnualCreditUnit_major_id_fkey`;

-- DropForeignKey
ALTER TABLE `annualcreditunitaudit` DROP FOREIGN KEY `AnnualCreditUnitAudit_annual_credit_unit_id_fkey`;

-- DropForeignKey
ALTER TABLE `annualcreditunitaudit` DROP FOREIGN KEY `AnnualCreditUnitAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `annualcreditunithassubjectpart` DROP FOREIGN KEY `AnnualCreditUnitHasSubjectPart_annual_credit_unit_subject_i_fkey`;

-- DropForeignKey
ALTER TABLE `annualcreditunithassubjectpart` DROP FOREIGN KEY `AnnualCreditUnitHasSubjectPart_annual_teacher_id_fkey`;

-- DropForeignKey
ALTER TABLE `annualcreditunithassubjectpart` DROP FOREIGN KEY `AnnualCreditUnitHasSubjectPart_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `annualcreditunithassubjectpart` DROP FOREIGN KEY `AnnualCreditUnitHasSubjectPart_subject_part_id_fkey`;

-- DropForeignKey
ALTER TABLE `annualcreditunithassubjectpartaudit` DROP FOREIGN KEY `AnnualCreditUnitHasSubjectPartAudit_annual_credit_unit_has__fkey`;

-- DropForeignKey
ALTER TABLE `annualcreditunithassubjectpartaudit` DROP FOREIGN KEY `AnnualCreditUnitHasSubjectPartAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `annualcreditunitsubject` DROP FOREIGN KEY `AnnualCreditUnitSubject_annual_credit_unit_id_fkey`;

-- DropForeignKey
ALTER TABLE `annualcreditunitsubject` DROP FOREIGN KEY `AnnualCreditUnitSubject_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `annualcreditunitsubjectaudit` DROP FOREIGN KEY `AnnualCreditUnitSubjectAudit_annual_credit_unit_subject_id_fkey`;

-- DropForeignKey
ALTER TABLE `annualcreditunitsubjectaudit` DROP FOREIGN KEY `AnnualCreditUnitSubjectAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `annualstudenthascreditunit` DROP FOREIGN KEY `AnnualStudentHasCreditUnit_annual_credit_unit_id_fkey`;

-- DropForeignKey
ALTER TABLE `annualstudenthascreditunit` DROP FOREIGN KEY `AnnualStudentHasCreditUnit_annual_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `assessment` DROP FOREIGN KEY `Assessment_annual_credit_unit_subject_id_fkey`;

-- DropForeignKey
ALTER TABLE `chapter` DROP FOREIGN KEY `Chapter_annual_credit_unit_subject_id_fkey`;

-- DropForeignKey
ALTER TABLE `evaluation` DROP FOREIGN KEY `Evaluation_annual_credit_unit_subject_id_fkey`;

-- DropForeignKey
ALTER TABLE `presencelist` DROP FOREIGN KEY `PresenceList_annual_credit_unit_subject_id_fkey`;

-- DropForeignKey
ALTER TABLE `presencelisthascreditunitstudent` DROP FOREIGN KEY `PresenceListHasCreditUnitStudent_annual_student_has_credit__fkey`;

-- DropForeignKey
ALTER TABLE `presencelisthascreditunitstudent` DROP FOREIGN KEY `PresenceListHasCreditUnitStudent_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `presencelisthascreditunitstudent` DROP FOREIGN KEY `PresenceListHasCreditUnitStudent_deleted_by_fkey`;

-- DropForeignKey
ALTER TABLE `presencelisthascreditunitstudent` DROP FOREIGN KEY `PresenceListHasCreditUnitStudent_presence_list_id_fkey`;

-- DropForeignKey
ALTER TABLE `resource` DROP FOREIGN KEY `Resource_annual_credit_unit_subject_id_fkey`;

-- AlterTable
ALTER TABLE `annualcarryoversytem` MODIFY `carry_over_system` ENUM('SUBJECT', 'MODULE') NOT NULL;

-- AlterTable
ALTER TABLE `annualcarryoversytemaudit` MODIFY `carry_over_system` ENUM('SUBJECT', 'MODULE') NOT NULL;

-- AlterTable
ALTER TABLE `annualsemesterexamacess` ALTER COLUMN `created_by` DROP DEFAULT;

-- AlterTable
ALTER TABLE `assessment` DROP COLUMN `annual_credit_unit_subject_id`,
    ADD COLUMN `annual_subject_id` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `chapter` DROP COLUMN `annual_credit_unit_subject_id`,
    ADD COLUMN `annual_subject_id` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `cycle` DROP COLUMN `cycle_type`,
    MODIFY `cycle_name` ENUM('HND', 'DUT', 'DTS', 'BACHELOR', 'MASTER', 'DOCTORATE') NOT NULL;

-- AlterTable
ALTER TABLE `evaluation` DROP COLUMN `annual_credit_unit_subject_id`,
    ADD COLUMN `annual_subject_id` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `presencelist` DROP COLUMN `annual_credit_unit_subject_id`,
    ADD COLUMN `annual_subject_id` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `resource` DROP COLUMN `annual_credit_unit_subject_id`,
    ADD COLUMN `annual_subject_id` VARCHAR(36) NOT NULL;

-- DropTable
DROP TABLE `annualcreditunit`;

-- DropTable
DROP TABLE `annualcreditunitaudit`;

-- DropTable
DROP TABLE `annualcreditunithassubjectpart`;

-- DropTable
DROP TABLE `annualcreditunithassubjectpartaudit`;

-- DropTable
DROP TABLE `annualcreditunitsubject`;

-- DropTable
DROP TABLE `annualcreditunitsubjectaudit`;

-- DropTable
DROP TABLE `annualstudenthascreditunit`;

-- DropTable
DROP TABLE `presencelisthascreditunitstudent`;

-- CreateTable
CREATE TABLE `AnnualModule` (
    `annual_module_id` VARCHAR(36) NOT NULL,
    `module_code` VARCHAR(45) NOT NULL,
    `module_name` VARCHAR(45) NOT NULL,
    `credit_points` INTEGER NOT NULL,
    `semester_number` INTEGER NOT NULL,
    `is_exam_published` BOOLEAN NOT NULL DEFAULT false,
    `is_resit_published` BOOLEAN NOT NULL DEFAULT false,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_major_id` VARCHAR(36) NOT NULL,
    `academic_year_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_module_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualModuleAudit` (
    `annual_module_audit_id` VARCHAR(36) NOT NULL,
    `module_code` VARCHAR(45) NOT NULL,
    `module_name` VARCHAR(45) NOT NULL,
    `credit_points` INTEGER NOT NULL,
    `semester_number` INTEGER NOT NULL,
    `is_exam_published` BOOLEAN NOT NULL,
    `is_resit_published` BOOLEAN NOT NULL,
    `is_deleted` BOOLEAN NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_module_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_module_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualSubject` (
    `annual_subject_id` VARCHAR(36) NOT NULL,
    `weighting` DOUBLE NOT NULL,
    `objective` MEDIUMTEXT NOT NULL,
    `subject_code` VARCHAR(45) NOT NULL,
    `subject_name` VARCHAR(45) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_module_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_subject_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualSubjectAudit` (
    `annua_subject_audit_id` VARCHAR(36) NOT NULL,
    `weighting` DOUBLE NOT NULL,
    `objective` MEDIUMTEXT NOT NULL,
    `subject_code` VARCHAR(45) NOT NULL,
    `subject_name` VARCHAR(45) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `audited_by` VARCHAR(36) NOT NULL,
    `annual_subject_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annua_subject_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualSubjectPart` (
    `annual_subject_part_id` VARCHAR(36) NOT NULL,
    `number_of_hours` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `subject_part_id` VARCHAR(36) NOT NULL,
    `annual_subject_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_subject_part_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualSubjectPartAudit` (
    `annual_subject_part_audit_id` VARCHAR(36) NOT NULL,
    `number_of_hours` INTEGER NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_subject_part_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_subject_part_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualStudentHasModule` (
    `annual_student_has_module_id` VARCHAR(36) NOT NULL,
    `semester_number` INTEGER NOT NULL,
    `annual_student_id` VARCHAR(36) NOT NULL,
    `annual_module_id` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `AnnualStudentHasModule_annual_student_id_annual_module_id_key`(`annual_student_id`, `annual_module_id`),
    PRIMARY KEY (`annual_student_has_module_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PresenceListHasModuleStudent` (
    `presence_list_has_credit_student_id` VARCHAR(36) NOT NULL,
    `annual_student_has_module_id` VARCHAR(36) NOT NULL,
    `presence_list_id` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` VARCHAR(36) NOT NULL,
    `deleted_at` DATETIME(0) NULL,
    `deleted_by` VARCHAR(36) NULL,

    PRIMARY KEY (`presence_list_has_credit_student_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AnnualModule` ADD CONSTRAINT `AnnualModule_annual_major_id_fkey` FOREIGN KEY (`annual_major_id`) REFERENCES `AnnualMajor`(`annual_major_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualModule` ADD CONSTRAINT `AnnualModule_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `AcademicYear`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualModule` ADD CONSTRAINT `AnnualModule_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualModuleAudit` ADD CONSTRAINT `AnnualModuleAudit_annual_module_id_fkey` FOREIGN KEY (`annual_module_id`) REFERENCES `AnnualModule`(`annual_module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualModuleAudit` ADD CONSTRAINT `AnnualModuleAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSubject` ADD CONSTRAINT `AnnualSubject_annual_module_id_fkey` FOREIGN KEY (`annual_module_id`) REFERENCES `AnnualModule`(`annual_module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSubject` ADD CONSTRAINT `AnnualSubject_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSubjectAudit` ADD CONSTRAINT `AnnualSubjectAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSubjectAudit` ADD CONSTRAINT `AnnualSubjectAudit_annual_subject_id_fkey` FOREIGN KEY (`annual_subject_id`) REFERENCES `AnnualSubject`(`annual_subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSubjectPart` ADD CONSTRAINT `AnnualSubjectPart_subject_part_id_fkey` FOREIGN KEY (`subject_part_id`) REFERENCES `SubjectPart`(`subject_part_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSubjectPart` ADD CONSTRAINT `AnnualSubjectPart_annual_subject_id_fkey` FOREIGN KEY (`annual_subject_id`) REFERENCES `AnnualSubject`(`annual_subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSubjectPart` ADD CONSTRAINT `AnnualSubjectPart_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSubjectPartAudit` ADD CONSTRAINT `AnnualSubjectPartAudit_annual_subject_part_id_fkey` FOREIGN KEY (`annual_subject_part_id`) REFERENCES `AnnualSubjectPart`(`annual_subject_part_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSubjectPartAudit` ADD CONSTRAINT `AnnualSubjectPartAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation` ADD CONSTRAINT `Evaluation_annual_subject_id_fkey` FOREIGN KEY (`annual_subject_id`) REFERENCES `AnnualSubject`(`annual_subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chapter` ADD CONSTRAINT `Chapter_annual_subject_id_fkey` FOREIGN KEY (`annual_subject_id`) REFERENCES `AnnualSubject`(`annual_subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resource` ADD CONSTRAINT `Resource_annual_subject_id_fkey` FOREIGN KEY (`annual_subject_id`) REFERENCES `AnnualSubject`(`annual_subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assessment` ADD CONSTRAINT `Assessment_annual_subject_id_fkey` FOREIGN KEY (`annual_subject_id`) REFERENCES `AnnualSubject`(`annual_subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualStudentHasModule` ADD CONSTRAINT `AnnualStudentHasModule_annual_student_id_fkey` FOREIGN KEY (`annual_student_id`) REFERENCES `AnnualStudent`(`annual_student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualStudentHasModule` ADD CONSTRAINT `AnnualStudentHasModule_annual_module_id_fkey` FOREIGN KEY (`annual_module_id`) REFERENCES `AnnualModule`(`annual_module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PresenceList` ADD CONSTRAINT `PresenceList_annual_subject_id_fkey` FOREIGN KEY (`annual_subject_id`) REFERENCES `AnnualSubject`(`annual_subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PresenceListHasModuleStudent` ADD CONSTRAINT `PresenceListHasModuleStudent_annual_student_has_module_id_fkey` FOREIGN KEY (`annual_student_has_module_id`) REFERENCES `AnnualStudentHasModule`(`annual_student_has_module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PresenceListHasModuleStudent` ADD CONSTRAINT `PresenceListHasModuleStudent_presence_list_id_fkey` FOREIGN KEY (`presence_list_id`) REFERENCES `PresenceList`(`presence_list_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PresenceListHasModuleStudent` ADD CONSTRAINT `PresenceListHasModuleStudent_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PresenceListHasModuleStudent` ADD CONSTRAINT `PresenceListHasModuleStudent_deleted_by_fkey` FOREIGN KEY (`deleted_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;
