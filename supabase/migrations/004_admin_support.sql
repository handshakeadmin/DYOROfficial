-- PeptideSource Database Schema
-- Migration 004: Admin Support and Enhancements

-- ============================================
-- ADD ADMIN ROLE TO USERS
-- ============================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- ============================================
-- PRODUCT ENHANCEMENTS
-- ============================================
-- Add missing product fields to match static data
ALTER TABLE products ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS long_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS benefits TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS mechanism_of_action TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS on_sale BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE products ADD COLUMN IF NOT EXISTS specifications TEXT;

-- Add research references as JSONB for flexibility
ALTER TABLE products ADD COLUMN IF NOT EXISTS research_references JSONB DEFAULT '[]'::jsonb;

-- ============================================
-- ORDER ENHANCEMENTS
-- ============================================
ALTER TABLE orders ADD COLUMN IF NOT EXISTS carrier TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMPTZ;

-- ============================================
-- AFFILIATE ENHANCEMENTS
-- ============================================
-- Add approved_at timestamp to affiliate_orders
ALTER TABLE affiliate_orders ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- Add affiliate_id to discount_codes for magic link auth
ALTER TABLE discount_codes ADD COLUMN IF NOT EXISTS affiliate_user_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Create index for affiliate user lookups
CREATE INDEX IF NOT EXISTS idx_discount_codes_affiliate_user_id ON discount_codes(affiliate_user_id);

-- ============================================
-- ADMIN HELPER FUNCTION
-- ============================================
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

-- ============================================
-- ADMIN RLS POLICIES
-- ============================================

-- Drop existing admin policies if they exist (for idempotency)
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

-- USERS: Admin can view and update all users
CREATE POLICY "Admins can view all users"
    ON users FOR SELECT
    USING (is_admin());

CREATE POLICY "Admins can update all users"
    ON users FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

-- ORDERS: Admin can view and update all orders
CREATE POLICY "Admins can view all orders"
    ON orders FOR SELECT
    USING (is_admin());

CREATE POLICY "Admins can update all orders"
    ON orders FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

-- ORDER ITEMS: Admin can view all order items
CREATE POLICY "Admins can view all order items"
    ON order_items FOR SELECT
    USING (is_admin());

-- PRODUCTS: Admin can manage all products (CRUD)
CREATE POLICY "Admins can manage products"
    ON products FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- PRODUCT IMAGES: Admin can manage all product images
CREATE POLICY "Admins can manage product images"
    ON product_images FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- CATEGORIES: Admin can manage all categories
CREATE POLICY "Admins can manage categories"
    ON categories FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- DISCOUNT CODES: Admin can manage all discount codes
CREATE POLICY "Admins can manage all discount codes"
    ON discount_codes FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- AFFILIATE ORDERS: Admin can manage all affiliate orders
CREATE POLICY "Admins can manage affiliate orders"
    ON affiliate_orders FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- REVIEWS: Admin can manage all reviews
CREATE POLICY "Admins can manage reviews"
    ON reviews FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- ============================================
-- AFFILIATE RLS POLICIES
-- ============================================

-- Drop existing affiliate policies if they exist
DROP POLICY IF EXISTS "Affiliates can view their own discount codes" ON discount_codes;
DROP POLICY IF EXISTS "Affiliates can view their own orders" ON affiliate_orders;

-- Affiliates can view their own discount codes
CREATE POLICY "Affiliates can view their own discount codes"
    ON discount_codes FOR SELECT
    USING (
        affiliate_user_id = auth.uid()
        OR is_active = TRUE
        OR is_admin()
    );

-- Affiliates can view their own affiliate orders
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
-- SUPABASE STORAGE BUCKET FOR PRODUCT IMAGES
-- ============================================
-- Note: Run this in Supabase Dashboard SQL Editor or via Supabase CLI
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('product-images', 'product-images', true)
-- ON CONFLICT (id) DO NOTHING;

-- Storage policy for admins to upload
-- CREATE POLICY "Admins can upload product images"
--     ON storage.objects FOR INSERT
--     WITH CHECK (
--         bucket_id = 'product-images'
--         AND is_admin()
--     );

-- CREATE POLICY "Admins can update product images"
--     ON storage.objects FOR UPDATE
--     USING (bucket_id = 'product-images' AND is_admin())
--     WITH CHECK (bucket_id = 'product-images' AND is_admin());

-- CREATE POLICY "Admins can delete product images"
--     ON storage.objects FOR DELETE
--     USING (bucket_id = 'product-images' AND is_admin());

-- CREATE POLICY "Anyone can view product images"
--     ON storage.objects FOR SELECT
--     USING (bucket_id = 'product-images');
