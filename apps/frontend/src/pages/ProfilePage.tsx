import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useUser } from '../hooks/useUser'

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-[color:var(--surface)]">
      <div className="w-full max-w-md p-6 rounded-2xl bg-surface-3/50 backdrop-blur-xl border border-theme shadow-2xl">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[color:var(--accent-primary)]/10 blur-[100px]" />
        </div>

        <div className="relative">
          <h1 className="text-2xl font-bold text-[color:var(--text-primary)] text-center mb-6">
            Profile
          </h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-2 mb-4 rounded-lg text-center">
              {error}
            </div>
          )}

          <div className="flex justify-center mb-6">
            {currentUser?.photoUrl ? (
              <img
                src={currentUser?.photoUrl}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-[color:var(--accent-primary)]/20"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[color:var(--accent-primary)] flex items-center justify-center text-white text-2xl font-semibold border-2 border-[color:var(--accent-primary)]/20">
                {currentUser?.displayName?.[0] || 'U'}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                autoFocus
                className="w-full px-4 py-3 rounded-lg border border-theme bg-surface-3/50 text-[color:var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-primary)] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[color:var(--text-secondary)] mb-2">
                Photo URL
              </label>
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-theme bg-surface-3/50 text-[color:var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-primary)] focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={combinedLoading}
              className="w-full py-3 rounded-lg bg-[color:var(--accent-primary)] text-white font-semibold hover:brightness-110 transition-all disabled:opacity-50 shadow-lg shadow-[color:var(--accent-glow)]"
            >
              {combinedLoading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage