import { Test, TestingModule } from '@nestjs/testing'
import { ConversationsService } from '../../modules/conversations/conversations.service'
import { ConversationsRepository } from '../../modules/conversations/repository/conversations.repository'
import { NotFoundException } from '@nestjs/common'

describe('ConversationsService', () => {
  let service: ConversationsService
  let repository: jest.Mocked<ConversationsRepository>

  const mockConversation = {
    id: 'conv-1',
    name: 'Test Conversation',
    userId: 'user-1',
    deviceId: null,
    systemPrompt: null,
    autoPrompt: null,
    contextToken: 4096,
    temperature: 0.7,
    maxTokens: 2048,
    messageCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockMessage = {
    id: 'msg-1',
    conversationId: 'conv-1',
    role: 'user',
    content: 'Hello',
    createdAt: new Date(),
  }

  beforeEach(async () => {
    const mockRepository = {
      createConversation: jest.fn(),
      findAllConversations: jest.fn(),
      findConversationsByUserId: jest.fn(),
      findConversationsByDeviceId: jest.fn(),
      findConversationById: jest.fn(),
      updateConversation: jest.fn(),
      deleteConversation: jest.fn(),
      createMessage: jest.fn(),
      findMessagesByConversationId: jest.fn(),
      findMessagesByConversationIdNoPaginate: jest.fn(),
      findMessageById: jest.fn(),
      deleteMessage: jest.fn(),
      countMessagesByConversationId: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationsService,
        { provide: ConversationsRepository, useValue: mockRepository },
      ],
    }).compile()

    service = module.get<ConversationsService>(ConversationsService)
    repository = module.get(ConversationsRepository)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('createConversation', () => {
    it('should create a conversation', async () => {
      const dto = { name: 'Test Conversation' }
      repository.createConversation.mockResolvedValue(mockConversation as any)

      const result = await service.createConversation(dto)

      expect(repository.createConversation).toHaveBeenCalledWith(dto)
      expect(result.name).toBe('Test Conversation')
    })
  })

  describe('findAllConversations', () => {
    it('should return all conversations', async () => {
      repository.findAllConversations.mockResolvedValue({ data: [mockConversation], total: 1 } as any)

      const result = await service.findAllConversations()

      expect(repository.findAllConversations).toHaveBeenCalled()
      expect(result.data).toHaveLength(1)
      expect(result.totalElement).toBe(1)
    })
  })

  describe('findConversationById', () => {
    it('should return conversation by id', async () => {
      repository.findConversationById.mockResolvedValue(mockConversation as any)

      const result = await service.findConversationById('conv-1')

      expect(repository.findConversationById).toHaveBeenCalledWith('conv-1')
      expect(result.id).toBe('conv-1')
    })

    it('should throw NotFoundException if not found', async () => {
      repository.findConversationById.mockResolvedValue(null)

      await expect(service.findConversationById('invalid')).rejects.toThrow(NotFoundException)
    })
  })

  describe('findMessagesByConversationId', () => {
    it('should return messages for conversation', async () => {
      repository.findMessagesByConversationId.mockResolvedValue({ data: [mockMessage], total: 1 } as any)

      const result = await service.findMessagesByConversationId('conv-1')

      expect(repository.findMessagesByConversationId).toHaveBeenCalledWith('conv-1', 1, 50)
      expect(result.data).toHaveLength(1)
      expect(result.totalElement).toBe(1)
    })
  })

  describe('createMessage', () => {
    it('should create message and update count', async () => {
      const dto = { conversationId: 'conv-1', role: 'user', content: 'Hello' }
      repository.createMessage.mockResolvedValue(mockMessage as any)
      repository.countMessagesByConversationId.mockResolvedValue(1)
      repository.updateConversation.mockResolvedValue(mockConversation as any)

      const result = await service.createMessage(dto)

      expect(repository.createMessage).toHaveBeenCalled()
      expect(repository.countMessagesByConversationId).toHaveBeenCalledWith('conv-1')
      expect(result.content).toBe('Hello')
    })
  })

  describe('deleteConversation', () => {
    it('should delete conversation', async () => {
      repository.deleteConversation.mockResolvedValue()

      await service.deleteConversation('conv-1')

      expect(repository.deleteConversation).toHaveBeenCalledWith('conv-1')
    })
  })

  describe('deleteMessage', () => {
    it('should delete message', async () => {
      repository.findMessageById.mockResolvedValue(mockMessage as any)
      repository.deleteMessage.mockResolvedValue()

      await service.deleteMessage('msg-1')

      expect(repository.deleteMessage).toHaveBeenCalledWith('msg-1')
    })
  })
})
