/*
  Warnings:

  - You are about to drop the `AcademicYear` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ambassador` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualAcademicProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualAcademicProfileAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualCarryOverSytem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualCarryOverSytemAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualClassroom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualClassroomAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualClassroomDivision` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualClassroomDivisionAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualConfigurator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualDocumentSigner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualEvaluationSubType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualEvaluationSubTypeAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualEvaluationTypeWeighting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualEvaluationTypeWeightingAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualGradeWeighting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualGradeWeightingAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualMajor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualMajorAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualMinimumModulationScore` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualMinimumModulationScoreAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualModule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualModuleAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualRegistry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualRegistryAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualSchoolSetting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualSchoolSettingAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualSemesterExamAcess` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualSemesterExamAcessAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualStudent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualStudentAnswerQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualStudentAnswerQuestionAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualStudentHasModule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualStudentTakeAssessment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualSubject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualSubjectAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualSubjectPart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualSubjectPartAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualTeacher` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualTeacherAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualWeighting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AnnualWeightingAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Assessment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AssessmentAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AssignmentGroupMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Chapter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChapterAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Classroom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cycle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Department` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DepartmentAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Evaluation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EvaluationAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EvaluationHasStudent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EvaluationHasStudentAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EvaluationType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Grade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Inquiry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Login` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LoginAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Major` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MajorAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Person` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PersonAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlatformSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlatformSettingsAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PresenceList` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PresenceListAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PresenceListHasChapter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PresenceListHasModuleStudent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuestionAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuestionOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuestionOptionAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuestionResource` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResetPassword` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Resource` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RessourceAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `School` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SchoolAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SchoolDemand` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SchoolDemandAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentPayment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubjectPart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Teacher` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeacherAudit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeacherType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeachingGrade` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `AcademicYear` DROP FOREIGN KEY `AcademicYear_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `AcademicYear` DROP FOREIGN KEY `AcademicYear_school_id_fkey`;

-- DropForeignKey
ALTER TABLE `Ambassador` DROP FOREIGN KEY `Ambassador_login_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualAcademicProfile` DROP FOREIGN KEY `AnnualAcademicProfile_academic_year_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualAcademicProfile` DROP FOREIGN KEY `AnnualAcademicProfile_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualAcademicProfileAudit` DROP FOREIGN KEY `AnnualAcademicProfileAudit_annual_academic_profile_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualAcademicProfileAudit` DROP FOREIGN KEY `AnnualAcademicProfileAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualCarryOverSytem` DROP FOREIGN KEY `AnnualCarryOverSytem_academic_year_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualCarryOverSytem` DROP FOREIGN KEY `AnnualCarryOverSytem_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualCarryOverSytemAudit` DROP FOREIGN KEY `AnnualCarryOverSytemAudit_annual_carry_over_system_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualCarryOverSytemAudit` DROP FOREIGN KEY `AnnualCarryOverSytemAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualClassroom` DROP FOREIGN KEY `AnnualClassroom_annual_major_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualClassroom` DROP FOREIGN KEY `AnnualClassroom_classroom_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualClassroomAudit` DROP FOREIGN KEY `AnnualClassroomAudit_annual_classroom_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualClassroomAudit` DROP FOREIGN KEY `AnnualClassroomAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualClassroomDivision` DROP FOREIGN KEY `AnnualClassroomDivision_annual_classroom_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualClassroomDivision` DROP FOREIGN KEY `AnnualClassroomDivision_annual_coordinator_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualClassroomDivision` DROP FOREIGN KEY `AnnualClassroomDivision_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualClassroomDivisionAudit` DROP FOREIGN KEY `AnnualClassroomDivisionAudit_annual_classroom_division_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualClassroomDivisionAudit` DROP FOREIGN KEY `AnnualClassroomDivisionAudit_annual_coordinator_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualClassroomDivisionAudit` DROP FOREIGN KEY `AnnualClassroomDivisionAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualConfigurator` DROP FOREIGN KEY `AnnualConfigurator_academic_year_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualConfigurator` DROP FOREIGN KEY `AnnualConfigurator_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualConfigurator` DROP FOREIGN KEY `AnnualConfigurator_deleted_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualConfigurator` DROP FOREIGN KEY `AnnualConfigurator_disabled_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualConfigurator` DROP FOREIGN KEY `AnnualConfigurator_login_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualDocumentSigner` DROP FOREIGN KEY `AnnualDocumentSigner_annual_school_setting_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualDocumentSigner` DROP FOREIGN KEY `AnnualDocumentSigner_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualDocumentSigner` DROP FOREIGN KEY `AnnualDocumentSigner_deleted_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualEvaluationSubType` DROP FOREIGN KEY `AnnualEvaluationSubType_academic_year_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualEvaluationSubType` DROP FOREIGN KEY `AnnualEvaluationSubType_evaluation_type_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualEvaluationSubTypeAudit` DROP FOREIGN KEY `AnnualEvaluationSubTypeAudit_annual_evaluation_sub_type_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualEvaluationTypeWeighting` DROP FOREIGN KEY `AnnualEvaluationTypeWeighting_academic_year_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualEvaluationTypeWeighting` DROP FOREIGN KEY `AnnualEvaluationTypeWeighting_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualEvaluationTypeWeighting` DROP FOREIGN KEY `AnnualEvaluationTypeWeighting_cycle_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualEvaluationTypeWeighting` DROP FOREIGN KEY `AnnualEvaluationTypeWeighting_evaluation_type_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualEvaluationTypeWeightingAudit` DROP FOREIGN KEY `AnnualEvaluationTypeWeightingAudit_annual_evaluation_type_w_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualEvaluationTypeWeightingAudit` DROP FOREIGN KEY `AnnualEvaluationTypeWeightingAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualGradeWeighting` DROP FOREIGN KEY `AnnualGradeWeighting_academic_year_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualGradeWeighting` DROP FOREIGN KEY `AnnualGradeWeighting_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualGradeWeighting` DROP FOREIGN KEY `AnnualGradeWeighting_cycle_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualGradeWeighting` DROP FOREIGN KEY `AnnualGradeWeighting_grade_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualGradeWeightingAudit` DROP FOREIGN KEY `AnnualGradeWeightingAudit_annual_grade_weighting_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualGradeWeightingAudit` DROP FOREIGN KEY `AnnualGradeWeightingAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualGradeWeightingAudit` DROP FOREIGN KEY `AnnualGradeWeightingAudit_grade_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualMajor` DROP FOREIGN KEY `AnnualMajor_academic_year_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualMajor` DROP FOREIGN KEY `AnnualMajor_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualMajor` DROP FOREIGN KEY `AnnualMajor_department_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualMajor` DROP FOREIGN KEY `AnnualMajor_major_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualMajorAudit` DROP FOREIGN KEY `AnnualMajorAudit_annual_major_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualMajorAudit` DROP FOREIGN KEY `AnnualMajorAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualMinimumModulationScore` DROP FOREIGN KEY `AnnualMinimumModulationScore_academic_year_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualMinimumModulationScore` DROP FOREIGN KEY `AnnualMinimumModulationScore_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualMinimumModulationScore` DROP FOREIGN KEY `AnnualMinimumModulationScore_cycle_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualMinimumModulationScoreAudit` DROP FOREIGN KEY `AnnualMinimumModulationScoreAudit_annual_minimum_modulation_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualMinimumModulationScoreAudit` DROP FOREIGN KEY `AnnualMinimumModulationScoreAudit_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualModule` DROP FOREIGN KEY `AnnualModule_academic_year_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualModule` DROP FOREIGN KEY `AnnualModule_annual_major_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualModule` DROP FOREIGN KEY `AnnualModule_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualModuleAudit` DROP FOREIGN KEY `AnnualModuleAudit_annual_module_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualModuleAudit` DROP FOREIGN KEY `AnnualModuleAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualRegistry` DROP FOREIGN KEY `AnnualRegistry_academic_year_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualRegistry` DROP FOREIGN KEY `AnnualRegistry_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualRegistry` DROP FOREIGN KEY `AnnualRegistry_login_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualRegistryAudit` DROP FOREIGN KEY `AnnualRegistryAudit_annual_registry_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualRegistryAudit` DROP FOREIGN KEY `AnnualRegistryAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualSchoolSetting` DROP FOREIGN KEY `AnnualSchoolSetting_academic_year_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualSchoolSetting` DROP FOREIGN KEY `AnnualSchoolSetting_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualSchoolSettingAudit` DROP FOREIGN KEY `AnnualSchoolSettingAudit_annual_school_setting_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualSchoolSettingAudit` DROP FOREIGN KEY `AnnualSchoolSettingAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualSemesterExamAcess` DROP FOREIGN KEY `AnnualSemesterExamAcess_academic_year_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualSemesterExamAcess` DROP FOREIGN KEY `AnnualSemesterExamAcess_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualSemesterExamAcessAudit` DROP FOREIGN KEY `AnnualSemesterExamAcessAudit_annual_semester_exam_access_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualSemesterExamAcessAudit` DROP FOREIGN KEY `AnnualSemesterExamAcessAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualStudent` DROP FOREIGN KEY `AnnualStudent_academic_year_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualStudent` DROP FOREIGN KEY `AnnualStudent_annual_classroom_division_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualStudent` DROP FOREIGN KEY `AnnualStudent_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualStudentAnswerQuestion` DROP FOREIGN KEY `AnnualStudentAnswerQuestion_annual_student_take_assessment__fkey`;

-- DropForeignKey
ALTER TABLE `AnnualStudentAnswerQuestion` DROP FOREIGN KEY `AnnualStudentAnswerQuestion_answered_option_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualStudentAnswerQuestion` DROP FOREIGN KEY `AnnualStudentAnswerQuestion_corrected_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualStudentAnswerQuestion` DROP FOREIGN KEY `AnnualStudentAnswerQuestion_question_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualStudentAnswerQuestionAudit` DROP FOREIGN KEY `AnnualStudentAnswerQuestionAudit_annual_student_answer_ques_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualStudentAnswerQuestionAudit` DROP FOREIGN KEY `AnnualStudentAnswerQuestionAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualStudentAnswerQuestionAudit` DROP FOREIGN KEY `AnnualStudentAnswerQuestionAudit_previous_auditer_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualStudentHasModule` DROP FOREIGN KEY `AnnualStudentHasModule_annual_module_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualStudentHasModule` DROP FOREIGN KEY `AnnualStudentHasModule_annual_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualStudentTakeAssessment` DROP FOREIGN KEY `AnnualStudentTakeAssessment_annual_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualStudentTakeAssessment` DROP FOREIGN KEY `AnnualStudentTakeAssessment_assessment_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualSubject` DROP FOREIGN KEY `AnnualSubject_annual_module_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualSubject` DROP FOREIGN KEY `AnnualSubject_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualSubjectAudit` DROP FOREIGN KEY `AnnualSubjectAudit_annual_subject_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualSubjectAudit` DROP FOREIGN KEY `AnnualSubjectAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualSubjectPart` DROP FOREIGN KEY `AnnualSubjectPart_annual_subject_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualSubjectPart` DROP FOREIGN KEY `AnnualSubjectPart_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualSubjectPart` DROP FOREIGN KEY `AnnualSubjectPart_subject_part_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualSubjectPartAudit` DROP FOREIGN KEY `AnnualSubjectPartAudit_annual_subject_part_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualSubjectPartAudit` DROP FOREIGN KEY `AnnualSubjectPartAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualTeacher` DROP FOREIGN KEY `AnnualTeacher_academic_year_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualTeacher` DROP FOREIGN KEY `AnnualTeacher_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualTeacher` DROP FOREIGN KEY `AnnualTeacher_login_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualTeacher` DROP FOREIGN KEY `AnnualTeacher_teaching_grade_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualTeacherAudit` DROP FOREIGN KEY `AnnualTeacherAudit_annual_teacher_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualTeacherAudit` DROP FOREIGN KEY `AnnualTeacherAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualWeighting` DROP FOREIGN KEY `AnnualWeighting_academic_year_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualWeighting` DROP FOREIGN KEY `AnnualWeighting_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualWeightingAudit` DROP FOREIGN KEY `AnnualWeightingAudit_annual_weighting_id_fkey`;

-- DropForeignKey
ALTER TABLE `AnnualWeightingAudit` DROP FOREIGN KEY `AnnualWeightingAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `Assessment` DROP FOREIGN KEY `Assessment_annual_subject_id_fkey`;

-- DropForeignKey
ALTER TABLE `Assessment` DROP FOREIGN KEY `Assessment_chapter_id_fkey`;

-- DropForeignKey
ALTER TABLE `Assessment` DROP FOREIGN KEY `Assessment_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `Assessment` DROP FOREIGN KEY `Assessment_evaluation_id_fkey`;

-- DropForeignKey
ALTER TABLE `AssessmentAudit` DROP FOREIGN KEY `AssessmentAudit_assessment_id_fkey`;

-- DropForeignKey
ALTER TABLE `AssessmentAudit` DROP FOREIGN KEY `AssessmentAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `AssignmentGroupMember` DROP FOREIGN KEY `AssignmentGroupMember_annual_student_take_assessment_id_fkey`;

-- DropForeignKey
ALTER TABLE `AssignmentGroupMember` DROP FOREIGN KEY `AssignmentGroupMember_assessment_id_fkey`;

-- DropForeignKey
ALTER TABLE `Chapter` DROP FOREIGN KEY `Chapter_annual_subject_id_fkey`;

-- DropForeignKey
ALTER TABLE `Chapter` DROP FOREIGN KEY `Chapter_chapter_parent_id_fkey`;

-- DropForeignKey
ALTER TABLE `Chapter` DROP FOREIGN KEY `Chapter_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `ChapterAudit` DROP FOREIGN KEY `ChapterAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `ChapterAudit` DROP FOREIGN KEY `ChapterAudit_chapter_id_fkey`;

-- DropForeignKey
ALTER TABLE `Classroom` DROP FOREIGN KEY `Classroom_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `Classroom` DROP FOREIGN KEY `Classroom_major_id_fkey`;

-- DropForeignKey
ALTER TABLE `Department` DROP FOREIGN KEY `Department_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `Department` DROP FOREIGN KEY `Department_school_id_fkey`;

-- DropForeignKey
ALTER TABLE `DepartmentAudit` DROP FOREIGN KEY `DepartmentAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `DepartmentAudit` DROP FOREIGN KEY `DepartmentAudit_department_id_fkey`;

-- DropForeignKey
ALTER TABLE `Evaluation` DROP FOREIGN KEY `Evaluation_annual_evaluation_sub_type_id_fkey`;

-- DropForeignKey
ALTER TABLE `Evaluation` DROP FOREIGN KEY `Evaluation_annual_subject_id_fkey`;

-- DropForeignKey
ALTER TABLE `Evaluation` DROP FOREIGN KEY `Evaluation_anonimated_by_fkey`;

-- DropForeignKey
ALTER TABLE `Evaluation` DROP FOREIGN KEY `Evaluation_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `Evaluation` DROP FOREIGN KEY `Evaluation_published_by_fkey`;

-- DropForeignKey
ALTER TABLE `EvaluationAudit` DROP FOREIGN KEY `EvaluationAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `EvaluationAudit` DROP FOREIGN KEY `EvaluationAudit_evaluation_id_fkey`;

-- DropForeignKey
ALTER TABLE `EvaluationHasStudent` DROP FOREIGN KEY `EvaluationHasStudent_annual_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `EvaluationHasStudent` DROP FOREIGN KEY `EvaluationHasStudent_evaluation_id_fkey`;

-- DropForeignKey
ALTER TABLE `EvaluationHasStudent` DROP FOREIGN KEY `EvaluationHasStudent_ref_evaluation_has_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `EvaluationHasStudentAudit` DROP FOREIGN KEY `EvaluationHasStudentAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `EvaluationHasStudentAudit` DROP FOREIGN KEY `EvaluationHasStudentAudit_evaluation_has_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `Log` DROP FOREIGN KEY `Log_login_id_fkey`;

-- DropForeignKey
ALTER TABLE `Login` DROP FOREIGN KEY `Login_person_id_fkey`;

-- DropForeignKey
ALTER TABLE `Login` DROP FOREIGN KEY `Login_school_id_fkey`;

-- DropForeignKey
ALTER TABLE `LoginAudit` DROP FOREIGN KEY `LoginAudit_login_id_fkey`;

-- DropForeignKey
ALTER TABLE `Major` DROP FOREIGN KEY `Major_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `Major` DROP FOREIGN KEY `Major_cycle_id_fkey`;

-- DropForeignKey
ALTER TABLE `MajorAudit` DROP FOREIGN KEY `MajorAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `MajorAudit` DROP FOREIGN KEY `MajorAudit_cycle_id_fkey`;

-- DropForeignKey
ALTER TABLE `MajorAudit` DROP FOREIGN KEY `MajorAudit_major_id_fkey`;

-- DropForeignKey
ALTER TABLE `PersonAudit` DROP FOREIGN KEY `PersonAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `PersonAudit` DROP FOREIGN KEY `PersonAudit_person_id_fkey`;

-- DropForeignKey
ALTER TABLE `PlatformSettings` DROP FOREIGN KEY `PlatformSettings_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `PlatformSettingsAudit` DROP FOREIGN KEY `PlatformSettingsAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `PlatformSettingsAudit` DROP FOREIGN KEY `PlatformSettingsAudit_platform_settings_id_fkey`;

-- DropForeignKey
ALTER TABLE `PresenceList` DROP FOREIGN KEY `PresenceList_annual_subject_id_fkey`;

-- DropForeignKey
ALTER TABLE `PresenceListAudit` DROP FOREIGN KEY `PresenceListAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `PresenceListAudit` DROP FOREIGN KEY `PresenceListAudit_presence_list_id_fkey`;

-- DropForeignKey
ALTER TABLE `PresenceListHasChapter` DROP FOREIGN KEY `PresenceListHasChapter_chapter_id_fkey`;

-- DropForeignKey
ALTER TABLE `PresenceListHasChapter` DROP FOREIGN KEY `PresenceListHasChapter_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `PresenceListHasChapter` DROP FOREIGN KEY `PresenceListHasChapter_deleted_by_fkey`;

-- DropForeignKey
ALTER TABLE `PresenceListHasChapter` DROP FOREIGN KEY `PresenceListHasChapter_presence_list_id_fkey`;

-- DropForeignKey
ALTER TABLE `PresenceListHasModuleStudent` DROP FOREIGN KEY `PresenceListHasModuleStudent_annual_student_has_module_id_fkey`;

-- DropForeignKey
ALTER TABLE `PresenceListHasModuleStudent` DROP FOREIGN KEY `PresenceListHasModuleStudent_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `PresenceListHasModuleStudent` DROP FOREIGN KEY `PresenceListHasModuleStudent_deleted_by_fkey`;

-- DropForeignKey
ALTER TABLE `PresenceListHasModuleStudent` DROP FOREIGN KEY `PresenceListHasModuleStudent_presence_list_id_fkey`;

-- DropForeignKey
ALTER TABLE `Question` DROP FOREIGN KEY `Question_assessment_id_fkey`;

-- DropForeignKey
ALTER TABLE `Question` DROP FOREIGN KEY `Question_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `QuestionAudit` DROP FOREIGN KEY `QuestionAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `QuestionAudit` DROP FOREIGN KEY `QuestionAudit_question_id_fkey`;

-- DropForeignKey
ALTER TABLE `QuestionOption` DROP FOREIGN KEY `QuestionOption_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `QuestionOption` DROP FOREIGN KEY `QuestionOption_question_id_fkey`;

-- DropForeignKey
ALTER TABLE `QuestionOptionAudit` DROP FOREIGN KEY `QuestionOptionAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `QuestionOptionAudit` DROP FOREIGN KEY `QuestionOptionAudit_question_option_id_fkey`;

-- DropForeignKey
ALTER TABLE `QuestionResource` DROP FOREIGN KEY `QuestionResource_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `QuestionResource` DROP FOREIGN KEY `QuestionResource_deleted_by_fkey`;

-- DropForeignKey
ALTER TABLE `QuestionResource` DROP FOREIGN KEY `QuestionResource_question_id_fkey`;

-- DropForeignKey
ALTER TABLE `ResetPassword` DROP FOREIGN KEY `ResetPassword_generated_by_admin_fkey`;

-- DropForeignKey
ALTER TABLE `ResetPassword` DROP FOREIGN KEY `ResetPassword_generated_by_confiigurator_fkey`;

-- DropForeignKey
ALTER TABLE `ResetPassword` DROP FOREIGN KEY `ResetPassword_login_id_fkey`;

-- DropForeignKey
ALTER TABLE `Resource` DROP FOREIGN KEY `Resource_annual_subject_id_fkey`;

-- DropForeignKey
ALTER TABLE `Resource` DROP FOREIGN KEY `Resource_chapter_id_fkey`;

-- DropForeignKey
ALTER TABLE `Resource` DROP FOREIGN KEY `Resource_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `RessourceAudit` DROP FOREIGN KEY `RessourceAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `RessourceAudit` DROP FOREIGN KEY `RessourceAudit_resource_id_fkey`;

-- DropForeignKey
ALTER TABLE `School` DROP FOREIGN KEY `School_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `School` DROP FOREIGN KEY `School_deleted_by_fkey`;

-- DropForeignKey
ALTER TABLE `School` DROP FOREIGN KEY `School_validated_by_fkey`;

-- DropForeignKey
ALTER TABLE `SchoolAudit` DROP FOREIGN KEY `SchoolAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `SchoolAudit` DROP FOREIGN KEY `SchoolAudit_school_id_fkey`;

-- DropForeignKey
ALTER TABLE `SchoolDemand` DROP FOREIGN KEY `SchoolDemand_ambassador_id_fkey`;

-- DropForeignKey
ALTER TABLE `SchoolDemand` DROP FOREIGN KEY `SchoolDemand_payment_id_fkey`;

-- DropForeignKey
ALTER TABLE `SchoolDemand` DROP FOREIGN KEY `SchoolDemand_school_id_fkey`;

-- DropForeignKey
ALTER TABLE `SchoolDemandAudit` DROP FOREIGN KEY `SchoolDemandAudit_ambassador_id_fkey`;

-- DropForeignKey
ALTER TABLE `SchoolDemandAudit` DROP FOREIGN KEY `SchoolDemandAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `SchoolDemandAudit` DROP FOREIGN KEY `SchoolDemandAudit_school_demand_id_fkey`;

-- DropForeignKey
ALTER TABLE `Student` DROP FOREIGN KEY `Student_classroom_id_fkey`;

-- DropForeignKey
ALTER TABLE `Student` DROP FOREIGN KEY `Student_login_id_fkey`;

-- DropForeignKey
ALTER TABLE `Student` DROP FOREIGN KEY `Student_tutor_id_fkey`;

-- DropForeignKey
ALTER TABLE `StudentPayment` DROP FOREIGN KEY `StudentPayment_annual_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `StudentPayment` DROP FOREIGN KEY `StudentPayment_paid_by_fkey`;

-- DropForeignKey
ALTER TABLE `StudentPayment` DROP FOREIGN KEY `StudentPayment_payment_id_fkey`;

-- DropForeignKey
ALTER TABLE `Teacher` DROP FOREIGN KEY `Teacher_login_id_fkey`;

-- DropForeignKey
ALTER TABLE `Teacher` DROP FOREIGN KEY `Teacher_teacher_type_id_fkey`;

-- DropForeignKey
ALTER TABLE `TeacherAudit` DROP FOREIGN KEY `TeacherAudit_audited_by_fkey`;

-- DropForeignKey
ALTER TABLE `TeacherAudit` DROP FOREIGN KEY `TeacherAudit_teacher_id_fkey`;

-- DropForeignKey
ALTER TABLE `TeacherAudit` DROP FOREIGN KEY `TeacherAudit_teacher_type_id_fkey`;

-- DropTable
DROP TABLE `AcademicYear`;

-- DropTable
DROP TABLE `Ambassador`;

-- DropTable
DROP TABLE `AnnualAcademicProfile`;

-- DropTable
DROP TABLE `AnnualAcademicProfileAudit`;

-- DropTable
DROP TABLE `AnnualCarryOverSytem`;

-- DropTable
DROP TABLE `AnnualCarryOverSytemAudit`;

-- DropTable
DROP TABLE `AnnualClassroom`;

-- DropTable
DROP TABLE `AnnualClassroomAudit`;

-- DropTable
DROP TABLE `AnnualClassroomDivision`;

-- DropTable
DROP TABLE `AnnualClassroomDivisionAudit`;

-- DropTable
DROP TABLE `AnnualConfigurator`;

-- DropTable
DROP TABLE `AnnualDocumentSigner`;

-- DropTable
DROP TABLE `AnnualEvaluationSubType`;

-- DropTable
DROP TABLE `AnnualEvaluationSubTypeAudit`;

-- DropTable
DROP TABLE `AnnualEvaluationTypeWeighting`;

-- DropTable
DROP TABLE `AnnualEvaluationTypeWeightingAudit`;

-- DropTable
DROP TABLE `AnnualGradeWeighting`;

-- DropTable
DROP TABLE `AnnualGradeWeightingAudit`;

-- DropTable
DROP TABLE `AnnualMajor`;

-- DropTable
DROP TABLE `AnnualMajorAudit`;

-- DropTable
DROP TABLE `AnnualMinimumModulationScore`;

-- DropTable
DROP TABLE `AnnualMinimumModulationScoreAudit`;

-- DropTable
DROP TABLE `AnnualModule`;

-- DropTable
DROP TABLE `AnnualModuleAudit`;

-- DropTable
DROP TABLE `AnnualRegistry`;

-- DropTable
DROP TABLE `AnnualRegistryAudit`;

-- DropTable
DROP TABLE `AnnualSchoolSetting`;

-- DropTable
DROP TABLE `AnnualSchoolSettingAudit`;

-- DropTable
DROP TABLE `AnnualSemesterExamAcess`;

-- DropTable
DROP TABLE `AnnualSemesterExamAcessAudit`;

-- DropTable
DROP TABLE `AnnualStudent`;

-- DropTable
DROP TABLE `AnnualStudentAnswerQuestion`;

-- DropTable
DROP TABLE `AnnualStudentAnswerQuestionAudit`;

-- DropTable
DROP TABLE `AnnualStudentHasModule`;

-- DropTable
DROP TABLE `AnnualStudentTakeAssessment`;

-- DropTable
DROP TABLE `AnnualSubject`;

-- DropTable
DROP TABLE `AnnualSubjectAudit`;

-- DropTable
DROP TABLE `AnnualSubjectPart`;

-- DropTable
DROP TABLE `AnnualSubjectPartAudit`;

-- DropTable
DROP TABLE `AnnualTeacher`;

-- DropTable
DROP TABLE `AnnualTeacherAudit`;

-- DropTable
DROP TABLE `AnnualWeighting`;

-- DropTable
DROP TABLE `AnnualWeightingAudit`;

-- DropTable
DROP TABLE `Assessment`;

-- DropTable
DROP TABLE `AssessmentAudit`;

-- DropTable
DROP TABLE `AssignmentGroupMember`;

-- DropTable
DROP TABLE `Chapter`;

-- DropTable
DROP TABLE `ChapterAudit`;

-- DropTable
DROP TABLE `Classroom`;

-- DropTable
DROP TABLE `Cycle`;

-- DropTable
DROP TABLE `Department`;

-- DropTable
DROP TABLE `DepartmentAudit`;

-- DropTable
DROP TABLE `Evaluation`;

-- DropTable
DROP TABLE `EvaluationAudit`;

-- DropTable
DROP TABLE `EvaluationHasStudent`;

-- DropTable
DROP TABLE `EvaluationHasStudentAudit`;

-- DropTable
DROP TABLE `EvaluationType`;

-- DropTable
DROP TABLE `Grade`;

-- DropTable
DROP TABLE `Inquiry`;

-- DropTable
DROP TABLE `Log`;

-- DropTable
DROP TABLE `Login`;

-- DropTable
DROP TABLE `LoginAudit`;

-- DropTable
DROP TABLE `Major`;

-- DropTable
DROP TABLE `MajorAudit`;

-- DropTable
DROP TABLE `Payment`;

-- DropTable
DROP TABLE `Person`;

-- DropTable
DROP TABLE `PersonAudit`;

-- DropTable
DROP TABLE `PlatformSettings`;

-- DropTable
DROP TABLE `PlatformSettingsAudit`;

-- DropTable
DROP TABLE `PresenceList`;

-- DropTable
DROP TABLE `PresenceListAudit`;

-- DropTable
DROP TABLE `PresenceListHasChapter`;

-- DropTable
DROP TABLE `PresenceListHasModuleStudent`;

-- DropTable
DROP TABLE `Question`;

-- DropTable
DROP TABLE `QuestionAudit`;

-- DropTable
DROP TABLE `QuestionOption`;

-- DropTable
DROP TABLE `QuestionOptionAudit`;

-- DropTable
DROP TABLE `QuestionResource`;

-- DropTable
DROP TABLE `ResetPassword`;

-- DropTable
DROP TABLE `Resource`;

-- DropTable
DROP TABLE `RessourceAudit`;

-- DropTable
DROP TABLE `School`;

-- DropTable
DROP TABLE `SchoolAudit`;

-- DropTable
DROP TABLE `SchoolDemand`;

-- DropTable
DROP TABLE `SchoolDemandAudit`;

-- DropTable
DROP TABLE `Student`;

-- DropTable
DROP TABLE `StudentPayment`;

-- DropTable
DROP TABLE `SubjectPart`;

-- DropTable
DROP TABLE `Teacher`;

-- DropTable
DROP TABLE `TeacherAudit`;

-- DropTable
DROP TABLE `TeacherType`;

-- DropTable
DROP TABLE `TeachingGrade`;

-- CreateTable
CREATE TABLE `payments` (
    `payment_id` VARCHAR(36) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `payment_ref` VARCHAR(199) NOT NULL,
    `provider` ENUM('Stripe', 'NotchPay') NOT NULL,
    `payment_reason` ENUM('Fee', 'Platform', 'Onboarding', 'Registration') NOT NULL,

    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inquiries` (
    `inquiry_id` VARCHAR(36) NOT NULL,
    `email` VARCHAR(45) NOT NULL,
    `type` ENUM('Default', 'EarlyAccess') NOT NULL,
    `phone` VARCHAR(45) NULL,
    `name` VARCHAR(90) NULL,
    `message` TEXT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`inquiry_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `platform_settings` (
    `platform_settings_id` VARCHAR(36) NOT NULL,
    `platform_fee` DOUBLE NOT NULL DEFAULT 3300,
    `onboarding_fee` DOUBLE NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` VARCHAR(36) NULL,

    PRIMARY KEY (`platform_settings_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `platform_settings_audits` (
    `platform_settings_audit_id` VARCHAR(36) NOT NULL,
    `onboarding_fee` DOUBLE NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `platform_settings_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`platform_settings_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `persons` (
    `person_id` VARCHAR(36) NOT NULL,
    `first_name` VARCHAR(50) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `phone_number` VARCHAR(15) NOT NULL,
    `birthdate` DATETIME(0) NULL,
    `birthplace` VARCHAR(45) NULL,
    `gender` ENUM('Male', 'Female') NOT NULL,
    `nationality` VARCHAR(45) NULL,
    `national_id_number` VARCHAR(15) NULL,
    `address` VARCHAR(100) NULL,
    `longitude` INTEGER NULL,
    `latitude` INTEGER NULL,
    `email` VARCHAR(50) NOT NULL,
    `preferred_lang` ENUM('en', 'fr') NOT NULL DEFAULT 'fr',
    `image_ref` VARCHAR(50) NULL,
    `home_region` VARCHAR(45) NULL,
    `religion` VARCHAR(45) NULL,
    `handicap` VARCHAR(45) NOT NULL DEFAULT 'None',
    `civil_status` ENUM('Married', 'Single', 'Divorced') NOT NULL DEFAULT 'Single',
    `employment_status` ENUM('Employed', 'Unemployed', 'SelfEmployed') NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `persons_phone_number_key`(`phone_number`),
    UNIQUE INDEX `persons_email_key`(`email`),
    FULLTEXT INDEX `persons_first_name_last_name_idx`(`first_name`, `last_name`),
    FULLTEXT INDEX `persons_email_first_name_last_name_idx`(`email`, `first_name`, `last_name`),
    PRIMARY KEY (`person_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `person_audits` (
    `person_audit_id` VARCHAR(36) NOT NULL,
    `first_name` VARCHAR(50) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `phone_number` VARCHAR(15) NOT NULL,
    `birthdate` DATETIME(0) NULL,
    `birthplace` VARCHAR(45) NULL,
    `gender` ENUM('Male', 'Female') NOT NULL,
    `nationality` VARCHAR(45) NULL,
    `national_id_number` VARCHAR(15) NULL,
    `address` VARCHAR(100) NULL,
    `longitude` INTEGER NULL,
    `latitude` INTEGER NULL,
    `email` VARCHAR(50) NOT NULL,
    `preferred_lang` ENUM('en', 'fr') NOT NULL,
    `image_ref` VARCHAR(50) NULL,
    `home_region` VARCHAR(45) NULL,
    `religion` VARCHAR(45) NULL,
    `handicap` VARCHAR(45) NOT NULL DEFAULT 'None',
    `civil_status` ENUM('Married', 'Single', 'Divorced') NOT NULL DEFAULT 'Single',
    `employment_status` ENUM('Employed', 'Unemployed', 'SelfEmployed') NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `person_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NULL,

    PRIMARY KEY (`person_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logins` (
    `login_id` VARCHAR(36) NOT NULL,
    `password` VARCHAR(75) NOT NULL,
    `is_parent` BOOLEAN NOT NULL DEFAULT false,
    `is_personnel` BOOLEAN NOT NULL DEFAULT false,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `person_id` VARCHAR(36) NOT NULL,
    `school_id` VARCHAR(36) NULL,

    UNIQUE INDEX `logins_person_id_school_id_key`(`person_id`, `school_id`),
    PRIMARY KEY (`login_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `login_audits` (
    `login_audit_id` VARCHAR(36) NOT NULL,
    `password` VARCHAR(75) NOT NULL,
    `is_personnel` BOOLEAN NOT NULL,
    `is_deleted` BOOLEAN NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `login_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`login_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logs` (
    `log_id` VARCHAR(36) NOT NULL,
    `auth_method` ENUM('LOCAL', 'GOOGLE') NOT NULL DEFAULT 'LOCAL',
    `user_agent` VARCHAR(191) NOT NULL,
    `logged_in_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `logged_out_at` DATETIME(0) NULL,
    `updated_at` DATETIME(0) NULL,
    `closed_at` DATETIME(0) NULL,
    `login_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`log_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reset_passwords` (
    `reset_password_id` VARCHAR(36) NOT NULL,
    `expires_at` DATETIME(0) NOT NULL,
    `is_valid` BOOLEAN NOT NULL DEFAULT true,
    `login_id` VARCHAR(36) NOT NULL,
    `generated_by_confiigurator` VARCHAR(36) NULL,
    `generated_by_admin` VARCHAR(36) NULL,

    PRIMARY KEY (`reset_password_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `schools` (
    `school_id` VARCHAR(36) NOT NULL,
    `school_name` VARCHAR(50) NOT NULL,
    `school_code` VARCHAR(45) NOT NULL,
    `school_acronym` VARCHAR(45) NOT NULL,
    `school_email` VARCHAR(50) NOT NULL,
    `school_phone_number` VARCHAR(15) NOT NULL,
    `lead_funnel` VARCHAR(45) NOT NULL,
    `longitude` DOUBLE NULL,
    `latitude` DOUBLE NULL,
    `description` TEXT NULL,
    `address` VARCHAR(20) NULL,
    `logo_ref` VARCHAR(45) NULL,
    `subdomain` VARCHAR(30) NULL,
    `creation_decree_number` VARCHAR(45) NULL,
    `is_validated` BOOLEAN NOT NULL DEFAULT false,
    `validated_at` DATETIME(0) NULL,
    `validated_by` VARCHAR(36) NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `deleted_at` DATETIME(0) NULL,
    `deleted_by` VARCHAR(36) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `schools_school_code_key`(`school_code`),
    UNIQUE INDEX `schools_school_email_key`(`school_email`),
    FULLTEXT INDEX `schools_school_name_idx`(`school_name`),
    FULLTEXT INDEX `schools_school_name_address_idx`(`school_name`, `address`),
    PRIMARY KEY (`school_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `school_audits` (
    `school_audit_id` VARCHAR(36) NOT NULL,
    `longitude` DOUBLE NULL,
    `latitude` DOUBLE NULL,
    `address` VARCHAR(20) NULL,
    `school_name` VARCHAR(50) NOT NULL,
    `school_acronym` VARCHAR(45) NOT NULL,
    `school_email` VARCHAR(50) NOT NULL,
    `school_phone_number` VARCHAR(15) NOT NULL,
    `description` TEXT NULL,
    `logo_ref` VARCHAR(45) NULL,
    `subdomain` VARCHAR(30) NULL,
    `creation_decree_number` VARCHAR(45) NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `school_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `school_audits_school_email_key`(`school_email`),
    PRIMARY KEY (`school_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_school_settings` (
    `annual_school_setting_id` VARCHAR(36) NOT NULL,
    `can_pay_fee` BOOLEAN NOT NULL DEFAULT false,
    `mark_insertion_source` ENUM('Teacher', 'Registry') NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `academic_year_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `annual_school_settings_academic_year_id_key`(`academic_year_id`),
    PRIMARY KEY (`annual_school_setting_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_school_settings_audits` (
    `annual_school_setting_audit_id` VARCHAR(36) NOT NULL,
    `can_pay_fee` BOOLEAN NOT NULL,
    `mark_insertion_source` ENUM('Teacher', 'Registry') NOT NULL,
    `annual_school_setting_id` VARCHAR(36) NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_school_setting_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_document_signers` (
    `annual_document_signer_id` VARCHAR(36) NOT NULL,
    `signer_name` VARCHAR(199) NOT NULL,
    `signer_title` VARCHAR(45) NOT NULL,
    `honorific` VARCHAR(45) NOT NULL,
    `hierarchy_level` INTEGER NOT NULL,
    `annual_school_setting_id` VARCHAR(36) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` VARCHAR(36) NOT NULL,
    `deleted_by` VARCHAR(36) NULL,

    PRIMARY KEY (`annual_document_signer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ambassadors` (
    `ambassador_id` VARCHAR(36) NOT NULL,
    `referral_code` VARCHAR(36) NOT NULL,
    `login_id` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `ambassadors_referral_code_key`(`referral_code`),
    PRIMARY KEY (`ambassador_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `school_demands` (
    `school_demand_id` VARCHAR(36) NOT NULL,
    `demand_status` ENUM('PENDING', 'PROCESSING', 'REJECTED', 'VALIDATED', 'SUSPENDED') NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `rejection_reason` TEXT NULL,
    `payment_id` VARCHAR(36) NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `ambassador_id` VARCHAR(36) NULL,

    UNIQUE INDEX `school_demands_payment_id_key`(`payment_id`),
    UNIQUE INDEX `school_demands_school_id_key`(`school_id`),
    PRIMARY KEY (`school_demand_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `school_demand_audits` (
    `school_demand_audit_id` VARCHAR(36) NOT NULL,
    `rejection_reason` TEXT NULL,
    `demand_status` ENUM('PENDING', 'PROCESSING', 'REJECTED', 'VALIDATED', 'SUSPENDED') NOT NULL DEFAULT 'PENDING',
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `ambassador_id` VARCHAR(36) NULL,
    `school_demand_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`school_demand_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `academic_years` (
    `academic_year_id` VARCHAR(36) NOT NULL,
    `starts_at` DATETIME(0) NOT NULL,
    `ends_at` DATETIME(0) NOT NULL,
    `started_at` DATETIME(0) NULL,
    `ended_at` DATETIME(0) NULL,
    `year_status` ENUM('INACTIVE', 'ACTIVE', 'FINISHED') NOT NULL DEFAULT 'INACTIVE',
    `year_code` VARCHAR(36) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `school_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NULL,

    UNIQUE INDEX `academic_years_year_code_school_id_key`(`year_code`, `school_id`),
    PRIMARY KEY (`academic_year_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_configurators` (
    `annual_configurator_id` VARCHAR(36) NOT NULL,
    `is_sudo` BOOLEAN NOT NULL DEFAULT false,
    `matricule` VARCHAR(20) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `login_id` VARCHAR(36) NOT NULL,
    `deleted_at` DATETIME(0) NULL,
    `disabled_by` VARCHAR(191) NULL,
    `deleted_by` VARCHAR(191) NULL,
    `created_by` VARCHAR(191) NULL,
    `academic_year_id` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `annual_configurators_login_id_academic_year_id_key`(`login_id`, `academic_year_id`),
    PRIMARY KEY (`annual_configurator_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `students` (
    `student_id` VARCHAR(36) NOT NULL,
    `matricule` VARCHAR(45) NOT NULL,
    `classroom_id` VARCHAR(36) NOT NULL,
    `login_id` VARCHAR(36) NOT NULL,
    `tutor_id` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `students_login_id_classroom_id_key`(`login_id`, `classroom_id`),
    PRIMARY KEY (`student_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_students` (
    `annual_student_id` VARCHAR(36) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `student_id` VARCHAR(191) NOT NULL,
    `annual_classroom_division_id` VARCHAR(36) NOT NULL,
    `academic_year_id` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `annual_students_student_id_academic_year_id_key`(`student_id`, `academic_year_id`),
    PRIMARY KEY (`annual_student_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_registries` (
    `annual_registry_id` VARCHAR(36) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `matricule` VARCHAR(75) NOT NULL,
    `private_code` VARCHAR(75) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `academic_year_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(191) NOT NULL,
    `login_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `annual_registries_login_id_matricule_key`(`login_id`, `matricule`),
    UNIQUE INDEX `annual_registries_login_id_academic_year_id_key`(`login_id`, `academic_year_id`),
    PRIMARY KEY (`annual_registry_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_registry_audits` (
    `annual_registry_audit_id` VARCHAR(36) NOT NULL,
    `private_code` VARCHAR(75) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL,
    `annual_registry_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_registry_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teacher_types` (
    `teacher_type_id` VARCHAR(36) NOT NULL,
    `teacher_type` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`teacher_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teaching_grades` (
    `teaching_grade_id` VARCHAR(36) NOT NULL,
    `teaching_grade` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`teaching_grade_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teachers` (
    `teacher_id` VARCHAR(36) NOT NULL,
    `has_tax_payers_card` BOOLEAN NOT NULL DEFAULT false,
    `tax_payer_card_number` VARCHAR(191) NULL,
    `matricule` VARCHAR(75) NOT NULL,
    `private_code` VARCHAR(75) NOT NULL,
    `login_id` VARCHAR(36) NOT NULL,
    `teacher_type_id` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `teachers_login_id_key`(`login_id`),
    PRIMARY KEY (`teacher_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teacher_audits` (
    `teacher_audit_id` VARCHAR(36) NOT NULL,
    `has_tax_payers_card` BOOLEAN NOT NULL DEFAULT false,
    `tax_payer_card_number` VARCHAR(191) NULL,
    `private_code` VARCHAR(75) NOT NULL,
    `teacher_type_id` VARCHAR(36) NOT NULL,
    `teacher_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`teacher_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_teachers` (
    `annual_teacher_id` VARCHAR(36) NOT NULL,
    `hourly_rate` INTEGER NOT NULL,
    `origin_institute` VARCHAR(45) NOT NULL,
    `has_signed_convention` BOOLEAN NOT NULL DEFAULT false,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `teaching_grade_id` VARCHAR(36) NOT NULL,
    `academic_year_id` VARCHAR(36) NOT NULL,
    `login_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `annual_teachers_login_id_academic_year_id_key`(`login_id`, `academic_year_id`),
    PRIMARY KEY (`annual_teacher_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_teacher_audits` (
    `annual_teacher_audit_id` VARCHAR(36) NOT NULL,
    `hourly_rate` INTEGER NOT NULL,
    `origin_institute` VARCHAR(45) NOT NULL,
    `has_signed_convention` BOOLEAN NOT NULL,
    `is_deleted` BOOLEAN NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_teacher_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_teacher_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `departments` (
    `department_id` VARCHAR(36) NOT NULL,
    `department_name` VARCHAR(45) NOT NULL,
    `department_acronym` VARCHAR(45) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` VARCHAR(36) NOT NULL,
    `school_id` VARCHAR(36) NOT NULL,

    FULLTEXT INDEX `departments_department_name_idx`(`department_name`),
    FULLTEXT INDEX `departments_department_name_department_acronym_idx`(`department_name`, `department_acronym`),
    PRIMARY KEY (`department_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `department_audits` (
    `departement_audit_id` VARCHAR(36) NOT NULL,
    `department_name` VARCHAR(45) NOT NULL,
    `department_acronym` VARCHAR(45) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `department_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`departement_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cycles` (
    `cycle_id` VARCHAR(36) NOT NULL,
    `cycle_name` ENUM('HND', 'DUT', 'DTS', 'BACHELOR', 'MASTER', 'DOCTORATE') NOT NULL,
    `number_of_years` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`cycle_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `majors` (
    `major_id` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `cycle_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`major_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `major_audits` (
    `major_audit_id` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `major_id` VARCHAR(36) NOT NULL,
    `cycle_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`major_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_majors` (
    `annual_major_id` VARCHAR(36) NOT NULL,
    `major_name` VARCHAR(45) NOT NULL,
    `major_acronym` VARCHAR(45) NOT NULL,
    `uses_module_system` BOOLEAN NOT NULL DEFAULT true,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `major_id` VARCHAR(36) NOT NULL,
    `department_id` VARCHAR(36) NOT NULL,
    `academic_year_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    FULLTEXT INDEX `annual_majors_major_name_idx`(`major_name`),
    FULLTEXT INDEX `annual_majors_major_name_major_acronym_idx`(`major_name`, `major_acronym`),
    PRIMARY KEY (`annual_major_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_major_audits` (
    `annual_major_audit_id` VARCHAR(36) NOT NULL,
    `major_name` VARCHAR(45) NOT NULL,
    `major_acronym` VARCHAR(45) NOT NULL,
    `uses_module_system` BOOLEAN NOT NULL DEFAULT true,
    `is_deleted` BOOLEAN NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_major_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NULL,
    `teaching_system_audited_by` VARCHAR(36) NULL,

    PRIMARY KEY (`annual_major_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classrooms` (
    `classroom_id` VARCHAR(36) NOT NULL,
    `classroom_level` INTEGER NOT NULL,
    `major_id` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`classroom_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_classrooms` (
    `annual_classroom_id` VARCHAR(36) NOT NULL,
    `classroom_level` INTEGER NOT NULL,
    `number_of_divisions` INTEGER NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `classroom_id` VARCHAR(36) NOT NULL,
    `annual_major_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_classroom_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_classroom_audits` (
    `annual_classroom_audit_id` VARCHAR(36) NOT NULL,
    `number_of_divisions` INTEGER NOT NULL,
    `is_deleted` BOOLEAN NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_classroom_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_classroom_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_classroom_divisions` (
    `annual_classroom_division_id` VARCHAR(36) NOT NULL,
    `division_letter` CHAR(1) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `annual_classroom_id` VARCHAR(36) NOT NULL,
    `annual_coordinator_id` VARCHAR(36) NULL,
    `created_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_classroom_division_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_classroom_division_audits` (
    `annual_classroom_division_audit_id` VARCHAR(36) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_coordinator_id` VARCHAR(36) NULL,
    `annual_classroom_division_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_classroom_division_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_modules` (
    `annual_module_id` VARCHAR(36) NOT NULL,
    `module_code` VARCHAR(45) NOT NULL,
    `module_name` VARCHAR(45) NOT NULL,
    `credit_points` INTEGER NOT NULL,
    `semester_number` INTEGER NOT NULL,
    `is_exam_published` BOOLEAN NOT NULL DEFAULT false,
    `is_resit_published` BOOLEAN NOT NULL DEFAULT false,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `is_subject_module` BOOLEAN NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_classroom_id` VARCHAR(36) NOT NULL,
    `academic_year_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,
    `created_from` VARCHAR(36) NULL,

    UNIQUE INDEX `annual_modules_created_from_key`(`created_from`),
    PRIMARY KEY (`annual_module_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_module_audits` (
    `annual_module_audit_id` VARCHAR(36) NOT NULL,
    `module_code` VARCHAR(45) NOT NULL,
    `module_name` VARCHAR(45) NOT NULL,
    `credit_points` INTEGER NOT NULL,
    `semester_number` INTEGER NOT NULL,
    `is_exam_published` BOOLEAN NOT NULL,
    `is_resit_published` BOOLEAN NOT NULL,
    `is_deleted` BOOLEAN NOT NULL,
    `is_subject_module` BOOLEAN NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_module_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_module_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subject_parts` (
    `subject_part_id` VARCHAR(36) NOT NULL,
    `subject_part_name` VARCHAR(45) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`subject_part_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_subjects` (
    `annual_subject_id` VARCHAR(36) NOT NULL,
    `weighting` DOUBLE NOT NULL,
    `objective` MEDIUMTEXT NOT NULL,
    `subject_code` VARCHAR(45) NOT NULL,
    `subject_name` VARCHAR(45) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_module_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_subject_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_subject_audits` (
    `annua_subject_audit_id` VARCHAR(36) NOT NULL,
    `weighting` DOUBLE NOT NULL,
    `objective` MEDIUMTEXT NOT NULL,
    `subject_code` VARCHAR(45) NOT NULL,
    `subject_name` VARCHAR(45) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `audited_by` VARCHAR(36) NOT NULL,
    `annual_subject_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annua_subject_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_subject_parts` (
    `annual_subject_part_id` VARCHAR(36) NOT NULL,
    `number_of_hours` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `subject_part_id` VARCHAR(36) NOT NULL,
    `annual_subject_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_subject_part_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_subject_part_audits` (
    `annual_subject_part_audit_id` VARCHAR(36) NOT NULL,
    `number_of_hours` INTEGER NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_subject_part_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_subject_part_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_module_settings` (
    `annual_module_setting_id` VARCHAR(36) NOT NULL,
    `carry_over_system` ENUM('SUBJECT', 'MODULE') NOT NULL,
    `minimum_modulation_score` INTEGER NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `cycle_id` VARCHAR(36) NOT NULL,
    `academic_year_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `annual_module_settings_academic_year_id_cycle_id_key`(`academic_year_id`, `cycle_id`),
    PRIMARY KEY (`annual_module_setting_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_module_settings_audits` (
    `annual_module_setting_audit_id` VARCHAR(36) NOT NULL,
    `carry_over_system` ENUM('SUBJECT', 'MODULE') NOT NULL,
    `minimum_modulation_score` INTEGER NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_module_setting_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_module_setting_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_evaluation_types` (
    `annual_evaluation_type_id` VARCHAR(36) NOT NULL,
    `evaluation_type_weight` INTEGER NOT NULL,
    `evaluation_type` ENUM('CA', 'EXAM', 'RESIT') NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `cycle_id` VARCHAR(36) NOT NULL,
    `academic_year_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `annual_evaluation_types_academic_year_id_cycle_id_evaluation_key`(`academic_year_id`, `cycle_id`, `evaluation_type`),
    PRIMARY KEY (`annual_evaluation_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_evaluation_type_audits` (
    `annual_evaluation_type_audit_id` VARCHAR(36) NOT NULL,
    `evaluation_type_weight` INTEGER NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_evaluation_type_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_evaluation_type_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_evaluation_subtypes` (
    `annual_evaluation_subtype_id` VARCHAR(36) NOT NULL,
    `evaluation_subtype_name` VARCHAR(191) NOT NULL,
    `evaluation_subtype_weight` INTEGER NOT NULL,
    `annual_evaluation_type_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_evaluation_subtype_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_evaluation_subtype_audits` (
    `annual_evaluation_sub_type_audit_id` VARCHAR(36) NOT NULL,
    `evaluation_subtype_name` VARCHAR(45) NOT NULL,
    `evaluation_subtype_weight` INTEGER NOT NULL,
    `annual_evaluation_subtype_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_evaluation_sub_type_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_weightings` (
    `annual_weighting_id` VARCHAR(36) NOT NULL,
    `weighting_system` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `cycle_id` VARCHAR(36) NOT NULL,
    `academic_year_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `annual_weightings_academic_year_id_cycle_id_key`(`academic_year_id`, `cycle_id`),
    PRIMARY KEY (`annual_weighting_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_weighting_audits` (
    `annual_weighting_audit_id` VARCHAR(36) NOT NULL,
    `weighting_system` INTEGER NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_weighting_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_weighting_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_grade_weightings` (
    `annual_grade_weighting_id` VARCHAR(36) NOT NULL,
    `minimum` DOUBLE NULL,
    `maximum` DOUBLE NULL,
    `point` DOUBLE NOT NULL,
    `grade` CHAR(2) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `academic_year_id` VARCHAR(36) NOT NULL,
    `cycle_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `annual_grade_weightings_academic_year_id_cycle_id_grade_key`(`academic_year_id`, `cycle_id`, `grade`),
    PRIMARY KEY (`annual_grade_weighting_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_grade_weighting_audits` (
    `annual_grade_weighting_audit_id` VARCHAR(36) NOT NULL,
    `minimum` DOUBLE NULL,
    `maximum` DOUBLE NULL,
    `point` DOUBLE NOT NULL,
    `grade` VARCHAR(36) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_grade_weighting_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_grade_weighting_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_academic_profiles` (
    `annual_academic_profile_id` VARCHAR(36) NOT NULL,
    `minimum_point` DOUBLE NOT NULL,
    `maximum_point` DOUBLE NOT NULL,
    `comment` VARCHAR(25) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `cycle_id` VARCHAR(36) NOT NULL,
    `academic_year_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_academic_profile_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_academic_profile_audits` (
    `annual_academic_profile_audit_id` VARCHAR(36) NOT NULL,
    `minimum_point` DOUBLE NOT NULL,
    `maximum_point` DOUBLE NOT NULL,
    `comment` VARCHAR(25) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_academic_profile_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_academic_profile_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_semester_exam_accesses` (
    `annual_semester_exam_access_id` VARCHAR(36) NOT NULL,
    `payment_percentage` INTEGER NOT NULL,
    `annual_semester_number` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `cycle_id` VARCHAR(36) NOT NULL,
    `academic_year_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `annual_semester_exam_accesses_academic_year_id_cycle_id_annu_key`(`academic_year_id`, `cycle_id`, `annual_semester_number`),
    PRIMARY KEY (`annual_semester_exam_access_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_semester_exam_access_audits` (
    `annual_semester_exam_access_audit_id` VARCHAR(36) NOT NULL,
    `payment_percentage` INTEGER NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_semester_exam_access_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_semester_exam_access_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `evaluations` (
    `evaluation_id` VARCHAR(36) NOT NULL,
    `examination_date` DATETIME(0) NULL,
    `annual_evaluation_subtype_id` VARCHAR(36) NOT NULL,
    `annual_subject_id` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` VARCHAR(36) NOT NULL,
    `published_at` DATETIME(0) NULL,
    `published_by` VARCHAR(36) NULL,
    `anonimated_at` DATETIME(0) NULL,
    `anonimated_by` VARCHAR(36) NULL,

    PRIMARY KEY (`evaluation_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `evaluation_audits` (
    `evaluation_audit_id` VARCHAR(36) NOT NULL,
    `examination_date` DATETIME(0) NULL,
    `evaluation_id` VARCHAR(36) NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`evaluation_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `evaluation_has_students` (
    `evaluation_has_student_id` VARCHAR(36) NOT NULL,
    `mark` INTEGER NULL,
    `anonymity_code` VARCHAR(20) NOT NULL,
    `is_editable` BOOLEAN NOT NULL DEFAULT true,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `edition_granted_at` DATETIME(0) NULL,
    `evaluation_id` VARCHAR(36) NOT NULL,
    `annual_student_id` VARCHAR(36) NOT NULL,
    `ref_evaluation_has_student_id` VARCHAR(36) NULL,

    UNIQUE INDEX `evaluation_has_students_evaluation_id_annual_student_id_key`(`evaluation_id`, `annual_student_id`),
    PRIMARY KEY (`evaluation_has_student_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `evaluation_has_student_audits` (
    `evaluation_has_student_audit_id` VARCHAR(36) NOT NULL,
    `mark` INTEGER NULL,
    `is_deleted` BOOLEAN NOT NULL,
    `is_editable` BOOLEAN NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `edition_granted_at` DATETIME(0) NULL,
    `evaluation_has_student_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`evaluation_has_student_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chapters` (
    `chapter_id` VARCHAR(36) NOT NULL,
    `chapter_title` VARCHAR(45) NOT NULL,
    `chapter_objective` MEDIUMTEXT NOT NULL,
    `chapter_position` INTEGER NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_subject_id` VARCHAR(36) NOT NULL,
    `chapter_parent_id` VARCHAR(36) NULL,
    `created_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`chapter_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chapter_audits` (
    `chapter_audit_id` VARCHAR(36) NOT NULL,
    `chapter_title` VARCHAR(45) NOT NULL,
    `chapter_objective` MEDIUMTEXT NOT NULL,
    `chapter_position` INTEGER NOT NULL,
    `is_deleted` BOOLEAN NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `chapter_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`chapter_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resources` (
    `resource_id` VARCHAR(36) NOT NULL,
    `resource_type` ENUM('FILE', 'LINK') NOT NULL,
    `resource_extension` VARCHAR(5) NULL,
    `resource_ref` VARCHAR(255) NOT NULL,
    `resource_name` VARCHAR(191) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `chapter_id` VARCHAR(36) NULL,
    `annual_subject_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`resource_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resource_audits` (
    `resource_audit_id` VARCHAR(36) NOT NULL,
    `resource_type` ENUM('FILE', 'LINK') NOT NULL,
    `resource_extension` VARCHAR(5) NULL,
    `resource_ref` VARCHAR(90) NOT NULL,
    `resource_name` VARCHAR(45) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `resource_id` VARCHAR(191) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`resource_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assessments` (
    `assessment_id` VARCHAR(36) NOT NULL,
    `assessment_date` DATETIME(0) NULL,
    `duration` INTEGER NULL,
    `is_assignment` BOOLEAN NOT NULL DEFAULT false,
    `is_published` BOOLEAN NOT NULL DEFAULT false,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `number_per_group` INTEGER NOT NULL DEFAULT 1,
    `submission_type` ENUM('Individual', 'Group') NOT NULL DEFAULT 'Individual',
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_subject_id` VARCHAR(36) NOT NULL,
    `chapter_id` VARCHAR(36) NULL,
    `evaluation_id` VARCHAR(36) NULL,
    `created_by` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `assessments_chapter_id_key`(`chapter_id`),
    PRIMARY KEY (`assessment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assessment_audits` (
    `assessment_audit_id` VARCHAR(36) NOT NULL,
    `assessment_date` DATETIME(0) NULL,
    `duration` INTEGER NULL,
    `is_deleted` BOOLEAN NOT NULL,
    `is_published` BOOLEAN NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `assessment_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`assessment_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `questions` (
    `question_id` VARCHAR(36) NOT NULL,
    `question` LONGTEXT NOT NULL,
    `question_mark` DOUBLE NOT NULL,
    `question_answer` LONGTEXT NULL,
    `question_type` ENUM('MCQ', 'File', 'Structural') NOT NULL DEFAULT 'MCQ',
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `assessment_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`question_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `question_audits` (
    `question_audit_id` VARCHAR(36) NOT NULL,
    `question` LONGTEXT NOT NULL,
    `question_mark` DOUBLE NOT NULL,
    `question_answer` LONGTEXT NULL,
    `question_type` ENUM('MCQ', 'File', 'Structural') NOT NULL DEFAULT 'MCQ',
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `question_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`question_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `question_resources` (
    `question_resource_id` VARCHAR(36) NOT NULL,
    `caption` INTEGER NOT NULL,
    `resource_ref` VARCHAR(90) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `question_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,
    `deleted_at` DATETIME(0) NULL,
    `deleted_by` VARCHAR(36) NULL,

    PRIMARY KEY (`question_resource_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `question_options` (
    `question_option_id` VARCHAR(36) NOT NULL,
    `option` TINYTEXT NOT NULL,
    `is_answer` BOOLEAN NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `question_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`question_option_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `question_option_audits` (
    `question_option__audit_id` VARCHAR(36) NOT NULL,
    `option` TINYTEXT NOT NULL,
    `is_answer` BOOLEAN NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `question_option_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`question_option__audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_student_take_assessments` (
    `annual_student_take_assessment_id` VARCHAR(36) NOT NULL,
    `total_score` DOUBLE NOT NULL,
    `submitted_at` DATETIME(0) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_student_id` VARCHAR(36) NOT NULL,
    `assessment_id` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `annual_student_take_assessments_annual_student_id_assessment_key`(`annual_student_id`, `assessment_id`),
    PRIMARY KEY (`annual_student_take_assessment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_student_answer_questions` (
    `annual_student_answer_question_id` VARCHAR(36) NOT NULL,
    `question_mark` DOUBLE NOT NULL,
    `response` LONGTEXT NULL,
    `teacher_comment` LONGTEXT NULL,
    `question_id` VARCHAR(36) NOT NULL,
    `answered_option_id` VARCHAR(36) NULL,
    `annual_student_take_assessment_id` VARCHAR(36) NOT NULL,
    `corrected_by` VARCHAR(36) NULL,

    PRIMARY KEY (`annual_student_answer_question_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_student_answer_question_audits` (
    `annual_student_answer_question_audit_id` VARCHAR(36) NOT NULL,
    `response` LONGTEXT NOT NULL,
    `annual_student_answer_question_id` VARCHAR(36) NOT NULL,
    `previous_auditer` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_student_answer_question_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annual_student_has_modules` (
    `annual_student_has_module_id` VARCHAR(36) NOT NULL,
    `semester_number` INTEGER NOT NULL,
    `annual_student_id` VARCHAR(36) NOT NULL,
    `annual_module_id` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `annual_student_has_modules_annual_student_id_annual_module_i_key`(`annual_student_id`, `annual_module_id`),
    PRIMARY KEY (`annual_student_has_module_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `presence_lists` (
    `presence_list_id` VARCHAR(36) NOT NULL,
    `presence_list_date` DATETIME(0) NOT NULL,
    `start_time` TIME(0) NOT NULL,
    `end_time` TIME(0) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `is_published` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_subject_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`presence_list_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `presence_list_audits` (
    `presence_list_audit_id` VARCHAR(36) NOT NULL,
    `presence_list_date` DATETIME(0) NOT NULL,
    `start_time` TIME(0) NOT NULL,
    `end_time` TIME(0) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `is_published` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `presence_list_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`presence_list_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `presence_list_has_chapters` (
    `presence_list_has_chapter_id` VARCHAR(36) NOT NULL,
    `presence_list_id` VARCHAR(36) NOT NULL,
    `chapter_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` VARCHAR(36) NOT NULL,
    `deleted_at` DATETIME(0) NULL,
    `deleted_by` VARCHAR(36) NULL,

    PRIMARY KEY (`presence_list_has_chapter_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `presence_list_has_annual_module_students` (
    `presence_list_has_annual_module_student_id` VARCHAR(36) NOT NULL,
    `annual_student_has_module_id` VARCHAR(36) NOT NULL,
    `presence_list_id` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` VARCHAR(36) NOT NULL,
    `deleted_at` DATETIME(0) NULL,
    `deleted_by` VARCHAR(36) NULL,

    PRIMARY KEY (`presence_list_has_annual_module_student_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_payments` (
    `student_payment_id` VARCHAR(36) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `payment_id` VARCHAR(45) NOT NULL,
    `semester_number` INTEGER NULL,
    `annual_student_id` VARCHAR(36) NOT NULL,
    `paid_by` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`student_payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assignment_group_members` (
    `assignment_group_member_id` VARCHAR(36) NOT NULL,
    `total_score` INTEGER NOT NULL DEFAULT 0,
    `group_code` VARCHAR(45) NOT NULL,
    `approved_at` DATETIME(0) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `assessment_id` VARCHAR(36) NOT NULL,
    `annual_student_take_assessment_id` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `assignment_group_members_annual_student_take_assessment_id_a_key`(`annual_student_take_assessment_id`, `assessment_id`),
    PRIMARY KEY (`assignment_group_member_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `platform_settings` ADD CONSTRAINT `platform_settings_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `logins`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `platform_settings_audits` ADD CONSTRAINT `platform_settings_audits_platform_settings_id_fkey` FOREIGN KEY (`platform_settings_id`) REFERENCES `platform_settings`(`platform_settings_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `platform_settings_audits` ADD CONSTRAINT `platform_settings_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `logins`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `person_audits` ADD CONSTRAINT `person_audits_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `persons`(`person_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `person_audits` ADD CONSTRAINT `person_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_configurators`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logins` ADD CONSTRAINT `logins_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `persons`(`person_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logins` ADD CONSTRAINT `logins_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`school_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `login_audits` ADD CONSTRAINT `login_audits_login_id_fkey` FOREIGN KEY (`login_id`) REFERENCES `logins`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logs` ADD CONSTRAINT `logs_login_id_fkey` FOREIGN KEY (`login_id`) REFERENCES `logins`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reset_passwords` ADD CONSTRAINT `reset_passwords_login_id_fkey` FOREIGN KEY (`login_id`) REFERENCES `logins`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reset_passwords` ADD CONSTRAINT `reset_passwords_generated_by_confiigurator_fkey` FOREIGN KEY (`generated_by_confiigurator`) REFERENCES `annual_configurators`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reset_passwords` ADD CONSTRAINT `reset_passwords_generated_by_admin_fkey` FOREIGN KEY (`generated_by_admin`) REFERENCES `logins`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schools` ADD CONSTRAINT `schools_validated_by_fkey` FOREIGN KEY (`validated_by`) REFERENCES `logins`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schools` ADD CONSTRAINT `schools_deleted_by_fkey` FOREIGN KEY (`deleted_by`) REFERENCES `logins`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schools` ADD CONSTRAINT `schools_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `persons`(`person_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `school_audits` ADD CONSTRAINT `school_audits_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`school_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `school_audits` ADD CONSTRAINT `school_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_configurators`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_school_settings` ADD CONSTRAINT `annual_school_settings_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_school_settings` ADD CONSTRAINT `annual_school_settings_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_configurators`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_school_settings_audits` ADD CONSTRAINT `annual_school_settings_audits_annual_school_setting_id_fkey` FOREIGN KEY (`annual_school_setting_id`) REFERENCES `annual_school_settings`(`annual_school_setting_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_school_settings_audits` ADD CONSTRAINT `annual_school_settings_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_configurators`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_document_signers` ADD CONSTRAINT `annual_document_signers_annual_school_setting_id_fkey` FOREIGN KEY (`annual_school_setting_id`) REFERENCES `annual_school_settings`(`annual_school_setting_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_document_signers` ADD CONSTRAINT `annual_document_signers_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_configurators`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_document_signers` ADD CONSTRAINT `annual_document_signers_deleted_by_fkey` FOREIGN KEY (`deleted_by`) REFERENCES `annual_configurators`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ambassadors` ADD CONSTRAINT `ambassadors_login_id_fkey` FOREIGN KEY (`login_id`) REFERENCES `logins`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `school_demands` ADD CONSTRAINT `school_demands_payment_id_fkey` FOREIGN KEY (`payment_id`) REFERENCES `payments`(`payment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `school_demands` ADD CONSTRAINT `school_demands_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`school_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `school_demands` ADD CONSTRAINT `school_demands_ambassador_id_fkey` FOREIGN KEY (`ambassador_id`) REFERENCES `ambassadors`(`ambassador_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `school_demand_audits` ADD CONSTRAINT `school_demand_audits_ambassador_id_fkey` FOREIGN KEY (`ambassador_id`) REFERENCES `ambassadors`(`ambassador_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `school_demand_audits` ADD CONSTRAINT `school_demand_audits_school_demand_id_fkey` FOREIGN KEY (`school_demand_id`) REFERENCES `school_demands`(`school_demand_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `school_demand_audits` ADD CONSTRAINT `school_demand_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `logins`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `academic_years` ADD CONSTRAINT `academic_years_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`school_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `academic_years` ADD CONSTRAINT `academic_years_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_configurators`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_configurators` ADD CONSTRAINT `annual_configurators_login_id_fkey` FOREIGN KEY (`login_id`) REFERENCES `logins`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_configurators` ADD CONSTRAINT `annual_configurators_disabled_by_fkey` FOREIGN KEY (`disabled_by`) REFERENCES `logins`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_configurators` ADD CONSTRAINT `annual_configurators_deleted_by_fkey` FOREIGN KEY (`deleted_by`) REFERENCES `annual_configurators`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_configurators` ADD CONSTRAINT `annual_configurators_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_configurators`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_configurators` ADD CONSTRAINT `annual_configurators_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_classroom_id_fkey` FOREIGN KEY (`classroom_id`) REFERENCES `classrooms`(`classroom_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_login_id_fkey` FOREIGN KEY (`login_id`) REFERENCES `logins`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_tutor_id_fkey` FOREIGN KEY (`tutor_id`) REFERENCES `logins`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_students` ADD CONSTRAINT `annual_students_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_students` ADD CONSTRAINT `annual_students_annual_classroom_division_id_fkey` FOREIGN KEY (`annual_classroom_division_id`) REFERENCES `annual_classroom_divisions`(`annual_classroom_division_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_students` ADD CONSTRAINT `annual_students_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_registries` ADD CONSTRAINT `annual_registries_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_registries` ADD CONSTRAINT `annual_registries_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_configurators`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_registries` ADD CONSTRAINT `annual_registries_login_id_fkey` FOREIGN KEY (`login_id`) REFERENCES `logins`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_registry_audits` ADD CONSTRAINT `annual_registry_audits_annual_registry_id_fkey` FOREIGN KEY (`annual_registry_id`) REFERENCES `annual_registries`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_registry_audits` ADD CONSTRAINT `annual_registry_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_configurators`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teachers` ADD CONSTRAINT `teachers_login_id_fkey` FOREIGN KEY (`login_id`) REFERENCES `logins`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teachers` ADD CONSTRAINT `teachers_teacher_type_id_fkey` FOREIGN KEY (`teacher_type_id`) REFERENCES `teacher_types`(`teacher_type_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_audits` ADD CONSTRAINT `teacher_audits_teacher_type_id_fkey` FOREIGN KEY (`teacher_type_id`) REFERENCES `teacher_types`(`teacher_type_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_audits` ADD CONSTRAINT `teacher_audits_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_audits` ADD CONSTRAINT `teacher_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_configurators`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_teachers` ADD CONSTRAINT `annual_teachers_teaching_grade_id_fkey` FOREIGN KEY (`teaching_grade_id`) REFERENCES `teaching_grades`(`teaching_grade_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_teachers` ADD CONSTRAINT `annual_teachers_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_teachers` ADD CONSTRAINT `annual_teachers_login_id_fkey` FOREIGN KEY (`login_id`) REFERENCES `teachers`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_teachers` ADD CONSTRAINT `annual_teachers_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_configurators`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_teacher_audits` ADD CONSTRAINT `annual_teacher_audits_annual_teacher_id_fkey` FOREIGN KEY (`annual_teacher_id`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_teacher_audits` ADD CONSTRAINT `annual_teacher_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_configurators`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `departments` ADD CONSTRAINT `departments_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_configurators`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `departments` ADD CONSTRAINT `departments_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`school_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `department_audits` ADD CONSTRAINT `department_audits_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments`(`department_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `department_audits` ADD CONSTRAINT `department_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_configurators`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `majors` ADD CONSTRAINT `majors_cycle_id_fkey` FOREIGN KEY (`cycle_id`) REFERENCES `cycles`(`cycle_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `majors` ADD CONSTRAINT `majors_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_configurators`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `major_audits` ADD CONSTRAINT `major_audits_major_id_fkey` FOREIGN KEY (`major_id`) REFERENCES `majors`(`major_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `major_audits` ADD CONSTRAINT `major_audits_cycle_id_fkey` FOREIGN KEY (`cycle_id`) REFERENCES `cycles`(`cycle_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `major_audits` ADD CONSTRAINT `major_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_configurators`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_majors` ADD CONSTRAINT `annual_majors_major_id_fkey` FOREIGN KEY (`major_id`) REFERENCES `majors`(`major_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_majors` ADD CONSTRAINT `annual_majors_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments`(`department_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_majors` ADD CONSTRAINT `annual_majors_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_majors` ADD CONSTRAINT `annual_majors_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_configurators`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_major_audits` ADD CONSTRAINT `annual_major_audits_annual_major_id_fkey` FOREIGN KEY (`annual_major_id`) REFERENCES `annual_majors`(`annual_major_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_major_audits` ADD CONSTRAINT `annual_major_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_configurators`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_major_audits` ADD CONSTRAINT `annual_major_audits_teaching_system_audited_by_fkey` FOREIGN KEY (`teaching_system_audited_by`) REFERENCES `annual_registries`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classrooms` ADD CONSTRAINT `classrooms_major_id_fkey` FOREIGN KEY (`major_id`) REFERENCES `majors`(`major_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classrooms` ADD CONSTRAINT `classrooms_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_configurators`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_classrooms` ADD CONSTRAINT `annual_classrooms_classroom_id_fkey` FOREIGN KEY (`classroom_id`) REFERENCES `classrooms`(`classroom_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_classrooms` ADD CONSTRAINT `annual_classrooms_annual_major_id_fkey` FOREIGN KEY (`annual_major_id`) REFERENCES `annual_majors`(`annual_major_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_classroom_audits` ADD CONSTRAINT `annual_classroom_audits_annual_classroom_id_fkey` FOREIGN KEY (`annual_classroom_id`) REFERENCES `annual_classrooms`(`annual_classroom_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_classroom_audits` ADD CONSTRAINT `annual_classroom_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_configurators`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_classroom_divisions` ADD CONSTRAINT `annual_classroom_divisions_annual_classroom_id_fkey` FOREIGN KEY (`annual_classroom_id`) REFERENCES `annual_classrooms`(`annual_classroom_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_classroom_divisions` ADD CONSTRAINT `annual_classroom_divisions_annual_coordinator_id_fkey` FOREIGN KEY (`annual_coordinator_id`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_classroom_divisions` ADD CONSTRAINT `annual_classroom_divisions_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_configurators`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_classroom_division_audits` ADD CONSTRAINT `annual_classroom_division_audits_annual_coordinator_id_fkey` FOREIGN KEY (`annual_coordinator_id`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_classroom_division_audits` ADD CONSTRAINT `annual_classroom_division_audits_annual_classroom_division__fkey` FOREIGN KEY (`annual_classroom_division_id`) REFERENCES `annual_classroom_divisions`(`annual_classroom_division_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_classroom_division_audits` ADD CONSTRAINT `annual_classroom_division_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_configurators`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_modules` ADD CONSTRAINT `annual_modules_annual_classroom_id_fkey` FOREIGN KEY (`annual_classroom_id`) REFERENCES `annual_classrooms`(`annual_classroom_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_modules` ADD CONSTRAINT `annual_modules_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_modules` ADD CONSTRAINT `annual_modules_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_modules` ADD CONSTRAINT `annual_modules_created_from_fkey` FOREIGN KEY (`created_from`) REFERENCES `annual_subjects`(`annual_subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_module_audits` ADD CONSTRAINT `annual_module_audits_annual_module_id_fkey` FOREIGN KEY (`annual_module_id`) REFERENCES `annual_modules`(`annual_module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_module_audits` ADD CONSTRAINT `annual_module_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_subjects` ADD CONSTRAINT `annual_subjects_annual_module_id_fkey` FOREIGN KEY (`annual_module_id`) REFERENCES `annual_modules`(`annual_module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_subjects` ADD CONSTRAINT `annual_subjects_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_subject_audits` ADD CONSTRAINT `annual_subject_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_subject_audits` ADD CONSTRAINT `annual_subject_audits_annual_subject_id_fkey` FOREIGN KEY (`annual_subject_id`) REFERENCES `annual_subjects`(`annual_subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_subject_parts` ADD CONSTRAINT `annual_subject_parts_subject_part_id_fkey` FOREIGN KEY (`subject_part_id`) REFERENCES `subject_parts`(`subject_part_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_subject_parts` ADD CONSTRAINT `annual_subject_parts_annual_subject_id_fkey` FOREIGN KEY (`annual_subject_id`) REFERENCES `annual_subjects`(`annual_subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_subject_parts` ADD CONSTRAINT `annual_subject_parts_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_subject_part_audits` ADD CONSTRAINT `annual_subject_part_audits_annual_subject_part_id_fkey` FOREIGN KEY (`annual_subject_part_id`) REFERENCES `annual_subject_parts`(`annual_subject_part_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_subject_part_audits` ADD CONSTRAINT `annual_subject_part_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_module_settings` ADD CONSTRAINT `annual_module_settings_cycle_id_fkey` FOREIGN KEY (`cycle_id`) REFERENCES `cycles`(`cycle_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_module_settings` ADD CONSTRAINT `annual_module_settings_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_module_settings` ADD CONSTRAINT `annual_module_settings_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_registries`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_module_settings_audits` ADD CONSTRAINT `annual_module_settings_audits_annual_module_setting_id_fkey` FOREIGN KEY (`annual_module_setting_id`) REFERENCES `annual_module_settings`(`annual_module_setting_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_module_settings_audits` ADD CONSTRAINT `annual_module_settings_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_registries`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_evaluation_types` ADD CONSTRAINT `annual_evaluation_types_cycle_id_fkey` FOREIGN KEY (`cycle_id`) REFERENCES `cycles`(`cycle_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_evaluation_types` ADD CONSTRAINT `annual_evaluation_types_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_evaluation_types` ADD CONSTRAINT `annual_evaluation_types_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_registries`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_evaluation_type_audits` ADD CONSTRAINT `annual_evaluation_type_audits_annual_evaluation_type_id_fkey` FOREIGN KEY (`annual_evaluation_type_id`) REFERENCES `annual_evaluation_types`(`annual_evaluation_type_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_evaluation_type_audits` ADD CONSTRAINT `annual_evaluation_type_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_registries`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_evaluation_subtypes` ADD CONSTRAINT `annual_evaluation_subtypes_annual_evaluation_type_id_fkey` FOREIGN KEY (`annual_evaluation_type_id`) REFERENCES `annual_evaluation_types`(`annual_evaluation_type_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_evaluation_subtypes` ADD CONSTRAINT `annual_evaluation_subtypes_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_registries`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_evaluation_subtype_audits` ADD CONSTRAINT `annual_evaluation_subtype_audits_annual_evaluation_subtype__fkey` FOREIGN KEY (`annual_evaluation_subtype_id`) REFERENCES `annual_evaluation_subtypes`(`annual_evaluation_subtype_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_evaluation_subtype_audits` ADD CONSTRAINT `annual_evaluation_subtype_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_registries`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_weightings` ADD CONSTRAINT `annual_weightings_cycle_id_fkey` FOREIGN KEY (`cycle_id`) REFERENCES `cycles`(`cycle_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_weightings` ADD CONSTRAINT `annual_weightings_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_weightings` ADD CONSTRAINT `annual_weightings_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_registries`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_weighting_audits` ADD CONSTRAINT `annual_weighting_audits_annual_weighting_id_fkey` FOREIGN KEY (`annual_weighting_id`) REFERENCES `annual_weightings`(`annual_weighting_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_weighting_audits` ADD CONSTRAINT `annual_weighting_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_registries`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_grade_weightings` ADD CONSTRAINT `annual_grade_weightings_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_grade_weightings` ADD CONSTRAINT `annual_grade_weightings_cycle_id_fkey` FOREIGN KEY (`cycle_id`) REFERENCES `cycles`(`cycle_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_grade_weightings` ADD CONSTRAINT `annual_grade_weightings_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_registries`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_grade_weighting_audits` ADD CONSTRAINT `annual_grade_weighting_audits_annual_grade_weighting_id_fkey` FOREIGN KEY (`annual_grade_weighting_id`) REFERENCES `annual_grade_weightings`(`annual_grade_weighting_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_grade_weighting_audits` ADD CONSTRAINT `annual_grade_weighting_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_registries`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_academic_profiles` ADD CONSTRAINT `annual_academic_profiles_cycle_id_fkey` FOREIGN KEY (`cycle_id`) REFERENCES `cycles`(`cycle_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_academic_profiles` ADD CONSTRAINT `annual_academic_profiles_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_academic_profiles` ADD CONSTRAINT `annual_academic_profiles_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_registries`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_academic_profile_audits` ADD CONSTRAINT `annual_academic_profile_audits_annual_academic_profile_id_fkey` FOREIGN KEY (`annual_academic_profile_id`) REFERENCES `annual_academic_profiles`(`annual_academic_profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_academic_profile_audits` ADD CONSTRAINT `annual_academic_profile_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_registries`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_semester_exam_accesses` ADD CONSTRAINT `annual_semester_exam_accesses_cycle_id_fkey` FOREIGN KEY (`cycle_id`) REFERENCES `cycles`(`cycle_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_semester_exam_accesses` ADD CONSTRAINT `annual_semester_exam_accesses_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_semester_exam_accesses` ADD CONSTRAINT `annual_semester_exam_accesses_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_registries`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_semester_exam_access_audits` ADD CONSTRAINT `annual_semester_exam_access_audits_annual_semester_exam_acc_fkey` FOREIGN KEY (`annual_semester_exam_access_id`) REFERENCES `annual_semester_exam_accesses`(`annual_semester_exam_access_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_semester_exam_access_audits` ADD CONSTRAINT `annual_semester_exam_access_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_registries`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evaluations` ADD CONSTRAINT `evaluations_annual_evaluation_subtype_id_fkey` FOREIGN KEY (`annual_evaluation_subtype_id`) REFERENCES `annual_evaluation_subtypes`(`annual_evaluation_subtype_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evaluations` ADD CONSTRAINT `evaluations_annual_subject_id_fkey` FOREIGN KEY (`annual_subject_id`) REFERENCES `annual_subjects`(`annual_subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evaluations` ADD CONSTRAINT `evaluations_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evaluations` ADD CONSTRAINT `evaluations_published_by_fkey` FOREIGN KEY (`published_by`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evaluations` ADD CONSTRAINT `evaluations_anonimated_by_fkey` FOREIGN KEY (`anonimated_by`) REFERENCES `annual_registries`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evaluation_audits` ADD CONSTRAINT `evaluation_audits_evaluation_id_fkey` FOREIGN KEY (`evaluation_id`) REFERENCES `evaluations`(`evaluation_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evaluation_audits` ADD CONSTRAINT `evaluation_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evaluation_has_students` ADD CONSTRAINT `evaluation_has_students_evaluation_id_fkey` FOREIGN KEY (`evaluation_id`) REFERENCES `evaluations`(`evaluation_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evaluation_has_students` ADD CONSTRAINT `evaluation_has_students_annual_student_id_fkey` FOREIGN KEY (`annual_student_id`) REFERENCES `annual_students`(`annual_student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evaluation_has_students` ADD CONSTRAINT `evaluation_has_students_ref_evaluation_has_student_id_fkey` FOREIGN KEY (`ref_evaluation_has_student_id`) REFERENCES `evaluation_has_students`(`evaluation_has_student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evaluation_has_student_audits` ADD CONSTRAINT `evaluation_has_student_audits_evaluation_has_student_id_fkey` FOREIGN KEY (`evaluation_has_student_id`) REFERENCES `evaluation_has_students`(`evaluation_has_student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evaluation_has_student_audits` ADD CONSTRAINT `evaluation_has_student_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chapters` ADD CONSTRAINT `chapters_annual_subject_id_fkey` FOREIGN KEY (`annual_subject_id`) REFERENCES `annual_subjects`(`annual_subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chapters` ADD CONSTRAINT `chapters_chapter_parent_id_fkey` FOREIGN KEY (`chapter_parent_id`) REFERENCES `chapters`(`chapter_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chapters` ADD CONSTRAINT `chapters_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chapter_audits` ADD CONSTRAINT `chapter_audits_chapter_id_fkey` FOREIGN KEY (`chapter_id`) REFERENCES `chapters`(`chapter_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chapter_audits` ADD CONSTRAINT `chapter_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resources` ADD CONSTRAINT `resources_chapter_id_fkey` FOREIGN KEY (`chapter_id`) REFERENCES `chapters`(`chapter_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resources` ADD CONSTRAINT `resources_annual_subject_id_fkey` FOREIGN KEY (`annual_subject_id`) REFERENCES `annual_subjects`(`annual_subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resources` ADD CONSTRAINT `resources_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resource_audits` ADD CONSTRAINT `resource_audits_resource_id_fkey` FOREIGN KEY (`resource_id`) REFERENCES `resources`(`resource_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resource_audits` ADD CONSTRAINT `resource_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assessments` ADD CONSTRAINT `assessments_annual_subject_id_fkey` FOREIGN KEY (`annual_subject_id`) REFERENCES `annual_subjects`(`annual_subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assessments` ADD CONSTRAINT `assessments_chapter_id_fkey` FOREIGN KEY (`chapter_id`) REFERENCES `chapters`(`chapter_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assessments` ADD CONSTRAINT `assessments_evaluation_id_fkey` FOREIGN KEY (`evaluation_id`) REFERENCES `evaluations`(`evaluation_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assessments` ADD CONSTRAINT `assessments_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assessment_audits` ADD CONSTRAINT `assessment_audits_assessment_id_fkey` FOREIGN KEY (`assessment_id`) REFERENCES `assessments`(`assessment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assessment_audits` ADD CONSTRAINT `assessment_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `questions` ADD CONSTRAINT `questions_assessment_id_fkey` FOREIGN KEY (`assessment_id`) REFERENCES `assessments`(`assessment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `questions` ADD CONSTRAINT `questions_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `question_audits` ADD CONSTRAINT `question_audits_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `questions`(`question_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `question_audits` ADD CONSTRAINT `question_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `question_resources` ADD CONSTRAINT `question_resources_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `questions`(`question_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `question_resources` ADD CONSTRAINT `question_resources_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `question_resources` ADD CONSTRAINT `question_resources_deleted_by_fkey` FOREIGN KEY (`deleted_by`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `question_options` ADD CONSTRAINT `question_options_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `questions`(`question_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `question_options` ADD CONSTRAINT `question_options_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `question_option_audits` ADD CONSTRAINT `question_option_audits_question_option_id_fkey` FOREIGN KEY (`question_option_id`) REFERENCES `question_options`(`question_option_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `question_option_audits` ADD CONSTRAINT `question_option_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_student_take_assessments` ADD CONSTRAINT `annual_student_take_assessments_annual_student_id_fkey` FOREIGN KEY (`annual_student_id`) REFERENCES `annual_students`(`annual_student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_student_take_assessments` ADD CONSTRAINT `annual_student_take_assessments_assessment_id_fkey` FOREIGN KEY (`assessment_id`) REFERENCES `assessments`(`assessment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_student_answer_questions` ADD CONSTRAINT `annual_student_answer_questions_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `questions`(`question_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_student_answer_questions` ADD CONSTRAINT `annual_student_answer_questions_answered_option_id_fkey` FOREIGN KEY (`answered_option_id`) REFERENCES `question_options`(`question_option_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_student_answer_questions` ADD CONSTRAINT `annual_student_answer_questions_annual_student_take_assessm_fkey` FOREIGN KEY (`annual_student_take_assessment_id`) REFERENCES `annual_student_take_assessments`(`annual_student_take_assessment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_student_answer_questions` ADD CONSTRAINT `annual_student_answer_questions_corrected_by_fkey` FOREIGN KEY (`corrected_by`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_student_answer_question_audits` ADD CONSTRAINT `annual_student_answer_question_audits_annual_student_answer_fkey` FOREIGN KEY (`annual_student_answer_question_id`) REFERENCES `annual_student_answer_questions`(`annual_student_answer_question_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_student_answer_question_audits` ADD CONSTRAINT `annual_student_answer_question_audits_previous_auditer_fkey` FOREIGN KEY (`previous_auditer`) REFERENCES `annual_student_take_assessments`(`annual_student_take_assessment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_student_answer_question_audits` ADD CONSTRAINT `annual_student_answer_question_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_student_take_assessments`(`annual_student_take_assessment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_student_has_modules` ADD CONSTRAINT `annual_student_has_modules_annual_student_id_fkey` FOREIGN KEY (`annual_student_id`) REFERENCES `annual_students`(`annual_student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annual_student_has_modules` ADD CONSTRAINT `annual_student_has_modules_annual_module_id_fkey` FOREIGN KEY (`annual_module_id`) REFERENCES `annual_modules`(`annual_module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `presence_lists` ADD CONSTRAINT `presence_lists_annual_subject_id_fkey` FOREIGN KEY (`annual_subject_id`) REFERENCES `annual_subjects`(`annual_subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `presence_list_audits` ADD CONSTRAINT `presence_list_audits_presence_list_id_fkey` FOREIGN KEY (`presence_list_id`) REFERENCES `presence_lists`(`presence_list_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `presence_list_audits` ADD CONSTRAINT `presence_list_audits_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `presence_list_has_chapters` ADD CONSTRAINT `presence_list_has_chapters_presence_list_id_fkey` FOREIGN KEY (`presence_list_id`) REFERENCES `presence_lists`(`presence_list_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `presence_list_has_chapters` ADD CONSTRAINT `presence_list_has_chapters_chapter_id_fkey` FOREIGN KEY (`chapter_id`) REFERENCES `chapters`(`chapter_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `presence_list_has_chapters` ADD CONSTRAINT `presence_list_has_chapters_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `presence_list_has_chapters` ADD CONSTRAINT `presence_list_has_chapters_deleted_by_fkey` FOREIGN KEY (`deleted_by`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `presence_list_has_annual_module_students` ADD CONSTRAINT `presence_list_has_annual_module_students_annual_student_has_fkey` FOREIGN KEY (`annual_student_has_module_id`) REFERENCES `annual_student_has_modules`(`annual_student_has_module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `presence_list_has_annual_module_students` ADD CONSTRAINT `presence_list_has_annual_module_students_presence_list_id_fkey` FOREIGN KEY (`presence_list_id`) REFERENCES `presence_lists`(`presence_list_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `presence_list_has_annual_module_students` ADD CONSTRAINT `presence_list_has_annual_module_students_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `presence_list_has_annual_module_students` ADD CONSTRAINT `presence_list_has_annual_module_students_deleted_by_fkey` FOREIGN KEY (`deleted_by`) REFERENCES `annual_teachers`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_payments` ADD CONSTRAINT `student_payments_payment_id_fkey` FOREIGN KEY (`payment_id`) REFERENCES `payments`(`payment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_payments` ADD CONSTRAINT `student_payments_annual_student_id_fkey` FOREIGN KEY (`annual_student_id`) REFERENCES `annual_students`(`annual_student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_payments` ADD CONSTRAINT `student_payments_paid_by_fkey` FOREIGN KEY (`paid_by`) REFERENCES `logins`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assignment_group_members` ADD CONSTRAINT `assignment_group_members_assessment_id_fkey` FOREIGN KEY (`assessment_id`) REFERENCES `assessments`(`assessment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `assignment_group_members` ADD CONSTRAINT `assignment_group_members_annual_student_take_assessment_id_fkey` FOREIGN KEY (`annual_student_take_assessment_id`) REFERENCES `annual_student_take_assessments`(`annual_student_take_assessment_id`) ON DELETE CASCADE ON UPDATE CASCADE;
