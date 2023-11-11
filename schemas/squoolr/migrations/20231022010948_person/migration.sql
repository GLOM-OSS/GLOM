-- AlterTable
ALTER TABLE `person` MODIFY `birthdate` DATETIME(0) NULL,
    MODIFY `national_id_number` VARCHAR(15) NULL;

-- AlterTable
ALTER TABLE `personaudit` MODIFY `birthdate` DATETIME(0) NULL,
    MODIFY `national_id_number` VARCHAR(15) NULL;
