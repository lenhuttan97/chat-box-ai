import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { BadRequestException } from '@nestjs/common'
import { AiService, SendMessageOptions } from '../../modules/ai/ai.service'
import { AiProviderFactory } from '../../modules/ai/providers/ai-provider-factory'
import { AIProvider } from '../../modules/ai/providers/ai-provider.interface'

const createMockProvider = (): AIProvider => {
  return {
    name: 'gemini',
    generateStream: jest.fn(),
    generateContent: jest.fn(),
  } as unknown as AIProvider
}

describe('AiService', () => {
  let service: AiService
  let mockProvider: AIProvider

  beforeEach(async () => {
    mockProvider = createMockProvider()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: AiProviderFactory,
          useValue: {
            getProvider: jest.fn().mockReturnValue(mockProvider),
            getAvailableProviders: jest.fn().mockReturnValue(['gemini']),
          },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('test-key') },
        },
      ],
    }).compile()

    service = module.get<AiService>(AiService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('validation', () => {
    const baseOptions: SendMessageOptions = {
      message: 'Hello',
      provider: 'gemini',
    }

    it('should throw BadRequestException when message is empty', async () => {
      const options: SendMessageOptions = { ...baseOptions, message: '' }

      await expect(
        (async () => {
          for await (const _ of service.sendMessage(options)) {
            // empty
          }
        })(),
      ).rejects.toThrow(BadRequestException)
    })

    it('should throw BadRequestException when message is whitespace only', async () => {
      const options: SendMessageOptions = { ...baseOptions, message: '   ' }

      await expect(
        (async () => {
          for await (const _ of service.sendMessage(options)) {
            // empty
          }
        })(),
      ).rejects.toThrow(BadRequestException)
    })

    it('should throw BadRequestException when message exceeds 100000 chars', async () => {
      const options: SendMessageOptions = { ...baseOptions, message: 'a'.repeat(100001) }

      await expect(
        (async () => {
          for await (const _ of service.sendMessage(options)) {
            // empty
          }
        })(),
      ).rejects.toThrow(BadRequestException)
    })

    it('should throw BadRequestException when temperature out of range (> 2)', async () => {
      const options: SendMessageOptions = { ...baseOptions, temperature: 3 }

      await expect(
        (async () => {
          for await (const _ of service.sendMessage(options)) {
            // empty
          }
        })(),
      ).rejects.toThrow(BadRequestException)
    })

    it('should throw BadRequestException when temperature out of range (< 0)', async () => {
      const options: SendMessageOptions = { ...baseOptions, temperature: -0.1 }

      await expect(
        (async () => {
          for await (const _ of service.sendMessage(options)) {
            // empty
          }
        })(),
      ).rejects.toThrow(BadRequestException)
    })

    it('should throw BadRequestException when maxTokens is less than 1', async () => {
      const options: SendMessageOptions = { ...baseOptions, maxTokens: 0 }

      await expect(
        (async () => {
          for await (const _ of service.sendMessage(options)) {
            // empty
          }
        })(),
      ).rejects.toThrow(BadRequestException)
    })
  })

  describe('analyzeContext', () => {
    it('should return analyzed context settings', async () => {
      ;(mockProvider.generateContent as jest.Mock).mockResolvedValue(
        '{"context": "Test context", "contextToken": 4096, "temperature": 0.8, "maxTokens": 2048}',
      )

      const messages = [{ role: 'user', content: 'Test message' }]
      const result = await service.analyzeContext(messages)

      expect(result.context).toBe('Test context')
      expect(result.contextToken).toBe(4096)
      expect(result.temperature).toBe(0.8)
      expect(result.maxTokens).toBe(2048)
    })

    it('should return default values when AI response has no JSON', async () => {
      ;(mockProvider.generateContent as jest.Mock).mockResolvedValue('No JSON here')

      const messages = [{ role: 'user', content: 'Test' }]
      const result = await service.analyzeContext(messages)

      expect(result.context).toBe('')
      expect(result.contextToken).toBe(4096)
      expect(result.temperature).toBe(0.7)
      expect(result.maxTokens).toBe(2048)
    })

    it('should return default values when AI throws error', async () => {
      ;(mockProvider.generateContent as jest.Mock).mockRejectedValue(new Error('API Error'))

      const messages = [{ role: 'user', content: 'Test' }]
      const result = await service.analyzeContext(messages)

      expect(result.context).toBe('')
      expect(result.contextToken).toBe(4096)
      expect(result.temperature).toBe(0.7)
      expect(result.maxTokens).toBe(2048)
    })
  })
})
