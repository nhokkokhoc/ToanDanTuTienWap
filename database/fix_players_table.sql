-- =====================================================
-- QUICK FIX: CREATE PLAYERS TABLE
-- Fix for foreign key constraint error
-- =====================================================

-- Create players table if not exists
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  username TEXT NOT NULL,
  avatar TEXT,
  last_login TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert current user into players table (replace with your user ID)
-- You can get your user ID from: SELECT auth.uid();
-- INSERT INTO players (id, email, username) 
-- VALUES ('your-user-id-here', 'your-email@example.com', 'your-username');

-- Check if players table was created successfully
SELECT 'Players table created successfully' as status;

-- Check current user ID (run this to get your user ID)
SELECT auth.uid() as current_user_id;
