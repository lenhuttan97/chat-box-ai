import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useEffect, useState } from 'react'

const RequireAuth = () => {
  const { isAuthenticated, initialize, isLoading } = useAuth();
  const location = useLocation();
  const [initializing, setInitializing] = useState(true);

  // Initialize auth state on component mount
  useEffect(() => {
    const initAuth = async () => {
      await initialize();
      setInitializing(false);
    };

    initAuth();
  }, []);

  // Show loading state while initializing
  if (initializing || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />
  }

  return <Outlet />
}

export default RequireAuth