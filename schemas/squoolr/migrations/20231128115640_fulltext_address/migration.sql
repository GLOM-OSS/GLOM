-- CreateIndex
CREATE FULLTEXT INDEX `School_school_name_idx` ON `School`(`school_name`);

-- CreateIndex
CREATE FULLTEXT INDEX `School_school_name_address_idx` ON `School`(`school_name`, `address`);
