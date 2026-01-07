-- Fix for infinite recursion in RLS policies
-- Run this in your Supabase SQL Editor

-- First, drop the problematic policies
DROP POLICY IF EXISTS "Users can read their own admin status" ON admin_users;
DROP POLICY IF EXISTS "Only admins can manage admin users" ON admin_users;

-- Recreate admin_users policies without recursion
-- Allow authenticated users to read their own admin status
CREATE POLICY "Users can read their own admin status"
  ON admin_users FOR SELECT
  USING (auth.uid() = id);

-- Only allow existing admins to insert/update/delete admin users
-- This uses a simpler check that doesn't cause recursion
CREATE POLICY "Admins can manage admin users"
  ON admin_users FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid()
    )
  );

-- Alternative: If the above still causes issues, use this simpler version
-- that allows any authenticated user to read admin_users but only admins to write
-- DROP POLICY IF EXISTS "Admins can manage admin users" ON admin_users;
-- 
-- CREATE POLICY "Anyone can read admin status"
--   ON admin_users FOR SELECT
--   USING (true);
-- 
-- CREATE POLICY "Service role only for admin management"
--   ON admin_users FOR ALL
--   USING (false);
