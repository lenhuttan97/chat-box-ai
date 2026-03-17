# API Documentation — Chat Gemini Streaming

## Base URL
```
/api/v1
```

---

## Endpoints

### POST /conversation/messages
Gửi tin nhắn và nhận phản hồi streaming từ Gemini.

- Nếu có `conversation_id`: lưu message vào conversation đó
- Nếu không có `conversation_id`: tạo conversation mới và lưu message

**Request:**
```http
POST /api/v1/conversation/messages
Content-Type: application/json
```

```json
{
  "message": "Hello, how are you?",
  "conversation_id": "optional-uuid"
}
```

**Request Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| message | string | Yes | Nội dung tin nhắn |
| conversation_id | string | No | ID conversation (nếu có) |

**Response (SSE):**
```
Content-Type: text/event-stream

data: {"chunk": "Hello"}
data: {"chunk": " there!"}
data: {"chunk": " I'm doing well."}
data: {"conversation_id": "new-uuid-if-created"}
data: {"done": true}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| chunk | string | Phần nội dung AI trả về |
| conversation_id | string | ID của conversation (trả về nếu tạo mới) |
| done | boolean | Khi true, kết thúc stream |

---

### GET /conversations
Lấy danh sách conversations.

**Request:**
```http
GET /api/v1/conversations
```

**Response:**
```json
{
  "data": [
    {
      "id": "conv-uuid-1",
      "name": "Hỏi về React",
      "userId": null,
      "systemPrompt": null,
      "autoPrompt": null,
      "contextToken": 4096,
      "temperature": 0.7,
      "maxTokens": 2048,
      "messageCount": 2,
      "createdAt": "2026-03-12T10:00:00Z",
      "updatedAt": "2026-03-12T10:30:00Z"
    },
    {
      "id": "conv-uuid-2",
      "name": "Tìm hiểu Python",
      "userId": null,
      "systemPrompt": null,
      "autoPrompt": null,
      "contextToken": 4096,
      "temperature": 0.7,
      "maxTokens": 2048,
      "messageCount": 1,
      "createdAt": "2026-03-11T09:00:00Z",
      "updatedAt": "2026-03-11T09:15:00Z"
    }
  ],
  "message": "Success",
  "statusCode": 200
}
```

---

### GET /conversations/:id
Lấy chi tiết conversation kèm messages.

**Request:**
```http
GET /api/v1/conversations/:id
```

**Response:**
```json
{
  "data": {
    "id": "conv-uuid-123",
    "name": "Hỏi về React",
    "userId": null,
    "systemPrompt": null,
    "autoPrompt": null,
    "contextToken": 4096,
    "temperature": 0.7,
    "maxTokens": 2048,
    "messageCount": 2,
    "createdAt": "2026-03-12T10:00:00Z",
    "updatedAt": "2026-03-12T10:30:00Z",
    "messages": [
      {
        "id": "msg-uuid-1",
        "conversationId": "conv-uuid-123",
        "role": "user",
        "content": "React hooks là gì?",
        "createdAt": "2026-03-12T10:30:00Z"
      },
      {
        "id": "msg-uuid-2",
        "conversationId": "conv-uuid-123",
        "role": "assistant",
        "content": "React Hooks là các hàm cho phép bạn sử dụng state...",
        "createdAt": "2026-03-12T10:30:05Z"
      }
    ]
  },
  "message": "Success",
  "statusCode": 200
}
```

---

### POST /conversations
Tạo conversation mới.

**Request:**
```http
POST /api/v1/conversations
Content-Type: application/json
```

```json
{
  "name": "Hỏi về React"
}
```

**Response:**
```json
{
  "data": {
    "id": "conv-uuid-123",
    "name": "Hỏi về React",
    "userId": null,
    "systemPrompt": null,
    "autoPrompt": null,
    "contextToken": 4096,
    "temperature": 0.7,
    "maxTokens": 2048,
    "messageCount": 0,
    "createdAt": "2026-03-12T10:00:00Z",
    "updatedAt": "2026-03-12T10:00:00Z"
  },
  "message": "Conversation created",
  "statusCode": 201
}
```

---

### PUT /conversations/:id
Cập nhật conversation.

**Request:**
```http
PUT /api/v1/conversations/:id
Content-Type: application/json
```

```json
{
  "name": "Tên mới",
  "systemPrompt": "You are a helpful assistant",
  "temperature": 0.8
}
```

**Response:**
```json
{
  "data": {
    "id": "conv-uuid-123",
    "name": "Tên mới",
    "userId": null,
    "systemPrompt": "You are a helpful assistant",
    "autoPrompt": null,
    "contextToken": 4096,
    "temperature": 0.8,
    "maxTokens": 2048,
    "messageCount": 0,
    "createdAt": "2026-03-12T10:00:00Z",
    "updatedAt": "2026-03-12T10:30:00Z"
  },
  "message": "Conversation updated",
  "statusCode": 200
}
```

---

### GET /conversations/user/:userId
Lấy danh sách conversations theo user.

**Request:**
```http
GET /api/v1/conversations/user/:userId
```

**Response:**
```json
{
  "data": [
    {
      "id": "conv-uuid-1",
      "name": "Hỏi về React",
      "userId": "user-uuid-1",
      "messageCount": 2,
      "createdAt": "2026-03-12T10:00:00Z",
      "updatedAt": "2026-03-12T10:30:00Z"
    }
  ],
  "message": "Success",
  "statusCode": 200
}
```

---

### GET /conversations/:id/messages
Lấy danh sách messages theo conversation.

**Request:**
```http
GET /api/v1/conversations/:id/messages
```

**Response:**
```json
{
  "data": [
    {
      "id": "msg-uuid-1",
      "conversationId": "conv-uuid-123",
      "role": "user",
      "content": "React hooks là gì?",
      "createdAt": "2026-03-12T10:30:00Z"
    },
    {
      "id": "msg-uuid-2",
      "conversationId": "conv-uuid-123",
      "role": "assistant",
      "content": "React Hooks là các hàm...",
      "createdAt": "2026-03-12T10:30:05Z"
    }
  ],
  "message": "Messages retrieved",
  "statusCode": 200
}
```

---

### DELETE /conversations/:id
Xóa một conversation.

**Request:**
```http
DELETE /api/v1/conversations/:id
```

**Response:**
```json
{
  "data": null,
  "message": "Conversation deleted",
  "statusCode": 200
}
```

---

## Error Responses

| Status Code | Description |
|------------|-------------|
| 400 | Bad Request - message empty |
| 500 | Internal Server Error |
| 503 | AI Service unavailable |

**Error Example:**
```json
{
  "data": null,
  "message": "AI service unavailable",
  "statusCode": 503
}
```
