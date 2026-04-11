# Skill: Coding — Quy trình viết code

## Mục đích
Cầu nối giữa plan đã xác nhận và quá trình viết code thực tế.
Đảm bảo chuẩn bị đúng, viết đúng conventions, tự review trước khi test.

## Tiên quyết
- Đã có plan được user xác nhận (Rule R12)
- Đã chạy clarify.md → analyze.md → planning.md

---

## Bước 1 — Pre-code Checklist (BẮT BUỘC)

### 1.1 Xác nhận plan
- [ ] Plan đã được user xác nhận (R12)
- [ ] Xác định rõ TSK-ID đang thực hiện

### 1.2 Kiểm tra context
- [ ] Sử dụng đúng stack trong tech-stack.md
- [ ] Nắm conventions trong conventions.md
- [ ] Nắm vị trí file trong project-structure.md
- [ ] Chuyển mode plan → đưa ra plan thực hiện
- [ ] Kiểm tra token với token-guard.md → xác nhận tiếp tục với token đã dùng / clear token rồi thực hiện / không thực hiện

---

## Bước 2 — Project Setup (nếu cần)

### Backend — scaffold module mới
```bash
cd apps/backend
nest g module modules/[name] --no-spec
nest g controller modules/[name] --no-spec
nest g service modules/[name] --no-spec
# File test tạo thủ công theo chuẩn test.md
```

### Frontend — tạo component mới
```
components/[scope]/[ComponentName]/
├── [ComponentName].tsx
└── [ComponentName].types.ts     ← Props interface đặt ở đây
```

> Vị trí chi tiết xem project-structure.md

---

## Bước 3 — Viết Code theo Conventions

### Import Order (bắt buộc)

Backend:
```typescript
// 1. NestJS core
import { Injectable, Logger, NotFoundException } from '@nestjs/common'
// 2. NestJS modules
import { ConfigService } from '@nestjs/config'
// 3. Internal modules
import { PrismaService } from '../prisma/prisma.service'
// 4. Prisma types
import { ChatMessage } from '@prisma/client'
// 5. DTOs / local types
import { SendMessageDto } from './dto/send-message.dto'
```

Frontend:
```typescript
// 1. React core
import { FC, useState, useEffect } from 'react'
// 2. Third-party
import { useNavigate } from 'react-router-dom'
// 3. Store / hooks
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectMessages } from '@/store/slices/chatSlice'
// 4. Services
import { chatService } from '@/services/chat.service'
// 5. Components
import { Button } from '@/components/common/Button/Button'
// 6. Types
import type { Message } from '@/types/chat.types'
```

### Error Handling (backend)
```typescript
// Throw đúng exception type
throw new NotFoundException(`Conversation ${id} not found`)
throw new BadRequestException('Content cannot be empty')
throw new UnauthorizedException('Invalid credentials')

// Wrap mọi external call
async callAI(prompt: string): Promise<string> {
  try {
    return await this.aiProvider.generate(prompt)
  } catch (error) {
    this.logger.error(`AI call failed`, error.stack)
    throw new ServiceUnavailableException('AI service unavailable')
  }
}
```

### React / Redux Toolkit
```typescript
// Functional component + typed hooks
const ChatPage: FC = () => {
  const dispatch = useAppDispatch()
  const messages = useAppSelector(selectMessages)
  return ( ... )
}

// Redux slice
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.items.push(action.payload)
    }
  }
})
```

> Naming, SOLID, Logging — xem conventions.md

---

## Bước 4 — Viết Test

Sau khi code xong → chạy skills/test.md toàn bộ.
Không tóm tắt lại ở đây để tránh xung đột với test.md.

---

## Bước 5 — Self Code Review (trước khi báo user)

### Checklist kỹ thuật
```
□ Không có console.log thừa (phải dùng Logger)
□ Không có TODO chưa xử lý (hoặc đã ghi vào docs/bugs/)
□ Import order đúng theo Bước 3
□ Không có hardcoded value — URL, key, port dùng config/env
□ Error handling đầy đủ cho mọi async/external call
□ Logging đúng vị trí: request vào, external call, error
□ Không log thông tin nhạy cảm
```

### Checklist chất lượng
```
□ SOLID: mỗi class/function chỉ làm 1 việc?
□ Có duplicate code không? Có thể extract không?
□ Có tight coupling không? (nên inject qua constructor)
□ Có potential memory leak? (subscription chưa unsubscribe)
□ Có race condition? (async chưa handle đúng)
```

### Khi phát hiện vấn đề
- Vấn đề nhỏ (style, naming) → tự fix
- Vấn đề logic → báo user trước khi fix
- Vấn đề ngoài scope plan → dừng, hỏi user

---

## Bước 6 — Báo cáo hoàn thành

```
✅ Code xong — [TSK-ID] [tên task]

Files đã tạo/sửa:
- [path] — [mô tả ngắn]
- [path] — [mô tả ngắn]

Self review: ✅ Pass
Vấn đề phát hiện: [không có / mô tả nếu có]

Chuyển sang viết test. Bạn có muốn chạy test không?
(unit / integration / e2e / tất cả / bỏ qua)
```

---

## Flow tổng thể

```
[Plan xác nhận]
      ↓
[Bước 1] Pre-code checklist → liệt kê files → user OK
      ↓
[Bước 2] Pre-code chuyển mode plan, lập planning implement → user OK
      ↓
[Bước 3] Project setup nếu cần
      ↓
[Bước 4] Viết test → skills/test.md
      ↓
[Bước 5] Viết code (import order, error handling, conventions)
      ↓
[Bước 6] Self code review
      ↓
[Bước 7] Run test → update code bug
      ↓
[Test pass]
      ↓
[docs-update.md] → đề xuất cập nhật docs
      ↓
[commit.md]      → khi user yêu cầu
```
