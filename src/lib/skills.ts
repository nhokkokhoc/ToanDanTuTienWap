// Skill System Logic for Phase 1.3.2
import { supabase } from './supabase'
import { 
  SectType, 
  SectSkill, 
  CharacterSkill, 
  SkillPointsInfo,
  Character,
  SkillEffect 
} from '@/types/game'
import { 
  SKILL_TREES, 
  SKILL_POINT_SOURCES, 
  SKILL_COSTS,
  getSkillTreeBySect,
  getSkillById 
} from './gameData'

// Calculate total skill points a character should have
export function calculateTotalSkillPoints(level: number, realm: string): number {
  let total = 0
  
  // Base points from levels
  total += level * SKILL_POINT_SOURCES.level_up
  
  // Milestone bonuses (levels 10, 20, 30, etc.)
  total += Math.floor(level / 10) * SKILL_POINT_SOURCES.milestone_levels
  
  // Breakthrough bonuses
  const realmBonuses: Record<string, number> = {
    'qi_refining': 0,
    'foundation': 1,
    'golden_core': 2,
    'nascent_soul': 3,
    'spirit_severing': 4,
    'void_refinement': 5,
    'body_integration': 6,
    'mahayana': 7,
    'true_immortal': 8
  }
  
  const realmBonus = realmBonuses[realm] || 0
  total += realmBonus * SKILL_POINT_SOURCES.breakthrough
  
  return total
}

// Get character's skill points information
export async function getCharacterSkillPoints(characterId: string): Promise<SkillPointsInfo> {
  const { data: character, error: charError } = await supabase
    .from('characters')
    .select('level, realm, available_skill_points, total_skill_points_earned')
    .eq('id', characterId)
    .single()
  
  if (charError) throw charError
  
  const totalEarned = calculateTotalSkillPoints(character.level, character.realm)
  
  // Get used points
  const { data: skills, error: skillsError } = await supabase
    .from('character_skills')
    .select('allocated_points')
    .eq('character_id', characterId)
  
  if (skillsError) throw skillsError
  
  const usedPoints = skills?.reduce((sum, skill) => sum + (skill.allocated_points || 0), 0) || 0
  const available = totalEarned - usedPoints
  
  return {
    available,
    totalEarned,
    sources: {
      levelUp: character.level * SKILL_POINT_SOURCES.level_up,
      breakthrough: Math.floor(totalEarned * 0.3), // Approximate
      milestones: Math.floor(character.level / 10) * SKILL_POINT_SOURCES.milestone_levels,
      achievements: 0, // Future feature
      events: 0 // Future feature
    }
  }
}

// Get character's skills
export async function getCharacterSkills(characterId: string): Promise<CharacterSkill[]> {
  const { data, error } = await supabase
    .from('character_skills')
    .select('*')
    .eq('character_id', characterId)
    .eq('is_active', true)
  
  if (error) throw error
  
  return data?.map(skill => ({
    id: skill.id,
    characterId: skill.character_id,
    skillId: skill.skill_id,
    skillLevel: skill.skill_level,
    allocatedPoints: skill.allocated_points,
    unlockedAt: new Date(skill.unlocked_at),
    isActive: skill.is_active,
    currentEffects: skill.current_effects || []
  })) || []
}

// Check if a skill can be unlocked
export function canUnlockSkill(
  skill: SectSkill, 
  characterLevel: number, 
  characterRealm: string,
  unlockedSkills: string[]
): boolean {
  // Check level requirement
  if (skill.requirements.level && characterLevel < skill.requirements.level) {
    return false
  }
  
  // Check realm requirement
  if (skill.requirements.realm && characterRealm !== skill.requirements.realm) {
    return false
  }
  
  // Check prerequisite skills
  if (skill.requirements.prerequisiteSkills) {
    for (const prereq of skill.requirements.prerequisiteSkills) {
      if (!unlockedSkills.includes(prereq)) {
        return false
      }
    }
  }
  
  return true
}

