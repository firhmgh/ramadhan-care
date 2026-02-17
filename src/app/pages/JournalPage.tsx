import { useState } from 'react';
import { useStore, MoodType } from '../store/useStore';
import { MoodSelector } from '../components/MoodSelector';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { BookHeart, Save, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const reflectivePrompts = [
  "Apa yang paling Anda syukuri hari ini?",
  "Ibadah apa yang paling berkesan hari ini?",
  "Bagaimana perasaan Anda saat beribadah hari ini?",
  "Apa pelajaran spiritual yang Anda dapatkan hari ini?",
  "Hal apa yang ingin Anda perbaiki untuk besok?",
];

export default function JournalPage() {
  const { getJournalByDate, addJournalEntry } = useStore();
  const today = new Date().toISOString().split('T')[0];
  const existingEntry = getJournalByDate(today);

  const [mood, setMood] = useState<MoodType | null>(existingEntry?.mood || null);
  const [story, setStory] = useState(existingEntry?.story || '');
  const [evaluasi, setEvaluasi] = useState(existingEntry?.evaluasi || '');
  const [gratitude, setGratitude] = useState(existingEntry?.gratitude || '');

  const handleSave = () => {
    if (!mood || !story || !evaluasi) {
      toast.error('Lengkapi mood, cerita, dan evaluasi');
      return;
    }

    addJournalEntry({
      date: today,
      mood,
      story,
      evaluasi,
      gratitude: gratitude || undefined,
    });

    toast.success('Jurnal berhasil disimpan! 📖');
  };

  const wordCount = story.split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-full p-4 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl gradient-accent flex items-center justify-center">
            <BookHeart className="w-6 h-6 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Refleksi & Cerita Harian</h1>
            <p className="text-sm text-muted-foreground">
              {format(new Date(), "EEEE, d MMMM yyyy", { locale: id })}
            </p>
          </div>
        </div>
        <p className="text-muted-foreground">
          Catat perjalanan spiritual Anda hari ini (privat)
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mood Selector */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-3xl shadow-soft-md p-6"
          >
            <MoodSelector value={mood} onChange={setMood} />
          </motion.div>

          {/* Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-3xl shadow-soft-md p-6 space-y-4"
          >
            <div>
              <Label htmlFor="story">Cerita Hari Ini</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Ceritakan momen spesial, perasaan, atau pengalaman Anda
              </p>
            </div>
            <Textarea
              id="story"
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Tuliskan cerita Anda..."
              className="rounded-2xl resize-none min-h-[200px]"
              rows={10}
            />
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{wordCount} kata</span>
              {wordCount > 0 && wordCount < 20 && (
                <span className="text-warning-foreground">
                  Minimal 20 kata untuk refleksi yang bermakna
                </span>
              )}
            </div>
          </motion.div>

          {/* Evaluasi */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-3xl shadow-soft-md p-6 space-y-4"
          >
            <div>
              <Label htmlFor="evaluasi">Evaluasi Diri</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Renungkan ibadah dan perilaku Anda hari ini
              </p>
            </div>
            <Textarea
              id="evaluasi"
              value={evaluasi}
              onChange={(e) => setEvaluasi(e.target.value)}
              placeholder="Apa yang sudah baik? Apa yang perlu diperbaiki?"
              className="rounded-2xl resize-none"
              rows={6}
            />
          </motion.div>

          {/* Gratitude */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-3xl shadow-soft-md p-6 space-y-4"
          >
            <div>
              <Label htmlFor="gratitude">Rasa Syukur (opsional)</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Apa yang Anda syukuri hari ini?
              </p>
            </div>
            <Textarea
              id="gratitude"
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              placeholder="Alhamdulillah..."
              className="rounded-2xl resize-none"
              rows={4}
            />
          </motion.div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            className="w-full rounded-2xl h-12 gradient-primary"
          >
            <Save className="w-5 h-5 mr-2" />
            Simpan Jurnal
          </Button>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Reflective Prompts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card rounded-3xl shadow-soft-md p-6"
          >
            <h3 className="font-semibold mb-4">💭 Pertanyaan Reflektif</h3>
            <div className="space-y-3">
              {reflectivePrompts.map((prompt, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-xl bg-accent/10 hover:bg-accent/20 transition-colors cursor-pointer"
                  onClick={() => {
                    if (!story.includes(prompt)) {
                      setStory(story + (story ? '\n\n' : '') + prompt + '\n');
                    }
                  }}
                >
                  <p className="text-sm">{prompt}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Privacy Notice */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-accent/20 rounded-3xl p-6 border-2 border-accent"
          >
            <h4 className="font-semibold mb-3">🔒 Jurnal Privat</h4>
            <p className="text-sm text-muted-foreground">
              Jurnal Anda sepenuhnya privat dan hanya dapat dilihat oleh Anda. 
              Tulis dengan jujur dan terbuka untuk pertumbuhan spiritual yang lebih baik.
            </p>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-3xl shadow-soft-md p-6"
          >
            <h4 className="font-semibold mb-3">✨ Tips Menulis Jurnal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Tulis dengan jujur dan tulus</li>
              <li>• Fokus pada perasaan dan pembelajaran</li>
              <li>• Catat momen-momen kecil yang bermakna</li>
              <li>• Refleksikan hubungan Anda dengan Allah</li>
              <li>• Tetapkan niat untuk besok</li>
            </ul>
          </motion.div>

          {/* Calendar Indicator */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-3xl shadow-soft-md p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <CalendarIcon className="w-5 h-5 text-peach-foreground" />
              <h4 className="font-semibold">Konsistensi Jurnal</h4>
            </div>
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-peach-foreground mb-2">
                {existingEntry ? '✓' : '—'}
              </p>
              <p className="text-sm text-muted-foreground">
                {existingEntry ? 'Jurnal hari ini sudah ditulis' : 'Belum menulis jurnal hari ini'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
