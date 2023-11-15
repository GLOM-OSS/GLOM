/*
  Warnings:

  - You are about to drop the column `major_code` on the `annualmajor` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `AnnualMajor_major_code_academic_year_id_key` ON `annualmajor`;

-- AlterTable
ALTER TABLE `annualmajor` DROP COLUMN `major_code`;
