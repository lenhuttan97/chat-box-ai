import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { MessageItem } from '../chat/MessageItem'
import { WelcomeSection } from './WelcomeSection'
import { addMessage } from '../../store/slices/message.slice'

export const MessageList = () => {
  const { items: messages, streaming } = useSelector((state: RootState) => state.messages)
  const dispatch = useDispatch()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streaming])

  const handleSuggestionClick = (suggestion: string) => {
    // Dispatch a new message based on the suggestion
    const suggestionMessages: Record<string, string> = {
      'write': 'I\'d be happy to help you write. What would you like to create?',
      'design': 'I can help you with design ideas. What are you looking to design?',
      'code': 'I\'m ready to help with coding. What programming challenge are you facing?',
      'analyze': 'I can help analyze data. What information would you like me to examine?'
    };

    const content = suggestionMessages[suggestion] || `Let's talk about ${suggestion}. How can I help you?`;

    dispatch(addMessage({
      id: Date.now().toString(),
      role: 'user',
      content: content,
      createdAt: new Date().toISOString()
    }));
  }

  return (
    <div className="flex-1 overflow-auto overflow-anchor-auto relative">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-12 h-72 w-72 rounded-full bg-emerald-500/10 blur-[120px]"></div>
        <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-emerald-400/5 blur-[100px]"></div>
      </div>
      {messages.length === 0 ? (
        <WelcomeSection onSuggestionClick={handleSuggestionClick} />
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