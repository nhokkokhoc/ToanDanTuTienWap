-- =====================================================
-- CULTIVATION SYSTEM DATABASE SCHEMA
-- Phase 1.3: Core Cultivation System
-- =====================================================

-- Extend characters table for cultivation
ALTER TABLE characters ADD COLUMN IF NOT EXISTS current_cultivation_points BIGINT DEFAULT 0;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS total_cultivation_time INTEGER DEFAULT 0; -- in minutes
ALTER TABLE characters ADD COLUMN IF NOT EXISTS last_cultivation_check TIMESTAMP DEFAULT NOW();
ALTER TABLE characters ADD COLUMN IF NOT EXISTS cultivation_session_start TIMESTAMP;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS cultivation_session_duration INTEGER DEFAULT 0; -- in minutes
ALTER TABLE characters ADD COLUMN IF NOT EXISTS is_cultivating BOOLEAN DEFAULT FALSE;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS offline_cultivation_bonus DECIMAL DEFAULT 0.5; -- 50% efficiency offline

-- Experience and level system
ALTER TABLE characters ADD COLUMN IF NOT EXISTS total_experience BIGINT DEFAULT 0;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS experience_to_next_level BIGINT DEFAULT 100;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS experience_sources JSONB DEFAULT '{}';

-- Skill system
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

-- Create indexes for character_skills
CREATE INDEX IF NOT EXISTS idx_character_skills_character_id ON character_skills(character_id);
CREATE INDEX IF NOT EXISTS idx_character_skills_skill_id ON character_skills(skill_id);

-- Cultivation sessions tracking
CREATE TABLE IF NOT EXISTS cultivation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  session_start TIMESTAMP NOT NULL,
  session_end TIMESTAMP,
  duration_minutes INTEGER DEFAULT 0,
  points_gained BIGINT DEFAULT 0,
  base_speed DECIMAL DEFAULT 1.0,
  final_speed DECIMAL DEFAULT 1.0,
  modifiers JSONB DEFAULT '{}', -- speed bonuses applied
  is_offline BOOLEAN DEFAULT FALSE
);

-- Create indexes for cultivation_sessions
CREATE INDEX IF NOT EXISTS idx_cultivation_sessions_character_id ON cultivation_sessions(character_id);
CREATE INDEX IF NOT EXISTS idx_cultivation_sessions_start ON cultivation_sessions(session_start);

-- Breakthrough history
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

-- Create indexes for breakthrough_history
CREATE INDEX IF NOT EXISTS idx_breakthrough_history_character_id ON breakthrough_history(character_id);
CREATE INDEX IF NOT EXISTS idx_breakthrough_history_realm ON breakthrough_history(to_realm);

-- Skill effects tracking
CREATE TABLE IF NOT EXISTS active_skill_effects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL,
  effect_type TEXT NOT NULL, -- 'stat_bonus', 'cultivation_speed', 'passive_ability'
  effect_value DECIMAL NOT NULL,
  duration_minutes INTEGER, -- NULL for permanent effects
  applied_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- Create indexes for active_skill_effects
CREATE INDEX IF NOT EXISTS idx_active_skill_effects_character_id ON active_skill_effects(character_id);
CREATE INDEX IF NOT EXISTS idx_active_skill_effects_expires ON active_skill_effects(expires_at);

-- Cultivation realms configuration
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

-- Create indexes for cultivation_realms
CREATE INDEX IF NOT EXISTS idx_cultivation_realms_level ON cultivation_realms(level_min, level_max);

-- Insert default cultivation realms
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

-- Sect skills configuration
CREATE TABLE IF NOT EXISTS sect_skills (
  id TEXT PRIMARY KEY,
  sect_id TEXT NOT NULL, -- 'sword', 'lightning', 'medical', 'defense'
  name TEXT NOT NULL,
  description TEXT,
  tier INTEGER NOT NULL, -- 1, 2, 3, 4 (higher tier = more powerful)
  max_level INTEGER DEFAULT 10,
  effect_type TEXT NOT NULL, -- 'stat_bonus', 'cultivation_speed', 'passive_ability', 'active_skill'
  effect_value DECIMAL NOT NULL,
  effect_per_level DECIMAL DEFAULT 0.0,
  unlock_requirements JSONB DEFAULT '{}', -- level, realm, prerequisite_skills
  skill_point_cost INTEGER DEFAULT 1,
  display_order INTEGER DEFAULT 0
);

