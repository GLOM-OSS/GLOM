/*
  Warnings:

  - Added the required column `department_acronym` to the `DepartmentAudit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `departmentaudit` ADD COLUMN `department_acronym` VARCHAR(45) NOT NULL;
