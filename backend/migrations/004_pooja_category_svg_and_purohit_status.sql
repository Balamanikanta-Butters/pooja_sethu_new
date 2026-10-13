-- Migration 004: Ensure svg_content on pooja_category, status on purohit, and app_config table

ALTER TABLE ps.pooja_category
    ADD COLUMN IF NOT EXISTS svg_content TEXT;

ALTER TABLE ps.purohit
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

UPDATE ps.purohit
    SET status = 'active'
    WHERE status IS NULL;

CREATE TABLE IF NOT EXISTS ps.app_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

ALTER TABLE ps.booking
    ALTER COLUMN address_id DROP NOT NULL;
