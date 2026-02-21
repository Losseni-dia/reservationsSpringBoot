ALTER TABLE `translation_usage`
    ADD COLUMN `user_id` BIGINT NULL,
    ADD CONSTRAINT `fk_translation_usage_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    ADD KEY `idx_translation_usage_user_id` (`user_id`);
