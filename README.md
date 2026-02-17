# 🌙 Ramadhan Care

**Aplikasi pendamping ibadah Ramadhan modern dengan desain pastel bright yang menenangkan**

## ✨ Fitur Utama

### 🔐 Autentikasi
- Login dengan email/password
- Login dengan Google OAuth (mock)
- Profile setup wizard dengan stepper (gender, mazhab, usia, kota)
- Smooth transitions dan micro-interactions

### 🏠 Dashboard
- **Progress Ring** ibadah harian dengan animasi
- **Sholat Wajib Tracker**
  - 5 waktu sholat + Jumat (khusus laki-laki)
  - Toggle real-time dengan animated switch
  - Dropdown alasan untuk perempuan (Haid, Sakit, dll)
  - Auto-sync: Jumat aktif → Zuhur otomatis disable
- **Sholat Sunnah**
  - Dhuha, Tarawih, Tahajud, Witir
  - Expandable cards dengan rakaat counter
  - Increment/decrement animation
- **Puasa & Sahur**
  - Toggle puasa
  - Input waktu sahur
  - **Camera embedded** untuk foto sahur (tidak fullscreen)
  - Preview dalam container dengan timestamp indicator
  - Arsip foto sahur (future: grid gallery)
- **Tilawah Tracker**
  - Input surah/halaman
  - Progress bar dengan target harian
  - Animated progress indicator

### 📅 Kalender
- Full month view dengan React Day Picker
- **Tooltip summary** untuk setiap tanggal
- **Legend warna**:
  - 🟢 Hijau: Ibadah lengkap (5+ aktivitas)
  - 🔵 Biru: Puasa
  - 🟣 Ungu: Tilawah
  - 🟡 Kuning: Zakat
  - 🩷 Pink: Sedekah
  - ⚪ Abu: Kosong
- Detail panel untuk tanggal terpilih
- Statistik bulanan

### 💰 Zakat Fitrah
- **Kalkulator interaktif**
  - Jumlah anggota keluarga
  - Harga beras per kg (editable)
  - Live result animation: `jumlah × harga × 2.5 kg`
- **Form pencatatan**
  - Tanggal & jam
  - Bentuk: Beras/Uang
  - Metode penyaluran
  - Upload bukti (URL input + icon)
  - Catatan
- Riwayat zakat dengan total counter
- Info card dengan catatan penting

### 💝 Sedekah
- Form input dengan nominal, tujuan, kategori, catatan
- **Chart tren bulanan** (Recharts Line Chart)
- **Kategori breakdown** dengan progress bars
- Animated total counter
- Riwayat sedekah lengkap
- Hadist motivasi

### 📖 Refleksi & Cerita Harian
- **Mood selector** dengan emoji pastel (5 opsi)
- Textarea untuk cerita harian (word counter)
- Evaluasi diri
- Rasa syukur (optional)
- **Pertanyaan reflektif** di sidebar (klik untuk insert)
- Privacy notice card
- Tips menulis jurnal
- Calendar indicator konsistensi

### 💬 Chatbot Islami
- **Soft chat bubbles** dengan gradient header
- **Disclaimer card** non-fatwa
- **Typing animation** dengan bouncing dots
- Smooth fade-in messages
- **AI responses** (mock - empatik, non-judgmental)
- Suggested questions untuk quick start
- Clear history button

### ⚙️ Smart Reminder Settings
- **Pengingat Sholat** (dengan waktu otomatis)
- **Pengingat Sahur** (custom time)
- **Pengingat Tilawah** (custom time)
- **Email notifications** (weekly summary)
- Status card dengan indikator aktif/nonaktif
- Privacy & security notice

### 👤 Profile
- User info display
- Statistik ibadah lengkap (sholat, puasa, tilawah, zakat, sedekah)
- About Ramadhan Care
- Logout button

## 🎨 Design System

### Color Palette
- **Mint Primary**: `#81E6D9` - untuk primary actions
- **Soft Blue Secondary**: `#BEE3F8` - untuk secondary elements
- **Lilac Accent**: `#E9D8FD` - untuk accents
- **Peach**: `#FED7D7` - untuk sedekah/journal
- **Light Gold**: `#FAF089` - untuk zakat/achievements
- **Success Green**: `#9AE6B4`
- **Warning Orange**: `#FBD38D`

