-- AlterTable
ALTER TABLE `annualclassroom` MODIFY `total_fee_due` INTEGER NULL,
    MODIFY `registration_fee` INTEGER NULL;

-- AlterTable
ALTER TABLE `annualclassroomaudit` MODIFY `total_fee_due` INTEGER NULL,
    MODIFY `registration_fee` INTEGER NULL;
