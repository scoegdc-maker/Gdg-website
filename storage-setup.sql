-- Supabase Storage Setup for Images
-- Run this SQL in your Supabase SQL Editor

-- Create public storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to images
CREATE POLICY "Public read access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'images' AND
    auth.role() = 'authenticated'
  );

-- Allow admins to delete images
CREATE POLICY "Admins can delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'images' AND
    auth.uid() IN (SELECT id FROM admin_users)
  );
