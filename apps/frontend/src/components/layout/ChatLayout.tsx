import { ReactNode, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { ThemeModal } from '../common/ThemeModal'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useConversations } from '../../hooks/useConversations'
import AddIcon from '@mui/icons-material/Add'
import ChatIcon from '@mui/icons-material/Chat'
import SettingsIcon from '@mui/icons-material/Settings'

interface ChatLayoutProps {
  children: ReactNode
}

export const ChatLayout = ({ children }: ChatLayoutProps) => {
  const { darkMode } = useTheme()
  const navigate = useNavigate()
  const { selectConversation } = useConversations()
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
    <div className="flex h-screen bg-surface-1">
      {/* Noise overlay + glow background for premium look */}
      <div className="noise-dark pointer-events-none" aria-hidden />

      <Sidebar className="hidden md:flex w-[260px] bg-surface-2/90 backdrop-blur-2xl border-r border-border-subtle/40" />

      <div className="flex-1 flex flex-col bg-surface-1/90">
        <Header title="New Conversation" />
        <div className="flex-1 overflow-y-auto bg-transparent">{children}</div>
      </div>

      {/* Mobile bottom nav (match mock icons/state) */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-2/95 backdrop-blur-xl border-t border-border-subtle/40 md:hidden">
        <div className="flex justify-around items-center py-2 px-4 h-16 text-text-secondary">
          <button
            className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-surface-3/80 active:scale-95 transition"
            onClick={() => navigate('/')}
            aria-label="Chats"
          >
            <ChatIcon sx={{ fontSize: 16, fontWeight: 'bold' }} />
            <span className="text-[11px] font-semibold">Chat</span>
          </button>
          <button
            className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-surface-3/80 active:scale-95 transition"
            onClick={() => {
              selectConversation(null)
              navigate('/')
            }}
            aria-label="New chat"
          >
            <AddIcon sx={{ fontSize: 20 }} />
            <span className="text-[11px] font-semibold">New</span>
          </button>
          <button
            className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-surface-3/80 active:scale-95 transition"
            onClick={() => navigate('/settings')}
            aria-label="Settings"
          >
            <SettingsIcon sx={{ fontSize: 16, fontWeight: 'bold' }} />
            <span className="text-[11px] font-semibold">Settings</span>
          </button>
        </div>
      </div>

      <ThemeModal open={themeModalOpen} onClose={() => setThemeModalOpen(false)} />
    </div>
  )
}