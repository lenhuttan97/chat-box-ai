import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Box, Typography } from '@mui/material'
import { RootState } from '../store'
import { MessageItem } from './MessageItem'
import { useTheme } from '../hooks/useTheme'

export const MessageList = () => {
  const { items: messages, streaming } = useSelector((state: RootState) => state.messages)
  const { darkMode } = useTheme()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streaming])

  return (
    <Box sx={{ flex: 1, overflow: 'auto', bgcolor: darkMode ? '#11221d' : '#f6f8f7' }}>
      {messages.length === 0 ? (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2,
            color: darkMode ? '#94a3b8' : '#64748b',
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
          <Typography sx={{ color: darkMode ? '#94a3b8' : '#64748b' }}>Start a conversation</Typography>
        </Box>
      ) : (
        messages.map((msg, index) => (
          <MessageItem
            key={msg.id}
            role={msg.role as 'user' | 'assistant'}
            content={msg.content}
            isLoading={index === messages.length - 1 && msg.role === 'assistant' && streaming}
          />
        ))
      )}
      <div ref={bottomRef} />
    </Box>
  )
}
