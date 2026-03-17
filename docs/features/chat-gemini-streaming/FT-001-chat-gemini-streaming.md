# FT-001 — Chat với Gemini Streaming

## Thông tin

| Trường | Giá trị |
|--------|---------|
| ID | FT-001 |
| Tên | Chat với Gemini Streaming |
| Trạng thái | ✅ completed |
| Priority | high |
| Ngày tiếp nhận | 2026-03-12 |
| Ngày hoàn thành | 2026-03-14 |

---

## Mô tả tính năng

Xây dựng chat box AI sử dụng Google Gemini API với chế độ streaming để trả lời tin nhắn người dùng theo thời gian thực.

**Requirements từ user:**
- Model: `gemini-3.1-flash-lite-preview`
- API Key: từ `.env` (key: `GEMINI_API_KEY`)
- Streaming protocol: Server-Sent Events (SSE)
- Lưu lịch sử chat vào SQLite
- Auth: Firebase (Google Login, Email/Password)

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
  id         String    @id @default(uuid())
  name       String
  user_id    String?   @map("user_id")
  created_at DateTime  @default(now()) @map("created_at")
  updated_at DateTime  @updatedAt @map("updated_at")

  message    message[]

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

## Related Files

| Loại | File | Trạng thái |
|------|------|-------------|
| Task | [T001-chat-gemini-streaming.md](../tasks/chat-gemini-streaming/T001-chat-gemini-streaming.md) | pending |
| API | [api.md](./api.md) | - |

---

## Notes

- User sẽ cung cấp GEMINI_API_KEY trong file .env
- Database: SQLite (prisma)
- Auth: Firebase (Google Login, Email/Password)
- Conversation → User (1 chiều), Conversation → Message (1 chiều)
- Prisma migrate: `npx prisma migrate dev`
