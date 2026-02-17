import { useState, useRef, useEffect } from 'react';
import { Camera, X, Check, Loader2, RefreshCw, FlipHorizontal, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion, AnimatePresence } from 'motion/react';

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  onCancel?: () => void;
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [now, setNow] = useState(new Date());

  // Update jam setiap detik
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Matikan kamera saat komponen ditutup
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    setLoading(true);
    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1080 }, height: { ideal: 1440 } }, 
        audio: false 
      });
      
      setStream(s);
      setIsActive(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play().catch(e => console.error("Play error:", e));
        }
      }, 150);

    } catch (err) {
      console.error("Gagal kamera:", err);
      alert("Pastikan izin kamera diberikan.");
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const v = videoRef.current;
      const c = canvasRef.current;
      
      // Menggunakan resolusi video asli
      c.width = v.videoWidth;
      c.height = v.videoHeight;
      const ctx = c.getContext('2d');
      
      if (ctx) {
        // 1. Gambar Video (Efek Mirror)
        ctx.translate(c.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(v, 0, 0, c.width, c.height);
        
        // Reset transform untuk menggambar teks (agar teks tidak terbalik)
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // 2. Tambahkan Gradasi Hitam di bawah (agar teks putih terbaca jelas)
        const gradient = ctx.createLinearGradient(0, c.height * 0.7, 0, c.height);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(1, 'rgba(0,0,0,0.5)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, c.height * 0.7, c.width, c.height * 0.3);

        // 3. Setup Font
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.shadowColor = "rgba(0,0,0,0.4)";
        ctx.shadowBlur = 10;

        // --- Gambar JAM (Besar) ---
        const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
        ctx.font = `bold ${Math.floor(c.height * 0.08)}px sans-serif`; // Font size proporsional
        ctx.fillText(timeStr, c.width / 2, c.height * 0.88);

        // --- Gambar TANGGAL (Kecil) ---
        const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' }).toUpperCase();
        ctx.font = `bold ${Math.floor(c.height * 0.02)}px sans-serif`; // Font size proporsional
        ctx.fillText(dateStr, c.width / 2, c.height * 0.93);

        // Simpan hasil
        setCapturedImage(c.toDataURL('image/jpeg', 0.85));
        
        // Stop kamera
        if (stream) stream.getTracks().forEach(t => t.stop());
        setIsActive(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/95 flex flex-col items-center justify-between py-10 px-4">
      <AnimatePresence mode="wait">
        {!isActive && !capturedImage ? (
          <motion.div key="1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full gap-6 text-center">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/20">
              <Camera className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Foto Sahur</h2>
              <p className="text-white/50 text-sm">Abadikan momen berkah sahurmu</p>
            </div>
            <Button onClick={startCamera} size="lg" className="rounded-2xl px-12 h-14 font-bold text-lg shadow-xl">
              {loading ? <Loader2 className="animate-spin mr-2" /> : <Camera className="mr-2" />}
              Buka Kamera
            </Button>
            <button onClick={onCancel} className="text-white/30 hover:text-white transition-colors">Batal</button>
          </motion.div>
        ) : isActive ? (
          <motion.div key="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-sm flex flex-col gap-6">
            <div className="flex justify-between items-center text-white px-2">
              <button onClick={onCancel} className="p-2 bg-white/10 rounded-full hover:bg-white/20"><X /></button>
              <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40">Live Viewfinder</span>
              <div className="p-2 bg-white/10 rounded-full"><Zap size={20} className="text-yellow-400 fill-yellow-400" /></div>
            </div>

            <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden border-4 border-white/10 shadow-2xl bg-neutral-900">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
              <div className="absolute inset-x-0 bottom-10 flex flex-col items-center pointer-events-none drop-shadow-md">
                <div className="text-white text-6xl font-bold tracking-tight">
                  {now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')}
                </div>
                <div className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                  {now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center mt-4">
              <button
                onClick={takePhoto}
                className="w-20 h-20 rounded-full bg-white ring-8 ring-white/10 active:scale-90 transition-transform shadow-2xl flex items-center justify-center"
              >
                <div className="w-16 h-16 rounded-full border-2 border-black/5" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="3" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm flex flex-col gap-6">
             <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl">
                <img src={capturedImage!} className="w-full h-full object-cover" alt="Preview sahur" />
                <div className="absolute top-6 left-6 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest">
                  Pratinjau Foto
                </div>
             </div>
             <div className="flex gap-4">
                <Button variant="outline" onClick={() => { setCapturedImage(null); startCamera(); }} className="flex-1 h-14 rounded-2xl bg-white/5 border-white/20 text-white hover:bg-white/10">
                  <RefreshCw className="mr-2 w-4 h-4" /> Ulangi
                </Button>
                <Button onClick={() => onCapture(capturedImage!)} className="flex-1 h-14 rounded-2xl font-bold text-lg shadow-lg">
                  <Check className="mr-2 w-5 h-5" /> Simpan
                </Button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}