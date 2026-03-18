import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AiService } from './ai.service'
import { GeminiProvider } from './providers/gemini.provider'
import { AI_PROVIDER_TOKEN } from './providers/ai-provider.interface'

@Module({
  imports: [ConfigModule],
  providers: [
    AiService,
    GeminiProvider,
    {
      provide: AI_PROVIDER_TOKEN,
      useExisting: GeminiProvider,
    },
  ],
  exports: [AiService, AI_PROVIDER_TOKEN],
})
export class AiModule {}