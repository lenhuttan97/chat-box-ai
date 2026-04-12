import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useUser } from '../hooks/useUser'
import { Button, TextField, Typography, Box, Avatar } from '@mui/material'

const ProfilePage = () => {
  const { isLoading: authLoading, error } = useAuth()
  const { currentUser, updateProfile, isLoading: userLoading } = useUser()

  const [displayName, setDisplayName] = useState(currentUser?.displayName ?? '')
  const [photoUrl, setPhotoUrl] = useState(currentUser?.photoUrl ?? '')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName ?? '')
      setPhotoUrl(currentUser.photoUrl ?? '')
    }
  }, [currentUser])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await updateProfile(displayName, photoUrl || undefined)
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Combine loading states
  const combinedLoading = isLoading || authLoading || userLoading

  return (
    <Box component="main" sx={{ minHeight: '100vh', p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', pt: 4 }}>
        <Box sx={{ width: '100%', maxWidth: 400, p: 4 }}>
          <Typography variant="h4" align="center" sx={{ mb: 4 }}>
            Profile
          </Typography>

          {error && (
            <Box sx={{ bgcolor: 'error.light', color: 'error.dark', p: 2, mb: 2, borderRadius: 2 }}>
              {error}
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Avatar sx={{ width: 80, height: 80 }}>
              {currentUser?.displayName?.[0] || 'U'}
            </Avatar>
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mb: 2 }}>
            <TextField
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              autoFocus
              fullWidth
              sx={{ mb: 2 }}
            />

            <TextField
              label="Photo URL"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={combinedLoading}
              sx={{ mt: 2 }}
            >
              {combinedLoading ? 'Updating...' : 'Update Profile'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ProfilePage