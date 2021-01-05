BEGIN;

TRUNCATE
  "word",
  "language",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Dunder Mifflin Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'Spanish', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, 'práctica', 'practice', 2),
  (2, 1, 'hola', 'hello', 3),
  (3, 1, 'casa', 'house', 4),
  (4, 1, 'desarrolladora', 'developer', 5),
  (5, 1, 'traducir', 'translate', 6),
  (6, 1, 'asombrosa', 'amazing', 7),
  (7, 1, 'perra', 'dog', 8),
  (8, 1, 'feliz', 'happy', 9),
  (9, 1, 'jugar', 'gamble', 10),
  (10, 1, 'computadora', 'computer', 11),
  (11, 1, 'flores', 'flowers', 12),
  (12, 1, 'tocar', 'play', 13),
  (13, 1, 'amor', 'love', 14),
  (14, 1, 'divertida', 'fun', 15),
  (15, 1, 'baño', 'bathroom', 16),
  (16, 1, 'trabajo', 'work', 17),
  (17, 1, 'dinero', 'money', 18),
  (18, 1, 'dormir', 'sleep', 19),
  (19, 1, 'luna', 'moon', 20),
  (20, 1, 'estrellas', 'stars', 21),
  (21, 1, 'avión', 'airplane', 22),
  (22, 1, 'caminata', 'hike', 23),
  (23, 1, 'navegar', 'surf', 24),
  (24, 1, 'por favor', 'please', 25),
  (25, 1, 'gracias', 'thank you', 26),
  (26, 1, 'ayuda', 'help', 27),
  (27, 1, 'fuego', 'fire', 28),
  (28, 1, 'película', 'movie', 29),
  (29, 1, 'gata', 'cat', null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));


COMMIT;
