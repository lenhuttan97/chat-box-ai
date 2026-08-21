import { MessageList } from '../chat/MessageList'
import { InputBar } from '../chat/InputBar'
import { useMessages } from '../../store'

export const ChatWindow = () => {
  const { streaming, sendMessage } = useMessages()

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