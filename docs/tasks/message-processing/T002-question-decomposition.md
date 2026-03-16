# T002: Question Decomposition

## Mục tiêu

Tách câu hỏi phức tạp thành các sub-questions để AI trả lời chính xác hơn.

## Khi nào cần decompose

| Signal | Ví dụ |
|--------|-------|
| Multiple "and" | "Explain X and show examples" |
| Multiple "also" | "What is A? Also tell me about B" |
| Conjunction | "Compare A and B" |
| Long question (>100 chars) | "Explain the differences between..." |
| Multiple question marks | "What is X? How does Y work?" |

## Algorithm

### Step 1: Rule-based detection

```typescript
function shouldDecompose(message: string): boolean {
  const signals = [
    /\b(and|also|plus)\b/i.test(message),
    message.length > 100,
    (message.match(/\?/g) || []).length > 1,
    /compare/i.test(message),
  ]
  return signals.filter(Boolean).length >= 1
}
```

### Step 2: Decomposition logic

```typescript
interface SubQuestion {
  question: string
  priority: number
  dependsOn?: number  // Index của sub-question phụ thuộc
}

function decompose(message: string): SubQuestion[] {
  // Case 1: "Explain X and Y"
  if (/explain\s+(.+?)\s+and\s+(.+)/i.test(message)) {
    const [, part1, part2] = message.match(/explain\s+(.+?)\s+and\s+(.+)/i)!
    return [
      { question: `What is ${part1}?`, priority: 1 },
      { question: `What is ${part2}?`, priority: 2 },
      { question: `${part1} vs ${part2} comparison`, priority: 3 },
    ]
  }

  // Case 2: "What is X? How to Y?"
  if (message.includes('?') && (message.match(/\?/g) || []).length > 1) {
    const questions = message.split('?').filter(q => q.trim())
    return questions.map((q, i) => ({ question: q.trim() + '?', priority: i + 1 }))
  }

  // Case 3: Use LLM for complex cases
  return [{ question: message, priority: 1 }]
}
```

### Step 3: LLM-assisted decomposition (nâng cao)

```typescript
async function decomposeWithLLM(message: string): Promise<SubQuestion[]> {
  const prompt = `Decompose this question into smaller sub-questions that need to be answered to fully answer the original question.

Original: "${message}"

Respond with JSON array:
[
  { "question": "sub-question 1", "priority": 1 },
  { "question": "sub-question 2", "priority": 2 }
]`

  const response = await llm.generate(prompt)
  return JSON.parse(response)
}
```

## Output Processing

```typescript
// Sau khi decompose, gộp vào context
function buildDecomposedPrompt(subQuestions: SubQuestion[]): string {
  const ordered = subQuestions.sort((a, b) => a.priority - b.priority)
  
  return ordered
    .map((q, i) => `${i + 1}. ${q.question}`)
    .join('\n')
}
```

## Example Outputs

| Input | Decomposed |
|-------|------------|
| "Explain React hooks and show examples" | 1. What are React hooks? 2. How to use useState? 3. How to use useEffect? 4. Code examples |
| "Compare Python and JavaScript" | 1. What is Python? 2. What is JavaScript? 3. Key differences? 4. Use cases comparison |
| "What is async/await? How does it work?" | 1. What is async/await? 2. How does async/await work? |

## Acceptance Criteria

- [ ] Detect khi nào cần decompose
- [ ] Tách đúng ≥ 80% cases đơn giản
- [ ] Preserve order ưu tiên
- [ ] Handle dependencies (question B phụ thuộc A)
- [ ] Fallback graceful khi không decompose được
- [ ] Performance < 200ms
