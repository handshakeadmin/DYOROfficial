-- PeptideSource: Combined Migration Script
-- Run this in the Supabase Dashboard SQL Editor
-- This script handles "already exists" errors gracefully
-- Generated: 2026-01-28

-- ============================================
-- MIGRATION 001: INITIAL SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types (with IF NOT EXISTS logic)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_type') THEN
        CREATE TYPE product_type AS ENUM ('lyophilized', 'capsules', 'nasal-spray', 'serum');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'address_type') THEN
        CREATE TYPE address_type AS ENUM ('shipping', 'billing');
    END IF;
END
$$;

-- USERS TABLE (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    company TEXT,
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'US',
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    address_type address_type NOT NULL DEFAULT 'shipping',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);

-- CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    short_description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    original_price DECIMAL(10, 2) CHECK (original_price >= 0),
    sku TEXT NOT NULL UNIQUE,
    product_type product_type NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    category_name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    form TEXT NOT NULL,
    purity TEXT NOT NULL DEFAULT '99%+',
    molecular_weight TEXT,
    sequence TEXT,
    storage_instructions TEXT NOT NULL,
    batch_number TEXT,
    coa_url TEXT,
    hplc_report_url TEXT,
    in_stock BOOLEAN NOT NULL DEFAULT TRUE,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    best_seller BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(product_type);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_best_seller ON products(best_seller) WHERE best_seller = TRUE;

-- PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

-- PRODUCT RESEARCH APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS product_research_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    application TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_research_applications_product_id ON product_research_applications(product_id);

-- CARTS TABLE
CREATE TABLE IF NOT EXISTS carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);

-- CART ITEMS TABLE
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(cart_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);

-- WISHLISTS TABLE
CREATE TABLE IF NOT EXISTS wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id);

-- WISHLIST ITEMS TABLE
CREATE TABLE IF NOT EXISTS wishlist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wishlist_id UUID NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(wishlist_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlist_items_wishlist_id ON wishlist_items(wishlist_id);

-- ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    shipping DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (shipping >= 0),
    tax DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (tax >= 0),
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    status order_status NOT NULL DEFAULT 'pending',
    shipping_address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
    billing_address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
    payment_method TEXT,
    payment_intent_id TEXT,
    tracking_number TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_at_purchase DECIMAL(10, 2) NOT NULL CHECK (price_at_purchase >= 0),
    product_name TEXT NOT NULL,
    product_sku TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT,
    verified_purchase BOOLEAN NOT NULL DEFAULT FALSE,
    approved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(product_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(approved) WHERE approved = TRUE;

-- UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- CREATE TRIGGERS (drop first if exists)
DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
DROP TRIGGER IF EXISTS trigger_addresses_updated_at ON addresses;
DROP TRIGGER IF EXISTS trigger_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS trigger_products_updated_at ON products;
DROP TRIGGER IF EXISTS trigger_carts_updated_at ON carts;
DROP TRIGGER IF EXISTS trigger_cart_items_updated_at ON cart_items;
DROP TRIGGER IF EXISTS trigger_wishlists_updated_at ON wishlists;
DROP TRIGGER IF EXISTS trigger_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS trigger_reviews_updated_at ON reviews;

CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_addresses_updated_at
    BEFORE UPDATE ON addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_carts_updated_at
    BEFORE UPDATE ON carts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_cart_items_updated_at
    BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_wishlists_updated_at
    BEFORE UPDATE ON wishlists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- GENERATE ORDER NUMBER FUNCTION
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_order_number TEXT;
BEGIN
    new_order_number := 'PS-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
                        UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
    RETURN new_order_number;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- MIGRATION 002: RLS POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_research_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can view own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can create own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can update own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can delete own addresses" ON addresses;
DROP POLICY IF EXISTS "Categories are publicly readable" ON categories;
DROP POLICY IF EXISTS "Products are publicly readable" ON products;
DROP POLICY IF EXISTS "Product images are publicly readable" ON product_images;
DROP POLICY IF EXISTS "Product research applications are publicly readable" ON product_research_applications;
DROP POLICY IF EXISTS "Users can view own cart" ON carts;
DROP POLICY IF EXISTS "Users can update own cart" ON carts;
DROP POLICY IF EXISTS "Users can view own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can add to own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can update own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can delete own cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can view own wishlist" ON wishlists;
DROP POLICY IF EXISTS "Users can update own wishlist" ON wishlists;
DROP POLICY IF EXISTS "Users can view own wishlist items" ON wishlist_items;
DROP POLICY IF EXISTS "Users can add to own wishlist" ON wishlist_items;
DROP POLICY IF EXISTS "Users can delete own wishlist items" ON wishlist_items;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create own orders" ON orders;
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Users can create own order items" ON order_items;
DROP POLICY IF EXISTS "Approved reviews are publicly readable" ON reviews;
DROP POLICY IF EXISTS "Users can view own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON reviews;

-- USERS POLICIES
CREATE POLICY "Users can read own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ADDRESSES POLICIES
CREATE POLICY "Users can view own addresses"
    ON addresses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own addresses"
    ON addresses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
    ON addresses FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses"
    ON addresses FOR DELETE
    USING (auth.uid() = user_id);

-- PUBLIC READ POLICIES
CREATE POLICY "Categories are publicly readable"
    ON categories FOR SELECT
    TO PUBLIC
    USING (TRUE);

CREATE POLICY "Products are publicly readable"
    ON products FOR SELECT
    TO PUBLIC
    USING (TRUE);

CREATE POLICY "Product images are publicly readable"
    ON product_images FOR SELECT
    TO PUBLIC
    USING (TRUE);

CREATE POLICY "Product research applications are publicly readable"
    ON product_research_applications FOR SELECT
    TO PUBLIC
    USING (TRUE);

-- CARTS POLICIES
CREATE POLICY "Users can view own cart"
    ON carts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
    ON carts FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- CART ITEMS POLICIES
CREATE POLICY "Users can view own cart items"
    ON cart_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM carts
            WHERE carts.id = cart_items.cart_id
            AND carts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can add to own cart"
    ON cart_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM carts
            WHERE carts.id = cart_items.cart_id
            AND carts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own cart items"
    ON cart_items FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM carts
            WHERE carts.id = cart_items.cart_id
            AND carts.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM carts
            WHERE carts.id = cart_items.cart_id
            AND carts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own cart items"
    ON cart_items FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM carts
            WHERE carts.id = cart_items.cart_id
            AND carts.user_id = auth.uid()
        )
    );

-- WISHLISTS POLICIES
CREATE POLICY "Users can view own wishlist"
    ON wishlists FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own wishlist"
    ON wishlists FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- WISHLIST ITEMS POLICIES
CREATE POLICY "Users can view own wishlist items"
    ON wishlist_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM wishlists
            WHERE wishlists.id = wishlist_items.wishlist_id
            AND wishlists.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can add to own wishlist"
    ON wishlist_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM wishlists
            WHERE wishlists.id = wishlist_items.wishlist_id
            AND wishlists.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own wishlist items"
    ON wishlist_items FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM wishlists
            WHERE wishlists.id = wishlist_items.wishlist_id
            AND wishlists.user_id = auth.uid()
        )
    );

-- ORDERS POLICIES
CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    USING (auth.uid() = user_id OR (user_id IS NULL AND guest_email IS NOT NULL));

CREATE POLICY "Users can create own orders"
    ON orders FOR INSERT
    WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- ORDER ITEMS POLICIES
CREATE POLICY "Users can view own order items"
    ON order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create own order items"
    ON order_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

-- REVIEWS POLICIES
CREATE POLICY "Approved reviews are publicly readable"
    ON reviews FOR SELECT
    TO PUBLIC
    USING (approved = TRUE);

CREATE POLICY "Users can view own reviews"
    ON reviews FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create reviews"
    ON reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
    ON reviews FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
    ON reviews FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- MIGRATION 003: CHECKOUT AND DISCOUNTS
-- ============================================

-- Make user_id nullable for guest checkout (if not already)
ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;

-- Add columns if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'guest_email') THEN
        ALTER TABLE orders ADD COLUMN guest_email TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'discount_amount') THEN
        ALTER TABLE orders ADD COLUMN discount_amount DECIMAL(10, 2) DEFAULT 0 CHECK (discount_amount >= 0);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'discount_code') THEN
        ALTER TABLE orders ADD COLUMN discount_code TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'payment_status') THEN
        ALTER TABLE orders ADD COLUMN payment_status TEXT DEFAULT 'pending';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'paypal_order_id') THEN
        ALTER TABLE orders ADD COLUMN paypal_order_id TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'paypal_capture_id') THEN
        ALTER TABLE orders ADD COLUMN paypal_capture_id TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_first_name') THEN
        ALTER TABLE orders ADD COLUMN shipping_first_name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_last_name') THEN
        ALTER TABLE orders ADD COLUMN shipping_last_name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_email') THEN
        ALTER TABLE orders ADD COLUMN shipping_email TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_phone') THEN
        ALTER TABLE orders ADD COLUMN shipping_phone TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_address_line1') THEN
        ALTER TABLE orders ADD COLUMN shipping_address_line1 TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_address_line2') THEN
        ALTER TABLE orders ADD COLUMN shipping_address_line2 TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_city') THEN
        ALTER TABLE orders ADD COLUMN shipping_city TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_state') THEN
        ALTER TABLE orders ADD COLUMN shipping_state TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_zip_code') THEN
        ALTER TABLE orders ADD COLUMN shipping_zip_code TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_country') THEN
        ALTER TABLE orders ADD COLUMN shipping_country TEXT DEFAULT 'US';
    END IF;
