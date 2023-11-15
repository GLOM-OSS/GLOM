/*
  Warnings:

  - You are about to drop the column `major_code` on the `annualmajoraudit` table. All the data in the column will be lost.
  - You are about to drop the column `department_code` on the `department` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Department_department_code_key` ON `department`;

-- AlterTable
ALTER TABLE `annualmajoraudit` DROP COLUMN `major_code`;

-- AlterTable
ALTER TABLE `department` DROP COLUMN `department_code`;
