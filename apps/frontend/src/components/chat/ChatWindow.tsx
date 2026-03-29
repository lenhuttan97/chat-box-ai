import { Box } from '@mui/material'
import { MessageList } from '../chat/MessageList'
import { InputBar } from '../chat/InputBar'
import { useMessages } from '../../store'

export const ChatWindow = () => {
  const { streaming, sendMessage } = useMessages()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <MessageList />
      <InputBar onSend={sendMessage} loading={streaming} />
    </Box>
  )
}
