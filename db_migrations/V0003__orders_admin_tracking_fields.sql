-- Отслеживание просмотра и взятия заказа админами (для вкладки "Заказы" в админке)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS viewed_by VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS viewed_at TIMESTAMP;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS taken_by VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS taken_at TIMESTAMP;
