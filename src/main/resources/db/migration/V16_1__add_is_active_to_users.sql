-- 1. Ajout de la colonne (Syntaxe standard MySQL)
ALTER TABLE users
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;

-- 2. Mise à jour de sécurité (Optionnelle si la table était vide)
UPDATE users SET is_active = TRUE;

-- 3. Création de l'index
CREATE INDEX idx_users_is_active ON users (is_active);