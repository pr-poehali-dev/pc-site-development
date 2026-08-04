ALTER TABLE orders ADD COLUMN IF NOT EXISTS duplicate_of integer REFERENCES orders(id);

CREATE INDEX IF NOT EXISTS idx_orders_duplicate_of ON orders(duplicate_of);
