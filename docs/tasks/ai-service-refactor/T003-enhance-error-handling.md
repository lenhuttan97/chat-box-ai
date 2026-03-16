# Task: Enhance Error Handling

## Task Details

| Trường | Giá trị |
|--------|---------|
| Feature | AI Service Refactor |
| Task ID | T003 |
| Status | pending |

## Mô tả

Thêm error handling, validation, và retry logic cho AI service.

## Requirements

### 1. Validation

```typescript
// Validate options trước khi gọi AI
const validationRules = {
  message: { required: true, maxLength: 10000 },
  temperature: { min: 0, max: 2 },
  maxTokens: { min: 1, max: 8192 },
  contextToken: { min: 1024, max: 128000 },
}

validateOptions(options: SendMessageOptions) {
  if (!options.message || options.message.trim().length === 0) {
    throw new BadRequestException('Message is required')
  }
  if (options.message.length > 10000) {
    throw new BadRequestException('Message too long (max 10000 chars)')
  }
  if (options.temperature && (options.temperature < 0 || options.temperature > 2)) {
    throw new BadRequestException('Temperature must be between 0 and 2')
  }
}
```

### 2. Retry Logic

```typescript
interface RetryOptions {
  maxRetries: number
  delayMs: number
  backoffMultiplier: number
}

async *sendMessageWithRetry(options: SendMessageOptions): AsyncGenerator<StreamChunk> {
  const retryOptions = { maxRetries: 3, delayMs: 1000, backoffMultiplier: 2 }
  
  for (let attempt = 0; attempt <= retryOptions.maxRetries; attempt++) {
    try {
      yield* this.sendMessage(options)
      return
    } catch (error) {
      if (attempt === retryOptions.maxRetries) {
        throw error
      }
      const delay = retryOptions.delayMs * Math.pow(retryOptions.backoffMultiplier, attempt)
      await this.sleep(delay)
      this.logger.warn(`Retry attempt ${attempt + 1} after ${delay}ms`)
    }
  }
}
```

### 3. Error Handling

| Error Type | Response | HTTP Status |
|------------|----------|-------------|
| Validation Error | `{ error: 'Validation failed', details: {...} }` | 400 |
| Rate Limit | `{ error: 'Rate limited', retryAfter: 60 }` | 429 |
| AI Unavailable | `{ error: 'AI service unavailable' }` | 503 |
| Timeout | `{ error: 'Request timeout' }` | 504 |
| Auth Error | `{ error: 'Invalid API key' }` | 500 |

### 4. Structured Logging

```typescript
// Log đầy đủ để debug
this.logger.log({
  event: 'ai_request',
  conversationId: options.conversationId,
  provider: providerName,
  messageLength: options.message.length,
  historyLength: options.history?.length || 0,
  temperature: options.temperature,
  timestamp: new Date().toISOString(),
})

this.logger.error({
  event: 'ai_error',
  error: error.message,
  stack: error.stack,
  provider: providerName,
}, error.stack)
```

## Implementation Steps

1. **Tạo validation helper** - validate options trước khi xử lý
2. **Tạo retry decorator/function** - retry với exponential backoff
3. **Update error handling** - map errors ra appropriate HTTP responses
4. **Thêm structured logging** - log đầy đủ, dễ debug
5. **Thêm timeout handling** - xử lý request quá lâu

## Acceptance Criteria

- [ ] Validation options trước khi xử lý
- [ ] Retry logic hoạt động với exponential backoff
- [ ] Error messages rõ ràng, user-friendly
- [ ] Logs đầy đủ để debug
- [ ] Timeout handling cho long-running requests
