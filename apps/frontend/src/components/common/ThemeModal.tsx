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

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-3/95 backdrop-blur-xl border border-border-subtle/40 rounded-xl p-6 w-full max-w-sm"
      >
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Theme Settings
        </h3>

        <div className="space-y-3 mb-6">
          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-4/50 cursor-pointer">
            <input
              type="radio"
              name="theme"
              value="light"
              checked={selectedTheme === 'light'}
              onChange={(e) => setSelectedTheme(e.target.value as 'light' | 'dark' | 'auto')}
              className="w-4 h-4 text-accent bg-surface-2 border-border-subtle focus:ring-accent focus:ring-2"
            />
            <span className="text-text-primary font-medium">Light</span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-4/50 cursor-pointer">
            <input
              type="radio"
              name="theme"
              value="dark"
              checked={selectedTheme === 'dark'}
              onChange={(e) => setSelectedTheme(e.target.value as 'light' | 'dark' | 'auto')}
              className="w-4 h-4 text-accent bg-surface-2 border-border-subtle focus:ring-accent focus:ring-2"
            />
            <span className="text-text-primary font-medium">Dark</span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-4/50 cursor-pointer">
            <input
              type="radio"
              name="theme"
              value="auto"
              checked={selectedTheme === 'auto'}
              onChange={(e) => setSelectedTheme(e.target.value as 'light' | 'dark' | 'auto')}
              className="w-4 h-4 text-accent bg-surface-2 border-border-subtle focus:ring-accent focus:ring-2"
            />
            <span className="text-text-primary font-medium">Auto (System preference)</span>
          </label>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-text-secondary hover:bg-surface-4/50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-accent text-white font-semibold hover:brightness-110 transition-all shadow-lg shadow-accent-glow"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
