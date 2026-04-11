import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { MessageItem } from '../chat/MessageItem'

export const MessageList = () => {
  const { items: messages, streaming } = useSelector((state: RootState) => state.messages)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streaming])

  return (
    <div className="flex-1 overflow-auto overflow-anchor-auto bg-bg-primary relative">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center gap-4 text-text-secondary">
          <div className="relative">
            <img
              src="/chat-icon.png"
              alt="Chat"
              className="w-16 h-16 opacity-50"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-xl -z-10"></div>
          </div>
          <p className="text-text-secondary">Start a conversation</p>
        </div>
      ) : (
        <div className="pb-4">
          {messages.map((msg, index) => (
            <MessageItem
              key={msg.id}
              role={msg.role as 'user' | 'assistant'}
              content={msg.content}
              isLoading={index === messages.length - 1 && msg.role === 'assistant' && streaming}
            />
          ))}
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}
