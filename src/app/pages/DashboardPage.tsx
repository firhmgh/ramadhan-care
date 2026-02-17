import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { ProgressRing, AnimatedCounter } from '../components/ProgressIndicators';
import { Switch } from '../components/ui/switch';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { CameraCapture } from '../components/CameraCapture';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Star,
  ChevronDown,
  Camera,
  BookOpen,
  TrendingUp,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../components/ui/utils';

const sholatWajibList = [
  { name: 'subuh', label: 'Subuh', icon: Sunrise, time: '04:45' },
  { name: 'zuhur', label: 'Zuhur', icon: Sun, time: '12:00' },
  { name: 'asar', label: 'Asar', icon: Sun, time: '15:15' },
  { name: 'magrib', label: 'Magrib', icon: Sunset, time: '18:00' },
  { name: 'isya', label: 'Isya', icon: Moon, time: '19:15' },
  { name: 'jumat', label: 'Jumat', icon: Star, time: '12:00', maleOnly: true },
];

const sholatSunnahList = [
  { name: 'dhuha', label: 'Dhuha', defaultRakaat: 4 },
  { name: 'tarawih', label: 'Tarawih', defaultRakaat: 8 },
  { name: 'tahajud', label: 'Tahajud', defaultRakaat: 8 },
  { name: 'witir', label: 'Witir', defaultRakaat: 3 },
];

const alasanOptions = [
  'Haid',
  'Sakit',
  'Bepergian',
  'Tidur/Lupa',
  'Lainnya',
];

