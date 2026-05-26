--
-- Ajout de la clé étrangère troupe_id dans la table `artists`
-- Relation Many-to-One : plusieurs artistes → une troupe
--
ALTER TABLE `artists`
  ADD COLUMN `troupe_id` BIGINT DEFAULT NULL;

ALTER TABLE `artists`
  ADD KEY `IDX_artists_troupe_id` (`troupe_id`);

ALTER TABLE `artists`
  ADD CONSTRAINT `FK_artists_troupe_id`
    FOREIGN KEY (`troupe_id`) REFERENCES `troupes` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT;
