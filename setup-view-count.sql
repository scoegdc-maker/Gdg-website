-- Create a table to store the view count
CREATE TABLE IF NOT EXISTS site_analytics (
    id INT PRIMARY KEY DEFAULT 1,
    view_count BIGINT DEFAULT 0
);

-- Initialize with a single row if it doesn't exist
INSERT INTO site_analytics (id, view_count)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- Create a function to atomically increment the view count
CREATE OR REPLACE FUNCTION increment_view_count()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_count BIGINT;
BEGIN
    UPDATE site_analytics
    SET view_count = view_count + 1
    WHERE id = 1
    RETURNING view_count INTO new_count;
    
    RETURN new_count;
END;
$$;

-- Allow public read access to the analytics table
ALTER TABLE site_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for site_analytics"
  ON site_analytics FOR SELECT
  USING (true);
