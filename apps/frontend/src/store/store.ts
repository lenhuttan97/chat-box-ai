import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';

const rootReducer = {
  chat: () => ({ messages: [], loading: false, streaming: false, error: null }),
  conversations: () => ({ items: [], currentId: null, loading: false }),
  auth: () => ({ user: null, loading: false, error: null }),
};

export const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
