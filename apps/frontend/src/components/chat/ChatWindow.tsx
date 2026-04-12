import { MessageList } from '../chat/MessageList'
import { InputBar } from '../chat/InputBar'
import { useMessages } from '../../store'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { Chat as ChatIcon, MoreVert as MoreIcon, Edit as EditIcon } from '@mui/icons-material'
import { useState } from 'react'

export const ChatWindow = () => {
  const { streaming, sendMessage } = useMessages()
  const { currentConversation } = useSelector((state: RootState) => state.conversations)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(currentConversation?.name || '')

  const handleEditClick = () => {
    if (currentConversation) {
      setIsEditing(true)
      setEditValue(currentConversation.name || '')
    }
  }

  const handleSave = () => {
    // Here we would typically dispatch an action to update the conversation name
    // For now, just toggle the editing state
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset the value to the original name
    setEditValue(currentConversation?.name || '')
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <div className="flex flex-col h-full bg-bg-secondary">
      {/* Conversation Header */}
      {/* <div className="px-6 py-4 border-b border-border group">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleCancel}
              autoFocus
              className="flex-1 bg-bg-tertiary rounded-input px-4 py-2 text-h1 font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              maxLength={100}
            />
            <button
              onClick={handleSave}
              className="p-2 text-accent hover:bg-bg-tertiary rounded transition-colors"
            >
              <ChatIcon />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 text-text-secondary hover:bg-bg-tertiary rounded transition-colors"
            >
              <EditIcon />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <h1 className="text-h1 font-bold bg-gradient-to-r from-accent-primary to-accent-hover bg-clip-text text-transparent truncate flex items-center gap-2">
              <span className="truncate">{currentConversation?.name || 'New Conversation'}</span>
              {currentConversation && (
                <button
                  onClick={handleEditClick}
                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-text-tertiary hover:text-accent focus:opacity-100"
                  title="Edit conversation name"
                >
                  <EditIcon fontSize="small" />
                </button>
              )}
            </h1>
            {currentConversation && (
              <div className="flex gap-1">
                <button
                  className="p-1 rounded hover:bg-bg-tertiary transition-colors text-text-secondary hover:text-accent"
                  title="More options"
                >
                  <MoreIcon fontSize="small" />
                </button>
              </div>
            )}
          </div>
        )}
      </div> */}

      <div className="flex-1 relative overflow-auto">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 right-12 h-72 w-72 rounded-full bg-emerald-500/10 blur-[120px]" />
          <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-emerald-400/5 blur-[100px]" />
        </div>
        <MessageList />
      </div>
      <InputBar onSend={sendMessage} loading={streaming} />
    </div>
  )
}