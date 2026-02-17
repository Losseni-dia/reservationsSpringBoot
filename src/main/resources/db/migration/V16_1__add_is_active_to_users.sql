-- 1. On ajoute la colonne seulement si elle n'existe pas déjà
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

-- 2. On s'assure que les anciens utilisateurs sont actifs (au cas où)
UPDATE users SET is_active = TRUE WHERE is_active IS NULL;

-- 3. On crée l'index (Lui aussi avec IF NOT EXISTS si ta version de MariaDB le permet, sinon Flyway s'en chargera)
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);