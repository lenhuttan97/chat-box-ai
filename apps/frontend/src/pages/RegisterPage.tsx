import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { registerEmail, loginGoogle, isLoading, error } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    const html = document.documentElement
    html.classList.add('dark')
    return () => {
      html.classList.remove('dark')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || !displayName) return
    if (password !== confirmPassword) {
      return
    }

    try {
      await registerEmail(email, password, displayName)
      navigate('/')
    } catch {
      // Error is handled by useAuth hook
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginGoogle()
      navigate('/')
    } catch {
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
    <Box component="main" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[color:var(--surface)]">
      {/* Background glow effects */}
      <Box className="absolute inset-0 pointer-events-none">
        <Box className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[color:var(--accent-primary)]/10 blur-[120px]" />
        <Box className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-[color:var(--accent-primary)]/5 blur-[100px]" />
      </Box>

      {/* Noise overlay */}
      <Box className="noise-dark pointer-events-none absolute inset-0 opacity-[0.02]" />

      {/* Register Card */}
      <Box className="relative z-10 w-full max-w-md mx-4">
        <Box className="glass rounded-[24px] p-8 backdrop-blur-xl border border-[color:var(--border-subtle)]/40 shadow-2xl">
          {/* Header */}
          <Box className="text-center mb-8">
            <Box className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[color:var(--accent-primary)]/10 mb-4">
              <PersonAddIcon sx={{ fontSize: 32, color: 'var(--accent-primary)' }} />
            </Box>
            <Box component="h1" className="text-2xl font-bold text-[color:var(--text-primary)]">Create Account</Box>
            <Box component="p" className="text-sm text-[color:var(--text-secondary)] mt-2">Sign up to continue to Premium AI</Box>
          </Box>

          {/* Error Message */}
          {error && (
            <Box className="mb-4 p-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </Box>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate className="space-y-4 mb-6">
            {/* Full Name */}
            <Box>
              <Box component="label" htmlFor="displayName" className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">
                Full Name
              </Box>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                autoFocus
                autoComplete="name"
                placeholder="Enter your full name"
                className="w-full h-12 px-5 rounded-full bg-surface-3/50 border border-[color:var(--border-subtle)]/40 text-[color:var(--text-primary)] placeholder:text-[color:var(--text-secondary)]/40 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-primary)]/50 focus:border-[color:var(--accent-primary)]/50 transition-all duration-200"
              />
            </Box>

            {/* Email */}
            <Box>
              <Box component="label" htmlFor="email" className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">
                Email
              </Box>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="Enter your email"
                className="w-full h-12 px-5 rounded-full bg-surface-3/50 border border-[color:var(--border-subtle)]/40 text-[color:var(--text-primary)] placeholder:text-[color:var(--text-secondary)]/40 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-primary)]/50 focus:border-[color:var(--accent-primary)]/50 transition-all duration-200"
              />
            </Box>

            {/* Password */}
            <Box>
              <Box component="label" htmlFor="password" className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">
                Password
              </Box>
              <Box className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  className="w-full h-12 px-5 pr-14 rounded-full bg-surface-3/50 border border-[color:var(--border-subtle)]/40 text-[color:var(--text-primary)] placeholder:text-[color:var(--text-secondary)]/40 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-primary)]/50 focus:border-[color:var(--accent-primary)]/50 transition-all duration-200"
                />
                <Box
                  component="button"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <VisibilityIcon sx={{ fontSize: '1.25rem' }} />
                  ) : (
                    <VisibilityOffIcon sx={{ fontSize: '1.25rem' }} />
                  )}
                </Box>
              </Box>
            </Box>

            {/* Confirm Password */}
            <Box>
              <Box component="label" htmlFor="confirmPassword" className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">
                Confirm Password
              </Box>
              <Box className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  className="w-full h-12 px-5 pr-14 rounded-full bg-surface-3/50 border border-[color:var(--border-subtle)]/40 text-[color:var(--text-primary)] placeholder:text-[color:var(--text-secondary)]/40 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-primary)]/50 focus:border-[color:var(--accent-primary)]/50 transition-all duration-200"
                />
                <Box
                  component="button"
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <VisibilityIcon sx={{ fontSize: '1.25rem' }} />
                  ) : (
                    <VisibilityOffIcon sx={{ fontSize: '1.25rem' }} />
                  )}
                </Box>
              </Box>
            </Box>

            {/* Primary Register Button */}
            <Box
              component="button"
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-full bg-[color:var(--accent-primary)] text-white font-semibold text-base hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-primary)]/50 focus:ring-offset-2 focus:ring-offset-[color:var(--surface)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[color:var(--accent-glow)]"
            >
              {isLoading ? (
                <Box component="span" className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </Box>
              ) : (
                'Sign Up'
              )}
            </Box>

            {/* Reset Button */}
            <Box className="text-center">
              <Box
                component="button"
                type="button"
                onClick={handleReset}
                className="text-sm text-[color:var(--text-secondary)]/50 hover:text-[color:var(--text-secondary)] transition-colors"
              >
                Reset form
              </Box>
            </Box>
          </Box>

          {/* Divider */}
          <Box className="relative mb-6">
            <Box className="absolute inset-0 flex items-center">
              <Box className="w-full border-t border-[color:var(--border-subtle)]/40" />
            </Box>
            <Box className="relative flex justify-center text-sm">
              <Box component="span" className="px-4 text-[color:var(--text-secondary)]/50 bg-[color:var(--surface)]/50 backdrop-blur-sm">Or sign up with</Box>
            </Box>
          </Box>

          {/* Social Login Buttons */}
          <Box className="space-y-3 mb-6">
            {/* Google */}
            <Box
              component="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full h-12 flex items-center justify-center gap-3 rounded-full border border-[color:var(--border-subtle)]/40 bg-surface-3/50 text-[color:var(--text-primary)] font-medium hover:bg-surface-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {isLoading ? 'Signing up...' : 'Continue with Google'}
            </Box>
          </Box>

          {/* Login Link */}
          <Box className="text-center text-sm text-[color:var(--text-secondary)]">
            Already have an account?{' '}
            <Link to="/login" className="text-[color:var(--accent-primary)] hover:brightness-110 font-medium transition-colors">
              Sign in
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default RegisterPage