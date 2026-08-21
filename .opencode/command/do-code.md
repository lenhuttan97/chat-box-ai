---
description: Implement code theo plan đã approve, TDD Red→Green. Dùng sau khi plan-impl được duyệt.
---

# Do Code — $ARGUMENTS

1. Restate plan + tạo todo list các step. Plan approved = CONFIRM gate đã pass cho toàn bộ steps
2. **Mỗi step thực hiện theo trình tự:**
   - PATTERN: đọc code pattern hiện có của file/module sẽ sửa
   - TDD RED: viết test trước → chạy → PHẢI fail → báo "Test [name] — FAILS"
   - GREEN: implement tối thiểu → chạy → báo "Test [name] — PASSES"
   - POST-CHANGE: compile (`npm run build --prefix apps/backend` hoặc frontend tsc) + related tests pass
   - Một step xong mới sang step kế — KHÔNG batch
3. Schema change: sửa `prisma/models/*.prisma` (KHÔNG đụng schema.prisma) → `npm run prisma:migrate --prefix apps/backend`
4. Bất cứ gì fail/lạ → STOP, báo Q theo format: lỗi / giả định / đề xuất / kỳ vọng
5. Sau step cuối: tự check N+1 (query trong loop?), update todo, báo tổng kết + duration
6. Next: đề xuất `/build-test` rồi `/review-code`
