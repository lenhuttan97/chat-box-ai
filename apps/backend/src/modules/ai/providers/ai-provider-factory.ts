import { Injectable, Logger, Provider } from '@nestjs/common'
import { AIProvider } from './ai-provider.interface'
import { GeminiProvider } from './gemini.provider'

@Injectable()
export class AiProviderFactory {
  private readonly logger = new Logger(AiProviderFactory.name)
  private readonly providers: Map<string, AIProvider>

  constructor(private readonly geminiProvider: GeminiProvider) {
    this.providers = new Map()
    this.registerProvider('gemini', this.geminiProvider)
    this.logger.log('AiProviderFactory initialized with providers: gemini')
  }

  private registerProvider(name: string, provider: AIProvider): void {
    this.providers.set(name, provider)
  }

  getProvider(name: string): AIProvider {
    const provider = this.providers.get(name)
    if (!provider) {
      this.logger.warn(`Provider ${name} not found, falling back to gemini`)
      return this.geminiProvider
    }
    return provider
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys())
  }
}

export const aiProviderFactoryProvider: Provider = {
  provide: AiProviderFactory,
  useClass: AiProviderFactory,
}
