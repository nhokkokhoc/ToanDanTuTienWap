import { Sect, SectType, SectBonus, CultivationRealm, SkillTree, SectSkill } from '@/types/game'

// Sect Configuration Data
export const SECTS: Record<SectType, Sect> = {
  sword: {
    id: 'sword',
    name: 'Kiếm Tông',
    description: 'Chuyên về kiếm thuật, tấn công cao và tốc độ nhanh. Phù hợp với những ai thích lối chơi tấn công mạnh mẽ.',
    bonuses: {
      attack: 5,
      speed: 3,
      criticalRate: 0.02,
      criticalDamage: 0.1
    },
    skills: [], // Will be implemented later
    color: 'from-blue-500 to-cyan-500'
  },
  lightning: {
    id: 'lightning',
    name: 'Lôi Tông',
    description: 'Sử dụng sức mạnh sấm sét, tốc độ cực nhanh và sát thương ma thuật. Thích hợp cho những ai yêu thích tốc độ.',
    bonuses: {
      attack: 4,
      speed: 5,
      mana: 20,
      spiritualPower: 3,
      accuracy: 0.05
    },
    skills: [],
    color: 'from-yellow-500 to-orange-500'
  },
  medical: {
    id: 'medical',
    name: 'Y Tông',
    description: 'Chuyên về y thuật và hỗ trợ, có khả năng hồi phục mạnh mẽ. Phù hợp với lối chơi bền bỉ và hỗ trợ.',
    bonuses: {
      health: 30,
      mana: 15,
      defense: 3,
      comprehension: 4,
      luck: 2
    },
    skills: [],
    color: 'from-green-500 to-emerald-500'
  },
  defense: {
    id: 'defense',
    name: 'Phòng Thủ Tông',
    description: 'Phòng thủ vững chắc như núi, khó bị đánh bại. Thích hợp cho những ai thích lối chơi an toàn và bền bỉ.',
    bonuses: {
      defense: 6,
      health: 25,
      evasion: 0.03,
      spiritualPower: 2
    },
    skills: [],
    color: 'from-gray-500 to-slate-500'
  }
}

// Cultivation Realms Configuration
export const CULTIVATION_REALMS: Record<CultivationRealm, {
  id: CultivationRealm
  name: string
  description: string
  levelRange: [number, number]
  color: string
}> = {
  qi_refining: {
    id: 'qi_refining',
    name: 'Luyện Khí',
    description: 'Cảnh giới đầu tiên của tu tiên, tập trung vào việc tích lũy và tinh luyện khí trong cơ thể.',
    levelRange: [1, 10],
    color: 'text-blue-400'
  },
  foundation: {
    id: 'foundation',
    name: 'Trúc Cơ',
    description: 'Xây dựng nền tảng vững chắc cho con đường tu tiên, mở rộng kinh mạch.',
    levelRange: [11, 20],
    color: 'text-purple-400'
  },
  golden_core: {
    id: 'golden_core',
    name: 'Kim Đan',
    description: 'Ngưng tụ kim đan trong đan điền, đánh dấu bước tiến quan trọng trong tu luyện.',
    levelRange: [21, 30],
    color: 'text-yellow-400'
  },
  nascent_soul: {
    id: 'nascent_soul',
    name: 'Nguyên Anh',
    description: 'Hình thành nguyên anh, có thể tồn tại độc lập khỏi thể xác.',
    levelRange: [31, 40],
    color: 'text-green-400'
  },
  spirit_severing: {
    id: 'spirit_severing',
    name: 'Hóa Thần',
    description: 'Cắt đứt mọi ràng buộc trần tục, tiến gần đến cảnh giới bất tử.',
    levelRange: [41, 50],
    color: 'text-pink-400'
  },
  void_refinement: {
    id: 'void_refinement',
    name: 'Luyện Hư',
    description: 'Luyện hóa hư vô, hiểu được bản chất của vũ trụ.',
    levelRange: [51, 60],
    color: 'text-indigo-400'
  },
  body_integration: {
    id: 'body_integration',
    name: 'Hợp Thể',
    description: 'Hợp nhất thể xác và nguyên anh, đạt được sự hoàn hảo.',
    levelRange: [61, 70],
    color: 'text-red-400'
  },
  mahayana: {
    id: 'mahayana',
    name: 'Đại Thừa',
    description: 'Đạt được đại thừa, sẵn sàng vượt kiếp thành tiên.',
    levelRange: [71, 80],
    color: 'text-orange-400'
  },
  true_immortal: {
    id: 'true_immortal',
    name: 'Chân Tiên',
    description: 'Vượt qua thiên kiếp, trở thành chân tiên bất tử.',
    levelRange: [81, 100],
    color: 'text-cyan-400'
  }
}

