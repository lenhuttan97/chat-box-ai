import { MessageResponseDto } from './message-response.dto'

export class ConversationResponseDto {
  id: string
  name: string
  userId: string | null
  deviceId: string | null
  provider: string
  model: string | null
  systemPrompt: string | null
  autoPrompt: string | null
  contextToken: number
  temperature: number
  maxTokens: number
  messageCount: number
  createdAt: Date
  updatedAt: Date
  messages?: MessageResponseDto[]
}
