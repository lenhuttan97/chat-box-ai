import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

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
      await updatePassword(currentPassword, newPassword)
      navigate('/profile')
    } catch {
      // Error is handled by useAuth hook
    }
  }

  const handleReset = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[color:var(--surface)]">
      <div className="w-full max-w-md p-6 rounded-2xl bg-surface-3/50 backdrop-blur-xl border border-theme shadow-2xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[color:var(--accent-primary)]/10 blur-[100px]" />
        </div>

        <div className="relative">
          <h1 className="text-2xl font-bold text-[color:var(--text-primary)] text-center mb-6">
            Change Password
          </h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-2 mb-4 rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-theme bg-surface-3/50 text-[color:var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-primary)] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
                  aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                >
                  {showCurrentPassword ? (
                    <VisibilityIcon sx={{ fontSize: '1rem' }} />
                  ) : (
                    <VisibilityOffIcon sx={{ fontSize: '1rem' }} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-theme bg-surface-3/50 text-[color:var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-primary)] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
                  aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                >
                  {showNewPassword ? (
                    <VisibilityIcon sx={{ fontSize: '1rem' }} />
                  ) : (
                    <VisibilityOffIcon sx={{ fontSize: '1rem' }} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-theme bg-surface-3/50 text-[color:var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-primary)] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? (
                    <VisibilityIcon sx={{ fontSize: '1rem' }} />
                  ) : (
                    <VisibilityOffIcon sx={{ fontSize: '1rem' }} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-[color:var(--accent-primary)] text-white font-semibold hover:brightness-110 transition-all disabled:opacity-50 shadow-lg shadow-[color:var(--accent-glow)]"
            >
              {isLoading ? 'Updating password...' : 'Change Password'}
            </button>
          </form>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={handleReset}
              className="text-sm text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
            >
              Reset
            </button>
          </div>

          <div className="mt-6 text-center">
            <span className="text-sm text-[color:var(--text-secondary)]">Back to </span>
            <Link to="/profile" className="text-sm text-[color:var(--accent-primary)] hover:brightness-110 font-medium">
              Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdatePasswordPage
