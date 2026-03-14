-- Placeholder users for referential integrity after restoring DUMP_DATABASE.sql.
-- Run this BEFORE applying FK constraints (or right after restoring the dump).
-- After restore, create real user accounts via the app's registration flow
-- and update references in personagens/campanhas as needed.

INSERT INTO public.users (id, email, first_name, last_name, role, created_at, updated_at)
VALUES
  ('2142da82-5a31-4209-b821-06af2c8a9bb6', 'admin@placeholder.local', 'Admin', 'User', 'admin', NOW(), NOW()),
  ('c7273c5e-8e85-4566-8a95-0bf90fdab8d9', 'player@placeholder.local', 'Player', 'User', 'user', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
