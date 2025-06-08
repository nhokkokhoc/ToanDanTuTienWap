# 🧘 PHASE 1.3: HỆ THỐNG TU LUYỆN CỐT LÕI

## 🎯 TỔNG QUAN PHASE 1.3

Phase 1.3 tập trung vào việc xây dựng hệ thống tu luyện - trái tim của game tu tiên. Đây là tính năng cốt lõi tạo nên sự khác biệt và hấp dẫn của game.

### 🎮 MỤC TIÊU CHÍNH
- **Idle Cultivation:** Hệ thống tu luyện tự động
- **Breakthrough System:** Đột phá cảnh giới
- **Skill Tree:** Cây kỹ năng theo tông phái
- **Experience System:** Hệ thống kinh nghiệm và level

### ⏰ THỜI GIAN DỰ KIẾN
**2-3 tuần** (Tuần 5-6 của Phase 1)

---

## 🧘 1. CƠ CHẾ TU LUYỆN IDLE

### 🎯 Mục Tiêu
Tạo hệ thống tu luyện tự động cho phép người chơi tích lũy tu vi ngay cả khi offline.

### 📋 Nhiệm Vụ Chi Tiết

#### 1.1 Hệ Thống Đếm Thời Gian Tu Luyện
- [ ] **CultivationTimer Component**
  - Real-time countdown timer
  - Visual progress bar
  - Start/pause/stop controls
  - Sound notifications (optional)

- [ ] **Database Schema**
  ```sql
  ALTER TABLE characters ADD COLUMN cultivation_session_start TIMESTAMP;
  ALTER TABLE characters ADD COLUMN cultivation_session_duration INTEGER DEFAULT 0;
  ALTER TABLE characters ADD COLUMN is_cultivating BOOLEAN DEFAULT FALSE;
  ```

#### 1.2 Tính Toán Tiến Độ Offline
- [ ] **Offline Progress Calculator**
  - Calculate time elapsed since last login
  - Apply cultivation efficiency (50-80% of online rate)
  - Maximum offline hours (24h default)
  - Bonus for continuous cultivation

- [ ] **Progress Notification**
  - Show offline gains on login
  - Breakdown of cultivation points earned
  - Time spent cultivating
  - Efficiency percentage

#### 1.3 Bộ Điều Chỉnh Tốc Độ Tu Luyện
- [ ] **Speed Modifiers**
  - Base cultivation speed: 1.0x
  - Sect bonuses: +10-20%
  - Equipment bonuses: +5-50%
  - Pill effects: +25-100% (temporary)
  - VIP bonuses: +20-50%

- [ ] **Dynamic Speed Calculation**
  ```typescript
  const calculateCultivationSpeed = (character) => {
    let speed = character.baseCultivationSpeed
    speed *= getSectBonus(character.sect)
    speed *= getEquipmentBonus(character.equipment)
    speed *= getActiveEffects(character.effects)
    return speed
  }
  ```

#### 1.4 Hiển Thị Trực Quan Tiến Độ
- [ ] **Cultivation Dashboard**
  - Current cultivation points
  - Points per hour rate
  - Time to next breakthrough
  - Visual meditation animation

- [ ] **Progress Visualization**
  - Circular progress bar for current realm
  - Particle effects during cultivation
  - Realm progression timeline
  - Statistics charts

---

## 🚀 2. HỆ THỐNG ĐỘT PHÁ

### 🎯 Mục Tiêu
Tạo hệ thống đột phá cảnh giới với yêu cầu và phần thưởng rõ ràng.

### 📋 Nhiệm Vụ Chi Tiết

#### 2.1 Logic Tiến Triển Cảnh Giới
- [ ] **Realm Progression System**
  ```typescript
  const REALM_REQUIREMENTS = {
    qi_refining: { level: 1, cultivationPoints: 0 },
    foundation: { level: 10, cultivationPoints: 10000 },
    golden_core: { level: 20, cultivationPoints: 50000 },
    nascent_soul: { level: 30, cultivationPoints: 150000 },
    // ... more realms
  }
  ```

