# Backend Data Flow & Orchestration

Module: Backend (NestJS) | Last updated: 2026-08-18
Refs: chat-gemini-streaming, auth, device-tracking, message-processing, ai-provider, file-preprocessing

---

## 1. Overview

Tài liệu này mô tả cách backend **điều phối luồng data và logic** từ lúc nhận request đến khi trả response. Backend là NestJS + Prisma (SQLite dev), toàn bộ endpoint có global prefix `/api/v1`.

```
Request HTTP
   │
   ▼
main.ts ──► Global pipeline ──► Controller ──► Service (business logic)
               │                                   │
               │                                   ▼
               │                        Repository ──► Prisma ──► DB
               ▼                                   │
            Response ◄─────────────────────────────┘
```

---

## 2. Global Request Pipeline

Cấu hình tại `apps/backend/src/main.ts`:

```
Client
  │
  ▼
[NestFactory.create(AppModule)]
  │
  ├── setGlobalPrefix('/api/v1')      → mọi route thành /api/v1/...
  ├── app.use(cookieParser())         → đọc httpOnly cookie (token, refresh_token)
  ├── useGlobalPipes(ValidationPipe)  → whitelist: true, transform: true
  │                                     (strip field không có trong DTO, transform type)
  ├── enableCors(FRONTEND_URL, credentials: true)
  │
  ▼
Controller / Guard / Service
```

**Điểm chú ý:**

- Không có exception filter toàn cục → `throw new Error()` mặc định ra HTTP 500.
- `ValidationPipe` với `whitelist: true` nhưng nhiều controller dùng inline body type (không phải DTO class) → pipe gần như không có tác dụng ở các endpoint đó.

---

## 3. Module Dependency Graph

Định nghĩa tại `app.module.ts` + từng `*.module.ts`:

```
                          ┌─────────────────────┐
                          │      AppModule      │
                          └─────────────────────┘
        ConfigModule(global) / PrismaModule(global)
                                   │
   ┌───────────┬───────────┬───────┴───────┬─────────────┬─────────────┐
   ▼           ▼           ▼               ▼             ▼             ▼
UsersModule  AuthModule  DeviceModule  Conversations  MessageProc   FilesModule
   │           │              │          Module         Module
   │           │              │           │               │
   │           │              └──► UsersService           │
   │           │                   (virtual user)         │
   │           │                                          │
   │           └──► AuthService (JWT + Firebase)          │
   │                                                      │
   └──► UsersService                                      │
                                                            ▼
                    AiModule ◄──────────────────────────────────┘
                     │           ConversationsController inject:
                     │           ├── ConversationsService
                     │           ├── AiService
                     │           ├── DeviceService
                     │           ├── MessageProcessorService
                     │           └── FilesService
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
  GeminiProvider             OllamaProvider
        └──────────┬─────────────┘
                   ▼
            AiProviderFactory (map: gemini, ollama)
```

**Quan hệ DI chính:**
| Module | Inject | Dùng để |
|--------|--------|---------|
| ConversationsController | ConversationsService, AiService, DeviceService, MessageProcessorService, FilesService | sendMessage orchestration |
| ConversationsService | ConversationsRepository, DeviceService | CRUD conversation/message + device validate |
| DeviceService | DeviceRepository, UsersService | findOrCreate device + tạo virtual user |
| MessageProcessorService | IntentDetectorService, MessageRouterService, QuestionDecomposerService, ContextAugmenterService | pipeline xử lý message |
| AiService | AiProviderFactory | stream + analyze context |
| AuthService | PrismaService, JwtService, ConfigService | auth |

---

## 4. Data Model

Schema tại `apps/backend/prisma/schema.prisma`:

```
┌──────────┐     1        N ┌────────────────┐
│  User    │─────────────── │  Conversation  │
│──────────│                │────────────────│
│ id       │                │ id             │
│ email*   │                │ name           │
│ password │                │ userId?        │
│ display  │                │ deviceId?      │
│ firebase │                │ provider       │ (default "gemini")
│ photoUrl │                │ model?         │
│ provider │                │ systemPrompt?  │
│ theme    │                │ autoPrompt?    │  ← kết quả auto-analyze
│          │                │ contextToken   │  (default 4096)
│          │                │ temperature    │  (default 0.7)
│          │                │ maxTokens      │  (default 2048)
│          │                │ messageCount   │
│          │                │ createdAt/At   │
└──────────┘                └────────────────┘
     │                             │        │
     │ 1                           │ 1      │ 1
     │                             ▼        ▼
     │                    ┌────────────────┐
     │                    │     Device     │
     │                    │────────────────│
     │                    │ id             │
     └───────────────────►│ deviceId (uniq)│  ← browser uuid
                          │ browser/os/... │
                          │ lastSeen       │
                          │ isOnline       │
                          │ userId?        │
                          └────────────────┘

┌────────────────┐    N         1 ┌──────────────┐
│    Message     │───────────────►│ Conversation │
│────────────────│  conversationId│              │
│ id             │               └──────────────┘
│ role (user/    │
│      assistant)│
│ content        │
│ createdAt      │
└────────────────┘

┌────────────────┐
│      File      │   ← KHÔNG có relation với User/Conversation/Message
│────────────────│      (không phân quyền sở hữu file)
│ id             │
│ filename       │
│ originalName   │
│ mimeType       │
│ size           │
│ status         │   (processing/completed/failed)
│ extractedText? │
│ error?         │
└────────────────┘
```

