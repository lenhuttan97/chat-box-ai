# T002: Refresh Token (1 Day Expiry)

> **Type**: Full Stack (BE + FE)
> - Backend: Generate, validate, store refresh tokens
> - Frontend: Handle 401, auto-refresh, interceptors

## Mục tiêu

Implement refresh token mechanism để duy trì đăng nhập trong 1 ngày.

## Requirements

### 1. Token Configuration

```typescript
// JWT Config - Current: access token 60m, refresh token 1d
const JWT_CONFIG = {
  accessToken: {
    expiresIn: '60m',      // 60 minutes (hiện tại)
    secret: process.env.JWT_SECRET,
  },
  refreshToken: {
    expiresIn: '1d',       // 1 day
    secret: process.env.JWT_REFRESH_SECRET,
  }
}
```

### 2. Database Schema

```prisma
model User {
  id            String   @id @default(uuid())
  email         String?  @unique
  refreshToken  String?  @map("refresh_token")  // Thêm field
  // ... existing fields
}
```

### 3. Auth Flow với Refresh Token

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        REFRESH TOKEN FLOW                                    │
└─────────────────────────────────────────────────────────────────────────────┘

1. USER LOGIN
   ┌─────────────────────────────────────────────────────────────────┐
   │  POST /auth/login                                               │
   │  Body: { email, password }                                      │
   └─────────────────────────────┬───────────────────────────────────┘
                                 │
                                 ▼
   ┌─────────────────────────────────────────────────────────────────┐
   │  Generate:                                                      │
   │  - accessToken (15 min)                                         │
   │  - refreshToken (1 day)                                         │
   └─────────────────────────────┬───────────────────────────────────┘
                                 │
                                 ▼
   ┌─────────────────────────────────────────────────────────────────┐
   │  Save refreshToken to DB (hashed)                              │
   └─────────────────────────────┬───────────────────────────────────┘
                                 │
                                 ▼
   Response: { user, accessToken, refreshToken }
```

```
2. ACCESS TOKEN EXPIRED (after 15 min)
   ┌─────────────────────────────────────────────────────────────────┐
   │  Client gọi API với expired accessToken                       │
   │  → 401 Unauthorized                                            │
   └─────────────────────────────┬───────────────────────────────────┘
                                 │
                                 ▼
   ┌─────────────────────────────────────────────────────────────────┐
   │  Client gọi POST /auth/refresh                                 │
   │  Body: { refreshToken }                                        │
   └─────────────────────────────┬───────────────────────────────────┘
                                 │
                                 ▼
   ┌─────────────────────────────────────────────────────────────────┐
   │  Validate refreshToken:                                        │
   │  - Check token not expired                                      │
   │  - Verify token signature                                        │
   │  - Check token in DB (not revoked)                              │
   └─────────────────────────────┬───────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
              SUCCESS                   FAILED
                    │                         │
                    ▼                         ▼
   ┌─────────────────────────┐    ┌─────────────────────────┐
   │ Generate new tokens:    │    │ Return 401              │
   │ - accessToken (15m)    │    │ Force re-login         │
   │ - refreshToken (1d)     │    └─────────────────────────┘
   │ (rotate refresh token) │
   └─────────────────────────┘
```

### 4. Implementation

#### AuthService

```typescript
// Generate tokens
generateTokens(user: User): { accessToken: string; refreshToken: string } {
  const accessToken = this.jwtService.sign(
    { sub: user.id, email: user.email },
    { expiresIn: '15m' }
  )

  const refreshToken = this.jwtService.sign(
    { sub: user.id, type: 'refresh' },
    { expiresIn: '1d' }
  )

  return { accessToken, refreshToken }
}

// Refresh token
async refreshToken(refreshToken: string) {
  // Verify token
  const payload = this.jwtService.verify(refreshToken, {
    secret: process.env.JWT_REFRESH_SECRET,
  })

  // Check user and refreshToken in DB
  const user = await this.prisma.user.findFirst({
    where: { 
      id: payload.sub,
      refreshToken: refreshToken  // Hoặc hashed version
    }
  })

  if (!user) {
    throw new UnauthorizedException('Invalid refresh token')
  }

  // Generate new tokens
  return this.generateTokens(user)
}

// Logout - revoke refresh token
async logout(userId: string) {
  await this.prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null }
  })
}
```

#### AuthController

```typescript
@Post('refresh')
async refreshToken(@Body() body: { refreshToken: string }) {
  const tokens = await this.authService.refreshToken(body.refreshToken)
  return tokens
}

@Post('logout')
@UseGuards(AuthGuard('jwt'))
async logout(@Req() req: Request) {
  const userId = req.user['sub']
  await this.authService.logout(userId)
  return { message: 'Logged out successfully' }
}
```

#### Frontend - Token Management

```typescript
// apiClient.ts
let isRefreshing = false
let refreshPromise: Promise<void> | null = null

axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && !isRefreshing) {
      isRefreshing = true
      
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        const response = await axios.post('/auth/refresh', { refreshToken })
        
        const { accessToken, refreshToken: newRefreshToken } = response.data
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', newRefreshToken)
        
        // Retry original request
        error.config.headers['Authorization'] = `Bearer ${accessToken}`
        return axios(error.config)
      } catch (refreshError) {
        // Force logout
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    
    return Promise.reject(error)
  }
)
```

### 5. Security Considerations

| Concern | Solution |
|---------|----------|
| Refresh token theft | Store hashed in DB, rotate on each use |
| Token replay | One-time use, rotate after refresh |
| Long expiry | 1 day is reasonable, balance UX vs security |
| CSRF | Use HttpOnly cookies (optional) |

## Configuration

```bash
# .env
JWT_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="1d"
```

## Acceptance Criteria

- [ ] Access token expires in 60 minutes (giữ nguyên)
- [ ] Refresh token expires in 1 day
- [ ] Automatic token refresh when access token expires
- [ ] Refresh token rotation (new refresh token on each use)
- [ ] Logout revokes refresh token
- [ ] Frontend handles 401 gracefully
- [ ] Force re-login when refresh fails
