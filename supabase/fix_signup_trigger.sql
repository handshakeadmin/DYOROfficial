-- ============================================
-- QUICK FIX: Run this in Supabase SQL Editor to fix user signup
-- This is the same as migration 005 but can be run immediately
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

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 2: Fix the RLS policy for users table

DROP POLICY IF EXISTS "Users can insert own profile" ON users;

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

CREATE TRIGGER trigger_create_user_cart_and_wishlist
    AFTER INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION create_user_cart_and_wishlist();

-- Step 4: Add insert policies for carts and wishlists

DROP POLICY IF EXISTS "Allow cart creation" ON carts;
DROP POLICY IF EXISTS "Allow wishlist creation" ON wishlists;

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

-- Verify the trigger exists
SELECT
    tgname AS trigger_name,
    proname AS function_name,
    tgenabled AS enabled
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'auth' AND c.relname = 'users';
