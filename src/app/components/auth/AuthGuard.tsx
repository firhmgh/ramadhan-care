import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore'; 

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    isAuthenticated,
    user,
    isInitialized,
  } = useStore();

  useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated) {
      navigate('/auth', { replace: true, state: { from: location } });
      return;
    }

    if (user && !user.isProfileComplete) {
      if (location.pathname !== '/auth/setup') {
        navigate('/auth/setup', { replace: true });
      }
      return;
    }
    
  }, [isInitialized, isAuthenticated, user, location.pathname, navigate]);

  if (!isInitialized) return null;

  if (!isAuthenticated) return null;

  if (user && !user.isProfileComplete && location.pathname !== '/auth/setup') {
    return null;
  }

  return <>{children}</>;
}