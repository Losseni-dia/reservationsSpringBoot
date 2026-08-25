--
-- Structure de la table `troupes`
--
CREATE TABLE `troupes` (
  `id`       BIGINT       NOT NULL AUTO_INCREMENT,
  `name`     VARCHAR(60)  COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
  `logo_url` VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
