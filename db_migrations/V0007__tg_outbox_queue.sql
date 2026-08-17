CREATE TABLE IF NOT EXISTS tg_outbox (
    id SERIAL PRIMARY KEY,
    payload JSONB NOT NULL,
    attempts INT NOT NULL DEFAULT 0,
    last_error TEXT,
    sent_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tg_outbox_pending ON tg_outbox (sent_at, id);