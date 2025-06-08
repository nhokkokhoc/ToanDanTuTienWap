# 🧪 PHASE 1.2 TESTING GUIDE

## ✅ CHARACTER CREATION & AUTHENTICATION TESTING

### 🔐 AUTHENTICATION TESTING

#### Test 1: User Registration
1. **Truy cập:** http://localhost:3000/auth/login
2. **Click:** Tab "Đăng ký"
3. **Nhập thông tin:**
   - Username: `testuser1`
   - Email: `test1@example.com`
   - Password: `password123`
4. **Click:** "Tạo tài khoản"
5. **Expected:** Redirect to `/characters` page

#### Test 2: User Login
1. **Truy cập:** http://localhost:3000/auth/login
2. **Tab:** "Đăng nhập" (default)
3. **Nhập thông tin:**
   - Email: `test1@example.com`
   - Password: `password123`
4. **Click:** "Đăng nhập"
5. **Expected:** Redirect to `/characters` page

#### Test 3: Invalid Login
1. **Truy cập:** http://localhost:3000/auth/login
2. **Nhập thông tin sai:**
   - Email: `wrong@example.com`
   - Password: `wrongpassword`
3. **Click:** "Đăng nhập"
4. **Expected:** Error message "Email hoặc mật khẩu không đúng"

### 🎮 CHARACTER CREATION TESTING

#### Test 4: Character Creation Flow
1. **Đăng nhập thành công**
2. **Trang Characters:** Click "Tạo Nhân Vật Mới"
3. **Step 1 - Name:**
   - Nhập tên: `Tu Sĩ Mạnh`
   - Click "Tiếp theo"
4. **Step 2 - Sect:**
   - Chọn "Kiếm Tông"
   - Xem stats preview
   - Click "Tạo nhân vật"
5. **Expected:** Character được tạo và hiển thị trong danh sách

#### Test 5: Character Name Validation
1. **Tạo character mới**
2. **Test các trường hợp:**
   - Tên trống: Expected error
   - Tên quá ngắn (1 ký tự): Expected error
   - Tên quá dài (>20 ký tự): Expected error
   - Ký tự đặc biệt: Expected error
   - Từ cấm (admin): Expected error
   - Tên hợp lệ: Should proceed

#### Test 6: Duplicate Character Name
1. **Tạo character:** `TestChar1`
2. **Tạo character thứ 2:** `TestChar1` (same name)
3. **Expected:** Error "Tên nhân vật đã tồn tại"

#### Test 7: All Sect Types
**Test tạo character cho mỗi sect:**
1. **Kiếm Tông:** ATK cao, SPD cao
2. **Lôi Tông:** SPD cao, MP cao
3. **Y Tông:** HP cao, DEF cao
4. **Phòng Thủ Tông:** DEF cao, HP cao

### 📋 CHARACTER MANAGEMENT TESTING

#### Test 8: Character List Display
1. **Tạo 3-4 characters khác nhau**
2. **Verify hiển thị:**
   - Character name
   - Sect icon và name
   - Level (should be 1)
   - Realm (should be "Luyện Khí")
   - Stats (ATK, DEF, SPD)
   - Resources (HP, MP, Gold, Spirit Stones)
   - Created date

#### Test 9: Character Selection
1. **Click vào character**
2. **Expected:** Character được highlight
3. **Click "Bắt đầu tu tiên"** (if implemented)
4. **Expected:** Navigate to game với selected character

#### Test 10: Character Deletion
1. **Click delete button** trên character
2. **First click:** Confirmation state
3. **Second click:** Character deleted
4. **Expected:** Character removed from list

### 🔄 NAVIGATION TESTING

#### Test 11: Protected Routes
1. **Logout** (if logged in)
2. **Truy cập:** http://localhost:3000/characters
3. **Expected:** Redirect to `/auth/login`

