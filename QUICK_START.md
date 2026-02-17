# 🚀 Quick Start Guide - Ramadhan Care

## Langkah Cepat Memulai

### 1. Login
1. Buka aplikasi
2. Anda akan melihat halaman login dengan gradien spiritual yang indah
3. **Opsi 1 - Email/Password:**
   - Masukkan email dan password apa saja (mock auth)
   - Klik "Masuk"
   
4. **Opsi 2 - Google OAuth:**
   - Klik "Masuk dengan Google"
   - Anda akan diarahkan ke profile setup

### 2. Profile Setup (untuk Google login)
Jika login dengan Google, Anda akan melalui 3 langkah setup:

**Step 1: Jenis Kelamin**
- Pilih ikon laki-laki atau perempuan
- Klik "Lanjut"

**Step 2: Mazhab**
- Pilih mazhab Anda dari dropdown
- Klik "Lanjut"

**Step 3: Info Tambahan**
- Masukkan usia dan kota
- Klik "Selesai"

### 3. Jelajahi Dashboard
Setelah login, Anda akan masuk ke Dashboard utama dengan fitur:

#### 📊 Progress Ring
- Menampilkan persentase ibadah wajib hari ini
- Angka akan beranimasi saat pertama kali muncul

#### 🙏 Sholat Wajib
- Toggle ON/OFF untuk setiap waktu sholat
- **Khusus Perempuan:** Klik ikon dropdown untuk memilih alasan
- **Khusus Laki-laki di Jumat:** Centang "Jumat" akan otomatis disable "Zuhur"

#### ✨ Sholat Sunnah
- Expand card untuk masing-masing sholat sunnah
- Atur jumlah rakaat dengan tombol +/-
- Klik "Simpan" untuk mencatat

#### 🌙 Puasa & Sahur
- Toggle "Puasa Hari Ini"
- Atur waktu sahur
- Klik "Ambil Foto Sahur" untuk dokumentasi
- Camera akan muncul embedded (bukan fullscreen)
- Foto disimpan dengan timestamp

#### 📖 Tilawah
- Input nama surah atau nomor halaman
- Progress bar menunjukkan pencapaian harian

### 4. Navigasi

#### Mobile (Bottom Nav)
- 🏠 Home - Dashboard utama
- 📅 Calendar - Kalender ibadah
- 💰 Zakat - Kalkulator & pencatatan zakat
- 📖 Journal - Refleksi harian privat
- 💬 Chatbot - Asisten spiritual AI

#### Desktop (Sidebar)
- Semua menu di atas +
- 👤 Profile - Info & statistik
- ⚙️ Settings - Pengaturan reminder

### 5. Fitur-Fitur Utama

#### 📅 Calendar
1. Klik tanggal untuk melihat detail aktivitas
2. Warna menunjukkan jenis aktivitas
3. Panel kanan menampilkan rincian

#### 💰 Zakat Fitrah
1. **Kalkulator:**
   - Masukkan jumlah anggota keluarga
   - Atur harga beras
   - Lihat hasil real-time
2. **Pencatatan:**
   - Klik "Lanjut ke Pencatatan"
   - Isi form lengkap
   - Upload bukti (opsional)

#### 💝 Sedekah
1. Klik "Tambah Sedekah"
2. Isi nominal, tujuan, kategori
3. Chart otomatis update
4. Lihat breakdown per kategori

#### 📖 Journal (Privat!)
1. Pilih mood dengan emoji
2. Tulis cerita harian
3. Evaluasi diri
4. Gunakan pertanyaan reflektif di sidebar

#### 💬 Chatbot
1. Tanya apa saja tentang ibadah
2. Dapatkan jawaban empatik
3. Non-judgmental & supportive
4. **BUKAN fatwa resmi**

#### ⚙️ Settings
1. Aktifkan reminder sholat, sahur, tilawah
2. Setup email notification
3. Atur waktu custom

### 6. Developer Tools (Development Mode Only)

Di pojok kanan bawah, ada tombol ungu dengan ikon code (</>):

1. **Seed Sample Data** - Isi aplikasi dengan data contoh
2. **Clear All Data** - Hapus semua data (localStorage)

**Gunakan "Seed Sample Data" untuk quick demo!**

## 🎨 Tips UI/UX

### Animasi & Interaksi
- Semua transisi smooth (150-400ms)
- Hover effects di desktop
- Press effects di mobile
- Counter numbers beranimasi
- Progress bars fill dengan motion
- Cards expand/collapse smooth

### Warna & Makna
- 🟢 Hijau (Success) - Ibadah lengkap
- 🔵 Biru (Secondary) - Puasa
- 🟣 Ungu (Accent) - Tilawah
- 🟡 Kuning (Gold) - Zakat
- 🩷 Pink (Peach) - Sedekah/Journal
- ⚪ Abu (Muted) - Belum ada data

### Shortcuts & Easter Eggs
- Di Journal page, klik pertanyaan reflektif untuk auto-insert
- Progress ring akan bounce saat mencapai 100%
- Toast notifications muncul untuk setiap action
- Layout ID animation untuk smooth navigation transitions

## 🔧 Troubleshooting

### Camera tidak berfungsi
- Pastikan browser memiliki izin akses camera
- Gunakan HTTPS atau localhost
- Refresh halaman

### Data hilang
- Data tersimpan di localStorage
- Jangan clear browser data
- Gunakan "Seed Sample Data" untuk restore demo

### Animasi patah-patah
- Periksa performa browser
- Tutup tab lain yang berat
- Disable extensions yang mengganggu

### Login tidak berhasil
- Mock auth selalu berhasil
- Cek console untuk error
- Refresh dan coba lagi

## 📱 Responsive Breakpoints

- **Mobile:** < 1024px (Bottom nav)
- **Desktop:** ≥ 1024px (Sidebar)

Coba resize browser untuk melihat transisi responsive!

## 🎯 Flow Recommended untuk Demo

1. Login dengan Google OAuth
2. Setup profile
3. Klik Dev Tools → "Seed Sample Data"
4. Explore Dashboard - lihat data terisi
5. Klik Calendar - lihat history
6. Buka Zakat - coba kalkulator
7. Buka Sedekah - lihat chart
8. Buka Journal - tulis refleksi
9. Buka Chatbot - tanya sesuatu
10. Buka Settings - aktifkan reminders
11. Buka Profile - lihat statistik

## 💡 Pro Tips

- **Untuk presentasi:** Gunakan sample data + full screen mode
- **Untuk testing:** Clear data, mulai fresh, coba semua flow
- **Untuk demo cepat:** Login email langsung ke dashboard
- **Untuk showcase UX:** Perhatikan micro-interactions saat hover/click

---

**Selamat mencoba Ramadhan Care! 🌙✨**

Barakallahu fiikum!
