CREATE TABLE `representation_reservations` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `representation_id` INT(11) NOT NULL,
    `reservation_id` INT(11) NOT NULL,
    `price_id` INT(11) NOT NULL,
    `quantity` INT(11) DEFAULT 1,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uc_repr_res_price` (
        `representation_id`,
        `reservation_id`,
        `price_id`
    ),
    CONSTRAINT `fk_repr_res_repr` FOREIGN KEY (`representation_id`) REFERENCES `representations` (`id`),
    CONSTRAINT `fk_repr_res_res` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`),
    CONSTRAINT `fk_repr_res_price` FOREIGN KEY (`price_id`) REFERENCES `prices` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;