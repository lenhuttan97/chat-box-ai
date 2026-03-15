import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Button, TextField, Typography, Box, Avatar } from '@mui/material'

const ProfilePage = () => {
  const { user, updateProfile, isLoading, error } = useAuth()
  
  const [displayName, setDisplayName] = useState(user?.displayName ?? '')
  const [photoUrl, setPhotoUrl] = useState(user?.photoURL ?? '')

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName ?? '')
      setPhotoUrl(user.photoURL ?? '')
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateProfile(displayName, photoUrl || undefined)
  }

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
              {user?.displayName?.[0] || 'U'}
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
              disabled={isLoading}
              sx={{ mt: 2 }}
            >
              {isLoading ? 'Updating...' : 'Update Profile'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ProfilePage