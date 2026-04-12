export interface Message {
  id: string
  conversationId?: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export interface Conversation {
  id: string
  name: string
  userId?: string
  deviceId?: string
  systemPrompt?: string
  autoPrompt?: string
  contextToken: number
  temperature: number
  maxTokens: number
  messageCount: number
  createdAt: string
  updatedAt: string
}


export interface ConversationState {
  items: Conversation[]
  currentConversation: Conversation | null
  loading: boolean
  error: string | null
}