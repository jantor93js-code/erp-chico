-- Seed PMO roles
INSERT INTO "roles" (id, nombre, slug, permisos)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'PMO Admin', 'PMO_ADMIN', '{}'::jsonb)
  ON CONFLICT (slug) DO NOTHING;

INSERT INTO "roles" (id, nombre, slug, permisos)
VALUES
  ('22222222-2222-2222-2222-222222222222', 'PMO User', 'PMO_USER', '{}'::jsonb)
  ON CONFLICT (slug) DO NOTHING;
