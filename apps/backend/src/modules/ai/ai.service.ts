import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GeminiProvider } from './providers/gemini.provider'

export interface StreamChunk {
  chunk?: string
  conversationId?: string
  done?: boolean
}

export interface SendMessageOptions {
  message: string
  conversationId?: string
  history?: Array<{ role: string; content: string }>
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name)

  constructor(
    private readonly configService: ConfigService,
    private readonly geminiProvider: GeminiProvider,
  ) {}

  async *sendMessage(options: SendMessageOptions): AsyncGenerator<StreamChunk> {
    this.logger.log(`Sending message: ${options.message.substring(0, 50)}...`)

    const fullHistory = this.buildHistory(options)

    try {
      const stream = await this.geminiProvider.generateStream({
        message: options.message,
        history: fullHistory,
      })

      for await (const chunk of stream) {
        yield { chunk }
      }

      yield { done: true }
    } catch (error) {
      this.logger.error('Error generating response', error)
      throw error
    }
  }

  private buildHistory(options: SendMessageOptions): Array<{ role: string; parts: Array<{ text: string }> }> {
    const history = options.history || []

    const formattedHistory = history.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }))

    return formattedHistory
  }
}
