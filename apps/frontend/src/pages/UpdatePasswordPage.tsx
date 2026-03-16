import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button, TextField, Typography, Box } from '@mui/material'

const UpdatePasswordPage = () => {
  const navigate = useNavigate()
  const { updatePassword, isLoading, error } = useAuth()
  
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword || !newPassword || !confirmPassword) return
    if (newPassword !== confirmPassword) {
      return
    }
    
    try {
      await updatePassword(newPassword)
      navigate('/profile')
    } catch (err) {
      // Error is handled by useAuth hook
    }
  }

  const handleReset = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <Box component="main" sx={{ minHeight: '100vh', p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', pt: 4 }}>
        <Box sx={{ width: '100%', maxWidth: 400, p: 4 }}>
          <Typography variant="h4" align="center" sx={{ mb: 4 }}>
            Change Password
          </Typography>
          
          {error && (
            <Box sx={{ bgcolor: 'error.light', color: 'error.dark', p: 2, mb: 2, borderRadius: 2 }}>
              {error}
            </Box>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mb: 2 }}>
            <TextField
              label="Current Password"
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              fullWidth
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    sx={{ p: 0 }}
                  >
                    {showCurrentPassword ? 'Hide' : 'Show'}
                  </Button>
                )
              }}
            />
            
            <TextField
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              fullWidth
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    sx={{ p: 0 }}
                  >
                    {showNewPassword ? 'Hide' : 'Show'}
                  </Button>
                )
              }}
            />
            
            <TextField
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    sx={{ p: 0 }}
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </Button>
                )
              }}
            />
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
              sx={{ mt: 2 }}
            >
              {isLoading ? 'Updating password...' : 'Change Password'}
            </Button>
          </Box>
          
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Button
              variant="text"
              onClick={handleReset}
              sx={{ p: 0 }}
            >
              Reset
            </Button>
          </Box>
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2">
              <Link to="/profile" style={{ color: '#1976d2', textDecoration: 'none' }}>Back to Profile</Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default UpdatePasswordPage