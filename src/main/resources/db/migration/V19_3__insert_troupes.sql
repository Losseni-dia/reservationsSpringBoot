--
-- Données de test pour la table `troupes`
--
INSERT INTO `troupes` (`id`, `name`, `logo_url`) VALUES
(1, 'Théâtre du Parc',      'troupe_parc.jpg'),
(2, 'Collectif 42',         'troupe_collectif42.jpg'),
(3, 'Les Ateliers du Sud',  'troupe_ateliers_sud.jpg'),
(4, 'Scène Libre',          NULL);

--
-- Affectation de quelques artistes existants à des troupes
--
UPDATE `artists` SET `troupe_id` = 1 WHERE `id` = 1;
UPDATE `artists` SET `troupe_id` = 1 WHERE `id` = 2;
UPDATE `artists` SET `troupe_id` = 2 WHERE `id` = 3;
UPDATE `artists` SET `troupe_id` = 3 WHERE `id` = 4;
