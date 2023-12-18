-- AddForeignKey
ALTER TABLE `ResetPassword` ADD CONSTRAINT `ResetPassword_login_id_fkey` FOREIGN KEY (`login_id`) REFERENCES `Login`(`login_id`) ON DELETE CASCADE ON UPDATE CASCADE;