export default function DashboardPage() {
  const { user, getTodaySholatRecords, addSholatRecord, updateSholatRecord, getTodayPuasa, addPuasaRecord, updatePuasaRecord, getTodayTilawah, addTilawahRecord } = useStore();
  
  const [sholatRecords, setSholatRecords] = useState(getTodaySholatRecords());
  const [expandedAlasan, setExpandedAlasan] = useState<string | null>(null);
  const [expandedSunnah, setExpandedSunnah] = useState<string[]>([]);
  
  // Puasa & Sahur
  const [puasaRecord, setPuasaRecord] = useState(getTodayPuasa());
  const [sahurTime, setSahurTime] = useState('04:00');
  const [showCamera, setShowCamera] = useState(false);
  
  // Tilawah
  const [surah, setSurah] = useState('');
  const [halaman, setHalaman] = useState('');
  const [tilawahTarget, setTilawahTarget] = useState(10);

  const today = new Date().toISOString().split('T')[0];
  const isFriday = new Date().getDay() === 5;

  // Initialize sholat records
  useEffect(() => {
    const existingRecords = getTodaySholatRecords();
    if (existingRecords.length === 0) {
      // Initialize wajib prayers
      sholatWajibList.forEach((sholat) => {
        if (!sholat.maleOnly || user?.gender === 'Laki-Laki') {
          addSholatRecord({
            date: today,
            type: 'wajib',
            name: sholat.name as any,
            completed: false,
          });
        }
      });
    }
    setSholatRecords(getTodaySholatRecords());
  }, []);

  const toggleSholat = (id: string, name: string, completed: boolean) => {
    // If it's Jumat being checked, auto-disable Zuhur
    if (name === 'jumat' && completed) {
      const zuhurRecord = sholatRecords.find(r => r.name === 'zuhur');
      if (zuhurRecord) {
        updateSholatRecord(zuhurRecord.id, { completed: false, alasan: 'Auto-disabled (Jumat aktif)' });
      }
      toast.success('Sholat Jumat tercatat, Zuhur otomatis dinonaktifkan');
    }
    
    // If it's Zuhur being checked and Jumat is active on Friday
    if (name === 'zuhur' && completed && isFriday) {
      const jumatRecord = sholatRecords.find(r => r.name === 'jumat');
      if (jumatRecord?.completed) {
        toast.error('Tidak dapat mencentang Zuhur karena Jumat sudah dicatat');
        return;
      }
    }

    updateSholatRecord(id, { completed });
    setSholatRecords(getTodaySholatRecords());
    
    if (completed) {
      toast.success(`Alhamdulillah, sholat ${name} tercatat!`);
    }
  };

  const setAlasan = (id: string, alasan: string) => {
    updateSholatRecord(id, { alasan, completed: false });
    setSholatRecords(getTodaySholatRecords());
    setExpandedAlasan(null);
    toast.info(`Alasan tercatat: ${alasan}`);
  };

  const toggleSunnah = (name: string) => {
    if (expandedSunnah.includes(name)) {
      setExpandedSunnah(expandedSunnah.filter(n => n !== name));
    } else {
      setExpandedSunnah([...expandedSunnah, name]);
    }
  };

  const saveSunnah = (name: string, rakaat: number) => {
    addSholatRecord({
      date: today,
      type: 'sunnah',
      name: name as any,
      completed: true,
      rakaat,
    });
    setSholatRecords(getTodaySholatRecords());
    toast.success(`Sholat ${name} ${rakaat} rakaat tercatat!`);
  };

  const togglePuasa = () => {
    if (puasaRecord) {
      updatePuasaRecord(puasaRecord.id, { completed: !puasaRecord.completed });
      setPuasaRecord(getTodayPuasa());
    } else {
      addPuasaRecord({ date: today, completed: true });
      setPuasaRecord(getTodayPuasa());
    }
    toast.success(puasaRecord?.completed ? 'Puasa dibatalkan' : 'Puasa tercatat!');
  };

  const saveSahur = (photoUrl: string) => {
    if (puasaRecord) {
      updatePuasaRecord(puasaRecord.id, { 
        sahurTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':'), 
        sahurPhoto: photoUrl 
      });
    } else {
      addPuasaRecord({ 
        date: today, 
        completed: true, 
        sahurTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':'), 
        sahurPhoto: photoUrl 
      });
    }
    setPuasaRecord(getTodayPuasa());
    setShowCamera(false);
    toast.success('Foto sahur estetik berhasil disimpan! 📸');
  };

  const saveTilawah = () => {
    if (!surah && !halaman) {
      toast.error('Isi minimal surah atau halaman');
      return;
    }
    addTilawahRecord({
      date: today,
      surah: surah || undefined,
      halaman: halaman ? parseInt(halaman) : undefined,
    });
    setSurah('');
    setHalaman('');
    toast.success('Tilawah tercatat!');
  };

  // Calculate progress
  const wajibRecords = sholatRecords.filter(r => r.type === 'wajib');
  const completedWajib = wajibRecords.filter(r => r.completed).length;
  const totalWajib = wajibRecords.length;
  const progressPercent = totalWajib > 0 ? (completedWajib / totalWajib) * 100 : 0;

  const sunnahRecords = sholatRecords.filter(r => r.type === 'sunnah');
  const tilawahRecords = getTodayTilawah();

  return (
    <div className="min-h-full p-4 lg:p-8 space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold">
          Assalamu'alaikum, {user?.name}! 👋
        </h1>
        <p className="text-muted-foreground">
          Semoga hari Anda penuh berkah
        </p>
      </motion.div>

      {/* Daily Summary Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl gradient-spiritual p-8 shadow-soft-lg"
      >
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <ProgressRing progress={progressPercent} size={140} strokeWidth={10} />
          
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-2xl font-bold mb-2">Progress Ibadah Hari Ini</h2>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/30 backdrop-blur-sm">
                <Star className="w-5 h-5 text-gold" />
                <span className="font-semibold">
                  <AnimatedCounter value={completedWajib} /> / {totalWajib} Wajib
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/30 backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-accent-foreground" />
                <span className="font-semibold">
                  <AnimatedCounter value={sunnahRecords.length} /> Sunnah
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/30 backdrop-blur-sm">
                <BookOpen className="w-5 h-5 text-secondary-foreground" />
                <span className="font-semibold">
                  <AnimatedCounter value={tilawahRecords.length} /> Tilawah
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sholat Wajib Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-3xl shadow-soft-md p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Sholat Wajib</h3>
          <TrendingUp className="w-5 h-5 text-success" />
        </div>

        <div className="space-y-3">
          {sholatWajibList.map((sholat) => {
            if (sholat.maleOnly && user?.gender !== 'Laki-Laki') return null;
            
            const record = sholatRecords.find(r => r.name === sholat.name);
            if (!record) return null;

            const Icon = sholat.icon;
            const isJumatActive = isFriday && sholatRecords.find(r => r.name === 'jumat')?.completed;
            const isDisabled = sholat.name === 'zuhur' && isJumatActive;

            return (
              <div key={sholat.name} className="space-y-2">
                <div
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200",
                    record.completed
                      ? "bg-success/10 border-success"
                      : record.alasan
                      ? "bg-warning/10 border-warning"
                      : "bg-accent/20 border-transparent hover:border-accent",
                    isDisabled && "opacity-50"
                  )}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      record.completed ? "bg-success/20" : "bg-primary/10"
                    )}>
                      <Icon className={cn(
                        "w-6 h-6",
                        record.completed ? "text-success" : "text-primary"
                      )} />
                    </div>
                    <div>
                      <p className="font-semibold">{sholat.label}</p>
                      <p className="text-sm text-muted-foreground">{sholat.time}</p>
                      {record.alasan && (
                        <p className="text-xs text-warning-foreground mt-1">
                          {record.alasan}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {user?.gender === 'Perempuan' && !isDisabled && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedAlasan(expandedAlasan === sholat.name ? null : sholat.name)}
                        className="rounded-xl"
                      >
                        <ChevronDown className={cn(
                          "w-4 h-4 transition-transform",
                          expandedAlasan === sholat.name && "rotate-180"
                        )} />
                      </Button>
                    )}
                    <Switch
                      checked={record.completed}
                      onCheckedChange={(checked) => toggleSholat(record.id, sholat.name, checked)}
                      disabled={isDisabled}
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {expandedAlasan === sholat.name && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-4 space-y-2"
                    >
                      <p className="text-sm text-muted-foreground">Alasan:</p>
                      <div className="flex flex-wrap gap-2">
                        {alasanOptions.map((alasan) => (
                          <Button
                            key={alasan}
                            variant="outline"
                            size="sm"
                            onClick={() => setAlasan(record.id, alasan)}
                            className="rounded-xl"
                          >
                            {alasan}
                          </Button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Sholat Sunnah Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-3xl shadow-soft-md p-6 space-y-4"
      >
        <h3 className="text-xl font-semibold">Sholat Sunnah</h3>

        <Accordion type="multiple" className="space-y-3">
          {sholatSunnahList.map((sholat) => {
            const record = sunnahRecords.find(r => r.name === sholat.name);
            
            return (
              <AccordionItem
                key={sholat.name}
                value={sholat.name}
                className="border-2 border-transparent rounded-2xl overflow-hidden"
              >
                <AccordionTrigger className={cn(
                  "px-4 py-3 hover:no-underline rounded-2xl",
                  record ? "bg-accent/30" : "bg-accent/10 hover:bg-accent/20"
                )}>
                  <div className="flex items-center gap-3">
                    <Star className={cn(
                      "w-5 h-5",
                      record ? "text-accent-foreground" : "text-muted-foreground"
                    )} />
                    <span className="font-medium">{sholat.label}</span>
                    {record && (
                      <span className="text-xs text-accent-foreground">
                        ✓ {record.rakaat} rakaat
                      </span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2">
                  <SunnahRakaatSelector
                    defaultRakaat={sholat.defaultRakaat}
                    onSave={(rakaat) => saveSunnah(sholat.name, rakaat)}
                  />
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </motion.div>

      {/* Puasa & Sahur Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-3xl shadow-soft-md p-6 space-y-4"
      >
        <h3 className="text-xl font-semibold">Puasa & Sahur</h3>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/20">
          <div>
            <p className="font-semibold">Puasa Hari Ini</p>
            <p className="text-sm text-muted-foreground">Ramadhan 1446 H</p>
          </div>
          <Switch
            checked={puasaRecord?.completed || false}
            onCheckedChange={togglePuasa}
          />
        </div>

        {puasaRecord?.completed && (
  <div className="space-y-4">
    {/* Input Waktu Sahur */}
    <div className="space-y-2">
      <Label htmlFor="sahurTime" className="text-sm font-medium ml-1">
        Waktu Sahur
      </Label>
      <Input
        id="sahurTime"
        type="time"
        value={sahurTime}
        onChange={(e) => setSahurTime(e.target.value)}
        className="rounded-2xl h-12 bg-accent/20 border-none focus-visible:ring-primary/30"
      />
    </div>

    {/* Tombol Ambil Foto (Hanya muncul jika belum ada foto dan kamera tidak aktif) */}
    {!showCamera && !puasaRecord.sahurPhoto && (
      <Button
        onClick={() => setShowCamera(true)}
        variant="outline"
        className="w-full h-14 rounded-2xl border-dashed border-2 hover:bg-primary/5 hover:border-primary/50 transition-all"
      >
        <Camera className="w-5 h-5 mr-2 text-primary" />
        Ambil Foto Sahur
      </Button>
    )}

    {/* Komponen Kamera */}
    {showCamera && (
      <div className="mt-2">
        <CameraCapture
          onCapture={saveSahur}
          onCancel={() => setShowCamera(false)}
        />
      </div>
    )}

    {/* Hasil Foto (UI Friendly & Responsif) */}
    {puasaRecord.sahurPhoto && !showCamera && (
      <div className="relative group mx-auto max-w-[280px] mt-4 shadow-2xl rounded-[2rem] overflow-hidden border-4 border-white dark:border-slate-800 transition-transform hover:scale-[1.02]">
        <img
          src={puasaRecord.sahurPhoto}
          alt="Sahur"
          className="w-full aspect-[3/4] object-cover"
        />
        
        {/* Overlay Hover untuk Ganti Foto */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => setShowCamera(true)}
            className="rounded-xl shadow-xl font-bold bg-white text-black hover:bg-white/90"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Ganti Foto
          </Button>
        </div>

        {/* Badge Waktu di Pojok Foto sebagai info tambahan */}
        <div className="absolute bottom-4 left-4 right-4 text-center">
            <div className="inline-block px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest border border-white/20">
              Tercatat: {sahurTime}
            </div>
        </div>
      </div>
    )}
  </div>
)}
      </motion.div>

      {/* Tilawah Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card rounded-3xl shadow-soft-md p-6 space-y-4"
      >
        <h3 className="text-xl font-semibold">Tilawah Al-Qur'an</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="surah">Surah</Label>
              <Input
                id="surah"
                placeholder="Contoh: Al-Baqarah"
                value={surah}
                onChange={(e) => setSurah(e.target.value)}
                className="rounded-2xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="halaman">Halaman</Label>
              <Input
                id="halaman"
                type="number"
                placeholder="1-604"
                value={halaman}
                onChange={(e) => setHalaman(e.target.value)}
                className="rounded-2xl"
              />
            </div>
          </div>

          <Button onClick={saveTilawah} className="w-full rounded-2xl">
            <BookOpen className="w-4 h-4 mr-2" />
            Catat Tilawah
          </Button>

          {/* Progress */}
          <div className="p-4 rounded-2xl bg-accent/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress Hari Ini</span>
              <span className="text-sm text-muted-foreground">
                {tilawahRecords.length} / {tilawahTarget} halaman
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full gradient-accent"
                initial={{ width: 0 }}
                animate={{ width: `${(tilawahRecords.length / tilawahTarget) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Sunnah Rakaat Selector Component
function SunnahRakaatSelector({ defaultRakaat, onSave }: { defaultRakaat: number; onSave: (rakaat: number) => void }) {
  const [rakaat, setRakaat] = useState(defaultRakaat);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label>Jumlah Rakaat:</Label>
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setRakaat(Math.max(2, rakaat - 2))}
            className="w-8 h-8 rounded-lg"
          >
            -
          </Button>
          <span className="w-12 text-center font-semibold">{rakaat}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setRakaat(rakaat + 2)}
            className="w-8 h-8 rounded-lg"
          >
            +
          </Button>
        </div>
      </div>
      <Button
        onClick={() => onSave(rakaat)}
        size="sm"
        className="w-full rounded-xl"
      >
        Simpan
      </Button>
    </div>
  );
}
