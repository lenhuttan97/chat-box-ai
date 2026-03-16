import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useEffect } from 'react'

const RequireAuth = () => {
  const { isAuthenticated, initialize } = useAuth()

  // Initialize auth state on component mount
  useEffect(() => {
    initialize()
  }, [initialize])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />
  }

  return <Outlet />
}

export default RequireAuth