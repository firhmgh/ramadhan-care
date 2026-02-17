import { Outlet, useNavigate, useLocation } from 'react-router';
import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Home, Calendar, Wallet, BookHeart, MessageCircle, User, Menu, Settings } from 'lucide-react';
import { cn } from '../components/ui/utils';
import { motion } from 'motion/react';
import { DevTools } from '../components/DevTools';

const navigation = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Calendar', path: '/calendar', icon: Calendar },
  { name: 'Zakat', path: '/zakat', icon: Wallet },
  { name: 'Journal', path: '/journal', icon: BookHeart },
  { name: 'Chatbot', path: '/chatbot', icon: MessageCircle },
  { name: 'Profile', path: '/profile', icon: User },
];

export default function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    } else if (user && !user.isProfileComplete) {
      navigate('/auth/setup');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || (user && !user.isProfileComplete)) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r border-border bg-card">
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="w-10 h-10 rounded-2xl gradient-spiritual flex items-center justify-center">
            <span className="text-xl">🌙</span>
          </div>
          <div>
            <h1 className="font-semibold text-lg">Ramadhan Care</h1>
            <p className="text-xs text-muted-foreground">Spiritual Journey</p>
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
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 space-y-1 border-t border-border">
          <button
            onClick={() => navigate('/settings')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200",
              location.pathname === '/settings'
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl gradient-spiritual flex items-center justify-center">
              <span className="text-lg">🌙</span>
            </div>
            <h1 className="font-semibold">Ramadhan Care</h1>
          </div>
          <button className="p-2 rounded-xl hover:bg-accent transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto pb-20 lg:pb-0">
          <Outlet />
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border glassmorphism">
          <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
            {navigation.slice(0, 5).map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-0",
                    isActive && "bg-primary/10"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "text-xs font-medium transition-colors truncate",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {item.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeMobileNav"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </main>

      {/* Add DevTools before closing div */}
      <DevTools />
    </div>
  );
}