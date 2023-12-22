/*
  Warnings:

  - A unique constraint covering the columns `[year_code,school_id]` on the table `AcademicYear` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `AcademicYear_year_code_key` ON `AcademicYear`;

-- CreateIndex
CREATE UNIQUE INDEX `AcademicYear_year_code_school_id_key` ON `AcademicYear`(`year_code`, `school_id`);
