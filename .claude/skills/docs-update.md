# Skill: Docs Update — Quản lý tài liệu project

## Mục đích
Tạo và duy trì hệ thống docs ở **root của project** (không phải trong .agent/) theo tiêu chuẩn định nghĩa trong documentation-standard.md.
Đây là bước BẮT BUỘC sau mỗi yêu cầu được xử lý.

---

## Cấu trúc docs tại root project

```
[project-root]/
└── docs/
    ├── CHANGELOG.md
    ├── features/
    │   ├── INDEX.md
    │   └── {feature-name}/
    │       ├── index.md
    │       ├── FT-001-name.md
    │       └── api.md              ← (nếu có API)
    ├── tasks/
    │   ├── INDEX.md
    │   └── {feature-name}/
    │       ├── index.md
    │       └── T001-name.md
    └── bugs/
        ├── INDEX.md
        └── {bug-name}/
            ├── index.md
            └── B001-fix-name.md
```

---

## Bước 0 — Kiểm tra docs tồn tại (chạy đầu mỗi session)

```bash
ls [project-root]/docs/
```

Nếu chưa có → Tạo toàn bộ cấu trúc từ templates trong .agent/doc-templates/:

```bash
cp -r .agent/doc-templates/. docs/
```

Sau đó khởi tạo INDEX files với thông tin thực tế của project.

---

## Bước 1 — Quy tắc Header bắt buộc cho mọi file

Mọi file trong docs/ PHẢI có YAML frontmatter:

```markdown
---
title: "[ID] Tên đầy đủ"
type: feature / task / bug / index / changelog
id: FT-001
status: planned / in-progress / done / pending / resolved
created: YYYY-MM-DD
updated: YYYY-MM-DD
summary: "Mô tả ngắn 1 dòng, cập nhật khi nội dung thay đổi."
---
```

Quy tắc updated và summary:
- Mỗi lần sửa bất kỳ nội dung → updated = ngày hôm nay
- Nếu thay đổi ảnh hưởng đến ý nghĩa → cập nhật summary
- Không để updated cũ hơn ngày thực tế sửa

---

## Bước 2 — Quy tắc cập nhật

### Được phép
- THÊM file mới từ template
- CẬP NHẬT status, nội dung task đang làm
- CẬP NHẬT updated và summary khi file thay đổi
- CẬP NHẬT INDEX sau mỗi thay đổi

### Hạn chế
- HẠN CHẾ sửa nội dung task đã done
- Nếu bắt buộc sửa task done → ghi rõ lý do trong file + CHANGELOG

### Không được
- Xóa file (chỉ đổi status cancelled/resolved)
- Sửa entries cũ trong CHANGELOG
- Để updated không khớp ngày thực tế

---

## Bước 3 — Quy trình khi có thay đổi

```
Xác định thay đổi
      ↓
Tạo / cập nhật file item → cập nhật header (updated + summary)
      ↓
Cập nhật INDEX thư mục tương ứng → cập nhật header INDEX
      ↓
Nếu bug/warn mới → đồng bộ vào tasks/INDEX.md (Bug Summary)
      ↓
Ghi vào docs/CHANGELOG.md (thêm lên đầu) → cập nhật header
      ↓
Soạn đề xuất → chờ user xác nhận
```

---

## Bước 4 — Format đề xuất cho user xác nhận

```
📝 Đề xuất cập nhật docs — vui lòng xác nhận:

┌─ docs/features/ ───────────────────────────────────┐
│ + Tạo FT-001-chat-gemini-streaming.md — Chat Interface [pending]         │
│ ~ Cập nhật INDEX.md (updated + summary)            │
└────────────────────────────────────────────────────┘

┌─ docs/tasks/ ──────────────────────────────────────┐
│ + Tạo TSK-F-001.md — Khởi tạo NestJS [planned]    │
│ ~ Cập nhật INDEX.md                                │
└────────────────────────────────────────────────────┘

┌─ docs/bugs/ ───────────────────────────────────────┐
│ (Không có thay đổi)                                │
└────────────────────────────────────────────────────┘

┌─ docs/CHANGELOG.md ────────────────────────────────┐
│ [DATE] ✨ feat: Tạo FT-001 Chat Interface          │
└────────────────────────────────────────────────────┘

Xác nhận ghi docs? (OK / chỉnh sửa / bỏ qua)
```

---

## Bước 5 — Sau khi user OK

1. Ghi tất cả file đã đề xuất
2. Cập nhật updated + summary trong header mọi file đã chạm
3. Thông báo: "✅ Docs đã cập nhật — [X] files"

---

## Bước 6 — Định dạng Feature Documentation theo tiêu chuẩn

Khi tạo hoặc cập nhật feature documentation, PHẢI tuân theo tiêu chuẩn từ `docs/features/auth/auth-documentation.md`:

### Cấu trúc bắt buộc:
1. **Overview** - Tổng quan về feature
2. **Features** - Các chức năng cụ thể
3. **Architecture Components** - Thành phần kiến trúc
4. **Workflows** - Các luồng hoạt động chính
5. **API Endpoints Used** - Các endpoint API liên quan
6. **Integration Points** - Điểm tích hợp với hệ thống khác
7. **Error Handling Strategy** - Cách xử lý lỗi
8. **State Management** - Quản lý trạng thái (nếu có)
9. **Workflow Analysis** - Phân tích luồng hoạt động
10. **User Flow** - Sơ đồ khối về luồng người dùng
11. **Task Flow** - Sơ đồ khối về luồng tác vụ
12. **Recommendations & Improvements** - Đề xuất cải tiến
13. **Conclusion** - Kết luận tổng quát

### User Flow Section (bắt buộc phải có):
- **User Journey Map** - Sơ đồ bảng các bước người dùng (ASCII art)
- **User [Feature Name] Flow** - Sơ đồ quy trình các bước chính (ASCII art)
- **User [Feature Name] States** - Sơ đồ trạng thái người dùng (ASCII art)

### Task Flow Section (bắt buộc phải có):
- **Developer Task Sequence - [Feature Name] WORKFLOWS**
- Backend workflow diagram (ASCII art)
- Frontend workflow diagram (ASCII art)
- State management workflow diagram (ASCII art)
- Component integration workflow diagram (ASCII art)

### Nguyên tắc viết:
- Không đưa mã nguồn cụ thể vào phần Recommendations
- Tập trung vào quy trình và kiến trúc ở mức hệ thống
- Sử dụng sơ đồ khối ASCII art cho các luồng
- Giữ nhất quán về terminology
- Sử dụng bullet points cho danh sách
- Bảng biểu cho thông tin so sánh/trạng thái

---

## Format ID và vị trí file

| Loại | Prefix | File path |
|------|--------|-----------|
| Feature | FT- | docs/features/{feature-name}/FT-001-name.md |
| Task | T001 | docs/tasks/{feature-name}/T001-name.md |
| Bug | B001 | docs/bugs/{bug-name}/B001-fix-name.md |
| API Docs | - | docs/features/{feature-name}/api.md |

ID tăng dần, không tái sử dụng, không xóa file.

---

## Links giữa các file

**Quy tắc:** Mọi file PHẢI link đến các file liên quan.

| File | Phải link đến |
|------|---------------|
| Feature (FT-001-chat-gemini-streaming.md) | Tasks (T001), API (api.md) |
| Task (T001) | Feature (FT-001-chat-gemini-streaming.md), API (api.md) |
| Feature index.md | Tasks index.md |
| Tasks index.md | Feature index.md |

Xem chi tiết: [conventions.md](../context/conventions.md)

---

## Status hợp lệ

| Status | Dùng cho |
|--------|---------|
| pending | Feature/Task/Bug chưa bắt đầu |
| in_progress | Đang thực hiện |
| done | Hoàn thành |
| cancelled | Đã hủy (ghi rõ lý do trong file) |