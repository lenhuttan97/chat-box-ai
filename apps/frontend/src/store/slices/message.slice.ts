import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Message } from '../../middleware/conversation.service'

interface MessageState {
  items: Message[]
  loading: boolean
  streaming: boolean
  error: string | null
}

const initialState: MessageState = {
  items: [],
  loading: false,
  streaming: false,
  error: null,
}

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.items.push(action.payload)
    },
    appendToLastMessage: (state, action: PayloadAction<string>) => {
      const lastMessage = state.items[state.items.length - 1]
      if (lastMessage && lastMessage.role === 'assistant') {
        lastMessage.content += action.payload
      }
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.items = action.payload
    },
    clearMessages: (state) => {
      state.items = []
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setStreaming: (state, action: PayloadAction<boolean>) => {
      state.streaming = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const { addMessage, appendToLastMessage, setMessages, clearMessages, setLoading, setStreaming, clearError } =
  messageSlice.actions
export default messageSlice.reducer
