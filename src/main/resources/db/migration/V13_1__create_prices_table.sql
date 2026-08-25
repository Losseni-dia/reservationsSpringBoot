CREATE TABLE `prices` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    `amount` DOUBLE NOT NULL,
    `start_date` DATETIME NOT NULL,
    `end_date` DATETIME DEFAULT NULL,
    `representation_id` BIGINT NOT NULL,
    PRIMARY KEY (`id`),
    KEY `fk_price_representation` (`representation_id`),
    CONSTRAINT `fk_price_representation` FOREIGN KEY (`representation_id`) REFERENCES `representations` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;