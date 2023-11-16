/*
  Warnings:

  - You are about to drop the column `configured_at` on the `annualacademicprofile` table. All the data in the column will be lost.
  - You are about to drop the column `configured_at` on the `annualminimummodulationscore` table. All the data in the column will be lost.
  - You are about to drop the column `configured_at` on the `annualsemesterexamacess` table. All the data in the column will be lost.
  - You are about to drop the column `configured_at` on the `annualweighting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `annualacademicprofile` DROP COLUMN `configured_at`,
    ADD COLUMN `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `annualminimummodulationscore` DROP COLUMN `configured_at`,
    ADD COLUMN `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `annualsemesterexamacess` DROP COLUMN `configured_at`,
    ADD COLUMN `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `annualweighting` DROP COLUMN `configured_at`,
    ADD COLUMN `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);
