# T003: Store Tokens in Cookies

> **Type**: Full Stack (BE + FE)
> - Backend: Set/clear cookies in responses
> - Frontend: Remove localStorage, configure axios withCredentials

> ⚠️ **Note**: T003 depends on T002 (Refresh Token) - nên làm sau T002

## Mục tiêu

Chuyển token từ localStorage sang HttpOnly cookies để tăng bảo mật.

## Why Cookies?

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    localStorage vs Cookies                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  localStorage (HIỆN TẠI):                                                  │
│  ├── Accessible via JavaScript                                             │
│  ├── Vulnerable to XSS attacks                                            │
│  ├── Stolen easily by malicious scripts                                    │
│  └── Can be read by any script on the page                               │
│                                                                             │
│  HttpOnly Cookies (MỚI):                                                   │
│  ├── NOT accessible via JavaScript                                        │
│  ├── Protected from XSS (JavaScript cannot read)                          │
│  ├── Sent automatically with each request                                 │
│  └── Can be marked as Secure (HTTPS only)                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Requirements

### 1. Update AuthService

```typescript
// Thay vì return tokens, set cookies
async login(email: string, password: string, @Res() res: Response) {
  const user = await this.validateUser(email, password)
  
  const accessToken = this.jwtService.sign(
    { sub: user.id, email: user.email },
    { expiresIn: '60m' }
  )
  
  const refreshToken = this.jwtService.sign(
    { sub: user.id, type: 'refresh' },
    { expiresIn: '1d' }
  )

  // Set cookies
  const isProduction = process.env.NODE_ENV === 'production'
  
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000, // 60 minutes
  })
  
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  })

  return res.json({ 
    user: { id: user.id, email: user.email, displayName: user.display_name } 
  })
}
```

### 2. Update Logout

```typescript
async logout(@Res() res: Response) {
  res.clearCookie('accessToken')
  res.clearCookie('refreshToken')
  return res.json({ message: 'Logged out successfully' })
}
```

### 3. Update Protected Routes

```typescript
// Frontend - KHÔNG cần gửi token manually
// Cookies được gửi tự động

// apiClient.ts - Remove Authorization header
const apiClient = axios.create({
  baseURL: API_URL,
  // withCredentials: true BẮT BUỘC để gửi cookies
  withCredentials: true,
})

// Frontend - Remove token storage
// localStorage.removeItem('accessToken') // KHÔNG cần nữa
```

### 4. CORS Configuration

```typescript
// main.ts hoặc cors config
app.enableCors({
  origin: true, // Cho phép credentials
  credentials: true, // Cho phép cookies
})
```

### 5. Backend CORS

```typescript
// main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true, // IMPORTANT: Cho phép cookies
})
```

### 6. Optional: CSRF Protection

```typescript
// Nếu dùng cookies, nên thêm CSRF protection
// Nhưng với HttpOnly + SameSite=strict thì an toàn hơn

// Có thể dùng axios với withCredentials
axios.defaults.withCredentials = true
```

## Frontend Changes

### Remove Token from localStorage

```typescript
// BEFORE (localStorage)
localStorage.setItem('accessToken', token)

// AFTER (cookies - tự động)
 // Không cần làm gì, browser tự handle
```

### Remove Authorization Header

```typescript
// BEFORE
const api = axios.create()
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken')
  config.headers.Authorization = `Bearer ${token}`
  return config
})

// AFTER - KHÔNG cần interceptor
const api = axios.create({
  withCredentials: true, // Cookies được gửi tự động
})
```

### Login/Logout

```typescript
// Login - Response không còn token
const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password })
  // Token đã được set trong cookie bởi backend
  // KHÔNG cần localStorage.setItem
  return response.data
}

// Logout
const logout = async () => {
  await api.post('/auth/logout')
  // Cookies đã được clear bởi backend
}
```

## Security Benefits

| Benefit | Description |
|---------|-------------|
| XSS Protection | Token không thể bị đọc bởi JavaScript |
| CSRF Protection | SameSite=strict ngăn cross-site requests |
| Automatic | Cookies được gửi tự động với mỗi request |
| HTTPS | Có thể mark là Secure (HTTPS only) |

## Caveats

| Issue | Solution |
|-------|----------|
| Cannot access token in JS | OK - không cần, dùng cho auth only |
| CORS credentials | Cần `withCredentials: true` |
| Local development | Works với localhost |
| Mobile apps | Cần handle cookies properly |

## Acceptance Criteria

- [ ] Tokens stored in HttpOnly cookies
- [ ] Frontend không cần localStorage cho tokens
- [ ] Auto-refresh vẫn hoạt động với cookies
- [ ] Logout clears cookies properly
- [ ] CORS configured for credentials
- [ ] Works in production with HTTPS
