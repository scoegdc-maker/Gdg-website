-- Make bio column optional in advisors table
-- Run this SQL in your Supabase SQL Editor

ALTER TABLE advisors 
ALTER COLUMN bio DROP NOT NULL;
