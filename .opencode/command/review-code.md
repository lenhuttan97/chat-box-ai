---
description: Review toàn bộ code changes trước khi commit. Dùng sau build-test pass hoặc khi Q nói 'review code', 'kiểm tra code'.
---

# Review Code — $ARGUMENTS

1. Xem diff: `git diff` (unstaged) + `git diff --cached` + untracked files
2. Checklist từng file:
   - **SOLID:** 1 lý do thay đổi/class; method ngắn; controller chỉ HTTP concerns
   - **N+1:** query Prisma trong loop/stream/forEach? → batch fetch
   - **Conventions:** đúng module structure, DTO có class-validator, route không tự thêm `/api/v1`, SSE theo pattern `conversations.controller.ts`
   - **Prisma:** schema.prisma KHÔNG bị sửa tay (chỉ `prisma/models/`)
   - **Security:** không log secrets/PII, input validated
   - **Tests:** coverage đủ cho changed logic, test cũ vẫn pass
3. Phân loại findings: 🔴 phải sửa trước commit / 🟡 nên sửa / 🟢 note
4. Báo danh sách findings kèm file:line. Có 🔴 → đề xuất fix rồi chạy lại `/build-test`
5. Pass hết → đề xuất `/update-docs`
