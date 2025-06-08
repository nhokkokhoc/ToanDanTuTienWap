# 🧘 CULTIVATION SYSTEM SETUP GUIDE

## 📋 TỔNG QUAN

Hướng dẫn này sẽ giúp bạn setup hệ thống tu luyện (Cultivation System) cho Phase 1.3 của game Toàn Dân Tu Tiên.

## 🗄️ DATABASE SETUP

### Bước 1: Chạy SQL Schema
Vào Supabase Dashboard → SQL Editor và chạy file `database/cultivation_schema_simple.sql`:

```sql
-- Copy toàn bộ nội dung từ file database/cultivation_schema_simple.sql
-- và paste vào SQL Editor, sau đó click "Run"
```

**⚠️ Lưu ý:** Sử dụng file `cultivation_schema_simple.sql` thay vì file gốc để tránh lỗi syntax.

### Bước 2: Verify Tables
Kiểm tra các tables đã được tạo:
- `characters` (đã có, được extend thêm columns)
- `character_skills`
- `cultivation_sessions`
- `breakthrough_history`
- `active_skill_effects`
- `cultivation_realms`
- `sect_skills`

### Bước 3: Check Functions
Verify các functions đã được tạo:
- `calculate_cultivation_speed(character_id UUID)`
- `calculate_offline_progress(character_id UUID)`

## 🔧 CODE INTEGRATION

### Files đã tạo:
- `src/lib/cultivation.ts` - Core cultivation logic
- `src/components/CultivationTimer.tsx` - Timer component
- `src/components/OfflineProgress.tsx` - Offline progress modal
- `src/components/CultivationDashboard.tsx` - Main dashboard
- `src/app/game/page.tsx` - Game page

### Dependencies cần install:
```bash
# Đã có sẵn trong project
# Không cần install thêm gì
```

## 🎮 TESTING CULTIVATION SYSTEM

### Test 1: Basic Cultivation
1. **Login và chọn character**
2. **Vào game page:** `/game`
3. **Test cultivation timer:**
   - Click "Bắt Đầu Tu Luyện"
   - Xem timer đếm lên
   - Xem điểm tu luyện tăng
   - Click "Dừng Tu Luyện"

### Test 2: Offline Progress
1. **Start cultivation**
2. **Close browser/tab**
3. **Wait 5-10 minutes**
4. **Reopen game**
5. **Should see offline progress modal**

### Test 3: Realm Progress
1. **Check current realm info**
2. **Verify progress bar**
3. **Check next realm requirements**
4. **Test breakthrough eligibility**

### Test 4: Database Persistence
1. **Start cultivation session**
2. **Refresh page**
3. **Verify data persists**
4. **Check Supabase tables for data**

## 🎯 EXPECTED BEHAVIOR

### Cultivation Timer:
- ✅ Start/stop cultivation
- ✅ Real-time timer display
- ✅ Points calculation
- ✅ Visual meditation animation
- ✅ Speed modifiers applied

### Offline Progress:
- ✅ Calculate time offline
- ✅ Apply 50% efficiency
- ✅ Cap at 24 hours
- ✅ Show progress modal
- ✅ Claim rewards

### Realm System:
- ✅ Display current realm info
- ✅ Show progress to next realm
- ✅ Check breakthrough requirements
- ✅ Realm bonuses applied

### Database:
- ✅ Cultivation sessions logged
- ✅ Progress updates saved
- ✅ Character data persists
- ✅ Offline calculations work

## 🐛 TROUBLESHOOTING

### Common Issues:

1. **"Function not found" error:**
   - Verify SQL functions were created
   - Check Supabase logs
   - Re-run cultivation_schema.sql

2. **Timer not updating:**
   - Check browser console for errors
   - Verify character ID is valid
   - Check network requests

3. **Offline progress not showing:**
   - Verify last_cultivation_check timestamp
   - Check calculate_offline_progress function
   - Ensure character has cultivation data

4. **Database connection errors:**
   - Check Supabase credentials
   - Verify environment variables
   - Check network connectivity

### Debug Steps:

1. **Check Console Logs:**
   ```javascript
   // Open browser DevTools → Console
   // Look for cultivation-related errors
   ```

2. **Verify Database:**
   ```sql
   -- Check character cultivation data
   SELECT * FROM characters WHERE id = 'your-character-id';
   
   -- Check cultivation sessions
   SELECT * FROM cultivation_sessions WHERE character_id = 'your-character-id';
   ```

3. **Test Functions:**
   ```sql
   -- Test cultivation speed calculation
   SELECT calculate_cultivation_speed('your-character-id');
   
   -- Test offline progress
   SELECT * FROM calculate_offline_progress('your-character-id');
   ```

## 📊 PERFORMANCE MONITORING

### Key Metrics to Watch:
- **Timer Accuracy:** Should update every second
- **Database Updates:** Every 5 seconds during cultivation
- **Memory Usage:** Should remain stable
- **Network Requests:** Minimal and efficient

### Performance Tips:
- Cultivation updates are batched every 5 seconds
- Offline calculations are cached
- Database queries are optimized
- UI updates use React state management

## 🎨 UI/UX FEATURES

### Cultivation Timer:
- Real-time countdown display
- Meditation animation with particles
- Start/stop controls
- Progress statistics
- Speed multiplier display

### Offline Progress:
- Welcome back modal
- Time elapsed calculation
- Points gained summary
- Efficiency explanation
- Claim rewards button

### Cultivation Dashboard:
- Character realm info
- Progress bars
- Breakthrough eligibility
- Next realm preview
- Cultivation tips

## 🔄 NEXT STEPS

After successful testing:

1. **Phase 1.3.1:** Breakthrough System Implementation
2. **Phase 1.3.2:** Skill Tree System
3. **Phase 1.3.3:** Experience & Level System
4. **Phase 1.3.4:** Polish & Optimization

## 📝 NOTES

### Development Notes:
- Cultivation system is the core of the game
- All calculations are server-side for security
- Offline progress encourages daily engagement
- Real-time updates provide immediate feedback

### Design Decisions:
- 50% offline efficiency balances engagement
- 24-hour offline cap prevents exploitation
- Visual feedback enhances user experience
- Sect bonuses add strategic depth

### Future Enhancements:
- Cultivation pills and boosters
- Meditation locations with bonuses
- Group cultivation sessions
- Cultivation competitions

---

## 🎮 READY TO TEST!

1. **Setup database:** Run cultivation_schema.sql
2. **Start development server:** `npm run dev`
3. **Login and select character**
4. **Navigate to:** `http://localhost:3000/game`
5. **Test cultivation features**

**Cultivation System - The heart of immortal cultivation! 🧘✨**
