# 🎮 Toàn Dân Tu Tiên - WAP Game

Một game tu tiên idle RPG được xây dựng với Next.js và Supabase, tối ưu cho mobile web.

## 🚀 Bắt Đầu Nhanh

### Yêu Cầu Hệ Thống
- Node.js 18.0.0 trở lên
- npm 8.0.0 trở lên
- Tài khoản Supabase (miễn phí)

### Cài Đặt

1. **Clone repository:**
```bash
git clone <repository-url>
cd ToanDanTuTienWap
```

2. **Cài đặt dependencies:**
```bash
npm install
```

3. **Cấu hình environment variables:**
```bash
cp .env.local.example .env.local
```
Chỉnh sửa `.env.local` với thông tin Supabase của bạn.

4. **Chạy development server:**
```bash
npm run dev
```

5. **Mở trình duyệt:**
Truy cập [http://localhost:3000](http://localhost:3000)

## 🛠️ Stack Công Nghệ

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Real-time)
- **Deployment:** Vercel
- **Animation:** Framer Motion
- **Icons:** Lucide React

## 📱 Tính Năng

### Phase 1 (Hiện Tại)
- [x] Landing page với sect selection
- [x] Responsive design cho mobile
- [x] Animation và UI effects
- [ ] Authentication system
- [ ] Character creation
- [ ] Basic cultivation system
- [ ] Inventory management

### Phase 2 (Sắp Tới)
- [ ] PvP Arena
- [ ] Guild system
- [ ] Advanced dungeons
- [ ] Equipment enhancement

### Phase 3 (Tương Lai)
- [ ] Pet system
- [ ] Marketplace
- [ ] Cross-server features
- [ ] Advanced monetization

## 🎯 Game Mechanics

### Tu Luyện (Cultivation)
- **Idle System:** Tu luyện tự động ngay cả khi offline
- **Breakthrough:** Nâng cấp cảnh giới để mở khóa sức mạnh mới
- **Sect Skills:** Mỗi tông phái có skill tree riêng biệt

### Combat System
- **Auto Battle:** Chiến đấu tự động với AI thông minh
- **Turn-based:** Hệ thống lượt dựa trên speed
- **Skills & Combos:** Kết hợp skill để tạo combo mạnh

### Progression
- **Character Level:** Tăng stats cơ bản
- **Cultivation Realm:** Mở khóa abilities mới
- **Equipment:** Trang bị và nâng cấp gear
- **Alchemy:** Luyện đan để tăng sức mạnh

## 🏗️ Cấu Trúc Project

```
src/
├── app/                 # Next.js App Router
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
├── lib/               # Utility libraries
├── types/             # TypeScript type definitions
├── hooks/             # Custom React hooks
└── utils/             # Helper functions
```

## 🎨 Design System

### Colors
- **Primary:** Blue gradient (cultivation energy)
- **Gold:** Currency và premium features
- **Cultivation Realms:** Mỗi cảnh giới có màu riêng
- **Dark Theme:** Tối ưu cho mobile gaming

### Typography
- **Font:** Inter (clean, readable)
- **Chinese Support:** Noto Sans SC
- **Responsive:** Tự động điều chỉnh theo screen size

## 📊 Performance

### Targets
- **Load Time:** < 3 giây trên 3G
- **Bundle Size:** < 500KB initial load
- **Memory Usage:** < 100MB trên mobile
- **Battery Impact:** Tối thiểu background processing

### Optimizations
- **Code Splitting:** Lazy loading components
- **Image Optimization:** Next.js Image component
- **Caching:** Redis cho game state
- **PWA:** Offline support

## 🔧 Development

### Scripts
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint check
npm run type-check   # TypeScript check
```

### Code Quality
- **ESLint:** Code linting
- **Prettier:** Code formatting
- **TypeScript:** Type safety
- **Husky:** Git hooks

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Configure environment variables
3. Deploy automatically on push

### Manual Deployment
```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.

## 🎮 Game Design Philosophy

### Core Principles
- **Accessibility:** Dễ chơi cho mọi người
- **Progression:** Cảm giác tiến bộ liên tục
- **Social:** Tương tác với người chơi khác
- **Balance:** Fair play, không pay-to-win

### Target Audience
- **Primary:** Game thủ Việt Nam yêu thích tu tiên
- **Secondary:** Fans của idle/incremental games
- **Age:** 16-35 tuổi
- **Platform:** Mobile-first, desktop support

## 📞 Support

- **Issues:** GitHub Issues
- **Discord:** [Game Community](discord-link)
- **Email:** support@toandantutien.com

---

**Hành trình tu tiên bắt đầu từ đây! 🌟**
