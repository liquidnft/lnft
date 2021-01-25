CREATE INDEX artworks_title_gin_idx ON artworks
USING GIN ((title) gin_trgm_ops);
