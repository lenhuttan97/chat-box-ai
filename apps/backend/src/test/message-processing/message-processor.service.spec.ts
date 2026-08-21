import { Test, TestingModule } from '@nestjs/testing'
import { MessageProcessorService } from '../../../src/modules/message-processing/message-processor.service'
import { IntentDetectorService } from '../../../src/modules/message-processing/intent-detector'
import { MessageRouterService } from '../../../src/modules/message-processing/message-router/message-router.service'
import { QuestionDecomposerService } from '../../../src/modules/message-processing/question-decomposer'
import { ContextAugmenterService } from '../../../src/modules/message-processing/context-augmenter'

describe('MessageProcessorService', () => {
  let service: MessageProcessorService
  let intentDetector: any
  let router: any
  let decomposer: any
  let contextAugmenter: any

  beforeEach(async () => {
    const mockIntentDetector = {
      detect: jest.fn(),
    }

    const mockRouter = {
      route: jest.fn(),
    }

    const mockDecomposer = {
      decompose: jest.fn(),
    }

    const mockContextAugmenter = {
      augment: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageProcessorService,
        { provide: IntentDetectorService, useValue: mockIntentDetector },
        { provide: MessageRouterService, useValue: mockRouter },
        { provide: QuestionDecomposerService, useValue: mockDecomposer },
        { provide: ContextAugmenterService, useValue: mockContextAugmenter },
      ],
    }).compile()

    service = module.get<MessageProcessorService>(MessageProcessorService)
    intentDetector = module.get(IntentDetectorService)
    router = module.get(MessageRouterService)
    decomposer = module.get(QuestionDecomposerService)
    contextAugmenter = module.get(ContextAugmenterService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('process', () => {
    it('should process message through full pipeline', async () => {
      const message = 'What is the weather today?'
      const conversationId = 'conv-1'
      const history = [{ role: 'user', content: 'Hello' }]

      const mockIntent = {
        intent: 'inquiry',
        confidence: 0.9,
        requiresDecomposition: false,
      }
      
      const mockRoute = {
        provider: 'gemini',
        routeReason: 'General inquiry',
      }
      
      const mockAugmentation = {
        augmentedPrompt: 'What is the weather today?',
        contextAdded: true,
      }

      intentDetector.detect.mockReturnValue(mockIntent)
      router.route.mockReturnValue(mockRoute)
      contextAugmenter.augment.mockResolvedValue(mockAugmentation)

      const result = await service.process(message, conversationId, history)

      expect(intentDetector.detect).toHaveBeenCalledWith(message)
      expect(router.route).toHaveBeenCalledWith(message, mockIntent)
      expect(contextAugmenter.augment).toHaveBeenCalledWith(message, conversationId, history)
      expect(result.originalMessage).toBe(message)
      expect(result.intent).toEqual(mockIntent)
      expect(result.route).toEqual(mockRoute)
      expect(result.augmentation).toEqual(mockAugmentation)
    })

    it('should handle decomposition when required', async () => {
      const message = 'Compare AI and ML and their applications'
      const conversationId = 'conv-1'
      const history: Array<{ role: string; content: string }> = []

      const mockIntent = {
        intent: 'inquiry',
        confidence: 0.85,
        requiresDecomposition: true,
      }
      
      const mockRoute = {
        provider: 'gemini',
        routeReason: 'General inquiry',
      }
      
      const mockDecomposition = {
        canDecompose: true,
        subQuestions: [
          { subQuestion: 'What is AI?', mainTopic: 'AI' },
          { subQuestion: 'What is ML?', mainTopic: 'ML' },
        ],
      }
      
      const mockAugmentation = {
        augmentedPrompt: 'Compare AI and ML',
        contextAdded: false,
      }

      intentDetector.detect.mockReturnValue(mockIntent)
      router.route.mockReturnValue(mockRoute)
      decomposer.decompose.mockReturnValue(mockDecomposition)
      contextAugmenter.augment.mockResolvedValue(mockAugmentation)

      const result = await service.process(message, conversationId, history)

      expect(decomposer.decompose).toHaveBeenCalledWith(message)
      expect(result.decomposition.canDecompose).toBe(true)
      expect(result.processedMessage).toContain('What is AI?')
    })

    it('should use augmented prompt when decomposition not required', async () => {
      const message = 'Hello AI'
      const conversationId = 'conv-1'
      const history: Array<{ role: string; content: string }> = []

      const mockIntent = {
        intent: 'greeting',
        confidence: 0.95,
        requiresDecomposition: false,
      }
      
       const mockRoute = {
         handler: 'general_ai',
         processedMessage: 'What is the weather today?',
         context: {
           intent: 'inquiry',
           confidence: 0.9,
         }
       }
      
      const mockDecomposition = {
        canDecompose: false,
        subQuestions: [],
      }
      
      const mockAugmentation = {
        augmentedPrompt: 'Hello AI, how can I help you?',
        contextAdded: true,
      }

      intentDetector.detect.mockReturnValue(mockIntent)
      router.route.mockReturnValue(mockRoute)
      decomposer.decompose.mockReturnValue(mockDecomposition)
      contextAugmenter.augment.mockResolvedValue(mockAugmentation)

      const result = await service.process(message, conversationId, history)

      expect(result.processedMessage).toBe('Hello AI, how can I help you?')
    })
  })
})