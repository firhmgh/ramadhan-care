import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { AnimatedCounter } from '../components/ProgressIndicators';
import { Wallet, Calculator, Upload, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function ZakatPage() {
  const { zakatRecords, addZakatRecord, getTotalZakat } = useStore();
  const [step, setStep] = useState<'calculate' | 'form'>('calculate');
  
  // Calculator
  const [jumlahAnggota, setJumlahAnggota] = useState('4');
  const [hargaBeras, setHargaBeras] = useState('15000');
  
  // Form
  const [tanggal, setTanggal] = useState('');
  const [jam, setJam] = useState('');
  const [bentuk, setBentuk] = useState<'beras' | 'uang'>('beras');
  const [metode, setMetode] = useState('');
  const [notes, setNotes] = useState('');
  const [buktiUrl, setBuktiUrl] = useState('');

  const totalNominal = parseInt(jumlahAnggota || '0') * parseInt(hargaBeras || '0') * 2.5;

  const handleCalculate = () => {
    if (!jumlahAnggota || !hargaBeras) {
      toast.error('Lengkapi data kalkulator');
      return;
    }
    setStep('form');
    setTanggal(new Date().toISOString().split('T')[0]);
    setJam(new Date().toTimeString().split(' ')[0].substring(0, 5));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tanggal || !jam || !metode) {
      toast.error('Lengkapi semua field yang diperlukan');
      return;
    }

    addZakatRecord({
      date: tanggal,
      time: jam,
      jumlahOrang: parseInt(jumlahAnggota),
      hargaBeras: parseInt(hargaBeras),
      totalNominal,
      bentuk,
      metodePenyaluran: metode,
      buktiUrl: buktiUrl || undefined,
      notes: notes || undefined,
    });

    toast.success('Zakat Fitrah berhasil dicatat!');
    
    // Reset form
    setStep('calculate');
    setJumlahAnggota('4');
    setHargaBeras('15000');
    setTanggal('');
    setJam('');
    setBentuk('beras');
    setMetode('');
    setNotes('');
    setBuktiUrl('');
  };

  const totalZakat = getTotalZakat();

  return (
    <div className="min-h-full p-4 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Zakat Fitrah</h1>
        <p className="text-muted-foreground">
          Hitung dan catat zakat fitrah Anda
        </p>
      </motion.div>

      {/* Total Stats */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl gradient-warm p-8 shadow-soft-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm mb-2 opacity-80">Total Zakat Tercatat</p>
            <h2 className="text-4xl font-bold">
              Rp <AnimatedCounter value={totalZakat} />
            </h2>
            <p className="text-sm mt-2 opacity-80">{zakatRecords.length} transaksi</p>
          </div>
          <div className="w-20 h-20 rounded-2xl bg-white/30 backdrop-blur-sm flex items-center justify-center">
            <Wallet className="w-10 h-10" />
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Calculator / Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card rounded-3xl shadow-soft-md p-6"
        >
          {step === 'calculate' ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-gold-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">Kalkulator Zakat</h3>
                  <p className="text-sm text-muted-foreground">Hitung zakat fitrah keluarga</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="jumlahAnggota">Jumlah Anggota Keluarga</Label>
                  <Input
                    id="jumlahAnggota"
                    type="number"
                    value={jumlahAnggota}
                    onChange={(e) => setJumlahAnggota(e.target.value)}
                    className="rounded-2xl"
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hargaBeras">Harga Beras per Kg (Rp)</Label>
                  <Input
                    id="hargaBeras"
                    type="number"
                    value={hargaBeras}
                    onChange={(e) => setHargaBeras(e.target.value)}
                    className="rounded-2xl"
                    min="1"
                  />
                  <p className="text-xs text-muted-foreground">
                    Standar: 2.5 kg per orang
                  </p>
                </div>

                {/* Result Preview */}
                <motion.div
                  key={totalNominal}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-6 rounded-2xl gradient-gold"
                >
                  <p className="text-sm mb-2 opacity-80">Total Zakat Fitrah</p>
                  <h3 className="text-3xl font-bold">
                    Rp {totalNominal.toLocaleString('id-ID')}
                  </h3>
                  <p className="text-sm mt-2 opacity-80">
                    {jumlahAnggota} orang × {parseInt(hargaBeras || '0').toLocaleString('id-ID')}/kg × 2.5 kg
                  </p>
                </motion.div>

                <Button
                  onClick={handleCalculate}
                  className="w-full rounded-2xl h-12"
                >
                  Lanjut ke Pencatatan
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Form Pencatatan</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep('calculate')}
                >
                  Kembali
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tanggal">Tanggal</Label>
                  <Input
                    id="tanggal"
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="rounded-2xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jam">Jam</Label>
                  <Input
                    id="jam"
                    type="time"
                    value={jam}
                    onChange={(e) => setJam(e.target.value)}
                    className="rounded-2xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bentuk">Bentuk Zakat</Label>
                <Select value={bentuk} onValueChange={(value: any) => setBentuk(value)}>
                  <SelectTrigger id="bentuk" className="rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beras">Beras</SelectItem>
                    <SelectItem value="uang">Uang</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metode">Metode Penyaluran</Label>
                <Input
                  id="metode"
                  placeholder="Contoh: Masjid Al-Ikhlas, Langsung ke Mustahik"
                  value={metode}
                  onChange={(e) => setMetode(e.target.value)}
                  className="rounded-2xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bukti">URL Bukti (opsional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="bukti"
                    type="url"
                    placeholder="https://..."
                    value={buktiUrl}
                    onChange={(e) => setBuktiUrl(e.target.value)}
                    className="rounded-2xl"
                  />
                  <Button type="button" variant="outline" size="icon" className="rounded-xl">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
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
                <CheckCircle className="w-5 h-5 mr-2" />
                Simpan Zakat
              </Button>
            </form>
          )}
        </motion.div>

        {/* History */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card rounded-3xl shadow-soft-md p-6"
        >
          <h3 className="font-semibold mb-4">Riwayat Zakat</h3>

          {zakatRecords.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Wallet className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Belum ada riwayat zakat</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {zakatRecords.map((record) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl border-2 border-border hover:border-gold transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">
                        Rp {record.totalNominal.toLocaleString('id-ID')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {record.jumlahOrang} orang • {record.bentuk}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {record.date}
                    </span>
                  </div>
                  <p className="text-sm">📍 {record.metodePenyaluran}</p>
                  {record.notes && (
                    <p className="text-xs text-muted-foreground mt-2">{record.notes}</p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-accent/20 rounded-3xl p-6 border-2 border-accent"
      >
        <h4 className="font-semibold mb-3">💡 Catatan Penting</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Zakat fitrah wajib dibayarkan sebelum sholat Idul Fitri</li>
          <li>• Besaran: 2.5 kg makanan pokok (beras) atau senilai uang per jiwa</li>
          <li>• Diberikan kepada 8 golongan penerima zakat (mustahik)</li>
          <li>• Niat zakat fitrah dilakukan saat menyerahkan zakat</li>
        </ul>
      </motion.div>
    </div>
  );
}
