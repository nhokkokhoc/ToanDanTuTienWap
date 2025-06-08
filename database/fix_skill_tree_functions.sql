-- Fix for Phase 1.3.2: Skill Tree System Database Functions
-- Fixes ambiguous column reference error and cultivation bugs

-- Drop and recreate the function with correct parameter naming
DROP FUNCTION IF EXISTS update_character_skill_points(UUID);

-- Function to update character skill points (fixed parameter naming)
CREATE OR REPLACE FUNCTION update_character_skill_points(char_id UUID)
RETURNS VOID AS $$
DECLARE
  char_level INTEGER;
  char_realm TEXT;
  total_points INTEGER;
  used_points INTEGER;
BEGIN
  -- Get character level and realm
  SELECT level, realm INTO char_level, char_realm
  FROM characters WHERE id = char_id;

  -- Calculate total skill points earned
  total_points := calculate_skill_points_from_level(char_level) +
                  calculate_skill_points_from_breakthroughs(char_realm);

  -- Calculate used skill points
  SELECT COALESCE(SUM(allocated_points), 0) INTO used_points
  FROM character_skills WHERE character_id = char_id;

  -- Update character skill points
  UPDATE characters
  SET
    total_skill_points_earned = total_points,
    available_skill_points = total_points - used_points
  WHERE id = char_id;
END;
$$ LANGUAGE plpgsql;

-- Update the trigger function to use the correct parameter name
CREATE OR REPLACE FUNCTION trigger_update_skill_points()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_character_skill_points(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
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

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_character_skills_character_id ON character_skills(character_id);
CREATE INDEX IF NOT EXISTS idx_character_skills_skill_id ON character_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_characters_level ON characters(level);
CREATE INDEX IF NOT EXISTS idx_characters_realm ON characters(realm);

-- Ensure skill tree config table has proper constraints
ALTER TABLE skill_tree_config 
ADD CONSTRAINT check_tier_range CHECK (tier >= 1 AND tier <= 4),
ADD CONSTRAINT check_max_level_positive CHECK (max_level > 0),
ADD CONSTRAINT check_skill_point_cost_positive CHECK (skill_point_cost > 0);

-- Add some sample skill tree data if not exists
INSERT INTO skill_tree_config (id, sect_id, name, description, tier, effect_type, effect_value, effect_per_level, stat_type, unlock_requirements, skill_point_cost, display_order, icon) 
VALUES 
-- Sword Sect Tier 1
('sword_basic', 'sword', 'Cơ Bản Kiếm Pháp', 'Nền tảng của kiếm thuật, tăng sức tấn công cơ bản.', 1, 'stat_bonus', 5, 2, 'attack', '{"level": 1}', 1, 1, '⚔️'),
('sword_speed', 'sword', 'Tốc Kiếm', 'Tăng tốc độ ra đòn và di chuyển.', 1, 'stat_bonus', 3, 1, 'speed', '{"level": 1}', 1, 2, '💨'),
('sword_qi', 'sword', 'Kiếm Khí Cơ Bản', 'Tăng tỷ lệ chí mạng khi sử dụng kiếm.', 1, 'stat_bonus', 0.02, 0.01, 'criticalRate', '{"level": 1}', 1, 3, '✨')
ON CONFLICT (id) DO NOTHING;

-- Lightning Sect Tier 1
INSERT INTO skill_tree_config (id, sect_id, name, description, tier, effect_type, effect_value, effect_per_level, stat_type, unlock_requirements, skill_point_cost, display_order, icon) 
VALUES 
('lightning_basic', 'lightning', 'Cơ Bản Lôi Pháp', 'Nền tảng của lôi thuật, tăng sức tấn công ma thuật.', 1, 'stat_bonus', 4, 2, 'attack', '{"level": 1}', 1, 1, '⚡'),
('lightning_speed', 'lightning', 'Lôi Tốc', 'Tốc độ nhanh như sét đánh, tăng tốc độ đáng kể.', 1, 'stat_bonus', 6, 2, 'speed', '{"level": 1}', 1, 2, '💨'),
('lightning_static', 'lightning', 'Tĩnh Điện', 'Tích tụ tĩnh điện, tăng sức mạnh tinh thần.', 1, 'stat_bonus', 3, 1, 'spiritualPower', '{"level": 1}', 1, 3, '⚡')
ON CONFLICT (id) DO NOTHING;

-- Medical Sect Tier 1
INSERT INTO skill_tree_config (id, sect_id, name, description, tier, effect_type, effect_value, effect_per_level, stat_type, unlock_requirements, skill_point_cost, display_order, icon) 
VALUES 
('medical_basic', 'medical', 'Cơ Bản Y Thuật', 'Nền tảng y thuật, tăng máu tối đa.', 1, 'stat_bonus', 100, 50, 'spiritualPower', '{"level": 1}', 1, 1, '💚'),
('medical_herbs', 'medical', 'Thảo Dược Học', 'Hiểu biết về thảo dược, tăng hiệu quả thuốc.', 1, 'passive_ability', 0.05, 0.02, null, '{"level": 1}', 1, 2, '🌿'),
('medical_regen', 'medical', 'Nội Công Dưỡng Sinh', 'Nội công hồi phục, tăng tốc độ hồi máu.', 1, 'passive_ability', 0.03, 0.01, null, '{"level": 1}', 1, 3, '💖')
ON CONFLICT (id) DO NOTHING;

-- Defense Sect Tier 1
INSERT INTO skill_tree_config (id, sect_id, name, description, tier, effect_type, effect_value, effect_per_level, stat_type, unlock_requirements, skill_point_cost, display_order, icon) 
VALUES 
('defense_basic', 'defense', 'Cơ Bản Khiên Pháp', 'Nền tảng phòng thủ, tăng khả năng phòng thủ.', 1, 'stat_bonus', 8, 3, 'defense', '{"level": 1}', 1, 1, '🛡️'),
('defense_body', 'defense', 'Thể Phách Cường Hóa', 'Cường hóa thể phách, tăng máu tối đa.', 1, 'stat_bonus', 150, 75, 'spiritualPower', '{"level": 1}', 1, 2, '💪'),
('defense_endurance', 'defense', 'Kiên Nhẫn', 'Tăng khả năng chịu đựng sát thương.', 1, 'passive_ability', 0.05, 0.02, null, '{"level": 1}', 1, 3, '🏔️')
ON CONFLICT (id) DO NOTHING;
