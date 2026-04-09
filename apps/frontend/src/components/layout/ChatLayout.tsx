import { ReactNode, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { ThemeModal } from '../common/ThemeModal'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface ChatLayoutProps {
  children: ReactNode
}

export const ChatLayout = ({ children }: ChatLayoutProps) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const [themeModalOpen, setThemeModalOpen] = useState(false)

  useEffect(() => {
    const html = document.documentElement
    if (darkMode) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }

    const handleOpenThemeModal = () => setThemeModalOpen(true)
    window.addEventListener('open-theme-modal', handleOpenThemeModal)
    return () => window.removeEventListener('open-theme-modal', handleOpenThemeModal)
  }, [darkMode])

  return (
    <div className="flex h-screen">
      <Sidebar className="md w-[260px]" />

      <div className="flex-1 flex flex-col relative">
        <Header title="New Conversation" />
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-bg-secondary border-t border-border-subtle md:hidden">
        <div className="flex justify-around items-center py-2 px-4 h-16">
          <button className="flex flex-col items-center justify-center gap-1 p-2 rounded-button" onClick={() => navigate('/')}>
            <span className="h-5 w-5 text-text-secondary">💬</span>
            <span className="text-xs text-text-secondary">Chats</span>
          </button>

          <button className="flex flex-col items-center justify-center gap-1 p-2 rounded-button" onClick={() => navigate('/new')}>
            <span className="h-5 w-5 text-text-secondary">➕</span>
            <span className="text-xs text-text-secondary">New</span>
          </button>

          <button className="flex flex-col items-center justify-center gap-1 p-2 rounded-button" onClick={() => navigate('/settings')}>
            <span className="h-5 w-5 text-text-secondary">⚙️</span>
            <span className="text-xs text-text-secondary">Settings</span>
          </button>
        </div>
      </div>

      <ThemeModal open={themeModalOpen} onClose={() => setThemeModalOpen(false)} />
    </div>
  )
}