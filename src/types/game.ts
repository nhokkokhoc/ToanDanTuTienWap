// Game Types for Toan Dan Tu Tien

export interface Player {
  id: string
  username: string
  email: string
  avatar?: string
  createdAt: Date
  lastLogin: Date
}

export interface Character {
  id: string
  playerId: string
  name: string
  sect: SectType
  level: number
  experience: number
  experienceToNext: number
  realm: CultivationRealm
  realmProgress: number
  
  // Base Stats
  stats: CharacterStats
  
  // Resources
  health: number
  maxHealth: number
  mana: number
  maxMana: number
  
  // Cultivation
  cultivationPoints: number
  cultivationSpeed: number
  lastCultivationTime: Date
  
  // Currency
  gold: number
  spiritStones: number // Premium currency
  
  // Progress
  totalPlayTime: number
  achievements: string[]
  
  createdAt: Date
  updatedAt: Date
}

export interface CharacterStats {
  attack: number
  defense: number
  speed: number
  criticalRate: number
  criticalDamage: number
  accuracy: number
  evasion: number
  
  // Cultivation specific
  spiritualPower: number
  comprehension: number
  luck: number
}

export type SectType = 'sword' | 'lightning' | 'medical' | 'defense'

// Character Creation Types
export interface CharacterCreationData {
  name: string
  sect: SectType
}

export interface SectBonus extends Partial<CharacterStats> {
  health?: number
  mana?: number
}

export interface Sect {
  id: SectType
  name: string
  description: string
  bonuses: SectBonus
  skills: SectSkill[]
  color: string
}

export interface SectSkill {
  id: string
  name: string
  description: string
  type: 'passive' | 'active' | 'ultimate'
  tier: number // 1-4, higher tier = more powerful
  level: number
  maxLevel: number
  requirements: {
    level?: number
    realm?: CultivationRealm
    prerequisiteSkills?: string[]
  }
  effects: SkillEffect[]
  skillPointCost: number // Cost per level
  icon?: string
}

export interface SkillEffect {
  type: 'stat_bonus' | 'cultivation_speed' | 'passive_ability' | 'damage' | 'heal' | 'buff' | 'debuff'
  target: 'self' | 'enemy' | 'all_enemies' | 'all_allies'
  value: number
  valuePerLevel?: number // Additional value per skill level
  duration?: number // in seconds, for temporary effects
  statType?: keyof CharacterStats // For stat_bonus effects
}

// Skill Tree System Types
export interface SkillTree {
  sectId: SectType
  tiers: SkillTier[]
}

export interface SkillTier {
  tier: number
  name: string
  skills: SectSkill[]
  unlockRequirements: {
    level?: number
    realm?: CultivationRealm
    previousTierSkills?: number // Number of skills from previous tier required
  }
}

// Character Skill Progress
export interface CharacterSkill {
  id: string
  characterId: string
  skillId: string
  skillLevel: number
  allocatedPoints: number
  unlockedAt: Date
  isActive: boolean
  currentEffects: SkillEffect[]
}

// Skill Points System
export interface SkillPointsInfo {
  available: number
  totalEarned: number
  sources: {
    levelUp: number
    breakthrough: number
    milestones: number
    achievements: number
    events: number
  }
}

export type CultivationRealm = 
  | 'qi_refining'      // Luyện Khí
  | 'foundation'       // Trúc Cơ  
  | 'golden_core'      // Kim Đan
  | 'nascent_soul'     // Nguyên Anh
  | 'spirit_severing'  // Hóa Thần
  | 'void_refinement'  // Luyện Hư
  | 'body_integration' // Hợp Thể
  | 'mahayana'         // Đại Thừa
  | 'true_immortal'    // Chân Tiên

export interface CultivationRealmInfo {
  id: CultivationRealm
  name: string
  description: string
  levelRange: [number, number]
  breakthroughRequirements: {
    level: number
    cultivationPoints: number
    items?: string[]
    questsCompleted?: string[]
  }
  bonuses: {
    statsMultiplier: number
    newSkillSlots: number
    specialAbilities?: string[]
  }
}

export interface Item {
  id: string
  name: string
  description: string
  type: ItemType
  rarity: ItemRarity
  level: number
  stats?: Partial<CharacterStats>
  effects?: ItemEffect[]
  stackable: boolean
  maxStack?: number
  sellPrice: number
  requirements?: {
    level?: number
    realm?: CultivationRealm
    sect?: SectType
  }
}

