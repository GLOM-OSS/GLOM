-- CreateTable
CREATE TABLE `Person` (
    `person_id` VARCHAR(36) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `first_name` VARCHAR(50) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `phone_number` VARCHAR(25) NULL,
    `address` TEXT NULL,
    `birth_date` DATETIME(3) NULL,
    `preferred_lang` ENUM('en', 'fr') NOT NULL DEFAULT 'en',
    `gender` ENUM('Male', 'Female', 'Other') NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `Person_email_key`(`email`),
    PRIMARY KEY (`person_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PersonAudit` (
    `person_audit_id` VARCHAR(36) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `phone_number` VARCHAR(25) NULL,
    `address` TEXT NULL,
    `gender` ENUM('Male', 'Female', 'Other') NULL,
    `preferred_lang` ENUM('en', 'fr') NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `person_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`person_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `role_id` VARCHAR(36) NOT NULL,
    `role_name` VARCHAR(191) NOT NULL,
    `origin` VARCHAR(45) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` VARCHAR(36) NULL,

    UNIQUE INDEX `Role_role_name_key`(`role_name`),
    PRIMARY KEY (`role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoleAudit` (
    `role_audit_id` VARCHAR(36) NOT NULL,
    `role_name` VARCHAR(191) NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `role_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`role_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Login` (
    `login_id` VARCHAR(36) NOT NULL,
    `password` VARCHAR(75) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `role_id` VARCHAR(36) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `person_id` VARCHAR(36) NOT NULL,
    `created_by` VARCHAR(36) NULL,

    PRIMARY KEY (`login_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoginAudit` (
    `login_audit_id` VARCHAR(36) NOT NULL,
    `password` VARCHAR(75) NOT NULL,
    `is_active` BOOLEAN NOT NULL,
    `audited_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `login_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`login_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ResetPassword` (
    `reset_password_id` VARCHAR(36) NOT NULL,
    `expires_at` DATETIME(0) NOT NULL,
    `used_at` DATETIME(0) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `cancelled_at` DATETIME(0) NULL,
    `reset_by` VARCHAR(36) NULL,
    `login_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`reset_password_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PersonAudit` ADD CONSTRAINT `PersonAudit_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `Person`(`person_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Role` ADD CONSTRAINT `Role_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `Person`(`person_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoleAudit` ADD CONSTRAINT `RoleAudit_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`role_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoleAudit` ADD CONSTRAINT `RoleAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `Person`(`person_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Login` ADD CONSTRAINT `Login_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`role_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Login` ADD CONSTRAINT `Login_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `Person`(`person_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Login` ADD CONSTRAINT `Login_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoginAudit` ADD CONSTRAINT `LoginAudit_login_id_fkey` FOREIGN KEY (`login_id`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoginAudit` ADD CONSTRAINT `LoginAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResetPassword` ADD CONSTRAINT `ResetPassword_reset_by_fkey` FOREIGN KEY (`reset_by`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResetPassword` ADD CONSTRAINT `ResetPassword_login_id_fkey` FOREIGN KEY (`login_id`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;
