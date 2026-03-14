import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GoogleGenerativeAI } from '@google/generative-ai'

export interface GenerateStreamOptions {
  message: string
  history?: Array<{ role: string; parts: Array<{ text: string }> }>
}

@Injectable()
export class GeminiProvider {
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

  async *generateStream(options: GenerateStreamOptions): AsyncGenerator<string> {
    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    })

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
}
