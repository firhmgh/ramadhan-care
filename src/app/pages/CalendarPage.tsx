import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Calendar as CalendarComponent } from '../components/ui/calendar';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '../components/ui/utils';
import { useEffect } from 'react';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { 
    sholatRecords, puasaRecords, tilawahRecords, zakatRecords, 
    sedekahRecords, journalEntries, fetchImsakiyah, user 
  } = useStore();

  useEffect(() => {
    fetchImsakiyah();
  }, [user?.mazhab]);

  const getDateActivities = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    
    const sholat = sholatRecords.filter(r => r.date === dateString && r.completed);
    const puasa = puasaRecords.find(r => r.date === dateString && r.completed);
    const tilawah = tilawahRecords.filter(r => r.date === dateString);
    const zakat = zakatRecords.filter(r => r.date === dateString);
    const sedekah = sedekahRecords.filter(r => r.date === dateString);
    const journal = journalEntries.find(r => r.date === dateString);

    return {
      sholat: sholat.length,
      hasPuasa: !!puasa,
      hasTilawah: tilawah.length > 0,
      hasZakat: zakat.length > 0,
      hasSedekah: sedekah.length > 0,
      hasJournal: !!journal,
      total: sholat.length + (puasa ? 1 : 0) + tilawah.length + zakat.length + sedekah.length + (journal ? 1 : 0),
    };
  };

  const selectedActivities = getDateActivities(selectedDate);
  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
  
  const selectedSholat = sholatRecords.filter(r => r.date === selectedDateString);
  const selectedPuasa = puasaRecords.find(r => r.date === selectedDateString);
  const selectedTilawah = tilawahRecords.filter(r => r.date === selectedDateString);
  const selectedJournal = journalEntries.find(r => r.date === selectedDateString);

  const legends = [
    { color: 'bg-success', label: 'Ibadah Lengkap (5+ aktivitas)', condition: (total: number) => total >= 5 },
    { color: 'bg-secondary', label: 'Puasa', condition: () => false },
    { color: 'bg-accent', label: 'Tilawah', condition: () => false },
    { color: 'bg-gold', label: 'Zakat/Sedekah', condition: () => false },
    { color: 'bg-peach', label: 'Jurnal', condition: () => false },
    { color: 'bg-muted', label: 'Kosong', condition: (total: number) => total === 0 },
  ];

  return (
    <div className="min-h-full p-4 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Kalender Ibadah</h1>
        <p className="text-muted-foreground">
          Pantau aktivitas ibadah Anda setiap hari
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-card rounded-3xl shadow-soft-md p-6"
        >
          <div className="calendar-container">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              locale={id}
              className="rounded-2xl"
              modifiers={{
                active: (date) => {
                  const activities = getDateActivities(date);
                  return activities.total > 0;
                },
                complete: (date) => {
                  const activities = getDateActivities(date);
                  return activities.total >= 5;
                },
              }}
              modifiersClassNames={{
                active: 'bg-accent/30',
                complete: 'bg-success/30 font-bold',
              }}
            />
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 rounded-2xl bg-accent/10">
            <h4 className="font-semibold mb-3">Legenda:</h4>
            <div className="grid grid-cols-2 gap-2">
              {legends.map((legend, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={cn("w-4 h-4 rounded", legend.color)} />
                  <span className="text-sm">{legend.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="bg-card rounded-3xl shadow-soft-md p-6">
            <h3 className="font-semibold mb-4">
              {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: id })}
            </h3>

            {selectedActivities.total === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Tidak ada aktivitas di tanggal ini</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Sholat */}
                {selectedSholat.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-primary">Sholat</h4>
                    <div className="space-y-1">
                      {selectedSholat.filter(s => s.completed).map((s) => (
                        <div key={s.id} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="capitalize">{s.name}</span>
                          {s.rakaat && <span className="text-muted-foreground">({s.rakaat} rakaat)</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Puasa */}
                {selectedPuasa?.completed && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-secondary-foreground">Puasa</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      <span>Puasa tercatat</span>
                      {selectedPuasa.sahurTime && (
                        <span className="text-muted-foreground">Sahur: {selectedPuasa.sahurTime}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Tilawah */}
                {selectedTilawah.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-accent-foreground">Tilawah</h4>
                    <div className="space-y-1">
                      {selectedTilawah.map((t) => (
                        <div key={t.id} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                          <span>{t.surah || `Halaman ${t.halaman}`}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Journal */}
                {selectedJournal && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-peach-foreground">Jurnal</h4>
                    <div className="p-3 rounded-xl bg-peach/20">
                      <p className="text-sm">{selectedJournal.story.substring(0, 100)}...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-card rounded-3xl shadow-soft-md p-6">
            <h3 className="font-semibold mb-4">Statistik Bulan Ini</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Hari Puasa</span>
                <span className="font-bold text-secondary-foreground">
                  {puasaRecords.filter(r => r.completed).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Tilawah</span>
                <span className="font-bold text-accent-foreground">
                  {tilawahRecords.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Jurnal Ditulis</span>
                <span className="font-bold text-peach-foreground">
                  {journalEntries.length}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
