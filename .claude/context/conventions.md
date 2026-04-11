# Coding Conventions

## Naming
- Files:      kebab-case       (chat-message.service.ts)
- Classes:    PascalCase       (ChatMessageService)
- Variables:  camelCase        (chatHistory)
- Constants:  UPPER_SNAKE      (MAX_TOKEN_LIMIT)

### Database (Prisma)
- Tables:     snake_case       (user, conversation, message)
- Columns:    snake_case       (display_name, firebase_uid, created_at, updated_at)

---

## Documentation

### Link files when referencing
Khi viết docs, nếu có reference đến file khác, PHẢI link bằng relative path:
```markdown
Xem chi tiết tại [UI-DESIGN.md](../design/UI-DESIGN.md)
Xem schema tại [schema.prisma](#database-prisma-schema-sqlite)
```

---

## Cấu trúc Monorepo

```
ai-chatbox/
├── apps/
│   ├── backend/                 ← NestJS
│   └── frontend/                ← ReactJS
├── packages/
│   └── shared/                  ← Types dùng chung (optional)
├── .agent/
├── .opencode/
├── AGENTS.md
├── docs/
├── .env.example
├── package.json                 ← root workspace
└── pnpm-workspace.yaml
```

---

## Backend — NestJS + Prisma

```
apps/backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.guard.ts
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts
│   │   │   └── dto/
│   │   │       ├── login.dto.ts
│   │   │       └── register.dto.ts
│   │   │
│   │   ├── chat/
│   │   │   ├── chat.module.ts
│   │   │   ├── chat.controller.ts
│   │   │   ├── chat.service.ts
│   │   │   ├── chat.gateway.ts          ← WebSocket (nếu dùng)
│   │   │   └── dto/
│   │   │       ├── send-message.dto.ts
│   │   │       └── create-conversation.dto.ts
│   │   │
│   │   ├── conversation/
│   │   │   ├── conversation.module.ts
│   │   │   ├── conversation.controller.ts
│   │   │   ├── conversation.service.ts
│   │   │   └── dto/
│   │   │
│   │   └── ai/
│   │       ├── ai.module.ts
│   │       ├── ai.service.ts
│   │       └── providers/
│   │           ├── ai-provider.interface.ts
│   │           ├── gemini.provider.ts
│   │           └── openai.provider.ts
│   │
│   ├── common/
│   │   ├── decorators/
│   │   │   └── current-user.decorator.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   ├── interceptors/
│   │   │   └── response.interceptor.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   └── types/
│   │       └── express.d.ts
│   │
│   └── config/
│       ├── app.config.ts
│       ├── database.config.ts
│       └── jwt.config.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── test/
│   ├── auth.e2e-spec.ts
│   ├── chat.e2e-spec.ts
│   └── jest-e2e.json
│
├── .env
├── .env.example
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
├── jest.config.ts
└── package.json
```

### Nguyên tắc Backend
- Mỗi module = 1 thư mục, đủ bộ: module / controller / service / dto
- AI provider dùng interface → dễ swap Gemini ↔ OpenAI (SOLID OCP)
- common/ chứa những gì dùng ≥ 2 module
- config/ chỉ chứa cấu hình, không chứa logic

---

## Frontend — React + Redux Thunk + MUI + Tailwind CSS

> ⚠️ **QUAN TRỌNG: KẾT HỢP MUI + TAILWIND**
> 
> **MUI là xương sống** (theme, cấu trúc, component base, màu sắc chính)
> **Tailwind là da thịt** (fine-grained styling, hiệu ứng, positioning, animation)
> 
> ✅ **KHÔNG chuyển đổi hoàn toàn sang Tailwind** - giữ MUI làm nền tảng UI
> ✅ **KHÔNG loại bỏ MUI** khỏi project
> ✅ **Dùng Tailwind để bổ sung** cho MUI, không thay thế
> 
> 📖 Xem chi tiết: [ui-framework.md](./ui-framework.md)

