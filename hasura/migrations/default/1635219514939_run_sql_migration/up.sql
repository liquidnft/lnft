ALTER TABLE artworks
    ADD COLUMN IF NOT EXISTS hideable BOOLEAN DEFAULT true;

ALTER TABLE artworks
    ADD COLUMN IF NOT EXISTS hideable_hash text DEFAULT null;
