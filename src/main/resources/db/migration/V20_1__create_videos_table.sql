CREATE TABLE `videos` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `video_url` VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
    `show_id` BIGINT NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

ALTER TABLE `videos` ADD KEY `IDX_videos_show_id` (`show_id`);

ALTER TABLE `videos`
ADD CONSTRAINT `FK_videos_show_id` FOREIGN KEY (`show_id`) REFERENCES `shows` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT;