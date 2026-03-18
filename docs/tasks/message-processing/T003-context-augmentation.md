# T003: Context Augmentation

## Mục tiêu

Tự động bổ sung relevant context vào prompt trước khi gửi đến AI.

## Context Sources

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CONTEXT SOURCES                                      │
└─────────────────────────────────────────────────────────────────────────────┘

1. CONVERSATION HISTORY
   - Previous messages trong conversation
   - Relevant chunks dựa trên semantic similarity
   - Max tokens giới hạn

2. UPLOADED FILES (FT-007)
   - File content đã được preprocess
   - Metadata (filename, type)
   - Extracted text

3. USER PROFILE
   - User preferences
   - Past interactions
   - Knowledge base cá nhân

4. WEB SEARCH (optional)
   - Real-time information
   - Current events
   - Technical documentation
```

## Implementation

### Step 1: Collect contexts

```typescript
interface ContextItem {
  source: 'history' | 'file' | 'profile' | 'web'
  content: string
  relevanceScore: number
  metadata?: Record<string, any>
}

class ContextAugmenter {
  async collectContexts(message: string, conversationId: string): Promise<ContextItem[]> {
    const contexts: ContextItem[] = []

    // 1. Conversation history
    const history = await this.getRelevantHistory(message, conversationId)
    contexts.push(...history)

    // 2. Files (FT-007)
    const files = await this.getRelevantFiles(message, conversationId)
    contexts.push(...files)

    // 3. User profile
    const profile = await this.getUserContext(conversationId)
    contexts.push(...profile)

    return contexts
  }

  // Semantic search in history
  async getRelevantHistory(message: string, conversationId: string): Promise<ContextItem[]> {
    const allMessages = await this.conversationRepo.findMessages(conversationId)
    // Simple: last N messages
    // Advanced: embeddings + similarity search
    return allMessages.slice(-10).map(msg => ({
      source: 'history',
      content: `${msg.role}: ${msg.content}`,
      relevanceScore: 0.8,
    }))
  }

  // Get files from conversation
  async getRelevantFiles(message: string, conversationId: string): Promise<ContextItem[]> {
    const files = await this.fileRepo.findByConversation(conversationId)
    return files.map(file => ({
      source: 'file',
      content: file.content,
      relevanceScore: this.calculateRelevance(message, file.content),
      metadata: { filename: file.name, type: file.type },
    }))
  }

  // Get user preferences
  async getUserContext(conversationId: string): Promise<ContextItem[]> {
    const user = await this.userRepo.findByConversation(conversationId)
    return [{
      source: 'profile',
      content: `User: ${user.displayName}, Preferences: ${JSON.stringify(user.preferences)}`,
      relevanceScore: 0.5,
    }]
  }
}
```

### Step 2: Rank and filter

```typescript
function rankContexts(contexts: ContextItem[], maxTokens: number = 4000): ContextItem[] {
  // Sort by relevance
  const sorted = contexts.sort((a, b) => b.relevanceScore - a.relevanceScore)

  // Filter by token limit
  let tokenCount = 0
  const selected: ContextItem[] = []

  for (const ctx of sorted) {
    const tokens = this.estimateTokens(ctx.content)
    if (tokenCount + tokens > maxTokens) break
    selected.push(ctx)
    tokenCount += tokens
  }

  return selected
}
```

### Step 3: Inject into prompt

```typescript
function augmentPrompt(message: string, contexts: ContextItem[]): string {
  if (contexts.length === 0) return message

  const contextSection = contexts
    .map(ctx => `[Context from ${ctx.source}]:\n${ctx.content}`)
    .join('\n\n')

  return `Context:\n${contextSection}\n\n---\n\nUser Question: ${message}`
}
```

## Context Relevance Scoring

```typescript
function calculateRelevance(query: string, content: string): number {
  // Simple: keyword matching
  const queryWords = query.toLowerCase().split(/\s+/)
  const contentWords = content.toLowerCase().split(/\s+/)
  
  const matches = queryWords.filter(w => contentWords.includes(w))
  return matches.length / queryWords.length

  // Advanced: Use embeddings + cosine similarity
}
```

## Token Budget Management

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  TOKEN BUDGET: 4096 (default)                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐  │
│  │ Context (40%)  │  │ History (30%)   │  │ User Message (30%)     │  │
│  │ ~1638 tokens   │  │ ~1228 tokens    │  │ ~1228 tokens           │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────┘  │
│                                                                             │
│  - Files: 40%                                                              │
│  - Recent messages: 30%                                                    │
│  - Current message: 30%                                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Acceptance Criteria

- [x] Collect contexts từ ≥ 3 sources
- [x] Relevance scoring hoạt động
- [x] Token budget không vượt quá
- [x] Fallback graceful khi context không có
- [x] Performance < 300ms
- [x] Handle empty contexts
