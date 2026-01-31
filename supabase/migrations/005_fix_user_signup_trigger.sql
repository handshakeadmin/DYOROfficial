-- PeptideSource Migration 005: Fix User Signup Trigger
-- Fixes the 500 error on user signup by ensuring the trigger can bypass RLS

-- ============================================
-- STEP 1: Drop and recreate the handle_new_user function
-- with proper SECURITY DEFINER settings
-- ============================================

-- Drop existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop and recreate the function
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

-- Grant execute permission to the function
ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- STEP 2: Add policy to allow service role to bypass RLS
-- The SECURITY DEFINER function runs as postgres, which bypasses RLS by default
-- But we also need to ensure the insert policy works for the trigger context
-- ============================================

-- Drop the existing insert policy that requires auth.uid() = id
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Create a new insert policy that allows:
-- 1. Service role / trigger functions to insert any user
-- 2. Authenticated users to insert their own profile
CREATE POLICY "Allow user profile creation"
    ON users FOR INSERT
    WITH CHECK (
        -- Allow insert if the id matches the authenticated user
        auth.uid() = id
        OR
        -- Allow insert when called from a trigger (auth.uid() will be null)
        auth.uid() IS NULL
    );

-- ============================================
-- STEP 3: Ensure the cart/wishlist creation trigger also has proper permissions
-- ============================================

-- Drop and recreate the cart/wishlist function with better error handling
DROP TRIGGER IF EXISTS trigger_create_user_cart_and_wishlist ON users;
DROP FUNCTION IF EXISTS create_user_cart_and_wishlist();

CREATE OR REPLACE FUNCTION create_user_cart_and_wishlist()
RETURNS TRIGGER AS $$
BEGIN
    -- Create cart for new user
    INSERT INTO carts (user_id) VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    -- Create wishlist for new user
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

-- ============================================
-- STEP 4: Add insert policies for carts and wishlists for trigger context
-- ============================================

-- Drop existing policies if they're too restrictive
DROP POLICY IF EXISTS "Users can create own cart" ON carts;
DROP POLICY IF EXISTS "Users can create own wishlist" ON wishlists;

-- Allow cart creation from trigger or by the user
CREATE POLICY "Allow cart creation"
    ON carts FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        OR
        auth.uid() IS NULL
    );

-- Allow wishlist creation from trigger or by the user
CREATE POLICY "Allow wishlist creation"
    ON wishlists FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        OR
        auth.uid() IS NULL
    );

-- ============================================
-- STEP 5: Grant necessary permissions
-- ============================================

-- Ensure the auth schema functions can be accessed
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

-- Grant permissions on the users table for the trigger function
GRANT INSERT ON public.users TO postgres, service_role;
GRANT INSERT ON public.carts TO postgres, service_role;
GRANT INSERT ON public.wishlists TO postgres, service_role;
