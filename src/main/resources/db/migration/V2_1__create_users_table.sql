-- 1. Création de la table avec la colonne is_active incluse
CREATE TABLE `users` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `login` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
    `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `firstname` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
    `lastname` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
    `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `langue` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL,
    `created_at` datetime NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE, -- Ajout direct ici
    PRIMARY KEY (`id`),
    INDEX `idx_users_is_active` (`is_active`) -- Index créé en même temps que la table
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
