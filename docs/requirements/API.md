# API Documentation

## Base URL
```
Development: http://localhost:3000
```

## Content Type
```
Content-Type: application/json
```

## Authentication

### JWT Token
- Access token: 15 minutes expiry
- Refresh token: 7 days expiry
- Stored in httpOnly cookies

### Headers
```
Authorization: Bearer <access_token>
x-device-info: {"deviceId": "uuid", "browser": "Chrome", ...}
```

---

## Endpoints

## 1. Authentication

### 1.1 Register
```
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "John Doe"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoUrl": null
  },
  "token": "eyJhbG...",
  "refreshToken": "eyJhbG..."
}
```

---

### 1.2 Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoUrl": null
  },
  "token": "eyJhbG...",
  "refreshToken": "eyJhbG..."
}
```

---

### 1.3 Google Login
```
POST /auth/google
```

**Request Body:**
```json
{
  "idToken": "firebase_id_token"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoUrl": "https://..."
  },
  "token": "eyJhbG...",
  "refreshToken": "eyJhbG..."
}
```

---

### 1.4 Refresh Token
```
POST /auth/refresh-token
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbG..."
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoUrl": null
  },
  "token": "eyJhbG...",
  "refreshToken": "eyJhbG..."
}
```

---

### 1.5 Logout
```
POST /auth/logout
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### 1.6 Update Password
```
PUT /auth/password
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "oldPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response (200):**
```json
{
  "message": "Password updated successfully"
}
```

---

### 1.7 Update Profile
```
PUT /auth/profile
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "displayName": "Jane Doe",
  "photoUrl": "https://example.com/photo.jpg"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "Jane Doe",
    "photoUrl": "https://example.com/photo.jpg"
  }
}
```

---

## 2. Conversations

### 2.1 Create Conversation
```
POST /conversations
```

**Headers:** Optional `x-device-info`

**Request Body:**
```json
{
  "name": "My Chat",
  "userId": "uuid (optional)",
  "deviceId": "uuid (optional)",
  "provider": "gemini (optional)",
  "model": "gemini-1.5-flash (optional)",
  "systemPrompt": "You are a helpful assistant (optional)",
  "temperature": 0.7 (optional),
  "maxTokens": 2048 (optional)
}
```

**Response (201):**
```json
{
  "data": {
    "id": "uuid",
    "name": "My Chat",
    "userId": "uuid or null",
    "deviceId": "uuid or null",
    "provider": "gemini",
    "model": "gemini-1.5-flash",
    "systemPrompt": null,
    "temperature": 0.7,
    "maxTokens": 2048,
    "createdAt": "2026-03-29T00:00:00Z"
  },
  "message": "Conversation created",
  "statusCode": 201
}
```

---

### 2.2 List All Conversations
```
GET /conversations?page=1&size=10
```

**Response (200):**
```json
{
  "data": [...],
  "message": "Conversations retrieved",
  "statusCode": 200,
  "totalElement": 25
}
```

---

### 2.3 List User Conversations
```
GET /conversations/user/:userId?page=1&size=10
```

**Response (200):**
```json
{
  "data": [...],
  "message": "User conversations retrieved",
  "statusCode": 200,
  "totalElement": 10
}
```

---

### 2.4 List Device Conversations
```
GET /conversations/device/:deviceId?page=1&size=10
```

**Response (200):**
```json
{
  "data": [...],
  "message": "Device conversations retrieved",
  "statusCode": 200,
  "totalElement": 5
}
```

---

### 2.5 Get Conversation
```
GET /conversations/:id
```

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "name": "My Chat",
    "userId": "uuid",
    "provider": "gemini",
    "messageCount": 10,
    "createdAt": "2026-03-29T00:00:00Z",
    "updatedAt": "2026-03-29T01:00:00Z"
  },
  "message": "Conversation retrieved",
  "statusCode": 200
}
```

---

### 2.6 Update Conversation
```
PUT /conversations/:id
```

**Request Body:**
```json
{
  "name": "New Name",
  "systemPrompt": "Custom prompt...",
  "temperature": 0.9,
  "maxTokens": 4096,
  "provider": "openai",
  "model": "gpt-4"
}
```

**Response (200):**
```json
{
  "data": { ... },
  "message": "Conversation updated",
  "statusCode": 200
}
```

---

### 2.7 Delete Conversation
```
DELETE /conversations/:id
```

**Response (204):**
```json
{
  "data": null,
  "message": "Conversation deleted",
  "statusCode": 204
}
```

---

