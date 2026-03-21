import { useState, useEffect } from 'react'
import { Box, Typography, Radio, RadioGroup, FormControlLabel, Button } from '@mui/material'
import { useTheme } from '../hooks/useTheme'

interface ThemeModalProps {
  open: boolean
  onClose: () => void
}

export const ThemeModal = ({ open, onClose }: ThemeModalProps) => {
  const { themeSetting, setThemeSetting } = useTheme()
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'auto'>(themeSetting)

  useEffect(() => {
    setSelectedTheme(themeSetting)
  }, [themeSetting])

  const handleSave = () => {
    setThemeSetting(selectedTheme)
    onClose()
  }

  if (!open) return null

  return (
    <Box
      onClick={onClose}
      sx={{
        position: 'fixed',
        inset: 0,
        bgcolor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          bgcolor: 'white',
          borderRadius: 2,
          p: 3,
          width: 320,
          maxWidth: '90vw',
        }}
      >
        <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, mb: 2, color: '#0f172a' }}>
          Theme Settings
        </Typography>

        <RadioGroup
          value={selectedTheme}
          onChange={(e) => setSelectedTheme(e.target.value as 'light' | 'dark' | 'auto')}
        >
          <FormControlLabel
            value="light"
            control={<Radio />}
            label={
              <Typography sx={{ fontSize: '0.875rem', color: '#0f172a' }}>
                Light
              </Typography>
            }
            sx={{ mb: 1 }}
          />
          <FormControlLabel
            value="dark"
            control={<Radio />}
            label={
              <Typography sx={{ fontSize: '0.875rem', color: '#0f172a' }}>
                Dark
              </Typography>
            }
            sx={{ mb: 1 }}
          />
          <FormControlLabel
            value="auto"
            control={<Radio />}
            label={
              <Typography sx={{ fontSize: '0.875rem', color: '#0f172a' }}>
                Auto (System preference)
              </Typography>
            }
          />
        </RadioGroup>

        <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
          <Button onClick={onClose} sx={{ color: '#64748b', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            sx={{
              bgcolor: '#10a27e',
              color: 'white',
              textTransform: 'none',
              '&:hover': { bgcolor: 'rgba(16,162,126,0.9)' },
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
