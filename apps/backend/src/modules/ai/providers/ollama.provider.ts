import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AIProvider, GenerateOptions } from './ai-provider.interface'

@Injectable()
export class OllamaProvider implements AIProvider {
  private readonly logger = new Logger(OllamaProvider.name)
  private readonly baseUrl: string
  private readonly defaultModel: string
  private cachedModels: string[] | null = null

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('OLLAMA_BASE_URL') || 'http://localhost:11434'
    this.defaultModel = this.configService.get<string>('OLLAMA_MODEL') || 'llama3'
    this.logger.log(`OllamaProvider initialized with baseUrl: ${this.baseUrl}`)
  }

  get name(): string {
    return 'ollama'
  }

  async *generateStream(options: GenerateOptions): AsyncGenerator<string> {
    const model = options.model || this.defaultModel
    const messages = this.buildMessages(options)

    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages,
          stream: true,
        }),
      })

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line)
              if (data.message?.content) {
                yield data.message.content
              }
            } catch (e) {
              // Ignore parse errors for incomplete JSON
            }
          }
        }
      }
    } catch (error) {
      this.logger.error('Ollama API error', error)
      throw new ServiceUnavailableException('Ollama service unavailable')
    }
  }

  async generateContent(prompt: string): Promise<string> {
    const model = this.defaultModel

    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          stream: false,
        }),
      })

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`)
      }

      const data = await response.json()
      return data.message?.content || ''
    } catch (error) {
      this.logger.error('Ollama API error', error)
      throw new ServiceUnavailableException('Ollama service unavailable')
    }
  }

  async listModels(): Promise<string[]> {
    if (this.cachedModels) {
      return this.cachedModels
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/tags`)
      if (!response.ok) {
        return [this.defaultModel]
      }

      const data = await response.json()
      this.cachedModels = data.models?.map((m: { name: string }) => m.name) || [this.defaultModel]
      return this.cachedModels
    } catch (error) {
      this.logger.warn('Failed to fetch Ollama models', error)
      return [this.defaultModel]
    }
  }

  private buildMessages(options: GenerateOptions): Array<{ role: string; content: string }> {
    const messages: Array<{ role: string; content: string }> = []

    if (options.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt })
    }

    for (const msg of options.history || []) {
      const role = msg.role === 'model' ? 'assistant' : msg.role
      const content = msg.parts?.map((p) => p.text).join('') || ''
      if (content) {
        messages.push({ role, content })
      }
    }

    messages.push({ role: 'user', content: options.message })

    return messages
  }
}