### Gradients
```css
--gradient-primary: linear-gradient(135deg, #81E6D9 0%, #4FD1C5 100%);
--gradient-secondary: linear-gradient(135deg, #BEE3F8 0%, #90CDF4 100%);
--gradient-accent: linear-gradient(135deg, #E9D8FD 0%, #D6BCFA 100%);
--gradient-warm: linear-gradient(135deg, #FED7D7 0%, #FBD38D 100%);
--gradient-spiritual: linear-gradient(135deg, #E9D8FD 0%, #BEE3F8 50%, #81E6D9 100%);
```

### Typography Scale
- **H1**: 24px (1.5rem) - semibold
- **H2**: 20px (1.25rem) - semibold
- **H3**: 18px (1.125rem) - medium
- **H4**: 16px (1rem) - medium
- **Body**: 16px (1rem) - normal
- **Caption**: 14px (0.875rem) - normal
- **Small**: 12px (0.75rem)

Font Family: **Poppins** (clean, modern)

### Spacing Scale (4pt grid)
- 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px

### Border Radius System
- **sm**: 0.75rem (12px)
- **md**: 1rem (16px)
- **lg**: 1.25rem (20px)
- **xl**: 1.5rem (24px)
- **2xl**: 1.75rem (28px)
- **3xl**: 2rem (32px)

### Shadow System
```css
--shadow-soft-sm: 0 2px 8px rgba(0, 0, 0, 0.04);
--shadow-soft-md: 0 4px 16px rgba(0, 0, 0, 0.06);
--shadow-soft-lg: 0 8px 24px rgba(0, 0, 0, 0.08);
--shadow-soft-xl: 0 12px 32px rgba(0, 0, 0, 0.1);
```

### Animation Timing
- **Fast**: 150ms - untuk hover, small transitions
- **Normal**: 250ms - untuk most interactions
- **Slow**: 400ms - untuk page transitions, complex animations

## 🛠️ Tech Stack

- **Framework**: React 18.3.1
- **Router**: React Router 7.13.0 (Data mode)
- **State Management**: Zustand 5.0.11 (dengan persist middleware)
- **Styling**: Tailwind CSS 4.1.12
- **UI Components**: ShadCN UI (Radix UI primitives)
- **Forms**: React Hook Form 7.55.0
- **Animation**: Motion (Framer Motion) 12.23.24
- **Charts**: Recharts 2.15.2
- **Date**: date-fns 3.6.0
- **Notifications**: Sonner 2.0.3
- **Icons**: Lucide React 0.487.0

## 📱 Responsive Design

### Mobile-First Approach
- **Bottom Navigation** untuk mobile
- Touch-friendly button sizes (min 44px)
- Optimized spacing untuk thumb reach
- Swipe gestures support

### Desktop Optimized
- **Collapsible Sidebar** untuk desktop
- Grid layouts untuk better space usage
- Hover states dan tooltips
- Keyboard navigation support

## 🎭 Interactive Components

### Animations
- ✅ Button press scale (0.95)
- ✅ Toggle smooth switch (150ms)
- ✅ Card expand/collapse
- ✅ Modal fade + blur background
- ✅ Progress animate on load
- ✅ Number counter animation (easeOutQuart)
- ✅ Page slide transitions
- ✅ Smart animate layout shifts

### Micro-interactions
- ✅ Hover effects dengan scale/opacity
- ✅ Loading states dengan spinners
- ✅ Success states dengan check icons
- ✅ Error states dengan shake animation
- ✅ Toast notifications
- ✅ Skeleton loaders (future)

## 🗂️ File Structure

