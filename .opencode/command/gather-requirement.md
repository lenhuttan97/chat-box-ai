---
description: Tiếp nhận yêu cầu mới, hỏi làm rõ, tổng hợp requirement, đề xuất approach. Dùng khi Q mô tả requirement/feature/bug mới.
---

# Gather Requirement — $ARGUMENTS

1. **Tiếp nhận:** xác định loại (Feature mới / Thay đổi feature / Bug / Refactor), ghi nguyên văn yêu cầu
2. **Phân tích sơ bộ:**
   - Đọc `docs/features/INDEX.md` tìm feature liên quan
   - `grep -rl "{keyword}" apps/backend/src apps/frontend/src` tìm code hiện có
   - `grep -rl "{keyword}" docs/` tìm docs/issues/bugs trùng (tránh duplicate)
3. **Hỏi làm rõ:** chỉ hỏi cái CHƯA RÕ, nhóm theo chủ đề, tối đa 5 câu/lần, kèm context tại sao cần biết. Chờ Q trả lời (tối đa 3 vòng)
4. **Tổng hợp Requirement Summary:** Mô tả / Loại / Feature liên quan / Scope (endpoints, schema change, business rules, validation) / Constraints (breaking change?, priority) → hỏi Q confirm
5. **Đề xuất approach:** các bước chính, ước lượng files thay đổi, complexity, risks, bảng alternatives → hỏi Q chọn
6. **Next steps:** đề xuất tạo issue qua `/check-issue`, hoặc phân tích sâu qua `/analyze-issue`
