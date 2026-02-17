import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-spiritual">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-32 h-32 mx-auto rounded-3xl bg-white/30 backdrop-blur-sm flex items-center justify-center mb-8 shadow-soft-xl"
        >
          <span className="text-6xl">🌙</span>
        </motion.div>

        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Halaman Tidak Ditemukan</h2>
        <p className="text-muted-foreground mb-8">
          Maaf, halaman yang Anda cari tidak tersedia.
          <br />
          Mungkin sudah dipindahkan atau tidak pernah ada.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="rounded-2xl bg-white/90 hover:bg-white"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali
          </Button>
          <Button
            onClick={() => navigate('/')}
            className="rounded-2xl gradient-primary"
          >
            <Home className="w-5 h-5 mr-2" />
            Ke Beranda
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
