-- CreateIndex
CREATE FULLTEXT INDEX `Person_first_name_last_name_idx` ON `Person`(`first_name`, `last_name`);

-- CreateIndex
CREATE FULLTEXT INDEX `Person_email_first_name_last_name_idx` ON `Person`(`email`, `first_name`, `last_name`);
