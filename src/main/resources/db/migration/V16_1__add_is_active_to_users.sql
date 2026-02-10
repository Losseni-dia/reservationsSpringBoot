-- Migration pour ajouter la colonne is_active à la table users
-- Permet de désactiver un utilisateur au lieu de le supprimer (soft delete)

-- Ajout de la colonne is_active à la table users
ALTER TABLE users 
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;

-- Mettre tous les utilisateurs existants comme actifs
UPDATE users SET is_active = TRUE WHERE is_active IS NULL;

-- Ajouter un index pour améliorer les performances des requêtes filtrant par is_active
CREATE INDEX idx_users_is_active ON users(is_active);

-- Ajouter un commentaire pour la documentation
COMMENT ON COLUMN users.is_active IS 'Indique si le compte utilisateur est actif (TRUE) ou désactivé (FALSE). Permet un soft delete au lieu de supprimer définitivement les comptes.';