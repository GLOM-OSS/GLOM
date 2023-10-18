/*
  Warnings:

  - You are about to drop the column `lead_funnel` on the `person` table. All the data in the column will be lost.
  - You are about to alter the column `longitude` on the `school` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `latitude` on the `school` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `longitude` on the `schoolaudit` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `latitude` on the `schoolaudit` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - Added the required column `lead_funnel` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lead_funnel` to the `SchoolAudit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referral_code` to the `SchoolDemand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referral_code` to the `SchoolDemandAudit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `person` DROP COLUMN `lead_funnel`;

-- AlterTable
ALTER TABLE `school` ADD COLUMN `lead_funnel` VARCHAR(45) NOT NULL,
    MODIFY `longitude` DOUBLE NULL,
    MODIFY `latitude` DOUBLE NULL;

-- AlterTable
ALTER TABLE `schoolaudit` ADD COLUMN `lead_funnel` VARCHAR(45) NOT NULL,
    MODIFY `longitude` DOUBLE NULL,
    MODIFY `latitude` DOUBLE NULL;

-- AlterTable
ALTER TABLE `schooldemand` ADD COLUMN `paid_amount` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `referral_code` VARCHAR(45) NOT NULL;

-- AlterTable
ALTER TABLE `schooldemandaudit` ADD COLUMN `paid_amount` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `referral_code` VARCHAR(45) NOT NULL;
