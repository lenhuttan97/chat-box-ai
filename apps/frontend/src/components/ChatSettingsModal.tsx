import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Slider,
  Typography,
  Box,
  IconButton,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { useConversations } from '../hooks/useConversations'
import { useTheme } from '../hooks/useTheme'

interface ChatSettingsModalProps {
  open: boolean
  onClose: () => void
}

export const ChatSettingsModal = ({ open, onClose }: ChatSettingsModalProps) => {
  const { currentConversation, updateConversation } = useConversations()
  const { darkMode } = useTheme()

  const [name, setName] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(2048)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (currentConversation) {
      setName(currentConversation.name)
      setSystemPrompt(currentConversation.systemPrompt || '')
      setTemperature(currentConversation.temperature || 0.7)
      setMaxTokens(currentConversation.maxTokens || 2048)
    }
  }, [currentConversation])

  const handleSave = async () => {
    if (!currentConversation) return

    setLoading(true)
    try {
      await updateConversation(currentConversation.id, {
        name,
        systemPrompt,
        temperature,
        maxTokens,
      })
      onClose()
    } catch (error) {
      console.error('Failed to update conversation:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTemperatureChange = (_: Event, value: number | number[]) => {
    setTemperature(value as number)
  }

  const handleMaxTokensChange = (_: Event, value: number | number[]) => {
    setMaxTokens(value as number)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: darkMode ? '#1e293b' : 'white',
          color: darkMode ? 'white' : '#0f172a',
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: darkMode ? 'white' : '#0f172a' }}>
        Chat Settings
        <IconButton onClick={onClose} size="small" sx={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          <TextField
            label="Conversation Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            InputLabelProps={{ sx: { color: darkMode ? '#94a3b8' : '#64748b' } }}
            InputProps={{
              sx: {
                color: darkMode ? 'white' : '#0f172a',
                bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : '#ffffff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: darkMode ? '#3D3D3D' : '#e2e8f0',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: darkMode ? '#10a27e' : '#cbd5e1',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#10a27e',
                },
              },
            }}
          />

          <TextField
            label="System Prompt (AI Role/Identity)"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            fullWidth
            multiline
            rows={4}
            placeholder="Define how the AI should behave..."
            size="small"
            InputLabelProps={{ sx: { color: darkMode ? '#94a3b8' : '#64748b' } }}
            InputProps={{
              sx: {
                color: darkMode ? 'white' : '#0f172a',
                bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : '#ffffff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: darkMode ? '#3D3D3D' : '#e2e8f0',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: darkMode ? '#10a27e' : '#cbd5e1',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#10a27e',
                },
              },
            }}
            FormHelperTextProps={{
              sx: { color: darkMode ? '#94a3b8' : '#64748b' },
            }}
          />

          <Box>
            <Typography gutterBottom sx={{ color: darkMode ? 'white' : '#0f172a' }}>
              Temperature: {temperature.toFixed(1)}
            </Typography>
            <Slider
              value={temperature}
              onChange={handleTemperatureChange}
              min={0}
              max={1}
              step={0.1}
              marks={[
                { value: 0, label: '0' },
                { value: 0.5, label: '0.5' },
                { value: 1, label: '1' },
              ]}
              valueLabelDisplay="auto"
              sx={{
                color: '#10a27e',
                '& .MuiSlider-markLabel': {
                  color: darkMode ? '#94a3b8' : '#64748b',
                },
              }}
            />
            <Typography variant="caption" sx={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
              Lower = more focused, Higher = more creative
            </Typography>
          </Box>

          <Box>
            <Typography gutterBottom sx={{ color: darkMode ? 'white' : '#0f172a' }}>
              Max Tokens: {maxTokens}
            </Typography>
            <Slider
              value={maxTokens}
              onChange={handleMaxTokensChange}
              min={256}
              max={8192}
              step={256}
              marks={[
                { value: 256, label: '256' },
                { value: 4096, label: '4096' },
                { value: 8192, label: '8192' },
              ]}
              valueLabelDisplay="auto"
              sx={{
                color: '#10a27e',
                '& .MuiSlider-markLabel': {
                  color: darkMode ? '#94a3b8' : '#64748b',
                },
              }}
            />
            <Typography variant="caption" sx={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
              Maximum response length
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose} 
          sx={{ 
            color: darkMode ? '#94a3b8' : '#64748b',
            '&:hover': { bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={loading}
          sx={{
            bgcolor: '#10a27e',
            '&:hover': { bgcolor: '#0d966d' },
            '&:disabled': { bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0' },
          }}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
