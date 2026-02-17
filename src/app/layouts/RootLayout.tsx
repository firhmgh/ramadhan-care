import { Outlet, useNavigate, useLocation } from 'react-router';
import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Home, Calendar, Wallet, MessageCircle, User, Menu, Settings, ClipboardList } from 'lucide-react';
import { cn } from '../components/ui/utils';
import { motion } from 'motion/react';
import { DevTools } from '../components/DevTools';

const navigation = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Calendar', path: '/calendar', icon: Calendar },
  { name: 'Agenda', path: '/agenda', icon: ClipboardList },
  { name: 'Filantropi', path: '/filantropi', icon: Wallet },
  { name: 'Refleksi', path: '/reflection', icon: MessageCircle },
  { name: 'Profile', path: '/profile', icon: User }, 
];

export default function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, initialize, loading  } = useStore(); // Menambahkan initialize dari store

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      navigate('/auth');
    } else if (user && !user.isProfileComplete) {
      if (location.pathname !== '/auth/setup') {
        navigate('/auth/setup');
      }
    }
  }, [isAuthenticated, user, navigate, location.pathname, loading]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin text-4xl">🌙</div>
          <p className="text-sm text-muted-foreground animate-pulse">Menyiapkan keberkahan...</p>
        </div>
      </div>
    );
  }
  if (!isAuthenticated || (user && !user.isProfileComplete)) {
    return null; 
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r border-border bg-card">
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="w-10 h-10 rounded-2xl gradient-spiritual flex items-center justify-center shadow-lg">
            <span className="text-xl">🌙</span>
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">Ramadhan Care</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Spiritual Journey</p>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button 
                key={item.path} 
                onClick={() => navigate(item.path)} 
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all", 
                  isActive ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:bg-accent"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-bold text-sm">{item.name}</span>
                {isActive && (
                  <motion.div layoutId="activeNav" className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <button 
            onClick={() => navigate('/settings')} 
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-2xl", 
              location.pathname === '/settings' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"
            )}
          >
            <Settings className="w-5 h-5" />
            <span className="font-bold text-sm">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-border bg-card/80 backdrop-blur-lg">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌙</span>
            <h1 className="font-bold tracking-tight">Ramadhan Care</h1>
          </div>
          <button className="p-2 rounded-xl bg-accent/50">
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-auto pb-24 lg:pb-0 scrollbar-hide">
          <Outlet />
        </div>

        {/* Bottom Navigation - Mobile */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/90 border-t border-border backdrop-blur-xl z-50">
          <div className="flex items-center justify-between px-1 py-3 safe-area-inset-bottom">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex flex-col items-center gap-1 flex-1 min-w-0 relative transition-all duration-300",
                    isActive ? "text-primary translate-y-[-4px]" : "text-muted-foreground opacity-70"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-2xl transition-colors",
                    isActive ? "bg-primary/10" : ""
                  )}>
                    <item.icon className={cn("w-5 h-5 transition-transform", isActive ? "scale-110" : "")} />
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold truncate w-full text-center px-1 transition-all",
                    isActive ? "opacity-100" : "opacity-80 font-medium"
                  )}>
                    {item.name}
                  </span>
                  {isActive && (
                    <motion.div layoutId="activeMobileNav" className="absolute -bottom-1 w-6 h-1 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </main>

      <DevTools />
    </div>
  );
}