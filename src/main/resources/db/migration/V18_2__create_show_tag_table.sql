--
-- Structure de la table de jointure `show_tag`
-- Relation Many-to-Many entre shows et tags
--
CREATE TABLE `show_tag` (
  `show_id` BIGINT NOT NULL,
  `tag_id`  BIGINT NOT NULL,
  PRIMARY KEY (`show_id`, `tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Index pour la table `show_tag`
--
ALTER TABLE `show_tag`
  ADD KEY `IDX_show_tag_show_id` (`show_id`),
  ADD KEY `IDX_show_tag_tag_id` (`tag_id`);

--
-- Contraintes pour la table `show_tag`
--
ALTER TABLE `show_tag`
  ADD CONSTRAINT `FK_show_tag_show_id` FOREIGN KEY (`show_id`) REFERENCES `shows` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
  ADD CONSTRAINT `FK_show_tag_tag_id`  FOREIGN KEY (`tag_id`)  REFERENCES `tags`  (`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
