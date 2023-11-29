/*
  Warnings:

  - You are about to drop the column `classroom_acronym` on the `annualclassroom` table. All the data in the column will be lost.
  - You are about to drop the column `classroom_code` on the `annualclassroom` table. All the data in the column will be lost.
  - You are about to drop the column `classroom_name` on the `annualclassroom` table. All the data in the column will be lost.
  - You are about to drop the column `classroom_acronym` on the `classroom` table. All the data in the column will be lost.
  - You are about to drop the column `classroom_code` on the `classroom` table. All the data in the column will be lost.
  - You are about to drop the column `classroom_name` on the `classroom` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `classroom` table. All the data in the column will be lost.
  - You are about to drop the column `major_acronym` on the `major` table. All the data in the column will be lost.
  - You are about to drop the column `major_code` on the `major` table. All the data in the column will be lost.
  - You are about to drop the column `major_name` on the `major` table. All the data in the column will be lost.
  - You are about to drop the column `major_acronym` on the `majoraudit` table. All the data in the column will be lost.
  - You are about to drop the column `major_code` on the `majoraudit` table. All the data in the column will be lost.
  - You are about to drop the column `major_name` on the `majoraudit` table. All the data in the column will be lost.
  - Added the required column `classroom_level` to the `AnnualClassroom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number_of_divisions` to the `AnnualClassroom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classroom_level` to the `AnnualClassroomAudit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number_of_divisions` to the `AnnualClassroomAudit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classroom_level` to the `Classroom` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `AnnualClassroom_classroom_code_annual_major_id_key` ON `annualclassroom`;

-- DropIndex
DROP INDEX `AnnualClassroom_classroom_name_classroom_acronym_idx` ON `annualclassroom`;

-- DropIndex
DROP INDEX `AnnualClassroom_classroom_name_idx` ON `annualclassroom`;

-- DropIndex
DROP INDEX `Classroom_classroom_code_key` ON `classroom`;

-- DropIndex
DROP INDEX `Classroom_classroom_name_classroom_acronym_idx` ON `classroom`;

-- DropIndex
DROP INDEX `Classroom_classroom_name_idx` ON `classroom`;

-- DropIndex
DROP INDEX `Major_major_code_key` ON `major`;

-- DropIndex
DROP INDEX `Major_major_name_idx` ON `major`;

-- DropIndex
DROP INDEX `Major_major_name_major_acronym_idx` ON `major`;

-- DropIndex
DROP INDEX `MajorAudit_major_code_key` ON `majoraudit`;

-- AlterTable
ALTER TABLE `annualclassroom` DROP COLUMN `classroom_acronym`,
    DROP COLUMN `classroom_code`,
    DROP COLUMN `classroom_name`,
    ADD COLUMN `classroom_level` INTEGER NOT NULL,
    ADD COLUMN `number_of_divisions` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `annualclassroomaudit` ADD COLUMN `classroom_level` INTEGER NOT NULL,
    ADD COLUMN `number_of_divisions` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `classroom` DROP COLUMN `classroom_acronym`,
    DROP COLUMN `classroom_code`,
    DROP COLUMN `classroom_name`,
    DROP COLUMN `level`,
    ADD COLUMN `classroom_level` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `major` DROP COLUMN `major_acronym`,
    DROP COLUMN `major_code`,
    DROP COLUMN `major_name`;

-- AlterTable
ALTER TABLE `majoraudit` DROP COLUMN `major_acronym`,
    DROP COLUMN `major_code`,
    DROP COLUMN `major_name`;