#### Test 12: Navigation Flow
1. **Home page:** Click "Bắt Đầu Tu Tiên"
2. **Expected:** Go to `/characters` or `/auth/login`
3. **Characters page:** Click "Trang chủ"
4. **Expected:** Go to home page

### 💾 DATABASE TESTING

#### Test 13: Data Persistence
1. **Tạo character**
2. **Logout và login lại**
3. **Expected:** Character vẫn tồn tại
4. **Check Supabase dashboard:** Data should be in `characters` table

#### Test 14: Player Profile Creation
1. **Đăng ký user mới**
2. **Check Supabase dashboard:**
   - `players` table có record mới
   - `id` matches auth user id
   - `username` và `email` correct

### 🎨 UI/UX TESTING

#### Test 15: Responsive Design
1. **Test trên mobile viewport** (375px width)
2. **Test trên tablet** (768px width)
3. **Test trên desktop** (1200px+ width)
4. **Expected:** UI adapts properly

#### Test 16: Animations
1. **Character creation steps:** Smooth transitions
2. **Sect selection:** Hover effects
3. **Button interactions:** Scale effects
4. **Loading states:** Spinner animations

#### Test 17: Error Handling
1. **Disconnect internet**
2. **Try creating character**
3. **Expected:** Appropriate error message
4. **Reconnect:** Should work normally

### 📊 PERFORMANCE TESTING

#### Test 18: Load Times
1. **Measure page load times:**
   - Home page: < 3 seconds
   - Auth page: < 2 seconds
   - Characters page: < 3 seconds
2. **Check bundle size:** < 500KB initial

#### Test 19: Memory Usage
1. **Open DevTools → Performance**
2. **Navigate through app**
3. **Check memory usage:** Should be reasonable
4. **No memory leaks:** Memory should stabilize

### 🔧 DEVELOPER TESTING

#### Test 20: Console Errors
1. **Open DevTools → Console**
2. **Navigate through entire app**
3. **Expected:** No console errors
4. **Warnings:** Should be minimal

#### Test 21: TypeScript Compilation
```bash
npm run type-check
```
**Expected:** No TypeScript errors

#### Test 22: ESLint
```bash
npm run lint
```
**Expected:** No linting errors

### 📋 TESTING CHECKLIST

#### Authentication ✅
- [x] User registration
- [x] User login
- [x] Invalid credentials handling
- [x] Protected routes
- [x] Session persistence

#### Character Creation ✅
- [x] Multi-step form
- [x] Name validation
- [x] Sect selection
- [x] Stats calculation
- [x] Database persistence

#### Character Management ✅
- [x] Character list display
- [x] Character selection
- [x] Character deletion
- [x] Data loading states

#### UI/UX ✅
- [x] Responsive design
- [x] Smooth animations
- [x] Error states
- [x] Loading states

#### Technical ✅
- [x] No console errors
- [x] TypeScript compliance
- [x] Performance targets
- [x] Database integration

### 🐛 KNOWN ISSUES

#### Minor Issues:
1. **Character deletion:** No undo functionality
2. **Form validation:** Could be more detailed
3. **Loading states:** Could be more specific

#### Future Improvements:
1. **Avatar upload:** Not implemented yet
2. **Character editing:** Name change not available
3. **Bulk operations:** Multiple character selection

### 🎯 SUCCESS CRITERIA

**Phase 1.2 is complete when:**
- [x] All authentication flows work
- [x] Character creation is fully functional
- [x] Character management works properly
- [x] Data persists correctly
- [x] UI is responsive and polished
- [x] No critical bugs
- [x] Performance targets met

### 📞 SUPPORT

**If you encounter issues:**
1. Check browser console for errors
2. Verify Supabase connection
3. Check environment variables
4. Review database tables
5. Test with different browsers

**Common Solutions:**
- Clear browser cache
- Restart development server
- Check network connection
- Verify Supabase configuration

---

**Phase 1.2 Character Creation System - COMPLETED! ✅**
