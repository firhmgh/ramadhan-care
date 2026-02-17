import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { ProgressRing, AnimatedCounter } from '../components/ProgressIndicators';
import { Switch } from '../components/ui/switch';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { CameraCapture } from '../components/CameraCapture';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Clock,
  Sunset,
  Moon,
  Star,
  ChevronDown,
  Camera,
  BookOpen,
  TrendingUp,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../components/ui/utils';

const sholatWajibList = [
  { name: 'subuh', label: 'Subuh', icon: Clock, time: '04:45' },
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
  const {
    user,
    getTodaySholatRecords,
    addSholatRecord,
    updateSholatRecord,
    getTodayPuasa,
    addPuasaRecord,
    updatePuasaRecord,
    getTodayTilawah,
    addTilawahRecord,
  } = useStore();

  const [sholatRecords, setSholatRecords] = useState(getTodaySholatRecords());
  const [expandedAlasan, setExpandedAlasan] = useState<string | null>(null);
  const [expandedSunnah, setExpandedSunnah] = useState<string[]>([]);

  // Puasa & Sahur
  const [puasaRecord, setPuasaRecord] = useState(getTodayPuasa());
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [sahurTime, setSahurTime] = useState<string>('');
  const [showCamera, setShowCamera] = useState(false);

  // Tilawah
  const [surah, setSurah] = useState('');
  const [halaman, setHalaman] = useState('');
  const [tilawahTarget] = useState(10);

  const today = new Date().toISOString().split('T')[0];
  const isFriday = new Date().getDay() === 5;

  useEffect(() => {
    const existingRecords = getTodaySholatRecords();
    if (existingRecords.length === 0) {
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

  // FUNGSI TOGGLE YANG SUDAH DIINTEGRASIKAN
  const toggleSholat = (id: string, name: string, completed: boolean) => {
    if (name === 'jumat' && completed) {
      const zuhurRecord = sholatRecords.find((r) => r.name === 'zuhur');
      if (zuhurRecord) {
        updateSholatRecord(zuhurRecord.id, {
          completed: false,
          alasan: 'Auto-disabled (Jumat aktif)',
        });
      }
      toast.success('Sholat Jumat tercatat, Zuhur otomatis dinonaktifkan');
    }

    if (name === 'zuhur' && completed && isFriday) {
      const jumatRecord = sholatRecords.find((r) => r.name === 'jumat');
      if (jumatRecord?.completed) {
        toast.error('Tidak dapat mencentang Zuhur karena Jumat sudah dicatat');
        return;
      }
    }

    // Integrasi: Jika diaktifkan (completed: true), hapus alasan (alasan: undefined/null)
    updateSholatRecord(id, { 
      completed, 
      alasan: completed ? undefined : undefined 
    });
    
    setSholatRecords(getTodaySholatRecords());

    if (completed) {
      setExpandedAlasan(null); // Tutup panel alasan jika sedang terbuka
      toast.success(`Alhamdulillah, sholat ${name} tercatat!`);
    }
  };

  const setAlasan = (id: string, alasan: string) => {
    // Jika memberikan alasan, maka status completed otomatis false
    updateSholatRecord(id, { alasan, completed: false });
    setSholatRecords(getTodaySholatRecords());
    setExpandedAlasan(null);
    toast.info(`Alasan tercatat: ${alasan}`);
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

  const handlePuasaYa = () => {
    if (puasaRecord) {
      updatePuasaRecord(puasaRecord.id, { completed: true, alasan: undefined });
    } else {
      addPuasaRecord({ date: today, completed: true });
    }
    setPuasaRecord(getTodayPuasa());
    toast.success('Alhamdulillah, selamat berpuasa! 💪');
  };

  const handlePuasaTidak = () => {
    setShowReasonModal(true);
  };

  const handleReasonSubmit = () => {
    if (!selectedReason) {
      toast.error('Pilih alasan terlebih dahulu');
      return;
    }
    if (puasaRecord) {
      updatePuasaRecord(puasaRecord.id, { completed: false, alasan: selectedReason });
    } else {
      addPuasaRecord({ date: today, completed: false, alasan: selectedReason });
    }
    setPuasaRecord(getTodayPuasa());
    setShowReasonModal(false);
    toast.info(`Alasan dicatat: ${selectedReason}`);
  };

  useEffect(() => {
    if (puasaRecord?.sahurTime) {
      setSahurTime(puasaRecord.sahurTime);
    } else {
      setSahurTime('04:00');
    }
  }, [puasaRecord]);

  const saveSahur = (photoUrl: string) => {
    const now = new Date();
    const timeNow = now.getHours().toString().padStart(2, '0') + ':' + 
                    now.getMinutes().toString().padStart(2, '0');

    if (puasaRecord) {
      updatePuasaRecord(puasaRecord.id, {
        sahurTime: timeNow,
        sahurPhoto: photoUrl,
      });
    } else {
      addPuasaRecord({
        date: today,
        completed: true,
        sahurTime: timeNow,
        sahurPhoto: photoUrl,
      });
    }

    setSahurTime(timeNow);
    setPuasaRecord(getTodayPuasa());
    setShowCamera(false);
    toast.success('Foto sahur berhasil disimpan! 📸');
  };

  const handleSahurTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setSahurTime(newTime);
    if (puasaRecord) {
      updatePuasaRecord(puasaRecord.id, { sahurTime: newTime });
      setPuasaRecord(getTodayPuasa());
    }
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

  const wajibRecords = sholatRecords.filter((r) => r.type === 'wajib');
  const completedWajib = wajibRecords.filter((r) => r.completed).length;
  const totalWajib = wajibRecords.length;
  const progressPercent = totalWajib > 0 ? (completedWajib / totalWajib) * 100 : 0;

  const sunnahRecords = sholatRecords.filter((r) => r.type === 'sunnah');
  const tilawahRecords = getTodayTilawah();

  return (
    <div className="min-h-full p-4 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-3xl font-bold">Assalamu'alaikum, {user?.name}! 👋</h1>
        <p className="text-muted-foreground">Semoga hari Anda penuh berkah</p>
      </motion.div>

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
                      {/* Alasan hanya muncul jika tidak sedang completed (sesuai permintaan) */}
                      {!record.completed && record.alasan && (
                        <p className="text-xs text-warning-foreground mt-1">
                          {record.alasan}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Tombol Alasan hanya muncul jika sholat BELUM aktif/dicentang */}
                    {user?.gender === 'Perempuan' && !isDisabled && !record.completed && (
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
                  {/* Panel pemilihan alasan hanya muncul jika belum sholat */}
                  {expandedAlasan === sholat.name && !record.completed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-4 space-y-2"
                    >
                      <p className="text-sm text-muted-foreground">Pilih Alasan Tidak Sholat:</p>
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

      {/* Bagian Sholat Sunnah, Puasa, dan Tilawah tetap sama */}
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
                    <Star className={cn("w-5 h-5", record ? "text-accent-foreground" : "text-muted-foreground")} />
                    <span className="font-medium">{sholat.label}</span>
                    {record && <span className="text-xs text-accent-foreground">✓ {record.rakaat} rakaat</span>}
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

      <motion.div className="bg-card rounded-3xl shadow-soft-md p-6 space-y-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Moon className="w-5 h-5 text-indigo-400" /> Puasa & Sahur
        </h3>
        <div className={cn("rounded-2xl p-6 border text-center", puasaRecord?.completed ? "bg-emerald-50 border-emerald-100" : "bg-accent/10 border-transparent")}>
          <p className="font-medium mb-4">Apakah Anda berpuasa hari ini?</p>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={handlePuasaYa} variant="outline" className={cn("h-12 rounded-xl", puasaRecord?.completed && "border-emerald-500 bg-emerald-50 text-emerald-700")}>
              <CheckCircle2 className="mr-2 w-4 h-4" /> Ya, Puasa
            </Button>
            <Button onClick={handlePuasaTidak} variant="outline" className={cn("h-12 rounded-xl", puasaRecord?.completed === false && "border-rose-500 bg-rose-50 text-rose-700")}>
              <XCircle className="mr-2 w-4 h-4" /> Tidak Puasa
            </Button>
          </div>
        </div>

        {puasaRecord?.completed && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium ml-1">Waktu Sahur</Label>
              <div className="relative">
                <Input
                  type="time"
                  value={sahurTime}
                  onChange={handleSahurTimeChange}
                  className="rounded-2xl h-12 bg-accent/20 border-none pl-10 focus-visible:ring-0"
                />
                <Clock className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
              </div>
            </div>
            {!showCamera && !puasaRecord.sahurPhoto && (
              <Button onClick={() => setShowCamera(true)} variant="outline" className="w-full h-14 rounded-2xl border-dashed border-2">
                <Camera className="w-5 h-5 mr-2 text-primary" /> Ambil Foto Sahur & Catat Waktu
              </Button>
            )}
            {showCamera && <CameraCapture onCapture={saveSahur} onCancel={() => setShowCamera(false)} />}
            {puasaRecord.sahurPhoto && !showCamera && (
              <div className="space-y-3">
                <div className="relative mx-auto max-w-[280px] shadow-xl rounded-[2.5rem] overflow-hidden border-4 border-white">
                  <img src={puasaRecord.sahurPhoto} alt="Sahur" className="w-full aspect-[3/4] object-cover" />
                </div>
                <Button variant="outline" onClick={() => setShowCamera(true)} className="w-full h-12 rounded-2xl border-primary/30 text-primary hover:bg-primary/5 font-semibold">
                  <RefreshCw className="w-4 h-4 mr-2" /> Ganti Foto
                </Button>
              </div>
            )}
          </div>
        )}
      </motion.div>

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
              <Input id="surah" placeholder="Contoh: Al-Baqarah" value={surah} onChange={(e) => setSurah(e.target.value)} className="rounded-2xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="halaman">Halaman</Label>
              <Input id="halaman" type="number" placeholder="1-604" value={halaman} onChange={(e) => setHalaman(e.target.value)} className="rounded-2xl" />
            </div>
          </div>
          <Button onClick={saveTilawah} className="w-full rounded-2xl">
            <BookOpen className="w-4 h-4 mr-2" /> Catat Tilawah
          </Button>
          <div className="p-4 rounded-2xl bg-accent/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress Hari Ini</span>
              <span className="text-sm text-muted-foreground">{tilawahRecords.length} / {tilawahTarget} halaman</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <motion.div className="h-full gradient-accent" initial={{ width: 0 }} animate={{ width: `${(tilawahRecords.length / tilawahTarget) * 100}%` }} transition={{ duration: 0.5 }} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal Alasan Puasa */}
      <AnimatePresence>
        {showReasonModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              className="bg-card rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl space-y-6"
            >
              <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-2 sm:hidden" />
              <h3 className="text-2xl font-black text-center">Pilih Alasan</h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  ...(user?.gender === 'Perempuan' ? [{ label: 'Haid (Menstruasi)', val: 'Haid' }] : []),
                  { label: 'Sedang Sakit', val: 'Sakit' },
                  { label: 'Perjalanan (Safar)', val: 'Safar' },
                  { label: 'Lupa / Tidak Niat', val: 'Lupa' },
                  { label: 'Lainnya', val: 'Lainnya' }
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setSelectedReason(item.val)}
                    className={cn(
                      "w-full p-4 rounded-2xl text-left font-semibold transition-all border-2",
                      selectedReason === item.val 
                        ? "border-primary bg-primary/10 text-primary" 
                        : "border-transparent bg-accent/20 hover:bg-accent/40"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              {selectedReason === 'Haid' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-blue-50 text-blue-700 rounded-2xl text-sm flex gap-3">
                  <Info size={20} className="shrink-0" />
                  <p>Haid adalah uzur syar'i. Tidak berdosa, namun wajib qadha (mengganti) di luar bulan Ramadhan.</p>
                </motion.div>
              )}
              <div className="flex gap-3 pt-2">
                <Button variant="ghost" onClick={() => setShowReasonModal(false)} className="flex-1 h-14 rounded-2xl">Batal</Button>
                <Button onClick={handleReasonSubmit} className="flex-1 h-14 rounded-2xl bg-primary shadow-lg">Simpan Alasan</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SunnahRakaatSelector({ defaultRakaat, onSave }: { defaultRakaat: number; onSave: (rakaat: number) => void }) {
  const [rakaat, setRakaat] = useState(defaultRakaat);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label>Jumlah Rakaat:</Label>
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" size="icon" onClick={() => setRakaat(Math.max(2, rakaat - 2))} className="w-8 h-8 rounded-lg">-</Button>
          <span className="w-12 text-center font-semibold">{rakaat}</span>
          <Button variant="outline" size="icon" onClick={() => setRakaat(rakaat + 2)} className="w-8 h-8 rounded-lg">+</Button>
        </div>
      </div>
      <Button onClick={() => onSave(rakaat)} size="sm" className="w-full rounded-xl">Simpan</Button>
    </div>
  );
}