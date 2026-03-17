# FT-002 UI Tasks — Auth Firebase

## Phase 0: Setup & Config

- [x] Install Firebase SDK: `firebase` (✅ done)
- [x] Create Firebase config file (✅ done - firebaseService.ts)
- [x] Initialize Firebase app (✅ done)

---

## Phase 1: Firebase Setup

### Files

| File | Description |
|------|-------------|
| `src/services/firebaseService.ts` | Firebase initialization (✅ done) |
| `src/auth/RequireAuth.tsx` | Auth guard (✅ done) |

### Tasks

- [x] Phase 1.1: Setup Firebase config (apiKey, authDomain, projectId) (✅ done)
- [x] Phase 1.2: Initialize Firebase app (✅ done)
- [x] Phase 1.3: Create auth.service.ts → dùng firebaseService.ts (✅ done)

---

## Phase 2: Redux Store

### Files

| File | Description |
|------|-------------|
| `src/store/slices/auth.slice.ts` | Auth state + thunks (✅ done) |

### Tasks

- [x] Phase 2.1: Create authSlice với redux-thunk (✅ done)
- [x] Phase 2.2: Login/Register thunk actions (✅ done)
- [x] Phase 2.3: Logout thunk action (✅ done)
- [x] Phase 2.4: Google login thunk (✅ done)

---

## Phase 3: Auth Context

### Files

| File | Description |
|------|-------------|
| `src/hooks/useAuth.ts` | Auth hook (✅ done) |
| `src/auth/RequireAuth.tsx` | Protected route (✅ done) |

### Tasks

- [x] Phase 3.1: Create AuthContext với Firebase listener → dùng useAuth hook (✅ done)
- [x] Phase 3.2: ProtectedRoute component (✅ done)
- [ ] Phase 3.3: PublicRoute component

---

## Phase 4: Auth Pages

### Files

| File | Description |
|------|-------------|
| `src/pages/LoginPage.tsx` | Login page (✅ done) |
| `src/pages/RegisterPage.tsx` | Register page (✅ done) |
| `src/pages/UpdatePasswordPage.tsx` | Update password (✅ done) |
| `src/pages/ProfilePage.tsx` | Profile page (✅ done) |

### Tasks

- [x] Phase 4.1: LoginPage layout (✅ done)
- [x] Phase 4.2: RegisterPage layout (✅ done)

---

## Phase 5: Auth Components

### Files

| File | Description |
|------|-------------|
| `src/components/auth/AuthCard.tsx` | Card wrapper |
| `src/components/auth/EmailField.tsx` | Email input |
| `src/components/auth/PasswordField.tsx` | Password input |
| `src/components/auth/AuthButton.tsx` | Submit button |
| `src/components/auth/SocialLogin.tsx` | Google/GitHub |

### Tasks

- [ ] Phase 5.1: AuthCard (MUI Card)
- [ ] Phase 5.2: EmailField + validation
- [ ] Phase 5.3: PasswordField + visibility toggle
- [ ] Phase 5.4: AuthButton (loading state)
- [ ] Phase 5.5: SocialLogin buttons

---

## Phase 6: Integration

### Tasks

- [ ] Phase 6.1: Connect forms → Redux → Firebase
- [ ] Phase 6.2: Error handling (MUI Alert/Snackbar)
- [ ] Phase 6.3: Update AppRouter với Protected/Public routes

---

## Layer Order (Bottom to Top)

```
┌─────────────────────────────────────────┐
│  Phase 4-5: Auth Pages + Components      │
├─────────────────────────────────────────┤
│  Phase 3: Auth Context                  │
├─────────────────────────────────────────┤
│  Phase 2: Redux Store                    │
├─────────────────────────────────────────┤
│  Phase 1: Firebase + Auth Service       │
└─────────────────────────────────────────┘
```

---

## Dependencies

```bash
npm install firebase
```
