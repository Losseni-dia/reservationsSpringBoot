CREATE TABLE `reservations` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `reservation_date` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `statut` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  `createdAt` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Index pour la table `reservations`
--
ALTER TABLE `reservations`
  ADD KEY `reservations_user_id` (`user_id`);

--
-- Contraintes pour la table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT;