import { useState } from 'react'
import { Add as AddIcon, Settings as SettingsIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { useConversations } from '../../hooks/useConversations'
import { ChatSettingsModal } from '../common/ChatSettingsModal'
import { format } from 'date-fns'

export const ConversationList = () => {
  const { conversations, currentConversation, loading, loadConversation, removeConversation, selectConversation } = useConversations()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const handleNewChat = () => {
    selectConversation(null)
  }

  if (loading) {
    return (
      <div className="p-2 flex justify-center">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-bg-secondary border-r border-border-subtle">
      <div className="p-4 flex items-center justify-between">
        <p className="text-h2 font-bold text-text-primary">
          Conversations
        </p>
        <button
          onClick={handleNewChat}
          className="p-2 text-text-secondary hover:text-accent transition-colors rounded-button"
        >
          <AddIcon />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="space-y-1 p-2">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => loadConversation(conv.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-card text-left transition-colors group ${
                currentConversation?.id === conv.id
                  ? "bg-bg-tertiary border-l-2 border-accent"
                  : "hover:bg-bg-tertiary"
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-body font-medium text-text-primary truncate">
                  {conv.name}
                </p>
                <p className="text-caption text-text-tertiary">
                  {format(new Date(conv.updatedAt), 'MMM d, yyyy')}
                </p>
              </div>
              <span className="opacity-0 group-hover:opacity-100 flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    loadConversation(conv.id)
                    setSettingsOpen(true)
                  }}
                  className="p-1 rounded hover:bg-bg-tertiary transition-colors"
                >
                  <SettingsIcon className="text-text-tertiary" fontSize="small" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); removeConversation(conv.id) }}
                  className="p-1 rounded hover:bg-bg-tertiary transition-colors"
                >
                  <DeleteIcon className="text-text-tertiary" fontSize="small" />
                </button>
              </span>
            </button>
          ))}
          {conversations.length === 0 && (
            <div className="p-4 text-center">
              <p className="text-caption text-text-tertiary">
                No conversations yet
              </p>
            </div>
          )}
        </div>
      </div>
      <ChatSettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
