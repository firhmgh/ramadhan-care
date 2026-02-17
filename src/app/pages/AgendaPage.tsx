import { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardList, Plus, Trash2, Calendar as CalendarIcon, 
  MapPin, Clock, Tag, ExternalLink, X 
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function AgendaPage() {
  const { agendaEntries, addAgendaEntry, deleteAgendaEntry } = useStore();
  
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<'ibadah' | 'kajian' | 'sosial'>('ibadah');
  const [notes, setNotes] = useState('');

  const sortedAgendas = [...(agendaEntries || [])].sort((a, b) => 
    new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingAgendas = sortedAgendas.filter(a => new Date(a.date) >= today);
  const pastAgendas = sortedAgendas.filter(a => new Date(a.date) < today);

  const handleSubmit = () => {
    if (!title || !date || !time) {
      toast.error('Mohon lengkapi judul, tanggal, dan waktu');
      return;
    }

    addAgendaEntry({
      id: crypto.randomUUID(),
      title,
      date,
      time,
      category,
      location,
      reminder: true,
      notes,
    });

    toast.success(`Agenda "${title}" berhasil dijadwalkan!`);
    resetForm();
  };

  const resetForm = () => {
    setShowModal(false);
    setTitle('');
    setLocation('');
    setNotes('');
  };

  return (
    <div className="px-4 py-6 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 sm:space-y-8 min-h-screen">
      {/* Header Section - Ukuran teks & padding menyesuaikan layar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden gradient-primary rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-8 text-white shadow-xl sm:shadow-2xl"
      >
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">Agenda Ramadhan</h1>
          <p className="text-sm sm:text-base text-blue-50 font-medium opacity-90 max-w-md leading-relaxed">
            Kelola jadwal ibadah, kajian, dan kegiatan sosial Anda secara profesional.
          </p>
        </div>
        <ClipboardList size={120} className="absolute -right-6 -bottom-6 opacity-10 rotate-12 sm:size-[180px] sm:-right-10 sm:-bottom-10" />
      </motion.div>

      {/* Action Button - Lebih ramping di mobile */}
      <Button 
        onClick={() => setShowModal(true)}
        className="w-full h-12 sm:h-16 rounded-xl sm:rounded-2xl text-base sm:text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 gap-2 sm:gap-3 group bg-primary hover:bg-primary/90"
      >
        <Plus size={20} className="sm:w-7 sm:h-7 group-hover:rotate-90 transition-transform duration-300" /> 
        Buat Agenda Baru
      </Button>

      {/* Agenda List Container */}
      <div className="grid grid-cols-1 gap-8 sm:gap-10">
        {/* Upcoming Section */}
        <section className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between border-b pb-3 sm:pb-4">
            <h3 className="font-bold text-lg sm:text-2xl flex items-center gap-2 sm:gap-3 text-foreground/80">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg sm:rounded-xl">
                <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              Agenda Mendatang
            </h3>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] sm:text-sm font-bold">
              {upcomingAgendas.length} Jadwal
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingAgendas.length > 0 ? (
              upcomingAgendas.map((agenda) => (
                <AgendaCard key={agenda.id} agenda={agenda} onDelete={deleteAgendaEntry} />
              ))
            ) : (
              <div className="col-span-full py-12 sm:py-20 text-center bg-muted/30 rounded-2xl sm:rounded-[2rem] border-2 border-dashed">
                <p className="text-sm sm:text-base text-muted-foreground font-medium">Belum ada agenda mendatang.</p>
              </div>
            )}
          </div>
        </section>

        {/* Past Section */}
        {pastAgendas.length > 0 && (
          <section className="space-y-4 sm:space-y-6 opacity-70">
            <h3 className="font-bold text-base sm:text-xl text-muted-foreground flex items-center gap-2">
              Riwayat Selesai
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pastAgendas.map((agenda) => (
                <AgendaCard key={agenda.id} agenda={agenda} onDelete={deleteAgendaEntry} isPast />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Professional Responsive Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetForm}
              className="absolute inset-0 bg-background/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              // Penambahan max-h & overflow-y agar modal bisa di-scroll di layar pendek (saat keyboard muncul)
              className="relative bg-card border shadow-2xl rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto space-y-5 sm:space-y-6 scrollbar-hide"
            >
              <div className="flex justify-between items-center sticky top-0 bg-card/95 py-2 z-10">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">Buat Agenda</h2>
                <Button variant="ghost" size="icon" onClick={resetForm} className="rounded-full hover:bg-muted">
                  <X size={20} />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5 sm:space-y-2">
                   <label className="text-xs sm:text-sm font-bold ml-1 text-muted-foreground">Judul Agenda</label>
                   <Input 
                    placeholder="Contoh: Buka Bersama Alumni" 
                    className="h-10 sm:h-12 text-base sm:text-lg rounded-xl border-2"
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                   />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-bold ml-1 text-muted-foreground">Tanggal</label>
                    <Input type="date" className="h-10 sm:h-12 rounded-xl" value={date} onChange={e => setDate(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs sm:text-sm font-bold ml-1 text-muted-foreground">Waktu</label>
                    <Input type="time" className="h-10 sm:h-12 rounded-xl" value={time} onChange={e => setTime(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-1.5">
                   <label className="text-xs sm:text-sm font-bold ml-1 text-muted-foreground">Lokasi / Link Maps</label>
                   <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary" size={18} />
                      <Input 
                        placeholder="Nama tempat atau link..." 
                        className="h-10 sm:h-12 pl-10 rounded-xl border-2"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                      />
                   </div>
                </div>

                <div className="space-y-1.5">
                   <label className="text-xs sm:text-sm font-bold ml-1 text-muted-foreground">Kategori</label>
                   <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                    {(['ibadah', 'kajian', 'sosial'] as const).map(cat => (
                      <Button 
                        key={cat}
                        variant={category === cat ? 'default' : 'secondary'}
                        className={`flex-1 min-w-[80px] capitalize rounded-xl h-9 sm:h-11 text-xs sm:text-sm font-bold transition-all ${category === cat ? 'scale-105 shadow-md' : ''}`}
                        onClick={() => setCategory(cat)}
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-bold ml-1 text-muted-foreground">Catatan</label>
                  <textarea 
                    className="w-full bg-background border-2 rounded-xl p-3 sm:p-4 min-h-[80px] sm:min-h-[100px] text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="Tulis detail agenda..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <Button variant="outline" className="w-full sm:flex-1 h-10 sm:h-12 rounded-xl font-bold border-2" onClick={resetForm}>Batal</Button>
                <Button className="w-full sm:flex-1 h-10 sm:h-12 rounded-xl font-bold text-sm sm:text-lg shadow-soft-lg" onClick={handleSubmit}>Simpan Agenda</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AgendaCard({ agenda, onDelete, isPast }: { agenda: any, onDelete: any, isPast?: boolean }) {
  const openMaps = () => {
    if (!agenda.location) return;
    const isUrl = agenda.location.startsWith('http');
    const query = isUrl ? agenda.location : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(agenda.location)}`;
    window.open(query, '_blank');
  };

  return (
    <motion.div 
      layout
      className={cn(
        "group bg-card rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 border-2 border-transparent hover:border-primary/20 shadow-md sm:shadow-soft-md transition-all duration-300 relative",
        isPast && "opacity-60 grayscale bg-muted/50"
      )}
    >
      <div className="flex gap-4 sm:gap-5">
        {/* Date Badge - Mengecil di HP */}
        <div className="w-12 h-16 sm:w-16 sm:h-20 rounded-xl sm:rounded-2xl bg-primary/10 flex flex-col items-center justify-center text-primary shrink-0 border border-primary/5 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider">{new Date(agenda.date).toLocaleDateString('id-ID', { month: 'short' })}</span>
          <span className="text-xl sm:text-3xl font-black leading-none">{new Date(agenda.date).getDate()}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-black text-base sm:text-xl truncate text-foreground group-hover:text-primary transition-colors leading-tight">{agenda.title}</h4>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full text-destructive hover:bg-destructive/10 shrink-0" 
              onClick={() => onDelete(agenda.id)}
            >
              <Trash2 size={16} className="sm:size-[18px]" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-2 text-[11px] sm:text-sm font-semibold">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock size={14} className="text-primary sm:size-[16px]" /> {agenda.time}
            </span>
            <span className="flex items-center gap-1 text-primary capitalize">
              <Tag size={14} className="sm:size-[16px]" /> #{agenda.category}
            </span>
          </div>

          {agenda.location && (
            <button 
              onClick={openMaps}
              className="mt-3 w-full flex items-center justify-between p-2 sm:p-3 rounded-lg sm:rounded-xl bg-muted/50 hover:bg-primary/5 border border-dashed border-primary/20 transition-all text-left"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <MapPin size={14} className="text-primary shrink-0 sm:size-[16px]" />
                <span className="text-[10px] sm:text-xs font-bold truncate text-muted-foreground">{agenda.location}</span>
              </div>
              <ExternalLink size={12} className="text-muted-foreground opacity-50 shrink-0 sm:size-[14px]" />
            </button>
          )}

          {agenda.notes && (
            <div className="mt-3 p-2.5 bg-muted/30 rounded-lg border-l-4 border-primary/30">
               <p className="text-[10px] sm:text-xs font-medium text-muted-foreground line-clamp-2 leading-relaxed italic">
                 "{agenda.notes}"
               </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}