- [ ] **Breakthrough Eligibility Check**
  - Level requirements met
  - Cultivation points sufficient
  - Required items available
  - No active cooldowns

#### 2.2 Yêu Cầu Đột Phá
- [ ] **Multi-tier Requirements**
  - **Level:** Minimum character level
  - **Cultivation Points:** Accumulated through meditation
  - **Items:** Special breakthrough pills/materials
  - **Quests:** Realm-specific challenges (future)

- [ ] **Breakthrough Materials**
  ```typescript
  const BREAKTHROUGH_MATERIALS = {
    foundation: [
      { itemId: 'foundation_pill', quantity: 1 },
      { itemId: 'spirit_stone', quantity: 100 }
    ],
    golden_core: [
      { itemId: 'golden_core_pill', quantity: 1 },
      { itemId: 'spirit_stone', quantity: 500 },
      { itemId: 'rare_herb', quantity: 10 }
    ]
  }
  ```

#### 2.3 Animation Đột Phá
- [ ] **Breakthrough Sequence**
  - Preparation phase (3 seconds)
  - Breakthrough attempt animation (5 seconds)
  - Success/failure result (2 seconds)
  - Celebration effects for success

- [ ] **Visual Effects**
  - Screen flash on breakthrough
  - Particle explosion effects
  - Character aura upgrade
  - Realm badge unlock animation

#### 2.4 Áp Dụng Bonus Chỉ Số
- [ ] **Stat Bonuses per Realm**
  ```typescript
  const REALM_BONUSES = {
    foundation: { 
      allStats: 1.2, // 20% increase
      cultivationSpeed: 1.1,
      newSkillSlots: 1
    },
    golden_core: {
      allStats: 1.5, // 50% increase
      cultivationSpeed: 1.25,
      newSkillSlots: 2
    }
  }
  ```

- [ ] **Automatic Stat Application**
  - Recalculate all character stats
  - Update max HP/MP
  - Unlock new skill slots
  - Apply cultivation speed bonus

---

## 🌳 3. TRIỂN KHAI SKILL TREE

### 🎯 Mục Tiêu
Tạo hệ thống skill tree riêng biệt cho từng tông phái với progression rõ ràng.

### 📋 Nhiệm Vụ Chi Tiết

#### 3.1 Skill Tree Riêng Cho Từng Tông Phái
- [ ] **Kiếm Tông Skills**
  ```typescript
  const SWORD_SECT_SKILLS = {
    tier1: [
      { id: 'basic_sword', name: 'Cơ Bản Kiếm Pháp', effect: '+10% ATK' },
      { id: 'swift_strike', name: 'Tốc Kiếm', effect: '+5% SPD' }
    ],
    tier2: [
      { id: 'sword_mastery', name: 'Tinh Thông Kiếm Thuật', effect: '+15% CRIT' },
      { id: 'wind_blade', name: 'Phong Nhận', effect: 'AOE attack' }
    ]
  }
  ```

- [ ] **Lôi Tông Skills**
  - Lightning-based abilities
  - Speed and magical damage focus
  - Chain lightning effects

- [ ] **Y Tông Skills**
  - Healing and support abilities
  - HP regeneration bonuses
  - Defensive buffs

- [ ] **Phòng Thủ Tông Skills**
  - Tank and defensive abilities
  - Damage reduction skills
  - Taunt and protection abilities

#### 3.2 Điều Kiện Mở Khóa Skill
- [ ] **Unlock Requirements**
  ```typescript
  interface SkillRequirement {
    level?: number
    realm?: CultivationRealm
    prerequisiteSkills?: string[]
    cultivationPoints?: number
  }
  ```

- [ ] **Progressive Unlocking**
  - Tier 1: Available from start
  - Tier 2: Requires Foundation realm
  - Tier 3: Requires Golden Core realm
  - Ultimate: Requires Nascent Soul realm

