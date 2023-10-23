-- CreateTable
CREATE TABLE `PlatformSettings` (
    `platform_settings_id` VARCHAR(36) NOT NULL,
    `onboarding_fee` DOUBLE NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`platform_settings_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PlatformSettings` ADD CONSTRAINT `PlatformSettings_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;
