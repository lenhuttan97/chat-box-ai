# API Documentation — Authentication (Firebase)

## Base URL
```
/api/v1/auth
```

---

## Endpoints

### POST /auth/register
Đăng ký tài khoản mới bằng email/password.

**Request:**
```http
POST /api/v1/auth/register
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "John Doe"
}
```

**Response:**
```json
{
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoUrl": null,
    "provider": "email"
  },
  "message": "User registered successfully",
  "statusCode": 201
}
```

---

### POST /auth/login
Đăng nhập bằng email/password.

**Request:**
```http
POST /api/v1/auth/login
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoUrl": null,
    "provider": "email"
  },
  "message": "Login successful",
  "statusCode": 200
}
```

---

### POST /auth/google
Đăng nhập/đăng ký bằng Google (Firebase ID Token).

**Request:**
```http
POST /api/v1/auth/google
Content-Type: application/json
```

```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "data": {
    "id": "user-uuid",
    "email": "user@gmail.com",
    "displayName": "John Doe",
    "photoUrl": "https://lh3.googleusercontent.com/...",
    "provider": "google"
  },
  "message": "Login successful",
  "statusCode": 200
}
```

---

### POST /auth/logout
Đăng xuất khỏi hệ thống.

**Request:**
```http
POST /api/v1/auth/logout
```

**Response:**
```json
{
  "data": null,
  "message": "Logout successful",
  "statusCode": 200
}
```

---

### PUT /auth/password
Cập nhật mật khẩu.

**Request:**
```http
PUT /api/v1/auth/password
Content-Type: application/json
```

```json
{
  "current_password": "old_password",
  "new_password": "new_password123"
}
```

**Response:**
```json
{
  "data": null,
  "message": "Password updated successfully",
  "statusCode": 200
}
```

---

### PUT /auth/profile
Cập nhật thông tin profile (displayName, photoUrl).

**Request:**
```http
PUT /api/v1/auth/profile
Content-Type: application/json
```

```json
{
  "displayName": "John Updated",
  "photoUrl": "https://example.com/avatar.jpg"
}
```

**Response:**
```json
{
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "displayName": "John Updated",
    "photoUrl": "https://example.com/avatar.jpg",
    "provider": "email"
  },
  "message": "Profile updated successfully",
  "statusCode": 200
}
```

---

### GET /users/profile
Lấy thông tin user hiện tại (yêu cầu xác thực).

**Request:**
```http
GET /api/v1/users/profile
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "display_name": "John Doe",
    "photo_url": null,
    "provider": "email",
    "created_at": "2026-03-12T10:00:00Z"
  },
  "message": "User profile retrieved",
  "statusCode": 200
}
```

---

## Error Responses

| Status Code | Description |
|------------|-------------|
| 400 | Bad Request - thiếu field hoặc invalid |
| 401 | Unauthorized - token không hợp lệ |
| 403 | Forbidden - không có quyền |
| 409 | Conflict - email đã tồn tại |
| 422 | Unprocessable Entity - password không đúng |
| 500 | Internal Server Error |

**Error Example:**
```json
{
  "data": null,
  "message": "Invalid email or password",
  "statusCode": 401
}
```
