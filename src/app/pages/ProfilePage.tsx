import { useStore } from '../store/useStore';
import { Button } from '../components/ui/button';
import { User, LogOut, Mail, MapPin, Users, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, sholatRecords, puasaRecords, tilawahRecords, zakatRecords, sedekahRecords } = useStore();

  const handleLogout = () => {
    logout();
    toast.success('Logout berhasil');
    navigate('/auth');
  };

  if (!user) return null;

  const stats = [
    {
      label: 'Sholat Tercatat',
      value: sholatRecords.filter(r => r.completed).length,
      icon: '🙏',
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Hari Puasa',
      value: puasaRecords.filter(r => r.completed).length,
      icon: '🌙',
      color: 'bg-secondary/10 text-secondary-foreground',
    },
    {
      label: 'Tilawah',
      value: tilawahRecords.length,
      icon: '📖',
      color: 'bg-accent/20 text-accent-foreground',
    },
    {
      label: 'Zakat',
      value: `Rp ${zakatRecords.reduce((sum, r) => sum + r.totalNominal, 0).toLocaleString('id-ID')}`,
      icon: '💰',
      color: 'bg-gold/10 text-gold-foreground',
    },
    {
      label: 'Sedekah',
      value: `Rp ${sedekahRecords.reduce((sum, r) => sum + r.nominal, 0).toLocaleString('id-ID')}`,
      icon: '💝',
      color: 'bg-peach/10 text-peach-foreground',
    },
  ];

  return (
    <div className="min-h-full p-4 lg:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Profil</h1>
        <p className="text-muted-foreground">
          Informasi akun dan statistik ibadah Anda
        </p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl gradient-spiritual p-8 shadow-soft-lg"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-3xl bg-white/30 backdrop-blur-sm flex items-center justify-center">
            <User className="w-12 h-12" />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Mail className="w-4 h-4 opacity-70" />
                <span className="text-sm">{user.email}</span>
              </div>
              {user.city && (
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <MapPin className="w-4 h-4 opacity-70" />
                  <span className="text-sm">{user.city}</span>
                </div>
              )}
              {user.age && (
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Users className="w-4 h-4 opacity-70" />
                  <span className="text-sm">{user.age} tahun • {user.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</span>
                </div>
              )}
              {user.mazhab && (
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <BookOpen className="w-4 h-4 opacity-70" />
                  <span className="text-sm">Mazhab {user.mazhab}</span>
                </div>
              )}
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => navigate('/settings')}
            className="rounded-2xl bg-white/90 hover:bg-white"
          >
            Edit Profil
          </Button>
        </div>
      </motion.div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-2xl shadow-soft-md p-6"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card rounded-3xl shadow-soft-md p-6 space-y-4"
      >
        <h3 className="font-semibold">Tentang Ramadhan Care</h3>
        <p className="text-sm text-muted-foreground">
          Ramadhan Care adalah aplikasi pendamping ibadah Ramadhan yang membantu Anda 
          melacak dan meningkatkan kualitas ibadah dengan pendekatan yang modern, 
          empatik, dan personal.
        </p>
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Version 1.0.0 • Dibuat dengan ❤️ untuk memudahkan ibadah Anda
          </p>
        </div>
      </motion.div>

      {/* Logout Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full rounded-2xl h-12"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Keluar
        </Button>
      </motion.div>
    </div>
  );
}
