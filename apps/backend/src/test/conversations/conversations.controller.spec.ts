import { Test, TestingModule } from '@nestjs/testing'
import { ConversationsController } from '../../modules/conversations/conversations.controller'
import { ConversationsService } from '../../modules/conversations/conversations.service'
import { AiService } from '../../modules/ai/ai.service'
import { DeviceService } from '../../modules/device/device.service'
import { MessageProcessorService } from '../../modules/message-processing/message-processor.service'
import { FilesService } from '../../modules/files/files.service'
import { HttpStatus } from '@nestjs/common'

describe('ConversationsController', () => {
  let controller: ConversationsController
  let conversationsService: jest.Mocked<ConversationsService>
  let aiService: jest.Mocked<AiService>

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
    const mockConversationsService = {
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
      deleteMessage: jest.fn(),
      countMessages: jest.fn(),
    }

    const mockAiService = {
      sendMessage: jest.fn(),
      analyzeContext: jest.fn(),
    }

    const mockDeviceService = {
      findOrCreate: jest.fn(),
    }

    const mockMessageProcessor = {
      process: jest.fn(),
    }

    const mockFilesService = {
      processFile: jest.fn(),
      getFile: jest.fn(),
      getFileContent: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversationsController],
      providers: [
        { provide: ConversationsService, useValue: mockConversationsService },
        { provide: AiService, useValue: mockAiService },
        { provide: DeviceService, useValue: mockDeviceService },
        { provide: MessageProcessorService, useValue: mockMessageProcessor },
        { provide: FilesService, useValue: mockFilesService },
      ],
    }).compile()

    controller = module.get<ConversationsController>(ConversationsController)
    conversationsService = module.get(ConversationsService)
    aiService = module.get(AiService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('createConversation', () => {
    it('should create conversation', async () => {
      conversationsService.createConversation.mockResolvedValue(mockConversation as any)

      const result = await controller.createConversation({ name: 'Test' }, undefined)

      expect(conversationsService.createConversation).toHaveBeenCalled()
      expect(result.statusCode).toBe(HttpStatus.CREATED)
    })
  })

  describe('findAllConversations', () => {
    it('should return all conversations', async () => {
      conversationsService.findAllConversations.mockResolvedValue({ data: [mockConversation], totalElement: 1 } as any)

      const result = await controller.findAllConversations()

      expect(conversationsService.findAllConversations).toHaveBeenCalledWith(1, 10)
      expect(result.statusCode).toBe(HttpStatus.OK)
    })
  })

  describe('findConversationsByUserId', () => {
    it('should return user conversations', async () => {
      conversationsService.findConversationsByUserId.mockResolvedValue({ data: [mockConversation], totalElement: 1 } as any)

      const result = await controller.findConversationsByUserId('user-1')

      expect(conversationsService.findConversationsByUserId).toHaveBeenCalledWith('user-1', 1, 10)
      expect(result.statusCode).toBe(HttpStatus.OK)
    })
  })

  describe('findConversationById', () => {
    it('should return conversation by id', async () => {
      conversationsService.findConversationById.mockResolvedValue(mockConversation as any)

      const result = await controller.findConversationById('conv-1')

      expect(conversationsService.findConversationById).toHaveBeenCalledWith('conv-1')
      expect(result.statusCode).toBe(HttpStatus.OK)
    })
  })

  describe('updateConversation', () => {
    it('should update conversation', async () => {
      conversationsService.updateConversation.mockResolvedValue(mockConversation as any)

      const result = await controller.updateConversation('conv-1', { name: 'Updated' })

      expect(conversationsService.updateConversation).toHaveBeenCalledWith('conv-1', { name: 'Updated' })
      expect(result.statusCode).toBe(HttpStatus.OK)
    })
  })

  describe('deleteConversation', () => {
    it('should delete conversation', async () => {
      conversationsService.deleteConversation.mockResolvedValue()

      const result = await controller.deleteConversation('conv-1')

      expect(conversationsService.deleteConversation).toHaveBeenCalledWith('conv-1')
      expect(result.statusCode).toBe(HttpStatus.NO_CONTENT)
    })
  })

  describe('findMessagesByConversationId', () => {
    it('should return messages', async () => {
      conversationsService.findMessagesByConversationId.mockResolvedValue({ data: [mockMessage], totalElement: 1 } as any)

      const result = await controller.findMessagesByConversationId('conv-1')

      expect(conversationsService.findMessagesByConversationId).toHaveBeenCalledWith('conv-1', 1, 50)
      expect(result.statusCode).toBe(HttpStatus.OK)
    })
  })
})
