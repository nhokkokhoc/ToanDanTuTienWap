import { supabase } from './supabase'
import { REALM_DATA } from './cultivation'
import type { CultivationRealm } from '@/types/game'

// Experience constants
export const EXPERIENCE_CONFIG = {
  BASE_EXP_TO_LEVEL: 100,
  EXP_GROWTH_RATE: 1.15,
  MAX_LEVEL_PER_REALM: {
    qi_refining: 10,
    foundation: 20,
    golden_core: 30,
    nascent_soul: 40,
    spirit_severing: 50,
    void_refinement: 60,
    body_integration: 70,
    mahayana: 80,
    true_immortal: 100
  }
}

// Experience sources and amounts
export const EXP_SOURCES = {
  cultivation: 10, // per hour of cultivation
  breakthrough: 1000, // per successful breakthrough
  daily_login: 25, // per day
  quest_completion: 100, // per quest (future)
  combat_victory: 50, // per monster killed (future)
  skill_unlock: 200, // per skill unlocked (future)
  achievement: 500 // per achievement (future)
}

// Level up rewards
export const LEVEL_UP_REWARDS = {
  base_stats_increase: 5, // +5 to all base stats
  health_increase: 100, // +100 max health
  mana_increase: 50, // +50 max mana
  skill_points: 1, // +1 skill point
  gold_bonus: 100 // +100 gold
}

// Milestone rewards (every 10 levels)
export const MILESTONE_REWARDS = {
  10: { gold: 1000, spirit_stones: 10, special_item: 'foundation_pill' },
  20: { gold: 2500, spirit_stones: 25, special_item: 'golden_core_pill' },
  30: { gold: 5000, spirit_stones: 50, special_item: 'nascent_soul_pill' },
  40: { gold: 10000, spirit_stones: 100, special_item: 'spirit_severing_pill' },
  50: { gold: 20000, spirit_stones: 200, special_item: 'void_refinement_pill' }
}

