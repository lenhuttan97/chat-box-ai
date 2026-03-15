import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { conversationService, Conversation } from '../../middleware/conversation.middleware'
import { setMessages } from './message.slice'

interface ConversationState {
  items: Conversation[]
  currentConversation: Conversation | null
  loading: boolean
  error: string | null
}

const initialState: ConversationState = {
  items: [],
  currentConversation: null,
  loading: false,
  error: null,
}

export const fetchConversations = createAsyncThunk('conversations/fetchAll', async () => {
  return await conversationService.getConversations()
})

export const fetchConversation = createAsyncThunk('conversations/fetchOne', async (id: string, { dispatch }) => {
  const [conversation, messages] = await Promise.all([
    conversationService.getConversation(id),
    conversationService.getMessages(id),
  ])
  dispatch(setMessages(messages))
  return conversation
})

export const deleteConversation = createAsyncThunk('conversations/delete', async (id: string) => {
  await conversationService.deleteConversation(id)
  return id
})

export const updateConversation = createAsyncThunk(
  'conversations/update',
  async ({ id, data }: { id: string; data: { name?: string; systemPrompt?: string; temperature?: number; maxTokens?: number } }) => {
    return await conversationService.updateConversation(id, data)
  },
)

const conversationSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    setCurrentConversation: (state, action: PayloadAction<Conversation | null>) => {
      state.currentConversation = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch conversations'
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.currentConversation = action.payload
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload)
        if (state.currentConversation?.id === action.payload) {
          state.currentConversation = null
        }
      })
      .addCase(updateConversation.fulfilled, (state, action) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
        if (state.currentConversation?.id === action.payload.id) {
          state.currentConversation = action.payload
        }
      })
  },
})

export const { setCurrentConversation, clearError } = conversationSlice.actions
export default conversationSlice.reducer
