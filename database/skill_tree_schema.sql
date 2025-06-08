-- Phase 1.3.2: Skill Tree System Database Schema
-- Extends existing database to support skill tree functionality

-- Add skill points to characters table
ALTER TABLE characters 
ADD COLUMN IF NOT EXISTS available_skill_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_skill_points_earned INTEGER DEFAULT 0;

-- Extend character_skills table for skill tree system
ALTER TABLE character_skills 
ADD COLUMN IF NOT EXISTS skill_tier INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS max_level INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS current_effects JSONB DEFAULT '{}';

-- Create skill tree configuration table
CREATE TABLE IF NOT EXISTS skill_tree_config (
  id TEXT PRIMARY KEY,
  sect_id TEXT NOT NULL, -- 'sword', 'lightning', 'medical', 'defense'
  name TEXT NOT NULL,
  description TEXT,
  tier INTEGER NOT NULL, -- 1, 2, 3, 4
  max_level INTEGER DEFAULT 10,
  effect_type TEXT NOT NULL, -- 'stat_bonus', 'cultivation_speed', 'passive_ability'
  effect_value DECIMAL NOT NULL,
  effect_per_level DECIMAL DEFAULT 0.0,
  stat_type TEXT, -- 'attack', 'defense', 'speed', etc.
  unlock_requirements JSONB DEFAULT '{}', -- level, realm, prerequisite_skills
  skill_point_cost INTEGER DEFAULT 1,
  display_order INTEGER DEFAULT 0,
  icon TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for skill_tree_config
CREATE INDEX IF NOT EXISTS idx_skill_tree_config_sect_id ON skill_tree_config(sect_id);
CREATE INDEX IF NOT EXISTS idx_skill_tree_config_tier ON skill_tree_config(tier);

-- Insert Sword Sect Skills
INSERT INTO skill_tree_config (id, sect_id, name, description, tier, effect_type, effect_value, effect_per_level, stat_type, unlock_requirements, skill_point_cost, display_order, icon) VALUES
-- Tier 1
('sword_basic', 'sword', 'Cơ Bản Kiếm Pháp', 'Nền tảng của kiếm thuật, tăng sức tấn công cơ bản.', 1, 'stat_bonus', 5, 2, 'attack', '{"level": 1}', 1, 1, '⚔️'),
('sword_speed', 'sword', 'Tốc Kiếm', 'Tăng tốc độ ra đòn và di chuyển.', 1, 'stat_bonus', 3, 1, 'speed', '{"level": 1}', 1, 2, '💨'),
('sword_qi', 'sword', 'Kiếm Khí Cơ Bản', 'Tăng tỷ lệ chí mạng khi sử dụng kiếm.', 1, 'stat_bonus', 0.02, 0.01, 'criticalRate', '{"level": 1}', 1, 3, '✨'),

-- Tier 2
('sword_sharp_qi', 'sword', 'Kiếm Khí Sắc Bén', 'Kiếm khí sắc bén hơn, tăng mạnh tỷ lệ chí mạng.', 2, 'stat_bonus', 0.08, 0.02, 'criticalRate', '{"level": 10, "prerequisiteSkills": ["sword_basic"]}', 2, 4, '⚡'),
('sword_combo', 'sword', 'Liên Hoàn Kiếm', 'Chuỗi đòn kiếm liên hoàn, tăng sức tấn công.', 2, 'stat_bonus', 10, 3, 'attack', '{"level": 10, "prerequisiteSkills": ["sword_speed"]}', 2, 5, '🌪️'),
('sword_defense', 'sword', 'Phòng Thủ Kiếm', 'Sử dụng kiếm để phòng thủ, tăng khả năng phòng thủ.', 2, 'stat_bonus', 5, 2, 'defense', '{"level": 10}', 2, 6, '🛡️'),

-- Tier 3
('sword_master', 'sword', 'Thiên Kiếm Thuật', 'Kiếm thuật thiên cấp, tăng mạnh tấn công và chí mạng.', 3, 'stat_bonus', 15, 5, 'attack', '{"level": 20, "prerequisiteSkills": ["sword_sharp_qi", "sword_combo"]}', 3, 7, '🗡️'),
('sword_cultivation', 'sword', 'Kiếm Ý Thông Thiên', 'Thấu hiểu kiếm ý, tăng tốc độ tu luyện.', 3, 'cultivation_speed', 0.20, 0.05, null, '{"level": 20, "prerequisiteSkills": ["sword_defense"]}', 3, 8, '🌟'),
('sword_ultimate', 'sword', 'Vạn Kiếm Quy Tông', 'Tuyệt kỹ kiếm tông, sức mạnh tối thượng.', 3, 'stat_bonus', 25, 8, 'attack', '{"level": 25, "prerequisiteSkills": ["sword_master", "sword_cultivation"]}', 3, 9, '👑');

-- Insert Lightning Sect Skills
INSERT INTO skill_tree_config (id, sect_id, name, description, tier, effect_type, effect_value, effect_per_level, stat_type, unlock_requirements, skill_point_cost, display_order, icon) VALUES
-- Tier 1
('lightning_basic', 'lightning', 'Cơ Bản Lôi Pháp', 'Nền tảng của lôi thuật, tăng sức tấn công ma thuật.', 1, 'stat_bonus', 4, 2, 'attack', '{"level": 1}', 1, 1, '⚡'),
('lightning_speed', 'lightning', 'Lôi Tốc', 'Tốc độ nhanh như sét đánh, tăng tốc độ đáng kể.', 1, 'stat_bonus', 6, 2, 'speed', '{"level": 1}', 1, 2, '💨'),
('lightning_static', 'lightning', 'Tĩnh Điện', 'Tích tụ tĩnh điện, tăng sức mạnh tinh thần.', 1, 'stat_bonus', 3, 1, 'spiritualPower', '{"level": 1}', 1, 3, '⚡'),

-- Tier 2
('lightning_storm', 'lightning', 'Sấm Sét Liên Hoàn', 'Chuỗi sấm sét liên hoàn, tăng mạnh sức tấn công.', 2, 'stat_bonus', 12, 4, 'attack', '{"level": 10, "prerequisiteSkills": ["lightning_basic"]}', 2, 4, '🌩️'),
('lightning_light_speed', 'lightning', 'Tốc Độ Ánh Sáng', 'Di chuyển với tốc độ ánh sáng.', 2, 'stat_bonus', 15, 5, 'speed', '{"level": 10, "prerequisiteSkills": ["lightning_speed"]}', 2, 5, '💫'),
('lightning_shield', 'lightning', 'Lôi Khiên', 'Khiên sét bảo vệ, tăng phòng thủ.', 2, 'stat_bonus', 8, 3, 'defense', '{"level": 10, "prerequisiteSkills": ["lightning_static"]}', 2, 6, '⚡🛡️');

-- Insert Medical Sect Skills
INSERT INTO skill_tree_config (id, sect_id, name, description, tier, effect_type, effect_value, effect_per_level, stat_type, unlock_requirements, skill_point_cost, display_order, icon) VALUES
-- Tier 1
('medical_basic', 'medical', 'Cơ Bản Y Thuật', 'Nền tảng y thuật, tăng máu tối đa.', 1, 'stat_bonus', 100, 50, 'spiritualPower', '{"level": 1}', 1, 1, '💚'),
('medical_herbs', 'medical', 'Thảo Dược Học', 'Hiểu biết về thảo dược, tăng hiệu quả thuốc.', 1, 'passive_ability', 0.05, 0.02, null, '{"level": 1}', 1, 2, '🌿'),
('medical_regen', 'medical', 'Nội Công Dưỡng Sinh', 'Nội công hồi phục, tăng tốc độ hồi máu.', 1, 'passive_ability', 0.03, 0.01, null, '{"level": 1}', 1, 3, '💖');

-- Insert Defense Sect Skills
INSERT INTO skill_tree_config (id, sect_id, name, description, tier, effect_type, effect_value, effect_per_level, stat_type, unlock_requirements, skill_point_cost, display_order, icon) VALUES
-- Tier 1
('defense_basic', 'defense', 'Cơ Bản Khiên Pháp', 'Nền tảng phòng thủ, tăng khả năng phòng thủ.', 1, 'stat_bonus', 8, 3, 'defense', '{"level": 1}', 1, 1, '🛡️'),
('defense_body', 'defense', 'Thể Phách Cường Hóa', 'Cường hóa thể phách, tăng máu tối đa.', 1, 'stat_bonus', 150, 75, 'spiritualPower', '{"level": 1}', 1, 2, '💪'),
('defense_endurance', 'defense', 'Kiên Nhẫn', 'Tăng khả năng chịu đựng sát thương.', 1, 'passive_ability', 0.05, 0.02, null, '{"level": 1}', 1, 3, '🏔️');

-- Function to calculate skill points earned from level
CREATE OR REPLACE FUNCTION calculate_skill_points_from_level(character_level INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Base: 1 point per level
  -- Milestone bonus: +2 at levels 10, 20, 30, etc.
  RETURN character_level + (character_level / 10) * 2;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate skill points from breakthroughs
CREATE OR REPLACE FUNCTION calculate_skill_points_from_breakthroughs(character_realm TEXT)
RETURNS INTEGER AS $$
BEGIN
  CASE character_realm
    WHEN 'qi_refining' THEN RETURN 0;
    WHEN 'foundation' THEN RETURN 3;
    WHEN 'golden_core' THEN RETURN 6;
    WHEN 'nascent_soul' THEN RETURN 9;
    WHEN 'spirit_severing' THEN RETURN 12;
    WHEN 'void_refinement' THEN RETURN 15;
    WHEN 'body_integration' THEN RETURN 18;
    WHEN 'mahayana' THEN RETURN 21;
    WHEN 'true_immortal' THEN RETURN 24;
    ELSE RETURN 0;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to update character skill points
CREATE OR REPLACE FUNCTION update_character_skill_points(character_id UUID)
RETURNS VOID AS $$
DECLARE
  char_level INTEGER;
  char_realm TEXT;
  total_points INTEGER;
  used_points INTEGER;
BEGIN
  -- Get character level and realm
  SELECT level, realm INTO char_level, char_realm
  FROM characters WHERE id = character_id;
  
  -- Calculate total skill points earned
  total_points := calculate_skill_points_from_level(char_level) + 
                  calculate_skill_points_from_breakthroughs(char_realm);
  
  -- Calculate used skill points
  SELECT COALESCE(SUM(allocated_points), 0) INTO used_points
  FROM character_skills WHERE character_id = character_id;
  
  -- Update character skill points
  UPDATE characters 
  SET 
    total_skill_points_earned = total_points,
    available_skill_points = total_points - used_points
  WHERE id = character_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update skill points when character levels up or breaks through
CREATE OR REPLACE FUNCTION trigger_update_skill_points()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_character_skill_points(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_skill_points_trigger ON characters;
CREATE TRIGGER update_skill_points_trigger
  AFTER UPDATE OF level, realm ON characters
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_skill_points();

-- Update existing characters' skill points
DO $$
DECLARE
  char_record RECORD;
BEGIN
  FOR char_record IN SELECT id FROM characters LOOP
    PERFORM update_character_skill_points(char_record.id);
  END LOOP;
END $$;
