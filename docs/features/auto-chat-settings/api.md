# Auto Chat Settings API

## Logic

Không có API endpoint mới. Auto update được xử lý tự động trong chat flow.

### Trigger Points

| Điều kiện | Hành động |
|-----------|-----------|
| message_count == 1 (tin thứ 2) | Auto analyze + set systemPrompt & contextToken |
| message_count % 10 == 0 | Auto analyze + update systemPrompt & contextToken |

### Conversation Fields

| Field | Type | Description |
|-------|------|-------------|
| is_auto_mode | boolean | Bật/tắt auto update (true = auto) |
| message_count | int | Số tin nhắn trong conversation |

### PATCH /api/v1/conversations/:id (mở rộng)

Thêm field `isAutoMode` để user có thể bật/tắt auto mode:

```json
{
  "name": "Tên mới",
  "systemPrompt": "System prompt...",
  "contextToken": 8192,
  "isAutoMode": false  // Tắt auto, dùng thủ công
}
```

## Flow Diagram

```
User sends message
       ↓
Increment message_count
       ↓
Save message to DB
       ↓
Check: message_count == 1 OR message_count % 10 == 0?
       ↓ (yes)
Call AI to analyze conversation
       ↓
Update conversation (systemPrompt, contextToken)
       ↓
Continue with normal chat flow
```