// Base character stats
export const BASE_CHARACTER_STATS = {
  attack: 10,
  defense: 10,
  speed: 10,
  criticalRate: 0.05,
  criticalDamage: 1.5,
  accuracy: 0.9,
  evasion: 0.1,
  spiritualPower: 5,
  comprehension: 5,
  luck: 5
}

// Base character resources
export const BASE_CHARACTER_RESOURCES = {
  level: 1,
  experience: 0,
  health: 100,
  maxHealth: 100,
  mana: 50,
  maxMana: 50,
  gold: 1000,
  spiritStones: 0,
  cultivationPoints: 0,
  cultivationSpeed: 1.0,
  realm: 'qi_refining' as CultivationRealm,
  realmProgress: 0
}

// Character name validation
export const CHARACTER_NAME_RULES = {
  minLength: 2,
  maxLength: 20,
  allowedPattern: /^[a-zA-ZÀ-ỹ0-9\s]+$/,
  forbiddenWords: ['admin', 'mod', 'gm', 'system', 'null', 'undefined']
}

// Helper functions
// Skill Trees for each sect
export const SKILL_TREES: Record<SectType, SkillTree> = {
  sword: {
    sectId: 'sword',
    tiers: [
      {
        tier: 1,
        name: 'Foundation Skills',
        unlockRequirements: { level: 1 },
        skills: [
          {
            id: 'sword_basic',
            name: 'Cơ Bản Kiếm Pháp',
            description: 'Nền tảng của kiếm thuật, tăng sức tấn công cơ bản.',
            type: 'passive',
            tier: 1,
            level: 0,
            maxLevel: 10,
            requirements: { level: 1 },
            effects: [
              {
                type: 'stat_bonus',
                target: 'self',
                value: 5,
                valuePerLevel: 2,
                statType: 'attack'
              }
            ],
            skillPointCost: 1,
            icon: '⚔️'
          },
          {
            id: 'sword_speed',
            name: 'Tốc Kiếm',
            description: 'Tăng tốc độ ra đòn và di chuyển.',
            type: 'passive',
            tier: 1,
            level: 0,
            maxLevel: 10,
            requirements: { level: 1 },
            effects: [
              {
                type: 'stat_bonus',
                target: 'self',
                value: 3,
                valuePerLevel: 1,
                statType: 'speed'
              }
            ],
            skillPointCost: 1,
            icon: '💨'
          },
          {
            id: 'sword_qi',
            name: 'Kiếm Khí Cơ Bản',
            description: 'Tăng tỷ lệ chí mạng khi sử dụng kiếm.',
            type: 'passive',
            tier: 1,
            level: 0,
            maxLevel: 10,
            requirements: { level: 1 },
            effects: [
              {
                type: 'stat_bonus',
                target: 'self',
                value: 0.02,
                valuePerLevel: 0.01,
                statType: 'criticalRate'
              }
            ],
            skillPointCost: 1,
            icon: '✨'
          }
        ]
      },
      {
        tier: 2,
        name: 'Advanced Techniques',
        unlockRequirements: { level: 10, previousTierSkills: 2 },
        skills: [
          {
            id: 'sword_sharp_qi',
            name: 'Kiếm Khí Sắc Bén',
            description: 'Kiếm khí sắc bén hơn, tăng mạnh tỷ lệ chí mạng.',
            type: 'passive',
            tier: 2,
            level: 0,
            maxLevel: 10,
            requirements: { level: 10, prerequisiteSkills: ['sword_basic'] },
            effects: [
              {
                type: 'stat_bonus',
                target: 'self',
                value: 0.08,
                valuePerLevel: 0.02,
                statType: 'criticalRate'
              }
            ],
            skillPointCost: 2,
            icon: '⚡'
          },
          {
            id: 'sword_combo',
            name: 'Liên Hoàn Kiếm',
            description: 'Chuỗi đòn kiếm liên hoàn, tăng sức tấn công.',
            type: 'passive',
            tier: 2,
            level: 0,
            maxLevel: 10,
            requirements: { level: 10, prerequisiteSkills: ['sword_speed'] },
            effects: [
              {
                type: 'stat_bonus',
                target: 'self',
                value: 10,
                valuePerLevel: 3,
                statType: 'attack'
              }
            ],
            skillPointCost: 2,
            icon: '🌪️'
          },
          {
            id: 'sword_defense',
            name: 'Phòng Thủ Kiếm',
            description: 'Sử dụng kiếm để phòng thủ, tăng khả năng phòng thủ.',
            type: 'passive',
            tier: 2,
            level: 0,
            maxLevel: 10,
            requirements: { level: 10 },
            effects: [
              {
                type: 'stat_bonus',
                target: 'self',
                value: 5,
                valuePerLevel: 2,
                statType: 'defense'
              }
            ],
            skillPointCost: 2,
            icon: '🛡️'
          }
        ]
      }
    ]
  },
  lightning: {
    sectId: 'lightning',
    tiers: [
      {
        tier: 1,
        name: 'Lightning Basics',
        unlockRequirements: { level: 1 },
        skills: [
          {
            id: 'lightning_basic',
            name: 'Cơ Bản Lôi Pháp',
            description: 'Nền tảng của lôi thuật, tăng sức tấn công ma thuật.',
            type: 'passive',
            tier: 1,
            level: 0,
            maxLevel: 10,
            requirements: { level: 1 },
            effects: [
              {
                type: 'stat_bonus',
                target: 'self',
                value: 4,
                valuePerLevel: 2,
                statType: 'attack'
              }
            ],
            skillPointCost: 1,
            icon: '⚡'
          },
          {
            id: 'lightning_speed',
            name: 'Lôi Tốc',
            description: 'Tốc độ nhanh như sét đánh, tăng tốc độ đáng kể.',
            type: 'passive',
            tier: 1,
            level: 0,
            maxLevel: 10,
            requirements: { level: 1 },
            effects: [
              {
                type: 'stat_bonus',
                target: 'self',
                value: 6,
                valuePerLevel: 2,
                statType: 'speed'
              }
            ],
            skillPointCost: 1,
            icon: '💨'
          }
        ]
      }
    ]
  },
  medical: {
    sectId: 'medical',
    tiers: [
      {
        tier: 1,
        name: 'Healing Arts',
        unlockRequirements: { level: 1 },
        skills: [
          {
            id: 'medical_basic',
            name: 'Cơ Bản Y Thuật',
            description: 'Nền tảng y thuật, tăng máu tối đa.',
            type: 'passive',
            tier: 1,
            level: 0,
            maxLevel: 10,
            requirements: { level: 1 },
            effects: [
              {
                type: 'stat_bonus',
                target: 'self',
                value: 100,
                valuePerLevel: 50,
                statType: 'spiritualPower' // Will be handled specially for health
              }
            ],
            skillPointCost: 1,
            icon: '💚'
          }
        ]
      }
    ]
  },
  defense: {
    sectId: 'defense',
    tiers: [
      {
        tier: 1,
        name: 'Shield Basics',
        unlockRequirements: { level: 1 },
        skills: [
          {
            id: 'defense_basic',
            name: 'Cơ Bản Khiên Pháp',
            description: 'Nền tảng phòng thủ, tăng khả năng phòng thủ.',
            type: 'passive',
            tier: 1,
            level: 0,
            maxLevel: 10,
            requirements: { level: 1 },
            effects: [
              {
                type: 'stat_bonus',
                target: 'self',
                value: 8,
                valuePerLevel: 3,
                statType: 'defense'
              }
            ],
            skillPointCost: 1,
            icon: '🛡️'
          }
        ]
      }
    ]
  }
}

