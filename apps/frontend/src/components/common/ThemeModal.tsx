import { useState, useEffect } from 'react'
import { useTheme } from '../../hooks/useTheme'

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

  const themes = [
    {
      id: 'light',
      label: 'Light',
      icon: '☀️',
      description: 'Bright and energetic'
    },
    {
      id: 'dark',
      label: 'Dark',
      icon: '🌙',
      description: 'Easy on the eyes'
    },
    {
      id: 'auto',
      label: 'Auto',
      icon: '⚙️',
      description: 'Matches system preference'
    }
  ]

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-2/95 backdrop-blur-md border border-theme rounded-xl p-6 w-full max-w-md shadow-2xl shadow-[color:var(--accent-glow)]/15"
      >
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-text-primary mb-2">
            Choose Your Theme
          </h3>
          <p className="text-text-secondary text-sm">
            Select an appearance setting for your experience
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {themes.map((theme) => (
            <label
              key={theme.id}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedTheme === theme.id
                  ? 'border-accent bg-surface-3/90 ring-2 ring-accent/30 shadow-lg'
                  : 'border-theme/30 bg-surface-3/20 hover:bg-surface-3/40'
              }`}
            >
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg transition-colors ${
                  selectedTheme === theme.id
                    ? 'bg-accent/20 text-accent'
                    : 'bg-surface-4/20 text-text-secondary/80'
                }`}>
                  {theme.icon}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`font-semibold transition-colors ${
                    selectedTheme === theme.id ? 'text-text-primary' : 'text-text-secondary/80'
                  }`}>
                    {theme.label}
                  </span>
                  {selectedTheme === theme.id && (
                    <div className="w-2 h-2 rounded-full bg-accent ml-2 transition-colors"></div>
                  )}
                </div>
                <p className={`text-sm mt-1 transition-colors ${
                  selectedTheme === theme.id ? 'text-text-secondary' : 'text-text-tertiary/60'
                }`}>
                  {theme.description}
                </p>
              </div>

              <input
                type="radio"
                name="theme"
                value={theme.id}
                checked={selectedTheme === theme.id}
                onChange={(e) => setSelectedTheme(e.target.value as 'light' | 'dark' | 'auto')}
                className="sr-only"
              />
            </label>
          ))}
        </div>

        <div className="flex gap-3 justify-between">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl text-text-secondary border border-theme hover:bg-surface-3/50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 rounded-xl bg-accent text-white font-semibold hover:brightness-110 transition-all shadow-lg shadow-accent-glow"
          >
            Apply Theme
          </button>
        </div>
      </div>
    </div>
  )
}
