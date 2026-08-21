---
description: Fetch/hiển thị issue từ GitHub hoặc file local; tạo issue mới nếu chưa có. Dùng khi Q nhắc số issue, bug, feature request.
---

# Check Issue — $ARGUMENTS

1. Nếu có issue number/repo được chỉ định: fetch bằng `gh issue view <number>` (nếu `gh` fail → báo Q, không đoán)
2. Nếu chưa có issue:
   - Đề xuất tạo GitHub issue + file local đồng bộ
   - Local path: bug → `docs/bugs/<feature>/BUG-<số>-<ten-ngan>.md`; task/story → `docs/tasks/<feature>/T<3-số>-<ten-ngan>.md`
   - Tên file: lowercase, `-` thay space, ≤60 ký tự
   - Nội dung: Title `[<feature>][<TYPE>]-<tên>`, metadata 1 dòng (Feature | Status | Created | GitHub), Overview, Nguyên nhân/Why, Phases checklist
3. **Luôn update INDEX.md** của thư mục chứa + `docs/bugs/INDEX.md` hoặc `docs/tasks/INDEX.md`
4. Báo Q link GitHub + đường dẫn local trước khi chuyển bước tiếp theo (`/analyze-issue`)
