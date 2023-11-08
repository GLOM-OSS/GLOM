/*
  Warnings:

  - You are about to drop the column `department_id` on the `annualmajoraudit` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `annualmajoraudit` DROP FOREIGN KEY `AnnualMajorAudit_department_id_fkey`;

-- AlterTable
ALTER TABLE `annualmajoraudit` DROP COLUMN `department_id`;
