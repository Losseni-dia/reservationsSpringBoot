CREATE TABLE `artists` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `firstname` VARCHAR(60) COLLATE utf8mb4_unicode_ci NOT NULL,
    `lastname` VARCHAR(60) COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
