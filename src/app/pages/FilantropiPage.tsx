import { useState, useRef } from 'react'; // Menambahkan useRef
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { AnimatedCounter } from '../components/ProgressIndicators';
import { 
  Heart, 
  TrendingUp, 
  Plus, 
  Wallet, 
  Calculator, 
  Upload, 
  CheckCircle,
  History,
  LayoutDashboard,
  Info,
  ImageIcon, // Menambahkan icon image
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ZakatSedekahPage() {
  const { 
    sedekahRecords, addSedekahRecord, getTotalSedekah,
    zakatRecords, addZakatRecord, getTotalZakat 
  } = useStore();

  // Tab Control
  const [activeTab, setActiveTab] = useState<'sedekah' | 'zakat'>('sedekah');

  // --- SEDEKAH STATES ---
  const [showSedekahForm, setShowSedekahForm] = useState(false);
  const [sedekahNominal, setSedekahNominal] = useState('');
  const [sedekahTujuan, setSedekahTujuan] = useState('');
  const [sedekahKategori, setSedekahKategori] = useState('');
  const [sedekahNotes, setSedekahNotes] = useState('');

  // --- ZAKAT STATES ---
  const [zakatStep, setZakatStep] = useState<'calculate' | 'form'>('calculate');
  const [jumlahAnggota, setJumlahAnggota] = useState('4');
  const [hargaBeras, setHargaBeras] = useState('15000');
  const [zakatTanggal, setZakatTanggal] = useState('');
  const [zakatJam, setZakatJam] = useState('');
  const [zakatBentuk, setZakatBentuk] = useState<'beras' | 'uang'>('beras');
  const [zakatMetode, setZakatMetode] = useState('');
  const [zakatNotes, setZakatNotes] = useState('');
  const [zakatBuktiUrl, setZakatBuktiUrl] = useState('');
  
  // Ref untuk input file device
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- LOGIC CALCULATIONS ---
  const totalZakatNominalCalc = parseInt(jumlahAnggota || '0') * parseInt(hargaBeras || '0') * 2.5;
  const totalSedekah = getTotalSedekah();
  const totalZakat = getTotalZakat();

  // Chart Data Preparation (from SedekahPage)
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

  const categories = sedekahRecords.reduce((acc, record) => {
    acc[record.kategori] = (acc[record.kategori] || 0) + record.nominal;
    return acc;
  }, {} as Record<string, number>);

  // --- HANDLERS ---
  
  // Fungsi untuk menangani upload dari device
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Ukuran file terlalu besar (maks 2MB)");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setZakatBuktiUrl(reader.result as string);
        toast.success("Bukti berhasil diunggah");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitSedekah = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sedekahNominal || !sedekahTujuan || !sedekahKategori) {
      toast.error('Lengkapi semua field');
      return;
    }
    addSedekahRecord({
      date: new Date().toISOString().split('T')[0],
      nominal: parseInt(sedekahNominal),
      tujuan: sedekahTujuan,
      kategori: sedekahKategori,
      notes: sedekahNotes || undefined,
    });
    toast.success('Sedekah berhasil dicatat! Barakallahu fiik 🤲');
    setSedekahNominal(''); setSedekahTujuan(''); setSedekahKategori(''); setSedekahNotes('');
    setShowSedekahForm(false);
  };

  const handleCalculateZakat = () => {
    if (!jumlahAnggota || !hargaBeras) {
      toast.error('Lengkapi data kalkulator');
      return;
    }
    setZakatStep('form');
    setZakatTanggal(new Date().toISOString().split('T')[0]);
    setZakatJam(new Date().toTimeString().split(' ')[0].substring(0, 5));
  };

  const handleSubmitZakat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zakatTanggal || !zakatJam || !zakatMetode) {
      toast.error('Lengkapi semua field yang diperlukan');
      return;
    }
    addZakatRecord({
      date: zakatTanggal,
      time: zakatJam,
      jumlahOrang: parseInt(jumlahAnggota),
      hargaBeras: parseInt(hargaBeras),
      totalNominal: totalZakatNominalCalc,
      bentuk: zakatBentuk,
      metodePenyaluran: zakatMetode,
      buktiUrl: zakatBuktiUrl || undefined,
      notes: zakatNotes || undefined,
    });
    toast.success('Zakat Fitrah berhasil dicatat!');
    setZakatStep('calculate');
    setZakatMetode(''); setZakatNotes(''); setZakatBuktiUrl('');
  };

  return (
    <div className="min-h-full p-4 lg:p-8 space-y-8">
      {/* HEADER SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Filantropi</h1>
          <p className="text-muted-foreground text-lg font-medium">Sucikan harta, tenangkan jiwa.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1.5 bg-muted rounded-2xl w-fit border border-border">
          <button
            onClick={() => setActiveTab('sedekah')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'sedekah' ? 'bg-white shadow-md text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Heart className="w-4 h-4" /> Sedekah
          </button>
          <button
            onClick={() => setActiveTab('zakat')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'zakat' ? 'bg-white shadow-md text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Wallet className="w-4 h-4" /> Zakat Fitrah
          </button>
        </div>
      </motion.div>

      {/* SUMMARY CARDS */}
      <div className="grid md:grid-cols-2 gap-6">
  {/* Total Sedekah Card */}
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="group relative overflow-hidden rounded-[2.5rem] gradient-warm p-8 shadow-soft-xl text-white"
  >
    <div className="relative z-10 flex justify-between items-start">
      <div className="space-y-4">
        <p className="text-white/90 font-bold text-sm tracking-widest uppercase">Total Sedekah</p>
        <div>
          <h2 className="text-5xl font-black flex items-baseline gap-1">
            <span className="text-2xl font-medium">Rp</span>
            <AnimatedCounter value={totalSedekah} />
          </h2>
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md mt-4 text-xs font-bold border border-white/30 shadow-sm">
            {sedekahRecords.length} Transaksi
          </div>
        </div>
      </div>
      <div className="p-4 bg-white/20 backdrop-blur-xl rounded-[2rem] shadow-inner group-hover:scale-110 transition-transform duration-500">
        <Heart className="w-8 h-8 fill-white" />
      </div>
    </div>
    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
  </motion.div>

  {/* Total Zakat Card - FIXED DESIGN */}
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-amber-500 to-orange-600 p-8 shadow-soft-xl text-white"
  >
    <div className="relative z-10 flex justify-between items-start">
      <div className="space-y-4">
        <p className="text-white/90 font-bold text-sm tracking-widest uppercase">Total Zakat Fitrah</p>
        <div>
          <h2 className="text-5xl font-black flex items-baseline gap-1">
            <span className="text-2xl font-medium">Rp</span>
            <AnimatedCounter value={totalZakat} />
          </h2>
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md mt-4 text-xs font-bold border border-white/30 shadow-sm">
            {zakatRecords.length} Pembayaran
          </div>
        </div>
      </div>
      <div className="p-4 bg-white/20 backdrop-blur-xl rounded-[2rem] shadow-inner group-hover:scale-110 transition-transform duration-500">
        <Wallet className="w-8 h-8 fill-white" />
      </div>
    </div>
    {/* Dekorasi Cahaya agar lebih terlihat mewah */}
    <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-300/20 rounded-full blur-3xl" />
    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-black/10 rounded-full blur-3xl" />
  </motion.div>
</div>

      <AnimatePresence mode="wait">
        {activeTab === 'sedekah' ? (
          <motion.div
            key="sedekah"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Sedekah Controls */}
            <div className="flex justify-between items-center bg-card p-4 rounded-[2rem] shadow-soft-sm border border-border/50">
              <h3 className="text-lg font-bold flex items-center gap-2 pl-2">
                <LayoutDashboard className="w-5 h-5 text-peach" /> Dashboard Sedekah
              </h3>
              {!showSedekahForm && (
                <Button onClick={() => setShowSedekahForm(true)} className="rounded-2xl gradient-primary shadow-lg shadow-primary/20">
                  <Plus className="w-5 h-5 mr-2" /> Tambah Sedekah
                </Button>
              )}
            </div>

            {/* Sedekah Form */}
            {showSedekahForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-card rounded-3xl shadow-soft-md p-6">
                <form onSubmit={handleSubmitSedekah} className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Catat Sedekah Baru</h3>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setShowSedekahForm(false)}>Batal</Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nominal (Rp)</Label>
                      <Input type="number" placeholder="50000" value={sedekahNominal} onChange={(e) => setSedekahNominal(e.target.value)} className="rounded-2xl" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Tujuan</Label>
                      <Input placeholder="Contoh: Masjid, Yayasan Yatim" value={sedekahTujuan} onChange={(e) => setSedekahTujuan(e.target.value)} className="rounded-2xl" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Kategori</Label>
                    <Input placeholder="Infaq / Jariyah / Bencana" value={sedekahKategori} onChange={(e) => setSedekahKategori(e.target.value)} className="rounded-2xl" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Catatan (opsional)</Label>
                    <Textarea placeholder="Tambahkan catatan..." value={sedekahNotes} onChange={(e) => setSedekahNotes(e.target.value)} className="rounded-2xl resize-none" rows={3} />
                  </div>
                  <Button type="submit" className="w-full rounded-2xl h-12 gradient-primary"><Heart className="w-5 h-5 mr-2" /> Simpan Sedekah</Button>
                </form>
              </motion.div>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Sedekah Chart */}
              <div className="bg-card rounded-3xl shadow-soft-md p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-peach/20 flex items-center justify-center text-peach-foreground">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div><h3 className="font-semibold text-lg">Tren Sedekah</h3><p className="text-sm text-muted-foreground italic">7 Hari Terakhir</p></div>
                </div>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Line type="monotone" dataKey="total" stroke="var(--color-peach)" strokeWidth={4} dot={false} activeDot={{ r: 8, strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sedekah Categories */}
              <div className="bg-card rounded-3xl shadow-soft-md p-6">
                <h3 className="font-bold mb-6 flex items-center gap-2"><LayoutDashboard className="w-5 h-5" /> Distribusi Kategori</h3>
                {Object.keys(categories).length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground"><Heart className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>Belum ada data</p></div>
                ) : (
                  <div className="space-y-5">
                    {Object.entries(categories).sort((a, b) => b[1] - a[1]).map(([kat, total]) => {
                      const pct = (total / totalSedekah) * 100;
                      return (
                        <div key={kat} className="space-y-2">
                          <div className="flex justify-between items-center"><span className="text-sm font-bold">{kat}</span><span className="text-sm font-black">Rp {total.toLocaleString('id-ID')}</span></div>
                          <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                            <motion.div className="h-full gradient-warm" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Sedekah History */}
            <div className="bg-card rounded-3xl shadow-soft-md p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2"><History className="w-5 h-5" /> Riwayat Sedekah</h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {sedekahRecords.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground italic">Belum ada riwayat</div>
                ) : (
                  sedekahRecords.slice().reverse().map((record) => (
                    <div key={record.id} className="p-5 rounded-2xl border-2 border-border hover:border-peach/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div><p className="font-black text-lg text-primary">Rp {record.nominal.toLocaleString('id-ID')}</p><p className="text-sm font-bold text-muted-foreground">{record.kategori}</p></div>
                        <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-lg">{record.date}</span>
                      </div>
                      <p className="text-sm font-medium">📍 {record.tujuan}</p>
                      {record.notes && <p className="text-xs text-muted-foreground mt-2 italic">"{record.notes}"</p>}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-accent/20 rounded-3xl p-6 border-2 border-accent/50 flex gap-4 items-start">
              <div className="p-3 bg-white rounded-2xl shadow-sm"><Info className="text-accent w-6 h-6" /></div>
              <div>
                <h4 className="font-bold mb-1">💝 Hadist Sedekah</h4>
                <p className="text-sm italic text-muted-foreground leading-relaxed">"Sedekah tidak akan mengurangi harta. Dan tidaklah seseorang yang memaafkan, melainkan Allah akan menambah kemuliaannya." — HR. Muslim</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="zakat"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Zakat Calculator / Form */}
              <div className="bg-card rounded-3xl shadow-soft-md p-6 h-fit">
                {zakatStep === 'calculate' ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center text-gold-foreground"><Calculator className="w-6 h-6" /></div>
                      <div><h3 className="font-bold text-lg">Kalkulator Zakat</h3><p className="text-sm text-muted-foreground">Hitung kewajiban fitrah keluarga</p></div>
                    </div>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2"><Label>Jumlah Anggota Keluarga</Label><Input type="number" value={jumlahAnggota} onChange={(e) => setJumlahAnggota(e.target.value)} className="rounded-2xl h-12" min="1" /></div>
                      <div className="space-y-2"><Label>Harga Beras Per Kg (Rp)</Label><Input type="number" value={hargaBeras} onChange={(e) => setHargaBeras(e.target.value)} className="rounded-2xl h-12" min="1" /></div>
                      <motion.div key={totalZakatNominalCalc} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-6 rounded-[2rem] bg-gold/10 border-2 border-gold/20 text-center">
                        <p className="text-sm text-gold-foreground font-bold mb-1 uppercase tracking-wider">Estimasi Zakat</p>
                        <h3 className="text-3xl font-black text-gold-foreground">Rp {totalZakatNominalCalc.toLocaleString('id-ID')}</h3>
                        <p className="text-[10px] text-gold-foreground/70 mt-1">{jumlahAnggota} Jiwa × 2.5kg × Rp {parseInt(hargaBeras).toLocaleString('id-ID')}</p>
                      </motion.div>
                      <Button onClick={handleCalculateZakat} className="w-full h-12 rounded-2xl gradient-gold font-black shadow-lg shadow-gold/20">Lanjut ke Pencatatan</Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitZakat} className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg">Detail Penyaluran</h3>
                      <Button variant="ghost" size="sm" onClick={() => setZakatStep('calculate')}>Ubah Hitungan</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Tanggal</Label><Input type="date" value={zakatTanggal} onChange={(e) => setZakatTanggal(e.target.value)} className="rounded-2xl" required /></div>
                      <div className="space-y-2"><Label>Jam</Label><Input type="time" value={zakatJam} onChange={(e) => setZakatJam(e.target.value)} className="rounded-2xl" required /></div>
                    </div>
                    <div className="space-y-2">
                      <Label>Bentuk Zakat</Label>
                      <Select value={zakatBentuk} onValueChange={(v:any) => setZakatBentuk(v)}>
                        <SelectTrigger className="rounded-2xl h-12"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="beras">Beras</SelectItem><SelectItem value="uang">Uang Tunai</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label>Lembaga Penyalur / Metode</Label><Input value={zakatMetode} onChange={(e) => setZakatMetode(e.target.value)} placeholder="Contoh: Masjid Al-Ikhlas" className="rounded-2xl h-12" required /></div>
                    <div className="space-y-2">
                      <Label>Bukti Pembayaran (Pilih dari Device)</Label>
                      <div className="flex flex-col gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                        />
                        <div className="flex gap-2">
                          <Input 
                            readOnly 
                            placeholder={zakatBuktiUrl ? "Bukti telah dipilih" : "Belum ada file dipilih"} 
                            className="rounded-2xl flex-1 bg-muted/50 cursor-default"
                          />
                          <Button 
                            type="button" 
                            variant="secondary" 
                            className="rounded-xl"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="w-4 h-4 mr-2" /> Unggah
                          </Button>
                        </div>
                        
                        {/* Preview Unggahan */}
                        {zakatBuktiUrl && (
                          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/20">
                            <img src={zakatBuktiUrl} alt="Preview" className="w-full h-full object-cover" />
                            <button 
                              onClick={() => setZakatBuktiUrl('')}
                              className="absolute top-1 right-1 bg-destructive p-1 rounded-full text-white"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2"><Label>Catatan</Label><Textarea value={zakatNotes} onChange={(e) => setZakatNotes(e.target.value)} placeholder="Tambahkan catatan..." className="rounded-2xl resize-none" rows={3} /></div>
                    <Button type="submit" className="w-full h-12 rounded-2xl gradient-primary font-bold shadow-lg shadow-primary/20"><CheckCircle className="mr-2 w-5 h-5" /> Simpan Pembayaran</Button>
                  </form>
                )}
              </div>

              {/* Zakat History */}
              <div className="bg-card rounded-3xl shadow-soft-md p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2"><History className="w-5 h-5" /> Riwayat Zakat</h3>
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {zakatRecords.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground italic">Belum ada riwayat</div>
                  ) : (
                    zakatRecords.slice().reverse().map((record) => (
                      <div key={record.id} className="p-5 rounded-2xl border-2 border-border hover:border-gold/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <p className="font-black text-lg text-primary">Rp {record.totalNominal.toLocaleString('id-ID')}</p>
                            <p className="text-sm font-bold text-muted-foreground">{record.jumlahOrang} Jiwa • {record.bentuk}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-lg">{record.date}</span>
                            
                            {/* Menampilkan bukti jika ada */}
                            {record.buktiUrl && (
                              <button 
                                onClick={() => window.open(record.buktiUrl, '_blank')}
                                className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline bg-primary/10 px-2 py-1 rounded-full"
                              >
                                <ImageIcon className="w-3 h-3" /> Lihat Bukti
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm font-medium">📍 {record.metodePenyaluran}</p>
                        
                        {/* Preview Kecil Bukti di Riwayat */}
                        {record.buktiUrl && (
                          <div 
                            className="mt-3 w-16 h-16 rounded-lg overflow-hidden border border-border cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => window.open(record.buktiUrl, '_blank')}
                          >
                            <img src={record.buktiUrl} alt="Bukti" className="w-full h-full object-cover" />
                          </div>
                        )}
                        
                        {record.notes && <p className="text-xs text-muted-foreground mt-2 italic">"{record.notes}"</p>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="bg-accent/20 rounded-3xl p-6 border-2 border-accent/50">
              <h4 className="font-bold mb-3 flex items-center gap-2"><Info className="w-5 h-5" /> Catatan Penting Zakat</h4>
              <ul className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground font-medium">
                <li className="flex gap-2"><span>•</span> Wajib dibayar sebelum sholat Idul Fitri</li>
                <li className="flex gap-2"><span>•</span> Besaran: 2.5 kg beras atau senilai uang per jiwa</li>
                <li className="flex gap-2"><span>•</span> Diberikan kepada 8 golongan mustahik</li>
                <li className="flex gap-2"><span>•</span> Niat dilakukan saat menyerahkan zakat</li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}