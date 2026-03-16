# T001 — Chat Settings

## Thông tin

| Trường | Giá trị |
|--------|---------|
| ID | T001 |
| Feature | chat-settings |
| Feature ID | FT-003 |
| Loại | feature |
| Trạng thái | ✅ **completed** |
| Priority | high |
| Ngày tiếp nhận | 2026-03-13 |

---

## Related

| File | Mô tả |
|------|-------|
| [Feature: FT-003](../../features/chat-settings/FT-003.md) | Feature specification |
| [API Docs](../../features/chat-settings/api.md) | API Documentation |

---

## Mô tả yêu cầu

Implement tính năng cài đặt đoạn chat cho phép người dùng:
- Đổi tên conversation
- Cài đặt AI Role / Identity (system prompt)
- Cài đặt Context / Background (context token)
- Cài đặt Temperature
- Cài đặt Max Tokens

Khi gửi tin nhắn lên Gemini, các cài đặt này được dính kèm theo request.

**Yêu cầu:** Người dùng phải đăng nhập (Firebase Auth) mới có thể sử dụng.

---

## Implementation Notes

### ✅ Đã implement trong Codebase:

**Backend:**
- `Conversation` model: systemPrompt, temperature, maxTokens, contextToken
- `PATCH /api/v1/conversations/:id` - update settings
- Integration với Gemini request

**Frontend:**
- `ChatSettingsModal.tsx` - UI với systemPrompt, temperature, maxTokens
- Settings được lưu và gửi kèm khi chat

---

## Phases

- [x] Phase 1: Database - Thêm fields vào Prisma schema
- [x] Phase 2: Backend - PATCH /api/v1/conversations/:id
- [x] Phase 3: Backend - Integration với chat endpoint
- [x] Phase 4: Frontend - Settings UI
- [x] Phase 5: Testing

---

## Dependencies

- FT-001: Chat Gemini Streaming (✅ implemented)
- FT-002: Auth Firebase (✅ implemented)

**Status: ✅ DONE**
