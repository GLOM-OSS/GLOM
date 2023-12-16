-- AddForeignKey
ALTER TABLE `AnnualSemesterExamAcess` ADD CONSTRAINT `AnnualSemesterExamAcess_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `AcademicYear`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;
