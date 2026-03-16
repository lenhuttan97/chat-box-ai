import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button, TextField, Typography, Box } from '@mui/material'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { registerEmail, loginGoogle, isLoading, error } = useAuth()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || !displayName) return
    if (password !== confirmPassword) {
      return
    }
    
    try {
      await registerEmail(email, password, displayName)
      navigate('/')
    } catch (err) {
      // Error is handled by useAuth hook
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginGoogle()
      navigate('/')
    } catch (err) {
      // Error is handled by useAuth hook
    }
  }

  const handleReset = () => {
    setEmail('')
    setPassword('')
    setDisplayName('')
    setConfirmPassword('')
  }

  return (
    <Box component="main" sx={{ minHeight: '100vh', p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Box sx={{ width: '100%', maxWidth: 400, p: 4 }}>
          <Typography variant="h4" align="center" sx={{ mb: 4 }}>
            Create Account
          </Typography>
          
          {error && (
            <Box sx={{ bgcolor: 'error.light', color: 'error.dark', p: 2, mb: 2, borderRadius: 2 }}>
              {error}
            </Box>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mb: 2 }}>
            <TextField
              label="Full Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              autoFocus
              fullWidth
              sx={{ mb: 2 }}
            />
            
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              sx={{ mb: 2 }}
              inputProps={{ autoComplete: 'email' }}
            />
            
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              sx={{ mb: 2 }}
              inputProps={{ autoComplete: 'new-password' }}
              InputProps={{
                endAdornment: (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{ p: 0 }}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </Button>
                )
              }}
            />
            
            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
              sx={{ mb: 2 }}
              inputProps={{ autoComplete: 'new-password' }}
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
              {isLoading ? 'Creating account...' : 'Sign Up'}
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
          
          <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 3, mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Or sign up with
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<img src="https://developers.google.com/identity/images/g-logo.png" width={18} height={18} alt="Google" />}
            fullWidth
            disabled={isLoading}
            onClick={handleGoogleLogin}
            sx={{ mt: 2 }}
          >
            {isLoading ? 'Signing up...' : 'Sign up with Google'}
          </Button>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account? <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>Sign in</Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default RegisterPage