export type ItemType = 
  | 'weapon' 
  | 'armor' 
  | 'accessory' 
  | 'consumable' 
  | 'material' 
  | 'pill' 
  | 'technique_scroll'
  | 'treasure'

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythical'

export interface ItemEffect {
  type: 'heal' | 'mana_restore' | 'stat_boost' | 'experience_boost' | 'cultivation_boost'
  value: number
  duration?: number
}

export interface Inventory {
  characterId: string
  items: InventoryItem[]
  maxSlots: number
  gold: number
}

export interface InventoryItem {
  itemId: string
  quantity: number
  enhancement?: number // +1, +2, etc.
  gems?: string[] // socketed gems
}

export interface Monster {
  id: string
  name: string
  level: number
  realm: CultivationRealm
  stats: CharacterStats
  health: number
  maxHealth: number
  skills: string[]
  lootTable: LootDrop[]
  experience: number
  goldReward: number
}

export interface LootDrop {
  itemId: string
  dropRate: number // 0-1
  minQuantity: number
  maxQuantity: number
}

export interface Battle {
  id: string
  type: 'pve' | 'pvp' | 'dungeon' | 'boss'
  participants: BattleParticipant[]
  status: 'pending' | 'active' | 'completed'
  result?: BattleResult
  startTime: Date
  endTime?: Date
}

export interface BattleParticipant {
  type: 'character' | 'monster'
  id: string
  name: string
  stats: CharacterStats
  health: number
  maxHealth: number
  mana: number
  maxMana: number
  skills: string[]
}

export interface BattleResult {
  winner: 'player' | 'enemy' | 'draw'
  rewards: {
    experience: number
    gold: number
    items: InventoryItem[]
  }
  battleLog: BattleAction[]
}

export interface BattleAction {
  turn: number
  actor: string
  action: 'attack' | 'skill' | 'defend' | 'item'
  target: string
  damage?: number
  healing?: number
  effects?: string[]
  message: string
}

export interface Dungeon {
  id: string
  name: string
  description: string
  requiredLevel: number
  requiredRealm: CultivationRealm
  floors: DungeonFloor[]
  rewards: DungeonReward[]
  cooldown: number // in minutes
}

export interface DungeonFloor {
  floor: number
  monsters: string[]
  boss?: string
  treasureChests: number
  specialEvents?: string[]
}

export interface DungeonReward {
  type: 'completion' | 'first_time' | 'perfect_clear'
  items: InventoryItem[]
  experience: number
  gold: number
}

export interface Guild {
  id: string
  name: string
  description: string
  leaderId: string
  members: GuildMember[]
  level: number
  experience: number
  maxMembers: number
  createdAt: Date
}

export interface GuildMember {
  characterId: string
  role: 'leader' | 'elder' | 'member'
  joinedAt: Date
  contribution: number
}

export interface Quest {
  id: string
  name: string
  description: string
  type: 'main' | 'side' | 'daily' | 'weekly' | 'guild'
  requirements: QuestRequirement[]
  rewards: QuestReward[]
  status: 'available' | 'active' | 'completed' | 'failed'
  timeLimit?: number // in hours
}

export interface QuestRequirement {
  type: 'kill_monsters' | 'reach_level' | 'collect_items' | 'visit_location' | 'craft_items'
  target: string
  quantity: number
  currentProgress: number
}

export interface QuestReward {
  type: 'experience' | 'gold' | 'items' | 'cultivation_points'
  value: number
  itemId?: string
  quantity?: number
}

// Game Events
export interface GameEvent {
  id: string
  name: string
  description: string
  type: 'cultivation_boost' | 'double_exp' | 'rare_drops' | 'pvp_tournament'
  startTime: Date
  endTime: Date
  bonuses: EventBonus[]
  requirements?: {
    minLevel?: number
    minRealm?: CultivationRealm
  }
}

export interface EventBonus {
  type: 'experience_multiplier' | 'cultivation_speed' | 'drop_rate' | 'gold_multiplier'
  multiplier: number
}

// Game Configuration
export interface GameConfig {
  cultivation: {
    baseSpeed: number
    realmMultipliers: Record<CultivationRealm, number>
    offlineEfficiency: number
  }
  combat: {
    baseDamageFormula: string
    criticalMultiplier: number
    speedTurnOrder: boolean
  }
  economy: {
    goldInflationRate: number
    spiritStoneExchangeRate: number
    marketTaxRate: number
  }
}
