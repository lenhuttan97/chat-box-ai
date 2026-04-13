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
    <div className="flex flex-col h-full relative">
      {/* Noise overlay */}
      <div className="noise-dark"></div>

      {/* Background visual layers */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent-glow opacity-20 blur-[100px]"></div>
      </div>

      <div className="flex-1 relative overflow-auto z-10">
        <MessageList />
      </div>
      <InputBar onSend={sendMessage} loading={streaming} />
    </div>
  )
}