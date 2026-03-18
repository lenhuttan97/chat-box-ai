import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { AIProvider, GenerateOptions } from './ai-provider.interface'

@Injectable()
export class GeminiProvider implements AIProvider {
  private readonly logger = new Logger(GeminiProvider.name)
  private readonly genAI: GoogleGenerativeAI
  private readonly modelName = 'gemini-3.1-flash-lite-preview'

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY')
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined')
    }
    this.genAI = new GoogleGenerativeAI(apiKey)
  }

  get name(): string {
    return 'gemini'
  }

  async *generateStream(options: GenerateOptions): AsyncGenerator<string> {
    const generationConfig = {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxTokens ?? 2048,
    }

    const modelConfig: {
      model: string
      generationConfig: typeof generationConfig
      systemInstruction?: { role: string; parts: Array<{ text: string }> }
    } = {
      model: this.modelName,
      generationConfig,
    }

    if (options.systemPrompt) {
      modelConfig.systemInstruction = {
        role: 'system',
        parts: [{ text: options.systemPrompt }],
      }
    }

    const model = this.genAI.getGenerativeModel(modelConfig)

    const contents = this.buildContents(options.history || [], options.message)

    try {
      const result = await model.generateContentStream({
        contents,
      })

      for await (const chunk of result.stream) {
        const text = chunk.text()
        if (text) {
          yield text
        }
      }
    } catch (error) {
      this.logger.error('Gemini API error', error)
      throw new ServiceUnavailableException('AI service unavailable')
    }
  }

  private buildContents(
    history: Array<{ role: string; parts: Array<{ text: string }> }>,
    currentMessage: string,
  ): Array<{ role: string; parts: Array<{ text: string }> }> {
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = []

    for (const msg of history) {
      contents.push({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: msg.parts,
      })
    }

    contents.push({
      role: 'user',
      parts: [{ text: currentMessage }],
    })

    return contents
  }

  async generateContent(prompt: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    })

    try {
      const result = await model.generateContent(prompt)
      return result.response.text()
    } catch (error) {
      this.logger.error('Gemini API error', error)
      throw new ServiceUnavailableException('AI service unavailable')
    }
  }
}