```
apps/frontend/
├── src/
│   ├── main.tsx
│   ├── App.tsx                          ← Root + routes
│   │
│   ├── pages/
│   │   ├── ChatPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── components/
│   │   ├── common/                      ← Tái sử dụng toàn app
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   └── Button.types.ts
│   │   │   ├── Input/
│   │   │   │   ├── Input.tsx
│   │   │   │   └── Input.types.ts
│   │   │   ├── Spinner/
│   │   │   │   └── Spinner.tsx
│   │   │   └── Modal/
│   │   │       ├── Modal.tsx
│   │   │       └── Modal.types.ts
│   │   │
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   │
│   │   └── chat/
│   │       ├── ChatWindow.tsx
│   │       ├── MessageList.tsx
│   │       ├── MessageItem.tsx
│   │       ├── MessageItem.types.ts
│   │       ├── InputBar.tsx
│   │       └── ConversationList.tsx
│   │
│   ├── store/
│   │   ├── index.ts                     ← Store setup + RootState + AppDispatch
│   │   ├── hooks.ts                     ← useAppDispatch, useAppSelector
│   │   └── slices/
│   │       ├── authSlice.ts
│   │       ├── chatSlice.ts
│   │       └── conversationSlice.ts
│   │
│   ├── middleware/                       ← API calls (thay thế services/)
│   │   ├── conversation.service.ts
│   │   └── message.service.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useChat.ts
│   │   └── useStreamingMessage.ts       ← SSE streaming hook
│   │
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── chat.types.ts
│   │   └── api.types.ts                 ← ApiResponse<T> wrapper
│   │
│   ├── utils/
│   │   ├── format.ts
│   │   └── storage.ts
│   │
│   └── styles/
│       └── index.css                    ← @tailwind directives
│
├── public/
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.app.json
└── package.json
```

### Nguyên tắc Frontend
- Không dùng class-based components (constraints.md)
- Component phức tạp → folder riêng kèm `.types.ts`
- `store/hooks.ts` export typed hooks, không gọi raw `useDispatch` ở nơi khác
- `middleware/` chỉ gọi API, không chứa business logic
- `hooks/` chứa logic tái sử dụng, không chứa JSX
- `pages/` chỉ compose components + connect store, không viết UI trực tiếp

---

## Frontend Implementation Order (Layer by Layer)

Thứ tự implement từ **bottom (API) → top (UI)**:

```
Phase 1: API Layer      (Bottom)
    ↓
Phase 2: Redux Store
    ↓
Phase 3: Hooks
    ↓
Phase 4-6: Components   (Top)
    ↓
Phase 7: Integration    (Last)
```

### Phase Details

| Phase | Contents | Files |
|-------|----------|-------|
| **Phase 1** | API + Services | `api/axios.ts`, `middleware/*.service.ts` |
| **Phase 2** | Redux Store | `store/index.ts`, `store/slices/*.ts` |
| **Phase 3** | Hooks | `hooks/use*.ts` |
| **Phase 4-6** | Components | `components/`, `layouts/`, `pages/` |
| **Phase 7** | Integration | Connect all, error handling, polish |

### Ví dụ với FT-001 (Chat)

1. **Phase 1**: Axios + conversation.service.ts + message.service.ts
2. **Phase 2**: chatSlice + conversationSlice (với thunks)
3. **Phase 3**: useChat + useConversation + useStream
4. **Phase 4**: MainLayout + Sidebar + Header
5. **Phase 5**: ChatWindow + MessageList + InputBar
6. **Phase 6**: ConversationList + ConversationItem
7. **Phase 7**: Connect InputBar → API → Redux → MessageList

---

## Shared Package (optional)

```
packages/shared/
├── src/
│   ├── types/
│   │   ├── chat.types.ts
│   │   ├── auth.types.ts
│   │   └── api.types.ts
│   └── index.ts
├── tsconfig.json
└── package.json
```

> Chỉ dùng khi cần sync type giữa backend và frontend.
> Nếu project còn nhỏ, có thể bỏ qua và copy type thủ công.

