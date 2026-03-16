# Task: AI Provider Factory

## Task Details

| Trường | Giá trị |
|--------|---------|
| Feature | AI Service Refactor |
| Task ID | T002 |
| Status | pending |

## Mô tả

Tạo factory pattern để quản lý nhiều AI providers (Gemini, Ollama, OpenAI).

## Requirements

### 1. Tạo AIProvider Interface

```typescript
export interface GenerateOptions {
  message: string
  history?: Array<{ role: string; content: string }>
  systemPrompt?: string
  temperature?: number
  maxTokens?: number
  model?: string
}

export interface AIProvider {
  name: string
  generate(options: GenerateOptions): AsyncGenerator<string>
}
```

### 2. Tạo Provider Factory

```typescript
@Injectable()
export class AIProviderFactory {
  private providers: Map<string, AIProvider> = new Map()

  constructor(
    private geminiProvider: GeminiProvider,
    // private ollamaProvider: OllamaProvider,
    // private openaiProvider: OpenAIProvider,
  ) {
    this.providers.set('gemini', geminiProvider)
    // this.providers.set('ollama', ollamaProvider)
    // this.providers.set('openai', openaiProvider)
  }

  getProvider(name: string = 'gemini'): AIProvider {
    const provider = this.providers.get(name)
    if (!provider) {
      throw new Error(`AI Provider '${name}' not supported`)
    }
    return provider
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys())
  }
}
```

### 3. Implement Providers

| Provider | Model mặc định | Status |
|----------|----------------|--------|
| Gemini | gemini-1.5-flash-lite-preview | ✅ có sẵn |
| Ollama | llama2 | ⬜ cần implement |
| OpenAI | gpt-4o-mini | ⬜ cần implement |

### 4. Update AiService sử dụng Factory

```typescript
@Injectable()
export class AiService {
  constructor(
    private providerFactory: AIProviderFactory,
  ) {}

  async *sendMessage(options: SendMessageOptions): AsyncGenerator<StreamChunk> {
    const provider = this.providerFactory.getProvider(options.provider || 'gemini')
    const stream = await provider.generate({
      message: options.message,
      history: options.history,
      systemPrompt: options.systemPrompt,
      temperature: options.temperature,
      maxTokens: options.maxTokens,
    })

    for await (const chunk of stream) {
      yield { chunk }
    }
    yield { done: true }
  }
}
```

## Implementation Steps

1. **Tạo AIProvider interface** trong `modules/ai/providers/interfaces/`
2. **Tạo AIProviderFactory** trong `modules/ai/`
3. **Update AiService** sử dụng factory
4. **Tạo OllamaProvider** (placeholder cho FT-006)
5. **Tạo OpenAIProvider** (placeholder cho FT-006)

## Acceptance Criteria

- [ ] AIProvider interface định nghĩa rõ ràng
- [ ] Factory pattern hoạt động đúng
- [ ] Dễ dàng switch provider bằng tên
- [ ] Error handling khi provider không tồn tại
- [ ] Backward compatible với code hiện tại
