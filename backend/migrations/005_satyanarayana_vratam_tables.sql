-- Migration 005: Add dedicated Katha Chapters table and Quantity-Free Samagri Checklist extension

BEGIN;

-- 1. Dedicated Katha Chapters Table
CREATE TABLE IF NOT EXISTS ps.vidhi_katha_chapter (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    vidhi_version_id UUID NOT NULL
        REFERENCES ps.vidhi_version(id)
        ON DELETE CASCADE,

    chapter_no SMALLINT NOT NULL
        CHECK (chapter_no BETWEEN 1 AND 5),

    title JSONB NOT NULL,
    summary JSONB,
    content JSONB,

    source_reference TEXT,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (vidhi_version_id, chapter_no)
);

CREATE INDEX IF NOT EXISTS idx_vidhi_katha_chapter_version
    ON ps.vidhi_katha_chapter (vidhi_version_id, chapter_no);

-- 2. Quantity-Free Samagri Checklist Extension Table
CREATE TABLE IF NOT EXISTS ps.vidhi_samagri_checklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    vidhi_version_id UUID NOT NULL
        REFERENCES ps.vidhi_version(id)
        ON DELETE CASCADE,

    samagri_item_id UUID
        REFERENCES ps.samagri_item(id)
        ON DELETE SET NULL,

    checklist_group TEXT NOT NULL
        CHECK (checklist_group IN (
            'pooja_items',
            'prasadam_ingredients',
            'panchamrutham_ingredients',
            'katha_sankalpam_items'
        )),

    item_name JSONB NOT NULL,
    sort_order SMALLINT NOT NULL DEFAULT 1,
    is_optional BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (vidhi_version_id, checklist_group, sort_order)
);

CREATE INDEX IF NOT EXISTS idx_vidhi_samagri_checklist_version
    ON ps.vidhi_samagri_checklist (vidhi_version_id, checklist_group);

COMMIT;