---

## Workspace Config

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

```json
// package.json (root) — scripts tiện dụng
{
  "scripts": {
    "dev:be":  "pnpm --filter backend dev",
    "dev:fe":  "pnpm --filter frontend dev",
    "dev":     "concurrently \"pnpm dev:be\" \"pnpm dev:fe\"",
    "test:be": "pnpm --filter backend test",
    "test:fe": "pnpm --filter frontend test",
    "lint":    "pnpm -r lint",
    "build":   "pnpm -r build"
  }
}
```

---

## API Convention
- REST:     /api/v1/[resource]
- Response: `{ data, message, statusCode }`

---

## Frontend API Pattern (Redux Thunk + Axios)

### Cấu trúc

```
src/
├── api/
│   ├── axios.ts              # Axios instance + interceptors
│   └── endpoints.ts          # API endpoint constants
├── middleware/               # API calls (thay thế services/)
│   ├── conversation.service.ts
│   └── message.service.ts
├── store/
│   ├── index.ts              # Store configuration + thunk middleware
│   ├── hooks.ts              # useAppDispatch, useAppSelector
│   └── slices/
│       ├── authSlice.ts      # Auth state + thunks
│       ├── chatSlice.ts      # Chat state + thunks
│       └── conversationSlice.ts
└── types/
    └── api.types.ts          # TypeScript interfaces
```

### Axios Setup

```typescript
// src/api/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 30000,
});

// Request interceptor - Add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('firebase_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('firebase_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Redux Thunk Pattern

```typescript
// src/store/slices/chatSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { messageService } from '../../middleware/message.service';

interface ChatState {
  messages: Message[];
  loading: boolean;
  streaming: boolean;
  error: string | null;
}

