import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Box } from '@mui/material'
import { RootState } from '../store'
import { MessageItem } from './MessageItem'

export const MessageList = () => {
  const { items: messages } = useSelector((state: RootState) => state.messages)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <Box sx={{ flex: 1, overflow: 'auto' }}>
      {messages.length === 0 ? (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2,
            color: 'text.secondary',
          }}
        >
          <Box
            component="img"
            src="/chat-icon.png"
            sx={{ width: 64, height: 64, opacity: 0.5 }}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
          <Box component="span">Start a conversation</Box>
        </Box>
      ) : (
        messages.map((msg) => <MessageItem key={msg.id} role={msg.role as 'user' | 'assistant'} content={msg.content} />)
      )}
      <div ref={bottomRef} />
    </Box>
  )
}