END
$$;

-- Rename shipping to shipping_cost if it exists and shipping_cost doesn't
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipping_cost') THEN
        ALTER TABLE orders RENAME COLUMN shipping TO shipping_cost;
    END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_orders_paypal_order_id ON orders(paypal_order_id);

-- DISCOUNT CODES TABLE
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

-- AFFILIATE ORDERS TRACKING TABLE
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

-- Drop and recreate triggers for new tables
DROP TRIGGER IF EXISTS trigger_discount_codes_updated_at ON discount_codes;
DROP TRIGGER IF EXISTS trigger_affiliate_orders_updated_at ON affiliate_orders;

CREATE TRIGGER trigger_discount_codes_updated_at
    BEFORE UPDATE ON discount_codes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_affiliate_orders_updated_at
    BEFORE UPDATE ON affiliate_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- INSERT DEFAULT DISCOUNT CODES
INSERT INTO discount_codes (code, discount_percent, discount_type, is_affiliate, affiliate_name, commission_percent, is_active)
VALUES
    ('CRITTY', 10, 'percentage', FALSE, NULL, NULL, TRUE),
    ('MIKYLA', 10, 'percentage', TRUE, 'Mikyla', 10, TRUE),
    ('WELCOME10', 10, 'percentage', FALSE, NULL, NULL, TRUE),
    ('ALICIA', 10, 'percentage', TRUE, 'Alicia', 10, TRUE)
ON CONFLICT (code) DO NOTHING;

-- Add product type enum values
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'injectable' AND enumtypid = 'product_type'::regtype) THEN
        ALTER TYPE product_type ADD VALUE 'injectable';
    END IF;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'blend' AND enumtypid = 'product_type'::regtype) THEN
        ALTER TYPE product_type ADD VALUE 'blend';
    END IF;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END
$$;

-- Enable RLS on new tables
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_orders ENABLE ROW LEVEL SECURITY;

-- RLS for discount codes
DROP POLICY IF EXISTS "Anyone can read active discount codes" ON discount_codes;
CREATE POLICY "Anyone can read active discount codes"
    ON discount_codes FOR SELECT
    USING (is_active = TRUE);

-- RLS for affiliate orders
DROP POLICY IF EXISTS "Users can view their own affiliate orders" ON affiliate_orders;
CREATE POLICY "Users can view their own affiliate orders"
    ON affiliate_orders FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders o
            WHERE o.id = affiliate_orders.order_id
            AND o.user_id = auth.uid()
        )
    );

-- ============================================
-- MIGRATION 004: ADMIN SUPPORT
-- ============================================

-- Add admin column to users
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_admin') THEN
        ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
    END IF;
END
$$;

-- Add product enhancement columns
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'full_name') THEN
        ALTER TABLE products ADD COLUMN full_name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'long_description') THEN
        ALTER TABLE products ADD COLUMN long_description TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'benefits') THEN
        ALTER TABLE products ADD COLUMN benefits TEXT[];
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'mechanism_of_action') THEN
        ALTER TABLE products ADD COLUMN mechanism_of_action TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'on_sale') THEN
        ALTER TABLE products ADD COLUMN on_sale BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'tags') THEN
        ALTER TABLE products ADD COLUMN tags TEXT[];
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'specifications') THEN
        ALTER TABLE products ADD COLUMN specifications TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'research_references') THEN
        ALTER TABLE products ADD COLUMN research_references JSONB DEFAULT '[]'::jsonb;
    END IF;
END
$$;

-- Add order enhancement columns
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'carrier') THEN
        ALTER TABLE orders ADD COLUMN carrier TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'shipped_at') THEN
        ALTER TABLE orders ADD COLUMN shipped_at TIMESTAMPTZ;
    END IF;
END
$$;