// Async Thunk
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      return await chatService.getMessages(conversationId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: { messages: [], loading: false, streaming: false, error: null } as ChatState,
  reducers: {
    addMessage: (state, action) => { state.messages.push(action.payload); },
    clearChat: (state) => { state.messages = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => { state.loading = true; })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
```

### Streaming with Fetch API

```typescript
// src/middleware/message.service.ts
export const messageService = {
  async sendMessageWithStream(
    message: string,
    conversationId: string | undefined,
    onChunk: (chunk: string, conversationId: string) => void,
    onDone: (conversationId: string) => void,
  ): Promise<string> {
    const response = await fetch(`${API_URL}/v1/conversation/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversation_id: conversationId }),
    })

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    let conversationIdResult = conversationId || ''
    let fullResponse = ''

    if (!reader) {
      throw new Error('No response body')
    }

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))

            if (data.conversationId) {
              conversationIdResult = data.conversationId
            }

            if (data.chunk) {
              fullResponse += data.chunk
              onChunk(data.chunk, conversationIdResult)
            }

            if (data.error) {
              throw new Error(data.error)
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    }

    onDone(conversationIdResult)
    return conversationIdResult
  },
};
```

### Error Handling Flow

```
API Error
    ↓
Axios Interceptor
    ↓
401 → Clear token → Redirect /login
Other → Return error → Show MUI Snackbar
```

---

## Prisma Convention
- Schema:    `prisma/schema.prisma`
- Migration: `npx prisma migrate dev`
- Seed:      `prisma/seed.ts`

---

## SOLID Principles
> Không cần cứng nhắc, nhưng nên tuân thủ khi có thể.

### S — Single Responsibility
Mỗi class/service chỉ làm 1 việc.
```typescript
// ✅ Tách biệt rõ ràng
class ChatService        // chỉ xử lý logic chat
class AiProviderService  // chỉ giao tiếp với AI API
class MessageRepository  // chỉ thao tác DB

// ❌ Tránh nhồi nhét
class ChatService {
  sendMessage()   { ... }
  connectToAI()   { ... }   // không thuộc về đây
  saveToDatabase(){ ... }   // không thuộc về đây
}
```

### O — Open/Closed
Mở rộng qua interface/abstract, không sửa code cũ.
```typescript
// ✅ Thêm provider mới không cần sửa ChatService
abstract class AiProvider {
  abstract sendMessage(prompt: string): Promise<string>
}
class GeminiProvider extends AiProvider { ... }
class OpenAiProvider extends AiProvider { ... }
```

### L — Liskov Substitution
Subclass có thể thay thế parent mà không phá vỡ behavior.

### I — Interface Segregation
Tách interface nhỏ, đúng mục đích.
```typescript
// ✅ Tách nhỏ
interface Readable { read(): string }
interface Writable { write(data: string): void }

// ❌ Tránh interface quá lớn
interface Everything { read(); write(); delete(); archive(); ... }
```

### D — Dependency Inversion
Inject dependency qua constructor.
```typescript
// ✅ NestJS DI pattern
@Injectable()
class ChatService {
  constructor(
    private readonly aiProvider: AiProvider,
    private readonly prisma: PrismaService,
  ) {}
}
```

---

## Comment & Docs Function

### Khi NÊN comment:
- Logic phức tạp hoặc không hiển nhiên
- Business rule quan trọng
- Workaround tạm thời (kèm TODO)
- Tham số không rõ nghĩa

### Khi KHÔNG cần comment:
- Code đã tự giải thích qua naming rõ ràng
- Getter/setter đơn giản
- CRUD cơ bản

### JSDoc cho function quan trọng (backend):
```typescript
/**
 * Gửi message đến AI provider và stream response về client.
 *
 * @param dto      - Dữ liệu message từ user (content, conversationId)
 * @param userId   - ID của user đang gửi (từ JWT token)
 * @returns        AsyncIterable stream của response chunks
 * @throws         AiProviderException nếu AI API không phản hồi
 */
async sendMessage(dto: SendMessageDto, userId: string): Promise<AsyncIterable<string>> {
  ...
}
```

### Inline comment cho logic phức tạp:
```typescript
// Giới hạn context window: chỉ lấy 20 message gần nhất
// để tránh vượt quá token limit của AI provider
const recentMessages = messages.slice(-20)

// TODO: Thay bằng Redis pub/sub khi scale multi-instance
this.eventEmitter.emit('message.created', message)
```

---

## Logging

### Dùng NestJS Logger — KHÔNG dùng console.log trong production code:
```typescript
import { Logger } from '@nestjs/common'

@Injectable()
class ChatService {
  private readonly logger = new Logger(ChatService.name)
}
```

### Vị trí BẮT BUỘC phải log:

| Vị trí | Level | Ví dụ |
|--------|-------|-------|
| Bắt đầu xử lý request quan trọng | `log` | `this.logger.log(\`Sending message userId=${userId}\`)` |
| Gọi external service (AI, API) | `log` | `this.logger.log(\`Calling Gemini API tokens=${tokens}\`)` |
| Kết quả từ external service | `log` | `this.logger.log(\`AI response received in ${ms}ms\`)` |
| Lỗi có thể recover | `warn` | `this.logger.warn(\`Retry attempt ${n}\`)` |
| Lỗi nghiêm trọng | `error` | `this.logger.error(\`AI failed\`, error.stack)` |
| Debug info phức tạp | `debug` | `this.logger.debug(\`Context: ${JSON.stringify(ctx)}\`)` |

### Không log thông tin nhạy cảm:
```typescript
// ❌ KHÔNG BAO GIỜ
this.logger.log(`Password: ${password}`)
this.logger.log(`API Key: ${apiKey}`)
this.logger.log(`JWT: ${token}`)

// ✅ An toàn
this.logger.log(`Processing userId=${userId}`)
```

### Pattern log cho streaming:
```typescript
this.logger.log(`[Stream:${streamId}] Started`)
this.logger.log(`[Stream:${streamId}] Completed chunks=${count}`)
this.logger.error(`[Stream:${streamId}] Failed at chunk=${n}`, error.stack)
```
