import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useStore, Gender, Mazhab } from '../store/useStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { cn } from '../components/ui/utils';

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const { user, updateProfile } = useStore();
  const [step, setStep] = useState(1);
  
  const [gender, setGender] = useState<Gender | ''>('');
  const [mazhab, setMazhab] = useState<Mazhab | ''>('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');

  const handleNext = () => {
    if (step === 1 && !gender) {
      toast.error('Silakan pilih jenis kelamin');
      return;
    }
    if (step === 2 && !mazhab) {
      toast.error('Silakan pilih mazhab');
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleComplete = () => {
    if (!age || !city) {
      toast.error('Silakan lengkapi semua informasi');
      return;
    }

    updateProfile({
      gender: gender as Gender,
      mazhab: mazhab as Mazhab,
      age: parseInt(age),
      city,
      isProfileComplete: true,
    });

    toast.success('Profil berhasil dilengkapi!');
    navigate('/');
  };

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="bg-card rounded-3xl shadow-soft-xl p-8 glassmorphism">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Lengkapi Profil Anda</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Langkah {step} dari {totalSteps}
          </p>
          
          {/* Progress Bar */}
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <Label className="mb-4 block">Jenis Kelamin</Label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={cn(
                      "flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200",
                      gender === 'male'
                        ? "border-primary bg-primary/10 shadow-soft-md"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="text-4xl">👨</div>
                    <span className="font-medium">Laki-laki</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={cn(
                      "flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200",
                      gender === 'female'
                        ? "border-primary bg-primary/10 shadow-soft-md"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="text-4xl">👩</div>
                    <span className="font-medium">Perempuan</span>
                  </button>
                </div>
              </div>

              <Button
                onClick={handleNext}
                className="w-full rounded-2xl h-12"
              >
                Lanjut
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="mazhab">Mazhab</Label>
                <Select value={mazhab} onValueChange={(value) => setMazhab(value as Mazhab)}>
                  <SelectTrigger id="mazhab" className="rounded-2xl">
                    <SelectValue placeholder="Pilih mazhab Anda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hanafi">Hanafi</SelectItem>
                    <SelectItem value="Maliki">Maliki</SelectItem>
                    <SelectItem value="Syafi'i">Syafi'i</SelectItem>
                    <SelectItem value="Hanbali">Hanbali</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Informasi ini akan membantu kami memberikan panduan ibadah yang sesuai
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="rounded-2xl h-12"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Kembali
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 rounded-2xl h-12"
                >
                  Lanjut
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="age">Usia</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Masukkan usia Anda"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="rounded-2xl"
                  min="1"
                  max="120"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Kota</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="Masukkan kota Anda"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="rounded-2xl"
                />
                <p className="text-xs text-muted-foreground">
                  Untuk menampilkan jadwal sholat yang akurat
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="rounded-2xl h-12"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Kembali
                </Button>
                <Button
                  onClick={handleComplete}
                  className="flex-1 rounded-2xl h-12 gradient-primary"
                >
                  Selesai
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
