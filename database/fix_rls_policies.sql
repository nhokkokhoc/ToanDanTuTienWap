-- =====================================================
-- FIX RLS POLICIES FOR CULTIVATION SYSTEM
-- Fix for "new row violates row-level security policy"
-- =====================================================

-- Enable RLS on players table
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for players table
CREATE POLICY "Users can view own player profile" ON players
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own player profile" ON players
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own player profile" ON players
  FOR UPDATE USING (auth.uid() = id);

-- Enable RLS on characters table (if not already enabled)
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

-- Create/Update RLS policies for characters table
DROP POLICY IF EXISTS "Users can view own characters" ON characters;
DROP POLICY IF EXISTS "Users can insert own characters" ON characters;
DROP POLICY IF EXISTS "Users can update own characters" ON characters;
DROP POLICY IF EXISTS "Users can delete own characters" ON characters;

CREATE POLICY "Users can view own characters" ON characters
  FOR SELECT USING (auth.uid() = player_id);

CREATE POLICY "Users can insert own characters" ON characters
  FOR INSERT WITH CHECK (auth.uid() = player_id);

CREATE POLICY "Users can update own characters" ON characters
  FOR UPDATE USING (auth.uid() = player_id);

CREATE POLICY "Users can delete own characters" ON characters
  FOR DELETE USING (auth.uid() = player_id);

-- Enable RLS on cultivation-related tables
ALTER TABLE character_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultivation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE breakthrough_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_skill_effects ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for character_skills
CREATE POLICY "Users can manage own character skills" ON character_skills
  FOR ALL USING (
    character_id IN (
      SELECT id FROM characters WHERE player_id = auth.uid()
    )
  );

-- Create RLS policies for cultivation_sessions
CREATE POLICY "Users can manage own cultivation sessions" ON cultivation_sessions
  FOR ALL USING (
    character_id IN (
      SELECT id FROM characters WHERE player_id = auth.uid()
    )
  );

-- Create RLS policies for breakthrough_history
CREATE POLICY "Users can manage own breakthrough history" ON breakthrough_history
  FOR ALL USING (
    character_id IN (
      SELECT id FROM characters WHERE player_id = auth.uid()
    )
  );

-- Create RLS policies for active_skill_effects
CREATE POLICY "Users can manage own skill effects" ON active_skill_effects
  FOR ALL USING (
    character_id IN (
      SELECT id FROM characters WHERE player_id = auth.uid()
    )
  );

-- Allow public read access to configuration tables
ALTER TABLE cultivation_realms ENABLE ROW LEVEL SECURITY;
ALTER TABLE sect_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cultivation realms" ON cultivation_realms
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read sect skills" ON sect_skills
  FOR SELECT USING (true);

-- Verify policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('players', 'characters', 'character_skills', 'cultivation_sessions', 'breakthrough_history', 'active_skill_effects', 'cultivation_realms', 'sect_skills')
ORDER BY tablename, policyname;
