# Task: AI Service Refactor

## Task Details

| Trường | Giá trị |
|--------|---------|
| Feature | AI Service Refactor |
| Task ID | T001 |
| Status | pending |

## Mô tả

Refactor `AiService` để tách biệt rõ ràng:
- **Business Logic**: Xử lý history, context, message formatting
- **Provider Logic**: Gọi external AI APIs

## Requirements

### 1. Tách business logic khỏi provider-specific code

```typescript
// BEFORE: AiService xử lý cả hai
async *sendMessage(options: SendMessageOptions): AsyncGenerator<StreamChunk> {
  const history = this.buildHistory(options)      // Business logic
  const stream = await this.geminiProvider.generateStream({...})  // Provider
}

// AFTER: AiService chỉ xử lý business logic
async *sendMessage(options: SendMessageOptions): AsyncGenerator<StreamChunk> {
  const history = this.buildHistory(options)
  const provider = this.getProvider(options.provider || 'gemini')
  const stream = await provider.generate({ message, history, ... })
}
```

### 2. Cần tách

| Logic | Mô tả | Nơi xử lý |
|-------|-------|-----------|
| History building | Format messages thành provider format | AiService |
| Context truncation | Cắt history nếu vượt contextToken | AiService |
| System prompt injection | Thêm system prompt vào request | AiService |
| Provider selection | Chọn provider (gemini/ollama/openai) | AiService |
| API calling | Gọi external API | Provider classes |
| Response streaming | Stream từ AI | Provider classes |

### 3. Chuẩn bị cho multi-provider

```typescript
interface AIProvider {
  generate(options: GenerateOptions): AsyncGenerator<string>
  generateWithSystem(systemPrompt: string, options: GenerateOptions): AsyncGenerator<string>
}

class GeminiProvider implements AIProvider { ... }
class OllamaProvider implements AIProvider { ... }
class OpenAIProvider implements AIProvider { ... }
```

## Implementation Steps

1. **Tạo AIProvider interface** - định nghĩa contract cho tất cả providers
2. **Refactor AiService** - tách business logic riêng
3. **Giữ nguyên GeminiProvider** - implement AIProvider interface
4. **Viết tests** - đảm bảo refactor không break functionality

## Acceptance Criteria

- [ ] AiService chỉ chứa business logic
- [ ] Provider classes implement AIProvider interface
- [ ] Dễ dàng thêm provider mới (Ollama, OpenAI)
- [ ] Tests pass sau khi refactor
- [ ] Functionality giữ nguyên
