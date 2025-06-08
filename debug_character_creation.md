# 🐛 DEBUG CHARACTER CREATION

## 🔍 TROUBLESHOOTING STEPS

### Step 1: Check Browser Console
1. **Open DevTools** (F12)
2. **Go to Console tab**
3. **Try creating character**
4. **Look for error messages**

### Step 2: Check Network Tab
1. **Open DevTools → Network**
2. **Try creating character**
3. **Look for failed requests**
4. **Check request payload and response**

### Step 3: Check Supabase Logs
1. **Go to Supabase Dashboard**
2. **Navigate to Logs**
3. **Look for recent errors**
4. **Check SQL execution logs**

### Step 4: Verify Database Schema
Run this query in Supabase SQL Editor:

```sql
-- Check characters table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'characters'
ORDER BY ordinal_position;
```

### Step 5: Test Character Creation Manually
Run this in Supabase SQL Editor:

```sql
-- Test manual character creation
INSERT INTO characters (
  player_id,
  name,
  sect,
  level,
  experience,
  realm,
  realm_progress,
  attack,
  defense,
  speed,
  critical_rate,
  health,
  max_health,
  mana,
  max_mana,
  gold,
  spirit_stones,
  cultivation_points,
  cultivation_speed,
  last_cultivation_time,
  current_cultivation_points,
  total_cultivation_time,
  last_cultivation_check,
  is_cultivating,
  offline_cultivation_bonus,
  total_experience,
  experience_to_next_level,
  experience_sources
) VALUES (
  'test-user-id',
  'Test Character',
  'sword',
  1,
  0,
  'qi_refining',
  0,
  12,
  10,
  11,
  0.05,
  100,
  100,
  50,
  50,
  1000,
  0,
  0,
  1.05,
  NOW(),
  0,
  0,
  NOW(),
  false,
  0.5,
  0,
  100,
  '{}'
);
```

### Step 6: Check Missing Fields
Common issues:
- **Missing required fields**
- **Wrong data types**
- **Constraint violations**
- **RLS policy blocking insert**

### Step 7: Temporary Fix - Minimal Character Creation
Try creating with minimal fields first:

```sql
-- Minimal character creation test
INSERT INTO characters (
  player_id,
  name,
  sect
) VALUES (
  'your-user-id',
  'Test Char',
  'sword'
);
```

## 🔧 QUICK FIXES

### Fix 1: Add Missing Columns
If columns are missing, run:

```sql
-- Add any missing columns
ALTER TABLE characters ADD COLUMN IF NOT EXISTS cultivation_points BIGINT DEFAULT 0;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS cultivation_speed DECIMAL DEFAULT 1.0;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS last_cultivation_time TIMESTAMP DEFAULT NOW();
```

### Fix 2: Check RLS Policies
```sql
-- Check if RLS is blocking
SELECT * FROM pg_policies WHERE tablename = 'characters';

-- Temporarily disable RLS for testing
ALTER TABLE characters DISABLE ROW LEVEL SECURITY;
```

### Fix 3: Check User ID
Make sure you're using the correct user ID format:
- Should be UUID format
- Should match auth.uid()

## 🧪 TESTING SCRIPT

Create this test in browser console:

```javascript
// Test character creation data
const testData = {
  name: "Test Character",
  sect: "sword",
  playerId: "your-user-id", // Replace with actual user ID
  stats: {
    attack: 12,
    defense: 10,
    speed: 11,
    criticalRate: 0.05
  },
  resources: {
    level: 1,
    experience: 0,
    realm: "qi_refining",
    realmProgress: 0,
    health: 100,
    maxHealth: 100,
    mana: 50,
    maxMana: 50,
    gold: 1000,
    spiritStones: 0,
    cultivationPoints: 0,
    cultivationSpeed: 1.05
  }
};

console.log("Test data:", testData);
```

## 📋 CHECKLIST

- [ ] Browser console shows no errors
- [ ] Network requests are successful
- [ ] Supabase logs show no errors
- [ ] Database schema is correct
- [ ] All required fields are present
- [ ] RLS policies allow insert
- [ ] User ID is correct format
- [ ] Data types match schema

## 🚨 COMMON ERRORS

### Error: "column does not exist"
**Solution:** Run cultivation schema SQL again

### Error: "violates check constraint"
**Solution:** Check sect value is valid ('sword', 'lightning', 'medical', 'defense')

### Error: "permission denied"
**Solution:** Check RLS policies or user authentication

### Error: "null value in column"
**Solution:** Ensure all required fields have values

## 📞 NEXT STEPS

1. **Follow troubleshooting steps above**
2. **Share console errors if found**
3. **Check Supabase dashboard for logs**
4. **Try manual SQL insert test**
5. **Report specific error message**

---

**Debug Guide - Finding and fixing character creation issues! 🔍🛠️**
