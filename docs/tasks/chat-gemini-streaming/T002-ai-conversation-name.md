# FT-001-T02 — AI Generate Conversation Name

- **Task ID:** FT-001-T02
- **Feature:** FT-001 (Chat Gemini Streaming)
- **Status:** ⏳ pending

## Mô tả

Thay vì sử dụng 50 ký tự đầu của tin nhắn đầu tiên làm tên conversation, AI sẽ tự động tạo một tên ngắn gọn (3-5 từ) phản ánh nội dung cuộc trò chuyện.

## Flow hiện tại

```typescript
// conversations.controller.ts:176
const createDto: CreateConversationDto = {
  name: message.substring(0, 50),  // VD: "Chào bạn, hôm nay trời đẹp quá!"
}
```

## Flow mong muốn

```
User gửi tin nhắn đầu tiên
    ↓
Backend tạo conversation tạm (name = "New conversation")
    ↓
AI phân tích tin nhắn → generate tên ngắn gọn
    ↓
Update conversation.name = "Weather inquiry"
    ↓
Trả về conversation mới cho frontend
```

## AI Prompt đề xuất

```
Based on this user message, generate a short conversation name (3-5 words max).
Return ONLY the name in Vietnamese or English, no explanation.

User message: {first_message}

Response format: conversation_name
```

## Files Affected

- `apps/backend/src/modules/conversations/conversations.controller.ts`

## Acceptance Criteria

- [ ] Conversation name được AI generate tự động
- [ ] Tên ngắn gọn (3-5 từ)
- [ ] Phản ánh nội dung cuộc trò chuyện
- [ ] Không block streaming response
