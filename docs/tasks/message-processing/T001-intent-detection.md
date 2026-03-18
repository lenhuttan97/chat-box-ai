# T001: Intent Detection

## Mục tiêu

Phân loại message của user thành các intent để xử lý phù hợp.

## Intents

| Intent | Mô tả | Ví dụ |
|--------|-------|-------|
| `question` | User hỏi thông tin | "What is React?", "How to use..." |
| `clarification` | User cần giải thích rõ hơn | "What do you mean?", "Explain more" |
| `task` | User yêu cầu làm task cụ thể | "Write code", "Summarize", "Create..." |
| `conversation` | Chat thông thường | "Hello", "Thanks", "Nice!" |
| `file_query` | Hỏi về file đã upload | "What's in this file?" |

## Implementation

### Option 1: Rule-based (nhanh, đơn giản)

```typescript
const INTENT_PATTERNS = {
  question: /^(what is|how to|explain|describe|define|tell me)/i,
  clarification: /^(what do you mean|i don't understand|can you clarify|repeat)/i,
  task: /^(write|create|make|build|summarize|analyze|generate|convert)/i,
  conversation: /^(hi|hello|hey|thanks|ok|okay|bye)/i,
  file_query: /^(what does|analyze|show me the|from this file)/i,
}

function detectIntent(message: string): IntentResult {
  for (const [intent, pattern] of Object.entries(INTENT_PATTERNS)) {
    if (pattern.test(message)) {
      return { intent, confidence: 0.9, requiresDecomposition: intent === 'question' }
    }
  }
  return { intent: 'conversation', confidence: 0.5 }
}
```

### Option 2: LLM-based (chính xác hơn)

```typescript
async function detectIntentWithLLM(message: string): Promise<IntentResult> {
  const prompt = `Classify this message into one intent: question, clarification, task, conversation, file_query
  
Message: "${message}"

Respond with JSON: { intent: "...", confidence: 0.0-1.0, entities: {...}}`

  const response = await llm.generate(prompt)
  return JSON.parse(response)
}
```

### Recommendation

**Bắt đầu với rule-based** (Option 1), sau đó nâng cấp lên LLM-based khi có data.

## Output

```typescript
interface IntentResult {
  intent: 'question' | 'clarification' | 'task' | 'conversation' | 'file_query'
  confidence: number  // 0.0 - 1.0
  entities?: Record<string, string>  // Trích xuất entities nếu có
  requiresDecomposition: boolean
}
```

## Acceptance Criteria

- [x] Detect ≥ 5 intents cơ bản
- [x] Confidence score cho mỗi prediction
- [x] Default fallback cho unknown messages
- [x] Xử lý trong < 50ms
- [x] Unit tests cho mỗi intent pattern