---

## 5. Auth Flow

### 5.1 Register / Login / Google

```
POST /api/v1/auth/register  { email, password, displayName? }
POST /api/v1/auth/login     { email, password }
POST /api/v1/auth/google    { idToken }
POST /api/v1/auth/refresh-token { refreshToken }
      │
      ▼
AuthController
      │
      ▼
AuthService
      ├── register:  check email trùng → bcrypt.hash(password, 10) → create user (provider='email')
      ├── validateUser: prisma.user.findUnique(email) → bcrypt.compare
      ├── firebaseLogin: firebaseAdmin.verifyIdToken(idToken)
      │     → find user by firebaseUid → create nếu chưa có (provider='google')
      ├── refreshToken: jwtService.verify(type='refresh') → load user
      │
      ▼
generateJwtToken(user)      → { sub, email }, expires 60m
generateRefreshToken(user)  → { sub, email, type:'refresh' }, expires 7d
      │
      ▼
TokenCookieMiddleware.setTokenCookie(res, token, refreshToken)
   - cookie 'token'          httpOnly, sameSite=lax, 60m
   - cookie 'refresh_token'  httpOnly, sameSite=lax, 7d
      │
      ▼
res.json({ user, token, refreshToken })
```

### 5.2 JWT Guard (Protected routes)

```
Request + Authorization: Bearer <token>
      │
      ▼
AuthGuard('jwt') → JwtStrategy.validate
      │
      ├── ExtractJwt.fromAuthHeaderAsBearerToken()
      ├── jwtService verify (JWT_SECRET)
      ├── prisma.user.findUnique({ where: { id: payload.sub } })   ← query DB mỗi request
      │
      ▼
return { sub, email }   ← LƯU Ý: không có field 'userId'
```

> ⚠️ **Lưu ý (bug hiện tại):** `DeviceController` khai `req.user.userId` nhưng strategy chỉ trả `{ sub, email }` → `userId = undefined` → Prisma bỏ qua filter undefined → `GET /devices` trả về **device của mọi user**.

> ⚠️ **Lưu ý (thiếu guard):** ConversationsController (toàn bộ), UsersController (`POST/GET/PUT/DELETE /users`, trừ `/profile`, `/me/theme`), FilesController **không có auth guard**.

---

## 6. Device Tracking Flow

Trigger: header `x-device-info: {"deviceId": "...", "browser": "...", ...}` gửi kèm khi tạo conversation / gửi message.

```
POST /conversations | POST /conversation/messages
   │ x-device-info header
   ▼
DeviceService.findOrCreate(deviceInfo)
   │
   ├── DeviceRepository.findByDeviceId(deviceId)
   │
   ├── [TỒN TẠI] → update(browser/os/language/timezone/ip, lastSeen=now, isOnline=true)
   │
   └── [CHƯA CÓ] → create(device, isOnline=true)
                    │
                    ▼
                 UsersService.create({ displayName: "Device <deviceId>", provider: 'device' })
                    │   ← tạo VIRTUAL USER cho anonymous
                    ▼
                 DeviceRepository.linkToUser(device.id, virtualUser.id)
```

Mỗi anonymous user → 1 virtual user + 1 device. Conversation anonymous sẽ gắn `deviceId` thay vì `userId`.

---

## 7. Conversation CRUD Flow

```
POST   /conversations                 → create (device optional)
GET    /conversations                 → list tất cả (phân trang page/size)
GET    /conversations/user/:userId    → list theo user
GET    /conversations/device/:deviceId→ list theo device
GET    /conversations/:id             → chi tiết (+ include messages)
PUT    /conversations/:id             → update settings (provider/model/temp/...)
DELETE /conversations/:id             → xóa (cascade messages)
GET    /conversations/:id/messages    → list messages phân trang

Controller
   ▼
ConversationsService
   ├── createConversation: validate deviceId / findOrCreate device → connect device
   ├── updateConversation: repository.update
   │
   ▼
ConversationsRepository
   ├── findMany with skip/take + orderBy updatedAt desc
   ├── count (totalElement)
   │
   ▼
Prisma ──► DB
```

