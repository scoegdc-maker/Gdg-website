-- Add color column to library_items table
-- Run this SQL in your Supabase SQL Editor

ALTER TABLE library_items 
ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#4285F4';

-- Add a comment to document the column
COMMENT ON COLUMN library_items.color IS 'Hex color code for the glow effect (e.g., #4285F4)';
