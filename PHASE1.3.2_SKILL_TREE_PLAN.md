# 🌳 PHASE 1.3.2: SKILL TREE SYSTEM

## 🎯 TỔNG QUAN

Phase 1.3.2 tập trung vào việc implement hệ thống skill tree - cho phép người chơi phát triển kỹ năng đặc trưng theo tông phái và cá nhân hóa character build.

### 🎮 MỤC TIÊU CHÍNH
- **Sect-specific Skill Trees:** Mỗi tông phái có skill tree riêng
- **Skill Point System:** Tích lũy và phân bổ skill points
- **Skill Effects:** Passive và active skills với effects
- **Skill Progression:** Upgrade skills qua các levels

### ⏰ THỜI GIAN DỰ KIẾN
**4-5 ngày** (Tuần 6-7)

---

## 🌳 1. SKILL TREE DESIGN

### 🎯 Mục Tiêu
Thiết kế skill trees độc đáo cho từng tông phái với progression paths khác nhau.

### 📋 Skill Tree Structure

#### 1.1 Kiếm Tông (Sword Sect)
```
Tier 1: Foundation Skills
├── Cơ Bản Kiếm Pháp (+5% ATK)
├── Tốc Kiếm (+3% SPD)
└── Kiếm Khí Cơ Bản (+2% CRIT)

Tier 2: Advanced Techniques  
├── Kiếm Khí Sắc Bén (+8% CRIT, requires Cơ Bản Kiếm Pháp)
├── Liên Hoàn Kiếm (+10% ATK, requires Tốc Kiếm)
└── Phòng Thủ Kiếm (+5% DEF, requires any Tier 1)

Tier 3: Master Skills
├── Thiên Kiếm Thuật (+15% ATK, +5% CRIT)
├── Kiếm Ý Thông Thiên (+20% cultivation speed)
└── Vạn Kiếm Quy Tông (Ultimate skill)

Tier 4: Legendary
└── Kiếm Thánh Truyền Thừa (Sect master skill)
```

#### 1.2 Lôi Tông (Lightning Sect)
```
Tier 1: Lightning Basics
├── Cơ Bản Lôi Pháp (+4% ATK)
├── Lôi Tốc (+6% SPD)
└── Tĩnh Điện (+3% mana regen)

Tier 2: Storm Control
├── Sấm Sét Liên Hoàn (+12% ATK)
├── Tốc Độ Ánh Sáng (+15% SPD)
└── Lôi Khiên (+8% DEF)

Tier 3: Thunder Mastery
├── Cửu Thiên Huyền Lôi (+20% ATK)
├── Lôi Đình Thiên Kiếp (+25% cultivation speed)
└── Vạn Lôi Triều Tông (Ultimate skill)

Tier 4: Lightning God
└── Lôi Đế Truyền Thừa (Sect master skill)
```

#### 1.3 Y Tông (Medical Sect)
```
Tier 1: Healing Arts
├── Cơ Bản Y Thuật (+100 max HP)
├── Thảo Dược Học (+5% potion effects)
└── Nội Công Dưỡng Sinh (+3% HP regen)

Tier 2: Advanced Medicine
├── Linh Đan Diệu Dược (+15% healing)
├── Độc Thuật Phòng Thân (+10% poison resist)
└── Hồi Phục Thần Tốc (+20% regen)

Tier 3: Divine Healing
├── Hồi Sinh Thuật (Revive ability)
├── Y Đạo Thông Thiên (+30% cultivation speed)
└── Vạn Linh Quy Nguyên (Ultimate skill)

Tier 4: Medicine Saint
└── Y Thánh Truyền Thừa (Sect master skill)
```

#### 1.4 Phòng Thủ Tông (Defense Sect)
```
Tier 1: Shield Basics
├── Cơ Bản Khiên Pháp (+8% DEF)
├── Thể Phách Cường Hóa (+150 max HP)
└── Kiên Nhẫn (+5% damage reduction)

Tier 2: Fortress Arts
├── Kim Cương Bất Hoại (+20% DEF)
├── Phản Đòn Khiên (+10% reflect damage)
└── Bất Động Như Sơn (+15% stability)

Tier 3: Ultimate Defense
├── Vô Địch Kim Thân (+30% DEF)
├── Thủ Đạo Thông Thiên (+35% cultivation speed)
└── Vạn Pháp Bất Xâm (Ultimate skill)

Tier 4: Guardian Saint
└── Thủ Thánh Truyền Thừa (Sect master skill)
```

---

## 🎮 2. SKILL POINT SYSTEM

### 🎯 Mục Tiêu
Tạo hệ thống tích lũy và phân bổ skill points công bằng và engaging.

### 📋 Skill Point Sources

#### 2.1 Skill Point Earning
```typescript
SKILL_POINT_SOURCES = {
  level_up: 1,           // +1 per level
  breakthrough: 3,       // +3 per realm breakthrough
  milestone_levels: 2,   // +2 extra at levels 10, 20, 30...
  achievements: 1,       // +1 per achievement (future)
  special_events: 5      // +5 from special events (future)
}
```

#### 2.2 Skill Point Costs
```typescript
SKILL_COSTS = {
  tier_1: 1,    // 1 point per level
  tier_2: 2,    // 2 points per level  
  tier_3: 3,    // 3 points per level
  tier_4: 5     // 5 points per level
}
```

#### 2.3 Skill Levels
- **Max Level per Skill:** 10
- **Total Cost per Skill:** Varies by tier
- **Skill Effects:** Scale with level

---

## 🔧 3. SKILL EFFECTS SYSTEM

