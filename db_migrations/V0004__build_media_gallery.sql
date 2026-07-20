CREATE TABLE IF NOT EXISTS build_media (
    id SERIAL PRIMARY KEY,
    build_id INTEGER NOT NULL REFERENCES builds(id),
    url TEXT NOT NULL,
    media_type VARCHAR(10) NOT NULL DEFAULT 'photo',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_build_media_build_id ON build_media(build_id);

INSERT INTO build_media (build_id, url, media_type, sort_order)
SELECT id, image_url, 'photo', 0
FROM builds
WHERE image_url IS NOT NULL AND image_url <> '';