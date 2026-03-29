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
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoUrl": null,
    "provider": "email"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

> **Note:** Token và refreshToken được trả về trong response body để client lưu trữ.

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
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoUrl": null,
    "provider": "email"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
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
  "user": {
    "id": "user-uuid",
    "email": "user@gmail.com",
    "displayName": "John Doe",
    "photoUrl": "https://lh3.googleusercontent.com/...",
    "provider": "google"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

> **Note:** Google login chỉ hoạt động khi Firebase được cấu hình. Nếu Firebase không được cấu hình, API trả về lỗi 401 "Firebase authentication is not configured on the server". User nên sử dụng email/password login/register.

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
  "message": "Logged out successfully"
}
```

> **Note:** Token được xóa khỏi cookie. Client nên gọi authMiddleware.logout() để xóa token khỏi localStorage.

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
  "message": "Password updated successfully"
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
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "displayName": "John Updated",
    "photoUrl": "https://example.com/avatar.jpg",
    "provider": "email"
  }
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
| 401 | Unauthorized - token không hợp lệ hoặc Firebase chưa cấu hình |
| 403 | Forbidden - không có quyền |
| 409 | Conflict - email đã tồn tại |
| 422 | Unprocessable Entity - password không đúng |
| 500 | Internal Server Error |

**Error Examples:**

```json
// Invalid credentials (login)
{
  "message": "Invalid credentials",
  "statusCode": 401
}

// Firebase not configured
{
  "message": "Firebase authentication is not configured on the server",
  "statusCode": 401
}

// Email already exists (register)
{
  "message": "Email already exists",
  "statusCode": 409
}
```

---

## Firebase Configuration

### Required Environment Variables

Để sử dụng Google Login, cần cấu hình Firebase Admin SDK trong `.env`:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...
```

### Fallback Behavior

Khi Firebase **không được cấu hình**:
- ✅ Email/Password login: **Hoạt động bình thường**
- ✅ Email/Password register: **Hoạt động bình thường**
- 🔴 Google login: Trả về **Error 401** "Firebase authentication is not configured on the server"

Hệ thống tự động disable Google login nếu thiếu Firebase config.
```
