---
description: Lập plan implement chi tiết từ issue đã phân tích. Dùng sau analyze-issue hoặc khi Q nói 'lập plan', 'plan implement'.
---

# Plan Implement — $ARGUMENTS

1. Input: kết quả `/analyze-issue` (nếu chưa có → yêu cầu chạy trước)
2. Đọc code patterns hiện có của module sẽ sửa (PATTERN gate) — plan phải theo đúng pattern đó
3. Trình bày plan:
   - **Các bước đánh số**, mỗi step ghi rõ: file tạo/sửa, nội dung thay đổi
   - **TDD steps:** test nào viết trước (RED), implementation tương ứng (GREEN)
   - **Schema change** (nếu có): model file nào trong `prisma/models/`, migration command
   - **Rủi ro / breaking changes:** FE-BE contract, SSE event shape, existing tests bị ảnh hưởng
   - **Docs cần update:** `docs/features/...`, INDEX.md
4. Hỏi Q: "Approve plan?" — KHÔNG code khi chưa được approve
5. Sau khi approve → Q chạy `/do-code`; plan approved = xác nhận cho toàn bộ actions trong plan (bypass CONFIRM gate, KHÔNG bypass TDD/POST-CHANGE/RULE 0/GIT)
