import { ReactNode, useEffect, useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { ThemeModal } from '../common/ThemeModal'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface ChatLayoutProps {
  children: ReactNode
}

export const ChatLayout = ({ children }: ChatLayoutProps) => {
  const { darkMode } = useTheme()
  const [themeModalOpen, setThemeModalOpen] = useState(false)

  useEffect(() => {
    const html = document.documentElement
    if (darkMode) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }

    // Listen for theme modal event
    const handleOpenThemeModal = () => setThemeModalOpen(true)
    window.addEventListener('open-theme-modal', handleOpenThemeModal)
    return () => window.removeEventListener('open-theme-modal', handleOpenThemeModal)
  }, [darkMode])

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <Header title="New Conversation" />

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>

      <ThemeModal open={themeModalOpen} onClose={() => setThemeModalOpen(false)} />
    </div>
  )
}