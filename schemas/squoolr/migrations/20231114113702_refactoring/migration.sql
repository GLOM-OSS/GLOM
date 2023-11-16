/*
  Warnings:

  - You are about to drop the column `added_at` on the `annualregistry` table. All the data in the column will be lost.
  - You are about to drop the column `added_by` on the `annualregistry` table. All the data in the column will be lost.
  - You are about to drop the column `demanded_by` on the `school` table. All the data in the column will be lost.
  - You are about to drop the column `demanded_at` on the `schooldemand` table. All the data in the column will be lost.
  - Added the required column `created_by` to the `AnnualRegistry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `annualregistry` DROP FOREIGN KEY `AnnualRegistry_added_by_fkey`;

-- DropForeignKey
ALTER TABLE `school` DROP FOREIGN KEY `School_demanded_by_fkey`;

-- AlterTable
ALTER TABLE `annualregistry` DROP COLUMN `added_at`,
    DROP COLUMN `added_by`,
    ADD COLUMN `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `created_by` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `school` DROP COLUMN `demanded_by`,
    ADD COLUMN `created_by` VARCHAR(36) NOT NULL DEFAULT '0d7d311c-e22b-4ffe-9dd8-c84db1ebb52e';

-- AlterTable
ALTER TABLE `schooldemand` DROP COLUMN `demanded_at`,
    ADD COLUMN `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AddForeignKey
ALTER TABLE `School` ADD CONSTRAINT `School_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `Person`(`person_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualRegistry` ADD CONSTRAINT `AnnualRegistry_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;
