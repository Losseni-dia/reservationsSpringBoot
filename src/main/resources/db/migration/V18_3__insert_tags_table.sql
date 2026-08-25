--
-- Données de test pour la table `tags`
--
INSERT INTO `tags` (`id`, `tag`) VALUES
(1, 'théâtre'),
(2, 'comédie'),
(3, 'danse'),
(4, 'musique'),
(5, 'jeune public'),
(6, 'humour'),
(7, 'contemporain'),
(8, 'classique');

--
-- Association tags <-> spectacles (show_tag)
--
INSERT INTO `show_tag` (`show_id`, `tag_id`) VALUES
(1, 1),
(1, 7),
(2, 1),
(2, 5),
(3, 4),
(3, 6),
(4, 2),
(4, 5);
