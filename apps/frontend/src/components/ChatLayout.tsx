import { ReactNode, useEffect } from 'react'
import { Box, Button, Avatar, Typography, InputBase } from '@mui/material'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { useNavigate } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import ContrastIcon from '@mui/icons-material/Contrast'
import SettingsIcon from '@mui/icons-material/Settings'
import SearchIcon from '@mui/icons-material/Search'

interface ChatLayoutProps {
  sidebar: ReactNode
  children: ReactNode
}

export const ChatLayout = ({ sidebar, children }: ChatLayoutProps) => {
  const { user, isAuthenticated } = useAuth()
  const { darkMode, toggle } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    const html = document.documentElement
    if (darkMode) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }, [darkMode])

  const handleNewChat = () => {
    window.dispatchEvent(new CustomEvent('new-chat'))
  }

  const handleToggleDarkMode = () => {
    toggle()
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: darkMode ? '#11211d' : '#f6f8f7' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 260,
          flexShrink: 0,
          borderRight: '1px solid',
          borderColor: darkMode ? '#3D3D3D' : '#e2e8f0',
          bgcolor: darkMode ? 'rgba(0,0,0,0.2)' : '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Sidebar Header */}
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Logo + Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: 1,
                bgcolor: '#10a27e',
                color: 'white',
              }}
            >
              <SmartToyIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: darkMode ? 'white' : '#0f172a',
                  lineHeight: 1.2,
                }}
              >
                AI Chat
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  color: darkMode ? 'rgba(16,162,126,0.7)' : '#64748b',
                  fontWeight: 500,
                }}
              >
                v2.0 Pro
              </Typography>
            </Box>
          </Box>

          {/* New Chat Button */}
          <Button
            onClick={handleNewChat}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              height: 44,
              borderRadius: 1.5,
              bgcolor: '#10a27e',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.875rem',
              textTransform: 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              '&:hover': { bgcolor: 'rgba(16,162,126,0.9)' },
            }}
          >
            <AddIcon sx={{ fontSize: 20 }} />
            <span>New Chat</span>
          </Button>
        </Box>

        {/* Sidebar Content - Recent Chats */}
        <Box sx={{ flex: 1, overflowY: 'auto', px: 1, '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-track': { bgcolor: 'transparent' }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(16,162,126,0.2)', borderRadius: 10 } }}>
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography
              sx={{
                fontSize: '0.625rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: darkMode ? '#94a3b8' : '#64748b',
              }}
            >
              Recent Chats
            </Typography>
          </Box>
          {sidebar}
        </Box>

        {/* Sidebar Footer */}
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: darkMode ? '#3D3D3D' : '#e2e8f0', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Button
            onClick={handleToggleDarkMode}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2,
              py: 1.5,
              borderRadius: 1,
              color: darkMode ? '#cbd5e1' : '#475569',
              textTransform: 'none',
              '&:hover': { bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
            }}
          >
            <ContrastIcon sx={{ fontSize: 20 }} />
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
              Dark / Light Mode
            </Typography>
          </Button>

          {isAuthenticated ? (
            <Button
              onClick={() => navigate('/profile')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 1.5,
                borderRadius: 1,
                color: darkMode ? '#cbd5e1' : '#475569',
                textTransform: 'none',
                '&:hover': { bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
              }}
            >
              <SettingsIcon sx={{ fontSize: 20 }} />
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                Settings
              </Typography>
            </Button>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 1.5,
                borderRadius: 1,
                color: darkMode ? '#cbd5e1' : '#475569',
                textTransform: 'none',
                '&:hover': { bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
              }}
            >
              <SettingsIcon sx={{ fontSize: 20 }} />
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                Settings
              </Typography>
            </Button>
          )}
        </Box>
      </Box>

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
              <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
              <InputBase
                placeholder="Search messages..."
                sx={{
                  fontSize: '0.875rem',
                  width: 160,
                  color: darkMode ? 'white' : '#0f172a',
                  '& input::placeholder': { color: '#64748b', opacity: 1 },
                }}
              />
            </Box>

            {/* Divider */}
            <Box sx={{ width: 1, height: 24, bgcolor: darkMode ? '#3D3D3D' : '#e2e8f0' }} />

            {/* User Avatar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid transparent',
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
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#10a27e' }}>
                    {user?.displayName?.[0] || 'U'}
                  </Avatar>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: 'hidden' }}>{children}</Box>
      </Box>
    </Box>
  )
}