#### 3.3 Phân Bổ Điểm Skill
- [ ] **Skill Point System**
  - Gain 1 skill point per level
  - Bonus points from breakthroughs
  - Respec option (with cost)

- [ ] **Skill Point Allocation UI**
  - Interactive skill tree visualization
  - Drag-and-drop point allocation
  - Preview of skill effects
  - Confirmation before applying

#### 3.4 Hệ Thống Hiệu Ứng Skill
- [ ] **Skill Effect Types**
  ```typescript
  type SkillEffectType = 
    | 'stat_bonus'     // +10% ATK
    | 'passive_ability' // Auto-heal
    | 'active_skill'   // Castable ability
    | 'cultivation_bonus' // +20% cultivation speed
  ```

- [ ] **Effect Application**
  - Passive effects: Always active
  - Active skills: Cooldown-based
  - Cultivation bonuses: Applied to meditation
  - Combat skills: Used in battles

---

## 📈 4. HỆ THỐNG KINH NGHIỆM & LEVEL

### 🎯 Mục Tiêu
Tạo hệ thống progression rõ ràng với multiple sources of experience.

### 📋 Nhiệm Vụ Chi Tiết

#### 4.1 Công Thức Tính Toán EXP
- [ ] **EXP Sources**
  ```typescript
  const EXP_SOURCES = {
    cultivation: 10, // per hour
    combat: 50, // per monster killed
    quests: 100, // per quest completed
    breakthrough: 1000, // per realm advancement
    daily_login: 25 // per day
  }
  ```

- [ ] **Level Requirements**
  ```typescript
  const calculateExpToNextLevel = (level: number) => {
    return Math.floor(100 * Math.pow(1.15, level - 1))
  }
  ```

#### 4.2 Phần Thưởng Tiến Triển Level
- [ ] **Level Up Rewards**
  - +1 Skill Point
  - +5 All Base Stats
  - +100 Max HP
  - +50 Max MP
  - Gold bonus

- [ ] **Milestone Rewards**
  - Level 10: Unlock breakthrough
  - Level 20: Unlock advanced skills
  - Level 30: Unlock special abilities
  - Every 10 levels: Bonus rewards

#### 4.3 Phân Phối Điểm Chỉ Số
- [ ] **Automatic Stat Distribution**
  - Sect-based auto allocation
  - Balanced growth for all stats
  - Bonus points for manual allocation

- [ ] **Manual Stat Points (Optional)**
  - Allow players to customize builds
  - Respec option available
  - Stat point preview system

#### 4.4 Giới Hạn Level Theo Cảnh Giới
- [ ] **Level Caps per Realm**
  ```typescript
  const LEVEL_CAPS = {
    qi_refining: 10,
    foundation: 20,
    golden_core: 30,
    nascent_soul: 40,
    spirit_severing: 50
  }
  ```

- [ ] **Breakthrough Required**
  - Cannot gain EXP beyond level cap
  - Must breakthrough to continue
  - Visual indication of cap reached

---

## 🎨 UI/UX DESIGN

### 📱 Cultivation Dashboard
- **Main Screen:** Meditation interface
- **Progress Bars:** Current realm progress
- **Timer:** Active cultivation session
- **Stats:** Real-time cultivation rate

### 🌟 Breakthrough Interface
- **Requirements Check:** Visual checklist
- **Materials:** Required items display
- **Confirmation:** Breakthrough attempt button
- **Animation:** Success/failure sequence

### 🌳 Skill Tree UI
- **Tree Visualization:** Interactive node graph
- **Skill Details:** Hover tooltips
- **Point Allocation:** Drag-and-drop interface
- **Preview:** Effect calculations

### 📊 Progress Tracking
- **Level Progress:** EXP bar
- **Realm Progress:** Cultivation points
- **Skill Progress:** Allocated points
- **Statistics:** Detailed breakdowns

