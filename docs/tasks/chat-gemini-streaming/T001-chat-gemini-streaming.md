# T001 — Chat với Gemini Streaming

## Thông tin

| Trường | Giá trị |
|--------|---------|
| ID | T001 |
| Feature | chat-gemini-streaming |
| Feature ID | FT-001 |
| Loại | feature |
| Trạng thái | ✅ completed |
| Priority | high |
| Ngày tiếp nhận | 2026-03-12 |
| Ngày hoàn thành | 2026-03-14 |

---

## Related

| File | Mô tả |
|------|-------|
| [Feature: FT-001](../../features/chat-gemini-streaming/FT-001.md) | Feature specification |
| [API Docs](../../features/chat-gemini-streaming/api.md) | API Documentation |

---

## Mô tả yêu cầu

Xây dựng chat box AI sử dụng Google Gemini API với chế độ streaming để trả lời tin nhắn người dùng theo thời gian thực.

**Requirements từ user:**
- Model: `gemini-3.1-flash-lite-preview`
- API Key: từ `.env` (key: `GEMINI_API_KEY`)
- Streaming protocol: Server-Sent Events (SSE)
- Lưu lịch sử chat vào SQLite (chỉ khi đăng nhập)
- UI theo [UI-DESIGN.md](../../design/UI-DESIGN.md)
- Auth: Firebase (Google Login, Email/Password) - chỉ cần để lưu lịch sử chat

---

## Plan

1. **Setup**: Phase 0 - Project setup (Backend, Frontend, Docker, Testing)
2. **Database**: Tạo schema user, conversation, message
3. **Backend API**: Chat endpoint + SSE streaming + Conversation CRUD
4. **Frontend UI**: Chat interface theo UI-DESIGN
5. **Integration**: Kết nối frontend với API + streaming
6. **Testing**: Test và fix bugs

---

## Phases

- [x] Phase 0: Setup (xem [PHASE-0-SETUP.md](../setup/PHASE-0-SETUP.md))
- [x] Phase 1: Database - Tạo schema user, conversation, message
- [x] Phase 2: Backend API - Chat endpoint + SSE streaming
- [x] Phase 3: Backend API - Conversation CRUD
- [x] Phase 4: Frontend UI - Chat interface
- [x] Phase 5: Frontend - Kết nối API + streaming
- [x] Phase 6: Testing & Fix

---

## Sub-tasks

### Phase 0: Setup
Xem [PHASE-0-SETUP.md](../setup/PHASE-0-SETUP.md) - ✅ completed

### Phase 1: Database
- [x] Tạo Prisma schema với user, conversation, message
- [x] Chạy npx prisma migrate dev
- [x] Tạo PrismaService

### Phase 2: Backend API - Chat
- [x] Tạo AiModule + GeminiProvider
- [x] Implement Gemini streaming với SSE
- [x] Handle errors + logging

### Phase 3: Backend API - Conversation
- [x] POST /api/v1/conversation/messages (streaming + tạo conversation)
- [x] GET /api/v1/conversations
- [x] GET /api/v1/conversations/:id
- [x] DELETE /api/v1/conversations/:id

### Phase 4: Frontend UI
- [x] Tạo ChatLayout (sidebar + main content)
- [x] Tạo ConversationList component
- [x] Tạo ChatWindow + MessageList + MessageItem
- [x] Tạo InputBar component

### Phase 5: Frontend - Connect API
- [x] Tạo chat.service.ts
- [x] Implement SSE streaming client
- [x] Kết nối Redux với API
- [x] Handle loading + error states

### Phase 6: Testing
- [x] Test backend API
- [x] Test frontend functionality
- [x] Fix bugs nếu có

### Phase 7: Unit Tests
- [x] Tạo ChatController tests
- [x] Tạo ChatService tests
- [x] Tạo ChatSlice tests

---

## Database Schema

```prisma
model user {
  id            String   @id @default(uuid())
  email         String?  @unique
  password      String?  @map("password")
  display_name  String?  @map("display_name")
  firebase_uid  String?  @unique @map("firebase_uid")
  photo_url     String?  @map("photo_url")
  provider      String?
  created_at    DateTime @default(now()) @map("created_at")
  updated_at    DateTime @updatedAt @map("updated_at")

  @@index([email])
  @@map("user")
}

model conversation {
  id            String    @id @default(uuid())
  name          String
  user_id       String?   @map("user_id")
  system_prompt String?   @map("system_prompt")
  auto_prompt   String?   @map("auto_prompt")
  context_token Int?       @default(4096) @map("context_token")
  temperature   Float?    @default(0.7) @map("temperature")
  max_tokens    Int?      @default(2048) @map("max_tokens")
  message_count Int       @default(0) @map("message_count")
  created_at    DateTime  @default(now()) @map("created_at")
  updated_at    DateTime  @updatedAt @map("updated_at")

  message       message[]

  @@map("conversation")
}

model message {
  id              String       @id @default(uuid())
  conversation_id String       @map("conversation_id")
  conversation    conversation @relation(fields: [conversation_id], references: [id], onDelete: Cascade)
  role            String
  content         String
  created_at      DateTime     @default(now()) @map("created_at")

  @@index([conversation_id])
  @@map("message")
}
```

