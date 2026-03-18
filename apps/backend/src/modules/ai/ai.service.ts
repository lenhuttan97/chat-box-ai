import { Injectable, Logger, BadRequestException, ServiceUnavailableException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AIProvider, GenerateOptions, AnalyzeResult } from './providers/ai-provider.interface'
import { AiProviderFactory } from './providers/ai-provider-factory'

export interface StreamChunk {
  chunk?: string
  conversationId?: string
  done?: boolean
}

export interface SendMessageOptions {
  message: string
  conversationId?: string
  provider?: string
  history?: Array<{ role: string; content: string }>
  systemPrompt?: string
  temperature?: number
  maxTokens?: number
}

export interface AnalyzeContextResponse {
  context: string
  contextToken: number
  temperature: number
  maxTokens: number
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name)

  constructor(
    private readonly configService: ConfigService,
    private readonly providerFactory: AiProviderFactory,
  ) {}

  async *sendMessage(options: SendMessageOptions): AsyncGenerator<StreamChunk> {
    this.logger.log(`Sending message: ${options.message.substring(0, 50)}...`)

    this.validateMessageOptions(options)

    const providerName = options.provider || 'gemini'
    const provider = this.providerFactory.getProvider(providerName)

    this.logger.log(`Using provider: ${provider.name}`)

    const fullHistory = this.buildHistory(options)

    try {
      const generateOptions: GenerateOptions = {
        message: options.message,
        history: fullHistory,
        systemPrompt: options.systemPrompt,
        temperature: options.temperature,
        maxTokens: options.maxTokens,
      }

      const stream = provider.generateStream(generateOptions)

      for await (const chunk of stream) {
        yield { chunk }
      }

      yield { done: true }
    } catch (error) {
      this.logger.error(`Error generating response from ${provider.name}`, error)
      throw new ServiceUnavailableException('AI service unavailable')
    }
  }

  private validateMessageOptions(options: SendMessageOptions): void {
    if (!options.message || options.message.trim().length === 0) {
      throw new BadRequestException('Message cannot be empty')
    }

    if (options.message.length > 100000) {
      throw new BadRequestException('Message too long (max 100000 characters)')
    }

    if (options.temperature !== undefined && (options.temperature < 0 || options.temperature > 2)) {
      throw new BadRequestException('Temperature must be between 0 and 2')
    }

    if (options.maxTokens !== undefined && options.maxTokens < 1) {
      throw new BadRequestException('maxTokens must be at least 1')
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
      const provider = this.providerFactory.getProvider('gemini')
      const result = await provider.generateContent(prompt)

      this.logger.log(`AI analysis result: ${result}`)
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        this.logger.log(`Parsed context: ${JSON.stringify(parsed)}`)
        return {
          context: parsed['context'] || '',
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
      context: '',
      contextToken: 4096,
      temperature: 0.7,
      maxTokens: 2048,
    }
  }
}