```
/src
├── /app
│   ├── App.tsx                    # Entry point dengan RouterProvider
│   ├── routes.ts                  # Router configuration
│   │
│   ├── /store
│   │   └── useStore.ts           # Zustand store dengan persist
│   │
│   ├── /layouts
│   │   ├── RootLayout.tsx        # Main layout dengan nav
│   │   └── AuthLayout.tsx        # Auth pages layout
│   │
│   ├── /pages
│   │   ├── LoginPage.tsx
│   │   ├── ProfileSetupPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── CalendarPage.tsx
│   │   ├── ZakatPage.tsx
│   │   ├── SedekahPage.tsx
│   │   ├── JournalPage.tsx
│   │   ├── ChatbotPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── SettingsPage.tsx
│   │
│   └── /components
│       ├── CameraCapture.tsx      # Embedded camera component
│       ├── MoodSelector.tsx       # Mood emoji selector
│       ├── ProgressIndicators.tsx # ProgressRing & AnimatedCounter
│       └── /ui                    # ShadCN components
│
└── /styles
    ├── fonts.css                  # Poppins font import
    ├── theme.css                  # Design tokens & utilities
    ├── tailwind.css
    └── index.css
```

## 🔄 State Management Flow

```typescript
// Zustand Store Structure
{
  // Auth
  isAuthenticated: boolean
  user: UserProfile | null
  
  // Data Arrays
  sholatRecords: SholatRecord[]
  puasaRecords: PuasaRecord[]
  tilawahRecords: TilawahRecord[]
  zakatRecords: ZakatRecord[]
  sedekahRecords: SedekahRecord[]
  journalEntries: JournalEntry[]
  chatHistory: ChatMessage[]
  
  // Settings
  reminderSettings: ReminderSettings
  
  // Actions
  login(), logout(), updateProfile()
  addSholatRecord(), updateSholatRecord()
  addPuasaRecord(), updatePuasaRecord()
  addTilawahRecord()
  addZakatRecord()
  addSedekahRecord()
  addJournalEntry()
  addChatMessage(), clearChatHistory()
  updateReminderSettings()
}
```

Data disimpan di **localStorage** via Zustand persist middleware.

## 🚀 Implementasi Backend (Future - Supabase)

### Database Schema (PostgreSQL)
```sql
-- Users table (handled by Supabase Auth)
profiles (
  id uuid primary key,
  email text,
  name text,
  gender text,
  mazhab text,
  age int,
  city text
)

-- Sholat records
sholat_records (
  id uuid primary key,
  user_id uuid references profiles(id),
  date date,
  type text, -- 'wajib' | 'sunnah'
  name text,
  completed boolean,
  rakaat int,
  alasan text,
  created_at timestamp
)

-- Similar tables for:
-- puasa_records, tilawah_records, zakat_records, 
-- sedekah_records, journal_entries, chat_messages
```

### Storage Buckets
```
sahur-photos/{user_id}/{date}_{timestamp}.jpg
zakat-proof/{user_id}/{record_id}.jpg
```

### Row Level Security (RLS)
```sql
-- Users can only access their own data
CREATE POLICY "Users can view own data"
  ON sholat_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data"
  ON sholat_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Similar policies for all tables
```

### Edge Functions (Future)
- **Reminder scheduler** (Deno cron)
- **Email weekly summary** (via Resend/SendGrid)
- **AI Chatbot** (OpenAI API integration)

## 📝 Development Notes

### Mock Data & Functions
- Login/Google OAuth adalah mock (delay 500ms)
- Chatbot responses adalah hardcoded patterns
- Camera berfungsi dengan browser MediaDevices API
- Semua data tersimpan lokal via Zustand persist

### Accessibility
- Semantic HTML structure
- ARIA labels untuk interactive elements
- Keyboard navigation support
- Focus states visible
- Color contrast ratio > 4.5:1

### Performance
- Code splitting dengan React Router
- Lazy loading untuk images
- Debounced inputs
- Memoized calculations
- Optimized re-renders dengan Zustand selectors

## 🎯 Future Enhancements

- [ ] Dark mode toggle
- [ ] Offline support (PWA)
- [ ] Push notifications
- [ ] Export data (PDF/CSV)
- [ ] Multi-language (ID/EN/AR)
- [ ] Qibla direction
- [ ] Prayer times API integration
- [ ] Social sharing
- [ ] Achievements & badges
- [ ] Community features

---

**Built with ❤️ for spiritual growth during Ramadhan**

Barakallahu fiikum! 🌙✨
