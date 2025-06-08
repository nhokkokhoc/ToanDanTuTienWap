-- =====================================================
-- CULTIVATION SYSTEM DATABASE SCHEMA (SIMPLIFIED)
-- Phase 1.3: Core Cultivation System
-- =====================================================

-- Step 1: Create players table if not exists
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  username TEXT NOT NULL,
  avatar TEXT,
  last_login TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Step 2: Extend characters table for cultivation
ALTER TABLE characters 
ADD COLUMN IF NOT EXISTS current_cultivation_points BIGINT DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_cultivation_time INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_cultivation_check TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS cultivation_session_start TIMESTAMP,
ADD COLUMN IF NOT EXISTS cultivation_session_duration INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_cultivating BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS offline_cultivation_bonus DECIMAL DEFAULT 0.5;

-- Step 3: Add experience and level columns
ALTER TABLE characters 
ADD COLUMN IF NOT EXISTS total_experience BIGINT DEFAULT 0,
ADD COLUMN IF NOT EXISTS experience_to_next_level BIGINT DEFAULT 100,
ADD COLUMN IF NOT EXISTS experience_sources JSONB DEFAULT '{}';

-- Step 4: Create character_skills table
CREATE TABLE IF NOT EXISTS character_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL,
  skill_level INTEGER DEFAULT 1,
  allocated_points INTEGER DEFAULT 0,
  unlocked_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(character_id, skill_id)
);

-- Step 5: Create cultivation_sessions table
CREATE TABLE IF NOT EXISTS cultivation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  session_start TIMESTAMP NOT NULL,
  session_end TIMESTAMP,
  duration_minutes INTEGER DEFAULT 0,
  points_gained BIGINT DEFAULT 0,
  base_speed DECIMAL DEFAULT 1.0,
  final_speed DECIMAL DEFAULT 1.0,
  modifiers JSONB DEFAULT '{}',
  is_offline BOOLEAN DEFAULT FALSE
);

-- Step 6: Create breakthrough_history table
CREATE TABLE IF NOT EXISTS breakthrough_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  from_realm TEXT NOT NULL,
  to_realm TEXT NOT NULL,
  breakthrough_at TIMESTAMP DEFAULT NOW(),
  cultivation_points_required BIGINT NOT NULL,
  materials_used JSONB DEFAULT '{}',
  success BOOLEAN DEFAULT TRUE
);

-- Step 7: Create active_skill_effects table
CREATE TABLE IF NOT EXISTS active_skill_effects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL,
  effect_type TEXT NOT NULL,
  effect_value DECIMAL NOT NULL,
  duration_minutes INTEGER,
  applied_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- Step 8: Create cultivation_realms table
CREATE TABLE IF NOT EXISTS cultivation_realms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  level_min INTEGER NOT NULL,
  level_max INTEGER NOT NULL,
  cultivation_points_required BIGINT NOT NULL,
  stat_multiplier DECIMAL DEFAULT 1.0,
  cultivation_speed_bonus DECIMAL DEFAULT 0.0,
  new_skill_slots INTEGER DEFAULT 0,
  breakthrough_materials JSONB DEFAULT '{}',
  display_order INTEGER DEFAULT 0
);

-- Step 9: Create sect_skills table
CREATE TABLE IF NOT EXISTS sect_skills (
  id TEXT PRIMARY KEY,
  sect_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  tier INTEGER NOT NULL,
  max_level INTEGER DEFAULT 10,
  effect_type TEXT NOT NULL,
  effect_value DECIMAL NOT NULL,
  effect_per_level DECIMAL DEFAULT 0.0,
  unlock_requirements JSONB DEFAULT '{}',
  skill_point_cost INTEGER DEFAULT 1,
  display_order INTEGER DEFAULT 0
);

