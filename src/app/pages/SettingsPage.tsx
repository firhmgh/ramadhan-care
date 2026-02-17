import { useStore } from '../store/useStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Mail, 
  Clock, 
  Save, 
  ShieldCheck, 
  Info, 
  User as UserIcon, 
  BookOpen 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function SettingsPage() {
  // Ambil user dan fungsi update dari store
  // Catatan: Pastikan di useStore.ts Anda memiliki fungsi setUser atau updateUser
  const { 
    user, 
    setUser, 
    reminderSettings, 
    updateReminderSettings 
  } = useStore();
  
  // State untuk Profil
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age?.toString() || '');
  const [gender, setGender] = useState(user?.gender || 'Laki-Laki');
  const [mazhab, setMazhab] = useState(user?.mazhab || 'Syafi\'i');

  // State untuk Pengingat
  const [sholatReminder, setSholatReminder] = useState(reminderSettings.sholatReminder);
  const [sahurReminder, setSahurReminder] = useState(reminderSettings.sahurReminder);
  const [sahurTime, setSahurTime] = useState(reminderSettings.sahurTime);
  const [tilawahReminder, setTilawahReminder] = useState(reminderSettings.tilawahReminder);
  const [tilawahTime, setTilawahTime] = useState(reminderSettings.tilawahTime);
  const [emailNotification, setEmailNotification] = useState(reminderSettings.emailNotification);
  const [email, setEmail] = useState(reminderSettings.email || '');

  const handleSave = () => {
    // 1. Simpan Data Profil
    if (setUser) {
      setUser({
        ...user!,
        name,
        age: parseInt(age),
        gender,
        mazhab
      });
    }

    // 2. Simpan Pengaturan Pengingat
    updateReminderSettings({
      sholatReminder,
      sahurReminder,
      sahurTime,
      tilawahReminder,
      tilawahTime,
      emailNotification,
      email: emailNotification ? email : undefined,
    });

    toast.success('Semua perubahan berhasil disimpan!');
  };

  return (
    <div className="min-h-screen pb-20 p-4 lg:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-1"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <SettingsIcon className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
            <p className="text-muted-foreground">
              Kelola profil dan preferensi ibadah Anda
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6">
        
        {/* Profile Information Card */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-[2rem] border border-border/50 shadow-sm p-6 md:p-8 space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <UserIcon className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">Informasi Profil</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold">Nama Lengkap</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama Anda"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-semibold">Umur</Label>
              <Input 
                id="age" 
                type="number"
                value={age} 
                onChange={(e) => setAge(e.target.value)}
                placeholder="Contoh: 21"
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Jenis Kelamin</Label>
              <div className="flex gap-2">
                {['Laki-Laki', 'Perempuan'].map((g) => (
                  <Button
                    key={g}
                    variant={gender === g ? 'default' : 'outline'}
                    onClick={() => setGender(g as any)}
                    className="flex-1 rounded-xl h-11"
                  >
                    {g}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" /> Mazhab / Afiliasi
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {['NU', 'Muhammadiyah', 'Syafi\'i', 'Umum'].map((m) => (
                  <Button
                    key={m}
                    size="sm"
                    variant={mazhab === m ? 'secondary' : 'outline'}
                    onClick={() => setMazhab(m)}
                    className={`rounded-xl h-10 text-xs font-bold ${mazhab === m ? 'bg-secondary text-secondary-foreground border-secondary' : ''}`}
                  >
                    {m}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Reminder Settings Card */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-[2rem] border border-border/50 shadow-sm p-6 md:p-8 space-y-8"
        >
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">Pengingat Ibadah</h3>
          </div>

          <div className="space-y-8">
            {/* Sholat Reminder */}
            <div className="group">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-0.5">
                  <Label htmlFor="sholatReminder" className="text-base font-semibold">Waktu Sholat</Label>
                  <p className="text-sm text-muted-foreground">Dapatkan notifikasi saat masuk waktu adzan</p>
                </div>
                <Switch
                  id="sholatReminder"
                  checked={sholatReminder}
                  onCheckedChange={setSholatReminder}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
              
              <AnimatePresence>
                {sholatReminder && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 rounded-2xl bg-accent/5 border border-accent/20">
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                        {['Subuh', 'Zuhur', 'Asar', 'Magrib', 'Isya'].map((label, index) => (
                          <div key={label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-background border border-border/50 shadow-sm">
                            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{label}</span>
                            <span className="text-sm font-bold text-primary">{reminderSettings.sholatTimes[index]}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-start gap-2 text-xs text-muted-foreground bg-white/50 p-3 rounded-lg">
                        <Info className="w-4 h-4 text-amber-500 shrink-0" />
                        <p>Waktu sholat otomatis disesuaikan berdasarkan koordinat lokasi Anda saat ini.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sahur Reminder */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sahurReminder" className="text-base font-semibold">Pengingat Sahur</Label>
                  <p className="text-sm text-muted-foreground">Aktifkan alarm sebelum waktu Imsak tiba</p>
                </div>
                <Switch id="sahurReminder" checked={sahurReminder} onCheckedChange={setSahurReminder} />
              </div>
              
              {sahurReminder && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 pl-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <Label className="text-xs text-muted-foreground">Setel Waktu (Menit sebelum Imsak)</Label>
                    <Input
                      type="time"
                      value={sahurTime}
                      onChange={(e) => setSahurTime(e.target.value)}
                      className="rounded-xl w-full max-w-[160px] focus-visible:ring-primary shadow-inner"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Tilawah Reminder */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="tilawahReminder" className="text-base font-semibold">Target Tilawah</Label>
                  <p className="text-sm text-muted-foreground">Bangun kebiasaan membaca Al-Qur'an setiap hari</p>
                </div>
                <Switch id="tilawahReminder" checked={tilawahReminder} onCheckedChange={setTilawahReminder} />
              </div>
              
              {tilawahReminder && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 pl-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <Label className="text-xs text-muted-foreground">Waktu Pengingat Harian</Label>
                    <Input
                      type="time"
                      value={tilawahTime}
                      onChange={(e) => setTilawahTime(e.target.value)}
                      className="rounded-xl w-full max-w-[160px] focus-visible:ring-primary shadow-inner"
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.section>

        {/* Email Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-[2rem] border border-border/50 shadow-sm p-6 md:p-8 space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <Mail className="w-5 h-5 text-secondary-foreground" />
            <h3 className="font-bold text-lg">Laporan Mingguan</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailNotification" className="text-base font-semibold text-secondary-foreground">Laporan via Email</Label>
                <p className="text-sm text-muted-foreground">Dapatkan ringkasan progress ibadah mingguan</p>
              </div>
              <Switch
                id="emailNotification"
                checked={emailNotification}
                onCheckedChange={setEmailNotification}
                className="data-[state=checked]:bg-secondary"
              />
            </div>

            {emailNotification && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium pl-1">Email Penerima</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl h-11 border-border/60 focus-visible:ring-secondary shadow-sm"
                />
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Status & Privacy Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl bg-primary/5 border border-primary/10 flex gap-3">
            <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <p className="font-bold text-primary mb-1 uppercase tracking-tight">Status Pengingat</p>
              <p className="text-muted-foreground/80">
                {sholatReminder || sahurReminder || tilawahReminder
                  ? 'Pengingat aktif berjalan di background browser Anda.'
                  : 'Aktifkan pengingat untuk mendukung disiplin ibadah harian.'}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 flex gap-3">
            <ShieldCheck className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <p className="font-bold text-slate-700 mb-1 uppercase tracking-tight">Privasi Data</p>
              <p className="text-muted-foreground/80">
                Semua preferensi disimpan secara lokal di perangkat Anda (Local Storage).
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="pt-4"
        >
          <Button
            onClick={handleSave}
            className="w-full rounded-2xl h-14 text-lg font-bold shadow-lg shadow-primary/20 gradient-primary transition-all duration-300"
          >
            <Save className="w-5 h-5 mr-3" />
            Simpan Perubahan
          </Button>
        </motion.div>
      </div>
    </div>
  );
}