**Phân trang:** `page` (default 1), `size` (conversation default 10, message default 50). Trả `totalElement` ở response.

---

## 8. Core Orchestration — Send Message (Streaming)

Endpoint chính `POST /api/v1/conversation/messages` (`conversations.controller.ts:132-334`). Đây là nơi BE điều phối gần như toàn bộ logic.

```
POST /conversation/messages  { message, conversation_id?, fileId? }
   │
   ▼
① Validate: message != ''  → nếu rỗng: 400
   │
   ▼
② Set SSE headers (text/event-stream, no-cache, keep-alive)
   │
   ▼
③ Parse x-device-info → DeviceService.findOrCreate → deviceId
   │
   ├── có lỗi parse → warn, tiếp tục không device
   │
   ▼
④ Resolve conversation
   │
   ├── [KHÔNG conversation_id]
   │     → createConversation(name = 50 ký tự đầu message, deviceId)
   │     → SSE: data: {"conversationId": "..."}
   │
   └── [CÓ conversation_id]
         → load conversation → đọc settings (provider/model/systemPrompt/temperature/maxTokens)
   │
   ▼
⑤ Load history: findMessagesByConversationIdNoPaginate → [{role, content}]
   │
   ▼
⑥ Persist user message: createMessage({ conversationId, role:'user', content: message })
   │
   ▼
⑦ AUTO-ANALYZE (nếu userMessageCount == 1 hoặc % 10 == 0)
   │
   ├── AiService.analyzeContext(history + message)
   │     → prompt 20 msg gần nhất → Gemini trả JSON
   │     → parse { context, contextToken, temperature, maxTokens }
   │
   ├── Update conversation NHƯNG chỉ khi user chưa custom:
   │     - autoPrompt = analysis.context
   │     - contextToken  (nếu user giữ default 4096)
   │     - temperature   (nếu user giữ default 0.7)
   │     - maxTokens     (nếu user giữ default 2048)
   │
   └── Merge systemPrompt = systemPrompt + autoPrompt (hoặc chỉ autoPrompt)
   │
   ▼
⑧ FILE ATTACH (nếu fileId)
   │
   └── FilesService.getFileContent(fileId) → append vào message: "message\n\n[File content attached]:\n..."
   │
   ▼
⑨ MESSAGE PROCESSING PIPELINE
   │
   └── MessageProcessorService.process(message, conversationId, history)
         → intent → route → decompose → augment
         → processedMessage (nếu fail → dùng message gốc)
   │
   ▼
⑩ STREAM AI RESPONSE
   │
   └── AiService.sendMessage({ message: processedMessage, provider, model, history, settings })
         │
         ├── AiProviderFactory.getProvider(provider)   (gemini | ollama)
         ├── buildHistory: role 'assistant' → 'model'
         ├── provider.generateStream (Gemini generateContentStream | Ollama /api/chat stream)
         │
         ▼
         for await (chunk)
            ├── SSE: data: {"chunk": "..."}
            └── accumulate fullResponse
         │
         done:
            ├── createMessage({ role:'assistant', content: fullResponse })
            └── updateConversation({ messageCount })
   │
   ▼
res.end()
```

**SSE event flow phía client:**

```
data: {"conversationId": "new-uuid"}     ← chỉ khi tạo mới
data: {"chunk": "Hello"}
data: {"chunk": " there"}
data: {"chunk": "!"}
...                                        ← stream
data: {"error": "AI service unavailable"}  ← khi AI fail
```

> **Fallback:** nếu bất kỳ bước ⑦ ⑧ ⑨ fail → log warn/error và **tiếp tục** bước sau (graceful degradation). Chỉ lỗi ở bước ⑩ (AI stream) → SSE error event.

---

## 9. Message Processing Pipeline

Service `message-processor.service.ts` — được gọi ở bước ⑨ của Send Message.

```
MessageProcessorService.process(message, conversationId, history)
   │
   ├── ① IntentDetectorService.detect(message)
   │      rule-based regex, minConfidence 0.7
   │      Intents: question | clarification | task | conversation | file_query
   │      requiresDecomposition = (intent==='question') && (có "and/also/plus" hoặc dài > 100)
   │
   ├── ② MessageRouterService.route(message, intent)
   │      HANDLER_INTENT_MAP:
   │        question     → general_ai
   │        clarification→ clarifier
   │        task         → task_handler
   │        conversation → general_ai
   │        file_query   → file_analyzer
   │
   ├── ③ QuestionDecomposerService.decompose(message)  (chỉ nếu requiresDecomposition)
   │      tách theo "and/also/plus" hoặc nhiều từ hỏi → subQuestions có priority
   │
   ├── ④ ContextAugmenterService.augment(message, conversationId, history)
   │      lấy 10 msg gần nhất, tính relevanceScore (word overlap), top 5
   │      augmentedPrompt = "[Context (history)]: ...\n\n[User Message]: ..."
   │
   ▼
processedMessage = decomposition.canDecompose
                     ? subQuestions.map(s => s.subQuestion).join(' | ')
                     : augmentation.augmentedPrompt
```

