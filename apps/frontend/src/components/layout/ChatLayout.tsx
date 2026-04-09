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

    // Listen for theme modal event
    const handleOpenThemeModal = () => setThemeModalOpen(true)
    window.addEventListener('open-theme-modal', handleOpenThemeModal)
    return () => window.removeEventListener('open-theme-modal', handleOpenThemeModal)
  }, [darkMode])

  return (
    <div className="flex h-screen">
      {/* Sidebar (hidden on mobile) */}
      <Sidebar className="hidden md:block w-[260px]" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <Header title="New Conversation" />

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>

      {/* Mobile Bottom Navigation - shown only on mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-bg-secondary border-t border-border-subtle md:hidden">
        <div className="flex justify-around items-center py-2 px-4 h-16">
          <button 
            className="flex flex-col items-center justify-center gap-1 p-2 rounded-button"
            onClick={() => navigate('/')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-xs text-text-secondary">Chats</span>
          </button>
          
          <button 
            className="flex flex-col items-center justify-center gap-1 p-2 rounded-button"
            onClick={() => navigate('/new')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-xs text-text-secondary">New</span>
          </button>
          
          <button 
            className="flex flex-col items-center justify-center gap-1 p-2 rounded-button"
            onClick={() => navigate('/settings')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs text-text-secondary">Settings</span>
          </button>
        </div>
      </div>

      <ThemeModal open={themeModalOpen} onClose={() => setThemeModalOpen(false)} />
    </div>
  )
}