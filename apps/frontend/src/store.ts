import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    chat: () => ({ messages: [], loading: false, streaming: false, error: null }),
    conversations: () => ({ items: [], currentId: null, loading: false }),
    auth: () => ({ user: null, loading: false, error: null }),
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
