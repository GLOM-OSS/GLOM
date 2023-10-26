/*
  Warnings:

  - Added the required column `type` to the `Inquiry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `inquiry` ADD COLUMN `type` ENUM('Default', 'EarlyAccess') NOT NULL;
