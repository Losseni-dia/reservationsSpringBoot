-- 2. Insertion des données avec l'état is_active
INSERT INTO
    `users` (
        `id`,
        `login`,
        `password`,
        `firstname`,
        `lastname`,
        `email`,
        `langue`,
        `created_at`,
        `is_active`
    )
VALUES (
        1,
        'bob',
        '',
        'Bob',
        'Sull',
        'bob@sull.com',
        'fr',
        '2010-01-01 12:00:00',
        TRUE
    ),
    (
        2,
        'lana',
        '',
        'Lana',
        'Sull',
        'lana@sull.com',
        'fr',
        '2010-01-01 12:00:00',
        TRUE
    ),
    (
        3,
        'affiliate',
        '',
        'Affi',
        'Liate',
        'contact@affiliate.com',
        'fr',
        '2020-01-01 12:00:00',
        TRUE
    );
