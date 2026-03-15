import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../store'
import { addMessage, appendToLastMessage, setMessages, clearMessages, setStreaming } from '../store/slices/message.slice'
import { fetchConversations, setCurrentConversation } from '../store/slices/conversation.slice'
import { messageService } from '../middleware/message.middleware'
import { v4 as uuidv4 } from 'uuid'

export const useMessages = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { items: messages, loading, streaming, error } = useSelector((state: RootState) => state.messages)
  const { currentConversation } = useSelector((state: RootState) => state.conversations)

  const sendMessage = useCallback(
    async (content: string) => {
      const tempId = uuidv4()
      dispatch(addMessage({ id: tempId, role: 'user', content, createdAt: new Date().toISOString() }))
      dispatch(addMessage({ id: uuidv4(), role: 'assistant', content: '', createdAt: new Date().toISOString() }))
      dispatch(setStreaming(true))

      try {
        await messageService.sendMessageWithStream(
          content,
          currentConversation?.id,
          (chunk) => {
            dispatch(appendToLastMessage(chunk))
          },
          async (conversationId) => {
            const { conversationService } = await import('../middleware/conversation.middleware')
            const [conversation, messages] = await Promise.all([
              conversationService.getConversation(conversationId),
              conversationService.getMessages(conversationId),
            ])
            dispatch(setCurrentConversation(conversation))
            dispatch(setMessages(messages))
            dispatch(fetchConversations())
          },
        )
      } catch (err) {
        console.error('Chat error:', err)
      } finally {
        dispatch(setStreaming(false))
      }
    },
    [dispatch, currentConversation],
  )

  const clearAllMessages = useCallback(() => {
    dispatch(clearMessages())
  }, [dispatch])

  return {
    messages,
    loading,
    streaming,
    error,
    sendMessage,
    clearAllMessages,
  }
}
