import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { ConversationsRepository } from './repository/conversations.repository'
import { CreateConversationDto } from './dto/request/create-conversation.dto'
import { UpdateConversationDto } from './dto/request/update-conversation.dto'
import { CreateMessageDto } from './dto/request/create-message.dto'
import { ConversationResponseDto } from './dto/response/conversation-response.dto'
import { MessageResponseDto } from './dto/response/message-response.dto'

interface PaginatedResult<T> {
  data: T[]
  totalElement: number
}

@Injectable()
export class ConversationsService {
  private readonly logger = new Logger(ConversationsService.name)

  constructor(private readonly conversationsRepository: ConversationsRepository) {}

  // Conversation methods
  async createConversation(dto: CreateConversationDto): Promise<ConversationResponseDto> {
    this.logger.log('Creating conversation')
    const conversation = await this.conversationsRepository.createConversation(dto)
    return this.toConversationResponse(conversation)
  }

  async findConversationsByDeviceId(deviceId: string, page: number = 1, size: number = 10): Promise<PaginatedResult<ConversationResponseDto>> {
    this.logger.log(`Finding conversations for device: ${deviceId} - page: ${page}, size: ${size}`)
    const { data, total } = await this.conversationsRepository.findConversationsByDeviceId(deviceId, page, size)
    return { data: data.map((c) => this.toConversationResponse(c)), totalElement: total }
  }

  async findAllConversations(page: number = 1, size: number = 10): Promise<PaginatedResult<ConversationResponseDto>> {
    this.logger.log(`Finding all conversations - page: ${page}, size: ${size}`)
    const { data, total } = await this.conversationsRepository.findAllConversations(page, size)
    return { data: data.map((c) => this.toConversationResponse(c)), totalElement: total }
  }

  async findConversationsByUserId(userId: string, page: number = 1, size: number = 10): Promise<PaginatedResult<ConversationResponseDto>> {
    this.logger.log(`Finding conversations for user: ${userId} - page: ${page}, size: ${size}`)
    const { data, total } = await this.conversationsRepository.findConversationsByUserId(userId, page, size)
    return { data: data.map((c) => this.toConversationResponse(c)), totalElement: total }
  }

  async findConversationById(id: string): Promise<ConversationResponseDto> {
    this.logger.log(`Finding conversation: ${id}`)
    const conversation = await this.conversationsRepository.findConversationById(id)
    if (!conversation) {
      throw new NotFoundException(`Conversation ${id} not found`)
    }
    return this.toConversationResponse(conversation as any, false)
  }

  async updateConversation(id: string, dto: UpdateConversationDto): Promise<ConversationResponseDto> {
    this.logger.log(`Updating conversation: ${id}`)
    const conversation = await this.conversationsRepository.updateConversation(id, dto)
    return this.toConversationResponse(conversation)
  }

  async deleteConversation(id: string): Promise<void> {
    this.logger.log(`Deleting conversation: ${id}`)
    await this.conversationsRepository.deleteConversation(id)
  }

  // Message methods
  async createMessage(dto: CreateMessageDto): Promise<MessageResponseDto> {
    this.logger.log(`Creating message in conversation: ${dto.conversationId}`)
    const message = await this.conversationsRepository.createMessage({
      role: dto.role,
      content: dto.content,
      conversation: {
        connect: { id: dto.conversationId },
      },
    })
    
    // Update conversation messageCount and updatedAt
    const count = await this.conversationsRepository.countMessagesByConversationId(dto.conversationId!)
    await this.conversationsRepository.updateConversation(dto.conversationId!, {
      messageCount: count,
    })
    
    return this.toMessageResponse(message)
  }

  async findMessagesByConversationId(conversationId: string, page: number = 1, size: number = 50): Promise<PaginatedResult<MessageResponseDto>> {
    this.logger.log(`Finding messages for conversation: ${conversationId} - page: ${page}, size: ${size}`)
    const { data, total } = await this.conversationsRepository.findMessagesByConversationId(conversationId, page, size)
    return { data: data.map((m) => this.toMessageResponse(m)), totalElement: total }
  }

  async findMessagesByConversationIdNoPaginate(conversationId: string): Promise<MessageResponseDto[]> {
    this.logger.log(`Finding all messages for conversation (no paginate): ${conversationId}`)
    const messages = await this.conversationsRepository.findMessagesByConversationIdNoPaginate(conversationId)
    return messages.map((m) => this.toMessageResponse(m))
  }

  async countMessages(conversationId: string): Promise<number> {
    return this.conversationsRepository.countMessagesByConversationId(conversationId)
  }

  async deleteMessage(id: string): Promise<void> {
    this.logger.log(`Deleting message: ${id}`)
    const message = await this.conversationsRepository.findMessageById(id)
    if (message) {
      await this.conversationsRepository.deleteMessage(id)
    }
  }

  private toConversationResponse(
    conversation: {
      id: string
      name: string
      userId: string | null
      deviceId: string | null
      provider: string | null
      model: string | null
      systemPrompt: string | null
      autoPrompt: string | null
      contextToken: number
      temperature: number
      maxTokens: number
      messageCount: number
      createdAt: Date
      updatedAt: Date
      messages?: Array<{
        id: string
        conversationId: string
        role: string
        content: string
        createdAt: Date
      }>
    },
    includeMessages = false,
  ): ConversationResponseDto {
    const response: ConversationResponseDto = {
      id: conversation.id,
      name: conversation.name,
      userId: conversation.userId,
      deviceId: conversation.deviceId,
      provider: conversation.provider || 'gemini',
      model: conversation.model,
      systemPrompt: conversation.systemPrompt,
      autoPrompt: conversation.autoPrompt,
      contextToken: conversation.contextToken,
      temperature: conversation.temperature,
      maxTokens: conversation.maxTokens,
      messageCount: conversation.messageCount,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    }

    if (includeMessages && conversation.messages) {
      response.messages = conversation.messages.map((msg) => this.toMessageResponse(msg))
    }

    return response
  }

  private toMessageResponse(message: {
    id: string
    conversationId: string
    role: string
    content: string
    createdAt: Date
  }): MessageResponseDto {
    return {
      id: message.id,
      conversationId: message.conversationId,
      role: message.role,
      content: message.content,
      createdAt: message.createdAt,
    }
  }
}
