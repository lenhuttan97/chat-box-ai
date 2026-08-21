---
description: Tạo/cập nhật API docs, technical docs, INDEX trong docs/features. Dùng sau do-code hoặc khi Q nói 'update docs', 'ghi docs'.
---

# Update Docs — $ARGUMENTS

1. Xác định changed features từ `git diff --name-only` + todo list hiện tại
2. Với mỗi feature bị ảnh hưởng:
   - Đã có `docs/features/<feature>/` → update đúng phần thay đổi (documentation.md, api.md)
   - Chưa có → tạo thư mục + `index.md` + doc chính, đặt status trung thực (IMPLEMENTED phải có bằng chứng verify)
   - API mới/đổi: ghi endpoint, method, request/response example, error cases vào `api.md`
3. Bug fix kèm theo → tạo/update `docs/bugs/<feature>/BUG-*.md` (Root Cause, Solution, Related Files) + update `docs/bugs/INDEX.md`
4. **Update mọi INDEX.md liên quan** (`docs/features/INDEX.md`, index của feature, docs/INDEX.md nếu thêm mục mới)
5. Báo danh sách file docs đã tạo/sửa để Q review trước khi `/commit-push`
