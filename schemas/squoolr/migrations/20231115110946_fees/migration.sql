/*
  Warnings:

  - You are about to drop the column `registration_fee` on the `annualclassroom` table. All the data in the column will be lost.
  - You are about to drop the column `total_fee_due` on the `annualclassroom` table. All the data in the column will be lost.
  - You are about to drop the column `registration_fee` on the `annualclassroomaudit` table. All the data in the column will be lost.
  - You are about to drop the column `total_fee_due` on the `annualclassroomaudit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `annualclassroom` DROP COLUMN `registration_fee`,
    DROP COLUMN `total_fee_due`;

-- AlterTable
ALTER TABLE `annualclassroomaudit` DROP COLUMN `registration_fee`,
    DROP COLUMN `total_fee_due`;
