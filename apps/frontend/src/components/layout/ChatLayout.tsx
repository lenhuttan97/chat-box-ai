import { ReactNode, useEffect, useState } from 'react'
import { Box, Typography, InputBase } from '@mui/material'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import { useNavigate } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import LoginIcon from '@mui/icons-material/Login'
import Avatar from '@mui/material/Avatar'
import { ThemeModal } from '../common/ThemeModal'
import { Sidebar } from './Sidebar'

interface ChatLayoutProps {
  children: ReactNode
}

export const ChatLayout = ({ children }: ChatLayoutProps) => {
  const { user, isAuthenticated } = useAuth()
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const [themeModalOpen, setThemeModalOpen] = useState(false)

  useEffect(() => {
    const html = document.documentElement
    if (darkMode) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }

    // Listen for theme modal event
    const handleOpenThemeModal = () => setThemeModalOpen(true)
    window.addEventListener('open-theme-modal', handleOpenThemeModal)
    return () => window.removeEventListener('open-theme-modal', handleOpenThemeModal)
  }, [darkMode])

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: darkMode ? '#11211d' : '#f6f8f7' }}>
      {/* Sidebar - Using new premium Sidebar component */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* Header */}
        <Box
          sx={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 8,
            borderBottom: '1px solid',
            borderColor: darkMode ? '#3D3D3D' : '#e2e8f0',
            zIndex: 10,
          }}
        >
          {/* Center - Title */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <Typography
              sx={{
                fontSize: '1rem',
                fontWeight: 600,
                color: darkMode ? 'white' : '#0f172a',
              }}
            >
              New Conversation
            </Typography>
          </Box>

          {/* Right - Search + User */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Search */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                borderRadius: 1,
                px: 1,
                py: 0.5,
              }}
            >
              <SearchIcon sx={{ color: darkMode ? '#94a3b8' : '#64748b', fontSize: 20 }} />
              <InputBase
                placeholder="Search messages..."
                sx={{
                  fontSize: '0.875rem',
                  width: 160,
                  color: darkMode ? 'white' : '#0f172a',
                  '& input::placeholder': { color: darkMode ? '#94a3b8' : '#64748b', opacity: 1 },
                }}
              />
            </Box>

            {/* Divider */}
            <Box sx={{ width: 1, height: 24, bgcolor: darkMode ? '#3D3D3D' : '#e2e8f0' }} />

            {/* User Avatar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => isAuthenticated ? navigate('/profile') : navigate('/login')}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid',
                  borderColor: darkMode ? '#3D3D3D' : '#e2e8f0',
                  '&:hover': { borderColor: '#10a27e' },
                }}
              >
                {isAuthenticated && user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#10a27e', color: 'white' }}>
                    <LoginIcon sx={{ fontSize: 20 }} />
                  </Avatar>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: 'hidden' }}>{children}</Box>
      </Box>

      <ThemeModal open={themeModalOpen} onClose={() => setThemeModalOpen(false)} />
    </Box>
  )
}