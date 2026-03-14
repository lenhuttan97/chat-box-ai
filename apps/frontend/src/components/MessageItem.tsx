import { Box, Typography } from '@mui/material'
import ReactMarkdown from 'react-markdown'
import { Chat as ChatIcon, SmartToy as BotIcon } from '@mui/icons-material'

interface MessageItemProps {
  role: 'user' | 'assistant'
  content: string
}

export const MessageItem = ({ role, content }: MessageItemProps) => {
  const isUser = role === 'user'

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        p: 2,
        bgcolor: isUser ? 'transparent' : 'background.paper',
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          bgcolor: isUser ? 'primary.main' : 'secondary.main',
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
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
          {isUser ? 'You' : 'AI'}
        </Typography>
        <Box sx={{ '& p': { m: 0, mb: 1 } }}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </Box>
      </Box>
    </Box>
  )
}
