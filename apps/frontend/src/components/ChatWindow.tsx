import { Box } from '@mui/material'
import { MessageList } from './MessageList'
import { InputBar } from './InputBar'
import { useMessages } from '../store'

export const ChatWindow = () => {
  const { streaming, sendMessage } = useMessages()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <MessageList />
      <InputBar onSend={sendMessage} loading={streaming} />
    </Box>
  )
}
