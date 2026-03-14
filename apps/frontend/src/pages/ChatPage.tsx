import { ChatLayout } from '../components/ChatLayout'
import { ConversationList } from '../components/ConversationList'
import { ChatWindow } from '../components/ChatWindow'

export const ChatPage = () => {
  return (
    <ChatLayout sidebar={<ConversationList />}>
      <ChatWindow />
    </ChatLayout>
  )
}
