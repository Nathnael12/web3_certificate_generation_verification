CREATE TABLE `trainee` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`trainee` VARCHAR(50) DEFAULT NULL,
	`email` VARCHAR(50),
	`asset` INT(10),
	`status` VARCHAR(10),
	`remark` VARCHAR(150),
	`hashed` VARCHAR(350) DEFAULT NULL,
	PRIMARY KEY (`id`)
);