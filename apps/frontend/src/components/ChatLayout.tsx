import { ReactNode } from 'react'
import { Box, Button, Avatar, Typography } from '@mui/material'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

interface ChatLayoutProps {
  sidebar: ReactNode
  children: ReactNode
}

export const ChatLayout = ({ sidebar, children }: ChatLayoutProps) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      <Box
        sx={{
          width: 280,
          borderRight: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header with user info */}
        <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar 
                src={user.photoURL || '/default-avatar.png'} 
                alt={user.displayName || 'User'} 
                sx={{ width: 40, height: 40 }}
              />
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {user.displayName || 'User'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography variant="body2" textAlign="center">
              Loading...
            </Typography>
          )}
        </Box>
        
        {/* Sidebar content */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          {sidebar}
        </Box>
        
        {/* Logout button at bottom */}
        <Box sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider', marginTop: 'auto' }}>
          <Button
            variant="text"
            color="error"
            onClick={handleLogout}
            sx={{ width: '100%', textAlign: 'left' }}
          >
            Logout
          </Button>
        </Box>
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</Box>
    </Box>
  )
}