// Unlock a skill for a character
export async function unlockSkill(characterId: string, skillId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('character_skills')
      .insert([{
        character_id: characterId,
        skill_id: skillId,
        skill_level: 0,
        allocated_points: 0,
        is_active: true
      }])
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error unlocking skill:', error)
    return false
  }
}

// Upgrade a skill level
export async function upgradeSkill(
  characterId: string, 
  skillId: string, 
  sectId: SectType
): Promise<boolean> {
  try {
    // Get skill info
    const skill = getSkillById(sectId, skillId)
    if (!skill) throw new Error('Skill not found')
    
    // Get character's current skill data
    const { data: currentSkill, error: skillError } = await supabase
      .from('character_skills')
      .select('*')
      .eq('character_id', characterId)
      .eq('skill_id', skillId)
      .single()
    
    if (skillError) throw skillError
    
    // Check if skill can be upgraded
    if (currentSkill.skill_level >= skill.maxLevel) {
      throw new Error('Skill already at max level')
    }
    
    // Calculate cost
    const cost = SKILL_COSTS[`tier_${skill.tier}` as keyof typeof SKILL_COSTS] || 1
    
    // Check if character has enough skill points
    const skillPoints = await getCharacterSkillPoints(characterId)
    if (skillPoints.available < cost) {
      throw new Error('Not enough skill points')
    }
    
    // Upgrade the skill
    const { error: upgradeError } = await supabase
      .from('character_skills')
      .update({
        skill_level: currentSkill.skill_level + 1,
        allocated_points: currentSkill.allocated_points + cost
      })
      .eq('character_id', characterId)
      .eq('skill_id', skillId)
    
    if (upgradeError) throw upgradeError
    
    // Update character's available skill points
    await updateCharacterSkillPoints(characterId)
    
    return true
  } catch (error) {
    console.error('Error upgrading skill:', error)
    return false
  }
}

// Update character's skill points
export async function updateCharacterSkillPoints(characterId: string): Promise<void> {
  const { data: character, error: charError } = await supabase
    .from('characters')
    .select('level, realm')
    .eq('id', characterId)
    .single()
  
  if (charError) throw charError
  
  const totalEarned = calculateTotalSkillPoints(character.level, character.realm)
  
  // Get used points
  const { data: skills, error: skillsError } = await supabase
    .from('character_skills')
    .select('allocated_points')
    .eq('character_id', characterId)
  
  if (skillsError) throw skillsError
  
  const usedPoints = skills?.reduce((sum, skill) => sum + (skill.allocated_points || 0), 0) || 0
  const available = totalEarned - usedPoints
  
  // Update character
  const { error: updateError } = await supabase
    .from('characters')
    .update({
      total_skill_points_earned: totalEarned,
      available_skill_points: available
    })
    .eq('id', characterId)
  
  if (updateError) throw updateError
}

// Calculate skill effects for a character
export async function calculateSkillEffects(characterId: string, sectId: SectType): Promise<any> {
  const skills = await getCharacterSkills(characterId)
  const effects = {
    statBonuses: {
      attack: 0,
      defense: 0,
      speed: 0,
      criticalRate: 0,
      criticalDamage: 0,
      accuracy: 0,
      evasion: 0,
      spiritualPower: 0,
      comprehension: 0,
      luck: 0
    },
    cultivationSpeedBonus: 0,
    passiveAbilities: [] as string[]
  }
  
  for (const characterSkill of skills) {
    const skill = getSkillById(sectId, characterSkill.skillId)
    if (!skill || characterSkill.skillLevel === 0) continue
    
    for (const effect of skill.effects) {
      const totalValue = effect.value + (effect.valuePerLevel || 0) * characterSkill.skillLevel
      
      switch (effect.type) {
        case 'stat_bonus':
          if (effect.statType && effect.statType in effects.statBonuses) {
            effects.statBonuses[effect.statType as keyof typeof effects.statBonuses] += totalValue
          }
          break
        case 'cultivation_speed':
          effects.cultivationSpeedBonus += totalValue
          break
        case 'passive_ability':
          effects.passiveAbilities.push(`${skill.name}: ${totalValue}`)
          break
      }
    }
  }
  
  return effects
}
