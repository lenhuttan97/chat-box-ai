import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUser } from "../hooks/useUser";
import { useEffect, useState } from "react";

const RequireAuth = () => {
  const { isAuthenticated, initialize, isLoading: authLoading, user } = useAuth();
  const { loadUser, currentUser, logout, isLoading: userLoading } = useUser();
  const location = useLocation();
  const [initializing, setInitializing] = useState(true);

  const initAuth = async () => {
    // Initialize auth state first
    await initialize();

    // Load user profile data after auth is initialized
    if (isAuthenticated) {
      await loadUser();
    }

    setInitializing(false);
  };

  // Initialize auth state on component mount
  useEffect(() => {
    initAuth();
    if (!isAuthenticated) {
      logout();
    }
  }, [location, isAuthenticated]);

  // Show loading state while initializing
  if (initializing || authLoading || userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: window.location.pathname }}
      />
    );
  }

  return <Outlet />;
};

export default RequireAuth;