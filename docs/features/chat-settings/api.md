# Chat Settings API

## Endpoints

### PATCH /api/v1/conversations/:id

Cập nhật settings cho conversation.

**Authentication:** Required (Firebase token)

**Request:**
```json
{
  "name": "Tên đoạn chat mới",
  "systemPrompt": "System prompt tùy chỉnh...",
  "contextToken": 8192
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | No | Tên mới cho conversation |
| systemPrompt | string | No | System prompt tùy chỉnh |
| contextToken | number | No | Số token context (1024, 2048, 4096, 8192, 16384) |

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "name": "Tên đoạn chat mới",
    "systemPrompt": "System prompt tùy chỉnh...",
    "contextToken": 8192,
    "userId": "user-uuid",
    "createdAt": "2026-03-13T00:00:00Z",
    "updatedAt": "2026-03-13T00:00:00Z"
  },
  "message": "Conversation updated successfully",
  "statusCode": 200
}
```

**Error Responses:**
- 401: Unauthorized (chưa đăng nhập)
- 403: Forbidden (không sở hữu conversation)
- 404: Not found (conversation không tồn tại)

---

## Integration Flow

```
User edits settings → PATCH /api/v1/conversations/:id → Update DB
                                                              ↓
User sends message → GET conversation settings → Include in Gemini request
```