// Skill Point Sources Configuration
export const SKILL_POINT_SOURCES = {
  level_up: 1,           // +1 per level
  breakthrough: 3,       // +3 per realm breakthrough
  milestone_levels: 2,   // +2 extra at levels 10, 20, 30...
  achievements: 1,       // +1 per achievement (future)
  special_events: 5      // +5 from special events (future)
}

// Skill Point Costs by Tier
export const SKILL_COSTS = {
  tier_1: 1,    // 1 point per level
  tier_2: 2,    // 2 points per level
  tier_3: 3,    // 3 points per level
  tier_4: 5     // 5 points per level
}

export function getSectById(sectId: SectType): Sect {
  return SECTS[sectId]
}

export function getSkillTreeBySect(sectId: SectType): SkillTree {
  return SKILL_TREES[sectId]
}

export function getSkillById(sectId: SectType, skillId: string): SectSkill | undefined {
  const skillTree = SKILL_TREES[sectId]
  for (const tier of skillTree.tiers) {
    const skill = tier.skills.find(s => s.id === skillId)
    if (skill) return skill
  }
  return undefined
}

export function calculateInitialStats(sectId: SectType) {
  const sect = getSectById(sectId)
  const baseStats = { ...BASE_CHARACTER_STATS }
  
  // Apply sect bonuses
  Object.entries(sect.bonuses).forEach(([stat, bonus]) => {
    if (stat in baseStats && typeof bonus === 'number') {
      ;(baseStats as any)[stat] += bonus
    }
  })
  
  return baseStats
}

