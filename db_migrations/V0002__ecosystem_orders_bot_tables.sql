-- Экосистема сайт-CRM-бот: заказы, статусы, фото, админы и пользователи бота

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(64) UNIQUE NOT NULL,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(32),
    customer_telegram VARCHAR(128),
    contact_method VARCHAR(16),
    source VARCHAR(32) DEFAULT 'site',
    status VARCHAR(64) NOT NULL DEFAULT 'new',
    total_amount NUMERIC(12,2),
    comment TEXT,
    details JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_phone ON orders(customer_phone);
CREATE INDEX idx_orders_status ON orders(status);

CREATE TABLE order_status_history (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    status VARCHAR(64) NOT NULL,
    comment TEXT,
    changed_by VARCHAR(128),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_status_history_order ON order_status_history(order_id);

CREATE TABLE order_photos (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    photo_url TEXT NOT NULL,
    photo_type VARCHAR(32) NOT NULL DEFAULT 'build',
    caption TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_photos_order ON order_photos(order_id);

CREATE TABLE bot_admins (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(128),
    first_name VARCHAR(255),
    is_super BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(16) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    approved_at TIMESTAMP
);

CREATE INDEX idx_bot_admins_status ON bot_admins(status);

CREATE TABLE bot_users (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(128),
    first_name VARCHAR(255),
    phone VARCHAR(32),
    last_order_id INTEGER REFERENCES orders(id),
    state VARCHAR(64),
    state_data JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bot_users_tg ON bot_users(telegram_id);

CREATE TABLE order_subscribers (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    telegram_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(order_id, telegram_id)
);

CREATE INDEX idx_subscribers_order ON order_subscribers(order_id);
