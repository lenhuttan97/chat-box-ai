# T004: Message Router

## Mục tiêu

Route message đến handler phù hợp dựa trên intent detection.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          MESSAGE ROUTER                                    │
└─────────────────────────────────────────────────────────────────────────────┘

User Message
     │
     ▼
┌─────────────────┐
│  Intent Result  │ ← T001: Intent Detection
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            ROUTING LOGIC                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   intent = 'question'        → GeneralAIHandler                          │
│   intent = 'task'            → TaskHandler                               │
│   intent = 'file_query'      → FileAnalyzerHandler                       │
│   intent = 'clarification'   → ClarificationHandler                      │
│   intent = 'conversation'    → GeneralAIHandler                          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           HANDLERS                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ GeneralAIHandler │  │ TaskHandler      │  │ FileAnalyzerHandler  │  │
│  │                  │  │                  │  │                      │  │
│  │ - Gemini/Ollama │  │ - Write code     │  │ - Read file content │  │
│  │ - Standard prompt│ │ - Summarize      │  │ - Analyze structure │  │
│  │ - Full context   │  │ - Generate       │  │ - Extract insights  │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────────┘  │
│                                                                          │
│  ┌──────────────────┐  ┌──────────────────┐                             │
│  │Clarification    │  │ WebSearchHandler  │                             │
│  │Handler          │  │                   │                             │
│  │                  │  │ - Search web     │                             │
│  │ - Ask follow-up │  │ - Get snippets   │                             │
│  │ - Request more  │  │ - Summarize      │                             │
│  │   info          │  │                   │                             │
│  └──────────────────┘  └──────────────────┘                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Handler Interface

```typescript
interface MessageHandler {
  handle(request: HandlerRequest): Promise<HandlerResponse>
}

interface HandlerRequest {
  message: string
  intent: IntentResult
  contexts: ContextItem[]
  conversationId: string
  userId: string
}

interface HandlerResponse {
  message: string
  shouldSave: boolean
  metadata?: Record<string, any>
}
```

## Implementations

### 1. GeneralAIHandler

```typescript
@Injectable()
class GeneralAIHandler implements MessageHandler {
  async handle(request: HandlerRequest): Promise<HandlerResponse> {
    const prompt = this.buildPrompt(request)
    const stream = await this.aiService.sendMessage({
      message: prompt,
      conversationId: request.conversationId,
    })

    let fullResponse = ''
    for await (const chunk of stream) {
      fullResponse += chunk.chunk
    }

    return { message: fullResponse, shouldSave: true }
  }

  private buildPrompt(request: HandlerRequest): string {
    // Use contexts from T003
    const contextSection = request.contexts
      .map(c => `[${c.source}]: ${c.content}`)
      .join('\n')
    
    return contextSection ? `${contextSection}\n\nQuestion: ${request.message}` : request.message
  }
}
```

### 2. TaskHandler

```typescript
@Injectable()
class TaskHandler implements MessageHandler {
  private taskPrompts = {
    write_code: 'Write clean, working code for: ',
    summarize: 'Summarize the following concisely: ',
    create: 'Create/Draft: ',
    analyze: 'Analyze and explain: ',
  }

  async handle(request: HandlerRequest): Promise<HandlerResponse> {
    const taskType = this.detectTaskType(request.message)
    const prompt = this.taskPrompts[taskType] + request.message

    const response = await this.aiService.sendMessage({ message: prompt, ... })
    return { message: response, shouldSave: true }
  }
}
```

### 3. FileAnalyzerHandler (FT-007 dependency)

```typescript
@Injectable()
class FileAnalyzerHandler implements MessageHandler {
  async handle(request: HandlerRequest): Promise<HandlerResponse> {
    // 1. Extract file references from message
    const files = this.extractFileReferences(request.message)

    // 2. Load file contents
    const fileContents = await this.fileService.getFiles(files)

    // 3. Build analysis prompt
    const prompt = `Analyze these files:\n${fileContents}\n\nQuestion: ${request.message}`

    // 4. Send to AI
    const response = await this.aiService.sendMessage({ message: prompt })
    return { message: response, shouldSave: true, metadata: { analyzedFiles: files } }
  }
}
```

### 4. ClarificationHandler

```typescript
@Injectable()
class ClarificationHandler implements MessageHandler {
  async handle(request: HandlerRequest): Promise<HandlerResponse> {
    // Generate clarifying questions
    const clarificationPrompt = `The user's message is unclear. Ask a specific question to clarify: "${request.message}"`
    
    const response = await this.aiService.sendMessage({ message: clarificationPrompt })
    
    return { 
      message: response, 
      shouldSave: false,  // Don't save clarification to history
    }
  }
}
```

## Router Implementation

```typescript
@Injectable()
class MessageRouter {
  constructor(
    private intentDetector: IntentDetector,
    private contextAugmenter: ContextAugmenter,
    private generalAIHandler: GeneralAIHandler,
    private taskHandler: TaskHandler,
    private fileHandler: FileAnalyzerHandler,
    private clarificationHandler: ClarificationHandler,
  ) {}

  async route(message: string, conversationId: string): Promise<HandlerResponse> {
    // 1. Detect intent
    const intent = await this.intentDetector.detect(message)

    // 2. Collect contexts
    const contexts = await this.contextAugmenter.collectContexts(message, conversationId)

    const request: HandlerRequest = {
      message,
      intent,
      contexts,
      conversationId,
      userId: 'current-user',
    }

    // 3. Route to handler
    switch (intent.intent) {
      case 'question':
      case 'conversation':
        return this.generalAIHandler.handle(request)
      
      case 'task':
        return this.taskHandler.handle(request)
      
      case 'file_query':
        return this.fileHandler.handle(request)
      
      case 'clarification':
        return this.clarificationHandler.handle(request)
      
      default:
        return this.generalAIHandler.handle(request)
    }
  }
}
```

## Error Handling

```typescript
async route(message: string, conversationId: string): Promise<HandlerResponse> {
  try {
    return await this.doRoute(message, conversationId)
  } catch (error) {
    // Fallback to general AI handler
    this.logger.error(`Routing failed: ${error.message}`)
    return {
      message: "I'm having trouble processing that. Let me try again.",
      shouldSave: false,
    }
  }
}
```

## Acceptance Criteria

- [ ] Route đúng handler dựa trên intent
- [ ] Fallback to GeneralAIHandler khi không match
- [ ] Handler interface nhất quán
- [ ] Error handling graceful
- [ ] Context được pass đến handler
- [ ] Performance < 100ms cho routing (không tính AI call)