---

## 🔧 TECHNICAL IMPLEMENTATION

### 📊 Database Schema Updates
```sql
-- Cultivation tracking
ALTER TABLE characters ADD COLUMN current_cultivation_points BIGINT DEFAULT 0;
ALTER TABLE characters ADD COLUMN total_cultivation_time INTEGER DEFAULT 0;
ALTER TABLE characters ADD COLUMN last_cultivation_check TIMESTAMP DEFAULT NOW();

-- Skill system
CREATE TABLE character_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID REFERENCES characters(id),
  skill_id TEXT NOT NULL,
  level INTEGER DEFAULT 1,
  allocated_points INTEGER DEFAULT 0,
  unlocked_at TIMESTAMP DEFAULT NOW()
);

-- Experience tracking
ALTER TABLE characters ADD COLUMN total_experience BIGINT DEFAULT 0;
ALTER TABLE characters ADD COLUMN experience_sources JSONB DEFAULT '{}';
```

### ⚡ Performance Considerations
- **Efficient Calculations:** Batch updates every 5 seconds
- **Caching:** Cache skill effects and bonuses
- **Offline Sync:** Minimize database calls
- **Real-time Updates:** WebSocket for live progress

### 🔄 State Management
```typescript
interface CultivationState {
  isActive: boolean
  sessionStart: Date
  currentPoints: number
  pointsPerHour: number
  nextBreakthroughAt: number
}

interface SkillState {
  allocatedPoints: Record<string, number>
  unlockedSkills: string[]
  availablePoints: number
  activeEffects: SkillEffect[]
}
```

---

## 🧪 TESTING PLAN

### 🔍 Unit Tests
- [ ] Cultivation point calculations
- [ ] Breakthrough eligibility checks
- [ ] Skill effect applications
- [ ] EXP calculation formulas

### 🎮 Integration Tests
- [ ] Full cultivation session flow
- [ ] Breakthrough sequence
- [ ] Skill tree interactions
- [ ] Level progression

### 📱 User Experience Tests
- [ ] Mobile cultivation interface
- [ ] Offline progress accuracy
- [ ] Skill tree usability
- [ ] Performance on low-end devices

### ⏱️ Performance Tests
- [ ] Cultivation timer accuracy
- [ ] Database query optimization
- [ ] Memory usage during long sessions
- [ ] Battery impact on mobile

---

## 🎯 SUCCESS CRITERIA

### ✅ Phase 1.3 Complete When:
- [ ] **Cultivation System:** Fully functional idle cultivation
- [ ] **Breakthrough System:** Working realm progression
- [ ] **Skill Trees:** All 4 sects have complete trees
- [ ] **Level System:** EXP and level progression working
- [ ] **UI/UX:** Polished and intuitive interfaces
- [ ] **Performance:** Smooth on mobile devices
- [ ] **Testing:** All tests passing
- [ ] **Documentation:** Complete user guides

### 📊 Key Metrics:
- **Cultivation Engagement:** >80% of users start cultivation
- **Breakthrough Success:** >90% of eligible users breakthrough
- **Skill Allocation:** >70% of users allocate skill points
- **Session Length:** Average +5 minutes due to cultivation
- **Performance:** <100ms response time for all actions

---

## 🚀 NEXT STEPS AFTER PHASE 1.3

### 🔄 Immediate Follow-up:
1. **Combat Integration:** Use cultivation stats in battles
2. **Item System:** Cultivation-boosting items
3. **Social Features:** Compare cultivation progress
4. **Events:** Cultivation speed boost events

### 📈 Future Enhancements:
- **Advanced Realms:** Higher cultivation levels
- **Dual Cultivation:** Partner cultivation bonuses
- **Sect Wars:** Cultivation-based competitions
- **Immortal Ascension:** End-game cultivation goals

---

**Phase 1.3 - Bringing the heart of cultivation to life! 🧘✨**
