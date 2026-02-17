import { useState, useRef, useEffect } from 'react';
import { Camera, X, Loader2, Zap } from 'lucide-react';
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
        video: { facingMode: "user" }, // Utamakan kamera depan
        audio: false 
      });
      
      setStream(s);
      setIsActive(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play().catch(e => console.error("Play error:", e));
        }
      }, 100);

    } catch (err) {
      console.error("Gagal kamera:", err);
      alert("Gagal mengakses kamera. Pastikan izin diberikan.");
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const v = videoRef.current;
      const c = canvasRef.current;
      
      // Gunakan resolusi native dari sensor kamera
      c.width = v.videoWidth;
      c.height = v.videoHeight;
      
      const ctx = c.getContext('2d');
      if (ctx) {
        // 1. Gambar Video (Mirroring agar sesuai preview)
        ctx.save();
        ctx.translate(c.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(v, 0, 0, c.width, c.height);
        ctx.restore();

        // 2. Setup Font & Styling (Proporsional terhadap resolusi foto)
        // Rasio ukuran font diambil dari perbandingan tampilan UI
        const timeFontSize = Math.floor(c.height * 0.08); // Ukuran teks jam
        const dateFontSize = Math.floor(timeFontSize * 0.22); // Ukuran teks tanggal
        const paddingBottom = c.height * 0.12; // Jarak dari bawah foto

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // A. Gambar Teks JAM (Bold White)
        ctx.fillStyle = "white";
        ctx.font = `bold ${timeFontSize}px sans-serif`;
        const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
        const timeY = c.height - paddingBottom;
        ctx.fillText(timeStr, c.width / 2, timeY);

        // B. Gambar Teks TANGGAL (Semi-transparent White, Uppercase)
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.font = `bold ${dateFontSize}px sans-serif`;
        const dateStr = now.toLocaleDateString('id-ID', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'short' 
        }).toUpperCase();
        
        // Letakkan tanggal sedikit di bawah jam (gap 70% dari ukuran font jam)
        const dateY = timeY + (timeFontSize * 0.6);
        ctx.fillText(dateStr, c.width / 2, dateY);

        // Konversi ke Data URL
        setCapturedImage(c.toDataURL('image/jpeg', 0.9));
        
        // Matikan stream kamera
        if (stream) stream.getTracks().forEach(t => t.stop());
        setIsActive(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-between py-10 px-4 font-sans">
      <AnimatePresence mode="wait">
        {!isActive && !capturedImage ? (
          /* TAMPILAN AWAL (STANDBY) */
          <motion.div key="1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full gap-6">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <Camera className="w-10 h-10 text-primary" />
            </div>
            <Button onClick={startCamera} size="lg" className="rounded-full px-10 h-14 font-bold text-lg">
              {loading ? <Loader2 className="animate-spin mr-2" /> : <Camera className="mr-2" />}
              Buka Kamera
            </Button>
            <button onClick={onCancel} className="text-white/40">Tutup</button>
          </motion.div>
        ) : isActive ? (
          /* TAMPILAN LIVE VIEW */
          <motion.div key="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-sm flex flex-col gap-6">
            <div className="flex justify-between items-center text-white px-2">
              <button onClick={onCancel} className="p-2 bg-white/10 rounded-full"><X /></button>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-50">Live Viewfinder</span>
              <div className="p-2 bg-white/10 rounded-full"><Zap size={20} className="text-yellow-400 fill-yellow-400" /></div>
            </div>

            <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden border-4 border-white/10 bg-neutral-900">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
              {/* Overlay Watermark (Preview) */}
              <div className="absolute inset-x-0 bottom-10 flex flex-col items-center pointer-events-none select-none">
                <div className="text-white text-5xl font-bold leading-tight">
                  {now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')}
                </div>
                <div className="text-white/60 text-[10px] font-bold uppercase tracking-wider mt-1">
                  {now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center mt-4">
              <button
                onClick={takePhoto}
                className="w-20 h-20 rounded-full bg-white ring-8 ring-white/10 active:scale-90 transition-transform shadow-xl"
              />
            </div>
          </motion.div>
        ) : (
          /* TAMPILAN REVIEW HASIL FOTO */
          <motion.div key="3" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm flex flex-col gap-6">
             <div className="aspect-[3/4] rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl bg-black">
                <img src={capturedImage!} className="w-full h-full object-cover" alt="Captured" />
             </div>
             <div className="flex gap-4">
                <Button 
                  variant="secondary" 
                  onClick={() => { setCapturedImage(null); startCamera(); }} 
                  className="flex-1 h-14 rounded-2xl bg-white/10 text-white border-none hover:bg-white/20"
                >
                  Ulangi
                </Button>
                <Button 
                  onClick={() => onCapture(capturedImage!)} 
                  className="flex-1 h-14 rounded-2xl font-bold shadow-lg"
                >
                  Simpan
                </Button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Canvas tersembunyi untuk proses burning watermark */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}