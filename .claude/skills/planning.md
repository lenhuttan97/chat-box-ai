# Skill: Lập kế hoạch phát triển

## ⚠️ Tiên quyết
Phải hoàn thành analyze.md trước.

---

## Quy trình

### Bước 1 — Breakdown Tasks
Từ User Stories → Technical Tasks theo thứ tự:
1. DB Schema (Prisma)
2. Backend API (NestJS)
3. Frontend Components (React)
4. State Management (Redux)
5. Integration & Testing

### Bước 2 — Estimate
- Đơn vị: giờ (h)
- Thêm 20% buffer (Rule S01)
- Format: optimistic / realistic / pessimistic

### Bước 3 — Xác định Dependencies
```
DB Schema → Prisma Migration → NestJS Service
→ NestJS Controller → React Service
→ Redux Slice → React Component
```

### Bước 4 — Chia Phase
- Phase 1: Foundation (DB + API cơ bản)
- Phase 2: Core Feature
- Phase 3: UI/UX Polish
- Phase 4: Testing & Optimization

### Bước 5 — Trình bày Plan và chờ xác nhận (BẮT BUỘC)

Sau khi hoàn thành breakdown, trình bày tóm tắt cho user:

```
📋 Plan sẵn sàng — vui lòng xác nhận trước khi thực hiện:

Tổng quan:
- [X] tasks | Est. tổng: Xh
- Phase 1: [tên] — [X] tasks — Est. Xh
- Phase 2: [tên] — [X] tasks — Est. Xh

Task sẽ thực hiện đầu tiên:
→ [T001] [tên task] (Est. Xh)
→ Thuộc feature: [feature-name]
→ Bao gồm test: có / không

Files sẽ tạo/cập nhật:
- docs/features/{feature-name}/FT-001-name.md
- docs/features/{feature-name}/api.md (nếu có API)
- docs/tasks/{feature-name}/T001-name.md

Risks:
- [risk ngắn gọn]

Xác nhận để bắt đầu viết code? (OK / điều chỉnh / hủy)
```

KHÔNG được viết bất kỳ dòng code nào trước khi nhận "OK" từ user.

### Bước 6 — Output & Docs
Điền vào template output-templates/project-plan.md
Sau đó chạy skills/docs-update.md
