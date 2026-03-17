# Chat Streaming Bugs

## Feature: Chat - Frontend (FE)

> ⚠️ **All bugs are Frontend-only** - Fix in React/Redux components

## Bugs

| Bug ID | Bug | Status |
|--------|-----|--------|
| BUG-001 | Missing Loading Effect | pending |
| BUG-002 | Streaming Response Not Smooth | pending |
| BUG-003 | Message List Jumps During Streaming | pending |
| BUG-004 | Conversation List Re-renders During Streaming | pending |

## Chi tiết

| Bug | File | Mô tả |
|------|------|-------|
| BUG-001 | [BUG-001-loading-effect.md](./BUG-001-loading-effect.md) | Không có loading khi gửi tin nhắn |
| BUG-002 | [BUG-002-streaming-smooth.md](./BUG-002-streaming-smooth.md) | Streaming không mượt, nhảy word |
| BUG-003 | [BUG-003-message-list-jump.md](./BUG-003-message-list-jump.md) | Message list nhảy khi streaming |
| BUG-004 | [BUG-004-conversation-list-rerender.md](./BUG-004-conversation-list-rerender.md) | Conversation list re-render không cần thiết |

## Dependencies

- BUG-001, BUG-002, BUG-003, BUG-004 có thể fix độc lập
- BUG-002, BUG-003, BUG-004 thường liên quan đến nhau

## Related Features

- FT-001: Chat Gemini Streaming
