import { useState, useEffect, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { ProgressRing } from '../components/ProgressIndicators';
import { Switch } from '../components/ui/switch';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
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
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../components/ui/utils';

// --- DATA CONSTANTS ---
const sholatWajibList = [
  { name: 'subuh', label: 'Subuh', icon: Clock },
  { name: 'zuhur', label: 'Zuhur', icon: Sun },
  { name: 'asar', label: 'Asar', icon: Sun },
  { name: 'magrib', label: 'Magrib', icon: Sunset },
  { name: 'isya', label: 'Isya', icon: Moon },
  { name: 'jumat', label: 'Jumat', icon: Star, maleOnly: true },
];

const sholatSunnahList = [
  { name: 'dhuha', label: 'Dhuha', defaultRakaat: 4 },
  { name: 'tarawih', label: 'Tarawih', defaultRakaat: 8 },
  { name: 'tahajud', label: 'Tahajud', defaultRakaat: 8 },
  { name: 'witir', label: 'Witir', defaultRakaat: 3 },
];

const alasanOptions = ['Haid', 'Sakit', 'Safar', 'Tidur/Lupa', 'Lainnya'];

export default function DashboardPage() {
  const {
    user,
    loading,
    sholatRecords,
    puasaRecords,
    tilawahRecords,
    prayerTimes, 
    fetchPrayerTimes,
    fetchUserData,
    addSholatRecord,
    updateSholatRecord,
    deleteSholatRecord,
    addPuasaRecord,
    updatePuasaRecord,
    addTilawahRecord,
  } = useStore();

  const [expandedAlasan, setExpandedAlasan] = useState<string | null>(null);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [sahurTime, setSahurTime] = useState<string>('04:00');
  const [showCamera, setShowCamera] = useState(false);

  // Tilawah UI
  const [surah, setSurah] = useState('');
  const [ayat, setAyat] = useState('');
  const [juz, setJuz] = useState('');
  const [tilawahTarget] = useState(10);

  const today = new Date().toISOString().split('T')[0];

  const todaySholatRecords = useMemo(() => sholatRecords.filter(r => r.date === today), [sholatRecords, today]);
  const todayPuasaRecord = useMemo(() => puasaRecords.find(r => r.date === today) || null, [puasaRecords, today]);
  const todayTilawahRecords = useMemo(() => tilawahRecords.filter(r => r.date === today), [tilawahRecords, today]);

  useEffect(() => {
  const interval = setInterval(() => {
    const nowString = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Jakarta' }).format(new Date());
    if (nowString !== today) {
      window.location.reload(); 
    }
  }, 60000);
  return () => clearInterval(interval);
}, [today]);

  useEffect(() => {
    if (user?.mazhab) {
      fetchPrayerTimes();
    }
  }, [user?.mazhab, fetchPrayerTimes]);

  useEffect(() => {
    if (loading || !user) return;
    const initSholatRecords = async () => {
      const hasWajibRecords = todaySholatRecords.some(r => r.type === 'wajib');
      if (!hasWajibRecords) {
        for (const sholat of sholatWajibList) {
          if (!sholat.maleOnly || user.gender === 'Laki-Laki') {
            await addSholatRecord({ date: today, type: 'wajib', name: sholat.name as any, completed: false });
          }
        }
      }
    };
    initSholatRecords();
  }, [loading, user, today, addSholatRecord, todaySholatRecords.length]);

  // Handlers Sholat
  const toggleSholat = async (id: string, name: string, completed: boolean) => {
    try {
      await updateSholatRecord(id, { completed, alasan: undefined });
      if (completed) {
        setExpandedAlasan(null);
        toast.success(`Alhamdulillah, sholat ${name} tercatat!`);
      }
    } catch (error) {
      toast.error("Gagal update data.");
    }
  };

  const saveSunnah = async (name: string, rakaat: number) => {
    const existing = todaySholatRecords.find(r => r.name === name && r.type === 'sunnah');
    try {
      if (existing) {
        await updateSholatRecord(existing.id, { rakaat, completed: rakaat > 0 });
        toast.success(`Data ${name} diperbarui!`);
      } else {
        await addSholatRecord({ date: today, type: 'sunnah', name: name as any, completed: rakaat > 0, rakaat });
        toast.success(`Sholat ${name} tercatat!`);
      }
    } catch (e) {
      toast.error("Gagal menyimpan sunnah.");
    }
  };

  // Handlers Puasa
  useEffect(() => {
    if (todayPuasaRecord?.sahurTime) setSahurTime(todayPuasaRecord.sahurTime);
  }, [todayPuasaRecord]);

  const handlePuasaYa = async () => {
    todayPuasaRecord 
      ? await updatePuasaRecord(todayPuasaRecord.id, { completed: true, alasan: undefined })
      : await addPuasaRecord({ date: today, completed: true });
    toast.success('Selamat berpuasa! 💪');
  };

  const handleReasonSubmit = async () => {
    todayPuasaRecord
      ? await updatePuasaRecord(todayPuasaRecord.id, { completed: false, alasan: selectedReason })
      : await addPuasaRecord({ date: today, completed: false, alasan: selectedReason });
    setShowReasonModal(false);
  };

  const saveSahur = async (photoUrl: string) => {
    const timeNow = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const payload = { sahurTime: timeNow, sahurPhoto: photoUrl, completed: true };
    
    if (todayPuasaRecord) {
        await updatePuasaRecord(todayPuasaRecord.id, payload);
    } else {
        await addPuasaRecord({ date: today, ...payload });
    }
    
    setSahurTime(timeNow);
    setShowCamera(false);
    toast.success('Foto sahur disimpan!');
  };

  const saveTilawah = async () => {
    if (!surah && !ayat) return toast.error('Isi surah dan ayat');
    await addTilawahRecord({
      date: today,
      surah,
      ayat: ayat as any,
      juz: juz ? parseInt(juz) : undefined
    });
    setSurah(''); setAyat(''); setJuz('');
    toast.success('Tilawah tercatat!');
  };

  const completedWajib = todaySholatRecords.filter(r => r.type === 'wajib' && r.completed).length;
  const totalWajib = todaySholatRecords.filter(r => r.type === 'wajib').length;
  const progressPercent = totalWajib > 0 ? (completedWajib / totalWajib) * 100 : 0;

  return (
    <div className="min-h-full p-4 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Assalamu'alaikum, {user?.name}! 👋</h1>
        <p className="text-muted-foreground">Beribadah dengan penuh makna sesuai Mazhab {user?.mazhab}.</p>
      </header>

      {/* Hero Progress */}
      <section className="rounded-3xl gradient-spiritual p-6 lg:p-8 shadow-soft-lg text-white">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <ProgressRing progress={progressPercent} size={130} strokeWidth={10} />
          <div className="flex-1 text-center lg:text-left space-y-4">
            <h2 className="text-2xl font-bold">Ibadah Hari Ini</h2>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-md border border-white/10">
                <Star className="w-4 h-4" /> <span className="text-sm font-bold">{completedWajib}/{totalWajib} Wajib</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-md border border-white/10">
                <Sparkles className="w-4 h-4" /> <span className="text-sm font-bold">{todaySholatRecords.filter(r => r.type === 'sunnah').length} Sunnah</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-md border border-white/10">
                <BookOpen className="w-4 h-4" /> <span className="text-sm font-bold">{todayTilawahRecords.length} Tilawah</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sholat Wajib */}
      <section className="bg-card rounded-3xl shadow-soft-md p-6 space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2"><TrendingUp className="text-success" /> Sholat Wajib</h3>
        <div className="space-y-3">
          {sholatWajibList.map(s => {
            if (s.maleOnly && user?.gender !== 'Laki-Laki') return null;
            const record = todaySholatRecords.find(r => r.name === s.name);
            if (!record) return null;

            // Resolusi waktu dari prayerTimes dinamis
            const displayTime = prayerTimes ? prayerTimes[s.name] : '--:--';

            return (
              <div key={s.name} className="space-y-2">
                <div className={cn("flex items-center justify-between p-4 rounded-2xl border-2 transition-all", 
                  record.completed ? "bg-success/5 border-success/30" : record.alasan ? "bg-warning/5 border-warning/30" : "bg-accent/5 border-transparent")}>
                  <div className="flex items-center gap-4">
                    <div className={cn("p-3 rounded-xl", record.completed ? "bg-success/20" : "bg-primary/10")}>
                      <s.icon className={record.completed ? "text-success" : "text-primary"} />
                    </div>
                    <div>
                      <p className="font-bold capitalize">{s.label}</p>
                      <p className="text-xs text-muted-foreground">{displayTime}</p>
                      {record.alasan && <p className="text-xs text-warning-foreground font-medium mt-1">Alasan: {record.alasan}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {!record.completed && (
                      <Button variant="ghost" size="icon" onClick={() => setExpandedAlasan(expandedAlasan === s.name ? null : s.name)}>
                        <ChevronDown className={cn("transition-transform", expandedAlasan === s.name && "rotate-180")} />
                      </Button>
                    )}
                    <Switch checked={record.completed} onCheckedChange={(v) => toggleSholat(record.id, s.name, v)} />
                  </div>
                </div>
                <AnimatePresence>
                  {expandedAlasan === s.name && !record.completed && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex flex-wrap gap-2 p-2 bg-accent/5 rounded-xl overflow-hidden">
                      <p className="w-full text-xs font-medium text-muted-foreground ml-1">Pilih Alasan Tidak Sholat:</p>
                      {alasanOptions.map(a => (
                        <Button key={a} size="sm" variant="outline" className="rounded-lg h-8 text-xs" 
                                onClick={() => updateSholatRecord(record.id, { alasan: a, completed: false }).then(() => setExpandedAlasan(null))}>
                          {a}
                        </Button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sholat Sunnah */}
      <section className="bg-card rounded-3xl shadow-soft-md p-6 space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2"><Sparkles className="text-accent" /> Sholat Sunnah</h3>
        <Accordion type="multiple" className="space-y-3">
          {sholatSunnahList.map(s => {
            const record = todaySholatRecords.find(r => r.name === s.name && r.type === 'sunnah');
            return (
              <AccordionItem key={s.name} value={s.name} className="border-none">
                <AccordionTrigger className="hover:no-underline p-4 bg-accent/5 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Star className={cn("w-5 h-5", record ? "text-amber-500 fill-amber-500" : "text-muted-foreground")} />
                    <span className="font-semibold">{s.label}</span>
                    {record && <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">{record.rakaat} Rakaat</span>}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-accent/5 rounded-b-2xl -mt-2 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 bg-background rounded-xl p-1 ring-1 ring-accent/20">
                      <Button variant="ghost" size="icon" onClick={() => saveSunnah(s.name, Math.max(0, (record?.rakaat || s.defaultRakaat) - 2))} className="h-8 w-8">-</Button>
                      <span className="w-8 text-center font-bold">{record?.rakaat ?? s.defaultRakaat}</span>
                      <Button variant="ghost" size="icon" onClick={() => saveSunnah(s.name, (record?.rakaat || s.defaultRakaat) + 2)} className="h-8 w-8">+</Button>
                    </div>
                    <Button size="sm" className="rounded-xl flex-1" onClick={() => saveSunnah(s.name, record?.rakaat ?? s.defaultRakaat)}>Simpan</Button>
                  </div>
                  {record && (
                    <Button variant="ghost" size="sm" className="text-destructive w-full hover:bg-destructive/5" onClick={() => deleteSholatRecord(record.id)}>
                      <Trash2 className="w-4 h-4 mr-2" /> Hapus Catatan
                    </Button>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </section>

      {/* Puasa & Sahur */}
      <section className="bg-card rounded-3xl shadow-soft-md p-6 space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2"><Moon className="text-indigo-500" /> Puasa & Sahur</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={handlePuasaYa} variant={todayPuasaRecord?.completed ? "default" : "outline"} className="h-14 rounded-2xl border-2">
            <CheckCircle2 className="mr-2" /> Ya, Puasa
          </Button>
          <Button onClick={() => setShowReasonModal(true)} variant={todayPuasaRecord?.completed === false ? "destructive" : "outline"} className="h-14 rounded-2xl border-2">
            <XCircle className="mr-2" /> Tidak Puasa
          </Button>
        </div>

        {todayPuasaRecord?.completed && (
          <div className="space-y-4 p-4 bg-accent/5 rounded-2xl border border-dashed border-accent">
             <div className="space-y-2">
                <Label className="text-sm font-bold ml-1">Waktu Sahur</Label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 z-10" />
                  <Input 
                    type="time" 
                    value={sahurTime} 
                    onChange={(e) => {
                      setSahurTime(e.target.value);
                      updatePuasaRecord(todayPuasaRecord.id, { sahurTime: e.target.value });
                    }} 
                    className="h-12 pl-12 rounded-xl bg-background border-none ring-1 ring-accent/20 focus-visible:ring-primary" 
                  />
                </div>
             </div>

             {showCamera ? (
               <div className="aspect-[3/4] max-w-sm mx-auto overflow-hidden rounded-3xl shadow-2xl border-4 border-white">
                 <CameraCapture onCapture={saveSahur} onCancel={() => setShowCamera(false)} />
               </div>
             ) : todayPuasaRecord.sahurPhoto ? (
                <div className="space-y-3 text-center">
                  <div className="relative mx-auto w-48 h-64 shadow-lg rounded-3xl overflow-hidden border-4 border-white">
                    <img src={todayPuasaRecord.sahurPhoto} className="w-full h-full object-cover" alt="Sahur" />
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowCamera(true)} className="rounded-xl"><RefreshCw className="mr-2 w-4 h-4" /> Ganti Foto</Button>
                </div>
             ) : (
               <Button onClick={() => setShowCamera(true)} variant="secondary" className="w-full h-14 rounded-2xl">
                 <Camera className="mr-2" /> Ambil Foto Sahur & Catat Waktu
               </Button>
             )}
          </div>
        )}
      </section>

      {/* Tilawah */}
      <section className="bg-card rounded-3xl shadow-soft-md p-6 space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2"><BookOpen className="text-primary" /> Tilawah Al-Qur'an</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs ml-1">Surah</Label>
            <Input placeholder="Al-Baqarah" value={surah} onChange={e => setSurah(e.target.value)} className="rounded-xl h-11" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs ml-1">Juz</Label>
            <Input type="number" placeholder="1-30" value={juz} onChange={e => setJuz(e.target.value)} className="rounded-xl h-11" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs ml-1">Ayat</Label>
            <Input placeholder="Contoh: 1-10" value={ayat} onChange={e => setAyat(e.target.value)} className="rounded-xl h-11" />
          </div>
        </div>
        <Button onClick={saveTilawah} className="w-full h-12 rounded-xl gradient-primary font-bold">Catat Tilawah</Button>
        
        <div className="space-y-2 pt-2">
           <div className="flex justify-between text-xs font-bold text-muted-foreground">
              <span>Progress Hari Ini</span>
              <span>{todayTilawahRecords.length} Catatan</span>
           </div>
           <div className="h-2.5 bg-accent/10 rounded-full overflow-hidden">
              <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: `${Math.min((todayTilawahRecords.length / tilawahTarget) * 100, 100)}%` }} />
           </div>
        </div>
      </section>

      {/* Modal Alasan Puasa */}
      <AnimatePresence>
        {showReasonModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-card w-full max-w-md p-6 rounded-[2rem] shadow-2xl space-y-4">
              <h4 className="text-lg font-bold text-center">Kenapa tidak berpuasa?</h4>
              <div className="grid gap-2">
                {alasanOptions.map(r => (
                  <Button key={r} variant={selectedReason === r ? "default" : "outline"} onClick={() => setSelectedReason(r)} className="h-12 rounded-xl text-left justify-start px-6">{r}</Button>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="ghost" className="flex-1 rounded-xl" onClick={() => setShowReasonModal(false)}>Batal</Button>
                <Button className="flex-1 rounded-xl" onClick={handleReasonSubmit}>Simpan</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}