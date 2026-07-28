ALTER TABLE articles ADD COLUMN IF NOT EXISTS views integer NOT NULL DEFAULT 0;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS likes integer NOT NULL DEFAULT 0;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS dislikes integer NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS article_votes (
    id serial PRIMARY KEY,
    article_id integer NOT NULL REFERENCES articles(id),
    visitor_id varchar(64) NOT NULL,
    vote smallint NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (article_id, visitor_id)
);

CREATE INDEX IF NOT EXISTS idx_article_votes_article ON article_votes(article_id);
