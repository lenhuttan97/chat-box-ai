import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AiService } from './ai.service'
import { GeminiProvider } from './providers/gemini.provider'
import { AiProviderFactory, aiProviderFactoryProvider } from './providers/ai-provider-factory'
import { AIProvider } from './providers/ai-provider.interface'

@Module({
  imports: [ConfigModule],
  providers: [
    AiService,
    GeminiProvider,
    AiProviderFactory,
    {
      provide: AIProvider,
      useExisting: GeminiProvider,
    },
  ],
  exports: [AiService, AIProvider],
})
export class AiModule {}