export function calculateInitialResources(sectId: SectType) {
  const sect = getSectById(sectId)
  const baseResources = { ...BASE_CHARACTER_RESOURCES }
  
  // Apply sect bonuses to resources
  if (sect.bonuses.health) {
    baseResources.health += sect.bonuses.health
    baseResources.maxHealth += sect.bonuses.health
  }
  
  if (sect.bonuses.mana) {
    baseResources.mana += sect.bonuses.mana
    baseResources.maxMana += sect.bonuses.mana
  }
  
  return baseResources
}

export function validateCharacterName(name: string): { valid: boolean; error?: string } {
  const { minLength, maxLength, allowedPattern, forbiddenWords } = CHARACTER_NAME_RULES
  
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Tên nhân vật không được để trống' }
  }
  
  const trimmedName = name.trim()
  
  if (trimmedName.length < minLength) {
    return { valid: false, error: `Tên nhân vật phải có ít nhất ${minLength} ký tự` }
  }
  
  if (trimmedName.length > maxLength) {
    return { valid: false, error: `Tên nhân vật không được quá ${maxLength} ký tự` }
  }
  
  if (!allowedPattern.test(trimmedName)) {
    return { valid: false, error: 'Tên nhân vật chỉ được chứa chữ cái, số và khoảng trắng' }
  }
  
  const lowerName = trimmedName.toLowerCase()
  for (const forbidden of forbiddenWords) {
    if (lowerName.includes(forbidden)) {
      return { valid: false, error: 'Tên nhân vật chứa từ không được phép' }
    }
  }
  
  return { valid: true }
}

export function getRealm(level: number): CultivationRealm {
  for (const [realmId, realmData] of Object.entries(CULTIVATION_REALMS)) {
    const [minLevel, maxLevel] = realmData.levelRange
    if (level >= minLevel && level <= maxLevel) {
      return realmId as CultivationRealm
    }
  }
  return 'qi_refining' // fallback
}
