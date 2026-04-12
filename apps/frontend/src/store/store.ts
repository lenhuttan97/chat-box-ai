import { configureStore } from '@reduxjs/toolkit'
import conversationReducer from './slices/conversation.slice.ts'
import messageReducer from './slices/message.slice.ts'
import authReducer from './slices/auth.slice.ts'
import userReducer from './slices/user.slice.ts'
import themeReducer from './slices/theme.slice.ts'

export const store = configureStore({
  reducer: {
    conversations: conversationReducer,
    messages: messageReducer,
    auth: authReducer,
    user: userReducer,
    theme: themeReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch