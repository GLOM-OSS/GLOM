/*
  Warnings:

  - You are about to drop the column `academic_year_id` on the `annualclassroom` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[classroom_code,annual_major_id]` on the table `AnnualClassroom` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `annual_major_id` to the `AnnualClassroom` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `annualclassroom` DROP FOREIGN KEY `AnnualClassroom_academic_year_id_fkey`;

-- DropIndex
DROP INDEX `AnnualClassroom_classroom_code_academic_year_id_key` ON `annualclassroom`;

-- AlterTable
ALTER TABLE `annualclassroom` DROP COLUMN `academic_year_id`,
    ADD COLUMN `annual_major_id` VARCHAR(36) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `AnnualClassroom_classroom_code_annual_major_id_key` ON `AnnualClassroom`(`classroom_code`, `annual_major_id`);

-- AddForeignKey
ALTER TABLE `AnnualClassroom` ADD CONSTRAINT `AnnualClassroom_annual_major_id_fkey` FOREIGN KEY (`annual_major_id`) REFERENCES `AnnualMajor`(`annual_major_id`) ON DELETE CASCADE ON UPDATE CASCADE;
