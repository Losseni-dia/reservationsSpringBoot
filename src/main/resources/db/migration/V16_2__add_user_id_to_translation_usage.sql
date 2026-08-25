-- Ensure table exists (handles mismatch when V16_1 is marked applied but table was dropped/restored)
CREATE TABLE IF NOT EXISTS `translation_usage` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `characters_translated` INT NOT NULL DEFAULT 0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_translation_usage_created_at` (`created_at`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

ALTER TABLE `translation_usage`
    ADD COLUMN `user_id` BIGINT NULL,
    ADD CONSTRAINT `fk_translation_usage_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    ADD KEY `idx_translation_usage_user_id` (`user_id`);
