---
description: Phân tích issue đối chiếu docs + codebase hiện tại. Dùng sau check-issue hoặc khi Q nói 'phân tích', 'analyze'.
---

# Analyze Issue — $ARGUMENTS

1. Đọc issue (GitHub/local) + docs liên quan trong `docs/features/<feature>/`
2. Trace code paths bị ảnh hưởng:
   - Backend: `grep -rn "{keyword}" apps/backend/src --include="*.ts"` — module → controller → service → prisma schema (`apps/backend/prisma/models/`)
   - Frontend: slice → middleware → component/hook
   - Streaming/AI: `conversations.controller.ts`, `src/modules/ai/`, `message.middleware.ts`
3. Đối chiếu: code thực tế vs docs mô tả vs yêu cầu issue — đánh dấu mọi mismatch
4. Xác định blast radius: endpoints nào đổi, schema có đổi không, FE-BE contract (JSON shape, SSE event shape) có break không
5. Output: tóm tắt hiện trạng, các điểm cần thay đổi kèm đường dẫn file:line, rủi ro, câu hỏi còn tồn
6. Chờ Q review trước khi đề xuất `/plan-impl`
