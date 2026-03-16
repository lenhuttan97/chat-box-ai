# T001 — Auto Chat Settings

## Thông tin

| Trường | Giá trị |
|--------|---------|
| ID | T001 |
| Feature | auto-chat-settings |
| Feature ID | FT-004 |
| Loại | feature |
| Trạng thái | pending |
| Priority | medium |
| Ngày tiếp nhận | 2026-03-13 |

---

## Related

| File | Mô tả |
|------|-------|
| [Feature: FT-004](../../features/auto-chat-settings/FT-004.md) | Feature specification |
| [API Docs](../../features/auto-chat-settings/api.md) | API Documentation |

---

## Mô tả yêu cầu

Tự động phân tích và bổ sung system prompt + context cho conversation:
- Sau tin nhắn đầu tiên → tự động bổ sung systemPrompt + contextToken
- Sau mỗi 10 lượt tin nhắn → cập nhật lại
- **Bổ sung chứ không thay thế** cài đặt thủ công của user (FT-003)
- Lưu cho mỗi conversation

---

## Plan

1. **Database**: Thêm fields `auto_prompt`, `message_count` vào conversation
2. **Backend**: Tạo AI analysis service để phân tích context
3. **Backend**: Update ChatService để trigger auto update và merge với user settings
4. **Frontend**: Hiển thị cả user prompt và auto prompt trong settings

---

## Phases

- [ ] Phase 1: Database - Thêm fields
- [ ] Phase 2: Backend - AI Analysis Service
- [ ] Phase 3: Backend - Integrate vào ChatService (merge logic)
- [ ] Phase 4: Frontend - Hiển thị settings
- [ ] Phase 5: Testing

---

## Sub-tasks

### Phase 1: Database
- [ ] Thêm fields `auto_prompt`, `message_count` vào conversation model
- [ ] Chạy prisma migrate

### Phase 2: Backend - AI Analysis Service
- [ ] Tạo AnalysisService để phân tích conversation
- [ ] Tạo prompt template cho AI analysis
- [ ] Implement hàm extract context từ AI response

### Phase 3: Backend - Integration
- [ ] Update ChatService: increment message_count sau mỗi tin nhắn
- [ ] Add trigger logic: nếu message_count == 1 hoặc % 10 == 0 → gọi AI analysis
- [ ] Merge logic:
  - systemPrompt = user system_prompt + "\n" + auto_prompt mới
  - contextToken = user đã set ? giữ nguyên : auto set
- [ ] Cập nhật chat endpoint để include merged systemPrompt + contextToken

### Phase 4: Frontend
- [ ] Hiển thị cả user systemPrompt và auto_prompt trong settings modal

### Phase 5: Testing
- [ ] Test auto update sau tin nhắn đầu
- [ ] Test auto update sau 10 lượt
- [ ] Test merge với user settings (bổ sung chứ không thay thế)

---

## Dependencies

- FT-001: Chat Gemini Streaming
- FT-003: Chat Settings (user manual)

**Note:** Task này nên làm sau FT-001 và FT-003.
