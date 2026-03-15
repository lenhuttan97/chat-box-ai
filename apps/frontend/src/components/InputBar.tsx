import { useState, KeyboardEvent } from 'react'
import { Box, TextField, IconButton, CircularProgress } from '@mui/material'
import { Send as SendIcon } from '@mui/icons-material'
import { useTheme } from '../hooks/useTheme'

interface InputBarProps {
  onSend: (message: string) => void
  loading?: boolean
}

export const InputBar = ({ onSend, loading }: InputBarProps) => {
  const [message, setMessage] = useState('')
  const { darkMode } = useTheme()

  const handleSend = () => {
    if (message.trim() && !loading) {
      onSend(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Box
      sx={{
        p: 2,
        borderTop: '1px solid',
        borderColor: darkMode ? '#3D3D3D' : '#e2e8f0',
        bgcolor: darkMode ? 'rgba(0,0,0,0.2)' : '#f8fafc',
      }}
    >
      <Box sx={{ display: 'flex', gap: 1, maxWidth: 800, mx: 'auto' }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : '#ffffff',
              color: darkMode ? 'white' : '#0f172a',
              '& fieldset': { borderColor: darkMode ? '#3D3D3D' : '#e2e8f0' },
              '&:hover fieldset': { borderColor: darkMode ? '#10a27e' : '#cbd5e1' },
              '&.Mui-focused fieldset': { borderColor: '#10a27e' },
              '& input::placeholder': { color: '#64748b', opacity: 1 },
            },
          }}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={!message.trim() || loading}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' },
            '&:disabled': { bgcolor: 'action.disabledBackground' },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
        </IconButton>
      </Box>
    </Box>
  )
}
