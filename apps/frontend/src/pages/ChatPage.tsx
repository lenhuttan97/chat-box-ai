import { ChatLayout } from '../components/ChatLayout'
import { ConversationList } from '../components/ConversationList'
import { ChatWindow } from '../components/ChatWindow'

const ChatPage = () => {
  return (
    <ChatLayout sidebar={<ConversationList />}>
      <ChatWindow />
    </ChatLayout>
  )
}

export default ChatPage
