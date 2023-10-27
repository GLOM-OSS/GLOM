-- CreateIndex
CREATE FULLTEXT INDEX `AnnualClassroom_classroom_name_idx` ON `AnnualClassroom`(`classroom_name`);

-- CreateIndex
CREATE FULLTEXT INDEX `AnnualClassroom_classroom_name_classroom_acronym_idx` ON `AnnualClassroom`(`classroom_name`, `classroom_acronym`);

-- CreateIndex
CREATE FULLTEXT INDEX `AnnualMajor_major_name_idx` ON `AnnualMajor`(`major_name`);

-- CreateIndex
CREATE FULLTEXT INDEX `AnnualMajor_major_name_major_acronym_idx` ON `AnnualMajor`(`major_name`, `major_acronym`);

-- CreateIndex
CREATE FULLTEXT INDEX `Classroom_classroom_name_idx` ON `Classroom`(`classroom_name`);

-- CreateIndex
CREATE FULLTEXT INDEX `Classroom_classroom_name_classroom_acronym_idx` ON `Classroom`(`classroom_name`, `classroom_acronym`);

-- CreateIndex
CREATE FULLTEXT INDEX `Department_department_name_idx` ON `Department`(`department_name`);

-- CreateIndex
CREATE FULLTEXT INDEX `Department_department_name_department_acronym_idx` ON `Department`(`department_name`, `department_acronym`);

-- CreateIndex
CREATE FULLTEXT INDEX `Major_major_name_idx` ON `Major`(`major_name`);

-- CreateIndex
CREATE FULLTEXT INDEX `Major_major_name_major_acronym_idx` ON `Major`(`major_name`, `major_acronym`);
