# Message Processing Pipeline

## Thông tin

| Trường | Giá trị |
|--------|---------|
| ID | FT-010 |
| Tên | Message Processing Pipeline |
| Trạng thái | pending |
| Priority | high |

## Mô tả

Xử lý message của user trước khi gửi đến AI, bao gồm:
1. **Intent Detection** - Phát hiện ý định user
2. **Question Decomposition** - Tách câu hỏi phức tạp thành sub-questions
3. **Context Augmentation** - Tự động bổ sung context từ tài liệu/files

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MESSAGE PROCESSING PIPELINE                          │
└─────────────────────────────────────────────────────────────────────────────┘

User Message
     │
     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  1. INPUT VALIDATOR                                                        │
│     - Check empty message                                                  │
│     - Sanitize input                                                      │
│     - Check message length                                               │
└─────────────────────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  2. INTENT DETECTION (T001)                                               │
│     ┌─────────────────────────────────────────────────────────────────┐   │
│     │  Detect user intent từ message                                 │   │
│     │                                                                 │   │
│     │  Intents:                                                       │   │
│     │  - question: User hỏi thông tin                                │   │
│     │  - clarification: User cần giải thích rõ hơn                  │   │
│     │  - task: User yêu cầu làm task cụ thể                        │   │
│     │  - conversation: User muốn chat thường                        │   │
│     │  - file_query: User hỏi về file đã upload                    │   │
│     └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  3. QUESTION DECOMPOSITION (T002)                                          │
│     ┌─────────────────────────────────────────────────────────────────┐   │
│     │  Nếu intent = 'question' và phức tạp:                         │   │
│     │                                                                 │   │
│     │  Input: "Explain React hooks and show examples"               │   │
│     │                                                                 │   │
│     │  Output: [                                                      │   │
│     │    { sub_question: "What are React hooks?", priority: 1 },   │   │
│     │    { sub_question: "How to use useState?", priority: 2 },    │   │
│     │    { sub_question: "How to use useEffect?", priority: 3 },   │   │
│     │    { sub_question: "Provide code examples", priority: 4 }    │   │
│     │  ]                                                             │   │
│     └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  4. CONTEXT AUGMENTATION (T003)                                           │
│     ┌─────────────────────────────────────────────────────────────────┐   │
│     │  Tự động thêm relevant context:                               │   │
│     │                                                                 │   │
│     │  - Tìm trong conversation history                            │   │
│     │  - Tìm trong uploaded files (FT-007)                         │   │
│     │  - Tìm trong user profile/settings                            │   │
│     │  - Web search (nếu cần)                                       │   │
│     │                                                                 │   │
│     │  → Inject vào prompt                                           │   │
│     └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  5. ROUTING (T004)                                                         │
│     ┌─────────────────────────────────────────────────────────────────┐   │
│     │  Route đến handler phù hợp:                                   │   │
│     │                                                                 │   │
│     │  - general_ai: Gửi đến Gemini/Ollama                          │   │
│     │  - file_analyzer: Xử lý file query (FT-007)                  │   │
│     │  - web_search: Tìm kiếm web trước khi trả lời                │   │
│     │  - clarifier: Yêu cầu user làm rõ câu hỏi                   │   │
│     └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
     │
     ▼
AI Provider (Gemini/Ollama/OpenAI)
```

---

## Tasks

| ID | Task | Description | Status |
|----|------|-------------|--------|
| T001 | Intent Detection | Phát hiện ý định user | ✅ done |
| T002 | Question Decomposition | Tách câu hỏi phức tạp | ✅ done |
| T003 | Context Augmentation | Bổ sung context tự động | ✅ done |
| T004 | Message Router | Route đến handler phù hợp | ✅ done |

---

## Chi tiết từng Task

### T001: Intent Detection

**Mục tiêu**: Phân loại message thành các intent để xử lý phù hợp

**Intents cần detect**:
| Intent | Pattern Examples | Handler |
|--------|-----------------|---------|
| `question` | "What is...", "How to...", "Explain..." | AI with context |
| `clarification` | "What do you mean?", "I don't understand" | Request clarification |
| `task` | "Write code", "Summarize this", "Create a..." | Task-specific handler |
| `conversation` | "Hello", "Thanks", "OK" | General chat |
| `file_query` | "What does this file contain?", "Analyze..." | File analyzer (FT-007) |

**Implementation**:
```typescript
interface IntentResult {
  intent: 'question' | 'clarification' | 'task' | 'conversation' | 'file_query'
  confidence: number
  entities?: Record<string, string>
  requiresDecomposition: boolean
}

class IntentDetector {
  detect(message: string): IntentResult {
    // Rule-based + potential LLM-based detection
  }
}
```

### T002: Question Decomposition

**Mục tiêu**: Tách câu hỏi phức tạp thành sub-questions

**Examples**:
| Input | Decomposed |
|-------|------------|
| "Explain React hooks and show examples" | ["What are React hooks?", "How to use useState?", "How to use useEffect?", "Code examples"] |
| "Compare Python and JavaScript" | ["What is Python?", "What is JavaScript?", "Key differences", "Use cases comparison"] |

**Logic**:
- Nếu câu hỏi chứa "and", "also", "plus" → có thể tách
- Nếu câu hỏi quá dài (> 100 chars) → có thể tách
- Gọi AI để decompose nếu rule-based không đủ

### T003: Context Augmentation

**Mục tiêu**: Tự động thêm relevant context vào prompt

**Context Sources**:
1. **Conversation History** - Previous messages liên quan
2. **Uploaded Files** - FT-007 File Preprocessing
3. **User Profile** - User preferences, knowledge
4. **Web Search** - Real-time information (optional)

**Implementation**:
```typescript
interface ContextItem {
  source: 'history' | 'file' | 'profile' | 'web'
  content: string
  relevanceScore: number
}

class ContextAugmenter {
  async augment(message: string, conversationId: string): Promise<ContextItem[]> {
    // 1. Get relevant history
    // 2. Get relevant files
    // 3. Get user context
    // 4. Rank and select top-k
  }
}
```

### T004: Message Router

**Mục tiêu**: Route message đến handler phù hợp dựa trên intent

**Handlers**:
| Handler | When to use | AI Model |
|---------|-------------|----------|
| `GeneralAIHandler` | Default, conversation/task | Gemini |
| `FileAnalyzerHandler` | file_query intent | Gemini (with file context) |
| `WebSearchHandler` | Need real-time info | Search → Gemini |
| `ClarificationHandler` | clarification intent | Ask user |
| `TaskHandler` | task intent | Specialized prompts |

---

## Dependencies

- FT-001: Chat Gemini Streaming (base)
- FT-007: File Preprocessing (for context from files)
- FT-009: AI Service Refactor (clean architecture)

---

## ⚠️ Important Notes

### AI Calls & Latency

| Scenario | AI Calls | Latency Increase |
|----------|----------|------------------|
| **Rule-based (recommended)** | 1 | ~100-200ms |
| **Intent LLM + Decomp rule** | 2 | +500-1000ms |
| **Intent LLM + Decomp LLM** | 3 | +1000-2000ms |

**Recommendation**: Dùng rule-based cho T001, T002 để giữ 1 AI call như hiện tại.

### Accuracy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Pipeline KHÔNG ảnh hưởng đến accuracy, có thể CẢI THIỆN:                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. Context Augmentation → AI có thêm context → Trả lời đúng hơn        │
│  2. Question Decomposition  → Xử lý từng phần nhỏ → Chính xác hơn     │
│  3. Specialized Handlers   → Handler phù hợp → Tốt hơn                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Acceptance Criteria

- [ ] Input validation hoạt động
- [ ] Intent detection chính xác ≥ 80%
- [ ] Question decomposition tách đúng câu hỏi phức tạp
- [ ] Context augmentation thêm relevant context
- [ ] Router chọn đúng handler
- [ ] Pipeline xử lý trong < 500ms
- [ ] Fallback graceful nếu một bước fail

---

## Priority Order

```
1. T001: Intent Detection (foundation)
2. T004: Message Router (infrastructure)
3. T002: Question Decomposition (enhancement)
4. T003: Context Augmentation (enhancement, depends on FT-007)
```
