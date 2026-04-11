import { configureStore } from '@reduxjs/toolkit'
import conversationReducer from './slices/conversation.slice'
import messageReducer from './slices/message.slice'
import authReducer from './slices/auth.slice'
import userReducer from './slices/user.slice'
import themeReducer from './slices/theme.slice'

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