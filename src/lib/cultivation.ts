import { supabase } from './supabase'
import { experience } from './experience'
import type { CultivationRealm, SectType } from '@/types/game'

// Cultivation constants
export const CULTIVATION_CONFIG = {
  BASE_POINTS_PER_HOUR: 10,
  OFFLINE_EFFICIENCY: 0.5, // 50% efficiency when offline
  MAX_OFFLINE_HOURS: 24,
  POINTS_PER_MINUTE: 10 / 60, // Base points per minute
  SESSION_UPDATE_INTERVAL: 5000, // Update every 5 seconds
}

// Sect cultivation bonuses
export const SECT_CULTIVATION_BONUSES: Record<SectType, number> = {
  sword: 0.05,     // +5% cultivation speed
  lightning: 0.08, // +8% cultivation speed  
  medical: 0.03,   // +3% cultivation speed
  defense: 0.02,   // +2% cultivation speed
}

// Realm requirements and bonuses
export const REALM_DATA: Record<CultivationRealm, {
  name: string
  levelMin: number
  levelMax: number
  cultivationPointsRequired: number
  statMultiplier: number
  cultivationSpeedBonus: number
  newSkillSlots: number
  breakthroughMaterials: Array<{ itemId: string; quantity: number }>
}> = {
  qi_refining: {
    name: 'Luyện Khí',
    levelMin: 1,
    levelMax: 10,
    cultivationPointsRequired: 0,
    statMultiplier: 1.0,
    cultivationSpeedBonus: 0.0,
    newSkillSlots: 0,
    breakthroughMaterials: []
  },
  foundation: {
    name: 'Trúc Cơ',
    levelMin: 11,
    levelMax: 20,
    cultivationPointsRequired: 10000,
    statMultiplier: 1.2,
    cultivationSpeedBonus: 0.1,
    newSkillSlots: 1,
    breakthroughMaterials: [
      { itemId: 'foundation_pill', quantity: 1 },
      { itemId: 'spirit_stone', quantity: 100 }
    ]
  },
  golden_core: {
    name: 'Kim Đan',
    levelMin: 21,
    levelMax: 30,
    cultivationPointsRequired: 50000,
    statMultiplier: 1.5,
    cultivationSpeedBonus: 0.25,
    newSkillSlots: 2,
    breakthroughMaterials: [
      { itemId: 'golden_core_pill', quantity: 1 },
      { itemId: 'spirit_stone', quantity: 500 },
      { itemId: 'rare_herb', quantity: 10 }
    ]
  },
  nascent_soul: {
    name: 'Nguyên Anh',
    levelMin: 31,
    levelMax: 40,
    cultivationPointsRequired: 150000,
    statMultiplier: 2.0,
    cultivationSpeedBonus: 0.5,
    newSkillSlots: 3,
    breakthroughMaterials: [
      { itemId: 'nascent_soul_pill', quantity: 1 },
      { itemId: 'spirit_stone', quantity: 1000 },
      { itemId: 'rare_herb', quantity: 25 },
      { itemId: 'heavenly_essence', quantity: 5 }
    ]
  },
  spirit_severing: {
    name: 'Hóa Thần',
    levelMin: 41,
    levelMax: 50,
    cultivationPointsRequired: 400000,
    statMultiplier: 3.0,
    cultivationSpeedBonus: 1.0,
    newSkillSlots: 4,
    breakthroughMaterials: [
      { itemId: 'spirit_severing_pill', quantity: 1 },
      { itemId: 'spirit_stone', quantity: 2500 },
      { itemId: 'heavenly_essence', quantity: 15 },
      { itemId: 'divine_crystal', quantity: 3 }
    ]
  },
  void_refinement: {
    name: 'Luyện Hư',
    levelMin: 51,
    levelMax: 60,
    cultivationPointsRequired: 1000000,
    statMultiplier: 4.0,
    cultivationSpeedBonus: 1.5,
    newSkillSlots: 5,
    breakthroughMaterials: [
      { itemId: 'void_refinement_pill', quantity: 1 },
      { itemId: 'spirit_stone', quantity: 5000 },
      { itemId: 'divine_crystal', quantity: 10 },
      { itemId: 'void_essence', quantity: 5 }
    ]
  },
  body_integration: {
    name: 'Hợp Thể',
    levelMin: 61,
    levelMax: 70,
    cultivationPointsRequired: 2500000,
    statMultiplier: 6.0,
    cultivationSpeedBonus: 2.0,
    newSkillSlots: 6,
    breakthroughMaterials: [
      { itemId: 'body_integration_pill', quantity: 1 },
      { itemId: 'divine_crystal', quantity: 25 },
      { itemId: 'void_essence', quantity: 15 },
      { itemId: 'immortal_fragment', quantity: 3 }
    ]
  },
  mahayana: {
    name: 'Đại Thừa',
    levelMin: 71,
    levelMax: 80,
    cultivationPointsRequired: 6000000,
    statMultiplier: 10.0,
    cultivationSpeedBonus: 3.0,
    newSkillSlots: 7,
    breakthroughMaterials: [
      { itemId: 'mahayana_pill', quantity: 1 },
      { itemId: 'divine_crystal', quantity: 50 },
      { itemId: 'immortal_fragment', quantity: 10 },
      { itemId: 'heavenly_dao_essence', quantity: 5 }
    ]
  },
  true_immortal: {
    name: 'Chân Tiên',
    levelMin: 81,
    levelMax: 100,
    cultivationPointsRequired: 15000000,
    statMultiplier: 20.0,
    cultivationSpeedBonus: 5.0,
    newSkillSlots: 10,
    breakthroughMaterials: [
      { itemId: 'true_immortal_pill', quantity: 1 },
      { itemId: 'immortal_fragment', quantity: 25 },
      { itemId: 'heavenly_dao_essence', quantity: 15 },
      { itemId: 'primordial_chaos', quantity: 1 }
    ]
  }
}

// Cultivation helper functions
export const cultivation = {
  // Calculate cultivation speed for a character
  calculateCultivationSpeed: async (characterId: string) => {
    try {
      const { data, error } = await supabase.rpc('calculate_cultivation_speed', {
        character_id: characterId
      })
      
      if (error) throw error
      return data || 1.0
    } catch (error) {
      console.error('Error calculating cultivation speed:', error)
      return 1.0
    }
  },

  // Start cultivation session
  startCultivation: async (characterId: string) => {
    try {
      const now = new Date().toISOString()
      
      const { data, error } = await supabase
        .from('characters')
        .update({
          is_cultivating: true,
          cultivation_session_start: now,
          last_cultivation_check: now
        })
        .eq('id', characterId)
        .select()
        .single()
      
      if (error) throw error
      
      // Create cultivation session record
      await supabase
        .from('cultivation_sessions')
        .insert({
          character_id: characterId,
          session_start: now,
          base_speed: CULTIVATION_CONFIG.BASE_POINTS_PER_HOUR,
          final_speed: await cultivation.calculateCultivationSpeed(characterId)
        })
      
      return { data, error: null }
    } catch (error) {
      console.error('Error starting cultivation:', error)
      return { data: null, error }
    }
  },

  // Stop cultivation session
  stopCultivation: async (characterId: string) => {
    try {
      // Calculate final progress and update points
      await cultivation.updateProgress(characterId)

      // Get updated character data
      const { data: character, error: charError } = await supabase
        .from('characters')
        .select('*')
        .eq('id', characterId)
        .single()

      if (charError) throw charError

      // Calculate session stats for logging
      const sessionStart = character.cultivation_session_start ?
        new Date(character.cultivation_session_start) : null
      const sessionDuration = sessionStart ?
        Math.floor((new Date().getTime() - sessionStart.getTime()) / (1000 * 60)) : 0

      const { data, error } = await supabase
        .from('characters')
        .update({
          is_cultivating: false,
          cultivation_session_start: null,
          last_cultivation_check: new Date().toISOString()
        })
        .eq('id', characterId)
        .select()
        .single()

      if (error) throw error

      // Update cultivation session record
      await supabase
        .from('cultivation_sessions')
        .update({
          session_end: new Date().toISOString(),
          duration_minutes: sessionDuration,
          points_gained: Math.floor(sessionDuration * CULTIVATION_CONFIG.POINTS_PER_MINUTE * (character.cultivation_speed || 1.0))
        })
        .eq('character_id', characterId)
        .is('session_end', null)

      return { data, error: null }
    } catch (error) {
      console.error('Error stopping cultivation:', error)
      return { data: null, error }
    }
  },

  // Calculate current cultivation progress
  calculateProgress: async (characterId: string) => {
    try {
      const { data: character, error } = await supabase
        .from('characters')
        .select('*')
        .eq('id', characterId)
        .single()

      if (error) throw error

      const now = new Date()
      const lastCheck = new Date(character.last_cultivation_check)
      const sessionStart = character.cultivation_session_start ?
        new Date(character.cultivation_session_start) : null

      // Calculate time elapsed since last check (for incremental updates)
      const elapsedMinutes = Math.floor((now.getTime() - lastCheck.getTime()) / (1000 * 60))

      // Calculate session duration if actively cultivating
      const sessionDuration = sessionStart ?
        Math.floor((now.getTime() - sessionStart.getTime()) / (1000 * 60)) : 0

      // Get cultivation speed
      const cultivationSpeed = await cultivation.calculateCultivationSpeed(characterId)

      // Calculate points gained since last check (not total session)
      const pointsPerMinute = CULTIVATION_CONFIG.POINTS_PER_MINUTE * cultivationSpeed
      const pointsGainedSinceLastCheck = character.is_cultivating ?
        Math.floor(pointsPerMinute * elapsedMinutes) : 0

      // Calculate total session points (for display only)
      const sessionPoints = sessionStart ?
        Math.floor(pointsPerMinute * sessionDuration) : 0

      const totalPoints = character.current_cultivation_points + pointsGainedSinceLastCheck

      return {
        totalPoints,
        sessionPoints, // Total points gained this session (for display)
        pointsGainedSinceLastCheck, // Points gained since last update (for saving)
        sessionDuration,
        totalTime: character.total_cultivation_time + (character.is_cultivating ? elapsedMinutes : 0),
        cultivationSpeed,
        pointsPerHour: pointsPerMinute * 60,
        elapsedMinutes
      }
    } catch (error) {
      console.error('Error calculating progress:', error)
      return {
        totalPoints: 0,
        sessionPoints: 0,
        pointsGainedSinceLastCheck: 0,
        sessionDuration: 0,
        totalTime: 0,
        cultivationSpeed: 1.0,
        pointsPerHour: CULTIVATION_CONFIG.BASE_POINTS_PER_HOUR,
        elapsedMinutes: 0
      }
    }
  },

  // Calculate offline progress
  calculateOfflineProgress: async (characterId: string) => {
    try {
      const { data, error } = await supabase.rpc('calculate_offline_progress', {
        character_id: characterId
      })
      
      if (error) throw error
      
      return {
        pointsGained: data[0]?.points_gained || 0,
        timeElapsed: data[0]?.time_elapsed || 0
      }
    } catch (error) {
      console.error('Error calculating offline progress:', error)
      return { pointsGained: 0, timeElapsed: 0 }
    }
  },

  // Update cultivation progress (called periodically)
  updateProgress: async (characterId: string) => {
    try {
      const progress = await cultivation.calculateProgress(characterId)

      // Only update if there are points gained since last check
      if (progress.pointsGainedSinceLastCheck > 0 || progress.elapsedMinutes > 0) {
        const { data, error } = await supabase
          .from('characters')
          .update({
            current_cultivation_points: progress.totalPoints,
            total_cultivation_time: progress.totalTime,
            last_cultivation_check: new Date().toISOString()
          })
          .eq('id', characterId)
          .select()
          .single()

        if (error) throw error
        return { data, error: null }
      }

      return { data: null, error: null }
    } catch (error) {
      console.error('Error updating progress:', error)
      return { data: null, error }
    }
  },

  // Get realm for character level
  getRealmForLevel: (level: number): CultivationRealm => {
    for (const [realmId, realmData] of Object.entries(REALM_DATA)) {
      if (level >= realmData.levelMin && level <= realmData.levelMax) {
        return realmId as CultivationRealm
      }
    }
    return 'qi_refining' // fallback
  },

  // Check if character can breakthrough
  canBreakthrough: async (characterId: string) => {
    try {
      const { data: character, error } = await supabase
        .from('characters')
        .select('*')
        .eq('id', characterId)
        .single()
      
      if (error) throw error
      
      const currentRealm = character.realm as CultivationRealm
      const nextRealm = cultivation.getNextRealm(currentRealm)
      
      if (!nextRealm) return { canBreakthrough: false, reason: 'Đã đạt cảnh giới cao nhất' }
      
      const nextRealmData = REALM_DATA[nextRealm]
      
      // Check level requirement
      if (character.level < nextRealmData.levelMin) {
        return { 
          canBreakthrough: false, 
          reason: `Cần đạt level ${nextRealmData.levelMin}` 
        }
      }
      
      // Check cultivation points requirement
      if (character.current_cultivation_points < nextRealmData.cultivationPointsRequired) {
        return { 
          canBreakthrough: false, 
          reason: `Cần ${nextRealmData.cultivationPointsRequired} điểm tu luyện` 
        }
      }
      
      // TODO: Check material requirements
      
      return { canBreakthrough: true, nextRealm, requirements: nextRealmData }
    } catch (error) {
      console.error('Error checking breakthrough:', error)
      return { canBreakthrough: false, reason: 'Lỗi kiểm tra đột phá' }
    }
  },

  // Get next realm
  getNextRealm: (currentRealm: CultivationRealm): CultivationRealm | null => {
    const realms: CultivationRealm[] = [
      'qi_refining', 'foundation', 'golden_core', 'nascent_soul',
      'spirit_severing', 'void_refinement', 'body_integration',
      'mahayana', 'true_immortal'
    ]

    const currentIndex = realms.indexOf(currentRealm)
    return currentIndex < realms.length - 1 ? realms[currentIndex + 1] : null
  },

  // Attempt breakthrough to next realm
  attemptBreakthrough: async (characterId: string) => {
    try {
      // Check eligibility first
      const eligibility = await cultivation.canBreakthrough(characterId)
      if (!eligibility.canBreakthrough) {
        return {
          success: false,
          error: eligibility.reason || 'Không đủ điều kiện đột phá'
        }
      }

      // Get character data
      const { data: character, error: charError } = await supabase
        .from('characters')
        .select('*')
        .eq('id', characterId)
        .single()

      if (charError || !character) {
        return { success: false, error: 'Không thể tải dữ liệu nhân vật' }
      }

      const currentRealm = character.realm as CultivationRealm
      const nextRealm = cultivation.getNextRealm(currentRealm)

      if (!nextRealm) {
        return { success: false, error: 'Đã đạt cảnh giới cao nhất' }
      }

      const nextRealmData = REALM_DATA[nextRealm]

      // Calculate success rate (90% base rate for now)
      const successRate = 0.9
      const isSuccess = Math.random() < successRate

      // Log breakthrough attempt
      await supabase
        .from('breakthrough_history')
        .insert({
          character_id: characterId,
          from_realm: currentRealm,
          to_realm: nextRealm,
          success: isSuccess,
          cultivation_points_required: nextRealmData.cultivationPointsRequired,
          materials_used: {},
          breakthrough_at: new Date().toISOString()
        })

      if (isSuccess) {
        // Successful breakthrough - apply bonuses
        const result = await cultivation.applyBreakthroughBonuses(characterId, currentRealm, nextRealm)

        // Award breakthrough experience
        await experience.awardBreakthroughExp(characterId)

        return {
          success: true,
          newRealm: nextRealm,
          bonuses: result.bonuses,
          message: `Đột phá thành công! Tiến lên ${REALM_DATA[nextRealm].name}!`
        }
      } else {
        // Failed breakthrough - reduce cultivation points
        const pointsLost = Math.floor(character.current_cultivation_points * 0.5)

        await supabase
          .from('characters')
          .update({
            current_cultivation_points: character.current_cultivation_points - pointsLost,
            last_cultivation_check: new Date().toISOString()
          })
          .eq('id', characterId)

        return {
          success: false,
          pointsLost,
          message: `Đột phá thất bại! Mất ${pointsLost.toLocaleString()} điểm tu luyện.`,
          canRetry: true
        }
      }
    } catch (error) {
      console.error('Error attempting breakthrough:', error)
      return { success: false, error: 'Lỗi khi thực hiện đột phá' }
    }
  },

  // Apply breakthrough bonuses
  applyBreakthroughBonuses: async (characterId: string, fromRealm: CultivationRealm, toRealm: CultivationRealm) => {
    try {
      const { data: character, error: charError } = await supabase
        .from('characters')
        .select('*')
        .eq('id', characterId)
        .single()

      if (charError || !character) {
        throw new Error('Cannot load character data')
      }

      const fromRealmData = REALM_DATA[fromRealm]
      const toRealmData = REALM_DATA[toRealm]

      // Calculate new stats with realm bonuses
      const baseStats = {
        attack: Math.floor(character.attack / fromRealmData.statMultiplier),
        defense: Math.floor(character.defense / fromRealmData.statMultiplier),
        speed: Math.floor(character.speed / fromRealmData.statMultiplier),
        max_health: Math.floor(character.max_health / fromRealmData.statMultiplier),
        max_mana: Math.floor(character.max_mana / fromRealmData.statMultiplier)
      }

      const newStats = {
        attack: Math.floor(baseStats.attack * toRealmData.statMultiplier),
        defense: Math.floor(baseStats.defense * toRealmData.statMultiplier),
        speed: Math.floor(baseStats.speed * toRealmData.statMultiplier),
        max_health: Math.floor(baseStats.max_health * toRealmData.statMultiplier),
        max_mana: Math.floor(baseStats.max_mana * toRealmData.statMultiplier)
      }

      // Calculate new cultivation speed
      const sectBonus = SECT_CULTIVATION_BONUSES[character.sect as keyof typeof SECT_CULTIVATION_BONUSES] || 0
      const newCultivationSpeed = (1 + sectBonus + toRealmData.cultivationSpeedBonus)

      // Update character with new realm and stats
      const { data: updatedCharacter, error: updateError } = await supabase
        .from('characters')
        .update({
          realm: toRealm,
          attack: newStats.attack,
          defense: newStats.defense,
          speed: newStats.speed,
          max_health: newStats.max_health,
          max_mana: newStats.max_mana,
          health: newStats.max_health, // Heal to full
          mana: newStats.max_mana, // Restore to full
          cultivation_speed: newCultivationSpeed,
          current_cultivation_points: 0, // Reset cultivation points
          last_cultivation_check: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', characterId)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      const bonuses = {
        statIncrease: {
          attack: newStats.attack - character.attack,
          defense: newStats.defense - character.defense,
          speed: newStats.speed - character.speed,
          max_health: newStats.max_health - character.max_health,
          max_mana: newStats.max_mana - character.max_mana
        },
        cultivationSpeedIncrease: newCultivationSpeed - (character.cultivation_speed || 1.0),
        newSkillSlots: toRealmData.newSkillSlots
      }

      return {
        success: true,
        character: updatedCharacter,
        bonuses
      }
    } catch (error) {
      console.error('Error applying breakthrough bonuses:', error)
      return { success: false, error }
    }
  }
}
