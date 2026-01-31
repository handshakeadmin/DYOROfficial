-- PeptideSource Database Schema
-- Migration 003: Checkout enhancements, discount codes, and affiliate tracking

-- ============================================
-- UPDATE ORDERS TABLE FOR GUEST CHECKOUT & PAYPAL
-- ============================================

-- Make user_id nullable for guest checkout
ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;

-- Add guest email for non-authenticated orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS guest_email TEXT;

-- Add discount fields
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10, 2) DEFAULT 0 CHECK (discount_amount >= 0);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_code TEXT;

-- Add shipping cost column (rename from shipping if needed)
ALTER TABLE orders RENAME COLUMN shipping TO shipping_cost;

-- Add payment status
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- Add PayPal-specific fields
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paypal_order_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paypal_capture_id TEXT;

-- Add direct shipping address fields (for simpler checkout flow)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_first_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_last_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_email TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_phone TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address_line1 TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address_line2 TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_city TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_state TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_zip_code TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_country TEXT DEFAULT 'US';

-- Create index for PayPal order ID
CREATE INDEX IF NOT EXISTS idx_orders_paypal_order_id ON orders(paypal_order_id);

-- ============================================
-- DISCOUNT CODES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS discount_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    discount_percent DECIMAL(5, 2) NOT NULL CHECK (discount_percent >= 0 AND discount_percent <= 100),
    discount_type TEXT NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
    is_affiliate BOOLEAN NOT NULL DEFAULT FALSE,
    affiliate_name TEXT,
    affiliate_email TEXT,
    commission_percent DECIMAL(5, 2) CHECK (commission_percent >= 0 AND commission_percent <= 100),
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_active ON discount_codes(is_active) WHERE is_active = TRUE;

-- ============================================
-- AFFILIATE ORDERS TRACKING TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS affiliate_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    discount_code_id UUID NOT NULL REFERENCES discount_codes(id) ON DELETE RESTRICT,
    order_total DECIMAL(10, 2) NOT NULL,
    commission_rate DECIMAL(5, 2) NOT NULL,
    commission_amount DECIMAL(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_affiliate_orders_order_id ON affiliate_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_orders_discount_code_id ON affiliate_orders(discount_code_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_orders_status ON affiliate_orders(status);

-- Trigger for discount_codes updated_at
CREATE TRIGGER trigger_discount_codes_updated_at
    BEFORE UPDATE ON discount_codes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Trigger for affiliate_orders updated_at
CREATE TRIGGER trigger_affiliate_orders_updated_at
    BEFORE UPDATE ON affiliate_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- INSERT DEFAULT DISCOUNT CODES
-- ============================================
INSERT INTO discount_codes (code, discount_percent, discount_type, is_affiliate, affiliate_name, commission_percent, is_active)
VALUES
    ('CRITTY', 10, 'percentage', FALSE, NULL, NULL, TRUE),
    ('MIKYLA', 10, 'percentage', TRUE, 'Mikyla', 10, TRUE),
    ('WELCOME10', 10, 'percentage', FALSE, NULL, NULL, TRUE),
    ('ALICIA', 10, 'percentage', TRUE, 'Alicia', 10, TRUE)
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- UPDATE PRODUCT TYPE ENUM (add new types)
-- ============================================
-- Check if 'injectable' and 'blend' exist before adding
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'injectable' AND enumtypid = 'product_type'::regtype) THEN
        ALTER TYPE product_type ADD VALUE 'injectable';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'blend' AND enumtypid = 'product_type'::regtype) THEN
        ALTER TYPE product_type ADD VALUE 'blend';
    END IF;
END
$$;

-- ============================================
-- RLS POLICIES FOR NEW TABLES
-- ============================================

-- Enable RLS on new tables
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_orders ENABLE ROW LEVEL SECURITY;

-- Discount codes: anyone can read active codes
CREATE POLICY "Anyone can read active discount codes"
    ON discount_codes FOR SELECT
    USING (is_active = TRUE);

-- Affiliate orders: users can only see their own affiliate orders
CREATE POLICY "Users can view their own affiliate orders"
    ON affiliate_orders FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders o
            WHERE o.id = affiliate_orders.order_id
            AND o.user_id = auth.uid()
        )
    );

-- Update orders RLS to allow guest checkout inserts
DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;
CREATE POLICY "Users can insert orders"
    ON orders FOR INSERT
    WITH CHECK (
        user_id = auth.uid() OR user_id IS NULL
    );

-- Update orders RLS to allow viewing guest orders by payment info
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders"
    ON orders FOR SELECT
    USING (
        user_id = auth.uid() OR
        (user_id IS NULL AND guest_email IS NOT NULL)
    );
