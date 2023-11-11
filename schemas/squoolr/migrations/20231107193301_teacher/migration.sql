/*
  Warnings:

  - You are about to drop the column `login_id` on the `annualteacher` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[teacher_id,academic_year_id]` on the table `AnnualTeacher` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[login_id]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `login_id` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `annualteacher` DROP FOREIGN KEY `AnnualTeacher_login_id_fkey`;

-- DropIndex
DROP INDEX `AnnualTeacher_login_id_academic_year_id_key` ON `annualteacher`;

-- AlterTable
ALTER TABLE `annualteacher` DROP COLUMN `login_id`;

-- AlterTable
ALTER TABLE `schooldemand` MODIFY `demand_status` ENUM('PENDING', 'PROCESSING', 'REJECTED', 'VALIDATED', 'SUSPENDED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `schooldemandaudit` MODIFY `demand_status` ENUM('PENDING', 'PROCESSING', 'REJECTED', 'VALIDATED', 'SUSPENDED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `teacher` ADD COLUMN `login_id` VARCHAR(36) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `AnnualTeacher_teacher_id_academic_year_id_key` ON `AnnualTeacher`(`teacher_id`, `academic_year_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Teacher_login_id_key` ON `Teacher`(`login_id`);

-- AddForeignKey
ALTER TABLE `Teacher` ADD CONSTRAINT `Teacher_login_id_fkey` FOREIGN KEY (`login_id`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;
