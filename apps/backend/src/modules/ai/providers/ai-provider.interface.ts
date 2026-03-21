export interface GenerateOptions {
  message: string
  history?: Array<{ role: string; parts: Array<{ text: string }> }>
  systemPrompt?: string
  temperature?: number
  maxTokens?: number
  model?: string
}

export interface AnalyzeOptions {
  messages: Array<{ role: string; content: string }>
}

export interface AnalyzeResult {
  context: string
  contextToken: number
  temperature: number
  maxTokens: number
}

export interface AIProvider {
  readonly name: string

  generateStream(options: GenerateOptions): AsyncGenerator<string>

  generateContent(prompt: string): Promise<string>
}

export const AI_PROVIDER_TOKEN = 'AI_PROVIDER'
