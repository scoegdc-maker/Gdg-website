-- Fix 500 Errors caused by infinite recursion in RLS policies
-- Run this SQL in your Supabase SQL Editor

-- 1. Create a secure function to check if a user is an admin
-- This function bypasses RLS (SECURITY DEFINER), preventing the infinite loop
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER 
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM admin_users 
    WHERE id = auth.uid()
  );
END;
$$;

-- 2. Drop the problematic recursive policies on admin_users
DROP POLICY IF EXISTS "Only admins can manage admin users" ON admin_users;
DROP POLICY IF EXISTS "Users can read their own admin status" ON admin_users;

-- 3. Re-create admin_users policies using the new function
-- Allow users to read their own status
CREATE POLICY "Users can read their own admin status"
  ON admin_users FOR SELECT
  USING (auth.uid() = id);

-- Allow admins to manage admin_users (using the secure function)
CREATE POLICY "Admins can manage admin users"
  ON admin_users FOR ALL
  USING (is_admin());

-- 4. Update other tables to use is_admin() for better performance and safety

-- Events
DROP POLICY IF EXISTS "Admin write access for events" ON events;
CREATE POLICY "Admin write access for events" ON events FOR ALL USING (is_admin());

-- Members
DROP POLICY IF EXISTS "Admin write access for members" ON members;
CREATE POLICY "Admin write access for members" ON members FOR ALL USING (is_admin());

-- Library Items
DROP POLICY IF EXISTS "Admin write access for library_items" ON library_items;
CREATE POLICY "Admin write access for library_items" ON library_items FOR ALL USING (is_admin());

-- Advisors
DROP POLICY IF EXISTS "Admin write access for advisors" ON advisors;
CREATE POLICY "Admin write access for advisors" ON advisors FOR ALL USING (is_admin());
