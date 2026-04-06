import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useConversations } from '../../hooks/useConversations'
import { format } from 'date-fns'

interface SidebarProps {
  onNewChat?: () => void
}

export const Sidebar = ({ onNewChat }: SidebarProps) => {
  const { isAuthenticated } = useAuth()
  const { conversations, currentConversation, loadConversation, removeConversation, selectConversation } = useConversations()
  const navigate = useNavigate()
  const [localConversations, setLocalConversations] = useState(conversations)

  useEffect(() => {
    setLocalConversations(conversations)
  }, [conversations])

  const handleNewChat = () => {
    selectConversation(null)
    onNewChat?.()
  }

  const handleConversationClick = (id: string) => {
    loadConversation(id)
  }

  const handleDeleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    removeConversation(id)
  }

  return (
    <aside className="w-[260px] h-full flex flex-col bg-bg-secondary border-r border-border-subtle">
      {/* Sidebar Header */}
      <div className="p-4 flex flex-col gap-3">
        {/* Logo + Title */}
        <div className="flex items-center gap-3 px-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-button bg-accent text-white">
            <span className="material-symbols-rounded text-xl">smart_toy</span>
          </div>
          <div>
            <h1 className="text-body font-bold text-text-primary leading-tight">
              AI Chat
            </h1>
            <p className="text-caption text-accent font-medium">
              v2.0 Pro
            </p>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={handleNewChat}
          className="flex items-center justify-center gap-2 h-11 rounded-button bg-accent text-white font-semibold text-body shadow-sm hover:bg-accent-hover transition-colors"
        >
          <span className="material-symbols-rounded text-xl">add</span>
          <span>New Chat</span>
        </button>
      </div>

      {/* Sidebar Content - Recent Chats */}
      <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
        <div className="px-3 py-3">
          <p className="text-caption font-bold uppercase tracking-wider text-text-tertiary">
            Recent Chats
          </p>
        </div>
        
        <div className="space-y-1 px-2">
          {localConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => handleConversationClick(conv.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-card text-left transition-colors group
                ${currentConversation?.id === conv.id 
                  ? 'bg-bg-tertiary border-l-2 border-accent' 
                  : 'hover:bg-bg-tertiary'
                }`}
            >
              <span className="material-symbols-rounded text-text-tertiary text-lg">
                chat
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-body font-medium text-text-primary truncate">
                  {conv.name}
                </p>
                <p className="text-caption text-text-tertiary">
                  {format(new Date(conv.updatedAt), 'MMM d, yyyy')}
                </p>
              </div>
              <button
                onClick={(e) => handleDeleteConversation(e, conv.id)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-bg-tertiary transition-opacity"
              >
                <span className="material-symbols-rounded text-text-tertiary text-sm">
                  delete
                </span>
              </button>
            </button>
          ))}
          
          {localConversations.length === 0 && (
            <div className="p-4 text-center">
              <p className="text-caption text-text-tertiary">
                No conversations yet
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-border-subtle flex flex-col gap-1">
        {/* Theme Settings */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-theme-modal'))}
          className="flex items-center gap-3 px-3 py-2.5 rounded-button text-text-secondary hover:bg-bg-tertiary transition-colors w-full"
        >
          <span className="material-symbols-rounded text-xl">contrast</span>
          <span className="text-body font-medium">Theme Settings</span>
        </button>

        {/* Settings or Login */}
        {isAuthenticated ? (
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-button text-text-secondary hover:bg-bg-tertiary transition-colors w-full"
          >
            <span className="material-symbols-rounded text-xl">settings</span>
            <span className="text-body font-medium">Settings</span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-button text-text-secondary hover:bg-bg-tertiary transition-colors w-full"
          >
            <span className="material-symbols-rounded text-xl">login</span>
            <span className="text-body font-medium">Settings</span>
          </button>
        )}
      </div>
    </aside>
  )
}