export const experience = {
  // Calculate EXP required for next level
  calculateExpToNextLevel: (level: number): number => {
    return Math.floor(EXPERIENCE_CONFIG.BASE_EXP_TO_LEVEL * Math.pow(EXPERIENCE_CONFIG.EXP_GROWTH_RATE, level - 1))
  },

  // Calculate total EXP required to reach a level
  calculateTotalExpToLevel: (targetLevel: number): number => {
    let totalExp = 0
    for (let i = 1; i < targetLevel; i++) {
      totalExp += experience.calculateExpToNextLevel(i)
    }
    return totalExp
  },

  // Check if character can gain more EXP (level cap check)
  canGainExp: async (characterId: string): Promise<boolean> => {
    try {
      const { data: character, error } = await supabase
        .from('characters')
        .select('level, realm')
        .eq('id', characterId)
        .single()

      if (error || !character) return false

      const realm = character.realm as CultivationRealm
      const maxLevel = EXPERIENCE_CONFIG.MAX_LEVEL_PER_REALM[realm]
      
      return character.level < maxLevel
    } catch (error) {
      console.error('Error checking exp gain eligibility:', error)
      return false
    }
  },

  // Award experience to character
  awardExperience: async (characterId: string, amount: number, source: string) => {
    try {
      // Check if character can gain EXP
      const canGain = await experience.canGainExp(characterId)
      if (!canGain) {
        return { 
          success: false, 
          reason: 'Đã đạt level tối đa cho cảnh giới hiện tại. Hãy đột phá để tiếp tục!' 
        }
      }

      // Get current character data
      const { data: character, error: charError } = await supabase
        .from('characters')
        .select('*')
        .eq('id', characterId)
        .single()

      if (charError || !character) {
        return { success: false, error: 'Không thể tải dữ liệu nhân vật' }
      }

      const currentExp = character.total_experience || 0
      const currentLevel = character.level
      const newTotalExp = currentExp + amount

      // Calculate new level
      let newLevel = currentLevel
      let expForCurrentLevel = experience.calculateTotalExpToLevel(currentLevel)
      
      while (newTotalExp >= expForCurrentLevel + experience.calculateExpToNextLevel(newLevel)) {
        newLevel++
        expForCurrentLevel = experience.calculateTotalExpToLevel(newLevel)
        
        // Check level cap
        const realm = character.realm as CultivationRealm
        const maxLevel = EXPERIENCE_CONFIG.MAX_LEVEL_PER_REALM[realm]
        if (newLevel >= maxLevel) {
          newLevel = maxLevel
          break
        }
      }

      const levelsGained = newLevel - currentLevel
      const expToNextLevel = experience.calculateExpToNextLevel(newLevel)
      const currentLevelExp = newTotalExp - experience.calculateTotalExpToLevel(newLevel)

      // Calculate level up rewards
      let totalRewards = {
        stats_increase: 0,
        health_increase: 0,
        mana_increase: 0,
        skill_points: 0,
        gold_bonus: 0,
        milestone_rewards: [] as any[]
      }

      if (levelsGained > 0) {
        totalRewards.stats_increase = levelsGained * LEVEL_UP_REWARDS.base_stats_increase
        totalRewards.health_increase = levelsGained * LEVEL_UP_REWARDS.health_increase
        totalRewards.mana_increase = levelsGained * LEVEL_UP_REWARDS.mana_increase
        totalRewards.skill_points = levelsGained * LEVEL_UP_REWARDS.skill_points
        totalRewards.gold_bonus = levelsGained * LEVEL_UP_REWARDS.gold_bonus

        // Check for milestone rewards
        for (let level = currentLevel + 1; level <= newLevel; level++) {
          if (MILESTONE_REWARDS[level as keyof typeof MILESTONE_REWARDS]) {
            totalRewards.milestone_rewards.push({
              level,
              rewards: MILESTONE_REWARDS[level as keyof typeof MILESTONE_REWARDS]
            })
          }
        }
      }

      // Apply stat increases
      const newStats = {
        attack: character.attack + totalRewards.stats_increase,
        defense: character.defense + totalRewards.stats_increase,
        speed: character.speed + totalRewards.stats_increase,
        max_health: character.max_health + totalRewards.health_increase,
        max_mana: character.max_mana + totalRewards.mana_increase,
        gold: character.gold + totalRewards.gold_bonus
      }

      // Add milestone rewards
      let spiritStonesBonus = 0
      totalRewards.milestone_rewards.forEach(milestone => {
        newStats.gold += milestone.rewards.gold || 0
        spiritStonesBonus += milestone.rewards.spirit_stones || 0
      })

      // Update experience sources tracking
      const expSources = character.experience_sources || {}
      expSources[source] = (expSources[source] || 0) + amount

      // Update character in database
      const { data: updatedCharacter, error: updateError } = await supabase
        .from('characters')
        .update({
          level: newLevel,
          total_experience: newTotalExp,
          experience_to_next_level: expToNextLevel - currentLevelExp,
          experience_sources: expSources,
          attack: newStats.attack,
          defense: newStats.defense,
          speed: newStats.speed,
          max_health: newStats.max_health,
          max_mana: newStats.max_mana,
          gold: newStats.gold,
          spirit_stones: character.spirit_stones + spiritStonesBonus,
          updated_at: new Date().toISOString()
        })
        .eq('id', characterId)
        .select()
        .single()

      if (updateError) {
        return { success: false, error: updateError.message }
      }

      return {
        success: true,
        character: updatedCharacter,
        expGained: amount,
        levelsGained,
        totalRewards,
        newLevel,
        source
      }
    } catch (error) {
      console.error('Error awarding experience:', error)
      return { success: false, error: 'Lỗi khi trao kinh nghiệm' }
    }
  },

  // Award cultivation experience (called periodically)
  awardCultivationExp: async (characterId: string, hoursSpent: number) => {
    const expAmount = Math.floor(hoursSpent * EXP_SOURCES.cultivation)
    return experience.awardExperience(characterId, expAmount, 'cultivation')
  },

  // Award breakthrough experience
  awardBreakthroughExp: async (characterId: string) => {
    return experience.awardExperience(characterId, EXP_SOURCES.breakthrough, 'breakthrough')
  },

  // Award daily login experience
  awardDailyLoginExp: async (characterId: string) => {
    return experience.awardExperience(characterId, EXP_SOURCES.daily_login, 'daily_login')
  },

  // Get character level progress
  getLevelProgress: async (characterId: string) => {
    try {
      const { data: character, error } = await supabase
        .from('characters')
        .select('level, total_experience, experience_to_next_level, realm')
        .eq('id', characterId)
        .single()

      if (error || !character) {
        return { error: 'Không thể tải dữ liệu nhân vật' }
      }

      const currentLevelExp = character.total_experience - experience.calculateTotalExpToLevel(character.level)
      const expToNextLevel = experience.calculateExpToNextLevel(character.level)
      const progressPercent = (currentLevelExp / expToNextLevel) * 100

      const realm = character.realm as CultivationRealm
      const maxLevel = EXPERIENCE_CONFIG.MAX_LEVEL_PER_REALM[realm]
      const isMaxLevel = character.level >= maxLevel

      return {
        success: true,
        level: character.level,
        currentLevelExp,
        expToNextLevel,
        progressPercent,
        totalExp: character.total_experience,
        maxLevel,
        isMaxLevel,
        canBreakthrough: isMaxLevel
      }
    } catch (error) {
      console.error('Error getting level progress:', error)
      return { error: 'Lỗi khi tải tiến độ level' }
    }
  },

  // Get experience statistics
  getExpStatistics: async (characterId: string) => {
    try {
      const { data: character, error } = await supabase
        .from('characters')
        .select('experience_sources, total_experience, level')
        .eq('id', characterId)
        .single()

      if (error || !character) {
        return { error: 'Không thể tải dữ liệu nhân vật' }
      }

      const expSources = character.experience_sources || {}
      const totalExp = character.total_experience || 0

      return {
        success: true,
        totalExp,
        level: character.level,
        sources: expSources,
        breakdown: Object.entries(expSources).map(([source, amount]) => ({
          source,
          amount: amount as number,
          percentage: ((amount as number) / totalExp) * 100
        }))
      }
    } catch (error) {
      console.error('Error getting exp statistics:', error)
      return { error: 'Lỗi khi tải thống kê kinh nghiệm' }
    }
  }
}
