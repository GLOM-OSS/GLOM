-- AlterTable
ALTER TABLE `platformsettings` MODIFY `created_by` VARCHAR(36) NULL;

-- CreateTable
CREATE TABLE `PlatformSettingsAudit` (
    `platform_settings_audit_id` VARCHAR(36) NOT NULL,
    `onboarding_fee` DOUBLE NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `platform_settings_id` VARCHAR(36) NOT NULL,
    `audited_by` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`platform_settings_audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PlatformSettingsAudit` ADD CONSTRAINT `PlatformSettingsAudit_platform_settings_id_fkey` FOREIGN KEY (`platform_settings_id`) REFERENCES `PlatformSettings`(`platform_settings_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlatformSettingsAudit` ADD CONSTRAINT `PlatformSettingsAudit_audited_by_fkey` FOREIGN KEY (`audited_by`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;
