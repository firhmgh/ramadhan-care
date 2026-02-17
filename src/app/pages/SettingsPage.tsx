import { useStore } from '../store/useStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Settings as SettingsIcon, Bell, Mail, Clock, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function SettingsPage() {
  const { reminderSettings, updateReminderSettings } = useStore();
  
  const [sholatReminder, setSholatReminder] = useState(reminderSettings.sholatReminder);
  const [sahurReminder, setSahurReminder] = useState(reminderSettings.sahurReminder);
  const [sahurTime, setSahurTime] = useState(reminderSettings.sahurTime);
  const [tilawahReminder, setTilawahReminder] = useState(reminderSettings.tilawahReminder);
  const [tilawahTime, setTilawahTime] = useState(reminderSettings.tilawahTime);
  const [emailNotification, setEmailNotification] = useState(reminderSettings.emailNotification);
  const [email, setEmail] = useState(reminderSettings.email || '');

  const handleSave = () => {
    updateReminderSettings({
      sholatReminder,
      sahurReminder,
      sahurTime,
      tilawahReminder,
      tilawahTime,
      emailNotification,
      email: emailNotification ? email : undefined,
    });
    toast.success('Pengaturan berhasil disimpan!');
  };

  return (
    <div className="min-h-full p-4 lg:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center">
            <SettingsIcon className="w-6 h-6 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Pengaturan</h1>
            <p className="text-sm text-muted-foreground">
              Kelola notifikasi dan preferensi
            </p>
          </div>
        </div>
      </motion.div>

      {/* Reminder Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-3xl shadow-soft-md p-6 space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Pengingat Notifikasi</h3>
            <p className="text-sm text-muted-foreground">
              Atur pengingat untuk ibadah Anda
            </p>
          </div>
        </div>

        <div className="space-y-6 pt-4">
          {/* Sholat Reminder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sholatReminder">Pengingat Sholat</Label>
                <p className="text-xs text-muted-foreground">
                  Notifikasi saat waktu sholat tiba
                </p>
              </div>
              <Switch
                id="sholatReminder"
                checked={sholatReminder}
                onCheckedChange={setSholatReminder}
              />
            </div>
            
            {sholatReminder && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pl-4 space-y-2"
              >
                <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20">
                  <p className="text-sm mb-2 font-medium">Waktu Sholat:</p>
                  <div className="grid grid-cols-5 gap-2 text-xs">
                    {reminderSettings.sholatTimes.map((time, index) => (
                      <div key={index} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white">
                        <span className="font-semibold">{['Subuh', 'Zuhur', 'Asar', 'Magrib', 'Isya'][index]}</span>
                        <span className="text-muted-foreground">{time}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    💡 Waktu sholat otomatis disesuaikan dengan lokasi Anda
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sahur Reminder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sahurReminder">Pengingat Sahur</Label>
                <p className="text-xs text-muted-foreground">
                  Notifikasi sebelum waktu imsak
                </p>
              </div>
              <Switch
                id="sahurReminder"
                checked={sahurReminder}
                onCheckedChange={setSahurReminder}
              />
            </div>
            
            {sahurReminder && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pl-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="sahurTime">Waktu Pengingat</Label>
                  <Input
                    id="sahurTime"
                    type="time"
                    value={sahurTime}
                    onChange={(e) => setSahurTime(e.target.value)}
                    className="rounded-2xl max-w-xs"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Tilawah Reminder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="tilawahReminder">Pengingat Tilawah</Label>
                <p className="text-xs text-muted-foreground">
                  Notifikasi untuk membaca Al-Qur'an
                </p>
              </div>
              <Switch
                id="tilawahReminder"
                checked={tilawahReminder}
                onCheckedChange={setTilawahReminder}
              />
            </div>
            
            {tilawahReminder && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pl-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="tilawahTime">Waktu Pengingat</Label>
                  <Input
                    id="tilawahTime"
                    type="time"
                    value={tilawahTime}
                    onChange={(e) => setTilawahTime(e.target.value)}
                    className="rounded-2xl max-w-xs"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Email Notification */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-3xl shadow-soft-md p-6 space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-secondary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">Notifikasi Email</h3>
            <p className="text-sm text-muted-foreground">
              Terima ringkasan ibadah via email
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailNotification">Aktifkan Email</Label>
              <p className="text-xs text-muted-foreground">
                Laporan mingguan akan dikirim ke email
              </p>
            </div>
            <Switch
              id="emailNotification"
              checked={emailNotification}
              onCheckedChange={setEmailNotification}
            />
          </div>

          {emailNotification && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              <Label htmlFor="email">Alamat Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-2xl"
              />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-accent/20 rounded-3xl p-6 border-2 border-accent"
      >
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-accent-foreground mb-1">Status Pengingat</p>
            <p className="text-muted-foreground">
              {sholatReminder || sahurReminder || tilawahReminder
                ? 'Pengingat aktif. Pastikan notifikasi browser diizinkan untuk pengalaman terbaik.'
                : 'Tidak ada pengingat aktif. Aktifkan untuk membantu rutinitas ibadah Anda.'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          onClick={handleSave}
          className="w-full rounded-2xl h-12 gradient-primary"
        >
          <Save className="w-5 h-5 mr-2" />
          Simpan Pengaturan
        </Button>
      </motion.div>

      {/* Privacy Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-card rounded-3xl shadow-soft-md p-6"
      >
        <h4 className="font-semibold mb-3">🔒 Privasi & Keamanan</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Data Anda disimpan secara lokal di perangkat</li>
          <li>• Notifikasi hanya untuk pengingat, tidak ada data yang dikirim</li>
          <li>• Email hanya digunakan untuk laporan, tidak untuk promosi</li>
          <li>• Anda dapat menghapus semua data kapan saja</li>
        </ul>
      </motion.div>
    </div>
  );
}