-- Create indexes for sect_skills
CREATE INDEX IF NOT EXISTS idx_sect_skills_sect ON sect_skills(sect_id);
CREATE INDEX IF NOT EXISTS idx_sect_skills_tier ON sect_skills(tier);

-- Insert default sect skills (sample for Sword Sect)
INSERT INTO sect_skills (id, sect_id, name, description, tier, effect_type, effect_value, effect_per_level, unlock_requirements, skill_point_cost, display_order) VALUES
-- Sword Sect Tier 1
('sword_basic_mastery', 'sword', 'Cơ Bản Kiếm Pháp', 'Nắm vững những kỹ thuật kiếm cơ bản, tăng sát thương tấn công.', 1, 'stat_bonus', 0.05, 0.02, '{"level": 1}', 1, 1),
('sword_swift_strike', 'sword', 'Tốc Kiếm', 'Rèn luyện tốc độ ra kiếm, tăng tốc độ tấn công.', 1, 'stat_bonus', 0.03, 0.01, '{"level": 1}', 1, 2),

-- Sword Sect Tier 2
('sword_critical_edge', 'sword', 'Kiếm Khí Sắc Bén', 'Tập trung kiếm khí vào lưỡi kiếm, tăng tỷ lệ chí mạng.', 2, 'stat_bonus', 0.08, 0.03, '{"level": 10, "prerequisite_skills": ["sword_basic_mastery"]}', 2, 3),
('sword_wind_blade', 'sword', 'Phong Nhận', 'Tạo ra lưỡi gió bằng kiếm khí, có thể tấn công nhiều mục tiêu.', 2, 'active_skill', 1.5, 0.1, '{"level": 10, "prerequisite_skills": ["sword_swift_strike"]}', 2, 4),

-- Lightning Sect Tier 1
('lightning_basic_control', 'lightning', 'Cơ Bản Lôi Pháp', 'Học cách điều khiển sức mạnh sấm sét cơ bản.', 1, 'stat_bonus', 0.04, 0.02, '{"level": 1}', 1, 1),
('lightning_speed_boost', 'lightning', 'Lôi Tốc', 'Sử dụng sức mạnh sấm sét để tăng tốc độ di chuyển.', 1, 'stat_bonus', 0.06, 0.02, '{"level": 1}', 1, 2)

ON CONFLICT (id) DO NOTHING;

-- Functions for cultivation calculations
CREATE OR REPLACE FUNCTION calculate_cultivation_speed(character_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    base_speed DECIMAL := 1.0;
    sect_bonus DECIMAL := 0.0;
    skill_bonus DECIMAL := 0.0;
    equipment_bonus DECIMAL := 0.0;
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
    
    -- Get skill bonuses
    SELECT COALESCE(SUM(
        CASE 
            WHEN aes.effect_type = 'cultivation_speed' THEN aes.effect_value
            ELSE 0
        END
    ), 0) INTO skill_bonus
    FROM active_skill_effects aes
    WHERE aes.character_id = character_id 
    AND (aes.expires_at IS NULL OR aes.expires_at > NOW());
    
    -- Calculate final speed
    final_speed := base_speed * (1 + sect_bonus + skill_bonus + equipment_bonus);
    
    RETURN final_speed;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate offline cultivation progress
CREATE OR REPLACE FUNCTION calculate_offline_progress(character_id UUID)
RETURNS TABLE(points_gained BIGINT, time_elapsed INTEGER) AS $$
DECLARE
    last_check TIMESTAMP;
    current_time TIMESTAMP := NOW();
    elapsed_minutes INTEGER;
    cultivation_speed DECIMAL;
    offline_efficiency DECIMAL;
    points_per_minute DECIMAL;
    total_points BIGINT;
BEGIN
    -- Get last cultivation check time
    SELECT last_cultivation_check, offline_cultivation_bonus 
    INTO last_check, offline_efficiency
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
