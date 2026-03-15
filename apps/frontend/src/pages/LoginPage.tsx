import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button, TextField, Typography, Box } from '@mui/material'

const LoginPage = () => {
  const navigate = useNavigate()
  const { loginEmail, loginGoogle, isLoading, error } = useAuth()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    
    try {
      await loginEmail(email, password)
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
  }

  return (
    <Box component="main" sx={{ minHeight: '100vh', p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Box sx={{ width: '100%', maxWidth: 400, p: 4 }}>
          <Typography variant="h4" align="center" mb={4}>
            Sign In to Chat App
          </Typography>
          
          {error && (
            <Box sx={{ bgcolor: 'error.light', color: 'error.dark', p: 2, mb: 2, borderRadius: 2 }}>
              {error}
            </Box>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mb: 2 }}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
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
                inputProps={{ autoComplete: 'current-password' }}
                InputProps={{
                  endAdornment: (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 'Hide' : 'Show'}
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
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
              </Box>
          
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              variant="text"
              onClick={handleReset}
            >
              Reset
            </Button>
          </Box>
          
          <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Or sign in with
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<img src="https://developers.google.com/identity/images/g-logo.png" width={18} height={18} alt="Google" />}
            fullWidth
            disabled={isLoading}
            onClick={handleGoogleLogin}
          >
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              Don't have an account? <Link to="/register" style={{ color: '#1976d2', textDecoration: 'underline' }}>Sign up</Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default LoginPage