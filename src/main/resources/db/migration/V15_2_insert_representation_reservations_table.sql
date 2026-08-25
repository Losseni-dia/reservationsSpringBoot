INSERT INTO
    `representation_reservations` (
        `representation_id`,
        `reservation_id`,
        `price_id`,
        `quantity`
    )
VALUES (1, 1, 1, 2), -- Réservation n°1 : 2 places au tarif ID 1 (Standard) pour la séance 1
    (1, 1, 2, 1), -- Réservation n°1 : 1 place au tarif ID 2 (VIP) pour la séance 1
    (2, 2, 3, 4), -- Réservation n°2 : 4 places au tarif ID 3 pour la séance 2
    (3, 3, 1, 1);
-- Réservation n°3 : 1 place au tarif ID 1 pour la séance 3