-- Step 10: Insert default cultivation realms
INSERT INTO cultivation_realms (id, name, description, level_min, level_max, cultivation_points_required, stat_multiplier, cultivation_speed_bonus, new_skill_slots, display_order) VALUES
('qi_refining', 'Luyện Khí', 'Cảnh giới đầu tiên của tu tiên, tập trung vào việc tích lũy và tinh luyện khí trong cơ thể.', 1, 10, 0, 1.0, 0.0, 0, 1),
('foundation', 'Trúc Cơ', 'Xây dựng nền tảng vững chắc cho con đường tu tiên, mở rộng kinh mạch.', 11, 20, 10000, 1.2, 0.1, 1, 2),
('golden_core', 'Kim Đan', 'Ngưng tụ kim đan trong đan điền, đánh dấu bước tiến quan trọng trong tu luyện.', 21, 30, 50000, 1.5, 0.25, 2, 3),
('nascent_soul', 'Nguyên Anh', 'Hình thành nguyên anh, có thể tồn tại độc lập khỏi thể xác.', 31, 40, 150000, 2.0, 0.5, 3, 4),
('spirit_severing', 'Hóa Thần', 'Cắt đứt mọi ràng buộc trần tục, tiến gần đến cảnh giới bất tử.', 41, 50, 400000, 3.0, 1.0, 4, 5),
('void_refinement', 'Luyện Hư', 'Luyện hóa hư vô, hiểu được bản chất của vũ trụ.', 51, 60, 1000000, 4.0, 1.5, 5, 6),
('body_integration', 'Hợp Thể', 'Hợp nhất thể xác và nguyên anh, đạt được sự hoàn hảo.', 61, 70, 2500000, 6.0, 2.0, 6, 7),
('mahayana', 'Đại Thừa', 'Đạt được đại thừa, sẵn sàng vượt kiếp thành tiên.', 71, 80, 6000000, 10.0, 3.0, 7, 8),
('true_immortal', 'Chân Tiên', 'Vượt qua thiên kiếp, trở thành chân tiên bất tử.', 81, 100, 15000000, 20.0, 5.0, 10, 9)
ON CONFLICT (id) DO NOTHING;

-- Step 11: Insert sample sect skills (Sword Sect)
INSERT INTO sect_skills (id, sect_id, name, description, tier, effect_type, effect_value, effect_per_level, unlock_requirements, skill_point_cost, display_order) VALUES
('sword_basic_mastery', 'sword', 'Cơ Bản Kiếm Pháp', 'Nắm vững những kỹ thuật kiếm cơ bản, tăng sát thương tấn công.', 1, 'stat_bonus', 0.05, 0.02, '{"level": 1}', 1, 1),
('sword_swift_strike', 'sword', 'Tốc Kiếm', 'Rèn luyện tốc độ ra kiếm, tăng tốc độ tấn công.', 1, 'stat_bonus', 0.03, 0.01, '{"level": 1}', 1, 2),
('sword_critical_edge', 'sword', 'Kiếm Khí Sắc Bén', 'Tập trung kiếm khí vào lưỡi kiếm, tăng tỷ lệ chí mạng.', 2, 'stat_bonus', 0.08, 0.03, '{"level": 10, "prerequisite_skills": ["sword_basic_mastery"]}', 2, 3),
('lightning_basic_control', 'lightning', 'Cơ Bản Lôi Pháp', 'Học cách điều khiển sức mạnh sấm sét cơ bản.', 1, 'stat_bonus', 0.04, 0.02, '{"level": 1}', 1, 1),
('lightning_speed_boost', 'lightning', 'Lôi Tốc', 'Sử dụng sức mạnh sấm sét để tăng tốc độ di chuyển.', 1, 'stat_bonus', 0.06, 0.02, '{"level": 1}', 1, 2)
ON CONFLICT (id) DO NOTHING;

