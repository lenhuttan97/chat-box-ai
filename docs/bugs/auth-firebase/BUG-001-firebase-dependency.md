# BUG-FT002-01 — Firebase Dependency in Frontend Auth

- **Bug ID:** BUG-FT002-01
- **Feature:** FT-002 (Authentication)
- **Status:** ⏳ pending

## Problem

Khi không cung cấp Firebase config, user **không thể sử dụng bất kỳ tính năng login nào**:
- Login với email/password → Fail
- Register → Fail
- Login với Google → Fail

## Root Cause

### Frontend (auth.slice.ts)

Frontend hoàn toàn phụ thuộc vào Firebase SDK:

```typescript
// loginWithEmail → FirebaseAuthService.signInWithEmail()
// registerWithEmail → FirebaseAuthService.signUpWithEmail()
// loginWithGoogle → FirebaseAuthService.signInWithGoogle()
```

### Backend (auth.controller.ts)

Backend có email/password login **độc lập** với Firebase:

```typescript
POST /auth/login    // bcrypt compare - KHÔNG cần Firebase
POST /auth/register // bcrypt hash - KHÔNG cần Firebase
POST /auth/google   // CẦN Firebase (throws error nếu không config)
```

## Flow hiện tại

```
User login email/password
    ↓
Frontend gọi FirebaseAuthService.signInWithEmail()
    ↓
Firebase SDK check config
    ↓
❌ Fail - Firebase not configured
```

## Flow mong muốn

```
User login email/password
    ↓
Frontend gọi /api/auth/login (backend)
    ↓
Backend bcrypt compare
    ↓
✅ Success - Không cần Firebase
```

## Files Affected

- `apps/frontend/src/store/slices/auth.slice.ts`
- `apps/frontend/src/middleware/auth.middleware.ts` (có API functions nhưng không được sử dụng)
- `apps/backend/src/modules/auth/auth.service.ts` (firebaseLogin method)

## Fix Required

1. **Tách biệt Firebase và Backend auth:**
   - Email/Password: Gọi `/api/auth/login`, `/api/auth/register` trực tiếp
   - Google Login: Gọi Firebase SDK → Backend verify token

2. **Hoặc disable Firebase-dependent features khi Firebase không config**

3. **Backend: User Link khi đăng nhập Firebase với email đã tồn tại:**
   ```typescript
   // Trong firebaseLogin() - auth.service.ts
   // 1. Tìm user bằng email trước
   let user = await this.prisma.user.findUnique({ where: { email: decodedToken.email } })
   
   // 2. Nếu user tồn tại → link firebaseUid
   if (user) {
     return this.prisma.user.update({
       where: { id: user.id },
       data: { 
         firebaseUid: firebaseUid,
         photoUrl: decodedToken.picture || user.photoUrl, // update photo nếu có
         provider: 'google' // update provider
       }
     })
   }
   
   // 3. Nếu không → tạo user mới (như hiện tại)
   ```

## Acceptance Criteria

- [ ] Email/Password login hoạt động **không cần Firebase**
- [ ] Email/Password register hoạt động **không cần Firebase**
- [ ] Google login chỉ hoạt động khi Firebase được config
- [ ] Hiển thị message rõ ràng khi Firebase không available
- [ ] **User link**: Khi user đã có tài khoản với email và đăng nhập bằng Firebase cùng email → link `firebaseUid` vào user hiện có (không tạo user mới)
