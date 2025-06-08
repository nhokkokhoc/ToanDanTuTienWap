# 🚀 HƯỚNG DẪN SETUP TOÀN DÂN TU TIÊN

## 📋 BƯỚC 1: CÀI ĐẶT NODE.JS

### Windows:
1. **Tải Node.js:**
   - Truy cập: https://nodejs.org/
   - Tải phiên bản LTS (Long Term Support) - hiện tại là v20.x
   - Chạy file `.msi` và làm theo hướng dẫn

2. **Verify cài đặt:**
   ```bash
   node --version
   npm --version
   ```

### Alternative: Sử dụng Package Manager
```bash
# Chocolatey (Windows)
choco install nodejs

# Winget (Windows 10/11)
winget install OpenJS.NodeJS
```

## 📦 BƯỚC 2: CÀI ĐẶT DEPENDENCIES

Sau khi Node.js đã được cài đặt:

```bash
# Di chuyển vào thư mục project
cd ToanDanTuTienWap

# Cài đặt tất cả dependencies
npm install
```

## 🔧 BƯỚC 3: CẤU HÌNH SUPABASE

### 3.1 Tạo Supabase Project
1. Truy cập: https://supabase.com/
2. Đăng ký/Đăng nhập tài khoản
3. Tạo project mới:
   - Project name: `toan-dan-tu-tien`
   - Database password: Tạo password mạnh
   - Region: Southeast Asia (Singapore)

### 3.2 Lấy API Keys
1. Vào project dashboard
2. Vào Settings → API
3. Copy các thông tin sau:
   - Project URL : https://hievytcfgfnpveaewiqy.supabase.co
   - Anon public key : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpZXZ5dGNmZ2ZucHZlYWV3aXF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MDAwNzMsImV4cCI6MjA2NDk3NjA3M30.itX-EY4MD6DrRXmnIDGIQ8RGn7rWr9iwIt6GvkyUlMs
   - Service role key (secret) :eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpZXZ5dGNmZ2ZucHZlYWV3aXF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTQwMDA3MywiZXhwIjoyMDY0OTc2MDczfQ.xTIEhnMN_SAD1hZJfcgxZd5la_PLmZkujFWYlclYImk

### 3.3 Cấu hình Environment Variables
```bash
# Copy file example
cp .env.local.example .env.local

# Chỉnh sửa .env.local với thông tin Supabase
```

Nội dung file `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

NODE_ENV=development
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_GAME_VERSION=0.1.0
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

## 🗄️ BƯỚC 4: SETUP DATABASE

### 4.1 Tạo Tables
Vào Supabase Dashboard → SQL Editor và chạy:

```sql
-- Players table
CREATE TABLE players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Characters table
CREATE TABLE characters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sect TEXT NOT NULL CHECK (sect IN ('sword', 'lightning', 'medical', 'defense')),
  level INTEGER DEFAULT 1,
  experience BIGINT DEFAULT 0,
  realm TEXT DEFAULT 'qi_refining',
  realm_progress INTEGER DEFAULT 0,
  
  -- Stats
  attack INTEGER DEFAULT 10,
  defense INTEGER DEFAULT 10,
  speed INTEGER DEFAULT 10,
  critical_rate DECIMAL DEFAULT 0.05,
  
  -- Resources
  health INTEGER DEFAULT 100,
  max_health INTEGER DEFAULT 100,
  mana INTEGER DEFAULT 50,
  max_mana INTEGER DEFAULT 50,
  
  -- Currency
  gold BIGINT DEFAULT 1000,
  spirit_stones INTEGER DEFAULT 0,
  
  -- Cultivation
  cultivation_points BIGINT DEFAULT 0,
  cultivation_speed DECIMAL DEFAULT 1.0,
  last_cultivation_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own player data" ON players
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own player data" ON players
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view own characters" ON characters
  FOR ALL USING (player_id = auth.uid());
```

### 4.2 Enable Authentication

#### 4.2.1 Truy cập Authentication Settings
1. Vào Supabase Dashboard → Authentication → Settings
2. **General Settings:**
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

#### 4.2.2 Enable Email Provider
1. Vào Authentication → Providers
2. **Email Provider:**
   - Toggle "Enable email provider" = ON
   - Enable email confirmations = OFF (development)
   - Enable email change confirmations = OFF (development)
   - Secure email change = OFF (development)

#### 4.2.3 Configure Email Settings
1. Vào Authentication → Settings → Email
2. **Disable confirmations for development:**
   - Enable email confirmations = OFF
   - Secure email change = OFF
   - Double confirm email changes = OFF

#### 4.2.4 Test Authentication (Optional)
Tạo user test trong Authentication → Users:
- Email: `test@example.com`
- Password: `testpassword123`
- Auto Confirm User = ON

## 🚀 BƯỚC 5: CHẠY PROJECT

```bash
# Development mode
npm run dev

# Production build
npm run build
npm run start
```

Truy cập: http://localhost:3000

### 5.1 Test Authentication Setup
Sau khi project chạy thành công:

1. **Truy cập trang test:** http://localhost:3000/test-auth
2. **Kiểm tra connection status:** Phải hiển thị "✅ Connected"
3. **Test đăng ký:** Tạo tài khoản mới
4. **Test đăng nhập:** Đăng nhập với tài khoản vừa tạo
5. **Test đăng xuất:** Đăng xuất và kiểm tra session

### 5.2 Verify trong Supabase Dashboard
1. Vào Authentication → Users
2. Kiểm tra user vừa tạo có xuất hiện
3. Xem thông tin user details

## 🔍 BƯỚC 6: VERIFY SETUP

### Checklist:
- [ ] Node.js và npm đã cài đặt
- [ ] Dependencies đã install thành công
- [ ] Supabase project đã tạo
- [ ] Environment variables đã cấu hình
- [ ] Database tables đã tạo
- [ ] Project chạy được trên localhost:3000
- [ ] Landing page hiển thị đúng
- [ ] Không có lỗi trong console

## 🐛 TROUBLESHOOTING

### Lỗi thường gặp:

1. **"npx: command not found"**
   - Node.js chưa được cài đặt hoặc chưa restart terminal
   - Solution: Cài đặt Node.js và restart terminal

2. **"Module not found"**
   - Dependencies chưa được install
   - Solution: `npm install`

3. **"Supabase connection failed"**
   - Environment variables chưa đúng
   - Solution: Kiểm tra lại `.env.local`

4. **"Port 3000 already in use"**
   - Port đã được sử dụng
   - Solution: `npm run dev -- -p 3001`

5. **TypeScript errors**
   - Type checking issues
   - Solution: `npm run type-check`

## 📱 BƯỚC 7: MOBILE TESTING

### Test trên mobile:
1. Tìm IP address của máy: `ipconfig` (Windows) hoặc `ifconfig` (Mac/Linux)
2. Truy cập từ mobile: `http://YOUR_IP:3000`
3. Test responsive design và touch interactions

### PWA Testing:
1. Mở Chrome DevTools
2. Vào Application tab
3. Kiểm tra Manifest và Service Worker
4. Test "Add to Home Screen"

## 🎯 NEXT STEPS

Sau khi setup thành công:

1. **Phase 1.1:** Implement Authentication
2. **Phase 1.2:** Character Creation Flow
3. **Phase 1.3:** Basic Cultivation System
4. **Phase 1.4:** Inventory Management
5. **Phase 1.5:** Combat System

## 📞 SUPPORT

Nếu gặp vấn đề:
1. Kiểm tra console logs
2. Verify environment variables
3. Check Supabase dashboard
4. Review setup steps

**Happy Coding! 🎮✨**
