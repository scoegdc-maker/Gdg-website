-- GDG SCOE Database Schema
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Events Table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT,
  location TEXT NOT NULL,
  image_url TEXT,
  registration_link TEXT,
  category TEXT,
  color TEXT DEFAULT '#4285F4',
  ai_hint TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Members Table
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  github TEXT,
  linkedin TEXT,
  twitter TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Library Items Table
CREATE TABLE IF NOT EXISTS library_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('android', 'cloud', 'ml', 'web', 'design', 'other')),
  url TEXT NOT NULL,
  image_url TEXT,
  color TEXT DEFAULT '#4285F4',
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Advisors Table
CREATE TABLE IF NOT EXISTS advisors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  email TEXT,
  linkedin TEXT,
  quote TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. CREATE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_events_date ON events(date DESC);
CREATE INDEX IF NOT EXISTS idx_members_order ON members(order_index ASC);
CREATE INDEX IF NOT EXISTS idx_library_items_type ON library_items(type);

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE advisors ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. CREATE RLS POLICIES
-- ============================================

-- Events Policies
CREATE POLICY "Public read access for events"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Admin write access for events"
  ON events FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- Members Policies
CREATE POLICY "Public read access for members"
  ON members FOR SELECT
  USING (true);

CREATE POLICY "Admin write access for members"
  ON members FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- Library Items Policies
CREATE POLICY "Public read access for library_items"
  ON library_items FOR SELECT
  USING (true);

CREATE POLICY "Admin write access for library_items"
  ON library_items FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- Advisors Policies
CREATE POLICY "Public read access for advisors"
  ON advisors FOR SELECT
  USING (true);

CREATE POLICY "Admin write access for advisors"
  ON advisors FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- Admin Users Policies
CREATE POLICY "Users can read their own admin status"
  ON admin_users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Only admins can manage admin users"
  ON admin_users FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- ============================================
-- 5. CREATE FUNCTIONS
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_library_items_updated_at BEFORE UPDATE ON library_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_advisors_updated_at BEFORE UPDATE ON advisors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. INSERT SAMPLE DATA (Optional - for testing)
-- ============================================

-- Sample Events
INSERT INTO events (title, description, date, time, location, image_url, category, color)
VALUES 
  ('Introduction to Cloud Computing', 'Learn the basics of cloud computing with Google Cloud Platform. Perfect for beginners!', '2026-01-15', '14:00', 'SCOE Campus, Room 301', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800', 'Workshop', '#4285F4'),
  ('Android Development Bootcamp', 'Build your first Android app using Kotlin and Jetpack Compose.', '2026-01-22', '10:00', 'SCOE Campus, Lab 2', 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800', 'Bootcamp', '#EA4335'),
  ('Web Development with Firebase', 'Create a full-stack web application using Firebase and React.', '2026-02-05', '15:00', 'Online', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800', 'Workshop', '#FBBC05');

-- Sample Members
INSERT INTO members (name, role, bio, image_url, github, linkedin, order_index)
VALUES 
  ('Priya Sharma', 'Lead', 'Passionate about cloud technologies and community building.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', 'priyasharma', 'priya-sharma', 0),
  ('Rahul Verma', 'Co-Lead', 'Android enthusiast and open-source contributor.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'rahulverma', 'rahul-verma', 1),
  ('Ananya Patel', 'Technical Lead', 'Full-stack developer with expertise in web technologies.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', 'ananyapatel', 'ananya-patel', 2);

-- Sample Library Items
INSERT INTO library_items (title, description, type, url, tags)
VALUES 
  ('Getting Started with Google Cloud', 'Official documentation for Google Cloud Platform beginners.', 'cloud', 'https://cloud.google.com/docs', ARRAY['cloud', 'gcp', 'beginner']),
  ('Kotlin for Android Development', 'Comprehensive video course on Android development with Kotlin.', 'android', 'https://developer.android.com/courses', ARRAY['android', 'kotlin', 'mobile']),
  ('Firebase Documentation', 'Complete guide to Firebase services and integration.', 'web', 'https://firebase.google.com/docs', ARRAY['firebase', 'backend', 'web']);

-- Sample Advisor
INSERT INTO advisors (name, title, bio, image_url, email, linkedin, quote)
VALUES 
  ('Dr. Rajesh Kumar', 'Faculty Advisor & Professor', 'Dr. Kumar is a professor in the Computer Science department with over 15 years of experience in software engineering and cloud computing. He is passionate about mentoring students and fostering innovation.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', 'rajesh.kumar@scoe.edu', 'dr-rajesh-kumar', 'Technology is best when it brings people together.');

-- ============================================
-- 7. ADD ADMIN USERS (IMPORTANT!)
-- ============================================

-- After you log in with Google for the first time, run this query
-- This will grant admin access to the specified email addresses

-- Add devavrat.dh@gmail.com as admin
INSERT INTO admin_users (id, email)
SELECT id, email FROM auth.users WHERE email = 'devavrat.dh@gmail.com'
ON CONFLICT (id) DO NOTHING;

-- Add mehvi313@gmail.com as admin
INSERT INTO admin_users (id, email)
SELECT id, email FROM auth.users WHERE email = 'mehvi313@gmail.com'
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SETUP COMPLETE!
-- ============================================
