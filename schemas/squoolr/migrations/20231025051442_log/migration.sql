/*
  Warnings:

  - Added the required column `user_agent` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `log` ADD COLUMN `user_agent` VARCHAR(191) NOT NULL;
