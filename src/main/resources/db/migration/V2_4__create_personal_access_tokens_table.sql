CREATE TABLE `personal_access_tokens` (
  `id` BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `token` CHAR(36) NOT NULL,
  `user_id` BIGINT NOT NULL,
  `expires_at` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `personal_access_tokens`
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `user_id` (`user_id`);