---

## API Design

### POST /api/v1/conversation/messages

**Request:**
```json
{
  "message": "Hello, how are you?",
  "conversation_id": "optional-uuid"
}
```

**Behavior:**
- Nếu có `conversation_id`: lưu message vào conversation đó
- Nếu không có: tạo conversation mới + lưu message

**Response (SSE):**
```
data: {"conversationId": "new-uuid-if-created"}
data: {"chunk": "Hello"}
data: {"chunk": " there!"}
data: {"done": true}
```

### API Endpoints
- [x] POST /api/v1/conversation/messages - Gửi tin nhắn + streaming + tạo conversation
- [x] GET /api/v1/conversations - Lấy danh sách conversation
- [x] GET /api/v1/conversations/:id - Lấy chi tiết conversation + messages
- [x] DELETE /api/v1/conversations/:id - Xóa conversation

---

## Dependencies

### Backend
- @google/generative-ai (Gemini SDK)
- @nestjs/common
- @nestjs/config (env)
- @prisma/client (ORM)
- prisma (dev)
- EventEmitter (for SSE)

### Frontend
- react-markdown (render markdown)
- lucide-react (icons)
- Tailwind CSS (styling)
- @tanstack/react-query (data fetching)

---

## Notes

- User sẽ cung cấp GEMINI_API_KEY trong file .env
- Database: SQLite (prisma)
- Auth: Firebase (Google Login, Email/Password)
- Conversation → User (1 chiều), Conversation → Message (1 chiều)
- Prisma migrate: `npx prisma migrate dev`

## Thay đổi quan trọng (2026-03-14)

### API Changes
- **Trước:** `POST /api/v1/chat`
- **Sau:** `POST /api/v1/conversation/messages` (streaming + tạo conversation nếu không có conversation_id)

### Architecture Changes
- Tách AI module riêng (`src/modules/ai/`) để dễ thêm AI provider khác
- Streaming endpoint tích hợp trong ConversationsController thay vì ChatController

### Frontend Changes
- `chat.service.ts` - cập nhật endpoint và xử lý SSE streaming

---

## ✅ Completed (2026-03-14)

### Files Created

**Backend:**
- `apps/backend/prisma/schema.prisma` - Database schema
- `apps/backend/src/modules/prisma/prisma.service.ts` - Prisma service
- `apps/backend/src/modules/prisma/prisma.module.ts` - Prisma module
- `apps/backend/src/modules/ai/ai.module.ts` - AI module
- `apps/backend/src/modules/ai/ai.service.ts` - AI service (interface)
- `apps/backend/src/modules/ai/providers/gemini.provider.ts` - Gemini provider
- `apps/backend/src/modules/conversations/conversations.controller.ts` - Conversations controller (bao gồm streaming)
- `apps/backend/src/modules/conversations/conversations.service.ts` - Conversations service
- `apps/backend/src/modules/conversations/conversations.module.ts` - Conversations module

**Frontend:**
- `apps/frontend/src/components/ChatLayout.tsx` - Main layout
- `apps/frontend/src/components/ConversationList.tsx` - Conversation sidebar
- `apps/frontend/src/components/ChatWindow.tsx` - Chat window
- `apps/frontend/src/components/MessageList.tsx` - Message list
- `apps/frontend/src/components/MessageItem.tsx` - Message item
- `apps/frontend/src/components/InputBar.tsx` - Input bar
- `apps/frontend/src/pages/ChatPage.tsx` - Chat page
- `apps/frontend/src/services/chat.service.ts` - API service (đã update endpoint)
- `apps/frontend/src/store/slices/chat.slice.ts` - Redux slice
- `apps/frontend/src/vite-env.d.ts` - Vite types

### Build Status
- ✅ Backend: Build successful
- ✅ Frontend: Build successful

### Test Status
- ✅ Backend API: Tested with curl
- ✅ Frontend: Build successful
