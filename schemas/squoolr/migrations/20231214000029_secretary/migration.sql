/*
 Warnings:
 
 - You are about to drop the column `school_code` on the `schoolaudit` table. All the data in the column will be lost.
 
 */
-- DropForeignKey
ALTER TABLE
  `resetpassword` DROP FOREIGN KEY `ResetPassword_login_id_fkey`;

-- DropIndex
ALTER TABLE
  `resetpassword` DROP INDEX `ResetPassword_login_id_is_valid_key`;

-- AlterTable
ALTER TABLE
  `annualteacheraudit`
ALTER COLUMN
  `has_signed_convention` DROP DEFAULT,
ALTER COLUMN
  `is_deleted` DROP DEFAULT;

-- AlterTable
ALTER TABLE
  `schoolaudit` DROP COLUMN `school_code`;