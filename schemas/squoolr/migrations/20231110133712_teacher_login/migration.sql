/*
  Warnings:

  - You are about to drop the column `teacher_id` on the `annualteacher` table. All the data in the column will be lost.
  - The primary key for the `teacher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `teacher_id` on the `teacher` table. All the data in the column will be lost.
  - You are about to drop the column `teacher_id` on the `teacheraudit` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[login_id,academic_year_id]` on the table `AnnualTeacher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `login_id` to the `AnnualTeacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `login_id` to the `TeacherAudit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `annualteacher` DROP FOREIGN KEY `AnnualTeacher_teacher_id_fkey`;

-- DropForeignKey
ALTER TABLE `teacheraudit` DROP FOREIGN KEY `TeacherAudit_teacher_id_fkey`;

-- DropIndex
DROP INDEX `AnnualTeacher_teacher_id_academic_year_id_key` ON `annualteacher`;

-- AlterTable
ALTER TABLE `annualteacher` DROP COLUMN `teacher_id`,
    ADD COLUMN `login_id` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `teacher` DROP PRIMARY KEY,
    DROP COLUMN `teacher_id`;

-- AlterTable
ALTER TABLE `teacheraudit` DROP COLUMN `teacher_id`,
    ADD COLUMN `login_id` VARCHAR(36) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `AnnualTeacher_login_id_academic_year_id_key` ON `AnnualTeacher`(`login_id`, `academic_year_id`);

-- AddForeignKey
ALTER TABLE `TeacherAudit` ADD CONSTRAINT `TeacherAudit_login_id_fkey` FOREIGN KEY (`login_id`) REFERENCES `Teacher`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualTeacher` ADD CONSTRAINT `AnnualTeacher_login_id_fkey` FOREIGN KEY (`login_id`) REFERENCES `Teacher`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;
