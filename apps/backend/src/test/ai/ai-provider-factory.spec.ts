import { Test, TestingModule } from '@nestjs/testing'
import { AiProviderFactory } from '../../modules/ai/providers/ai-provider-factory'
import { GeminiProvider } from '../../modules/ai/providers/gemini.provider'
import { OllamaProvider } from '../../modules/ai/providers/ollama.provider'
import { ConfigService } from '@nestjs/config'

const mockConfigService = () => ({
  get: jest.fn().mockReturnValue('test-api-key'),
})

describe('AiProviderFactory', () => {
  let factory: AiProviderFactory

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiProviderFactory,
        GeminiProvider,
        OllamaProvider,
        {
          provide: ConfigService,
          useFactory: mockConfigService,
        },
      ],
    }).compile()

    factory = module.get<AiProviderFactory>(AiProviderFactory)
  })

  describe('getProvider', () => {
    it('should return gemini provider when requesting gemini', () => {
      const provider = factory.getProvider('gemini')
      expect(provider.name).toBe('gemini')
    })

    it('should return same instance for same provider', () => {
      const provider1 = factory.getProvider('gemini')
      const provider2 = factory.getProvider('gemini')
      expect(provider1).toBe(provider2)
    })

    it('should fallback to gemini when requesting unknown provider', () => {
      const provider = factory.getProvider('unknown')
      expect(provider.name).toBe('gemini')
    })
  })

  describe('getAvailableProviders', () => {
    it('should return list of available providers', () => {
      const providers = factory.getAvailableProviders()
      expect(providers).toContain('gemini')
    })
  })
})
