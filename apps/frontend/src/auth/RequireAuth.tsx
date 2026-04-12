import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useEffect } from 'react'

const RequireAuth = () => {
  const { isAuthenticated, initialize } = useAuth();
  const location = useLocation();

  // Initialize auth state on component mount
  useEffect(() => {
    initialize()
  }, [location])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />
  }

  return <Outlet />
}

export default RequireAuth