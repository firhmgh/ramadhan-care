import { cn } from '../components/ui/utils';
import { motion } from 'motion/react';

export type MoodType = 'sangat-baik' | 'baik' | 'biasa' | 'kurang-baik' | 'buruk';

interface MoodOption {
  value: MoodType;
  emoji: string;
  label: string;
  color: string;
}

const moods: MoodOption[] = [
  { value: 'sangat-baik', emoji: '😊', label: 'Sangat Baik', color: 'bg-success/20 hover:bg-success/30 text-success-foreground' },
  { value: 'baik', emoji: '🙂', label: 'Baik', color: 'bg-primary/20 hover:bg-primary/30 text-primary-foreground' },
  { value: 'biasa', emoji: '😐', label: 'Biasa', color: 'bg-accent/40 hover:bg-accent/50 text-accent-foreground' },
  { value: 'kurang-baik', emoji: '😔', label: 'Kurang Baik', color: 'bg-warning/20 hover:bg-warning/30 text-warning-foreground' },
  { value: 'buruk', emoji: '😢', label: 'Buruk', color: 'bg-destructive/20 hover:bg-destructive/30 text-destructive-foreground' },
];

interface MoodSelectorProps {
  value: MoodType | null;
  onChange: (mood: MoodType) => void;
}

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Bagaimana perasaan Anda hari ini?</label>
      <div className="flex flex-wrap gap-2">
        {moods.map((mood) => {
          const isSelected = value === mood.value;
          return (
            <motion.button
              key={mood.value}
              type="button"
              onClick={() => onChange(mood.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all duration-200",
                isSelected
                  ? "border-primary shadow-soft-md"
                  : "border-transparent",
                mood.color
              )}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-xs font-medium">{mood.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
