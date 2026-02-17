import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/button';
import { 
  User, LogOut, Mail, BookOpen, 
  Calendar as CalendarIcon, UserRound, 
  ChevronLeft, ChevronRight, Camera, 
  X, ZoomIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { cn } from '../components/ui/utils';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, sholatRecords, puasaRecords, tilawahRecords, zakatRecords, sedekahRecords } = useStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    toast.success('Logout berhasil');
    navigate('/auth');
  };

  if (!user) return null;

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Padding untuk hari kosong di awal bulan
    for (let i = 0; i < (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1); i++) {
      days.push(null);
    }
    // Isi tanggal
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  }, [currentDate]);

  const sahurPhotosMap = useMemo(() => {
    const map: Record<string, string> = {};
    puasaRecords.forEach(record => {
      if (record.sahurImage) { 
        map[record.date] = record.sahurImage;
      }
    });
    return map;
  }, [puasaRecords]);

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  // --- STATS DATA ---
  const stats = [
    { label: 'Sholat', value: sholatRecords.filter(r => r.completed).length, icon: '🙏', color: 'bg-primary/10 text-primary' },
    { label: 'Puasa', value: puasaRecords.filter(r => r.completed).length, icon: '🌙', color: 'bg-secondary/10 text-secondary-foreground' },
    { label: 'Tilawah', value: tilawahRecords.length, icon: '📖', color: 'bg-accent/20 text-accent-foreground' },
    { label: 'Zakat', value: `Rp ${zakatRecords.reduce((sum, r) => sum + r.totalNominal, 0).toLocaleString('id-ID')}`, icon: '💰', color: 'bg-gold/10 text-gold-foreground' },
    { label: 'Sedekah', value: `Rp ${sedekahRecords.reduce((sum, r) => sum + r.nominal, 0).toLocaleString('id-ID')}`, icon: '💝', color: 'bg-peach/10 text-peach-foreground' },
  ];

  return (
    <div className="min-h-full p-4 lg:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header & Profile Card (Tetap Sama) */}
      <section className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-black tracking-tight">Profil Saya</h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[2.5rem] gradient-spiritual p-8 shadow-soft-xl text-white relative overflow-hidden"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/30 flex items-center justify-center shadow-inner">
              <User className="w-14 h-14" />
            </div>
            <div className="flex-1 text-center md:text-left space-y-2">
              <h2 className="text-3xl font-black">{user.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 opacity-90 text-sm font-medium">
                <div className="flex items-center gap-2 justify-center md:justify-start"><Mail className="w-4 h-4" />{user.email}</div>
                <div className="flex items-center gap-2 justify-center md:justify-start"><UserRound className="w-4 h-4" />{user.gender} • {user.age} Thn</div>
                <div className="flex items-center gap-2 justify-center md:justify-start"><BookOpen className="w-4 h-4" />Mazhab: {user.mazhab}</div>
                <div className="flex items-center gap-2 justify-center md:justify-start"><CalendarIcon className="w-4 h-4" />Bergabung: {new Date(user.createdAt || '').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</div>
              </div>
            </div>
            <Button onClick={() => navigate('/settings')} className="rounded-2xl bg-white/20 hover:bg-white/30 border-none backdrop-blur-md font-bold">Edit Profil</Button>
          </div>
        </motion.div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card rounded-3xl p-4 border border-border/50 shadow-soft-sm text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</div>
            <div className="text-sm font-black truncate">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* --- ARSIP FOTO SAHUR (INSTAGRAM STYLE) --- */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-[2.5rem] border border-border/50 shadow-soft-xl overflow-hidden"
      >
        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="font-black text-xl tracking-tight">Arsip Foto Sahur</h3>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold capitalize">
              {currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </span>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => changeMonth(-1)} className="rounded-full h-8 w-8"><ChevronLeft className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => changeMonth(1)} className="rounded-full h-8 w-8"><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {['Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb', 'Mg'].map(day => (
              <div key={day} className="text-center text-[10px] font-black text-muted-foreground py-2 uppercase tracking-tighter">{day}</div>
            ))}
            
            {calendarData.map((date, i) => {
              if (!date) return <div key={`empty-${i}`} className="aspect-square" />;
              
              const dateKey = date.toISOString().split('T')[0];
              const photoUrl = sahurPhotosMap[dateKey];
              const isToday = new Date().toDateString() === date.toDateString();

              return (
                <div 
                  key={dateKey} 
                  className={cn(
                    "relative aspect-square rounded-2xl overflow-hidden border-2 transition-all group",
                    isToday ? "border-primary" : "border-transparent",
                    photoUrl ? "cursor-pointer hover:scale-105 active:scale-95 shadow-md" : "bg-muted/20"
                  )}
                  onClick={() => photoUrl && setSelectedPhoto(photoUrl)}
                >
                  {photoUrl ? (
                    <>
                      <img src={photoUrl} alt="Sahur" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                      <div className="absolute top-1 left-2 text-[10px] font-black text-white drop-shadow-md">
                        {date.getDate()}
                      </div>
                      <ZoomIn className="absolute bottom-2 right-2 w-3 h-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-muted-foreground/50">
                      {date.getDate()}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Preview Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <Button 
              variant="ghost" 
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
              onClick={() => setSelectedPhoto(null)}
            >
              <X className="w-6 h-6" />
            </Button>
            <motion.img 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              src={selectedPhoto} 
              className="max-w-full max-h-[80vh] rounded-3xl shadow-2xl border-4 border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Button */}
      <Button onClick={handleLogout} variant="destructive" className="w-full rounded-2xl h-14 font-bold shadow-soft-lg shadow-destructive/20 transition-all active:scale-95">
        <LogOut className="w-5 h-5 mr-2" /> Keluar dari Akun
      </Button>
    </div>
  );
}