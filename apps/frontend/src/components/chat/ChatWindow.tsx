import { MessageList } from '../chat/MessageList'
import { InputBar } from '../chat/InputBar'
import { useMessages, useSelector } from '../../store'
import { RootState } from '../../store'

export const ChatWindow = () => {
  const { streaming, sendMessage } = useMessages()
  const { currentConversation } = useSelector((state: RootState) => state.conversations)

  return (
    <div className="flex flex-col h-full bg-bg-secondary">
      {/* Conversation Header */}
      <div className="px-6 py-4 border-b border-border">
        <h1 className="text-lg font-semibold text-text-primary truncate">
          {currentConversation?.name || 'New Conversation'}
        </h1>
      </div>

      <div className="flex-1 relative overflow-hidden">
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
