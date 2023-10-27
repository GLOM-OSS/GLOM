/*
  Warnings:

  - You are about to drop the column `annual_student_id` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `paid_by` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `payment_date` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `semester_number` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_id` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `paid_amount` on the `schooldemand` table. All the data in the column will be lost.
  - Added the required column `payment_ref` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_annual_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_paid_by_fkey`;

-- AlterTable
ALTER TABLE `payment` DROP COLUMN `annual_student_id`,
    DROP COLUMN `created_at`,
    DROP COLUMN `paid_by`,
    DROP COLUMN `payment_date`,
    DROP COLUMN `semester_number`,
    DROP COLUMN `transaction_id`,
    ADD COLUMN `payment_ref` VARCHAR(199) NOT NULL,
    ADD COLUMN `provider` ENUM('Stripe', 'NotchPay') NOT NULL,
    MODIFY `payment_reason` ENUM('Fee', 'Platform', 'Onboarding', 'Registration') NOT NULL;

-- AlterTable
ALTER TABLE `schooldemand` DROP COLUMN `paid_amount`,
    ADD COLUMN `payment_id` VARCHAR(36) NULL;

-- CreateTable
CREATE TABLE `StudentPayment` (
    `studentpayment_id` VARCHAR(36) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `payment_id` VARCHAR(45) NOT NULL,
    `semester_number` INTEGER NULL,
    `annual_student_id` VARCHAR(36) NOT NULL,
    `paid_by` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`studentpayment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SchoolDemand` ADD CONSTRAINT `SchoolDemand_payment_id_fkey` FOREIGN KEY (`payment_id`) REFERENCES `Payment`(`payment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentPayment` ADD CONSTRAINT `StudentPayment_payment_id_fkey` FOREIGN KEY (`payment_id`) REFERENCES `Payment`(`payment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentPayment` ADD CONSTRAINT `StudentPayment_annual_student_id_fkey` FOREIGN KEY (`annual_student_id`) REFERENCES `AnnualStudent`(`annual_student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentPayment` ADD CONSTRAINT `StudentPayment_paid_by_fkey` FOREIGN KEY (`paid_by`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;
