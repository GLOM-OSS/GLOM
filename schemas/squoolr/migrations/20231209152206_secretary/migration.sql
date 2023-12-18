/*
  Warnings:

  - You are about to drop the column `configured_at` on the `annualacademicprofile` table. All the data in the column will be lost.
  - You are about to drop the column `configured_by` on the `annualacademicprofile` table. All the data in the column will be lost.
  - The values [CREDIT_UNIT] on the enum `AnnualCarryOverSytemAudit_carry_over_system` will be removed. If these variants are still used in the database, this will fail.
  - The values [CREDIT_UNIT] on the enum `AnnualCarryOverSytemAudit_carry_over_system` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `academic_year_id` on the `annualclassroom` table. All the data in the column will be lost.
  - You are about to drop the column `classroom_acronym` on the `annualclassroom` table. All the data in the column will be lost.
  - You are about to drop the column `classroom_code` on the `annualclassroom` table. All the data in the column will be lost.
  - You are about to drop the column `classroom_name` on the `annualclassroom` table. All the data in the column will be lost.
  - You are about to drop the column `registration_fee` on the `annualclassroom` table. All the data in the column will be lost.
  - You are about to drop the column `total_fee_due` on the `annualclassroom` table. All the data in the column will be lost.
  - You are about to drop the column `registration_fee` on the `annualclassroomaudit` table. All the data in the column will be lost.
  - You are about to drop the column `total_fee_due` on the `annualclassroomaudit` table. All the data in the column will be lost.
  - You are about to drop the column `major_code` on the `annualmajor` table. All the data in the column will be lost.
  - You are about to drop the column `department_id` on the `annualmajoraudit` table. All the data in the column will be lost.
  - You are about to drop the column `major_code` on the `annualmajoraudit` table. All the data in the column will be lost.
  - The primary key for the `annualminimummodulationscore` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `annual_minimummodulation_score_id` on the `annualminimummodulationscore` table. All the data in the column will be lost.
  - You are about to drop the column `configured_at` on the `annualminimummodulationscore` table. All the data in the column will be lost.
  - You are about to drop the column `configured_by` on the `annualminimummodulationscore` table. All the data in the column will be lost.
  - The primary key for the `annualminimummodulationscoreaudit` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `annual_minimummodulation_score_audit_id` on the `annualminimummodulationscoreaudit` table. All the data in the column will be lost.
  - You are about to drop the column `annual_minimummodulation_score_id` on the `annualminimummodulationscoreaudit` table. All the data in the column will be lost.
  - You are about to drop the column `configured_by` on the `annualminimummodulationscoreaudit` table. All the data in the column will be lost.
  - You are about to drop the column `added_at` on the `annualregistry` table. All the data in the column will be lost.
  - You are about to drop the column `added_by` on the `annualregistry` table. All the data in the column will be lost.
  - You are about to drop the column `configured_at` on the `annualsemesterexamacess` table. All the data in the column will be lost.
  - You are about to drop the column `configured_by` on the `annualsemesterexamacess` table. All the data in the column will be lost.
  - You are about to drop the column `teacher_id` on the `annualteacher` table. All the data in the column will be lost.
  - You are about to drop the column `configured_at` on the `annualweighting` table. All the data in the column will be lost.
  - You are about to drop the column `configured_by` on the `annualweighting` table. All the data in the column will be lost.
  - You are about to drop the column `annual_credit_unit_subject_id` on the `assessment` table. All the data in the column will be lost.
  - You are about to drop the column `annual_credit_unit_subject_id` on the `chapter` table. All the data in the column will be lost.
  - You are about to drop the column `classroom_acronym` on the `classroom` table. All the data in the column will be lost.
  - You are about to drop the column `classroom_code` on the `classroom` table. All the data in the column will be lost.
  - You are about to drop the column `classroom_name` on the `classroom` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `classroom` table. All the data in the column will be lost.
  - You are about to drop the column `cycle_type` on the `cycle` table. All the data in the column will be lost.
  - The values [BTS,DOCTORAT] on the enum `Cycle_cycle_name` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `department_code` on the `department` table. All the data in the column will be lost.
  - You are about to drop the column `annual_credit_unit_subject_id` on the `evaluation` table. All the data in the column will be lost.
  - You are about to drop the column `cookie_age` on the `login` table. All the data in the column will be lost.
  - You are about to drop the column `cookie_age` on the `loginaudit` table. All the data in the column will be lost.
  - You are about to drop the column `major_acronym` on the `major` table. All the data in the column will be lost.
  - You are about to drop the column `major_code` on the `major` table. All the data in the column will be lost.
  - You are about to drop the column `major_name` on the `major` table. All the data in the column will be lost.
  - You are about to drop the column `major_acronym` on the `majoraudit` table. All the data in the column will be lost.
  - You are about to drop the column `major_code` on the `majoraudit` table. All the data in the column will be lost.
  - You are about to drop the column `major_name` on the `majoraudit` table. All the data in the column will be lost.
  - You are about to drop the column `annual_student_id` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `paid_by` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `payment_date` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `semester_number` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_id` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `annual_credit_unit_subject_id` on the `presencelist` table. All the data in the column will be lost.
  - You are about to drop the column `annual_credit_unit_subject_id` on the `resource` table. All the data in the column will be lost.
  - You are about to drop the column `demanded_by` on the `school` table. All the data in the column will be lost.
  - You are about to alter the column `longitude` on the `school` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `latitude` on the `school` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to drop the column `is_deleted` on the `schoolaudit` table. All the data in the column will be lost.
  - You are about to drop the column `is_validated` on the `schoolaudit` table. All the data in the column will be lost.
  - You are about to alter the column `longitude` on the `schoolaudit` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `latitude` on the `schoolaudit` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to drop the column `demanded_at` on the `schooldemand` table. All the data in the column will be lost.
  - The values [PROGRESS] on the enum `SchoolDemandAudit_demand_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [PROGRESS] on the enum `SchoolDemandAudit_demand_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `annualcreditunit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `annualcreditunitaudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `annualcreditunithassubjectpart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `annualcreditunithassubjectpartaudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `annualcreditunitsubject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `annualcreditunitsubjectaudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `annualstudenthascreditunit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `presencelisthascreditunitstudent` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[login_id,is_valid]` on the table `ResetPassword` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[login_id,classroom_id]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[login_id]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `created_by` to the `AnnualAcademicProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `annual_major_id` to the `AnnualClassroom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classroom_level` to the `AnnualClassroom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number_of_divisions` to the `AnnualClassroom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number_of_divisions` to the `AnnualClassroomAudit` table without a default value. This is not possible if the table is not empty.
  - The required column `annual_minimum_modulation_score_id` was added to the `AnnualMinimumModulationScore` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `created_by` to the `AnnualMinimumModulationScore` table without a default value. This is not possible if the table is not empty.
  - The required column `annual_minimum_modulation_score_audit_id` was added to the `AnnualMinimumModulationScoreAudit` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `annual_minimum_modulation_score_id` to the `AnnualMinimumModulationScoreAudit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `AnnualMinimumModulationScoreAudit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `AnnualRegistry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `AnnualSemesterExamAcess` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `AnnualWeighting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `annual_subject_id` to the `Assessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `annual_subject_id` to the `Chapter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classroom_level` to the `Classroom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department_acronym` to the `DepartmentAudit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `annual_subject_id` to the `Evaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_agent` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_ref` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `annual_subject_id` to the `PresenceList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `annual_subject_id` to the `Resource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lead_funnel` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `school_id` to the `SchoolAudit` table without a default value. This is not possible if the table is not empty.
  - Made the column `audited_by` on table `schoolaudit` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `login_id` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `annualacademicprofile` DROP FOREIGN KEY `AnnualAcademicProfile_configured_by_fkey`;

-- DropForeignKey
ALTER TABLE `annualclassroom` DROP FOREIGN KEY `AnnualClassroom_academic_year_id_fkey`;

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
ALTER TABLE `annualcreditunithassubjectpartaudit` DROP FOREIGN KEY `AnnualCreditUnitHasSubjectPartAudit_annual_teacher_id_fkey`;

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
ALTER TABLE `annualmajoraudit` DROP FOREIGN KEY `AnnualMajorAudit_department_id_fkey`;

-- DropForeignKey
ALTER TABLE `annualminimummodulationscore` DROP FOREIGN KEY `AnnualMinimumModulationScore_configured_by_fkey`;

-- DropForeignKey
ALTER TABLE `annualminimummodulationscoreaudit` DROP FOREIGN KEY `AnnualMinimumModulationScoreAudit_annual_minimummodulation__fkey`;

-- DropForeignKey
ALTER TABLE `annualminimummodulationscoreaudit` DROP FOREIGN KEY `AnnualMinimumModulationScoreAudit_configured_by_fkey`;

-- DropForeignKey
ALTER TABLE `annualregistry` DROP FOREIGN KEY `AnnualRegistry_added_by_fkey`;

-- DropForeignKey
ALTER TABLE `annualsemesterexamacess` DROP FOREIGN KEY `AnnualSemesterExamAcess_configured_by_fkey`;

-- DropForeignKey
ALTER TABLE `annualstudenthascreditunit` DROP FOREIGN KEY `AnnualStudentHasCreditUnit_annual_credit_unit_id_fkey`;

-- DropForeignKey
ALTER TABLE `annualstudenthascreditunit` DROP FOREIGN KEY `AnnualStudentHasCreditUnit_annual_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `annualteacher` DROP FOREIGN KEY `AnnualTeacher_login_id_fkey`;

-- DropForeignKey
ALTER TABLE `annualteacher` DROP FOREIGN KEY `AnnualTeacher_teacher_id_fkey`;

-- DropForeignKey
ALTER TABLE `annualweighting` DROP FOREIGN KEY `AnnualWeighting_configured_by_fkey`;

-- DropForeignKey
ALTER TABLE `assessment` DROP FOREIGN KEY `Assessment_annual_credit_unit_subject_id_fkey`;

-- DropForeignKey
ALTER TABLE `chapter` DROP FOREIGN KEY `Chapter_annual_credit_unit_subject_id_fkey`;

-- DropForeignKey
ALTER TABLE `evaluation` DROP FOREIGN KEY `Evaluation_annual_credit_unit_subject_id_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_annual_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_paid_by_fkey`;

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

-- DropForeignKey
ALTER TABLE `school` DROP FOREIGN KEY `School_demanded_by_fkey`;

-- DropForeignKey
ALTER TABLE `schoolaudit` DROP FOREIGN KEY `SchoolAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `teacheraudit` DROP FOREIGN KEY `TeacherAudit_teacher_id_fkey`;

-- DropIndex
DROP INDEX `AnnualClassroom_classroom_code_academic_year_id_key` ON `annualclassroom`;

-- DropIndex
DROP INDEX `AnnualConfigurator_login_id_matricule_key` ON `annualconfigurator`;

-- DropIndex
DROP INDEX `AnnualMajor_major_code_academic_year_id_key` ON `annualmajor`;

-- DropIndex
DROP INDEX `Classroom_classroom_code_key` ON `classroom`;

-- DropIndex
DROP INDEX `Department_department_code_key` ON `department`;

-- DropIndex
DROP INDEX `Major_major_code_key` ON `major`;

-- DropIndex
DROP INDEX `MajorAudit_major_code_key` ON `majoraudit`;

-- DropIndex
DROP INDEX `Student_matricule_key` ON `student`;

-- DropIndex
DROP INDEX `Teacher_matricule_key` ON `teacher`;

-- AlterTable
ALTER TABLE `annualacademicprofile` DROP COLUMN `configured_at`,
    DROP COLUMN `configured_by`,
    ADD COLUMN `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `created_by` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `annualcarryoversytem` MODIFY `carry_over_system` ENUM('SUBJECT', 'MODULE') NOT NULL;

-- AlterTable
ALTER TABLE `annualcarryoversytemaudit` MODIFY `carry_over_system` ENUM('SUBJECT', 'MODULE') NOT NULL;

-- AlterTable
ALTER TABLE `annualclassroom` DROP COLUMN `academic_year_id`,
    DROP COLUMN `classroom_acronym`,
    DROP COLUMN `classroom_code`,
    DROP COLUMN `classroom_name`,
    DROP COLUMN `registration_fee`,
    DROP COLUMN `total_fee_due`,
    ADD COLUMN `annual_major_id` VARCHAR(36) NOT NULL,
    ADD COLUMN `classroom_level` INTEGER NOT NULL,
    ADD COLUMN `number_of_divisions` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `annualclassroomaudit` DROP COLUMN `registration_fee`,
    DROP COLUMN `total_fee_due`,
    ADD COLUMN `number_of_divisions` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `annualconfigurator` ADD COLUMN `disabled_by` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `annualmajor` DROP COLUMN `major_code`;

-- AlterTable
ALTER TABLE `annualmajoraudit` DROP COLUMN `department_id`,
    DROP COLUMN `major_code`;

-- AlterTable
ALTER TABLE `annualminimummodulationscore` DROP PRIMARY KEY,
    DROP COLUMN `annual_minimummodulation_score_id`,
    DROP COLUMN `configured_at`,
    DROP COLUMN `configured_by`,
    ADD COLUMN `annual_minimum_modulation_score_id` VARCHAR(36) NOT NULL,
    ADD COLUMN `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
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
ALTER TABLE `annualregistry` DROP COLUMN `added_at`,
    DROP COLUMN `added_by`,
    ADD COLUMN `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `created_by` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `annualsemesterexamacess` DROP COLUMN `configured_at`,
    DROP COLUMN `configured_by`,
    ADD COLUMN `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `created_by` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `annualteacher` DROP COLUMN `teacher_id`;

-- AlterTable
ALTER TABLE `annualweighting` DROP COLUMN `configured_at`,
    DROP COLUMN `configured_by`,
    ADD COLUMN `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `created_by` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `assessment` DROP COLUMN `annual_credit_unit_subject_id`,
    ADD COLUMN `annual_subject_id` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `chapter` DROP COLUMN `annual_credit_unit_subject_id`,
    ADD COLUMN `annual_subject_id` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `classroom` DROP COLUMN `classroom_acronym`,
    DROP COLUMN `classroom_code`,
    DROP COLUMN `classroom_name`,
    DROP COLUMN `level`,
    ADD COLUMN `classroom_level` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `cycle` DROP COLUMN `cycle_type`,
    MODIFY `cycle_name` ENUM('HND', 'DUT', 'DTS', 'BACHELOR', 'MASTER', 'DOCTORATE') NOT NULL;

-- AlterTable
ALTER TABLE `department` DROP COLUMN `department_code`;

-- AlterTable
ALTER TABLE `departmentaudit` ADD COLUMN `department_acronym` VARCHAR(45) NOT NULL;

-- AlterTable
ALTER TABLE `evaluation` DROP COLUMN `annual_credit_unit_subject_id`,
    ADD COLUMN `annual_subject_id` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `log` ADD COLUMN `user_agent` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `login` DROP COLUMN `cookie_age`;

-- AlterTable
ALTER TABLE `loginaudit` DROP COLUMN `cookie_age`;

-- AlterTable
ALTER TABLE `major` DROP COLUMN `major_acronym`,
    DROP COLUMN `major_code`,
    DROP COLUMN `major_name`;

-- AlterTable
ALTER TABLE `majoraudit` DROP COLUMN `major_acronym`,
    DROP COLUMN `major_code`,
    DROP COLUMN `major_name`;

-- AlterTable
ALTER TABLE `payment` DROP COLUMN `annual_student_id`,
    DROP COLUMN `created_at`,
    DROP COLUMN `paid_by`,
    DROP COLUMN `payment_date`,
    DROP COLUMN `semester_number`,
    DROP COLUMN `transaction_id`,
    ADD COLUMN `payment_ref` VARCHAR(199) NOT NULL,
    ADD COLUMN `provider` ENUM('Stripe', 'NotchPay') NOT NULL,
    MODIFY `payment_reason` ENUM('Fee', 'Platform', 'Onboarding', 'Registration') NOT NULL;

-- AlterTable
ALTER TABLE `person` MODIFY `birthdate` DATETIME(0) NULL,
    MODIFY `national_id_number` VARCHAR(15) NULL;

-- AlterTable
ALTER TABLE `personaudit` MODIFY `birthdate` DATETIME(0) NULL,
    MODIFY `national_id_number` VARCHAR(15) NULL;

-- AlterTable
ALTER TABLE `presencelist` DROP COLUMN `annual_credit_unit_subject_id`,
    ADD COLUMN `annual_subject_id` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `resource` DROP COLUMN `annual_credit_unit_subject_id`,
    ADD COLUMN `annual_subject_id` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `school` DROP COLUMN `demanded_by`,
    ADD COLUMN `created_by` VARCHAR(36) NOT NULL,
    ADD COLUMN `deleted_at` DATETIME(0) NULL,
    ADD COLUMN `deleted_by` VARCHAR(36) NULL,
    ADD COLUMN `lead_funnel` VARCHAR(45) NOT NULL,
    ADD COLUMN `validated_at` DATETIME(0) NULL,
    ADD COLUMN `validated_by` VARCHAR(36) NULL,
    MODIFY `longitude` DOUBLE NULL,
    MODIFY `latitude` DOUBLE NULL;

-- AlterTable
ALTER TABLE `schoolaudit` DROP COLUMN `is_deleted`,
    DROP COLUMN `is_validated`,
    ADD COLUMN `school_id` VARCHAR(36) NOT NULL,
    MODIFY `longitude` DOUBLE NULL,
    MODIFY `latitude` DOUBLE NULL,
    MODIFY `audited_by` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `schooldemand` DROP COLUMN `demanded_at`,
    ADD COLUMN `ambassador_id` VARCHAR(36) NULL,
    ADD COLUMN `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `payment_id` VARCHAR(36) NULL,
    MODIFY `demand_status` ENUM('PENDING', 'PROCESSING', 'REJECTED', 'VALIDATED', 'SUSPENDED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `schooldemandaudit` ADD COLUMN `ambassador_id` VARCHAR(36) NULL,
    MODIFY `demand_status` ENUM('PENDING', 'PROCESSING', 'REJECTED', 'VALIDATED', 'SUSPENDED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `teacher` ADD COLUMN `login_id` VARCHAR(36) NOT NULL;

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
CREATE TABLE `Inquiry` (
    `inquiry_id` VARCHAR(36) NOT NULL,
    `email` VARCHAR(45) NOT NULL,
    `type` ENUM('Default', 'EarlyAccess') NOT NULL,
    `phone` VARCHAR(45) NULL,
    `name` VARCHAR(90) NULL,
    `message` TEXT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`inquiry_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlatformSettings` (
    `platform_settings_id` VARCHAR(36) NOT NULL,
    `platform_fee` DOUBLE NOT NULL DEFAULT 3300,
    `onboarding_fee` DOUBLE NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` VARCHAR(36) NULL,

    PRIMARY KEY (`platform_settings_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlatformSettingsAudit` (
    `platform_settings_audit_id` VARCHAR(36) NOT NULL,
    `onboarding_fee` DOUBLE NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `platform_settings_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`platform_settings_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `Ambassador` (
    `ambassador_id` VARCHAR(36) NOT NULL,
    `referral_code` VARCHAR(36) NOT NULL,
    `login_id` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `Ambassador_referral_code_key`(`referral_code`),
    PRIMARY KEY (`ambassador_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `StudentPayment` (
    `studentpayment_id` VARCHAR(36) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `payment_id` VARCHAR(45) NOT NULL,
    `semester_number` INTEGER NULL,
    `annual_student_id` VARCHAR(36) NOT NULL,
    `paid_by` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`studentpayment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE FULLTEXT INDEX `AnnualMajor_major_name_idx` ON `AnnualMajor`(`major_name`);

-- CreateIndex
CREATE FULLTEXT INDEX `AnnualMajor_major_name_major_acronym_idx` ON `AnnualMajor`(`major_name`, `major_acronym`);

-- CreateIndex
CREATE FULLTEXT INDEX `Department_department_name_idx` ON `Department`(`department_name`);

-- CreateIndex
CREATE FULLTEXT INDEX `Department_department_name_department_acronym_idx` ON `Department`(`department_name`, `department_acronym`);

-- CreateIndex
CREATE FULLTEXT INDEX `Person_first_name_last_name_idx` ON `Person`(`first_name`, `last_name`);

-- CreateIndex
CREATE FULLTEXT INDEX `Person_email_first_name_last_name_idx` ON `Person`(`email`, `first_name`, `last_name`);

-- CreateIndex
CREATE UNIQUE INDEX `ResetPassword_login_id_is_valid_key` ON `ResetPassword`(`login_id`, `is_valid`);

-- CreateIndex
CREATE FULLTEXT INDEX `School_school_name_idx` ON `School`(`school_name`);

-- CreateIndex
CREATE FULLTEXT INDEX `School_school_name_address_idx` ON `School`(`school_name`, `address`);

-- CreateIndex
CREATE UNIQUE INDEX `Student_login_id_classroom_id_key` ON `Student`(`login_id`, `classroom_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Teacher_login_id_key` ON `Teacher`(`login_id`);

-- AddForeignKey
ALTER TABLE `PlatformSettings` ADD CONSTRAINT `PlatformSettings_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlatformSettingsAudit` ADD CONSTRAINT `PlatformSettingsAudit_platform_settings_id_fkey` FOREIGN KEY (`platform_settings_id`) REFERENCES `PlatformSettings`(`platform_settings_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlatformSettingsAudit` ADD CONSTRAINT `PlatformSettingsAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `School` ADD CONSTRAINT `School_validated_by_fkey` FOREIGN KEY (`validated_by`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `School` ADD CONSTRAINT `School_deleted_by_fkey` FOREIGN KEY (`deleted_by`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `School` ADD CONSTRAINT `School_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `Person`(`person_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SchoolAudit` ADD CONSTRAINT `SchoolAudit_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `School`(`school_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SchoolAudit` ADD CONSTRAINT `SchoolAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE `Ambassador` ADD CONSTRAINT `Ambassador_login_id_fkey` FOREIGN KEY (`login_id`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SchoolDemand` ADD CONSTRAINT `SchoolDemand_payment_id_fkey` FOREIGN KEY (`payment_id`) REFERENCES `Payment`(`payment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SchoolDemand` ADD CONSTRAINT `SchoolDemand_ambassador_id_fkey` FOREIGN KEY (`ambassador_id`) REFERENCES `Ambassador`(`ambassador_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SchoolDemandAudit` ADD CONSTRAINT `SchoolDemandAudit_ambassador_id_fkey` FOREIGN KEY (`ambassador_id`) REFERENCES `Ambassador`(`ambassador_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualConfigurator` ADD CONSTRAINT `AnnualConfigurator_disabled_by_fkey` FOREIGN KEY (`disabled_by`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualRegistry` ADD CONSTRAINT `AnnualRegistry_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Teacher` ADD CONSTRAINT `Teacher_login_id_fkey` FOREIGN KEY (`login_id`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherAudit` ADD CONSTRAINT `TeacherAudit_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `Teacher`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualTeacher` ADD CONSTRAINT `AnnualTeacher_login_id_fkey` FOREIGN KEY (`login_id`) REFERENCES `Teacher`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualClassroom` ADD CONSTRAINT `AnnualClassroom_annual_major_id_fkey` FOREIGN KEY (`annual_major_id`) REFERENCES `AnnualMajor`(`annual_major_id`) ON DELETE CASCADE ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE `StudentPayment` ADD CONSTRAINT `StudentPayment_payment_id_fkey` FOREIGN KEY (`payment_id`) REFERENCES `Payment`(`payment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentPayment` ADD CONSTRAINT `StudentPayment_annual_student_id_fkey` FOREIGN KEY (`annual_student_id`) REFERENCES `AnnualStudent`(`annual_student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentPayment` ADD CONSTRAINT `StudentPayment_paid_by_fkey` FOREIGN KEY (`paid_by`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;
