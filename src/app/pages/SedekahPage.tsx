import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { AnimatedCounter } from '../components/ProgressIndicators';
import { Heart, TrendingUp, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SedekahPage() {
  const { sedekahRecords, addSedekahRecord, getTotalSedekah } = useStore();
  const [showForm, setShowForm] = useState(false);
  
  const [nominal, setNominal] = useState('');
  const [tujuan, setTujuan] = useState('');
  const [kategori, setKategori] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nominal || !tujuan || !kategori) {
      toast.error('Lengkapi semua field');
      return;
    }

    addSedekahRecord({
      date: new Date().toISOString().split('T')[0],
      nominal: parseInt(nominal),
      tujuan,
      kategori,
      notes: notes || undefined,
    });

    toast.success('Sedekah berhasil dicatat! Barakallahu fiik 🤲');
    
    // Reset
    setNominal('');
    setTujuan('');
    setKategori('');
    setNotes('');
    setShowForm(false);
  };

  const totalSedekah = getTotalSedekah();

  // Prepare chart data (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const chartData = last7Days.map(date => {
    const records = sedekahRecords.filter(r => r.date === date);
    const total = records.reduce((sum, r) => sum + r.nominal, 0);
    return {
      date: new Date(date).toLocaleDateString('id-ID', { weekday: 'short' }),
      total,
    };
  });

  // Categories summary
  const categories = sedekahRecords.reduce((acc, record) => {
    acc[record.kategori] = (acc[record.kategori] || 0) + record.nominal;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-full p-4 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Sedekah</h1>
          <p className="text-muted-foreground">
            Catat dan pantau sedekah Anda
          </p>
        </div>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="rounded-2xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tambah Sedekah
          </Button>
        )}
      </motion.div>

      {/* Total Stats */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl gradient-warm p-8 shadow-soft-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm mb-2 opacity-80">Total Sedekah</p>
            <h2 className="text-4xl font-bold">
              Rp <AnimatedCounter value={totalSedekah} />
            </h2>
            <p className="text-sm mt-2 opacity-80">{sedekahRecords.length} transaksi</p>
          </div>
          <div className="w-20 h-20 rounded-2xl bg-white/30 backdrop-blur-sm flex items-center justify-center">
            <Heart className="w-10 h-10" />
          </div>
        </div>
      </motion.div>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-card rounded-3xl shadow-soft-md p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Catat Sedekah Baru</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowForm(false)}
              >
                Batal
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nominal">Nominal (Rp)</Label>
              <Input
                id="nominal"
                type="number"
                placeholder="50000"
                value={nominal}
                onChange={(e) => setNominal(e.target.value)}
                className="rounded-2xl"
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tujuan">Tujuan</Label>
              <Input
                id="tujuan"
                placeholder="Contoh: Masjid, Yayasan Yatim, Fakir Miskin"
                value={tujuan}
                onChange={(e) => setTujuan(e.target.value)}
                className="rounded-2xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kategori">Kategori</Label>
              <Input
                id="kategori"
                placeholder="Contoh: Infaq, Sedekah Jariyah, Bantuan Bencana"
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="rounded-2xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Catatan (opsional)</Label>
              <Textarea
                id="notes"
                placeholder="Tambahkan catatan..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="rounded-2xl resize-none"
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full rounded-2xl h-12 gradient-primary">
              <Heart className="w-5 h-5 mr-2" />
              Simpan Sedekah
            </Button>
          </form>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card rounded-3xl shadow-soft-md p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-peach/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-peach-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">Tren 7 Hari Terakhir</h3>
              <p className="text-sm text-muted-foreground">Grafik sedekah harian</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="date"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                }}
                formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Total']}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="var(--color-peach)"
                strokeWidth={3}
                dot={{ fill: 'var(--color-peach)', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card rounded-3xl shadow-soft-md p-6"
        >
          <h3 className="font-semibold mb-4">Kategori Sedekah</h3>

          {Object.keys(categories).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Belum ada sedekah tercatat</p>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(categories)
                .sort((a, b) => b[1] - a[1])
                .map(([kategori, total]) => {
                  const percentage = (total / totalSedekah) * 100;
                  return (
                    <div key={kategori} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{kategori}</span>
                        <span className="text-sm font-bold">
                          Rp {total.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full gradient-warm"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </motion.div>
      </div>

      {/* History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-3xl shadow-soft-md p-6"
      >
        <h3 className="font-semibold mb-4">Riwayat Sedekah</h3>

        {sedekahRecords.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Belum ada riwayat sedekah</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {sedekahRecords
              .slice()
              .reverse()
              .map((record) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl border-2 border-border hover:border-peach transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">
                        Rp {record.nominal.toLocaleString('id-ID')}
                      </p>
                      <p className="text-sm text-muted-foreground">{record.kategori}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{record.date}</span>
                  </div>
                  <p className="text-sm">📍 {record.tujuan}</p>
                  {record.notes && (
                    <p className="text-xs text-muted-foreground mt-2">{record.notes}</p>
                  )}
                </motion.div>
              ))}
          </div>
        )}
      </motion.div>

      {/* Hadist Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-accent/20 rounded-3xl p-6 border-2 border-accent"
      >
        <h4 className="font-semibold mb-3">💝 Hadist tentang Sedekah</h4>
        <p className="text-sm italic text-muted-foreground mb-2">
          "Sedekah tidak akan mengurangi harta. Dan tidaklah seseorang yang memaafkan (kesalahan orang lain), 
          melainkan Allah akan menambah kemuliaannya."
        </p>
        <p className="text-xs text-muted-foreground">— HR. Muslim</p>
      </motion.div>
    </div>
  );
}