-- Step 12: Create simple cultivation speed function
CREATE OR REPLACE FUNCTION calculate_cultivation_speed(character_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    base_speed DECIMAL := 1.0;
    sect_bonus DECIMAL := 0.0;
    final_speed DECIMAL;
BEGIN
    -- Get character sect and apply sect bonus
    SELECT 
        CASE 
            WHEN sect = 'sword' THEN 0.05
            WHEN sect = 'lightning' THEN 0.08
            WHEN sect = 'medical' THEN 0.03
            WHEN sect = 'defense' THEN 0.02
            ELSE 0.0
        END INTO sect_bonus
    FROM characters WHERE id = character_id;
    
    -- Calculate final speed
    final_speed := base_speed * (1 + sect_bonus);
    
    RETURN final_speed;
END;
$$ LANGUAGE plpgsql;

-- Step 13: Setup RLS Policies
-- Enable RLS on players table
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for players table
CREATE POLICY "Users can view own player profile" ON players
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own player profile" ON players
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own player profile" ON players
  FOR UPDATE USING (auth.uid() = id);

-- Enable RLS on characters table
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for characters table
CREATE POLICY "Users can view own characters" ON characters
  FOR SELECT USING (auth.uid() = player_id);

CREATE POLICY "Users can insert own characters" ON characters
  FOR INSERT WITH CHECK (auth.uid() = player_id);

CREATE POLICY "Users can update own characters" ON characters
  FOR UPDATE USING (auth.uid() = player_id);

CREATE POLICY "Users can delete own characters" ON characters
  FOR DELETE USING (auth.uid() = player_id);

-- Enable RLS on cultivation tables
ALTER TABLE character_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultivation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE breakthrough_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_skill_effects ENABLE ROW LEVEL SECURITY;

-- RLS policies for cultivation tables
CREATE POLICY "Users can manage own character skills" ON character_skills
  FOR ALL USING (character_id IN (SELECT id FROM characters WHERE player_id = auth.uid()));

CREATE POLICY "Users can manage own cultivation sessions" ON cultivation_sessions
  FOR ALL USING (character_id IN (SELECT id FROM characters WHERE player_id = auth.uid()));

CREATE POLICY "Users can manage own breakthrough history" ON breakthrough_history
  FOR ALL USING (character_id IN (SELECT id FROM characters WHERE player_id = auth.uid()));

CREATE POLICY "Users can manage own skill effects" ON active_skill_effects
  FOR ALL USING (character_id IN (SELECT id FROM characters WHERE player_id = auth.uid()));

-- Allow public read for config tables
ALTER TABLE cultivation_realms ENABLE ROW LEVEL SECURITY;
ALTER TABLE sect_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cultivation realms" ON cultivation_realms FOR SELECT USING (true);
CREATE POLICY "Anyone can read sect skills" ON sect_skills FOR SELECT USING (true);

-- Step 14: Create simple cultivation speed function
CREATE OR REPLACE FUNCTION calculate_offline_progress(character_id UUID)
RETURNS TABLE(points_gained BIGINT, time_elapsed INTEGER) AS $$
DECLARE
    last_check TIMESTAMP;
    current_time TIMESTAMP := NOW();
    elapsed_minutes INTEGER;
    cultivation_speed DECIMAL;
    offline_efficiency DECIMAL := 0.5;
    points_per_minute DECIMAL;
    total_points BIGINT;
BEGIN
    -- Get last cultivation check time
    SELECT last_cultivation_check INTO last_check
    FROM characters WHERE id = character_id;
    
    -- Calculate elapsed time in minutes
    elapsed_minutes := EXTRACT(EPOCH FROM (current_time - last_check)) / 60;
    
    -- Cap offline time to 24 hours (1440 minutes)
    elapsed_minutes := LEAST(elapsed_minutes, 1440);
    
    -- Get cultivation speed
    cultivation_speed := calculate_cultivation_speed(character_id);
    
    -- Calculate points per minute (base: 10 points per hour = 0.167 points per minute)
    points_per_minute := 0.167 * cultivation_speed * offline_efficiency;
    
    -- Calculate total points gained
    total_points := FLOOR(points_per_minute * elapsed_minutes);
    
    RETURN QUERY SELECT total_points, elapsed_minutes;
END;
$$ LANGUAGE plpgsql;

-- Step 15: Create offline progress function
CREATE OR REPLACE FUNCTION calculate_offline_progress(character_id UUID)
RETURNS TABLE(points_gained BIGINT, time_elapsed INTEGER) AS $$
DECLARE
    last_check TIMESTAMP;
    current_time TIMESTAMP := NOW();
    elapsed_minutes INTEGER;
    cultivation_speed DECIMAL;
    offline_efficiency DECIMAL := 0.5;
    points_per_minute DECIMAL;
    total_points BIGINT;
BEGIN
    -- Get last cultivation check time
    SELECT last_cultivation_check INTO last_check
    FROM characters WHERE id = character_id;

    -- Calculate elapsed time in minutes
    elapsed_minutes := EXTRACT(EPOCH FROM (current_time - last_check)) / 60;

    -- Cap offline time to 24 hours (1440 minutes)
    elapsed_minutes := LEAST(elapsed_minutes, 1440);

    -- Get cultivation speed
    cultivation_speed := calculate_cultivation_speed(character_id);

    -- Calculate points per minute (base: 10 points per hour = 0.167 points per minute)
    points_per_minute := 0.167 * cultivation_speed * offline_efficiency;

    -- Calculate total points gained
    total_points := FLOOR(points_per_minute * elapsed_minutes);

    RETURN QUERY SELECT total_points, elapsed_minutes;
END;
$$ LANGUAGE plpgsql;
