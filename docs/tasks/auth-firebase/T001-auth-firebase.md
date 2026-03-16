# T001 — Authentication Firebase

## Thông tin

| Trường | Giá trị |
|--------|---------|
| ID | T001 |
| Feature | auth-firebase |
| Feature ID | FT-002 |
| Loại | feature |
| Trạng thái | completed |
| Priority | high |
| Ngày tiếp nhận | 2026-03-12 |

---

## Related

| File | Mô tả |
|------|-------|
| [Feature: FT-002](../../features/auth-firebase/FT-002.md) | Feature specification |
| [API Docs](../../features/auth-firebase/api.md) | API Documentation |

---

## Mô tả yêu cầu

Xây dựng hệ thống xác thực người dùng sử dụng Firebase Authentication.

**Features:**
- Login với Google (Firebase)
- Login với Email/Password
- Đăng ký tài khoản mới (Email/Password)
- Logout
- Update password
- Update display name
- Update ảnh đại diện

---

## Plan

1. Setup Firebase project và lấy credentials
2. Tạo Auth Module (Backend)
3. Implement API endpoints
4. Setup Firebase SDK (Frontend)
5. Tạo UI components (Login, Register, Profile)
6. Integration + Test

---

## Phases

- [ ] Phase 1: Setup Firebase Project
- [ ] Phase 2: Backend - Auth Module
- [ ] Phase 3: Backend - API Endpoints
- [ ] Phase 4: Frontend - Firebase SDK Setup
- [ ] Phase 5: Frontend - Auth UI Components
- [ ] Phase 6: Integration & Testing

---

## Sub-tasks

### Phase 1: Setup Firebase Project
- [ ] Tạo Firebase project trên Firebase Console
- [ ] Enable Firebase Auth (Google, Email/Password)
- [ ] Lấy Firebase config (apiKey, projectId, etc.)
- [ ] Thêm vào .env

### Phase 2: Backend - Auth Module
- [ ] Tạo AuthModule + AuthController + AuthService
- [ ] Setup Firebase Admin SDK
- [ ] Implement token verification

### Phase 3: Backend - API Endpoints
- [ ] POST /auth/register
- [ ] POST /auth/login
- [ ] POST /auth/google
- [ ] POST /auth/logout
- [ ] PUT /auth/password
- [ ] PUT /auth/profile
- [ ] GET /auth/me

### Phase 4: Frontend - Firebase SDK Setup
- [ ] Cài firebase SDK
- [ ] Setup Firebase config
- [ ] Tạo auth service

### Phase 5: Frontend - Auth UI Components
- [ ] LoginPage (Google + Email/Password)
- [ ] RegisterPage
- [ ] ProfilePage (update display_name, photo_url)
- [ ] UpdatePassword component
- [ ] AuthGuard (route protection)

### Phase 6: Integration & Testing
- [ ] Test all auth flows
- [ ] Test profile update
- [ ] Handle edge cases

---

## Dependencies

### Backend
- firebase-admin
- @nestjs/passport
- passport
- passport-jwt
- @nestjs/jwt
- bcrypt (for password hashing)

### Frontend
- firebase (client SDK)
- js-cookie (for cookie management)
- react-router-dom (for auth routes)
