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
  systemPrompt?: string
  temperature?: number
  maxTokens?: number
}

export interface AnalyzeContextResponse {
  'context': string
  contextToken: number
  temperature: number
  maxTokens: number
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
        systemPrompt: options.systemPrompt,
        temperature: options.temperature,
        maxTokens: options.maxTokens,
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

  async analyzeContext(messages: Array<{ role: string; content: string }>): Promise<AnalyzeContextResponse> {
    this.logger.log('Analyzing conversation context for auto-settings')

    const historyText = messages
      .slice(-20)
      .map((m) => `${m.role}: ${m.content}`)
      .join('\n')

    const prompt = `Phân tích đoạn chat sau và trả về JSON:
{
  "context": "Một hoặc hai câu bổ sung context cho system prompt (bổ sung thêm, không thay thế)",
  "contextToken": số token phù hợp (1024, 2048, 4096, 8192, 16384, 32000, 64000, 100000),
  "temperature": số từ 0.1 đến 1.0,
  "maxTokens": số token phù hợp (512, 1024, 2048, 4096, 8192)
}

Chỉ trả về JSON, không giải thích gì thêm.

Conversation history:
${historyText}`

    try {
      const result = await this.geminiProvider.generateContent(prompt)
      this.logger.log(`AI analysis result: ${result}`)
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        this.logger.log(`Parsed context: ${JSON.stringify(parsed)}`)
        return {
          'context': parsed['context'] || '',
          contextToken: parsed.contextToken || 4096,
          temperature: parsed.temperature || 0.7,
          maxTokens: parsed.maxTokens || 2048,
        }
      }
      this.logger.warn('No JSON found in AI response')
      return this.getDefaultContext()
    } catch (error) {
      this.logger.error('Error analyzing context', error)
      return this.getDefaultContext()
    }
  }

  private getDefaultContext(): AnalyzeContextResponse {
    return {
      'context': '',
      contextToken: 4096,
      temperature: 0.7,
      maxTokens: 2048,
    }
  }
}