### 🎯 Mục Tiêu
Implement flexible skill effects system với passive và active abilities.

### 📋 Effect Types

#### 3.1 Passive Effects
```typescript
PASSIVE_EFFECTS = {
  stat_bonus: {
    attack: number,
    defense: number,
    speed: number,
    critical_rate: number,
    max_health: number,
    max_mana: number
  },
  cultivation_bonus: {
    speed_multiplier: number,
    offline_efficiency: number,
    breakthrough_success_rate: number
  },
  special_abilities: {
    damage_reflection: number,
    poison_resistance: number,
    healing_amplification: number
  }
}
```

#### 3.2 Active Skills (Future)
```typescript
ACTIVE_SKILLS = {
  combat_skills: {
    damage_multiplier: number,
    cooldown: number,
    mana_cost: number
  },
  utility_skills: {
    healing_amount: number,
    buff_duration: number,
    area_effect: boolean
  }
}
```

---

## 🗄️ 4. DATABASE INTEGRATION

### 🎯 Mục Tiêu
Extend database để support skill system.

### 📋 Database Changes

#### 4.1 Character Skills Table (Already exists)
```sql
-- Extend character_skills table
ALTER TABLE character_skills 
ADD COLUMN IF NOT EXISTS skill_tier INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS max_level INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS current_effects JSONB DEFAULT '{}';
```

#### 4.2 Character Skill Points
```sql
-- Add skill points to characters table
ALTER TABLE characters 
ADD COLUMN IF NOT EXISTS available_skill_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_skill_points_earned INTEGER DEFAULT 0;
```

#### 4.3 Skill Effects Tracking
```sql
-- Use existing active_skill_effects table
-- Track currently active passive effects
```

---

## 🎨 5. UI COMPONENTS

### 🎯 Mục Tiêu
Tạo beautiful và intuitive skill tree interface.

### 📋 Components

#### 5.1 SkillTree Component
- **Tree Layout:** Visual node connections
- **Skill Nodes:** Interactive skill icons
- **Progression Paths:** Clear unlock requirements
- **Skill Details:** Hover tooltips

#### 5.2 SkillNode Component
- **Skill Icon:** Unique icon per skill
- **Level Indicator:** Current/max level
- **Unlock Status:** Available/locked/maxed
- **Upgrade Button:** Level up interface

#### 5.3 SkillTooltip Component
- **Skill Description:** What the skill does
- **Current Effects:** Current bonuses
- **Next Level Preview:** What upgrading gives
- **Requirements:** Unlock conditions

#### 5.4 SkillPointsDisplay
- **Available Points:** How many to spend
- **Total Earned:** Lifetime skill points
- **Point Sources:** Where points came from

---

## 🧪 6. IMPLEMENTATION PLAN

### 📋 Day-by-Day Breakdown

#### Day 1: Core Skill System
- [ ] **Skill Data Structure**
  - Define skill trees for all sects
  - Create skill effects system
  - Setup skill point calculations

- [ ] **Database Integration**
  - Extend character_skills table
  - Add skill points to characters
  - Create skill effect functions

#### Day 2: Skill Tree UI
- [ ] **SkillTree Component**
  - Visual tree layout
  - Node positioning
  - Connection lines

- [ ] **SkillNode Component**
  - Interactive skill nodes
  - Unlock/locked states
  - Level progression display

#### Day 3: Skill Effects & Logic
- [ ] **Effect Application**
  - Passive effect calculations
  - Stat bonus application
  - Cultivation speed bonuses

- [ ] **Skill Progression**
  - Skill point spending
  - Level up mechanics
  - Requirement checking

#### Day 4: Integration & Polish
- [ ] **Game Integration**
  - Add to cultivation dashboard
  - Connect to character progression
  - Breakthrough skill point rewards

- [ ] **UI Polish**
  - Animations and transitions
  - Tooltips and descriptions
  - Mobile responsiveness

#### Day 5: Testing & Optimization
- [ ] **Comprehensive Testing**
  - All skill trees functional
  - Effect calculations correct
  - UI/UX smooth

- [ ] **Performance Optimization**
  - Database query optimization
  - UI rendering performance
  - Memory usage optimization

---

## 🎯 SUCCESS CRITERIA

### ✅ Phase 1.3.2 Complete When:
- [ ] **All 4 Sect Skill Trees:** Complete and functional
- [ ] **Skill Point System:** Earning and spending works
- [ ] **Passive Effects:** All bonuses apply correctly
- [ ] **Beautiful UI:** Intuitive skill tree interface
- [ ] **Database Integration:** All data persisted properly
- [ ] **Mobile Responsive:** Works on all devices
- [ ] **Performance:** Smooth 60fps interactions
- [ ] **Testing:** All scenarios tested

### 📊 Key Metrics:
- **Skill Trees:** 4 complete trees (16+ skills each)
- **Skill Points:** Proper earning/spending system
- **Effects:** All passive bonuses working
- **UI Performance:** <100ms response time
- **Database:** <50ms skill queries

---

## 🚀 NEXT PHASES

### 🔄 After Phase 1.3.2:
1. **Phase 1.3.3:** Experience & Level Polish
2. **Phase 1.3.4:** Combat System Foundation
3. **Phase 1.4:** Battle System Implementation

### 📈 Future Enhancements:
- **Active Skills:** Combat abilities
- **Skill Combinations:** Synergy bonuses
- **Skill Respec:** Reset and redistribute points
- **Legendary Skills:** Ultra-rare abilities
- **Skill Artifacts:** Items that enhance skills

---

**Phase 1.3.2 - Master the arts of your sect! 🌳✨**
