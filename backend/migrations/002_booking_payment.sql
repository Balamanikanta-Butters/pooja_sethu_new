ALTER TABLE ps.booking
    ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
    ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT,
    ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending'
        CHECK (payment_status IN ('pending', 'paid'));

CREATE UNIQUE INDEX IF NOT EXISTS booking_razorpay_order_id_unique_idx
    ON ps.booking (razorpay_order_id)
    WHERE razorpay_order_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS booking_razorpay_payment_id_unique_idx
    ON ps.booking (razorpay_payment_id)
    WHERE razorpay_payment_id IS NOT NULL;
