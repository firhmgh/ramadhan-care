import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useStore } from '../../store/useStore';

export default function GuestGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { isAuthenticated, loading, user } = useStore();

  useEffect(() => {
    if (loading) return;

    if (isAuthenticated) {
      if (user && !user.isProfileComplete) {
        navigate('/auth/setup', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, loading, navigate, user]);

  if (loading || isAuthenticated) return null;

  return <>{children}</>;
}