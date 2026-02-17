import { useState } from 'react';
import { Button } from './ui/button';
import { Code, Trash2, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { seedSampleData, clearAllData } from '../utils/seedData';
import { toast } from 'sonner';

/**
 * Developer Tools Panel
 * Only shows in development mode
 * Provides quick actions for testing
 */
export function DevTools() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Only show in development
  if (import.meta.env.PROD) return null;

  const handleSeed = () => {
    seedSampleData();
    toast.success('Sample data berhasil ditambahkan!');
  };

  const handleClear = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua data?')) {
      clearAllData();
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-4 lg:bottom-4 lg:right-4 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
        title="Developer Tools"
      >
        <Code className="w-5 h-5" />
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-40 right-4 lg:bottom-20 lg:right-4 z-50 bg-card rounded-2xl shadow-2xl border-2 border-purple-500 p-4 w-64"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Dev Tools</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleSeed}
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs rounded-xl"
              >
                <Database className="w-3.5 h-3.5 mr-2" />
                Seed Sample Data
              </Button>

              <Button
                onClick={handleClear}
                variant="destructive"
                size="sm"
                className="w-full justify-start text-xs rounded-xl"
              >
                <Trash2 className="w-3.5 h-3.5 mr-2" />
                Clear All Data
              </Button>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                💡 Tools ini hanya muncul di development mode
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
