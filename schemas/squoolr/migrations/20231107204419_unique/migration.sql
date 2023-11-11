/*
  Warnings:

  - A unique constraint covering the columns `[login_id,classroom_id]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `AnnualConfigurator_login_id_matricule_key` ON `annualconfigurator`;

-- DropIndex
DROP INDEX `Student_matricule_key` ON `student`;

-- DropIndex
DROP INDEX `Teacher_matricule_key` ON `teacher`;

-- CreateIndex
CREATE UNIQUE INDEX `Student_login_id_classroom_id_key` ON `Student`(`login_id`, `classroom_id`);
