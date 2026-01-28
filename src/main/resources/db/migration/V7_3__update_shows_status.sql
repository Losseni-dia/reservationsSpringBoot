-- 1. Ajout de la colonne status (syntaxe standard MySQL/MariaDB)
ALTER TABLE shows ADD status VARCHAR(20) NOT NULL DEFAULT 'A_CONFIRMER';

-- 2. Mise à jour des spectacles existants pour qu'ils s'affichent
UPDATE shows SET status = 'CONFIRME';