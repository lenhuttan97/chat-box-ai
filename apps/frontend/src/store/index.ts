import { configureStore } from '@reduxjs/toolkit'
import conversationReducer from './slices/conversation.slice'
import messageReducer from './slices/message.slice'

export const store = configureStore({
  reducer: {
    conversations: conversationReducer,
    messages: messageReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export { useConversations } from '../hooks/useConversations'
export { useMessages } from '../hooks/useMessages'

export {
  fetchConversations,
  fetchConversation,
  deleteConversation,
  updateConversation,
  setCurrentConversation,
} from './slices/conversation.slice'

export {
  addMessage,
  appendToLastMessage,
  setMessages,
  clearMessages,
  setLoading,
  setStreaming,
} from './slices/message.slice'
