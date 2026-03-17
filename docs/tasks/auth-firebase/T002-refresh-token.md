# T002 — Refresh Token

- **Feature:** FT-002
- **Task ID:** T002

## Phases

| Phase | Description | Details | Status |
|-------|-------------|---------|--------|
| P1 | JWT Config | Set access token 60m, refresh token 1d | ✅ done |
| P2 | Database Schema | Add refreshToken field to User model | ✅ done |
| P3 | Backend Refresh Endpoint | POST /auth/refresh-token | ✅ done |
| P4 | Frontend Auto-refresh | Intercept 401, auto-refresh token | ✅ done |

## Status

**✅ done**