> **Lưu ý:** Handler route (bước ②) hiện **chỉ dùng để log**, không thực sự thay đổi provider/config của AI call. `getHandlerConfig` chưa được dùng.

---

## 10. Auto-Context Analysis Flow

Trigger: bước ⑦ trong Send Message (tin nhắn user thứ 1, 10, 20, ...).

```
userMessageCount == 1 hoặc % 10 == 0
   │
   ▼
AiService.analyzeContext([...history, currentMessage])
   │
   ├── historyText = 20 msg cuối, format "role: content"
   ├── prompt: "Phân tích đoạn chat... chỉ trả về JSON"
   │
   ▼
GeminiProvider.generateContent(prompt)   ← non-stream call
   │
   ├── regex /\{[\s\S]*\}/ → JSON.parse
   │     { context, contextToken, temperature, maxTokens }
   │
   ├── [no JSON / error] → getDefaultContext()
   │     context:'', contextToken:4096, temperature:0.7, maxTokens:2048
   │
   ▼
ConversationsController merge kết quả vào conversation (chỉ khi user chưa custom)
```

---

## 11. File Processing Flow

```
POST /api/v1/files/upload  (multipart/form-data, field: file)
   │
   ▼
FilesService.processFile(buffer, originalName, mimeType)
   │
   ├── Validate: size <= 10MB (MAX_FILE_SIZE hardcode), mimeType trong whitelist
   │     (image/jpeg|png|gif|webp, pdf, docx, xlsx)
   │
   ▼
create File (status = 'processing')
   │
   ▼
extractContent(buffer, mimeType)
   ├── image → ImageExtractor (stub: chỉ 100 ký tự base64)
   ├── pdf   → PdfExtractor  (pdf-parse)
   ├── docx  → DocxExtractor
   ├── xlsx  → ExcelExtractor
   │
   ├── success → update status='completed', extractedText
   └── error   → update status='failed', error message → throw
   │
   ▼
Trả FileResponseDto { id, filename, originalName, mimeType, size, status, ... }

GET /files/:id/content → extractedText (dùng khi sendMessage với fileId)
GET /files/:id/status  → trạng thái xử lý
```

---

## 12. Tóm tắt luồng chính (1 request điển hình)

```
User gửi tin nhắn mới
   │
   ▼
POST /api/v1/conversation/messages { message: "Phân tích file này..." }
   │
   ├── SSE headers
   ├── x-device-info → findOrCreate device
   ├── Tạo conversation mới → SSE conversationId
   ├── Load history
   ├── Lưu user message
   ├── [msg #1] Auto-analyze → update conversation settings
   ├── [fileId] Append file content
   ├── Pipeline: intent(file_query) → route(file_analyzer) → augment(history)
   ├── Gemini stream → SSE chunks → lưu assistant message → update messageCount
   │
   ▼
res.end()  → client render streaming response
```

---

## 13. Known Issues / Notes (thực tế vs docs)

| Vấn đề                                                                 | Vị trí                                                                      | Ảnh hưởng                        |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------- | -------------------------------- |
| `req.user.userId` undefined → leak toàn bộ devices                     | `device.controller.ts:27` vs `jwt.strategy.ts:25`                           | Privacy                          |
| Thiếu auth guard conversations/users/files                             | `conversations.controller.ts`, `users.controller.ts`, `files.controller.ts` | Security                         |
| `GEMINI_MODEL` env bị bỏ qua, hardcode `gemini-3.1-flash-lite-preview` | `gemini.provider.ts:10`                                                     | Cấu hình vô dụng                 |
| `OLLAMA_ENABLED` khai trong env nhưng không đọc                        | `ai-provider-factory.ts:17`                                                 | Ollama luôn register             |
| `updateDevice` là no-op (`browser: name ? undefined : undefined`)      | `device.service.ts:73-77`                                                   | PATCH /devices không có tác dụng |
| Controller dùng inline body type thay vì DTO                           | `auth.controller.ts`, `conversations.controller.ts:134`                     | ValidationPipe không bảo vệ      |
| Không exception filter toàn cục                                        | `main.ts`                                                                   | lỗi domain → 500 thay vì 4xx     |
| `throw new Error(...)` cho trùng email, sai credentials                | `auth.service.ts:99,126`, `auth.controller.ts:28`                           | 500 thay vì 409/401              |
| File không relation với owner                                          | `schema.prisma`                                                             | Không phân quyền file            |

Chi tiết security/quality: xem `docs/bugs/` và báo cáo kiểm tra tổng quan.
