import { useEffect } from 'react';
import { Outlet } from 'react-router-dom'; 
import { useStore } from '../store/useStore';
import { Loader2 } from 'lucide-react';

export default function GlobalLayout() {
  const { initialize, isInitialized } = useStore();

  useEffect(() => {
    const cleanup = initialize();
    return () => cleanup();
  }, [initialize]);

  if (!isInitialized) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background gap-4">
        {/* Ikon Animasi Pulse */}
        <div className="w-16 h-16 rounded-3xl gradient-spiritual flex items-center justify-center shadow-lg animate-pulse">
          <span className="text-3xl">🌙</span>
        </div>
        
        {/* Status Loading Text */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <p className="text-sm font-medium">Menyiapkan keberkahan...</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}