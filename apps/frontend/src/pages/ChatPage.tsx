import { ChatLayout } from '../components/layout/ChatLayout'
import { ConversationList } from '../components/chat/ConversationList'
import { ChatWindow } from '../components/chat/ChatWindow'

const ChatPage = () => {
  return (
    <ChatLayout sidebar={<ConversationList />}>
      <ChatWindow />
    </ChatLayout>
  )
}

export default ChatPage
