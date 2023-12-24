-- CreateTable
CREATE TABLE `Payment` (
    `payment_id` VARCHAR(36) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `payment_ref` VARCHAR(199) NOT NULL,
    `provider` ENUM('Stripe', 'NotchPay') NOT NULL,
    `payment_reason` ENUM('Fee', 'Platform', 'Onboarding', 'Registration') NOT NULL,

    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Inquiry` (
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
CREATE TABLE `PlatformSettings` (
    `platform_settings_id` VARCHAR(36) NOT NULL,
    `platform_fee` DOUBLE NOT NULL DEFAULT 3300,
    `onboarding_fee` DOUBLE NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` VARCHAR(36) NULL,

    PRIMARY KEY (`platform_settings_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlatformSettingsAudit` (
    `platform_settings_audit_id` VARCHAR(36) NOT NULL,
    `onboarding_fee` DOUBLE NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `platform_settings_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`platform_settings_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Person` (
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

    UNIQUE INDEX `Person_phone_number_key`(`phone_number`),
    UNIQUE INDEX `Person_email_key`(`email`),
    FULLTEXT INDEX `Person_first_name_last_name_idx`(`first_name`, `last_name`),
    FULLTEXT INDEX `Person_email_first_name_last_name_idx`(`email`, `first_name`, `last_name`),
    PRIMARY KEY (`person_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PersonAudit` (
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
CREATE TABLE `School` (
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

    UNIQUE INDEX `School_school_code_key`(`school_code`),
    UNIQUE INDEX `School_school_email_key`(`school_email`),
    FULLTEXT INDEX `School_school_name_idx`(`school_name`),
    FULLTEXT INDEX `School_school_name_address_idx`(`school_name`, `address`),
    PRIMARY KEY (`school_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SchoolAudit` (
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

    UNIQUE INDEX `SchoolAudit_school_email_key`(`school_email`),
    PRIMARY KEY (`school_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualSchoolSetting` (
    `annual_school_setting_id` VARCHAR(36) NOT NULL,
    `can_pay_fee` BOOLEAN NOT NULL DEFAULT false,
    `mark_insertion_source` ENUM('Teacher', 'Registry') NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `academic_year_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `AnnualSchoolSetting_academic_year_id_key`(`academic_year_id`),
    PRIMARY KEY (`annual_school_setting_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualSchoolSettingAudit` (
    `annual_school_setting_audit_id` VARCHAR(36) NOT NULL,
    `can_pay_fee` BOOLEAN NOT NULL,
    `mark_insertion_source` ENUM('Teacher', 'Registry') NOT NULL,
    `annual_school_setting_id` VARCHAR(36) NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_school_setting_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualDocumentSigner` (
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
CREATE TABLE `Ambassador` (
    `ambassador_id` VARCHAR(36) NOT NULL,
    `referral_code` VARCHAR(36) NOT NULL,
    `login_id` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `Ambassador_referral_code_key`(`referral_code`),
    PRIMARY KEY (`ambassador_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SchoolDemand` (
    `school_demand_id` VARCHAR(36) NOT NULL,
    `demand_status` ENUM('PENDING', 'PROCESSING', 'REJECTED', 'VALIDATED', 'SUSPENDED') NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `rejection_reason` TEXT NULL,
    `payment_id` VARCHAR(36) NULL,
    `school_id` VARCHAR(191) NOT NULL,
    `ambassador_id` VARCHAR(36) NULL,

    UNIQUE INDEX `SchoolDemand_payment_id_key`(`payment_id`),
    UNIQUE INDEX `SchoolDemand_school_id_key`(`school_id`),
    PRIMARY KEY (`school_demand_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SchoolDemandAudit` (
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
CREATE TABLE `AcademicYear` (
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

    UNIQUE INDEX `AcademicYear_year_code_key`(`year_code`),
    PRIMARY KEY (`academic_year_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Login` (
    `login_id` VARCHAR(36) NOT NULL,
    `password` VARCHAR(75) NOT NULL,
    `is_parent` BOOLEAN NOT NULL DEFAULT false,
    `is_personnel` BOOLEAN NOT NULL DEFAULT false,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `person_id` VARCHAR(36) NOT NULL,
    `school_id` VARCHAR(36) NULL,

    UNIQUE INDEX `Login_person_id_school_id_key`(`person_id`, `school_id`),
    PRIMARY KEY (`login_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualConfigurator` (
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

    UNIQUE INDEX `AnnualConfigurator_login_id_academic_year_id_key`(`login_id`, `academic_year_id`),
    PRIMARY KEY (`annual_configurator_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoginAudit` (
    `login_audit_id` VARCHAR(36) NOT NULL,
    `password` VARCHAR(75) NOT NULL,
    `is_personnel` BOOLEAN NOT NULL,
    `is_deleted` BOOLEAN NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `login_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`login_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student` (
    `student_id` VARCHAR(36) NOT NULL,
    `matricule` VARCHAR(45) NOT NULL,
    `classroom_id` VARCHAR(36) NOT NULL,
    `login_id` VARCHAR(36) NOT NULL,
    `tutor_id` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `Student_login_id_classroom_id_key`(`login_id`, `classroom_id`),
    PRIMARY KEY (`student_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualStudent` (
    `annual_student_id` VARCHAR(36) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `student_id` VARCHAR(191) NOT NULL,
    `annual_classroom_division_id` VARCHAR(36) NOT NULL,
    `academic_year_id` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `AnnualStudent_student_id_academic_year_id_key`(`student_id`, `academic_year_id`),
    PRIMARY KEY (`annual_student_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualRegistry` (
    `annual_registry_id` VARCHAR(36) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `matricule` VARCHAR(75) NOT NULL,
    `private_code` VARCHAR(75) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `academic_year_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(191) NOT NULL,
    `login_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `AnnualRegistry_login_id_matricule_key`(`login_id`, `matricule`),
    UNIQUE INDEX `AnnualRegistry_login_id_academic_year_id_key`(`login_id`, `academic_year_id`),
    PRIMARY KEY (`annual_registry_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualRegistryAudit` (
    `annual_registry_audit_id` VARCHAR(36) NOT NULL,
    `private_code` VARCHAR(75) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL,
    `annual_registry_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_registry_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeacherType` (
    `teacher_type_id` VARCHAR(36) NOT NULL,
    `teacher_type` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`teacher_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeachingGrade` (
    `teaching_grade_id` VARCHAR(36) NOT NULL,
    `teaching_grade` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`teaching_grade_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Teacher` (
    `teacher_id` VARCHAR(36) NOT NULL,
    `has_tax_payers_card` BOOLEAN NOT NULL DEFAULT false,
    `tax_payer_card_number` VARCHAR(191) NULL,
    `matricule` VARCHAR(75) NOT NULL,
    `private_code` VARCHAR(75) NOT NULL,
    `login_id` VARCHAR(36) NOT NULL,
    `teacher_type_id` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `Teacher_login_id_key`(`login_id`),
    PRIMARY KEY (`teacher_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeacherAudit` (
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
CREATE TABLE `AnnualTeacher` (
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

    UNIQUE INDEX `AnnualTeacher_login_id_academic_year_id_key`(`login_id`, `academic_year_id`),
    PRIMARY KEY (`annual_teacher_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualTeacherAudit` (
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
CREATE TABLE `Log` (
    `log_id` VARCHAR(36) NOT NULL,
    `auth_method` ENUM('LOCAL', 'GOOGLE') NOT NULL DEFAULT 'LOCAL',
    `user_agent` VARCHAR(191) NOT NULL,
    `logged_in_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `logged_out_at` DATETIME(0) NULL,
    `closed_at` DATETIME(0) NULL,
    `login_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`log_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResetPassword` (
    `reset_password_id` VARCHAR(36) NOT NULL,
    `expires_at` DATETIME(0) NOT NULL,
    `is_valid` BOOLEAN NOT NULL DEFAULT true,
    `login_id` VARCHAR(36) NOT NULL,
    `generated_by_confiigurator` VARCHAR(36) NULL,
    `generated_by_admin` VARCHAR(36) NULL,

    PRIMARY KEY (`reset_password_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Department` (
    `department_id` VARCHAR(36) NOT NULL,
    `department_name` VARCHAR(45) NOT NULL,
    `department_acronym` VARCHAR(45) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` VARCHAR(36) NOT NULL,
    `school_id` VARCHAR(36) NOT NULL,

    FULLTEXT INDEX `Department_department_name_idx`(`department_name`),
    FULLTEXT INDEX `Department_department_name_department_acronym_idx`(`department_name`, `department_acronym`),
    PRIMARY KEY (`department_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DepartmentAudit` (
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
CREATE TABLE `Cycle` (
    `cycle_id` VARCHAR(36) NOT NULL,
    `cycle_name` ENUM('HND', 'DUT', 'DTS', 'BACHELOR', 'MASTER', 'DOCTORATE') NOT NULL,
    `number_of_years` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`cycle_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Major` (
    `major_id` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `cycle_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`major_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MajorAudit` (
    `major_audit_id` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `major_id` VARCHAR(36) NOT NULL,
    `cycle_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`major_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualMajor` (
    `annual_major_id` VARCHAR(36) NOT NULL,
    `major_name` VARCHAR(45) NOT NULL,
    `major_acronym` VARCHAR(45) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `major_id` VARCHAR(36) NOT NULL,
    `department_id` VARCHAR(36) NOT NULL,
    `academic_year_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    FULLTEXT INDEX `AnnualMajor_major_name_idx`(`major_name`),
    FULLTEXT INDEX `AnnualMajor_major_name_major_acronym_idx`(`major_name`, `major_acronym`),
    PRIMARY KEY (`annual_major_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualMajorAudit` (
    `annual_major_audit_id` VARCHAR(36) NOT NULL,
    `major_name` VARCHAR(45) NOT NULL,
    `major_acronym` VARCHAR(45) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_major_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_major_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Classroom` (
    `classroom_id` VARCHAR(36) NOT NULL,
    `classroom_level` INTEGER NOT NULL,
    `major_id` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`classroom_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualClassroom` (
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
CREATE TABLE `AnnualClassroomAudit` (
    `annual_classroom_audit_id` VARCHAR(36) NOT NULL,
    `number_of_divisions` INTEGER NOT NULL,
    `is_deleted` BOOLEAN NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_classroom_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_classroom_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualClassroomDivision` (
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
CREATE TABLE `AnnualClassroomDivisionAudit` (
    `annual_classroom_division_audit_id` VARCHAR(36) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_coordinator_id` VARCHAR(36) NULL,
    `annual_classroom_division_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_classroom_division_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualModule` (
    `annual_module_id` VARCHAR(36) NOT NULL,
    `module_code` VARCHAR(45) NOT NULL,
    `module_name` VARCHAR(45) NOT NULL,
    `credit_points` INTEGER NOT NULL,
    `semester_number` INTEGER NOT NULL,
    `is_exam_published` BOOLEAN NOT NULL DEFAULT false,
    `is_resit_published` BOOLEAN NOT NULL DEFAULT false,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_major_id` VARCHAR(36) NOT NULL,
    `academic_year_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_module_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualModuleAudit` (
    `annual_module_audit_id` VARCHAR(36) NOT NULL,
    `module_code` VARCHAR(45) NOT NULL,
    `module_name` VARCHAR(45) NOT NULL,
    `credit_points` INTEGER NOT NULL,
    `semester_number` INTEGER NOT NULL,
    `is_exam_published` BOOLEAN NOT NULL,
    `is_resit_published` BOOLEAN NOT NULL,
    `is_deleted` BOOLEAN NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_module_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_module_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubjectPart` (
    `subject_part_id` VARCHAR(36) NOT NULL,
    `subject_part_name` VARCHAR(45) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`subject_part_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualSubject` (
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
CREATE TABLE `AnnualSubjectAudit` (
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
CREATE TABLE `AnnualSubjectPart` (
    `annual_subject_part_id` VARCHAR(36) NOT NULL,
    `number_of_hours` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `subject_part_id` VARCHAR(36) NOT NULL,
    `annual_subject_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_subject_part_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualSubjectPartAudit` (
    `annual_subject_part_audit_id` VARCHAR(36) NOT NULL,
    `number_of_hours` INTEGER NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_subject_part_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_subject_part_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualCarryOverSytem` (
    `annual_carry_over_system_id` VARCHAR(36) NOT NULL,
    `carry_over_system` ENUM('SUBJECT', 'MODULE') NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `academic_year_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `AnnualCarryOverSytem_academic_year_id_key`(`academic_year_id`),
    PRIMARY KEY (`annual_carry_over_system_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualCarryOverSytemAudit` (
    `annual_carry_over_system_audit_id` VARCHAR(36) NOT NULL,
    `carry_over_system` ENUM('SUBJECT', 'MODULE') NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_carry_over_system_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_carry_over_system_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualMinimumModulationScore` (
    `annual_minimum_modulation_score_id` VARCHAR(36) NOT NULL,
    `score` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `cycle_id` VARCHAR(36) NOT NULL,
    `academic_year_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `AnnualMinimumModulationScore_academic_year_id_cycle_id_key`(`academic_year_id`, `cycle_id`),
    PRIMARY KEY (`annual_minimum_modulation_score_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualMinimumModulationScoreAudit` (
    `annual_minimum_modulation_score_audit_id` VARCHAR(36) NOT NULL,
    `score` INTEGER NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_minimum_modulation_score_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_minimum_modulation_score_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EvaluationType` (
    `evaluation_type_id` VARCHAR(36) NOT NULL,
    `evaluation_type` ENUM('CA', 'EXAM') NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`evaluation_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualEvaluationTypeWeighting` (
    `annual_evaluation_type_weighting_id` VARCHAR(36) NOT NULL,
    `weight` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `cycle_id` VARCHAR(36) NOT NULL,
    `academic_year_id` VARCHAR(36) NOT NULL,
    `evaluation_type_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `AnnualEvaluationTypeWeighting_academic_year_id_evaluation_ty_key`(`academic_year_id`, `evaluation_type_id`, `cycle_id`),
    PRIMARY KEY (`annual_evaluation_type_weighting_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualEvaluationTypeWeightingAudit` (
    `annual_evaluation_type_weighting_audit_id` VARCHAR(36) NOT NULL,
    `weight` INTEGER NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_evaluation_type_weighting_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_evaluation_type_weighting_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualEvaluationSubType` (
    `annual_evaluation_sub_type_id` VARCHAR(36) NOT NULL,
    `evaluation_sub_type_name` ENUM('CA', 'EXAM', 'RESIT', 'PRACTICAL', 'ASSIGNMENT', 'GUIDED_WORK') NOT NULL,
    `evaluation_sub_type_weight` INTEGER NOT NULL,
    `academic_year_id` VARCHAR(36) NOT NULL,
    `evaluation_type_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_evaluation_sub_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualEvaluationSubTypeAudit` (
    `annual_evaluation_sub_type_audit_id` VARCHAR(36) NOT NULL,
    `evaluation_sub_type_name` VARCHAR(45) NOT NULL,
    `evaluation_sub_type_weight` INTEGER NOT NULL,
    `annual_evaluation_sub_type_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_evaluation_sub_type_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualWeighting` (
    `annual_weighting_id` VARCHAR(36) NOT NULL,
    `weighting_system` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `academic_year_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `AnnualWeighting_academic_year_id_key`(`academic_year_id`),
    PRIMARY KEY (`annual_weighting_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualWeightingAudit` (
    `annual_weighting_audit_id` VARCHAR(36) NOT NULL,
    `weighting_system` INTEGER NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_weighting_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_weighting_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Grade` (
    `grade_id` VARCHAR(36) NOT NULL,
    `grade_value` VARCHAR(5) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`grade_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualGradeWeighting` (
    `annual_grade_weighting_id` VARCHAR(36) NOT NULL,
    `minimum` INTEGER NOT NULL,
    `maximum` INTEGER NOT NULL,
    `point` DOUBLE NOT NULL,
    `observation` MEDIUMTEXT NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `academic_year_id` VARCHAR(36) NOT NULL,
    `cycle_id` VARCHAR(36) NOT NULL,
    `grade_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_grade_weighting_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualGradeWeightingAudit` (
    `annual_grade_weighting_audit_id` VARCHAR(36) NOT NULL,
    `minimum` INTEGER NOT NULL,
    `maximum` INTEGER NOT NULL,
    `point` DOUBLE NOT NULL,
    `observation` MEDIUMTEXT NOT NULL,
    `is_deleted` BOOLEAN NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_grade_weighting_id` VARCHAR(36) NOT NULL,
    `grade_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_grade_weighting_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualAcademicProfile` (
    `annual_academic_profile_id` VARCHAR(36) NOT NULL,
    `minimum_score` DOUBLE NOT NULL,
    `maximum_score` DOUBLE NOT NULL,
    `comment` VARCHAR(25) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `academic_year_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_academic_profile_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualAcademicProfileAudit` (
    `annual_academic_profile_audit_id` VARCHAR(36) NOT NULL,
    `minimum_score` DOUBLE NOT NULL,
    `maximum_score` DOUBLE NOT NULL,
    `comment` VARCHAR(25) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_academic_profile_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_academic_profile_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualSemesterExamAcess` (
    `annual_semester_exam_access_id` VARCHAR(36) NOT NULL,
    `payment_percentage` INTEGER NOT NULL,
    `annual_semester_number` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `academic_year_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `AnnualSemesterExamAcess_academic_year_id_annual_semester_num_key`(`academic_year_id`, `annual_semester_number`),
    PRIMARY KEY (`annual_semester_exam_access_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualSemesterExamAcessAudit` (
    `annual_semester_exam_access_audit_id` VARCHAR(36) NOT NULL,
    `payment_percentage` INTEGER NOT NULL,
    `annual_semester_number` INTEGER NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_semester_exam_access_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_semester_exam_access_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Evaluation` (
    `evaluation_id` VARCHAR(36) NOT NULL,
    `examination_date` DATETIME(0) NULL,
    `annual_evaluation_sub_type_id` VARCHAR(36) NOT NULL,
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
CREATE TABLE `EvaluationAudit` (
    `evaluation_audit_id` VARCHAR(36) NOT NULL,
    `examination_date` DATETIME(0) NULL,
    `evaluation_id` VARCHAR(36) NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`evaluation_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EvaluationHasStudent` (
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

    UNIQUE INDEX `EvaluationHasStudent_evaluation_id_annual_student_id_key`(`evaluation_id`, `annual_student_id`),
    PRIMARY KEY (`evaluation_has_student_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EvaluationHasStudentAudit` (
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
CREATE TABLE `Chapter` (
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
CREATE TABLE `ChapterAudit` (
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
CREATE TABLE `Resource` (
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
CREATE TABLE `RessourceAudit` (
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
CREATE TABLE `Assessment` (
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

    UNIQUE INDEX `Assessment_chapter_id_key`(`chapter_id`),
    PRIMARY KEY (`assessment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AssessmentAudit` (
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
CREATE TABLE `Question` (
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
CREATE TABLE `QuestionAudit` (
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
CREATE TABLE `QuestionResource` (
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
CREATE TABLE `QuestionOption` (
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
CREATE TABLE `QuestionOptionAudit` (
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
CREATE TABLE `AnnualStudentTakeAssessment` (
    `annual_student_take_assessment_id` VARCHAR(36) NOT NULL,
    `total_score` DOUBLE NOT NULL,
    `submitted_at` DATETIME(0) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `annual_student_id` VARCHAR(36) NOT NULL,
    `assessment_id` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `AnnualStudentTakeAssessment_annual_student_id_assessment_id_key`(`annual_student_id`, `assessment_id`),
    PRIMARY KEY (`annual_student_take_assessment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualStudentAnswerQuestion` (
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
CREATE TABLE `AnnualStudentAnswerQuestionAudit` (
    `annual_student_answer_question_audit_id` VARCHAR(36) NOT NULL,
    `response` LONGTEXT NOT NULL,
    `annual_student_answer_question_id` VARCHAR(36) NOT NULL,
    `previous_auditer` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annual_student_answer_question_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualStudentHasModule` (
    `annual_student_has_module_id` VARCHAR(36) NOT NULL,
    `semester_number` INTEGER NOT NULL,
    `annual_student_id` VARCHAR(36) NOT NULL,
    `annual_module_id` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `AnnualStudentHasModule_annual_student_id_annual_module_id_key`(`annual_student_id`, `annual_module_id`),
    PRIMARY KEY (`annual_student_has_module_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PresenceList` (
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
CREATE TABLE `PresenceListAudit` (
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
CREATE TABLE `PresenceListHasChapter` (
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
CREATE TABLE `PresenceListHasModuleStudent` (
    `presence_list_has_credit_student_id` VARCHAR(36) NOT NULL,
    `annual_student_has_module_id` VARCHAR(36) NOT NULL,
    `presence_list_id` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` VARCHAR(36) NOT NULL,
    `deleted_at` DATETIME(0) NULL,
    `deleted_by` VARCHAR(36) NULL,

    PRIMARY KEY (`presence_list_has_credit_student_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `AssignmentGroupMember` (
    `assignment_group_id` VARCHAR(36) NOT NULL,
    `total_score` INTEGER NOT NULL DEFAULT 0,
    `group_code` VARCHAR(45) NOT NULL,
    `approved_at` DATETIME(0) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `assessment_id` VARCHAR(36) NOT NULL,
    `annual_student_take_assessment_id` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `AssignmentGroupMember_annual_student_take_assessment_id_asse_key`(`annual_student_take_assessment_id`, `assessment_id`),
    PRIMARY KEY (`assignment_group_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PlatformSettings` ADD CONSTRAINT `PlatformSettings_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlatformSettingsAudit` ADD CONSTRAINT `PlatformSettingsAudit_platform_settings_id_fkey` FOREIGN KEY (`platform_settings_id`) REFERENCES `PlatformSettings`(`platform_settings_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlatformSettingsAudit` ADD CONSTRAINT `PlatformSettingsAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonAudit` ADD CONSTRAINT `PersonAudit_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `Person`(`person_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PersonAudit` ADD CONSTRAINT `PersonAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `School` ADD CONSTRAINT `School_validated_by_fkey` FOREIGN KEY (`validated_by`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `School` ADD CONSTRAINT `School_deleted_by_fkey` FOREIGN KEY (`deleted_by`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `School` ADD CONSTRAINT `School_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `Person`(`person_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SchoolAudit` ADD CONSTRAINT `SchoolAudit_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `School`(`school_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SchoolAudit` ADD CONSTRAINT `SchoolAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSchoolSetting` ADD CONSTRAINT `AnnualSchoolSetting_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `AcademicYear`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSchoolSetting` ADD CONSTRAINT `AnnualSchoolSetting_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSchoolSettingAudit` ADD CONSTRAINT `AnnualSchoolSettingAudit_annual_school_setting_id_fkey` FOREIGN KEY (`annual_school_setting_id`) REFERENCES `AnnualSchoolSetting`(`annual_school_setting_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSchoolSettingAudit` ADD CONSTRAINT `AnnualSchoolSettingAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualDocumentSigner` ADD CONSTRAINT `AnnualDocumentSigner_annual_school_setting_id_fkey` FOREIGN KEY (`annual_school_setting_id`) REFERENCES `AnnualSchoolSetting`(`annual_school_setting_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualDocumentSigner` ADD CONSTRAINT `AnnualDocumentSigner_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualDocumentSigner` ADD CONSTRAINT `AnnualDocumentSigner_deleted_by_fkey` FOREIGN KEY (`deleted_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ambassador` ADD CONSTRAINT `Ambassador_login_id_fkey` FOREIGN KEY (`login_id`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SchoolDemand` ADD CONSTRAINT `SchoolDemand_payment_id_fkey` FOREIGN KEY (`payment_id`) REFERENCES `Payment`(`payment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SchoolDemand` ADD CONSTRAINT `SchoolDemand_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `School`(`school_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SchoolDemand` ADD CONSTRAINT `SchoolDemand_ambassador_id_fkey` FOREIGN KEY (`ambassador_id`) REFERENCES `Ambassador`(`ambassador_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SchoolDemandAudit` ADD CONSTRAINT `SchoolDemandAudit_ambassador_id_fkey` FOREIGN KEY (`ambassador_id`) REFERENCES `Ambassador`(`ambassador_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SchoolDemandAudit` ADD CONSTRAINT `SchoolDemandAudit_school_demand_id_fkey` FOREIGN KEY (`school_demand_id`) REFERENCES `SchoolDemand`(`school_demand_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SchoolDemandAudit` ADD CONSTRAINT `SchoolDemandAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AcademicYear` ADD CONSTRAINT `AcademicYear_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `School`(`school_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AcademicYear` ADD CONSTRAINT `AcademicYear_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Login` ADD CONSTRAINT `Login_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `Person`(`person_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Login` ADD CONSTRAINT `Login_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `School`(`school_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualConfigurator` ADD CONSTRAINT `AnnualConfigurator_login_id_fkey` FOREIGN KEY (`login_id`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualConfigurator` ADD CONSTRAINT `AnnualConfigurator_disabled_by_fkey` FOREIGN KEY (`disabled_by`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualConfigurator` ADD CONSTRAINT `AnnualConfigurator_deleted_by_fkey` FOREIGN KEY (`deleted_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualConfigurator` ADD CONSTRAINT `AnnualConfigurator_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualConfigurator` ADD CONSTRAINT `AnnualConfigurator_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `AcademicYear`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoginAudit` ADD CONSTRAINT `LoginAudit_login_id_fkey` FOREIGN KEY (`login_id`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_classroom_id_fkey` FOREIGN KEY (`classroom_id`) REFERENCES `Classroom`(`classroom_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_login_id_fkey` FOREIGN KEY (`login_id`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_tutor_id_fkey` FOREIGN KEY (`tutor_id`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualStudent` ADD CONSTRAINT `AnnualStudent_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `Student`(`student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualStudent` ADD CONSTRAINT `AnnualStudent_annual_classroom_division_id_fkey` FOREIGN KEY (`annual_classroom_division_id`) REFERENCES `AnnualClassroomDivision`(`annual_classroom_division_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualStudent` ADD CONSTRAINT `AnnualStudent_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `AcademicYear`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualRegistry` ADD CONSTRAINT `AnnualRegistry_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `AcademicYear`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualRegistry` ADD CONSTRAINT `AnnualRegistry_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualRegistry` ADD CONSTRAINT `AnnualRegistry_login_id_fkey` FOREIGN KEY (`login_id`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualRegistryAudit` ADD CONSTRAINT `AnnualRegistryAudit_annual_registry_id_fkey` FOREIGN KEY (`annual_registry_id`) REFERENCES `AnnualRegistry`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualRegistryAudit` ADD CONSTRAINT `AnnualRegistryAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Teacher` ADD CONSTRAINT `Teacher_login_id_fkey` FOREIGN KEY (`login_id`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Teacher` ADD CONSTRAINT `Teacher_teacher_type_id_fkey` FOREIGN KEY (`teacher_type_id`) REFERENCES `TeacherType`(`teacher_type_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherAudit` ADD CONSTRAINT `TeacherAudit_teacher_type_id_fkey` FOREIGN KEY (`teacher_type_id`) REFERENCES `TeacherType`(`teacher_type_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherAudit` ADD CONSTRAINT `TeacherAudit_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `Teacher`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherAudit` ADD CONSTRAINT `TeacherAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualTeacher` ADD CONSTRAINT `AnnualTeacher_teaching_grade_id_fkey` FOREIGN KEY (`teaching_grade_id`) REFERENCES `TeachingGrade`(`teaching_grade_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualTeacher` ADD CONSTRAINT `AnnualTeacher_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `AcademicYear`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualTeacher` ADD CONSTRAINT `AnnualTeacher_login_id_fkey` FOREIGN KEY (`login_id`) REFERENCES `Teacher`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualTeacher` ADD CONSTRAINT `AnnualTeacher_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualTeacherAudit` ADD CONSTRAINT `AnnualTeacherAudit_annual_teacher_id_fkey` FOREIGN KEY (`annual_teacher_id`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualTeacherAudit` ADD CONSTRAINT `AnnualTeacherAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Log` ADD CONSTRAINT `Log_login_id_fkey` FOREIGN KEY (`login_id`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResetPassword` ADD CONSTRAINT `ResetPassword_login_id_fkey` FOREIGN KEY (`login_id`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResetPassword` ADD CONSTRAINT `ResetPassword_generated_by_confiigurator_fkey` FOREIGN KEY (`generated_by_confiigurator`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResetPassword` ADD CONSTRAINT `ResetPassword_generated_by_admin_fkey` FOREIGN KEY (`generated_by_admin`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Department` ADD CONSTRAINT `Department_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Department` ADD CONSTRAINT `Department_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `School`(`school_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DepartmentAudit` ADD CONSTRAINT `DepartmentAudit_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `Department`(`department_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DepartmentAudit` ADD CONSTRAINT `DepartmentAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Major` ADD CONSTRAINT `Major_cycle_id_fkey` FOREIGN KEY (`cycle_id`) REFERENCES `Cycle`(`cycle_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Major` ADD CONSTRAINT `Major_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MajorAudit` ADD CONSTRAINT `MajorAudit_major_id_fkey` FOREIGN KEY (`major_id`) REFERENCES `Major`(`major_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MajorAudit` ADD CONSTRAINT `MajorAudit_cycle_id_fkey` FOREIGN KEY (`cycle_id`) REFERENCES `Cycle`(`cycle_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MajorAudit` ADD CONSTRAINT `MajorAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualMajor` ADD CONSTRAINT `AnnualMajor_major_id_fkey` FOREIGN KEY (`major_id`) REFERENCES `Major`(`major_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualMajor` ADD CONSTRAINT `AnnualMajor_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `Department`(`department_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualMajor` ADD CONSTRAINT `AnnualMajor_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `AcademicYear`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualMajor` ADD CONSTRAINT `AnnualMajor_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualMajorAudit` ADD CONSTRAINT `AnnualMajorAudit_annual_major_id_fkey` FOREIGN KEY (`annual_major_id`) REFERENCES `AnnualMajor`(`annual_major_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualMajorAudit` ADD CONSTRAINT `AnnualMajorAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Classroom` ADD CONSTRAINT `Classroom_major_id_fkey` FOREIGN KEY (`major_id`) REFERENCES `Major`(`major_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Classroom` ADD CONSTRAINT `Classroom_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualClassroom` ADD CONSTRAINT `AnnualClassroom_classroom_id_fkey` FOREIGN KEY (`classroom_id`) REFERENCES `Classroom`(`classroom_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualClassroom` ADD CONSTRAINT `AnnualClassroom_annual_major_id_fkey` FOREIGN KEY (`annual_major_id`) REFERENCES `AnnualMajor`(`annual_major_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualClassroomAudit` ADD CONSTRAINT `AnnualClassroomAudit_annual_classroom_id_fkey` FOREIGN KEY (`annual_classroom_id`) REFERENCES `AnnualClassroom`(`annual_classroom_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualClassroomAudit` ADD CONSTRAINT `AnnualClassroomAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualClassroomDivision` ADD CONSTRAINT `AnnualClassroomDivision_annual_classroom_id_fkey` FOREIGN KEY (`annual_classroom_id`) REFERENCES `AnnualClassroom`(`annual_classroom_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualClassroomDivision` ADD CONSTRAINT `AnnualClassroomDivision_annual_coordinator_id_fkey` FOREIGN KEY (`annual_coordinator_id`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualClassroomDivision` ADD CONSTRAINT `AnnualClassroomDivision_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualClassroomDivisionAudit` ADD CONSTRAINT `AnnualClassroomDivisionAudit_annual_coordinator_id_fkey` FOREIGN KEY (`annual_coordinator_id`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualClassroomDivisionAudit` ADD CONSTRAINT `AnnualClassroomDivisionAudit_annual_classroom_division_id_fkey` FOREIGN KEY (`annual_classroom_division_id`) REFERENCES `AnnualClassroomDivision`(`annual_classroom_division_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualClassroomDivisionAudit` ADD CONSTRAINT `AnnualClassroomDivisionAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualModule` ADD CONSTRAINT `AnnualModule_annual_major_id_fkey` FOREIGN KEY (`annual_major_id`) REFERENCES `AnnualMajor`(`annual_major_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualModule` ADD CONSTRAINT `AnnualModule_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `AcademicYear`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualModule` ADD CONSTRAINT `AnnualModule_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualModuleAudit` ADD CONSTRAINT `AnnualModuleAudit_annual_module_id_fkey` FOREIGN KEY (`annual_module_id`) REFERENCES `AnnualModule`(`annual_module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualModuleAudit` ADD CONSTRAINT `AnnualModuleAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSubject` ADD CONSTRAINT `AnnualSubject_annual_module_id_fkey` FOREIGN KEY (`annual_module_id`) REFERENCES `AnnualModule`(`annual_module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSubject` ADD CONSTRAINT `AnnualSubject_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSubjectAudit` ADD CONSTRAINT `AnnualSubjectAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSubjectAudit` ADD CONSTRAINT `AnnualSubjectAudit_annual_subject_id_fkey` FOREIGN KEY (`annual_subject_id`) REFERENCES `AnnualSubject`(`annual_subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSubjectPart` ADD CONSTRAINT `AnnualSubjectPart_subject_part_id_fkey` FOREIGN KEY (`subject_part_id`) REFERENCES `SubjectPart`(`subject_part_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSubjectPart` ADD CONSTRAINT `AnnualSubjectPart_annual_subject_id_fkey` FOREIGN KEY (`annual_subject_id`) REFERENCES `AnnualSubject`(`annual_subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSubjectPart` ADD CONSTRAINT `AnnualSubjectPart_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSubjectPartAudit` ADD CONSTRAINT `AnnualSubjectPartAudit_annual_subject_part_id_fkey` FOREIGN KEY (`annual_subject_part_id`) REFERENCES `AnnualSubjectPart`(`annual_subject_part_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSubjectPartAudit` ADD CONSTRAINT `AnnualSubjectPartAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualCarryOverSytem` ADD CONSTRAINT `AnnualCarryOverSytem_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `AcademicYear`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualCarryOverSytem` ADD CONSTRAINT `AnnualCarryOverSytem_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualCarryOverSytemAudit` ADD CONSTRAINT `AnnualCarryOverSytemAudit_annual_carry_over_system_id_fkey` FOREIGN KEY (`annual_carry_over_system_id`) REFERENCES `AnnualCarryOverSytem`(`annual_carry_over_system_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualCarryOverSytemAudit` ADD CONSTRAINT `AnnualCarryOverSytemAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualRegistry`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualMinimumModulationScore` ADD CONSTRAINT `AnnualMinimumModulationScore_cycle_id_fkey` FOREIGN KEY (`cycle_id`) REFERENCES `Cycle`(`cycle_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualMinimumModulationScore` ADD CONSTRAINT `AnnualMinimumModulationScore_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `AcademicYear`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualMinimumModulationScore` ADD CONSTRAINT `AnnualMinimumModulationScore_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualRegistry`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualMinimumModulationScoreAudit` ADD CONSTRAINT `AnnualMinimumModulationScoreAudit_annual_minimum_modulation_fkey` FOREIGN KEY (`annual_minimum_modulation_score_id`) REFERENCES `AnnualMinimumModulationScore`(`annual_minimum_modulation_score_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualMinimumModulationScoreAudit` ADD CONSTRAINT `AnnualMinimumModulationScoreAudit_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualRegistry`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualEvaluationTypeWeighting` ADD CONSTRAINT `AnnualEvaluationTypeWeighting_cycle_id_fkey` FOREIGN KEY (`cycle_id`) REFERENCES `Cycle`(`cycle_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualEvaluationTypeWeighting` ADD CONSTRAINT `AnnualEvaluationTypeWeighting_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `AcademicYear`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualEvaluationTypeWeighting` ADD CONSTRAINT `AnnualEvaluationTypeWeighting_evaluation_type_id_fkey` FOREIGN KEY (`evaluation_type_id`) REFERENCES `EvaluationType`(`evaluation_type_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualEvaluationTypeWeighting` ADD CONSTRAINT `AnnualEvaluationTypeWeighting_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualRegistry`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualEvaluationTypeWeightingAudit` ADD CONSTRAINT `AnnualEvaluationTypeWeightingAudit_annual_evaluation_type_w_fkey` FOREIGN KEY (`annual_evaluation_type_weighting_id`) REFERENCES `AnnualEvaluationTypeWeighting`(`annual_evaluation_type_weighting_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualEvaluationTypeWeightingAudit` ADD CONSTRAINT `AnnualEvaluationTypeWeightingAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualRegistry`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualEvaluationSubType` ADD CONSTRAINT `AnnualEvaluationSubType_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `AcademicYear`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualEvaluationSubType` ADD CONSTRAINT `AnnualEvaluationSubType_evaluation_type_id_fkey` FOREIGN KEY (`evaluation_type_id`) REFERENCES `EvaluationType`(`evaluation_type_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualEvaluationSubTypeAudit` ADD CONSTRAINT `AnnualEvaluationSubTypeAudit_annual_evaluation_sub_type_id_fkey` FOREIGN KEY (`annual_evaluation_sub_type_id`) REFERENCES `AnnualEvaluationSubType`(`annual_evaluation_sub_type_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualWeighting` ADD CONSTRAINT `AnnualWeighting_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `AcademicYear`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualWeighting` ADD CONSTRAINT `AnnualWeighting_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualRegistry`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualWeightingAudit` ADD CONSTRAINT `AnnualWeightingAudit_annual_weighting_id_fkey` FOREIGN KEY (`annual_weighting_id`) REFERENCES `AnnualWeighting`(`annual_weighting_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualWeightingAudit` ADD CONSTRAINT `AnnualWeightingAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualRegistry`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualGradeWeighting` ADD CONSTRAINT `AnnualGradeWeighting_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `AcademicYear`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualGradeWeighting` ADD CONSTRAINT `AnnualGradeWeighting_cycle_id_fkey` FOREIGN KEY (`cycle_id`) REFERENCES `Cycle`(`cycle_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualGradeWeighting` ADD CONSTRAINT `AnnualGradeWeighting_grade_id_fkey` FOREIGN KEY (`grade_id`) REFERENCES `Grade`(`grade_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualGradeWeighting` ADD CONSTRAINT `AnnualGradeWeighting_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualRegistry`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualGradeWeightingAudit` ADD CONSTRAINT `AnnualGradeWeightingAudit_annual_grade_weighting_id_fkey` FOREIGN KEY (`annual_grade_weighting_id`) REFERENCES `AnnualGradeWeighting`(`annual_grade_weighting_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualGradeWeightingAudit` ADD CONSTRAINT `AnnualGradeWeightingAudit_grade_id_fkey` FOREIGN KEY (`grade_id`) REFERENCES `Grade`(`grade_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualGradeWeightingAudit` ADD CONSTRAINT `AnnualGradeWeightingAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualRegistry`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualAcademicProfile` ADD CONSTRAINT `AnnualAcademicProfile_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `AcademicYear`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualAcademicProfile` ADD CONSTRAINT `AnnualAcademicProfile_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualRegistry`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualAcademicProfileAudit` ADD CONSTRAINT `AnnualAcademicProfileAudit_annual_academic_profile_id_fkey` FOREIGN KEY (`annual_academic_profile_id`) REFERENCES `AnnualAcademicProfile`(`annual_academic_profile_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualAcademicProfileAudit` ADD CONSTRAINT `AnnualAcademicProfileAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualRegistry`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSemesterExamAcess` ADD CONSTRAINT `AnnualSemesterExamAcess_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `AcademicYear`(`academic_year_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSemesterExamAcess` ADD CONSTRAINT `AnnualSemesterExamAcess_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualConfigurator`(`annual_configurator_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSemesterExamAcessAudit` ADD CONSTRAINT `AnnualSemesterExamAcessAudit_annual_semester_exam_access_id_fkey` FOREIGN KEY (`annual_semester_exam_access_id`) REFERENCES `AnnualSemesterExamAcess`(`annual_semester_exam_access_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualSemesterExamAcessAudit` ADD CONSTRAINT `AnnualSemesterExamAcessAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualRegistry`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation` ADD CONSTRAINT `Evaluation_annual_evaluation_sub_type_id_fkey` FOREIGN KEY (`annual_evaluation_sub_type_id`) REFERENCES `AnnualEvaluationSubType`(`annual_evaluation_sub_type_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation` ADD CONSTRAINT `Evaluation_annual_subject_id_fkey` FOREIGN KEY (`annual_subject_id`) REFERENCES `AnnualSubject`(`annual_subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation` ADD CONSTRAINT `Evaluation_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation` ADD CONSTRAINT `Evaluation_published_by_fkey` FOREIGN KEY (`published_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation` ADD CONSTRAINT `Evaluation_anonimated_by_fkey` FOREIGN KEY (`anonimated_by`) REFERENCES `AnnualRegistry`(`annual_registry_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EvaluationAudit` ADD CONSTRAINT `EvaluationAudit_evaluation_id_fkey` FOREIGN KEY (`evaluation_id`) REFERENCES `Evaluation`(`evaluation_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EvaluationAudit` ADD CONSTRAINT `EvaluationAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EvaluationHasStudent` ADD CONSTRAINT `EvaluationHasStudent_evaluation_id_fkey` FOREIGN KEY (`evaluation_id`) REFERENCES `Evaluation`(`evaluation_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EvaluationHasStudent` ADD CONSTRAINT `EvaluationHasStudent_annual_student_id_fkey` FOREIGN KEY (`annual_student_id`) REFERENCES `AnnualStudent`(`annual_student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EvaluationHasStudent` ADD CONSTRAINT `EvaluationHasStudent_ref_evaluation_has_student_id_fkey` FOREIGN KEY (`ref_evaluation_has_student_id`) REFERENCES `EvaluationHasStudent`(`evaluation_has_student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EvaluationHasStudentAudit` ADD CONSTRAINT `EvaluationHasStudentAudit_evaluation_has_student_id_fkey` FOREIGN KEY (`evaluation_has_student_id`) REFERENCES `EvaluationHasStudent`(`evaluation_has_student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EvaluationHasStudentAudit` ADD CONSTRAINT `EvaluationHasStudentAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chapter` ADD CONSTRAINT `Chapter_annual_subject_id_fkey` FOREIGN KEY (`annual_subject_id`) REFERENCES `AnnualSubject`(`annual_subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chapter` ADD CONSTRAINT `Chapter_chapter_parent_id_fkey` FOREIGN KEY (`chapter_parent_id`) REFERENCES `Chapter`(`chapter_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chapter` ADD CONSTRAINT `Chapter_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChapterAudit` ADD CONSTRAINT `ChapterAudit_chapter_id_fkey` FOREIGN KEY (`chapter_id`) REFERENCES `Chapter`(`chapter_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChapterAudit` ADD CONSTRAINT `ChapterAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resource` ADD CONSTRAINT `Resource_chapter_id_fkey` FOREIGN KEY (`chapter_id`) REFERENCES `Chapter`(`chapter_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resource` ADD CONSTRAINT `Resource_annual_subject_id_fkey` FOREIGN KEY (`annual_subject_id`) REFERENCES `AnnualSubject`(`annual_subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resource` ADD CONSTRAINT `Resource_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RessourceAudit` ADD CONSTRAINT `RessourceAudit_resource_id_fkey` FOREIGN KEY (`resource_id`) REFERENCES `Resource`(`resource_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RessourceAudit` ADD CONSTRAINT `RessourceAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assessment` ADD CONSTRAINT `Assessment_annual_subject_id_fkey` FOREIGN KEY (`annual_subject_id`) REFERENCES `AnnualSubject`(`annual_subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assessment` ADD CONSTRAINT `Assessment_chapter_id_fkey` FOREIGN KEY (`chapter_id`) REFERENCES `Chapter`(`chapter_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assessment` ADD CONSTRAINT `Assessment_evaluation_id_fkey` FOREIGN KEY (`evaluation_id`) REFERENCES `Evaluation`(`evaluation_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assessment` ADD CONSTRAINT `Assessment_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssessmentAudit` ADD CONSTRAINT `AssessmentAudit_assessment_id_fkey` FOREIGN KEY (`assessment_id`) REFERENCES `Assessment`(`assessment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssessmentAudit` ADD CONSTRAINT `AssessmentAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_assessment_id_fkey` FOREIGN KEY (`assessment_id`) REFERENCES `Assessment`(`assessment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuestionAudit` ADD CONSTRAINT `QuestionAudit_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `Question`(`question_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuestionAudit` ADD CONSTRAINT `QuestionAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuestionResource` ADD CONSTRAINT `QuestionResource_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `Question`(`question_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuestionResource` ADD CONSTRAINT `QuestionResource_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuestionResource` ADD CONSTRAINT `QuestionResource_deleted_by_fkey` FOREIGN KEY (`deleted_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuestionOption` ADD CONSTRAINT `QuestionOption_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `Question`(`question_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuestionOption` ADD CONSTRAINT `QuestionOption_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuestionOptionAudit` ADD CONSTRAINT `QuestionOptionAudit_question_option_id_fkey` FOREIGN KEY (`question_option_id`) REFERENCES `QuestionOption`(`question_option_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuestionOptionAudit` ADD CONSTRAINT `QuestionOptionAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualStudentTakeAssessment` ADD CONSTRAINT `AnnualStudentTakeAssessment_annual_student_id_fkey` FOREIGN KEY (`annual_student_id`) REFERENCES `AnnualStudent`(`annual_student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualStudentTakeAssessment` ADD CONSTRAINT `AnnualStudentTakeAssessment_assessment_id_fkey` FOREIGN KEY (`assessment_id`) REFERENCES `Assessment`(`assessment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualStudentAnswerQuestion` ADD CONSTRAINT `AnnualStudentAnswerQuestion_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `Question`(`question_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualStudentAnswerQuestion` ADD CONSTRAINT `AnnualStudentAnswerQuestion_answered_option_id_fkey` FOREIGN KEY (`answered_option_id`) REFERENCES `QuestionOption`(`question_option_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualStudentAnswerQuestion` ADD CONSTRAINT `AnnualStudentAnswerQuestion_annual_student_take_assessment__fkey` FOREIGN KEY (`annual_student_take_assessment_id`) REFERENCES `AnnualStudentTakeAssessment`(`annual_student_take_assessment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualStudentAnswerQuestion` ADD CONSTRAINT `AnnualStudentAnswerQuestion_corrected_by_fkey` FOREIGN KEY (`corrected_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualStudentAnswerQuestionAudit` ADD CONSTRAINT `AnnualStudentAnswerQuestionAudit_annual_student_answer_ques_fkey` FOREIGN KEY (`annual_student_answer_question_id`) REFERENCES `AnnualStudentAnswerQuestion`(`annual_student_answer_question_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualStudentAnswerQuestionAudit` ADD CONSTRAINT `AnnualStudentAnswerQuestionAudit_previous_auditer_fkey` FOREIGN KEY (`previous_auditer`) REFERENCES `AnnualStudentTakeAssessment`(`annual_student_take_assessment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualStudentAnswerQuestionAudit` ADD CONSTRAINT `AnnualStudentAnswerQuestionAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualStudentTakeAssessment`(`annual_student_take_assessment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualStudentHasModule` ADD CONSTRAINT `AnnualStudentHasModule_annual_student_id_fkey` FOREIGN KEY (`annual_student_id`) REFERENCES `AnnualStudent`(`annual_student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualStudentHasModule` ADD CONSTRAINT `AnnualStudentHasModule_annual_module_id_fkey` FOREIGN KEY (`annual_module_id`) REFERENCES `AnnualModule`(`annual_module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PresenceList` ADD CONSTRAINT `PresenceList_annual_subject_id_fkey` FOREIGN KEY (`annual_subject_id`) REFERENCES `AnnualSubject`(`annual_subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PresenceListAudit` ADD CONSTRAINT `PresenceListAudit_presence_list_id_fkey` FOREIGN KEY (`presence_list_id`) REFERENCES `PresenceList`(`presence_list_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PresenceListAudit` ADD CONSTRAINT `PresenceListAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PresenceListHasChapter` ADD CONSTRAINT `PresenceListHasChapter_presence_list_id_fkey` FOREIGN KEY (`presence_list_id`) REFERENCES `PresenceList`(`presence_list_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PresenceListHasChapter` ADD CONSTRAINT `PresenceListHasChapter_chapter_id_fkey` FOREIGN KEY (`chapter_id`) REFERENCES `Chapter`(`chapter_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PresenceListHasChapter` ADD CONSTRAINT `PresenceListHasChapter_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PresenceListHasChapter` ADD CONSTRAINT `PresenceListHasChapter_deleted_by_fkey` FOREIGN KEY (`deleted_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PresenceListHasModuleStudent` ADD CONSTRAINT `PresenceListHasModuleStudent_annual_student_has_module_id_fkey` FOREIGN KEY (`annual_student_has_module_id`) REFERENCES `AnnualStudentHasModule`(`annual_student_has_module_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PresenceListHasModuleStudent` ADD CONSTRAINT `PresenceListHasModuleStudent_presence_list_id_fkey` FOREIGN KEY (`presence_list_id`) REFERENCES `PresenceList`(`presence_list_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PresenceListHasModuleStudent` ADD CONSTRAINT `PresenceListHasModuleStudent_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PresenceListHasModuleStudent` ADD CONSTRAINT `PresenceListHasModuleStudent_deleted_by_fkey` FOREIGN KEY (`deleted_by`) REFERENCES `AnnualTeacher`(`annual_teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentPayment` ADD CONSTRAINT `StudentPayment_payment_id_fkey` FOREIGN KEY (`payment_id`) REFERENCES `Payment`(`payment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentPayment` ADD CONSTRAINT `StudentPayment_annual_student_id_fkey` FOREIGN KEY (`annual_student_id`) REFERENCES `AnnualStudent`(`annual_student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentPayment` ADD CONSTRAINT `StudentPayment_paid_by_fkey` FOREIGN KEY (`paid_by`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssignmentGroupMember` ADD CONSTRAINT `AssignmentGroupMember_assessment_id_fkey` FOREIGN KEY (`assessment_id`) REFERENCES `Assessment`(`assessment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssignmentGroupMember` ADD CONSTRAINT `AssignmentGroupMember_annual_student_take_assessment_id_fkey` FOREIGN KEY (`annual_student_take_assessment_id`) REFERENCES `AnnualStudentTakeAssessment`(`annual_student_take_assessment_id`) ON DELETE CASCADE ON UPDATE CASCADE;
