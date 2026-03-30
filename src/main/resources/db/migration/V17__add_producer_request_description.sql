-- Texte libre de la demande d'inscription producteur (obligatoire côté API si rôle producer)
ALTER TABLE `users`
    ADD COLUMN `producer_request_description` TEXT NULL;