### 2.8 List Messages
```
GET /conversations/:id/messages?page=1&size=50
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "conversationId": "uuid",
      "role": "user",
      "content": "Hello",
      "createdAt": "2026-03-29T00:00:00Z"
    },
    {
      "id": "uuid",
      "conversationId": "uuid",
      "role": "assistant",
      "content": "Hi there!",
      "createdAt": "2026-03-29T00:00:01Z"
    }
  ],
  "message": "Messages retrieved",
  "statusCode": 200,
  "totalElement": 100
}
```

---

### 2.9 Send Message (Streaming)
```
POST /conversation/messages
```

**Headers:** Optional `x-device-info`

**Request Body:**
```json
{
  "message": "Hello, how are you?",
  "conversation_id": "uuid (optional - creates new if not provided)",
  "fileId": "uuid (optional)"
}
```

**Response: SSE (text/event-stream)**
```javascript
// First event - conversation created (if new)
data: {"conversationId": "new-uuid"}

// Stream events
data: {"chunk": "Hello"}
data: {"chunk": " there"}
data: {"chunk": "!"}

// Final event
data: {"done": true}
```

**Error:**
```javascript
data: {"error": "AI service unavailable"}
```

---

## 3. Users

### 3.1 Create User
```
POST /users
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "displayName": "John"
}
```

**Response (201):**
```json
{
  "data": { ... },
  "message": "User created",
  "statusCode": 201
}
```

---

### 3.2 List Users
```
GET /users
```

**Auth:** JWT Required

**Response (200):**
```json
{
  "data": [...],
  "message": "Users retrieved",
  "statusCode": 200
}
```

---

### 3.3 Get User
```
GET /users/:id
```

**Auth:** JWT Required

**Response (200):**
```json
{
  "data": { ... },
  "message": "User retrieved",
  "statusCode": 200
}
```

---

### 3.4 Update User
```
PUT /users/:id
```

**Auth:** JWT Required

**Request Body:**
```json
{
  "email": "new@example.com",
  "displayName": "New Name"
}
```

**Response (200):**
```json
{
  "data": { ... },
  "message": "User updated",
  "statusCode": 200
}
```

---

### 3.5 Delete User
```
DELETE /users/:id
```

**Auth:** JWT Required

**Response (204):**
```json
{
  "data": null,
  "message": "User deleted",
  "statusCode": 204
}
```

---

### 3.6 Get My Profile
```
GET /users/profile
```

**Auth:** JWT Required

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoUrl": null,
    "themeSetting": "auto"
  },
  "message": "User profile retrieved",
  "statusCode": 200
}
```

---

### 3.7 Update Theme
```
PUT /users/me/theme
```

**Auth:** JWT Required

**Request Body:**
```json
{
  "theme": "dark"
}
```

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "themeSetting": "dark"
  },
  "message": "Theme updated",
  "statusCode": 200
}
```

---

## 4. Files

### 4.1 Upload File
```
POST /files/upload
```

**Content-Type:** multipart/form-data

**Body:** `file` (File)

**Response (201):**
```json
{
  "data": {
    "id": "uuid",
    "filename": "abc123.pdf",
    "originalName": "document.pdf",
    "mimeType": "application/pdf",
    "size": 1024000,
    "status": "processing"
  },
  "message": "File uploaded and processing",
  "statusCode": 201
}
```

---

### 4.2 Get File
```
GET /files/:id
```

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "filename": "abc123.pdf",
    "originalName": "document.pdf",
    "mimeType": "application/pdf",
    "size": 1024000,
    "status": "completed"
  },
  "message": "File retrieved",
  "statusCode": 200
}
```

---

### 4.3 Get File Content
```
GET /files/:id/content
```

**Response (200):**
```json
{
  "data": {
    "content": "Extracted text from PDF..."
  },
  "message": "File content retrieved",
  "statusCode": 200
}
```

---

### 4.4 Get File Status
```
GET /files/:id/status
```

**Response (200):**
```json
{
  "data": {
    "status": "completed"
  },
  "message": "File status retrieved",
  "statusCode": 200
}
```

---

## 5. Devices

### 5.1 List Devices
```
GET /devices
```

**Auth:** JWT Required

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "deviceId": "browser-uuid",
      "browser": "Chrome",
      "os": "macOS",
      "isOnline": true,
      "lastSeen": "2026-03-29T00:00:00Z"
    }
  ],
  "message": "Devices retrieved",
  "statusCode": 200,
  "totalElement": 2
}
```

---

### 5.2 Update Device
```
PATCH /devices/:id
```

**Auth:** JWT Required

**Request Body:**
```json
{
  "name": "My MacBook"
}
```

**Response (200):**
```json
{
  "data": { ... },
  "message": "Device updated",
  "statusCode": 200
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |
| 503 | Service Unavailable |
