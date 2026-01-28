-- PeptideSource RLS Policies
-- Migration 002: Row Level Security

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

-- ============================================
-- USERS POLICIES
-- ============================================
-- Users can read their own profile
CREATE POLICY "Users can read own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Users are created via trigger, but allow insert for signup flow
CREATE POLICY "Users can insert own profile"
    ON users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ============================================
-- ADDRESSES POLICIES
-- ============================================
-- Users can view their own addresses
CREATE POLICY "Users can view own addresses"
    ON addresses FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create addresses
CREATE POLICY "Users can create own addresses"
    ON addresses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own addresses
CREATE POLICY "Users can update own addresses"
    ON addresses FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own addresses
CREATE POLICY "Users can delete own addresses"
    ON addresses FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- CATEGORIES POLICIES (Public Read)
-- ============================================
CREATE POLICY "Categories are publicly readable"
    ON categories FOR SELECT
    TO PUBLIC
    USING (TRUE);

-- ============================================
-- PRODUCTS POLICIES (Public Read)
-- ============================================
CREATE POLICY "Products are publicly readable"
    ON products FOR SELECT
    TO PUBLIC
    USING (TRUE);

-- ============================================
-- PRODUCT IMAGES POLICIES (Public Read)
-- ============================================
CREATE POLICY "Product images are publicly readable"
    ON product_images FOR SELECT
    TO PUBLIC
    USING (TRUE);

-- ============================================
-- PRODUCT RESEARCH APPLICATIONS POLICIES (Public Read)
-- ============================================
CREATE POLICY "Product research applications are publicly readable"
    ON product_research_applications FOR SELECT
    TO PUBLIC
    USING (TRUE);

-- ============================================
-- CARTS POLICIES
-- ============================================
-- Users can view their own cart
CREATE POLICY "Users can view own cart"
    ON carts FOR SELECT
    USING (auth.uid() = user_id);

-- Users can update their own cart
CREATE POLICY "Users can update own cart"
    ON carts FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ============================================
-- CART ITEMS POLICIES
-- ============================================
-- Users can view items in their cart
CREATE POLICY "Users can view own cart items"
    ON cart_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM carts
            WHERE carts.id = cart_items.cart_id
            AND carts.user_id = auth.uid()
        )
    );

-- Users can add items to their cart
CREATE POLICY "Users can add to own cart"
    ON cart_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM carts
            WHERE carts.id = cart_items.cart_id
            AND carts.user_id = auth.uid()
        )
    );

-- Users can update items in their cart
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

-- Users can remove items from their cart
CREATE POLICY "Users can delete own cart items"
    ON cart_items FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM carts
            WHERE carts.id = cart_items.cart_id
            AND carts.user_id = auth.uid()
        )
    );

-- ============================================
-- WISHLISTS POLICIES
-- ============================================
-- Users can view their own wishlist
CREATE POLICY "Users can view own wishlist"
    ON wishlists FOR SELECT
    USING (auth.uid() = user_id);

-- Users can update their own wishlist
CREATE POLICY "Users can update own wishlist"
    ON wishlists FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ============================================
-- WISHLIST ITEMS POLICIES
-- ============================================
-- Users can view items in their wishlist
CREATE POLICY "Users can view own wishlist items"
    ON wishlist_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM wishlists
            WHERE wishlists.id = wishlist_items.wishlist_id
            AND wishlists.user_id = auth.uid()
        )
    );

-- Users can add items to their wishlist
CREATE POLICY "Users can add to own wishlist"
    ON wishlist_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM wishlists
            WHERE wishlists.id = wishlist_items.wishlist_id
            AND wishlists.user_id = auth.uid()
        )
    );

-- Users can remove items from their wishlist
CREATE POLICY "Users can delete own wishlist items"
    ON wishlist_items FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM wishlists
            WHERE wishlists.id = wishlist_items.wishlist_id
            AND wishlists.user_id = auth.uid()
        )
    );

-- ============================================
-- ORDERS POLICIES
-- ============================================
-- Users can view their own orders
CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create orders
CREATE POLICY "Users can create own orders"
    ON orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================
-- ORDER ITEMS POLICIES
-- ============================================
-- Users can view their own order items
CREATE POLICY "Users can view own order items"
    ON order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

-- Users can create order items for their orders
CREATE POLICY "Users can create own order items"
    ON order_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

-- ============================================
-- REVIEWS POLICIES
-- ============================================
-- Anyone can read approved reviews
CREATE POLICY "Approved reviews are publicly readable"
    ON reviews FOR SELECT
    TO PUBLIC
    USING (approved = TRUE);

-- Users can read their own reviews (even unapproved)
CREATE POLICY "Users can view own reviews"
    ON reviews FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create reviews
CREATE POLICY "Users can create reviews"
    ON reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
    ON reviews FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
    ON reviews FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- FUNCTION: Handle new user signup
-- Creates user profile from auth.users
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
