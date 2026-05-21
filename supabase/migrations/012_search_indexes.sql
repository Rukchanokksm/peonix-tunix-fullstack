-- Site-wide instant search (2026-05-21)
-- Enable trigram extension and add GIN indexes for ILIKE acceleration
-- on tunes, user_profiles, and cars searchable columns.

create extension if not exists pg_trgm;

create index if not exists tunes_title_trgm_idx
  on tunes using gin (title gin_trgm_ops);

create index if not exists tunes_description_trgm_idx
  on tunes using gin (description gin_trgm_ops);

create index if not exists user_profiles_username_trgm_idx
  on user_profiles using gin (username gin_trgm_ops);

create index if not exists user_profiles_bio_trgm_idx
  on user_profiles using gin (bio gin_trgm_ops);

create index if not exists cars_make_trgm_idx
  on cars using gin (make gin_trgm_ops);

create index if not exists cars_model_trgm_idx
  on cars using gin (model gin_trgm_ops);