-- Add affiliate enhancement columns
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'affiliate_orders' AND column_name = 'approved_at') THEN
        ALTER TABLE affiliate_orders ADD COLUMN approved_at TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'discount_codes' AND column_name = 'affiliate_user_id') THEN
        ALTER TABLE discount_codes ADD COLUMN affiliate_user_id UUID REFERENCES users(id) ON DELETE SET NULL;
    END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_discount_codes_affiliate_user_id ON discount_codes(affiliate_user_id);

-- IS_ADMIN HELPER FUNCTION
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND is_admin = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ADMIN RLS POLICIES
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
DROP POLICY IF EXISTS "Admins can manage products" ON products;
DROP POLICY IF EXISTS "Admins can manage product images" ON product_images;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Admins can manage all discount codes" ON discount_codes;
DROP POLICY IF EXISTS "Admins can manage affiliate orders" ON affiliate_orders;
DROP POLICY IF EXISTS "Admins can manage reviews" ON reviews;

CREATE POLICY "Admins can view all users"
    ON users FOR SELECT
    USING (is_admin());

CREATE POLICY "Admins can update all users"
    ON users FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Admins can view all orders"
    ON orders FOR SELECT
    USING (is_admin());

CREATE POLICY "Admins can update all orders"
    ON orders FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Admins can view all order items"
    ON order_items FOR SELECT
    USING (is_admin());

CREATE POLICY "Admins can manage products"
    ON products FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Admins can manage product images"
    ON product_images FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Admins can manage categories"
    ON categories FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Admins can manage all discount codes"
    ON discount_codes FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Admins can manage affiliate orders"
    ON affiliate_orders FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Admins can manage reviews"
    ON reviews FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- AFFILIATE RLS POLICIES
DROP POLICY IF EXISTS "Affiliates can view their own discount codes" ON discount_codes;
DROP POLICY IF EXISTS "Affiliates can view their own orders" ON affiliate_orders;

CREATE POLICY "Affiliates can view their own discount codes"
    ON discount_codes FOR SELECT
    USING (
        affiliate_user_id = auth.uid()
        OR is_active = TRUE
        OR is_admin()
    );

CREATE POLICY "Affiliates can view their own orders"
    ON affiliate_orders FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM discount_codes dc
            WHERE dc.id = affiliate_orders.discount_code_id
            AND dc.affiliate_user_id = auth.uid()
        )
        OR is_admin()
    );

-- ============================================
-- MIGRATION 005 / FIX: USER SIGNUP TRIGGER (CRITICAL)
-- ============================================

-- Step 1: Drop and recreate the trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', '')
    );
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- User already exists, ignore
        RETURN NEW;
    WHEN OTHERS THEN
        -- Log error but don't fail the signup
        RAISE WARNING 'handle_new_user failed: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Set ownership
ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 2: Fix the RLS policy for users table
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Allow user profile creation" ON users;

CREATE POLICY "Allow user profile creation"
    ON users FOR INSERT
    WITH CHECK (
        auth.uid() = id
        OR
        auth.uid() IS NULL
    );

-- Step 3: Fix cart/wishlist creation trigger
DROP TRIGGER IF EXISTS trigger_create_user_cart_and_wishlist ON users;
DROP FUNCTION IF EXISTS create_user_cart_and_wishlist();

CREATE OR REPLACE FUNCTION create_user_cart_and_wishlist()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO carts (user_id) VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    INSERT INTO wishlists (user_id) VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'create_user_cart_and_wishlist failed: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

ALTER FUNCTION create_user_cart_and_wishlist() OWNER TO postgres;

CREATE TRIGGER trigger_create_user_cart_and_wishlist
    AFTER INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION create_user_cart_and_wishlist();

-- Step 4: Add insert policies for carts and wishlists
DROP POLICY IF EXISTS "Allow cart creation" ON carts;
DROP POLICY IF EXISTS "Allow wishlist creation" ON wishlists;
DROP POLICY IF EXISTS "Users can create own cart" ON carts;
DROP POLICY IF EXISTS "Users can create own wishlist" ON wishlists;

CREATE POLICY "Allow cart creation"
    ON carts FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        OR
        auth.uid() IS NULL
    );

CREATE POLICY "Allow wishlist creation"
    ON wishlists FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        OR
        auth.uid() IS NULL
    );

-- Step 5: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT INSERT ON public.users TO postgres, service_role;
GRANT INSERT ON public.carts TO postgres, service_role;
GRANT INSERT ON public.wishlists TO postgres, service_role;

-- ============================================
-- VERIFICATION: Show triggers on auth.users
-- ============================================
SELECT
    tgname AS trigger_name,
    proname AS function_name,
    tgenabled AS enabled
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'auth' AND c.relname = 'users';

-- Show all tables created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
