import { Box, Typography } from '@mui/material'
import ReactMarkdown from 'react-markdown'
import { Chat as ChatIcon, SmartToy as BotIcon } from '@mui/icons-material'
import { useTheme } from '../hooks/useTheme'

interface MessageItemProps {
  role: 'user' | 'assistant'
  content: string
}

export const MessageItem = ({ role, content }: MessageItemProps) => {
  const { darkMode } = useTheme()
  const isUser = role === 'user'

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        p: 2,
        bgcolor: isUser ? 'transparent' : darkMode ? 'rgba(0,0,0,0.2)' : '#f8fafc',
        '&:hover': { bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          bgcolor: isUser ? '#10a27e' : '#6366f1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {isUser ? (
          <ChatIcon sx={{ fontSize: 18, color: 'white' }} />
        ) : (
          <BotIcon sx={{ fontSize: 18, color: 'white' }} />
        )}
      </Box>
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <Typography 
          variant="caption" 
          sx={{ mb: 0.5, display: 'block', color: darkMode ? '#94a3b8' : '#64748b' }}
        >
          {isUser ? 'You' : 'AI'}
        </Typography>
        <Box 
          sx={{ 
            '& p': { m: 0, mb: 1, color: darkMode ? 'white' : '#0f172a' },
            '& h1, & h2, & h3, & h4, & h5, & h6': { color: darkMode ? 'white' : '#0f172a' },
            '& ul, & ol': { color: darkMode ? 'white' : '#0f172a' },
            '& li': { color: darkMode ? 'white' : '#0f172a' },
            '& span': { color: darkMode ? 'white' : '#0f172a' },
            '& code': { bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : '#f1f5f9', px: 0.5, borderRadius: 0.5, color: darkMode ? '#e2e8f0' : '#0f172a' },
            '& pre': { bgcolor: darkMode ? 'rgba(0,0,0,0.3)' : '#f1f5f9', p: 1, borderRadius: 1, overflow: 'auto' },
            '& pre code': { bgcolor: 'transparent', p: 0 },
            '& a': { color: darkMode ? '#60a5fa' : '#3b82f6' },
          }}
        >
          <ReactMarkdown>{content}</ReactMarkdown>
        </Box>
      </Box>
    </Box>
  )
}
