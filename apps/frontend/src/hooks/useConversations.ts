import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../store'
import {
  fetchConversations,
  fetchConversation,
  deleteConversation,
  updateConversation,
  setCurrentConversation,
} from '../store/slices/conversation.slice'
import { clearMessages } from '../store/slices/message.slice'
import { Conversation } from '../middleware/conversation.middleware'

export const useConversations = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { items, currentConversation, loading, error } = useSelector((state: RootState) => state.conversations)

  const loadConversations = useCallback(() => {
    dispatch(fetchConversations())
  }, [dispatch])

  const loadConversation = useCallback(
    (id: string) => {
      dispatch(fetchConversation(id))
    },
    [dispatch],
  )

  const removeConversation = useCallback(
    (id: string) => {
      dispatch(deleteConversation(id))
    },
    [dispatch],
  )

  const editConversation = useCallback(
    (id: string, data: Partial<Conversation>) => {
      dispatch(updateConversation({ id, data }))
    },
    [dispatch],
  )

  const selectConversation = useCallback(
    (conversation: Conversation | null) => {
      dispatch(setCurrentConversation(conversation))
      if (!conversation) {
        dispatch(clearMessages())
      }
    },
    [dispatch],
  )

  return {
    conversations: items,
    currentConversation,
    loading,
    error,
    loadConversations,
    loadConversation,
    removeConversation,
    editConversation,
    selectConversation,
  }
}
