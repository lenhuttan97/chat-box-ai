# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

---

## MANDATORY RULES — ALWAYS FOLLOW, NO EXCEPTIONS

These rules apply to EVERY task in this project, regardless of what the user asks:

1. **ALWAYS read the relevant skill file** before starting any task. Do not skip this step even for simple tasks.

2. **ALWAYS read existing code** before writing new code. Use Read/Grep/Glob to understand current implementation first.

3. **NEVER stop mid-way on multi-phase tasks.** If the prompt has numbered steps (1. 2. 3. 4.), complete ALL phases in sequence before finishing.

4. **ALWAYS respond in Vietnamese** (tiếng Việt), unless the user explicitly writes in English.

5. **ALWAYS follow coding conventions** defined in `coding-convention` when writing or modifying code.

---

## Skill Routing

Xác định loại task → đọc skill tương ứng trước khi làm.

### Phân tích & Lập kế hoạch
| Task | Skill |
|---|---|
| Yêu cầu mơ hồ, chưa rõ scope | `requirement-clarification` |
| Kiến trúc, thiết kế hệ thống | `architecture-review` |
| Lập kế hoạch implement, bước thực hiện | `implementation-planner` |
| Sprint, backlog, quản lý dự án | `project-management-suite` |
| Soạn tài liệu, spec, SRS, BRD | `documentation-suite` |
| Giao tiếp khách hàng, report, email | `client-relations` |
| Thay đổi yêu cầu giữa chừng | `change-request` |
| Bug production khẩn cấp | `hotfix-flow` |

### Phát triển & Chất lượng
| Task | Skill |
|---|---|
| Viết code, implement feature mới | `coding-convention` |
| Review chất lượng code | `code-quality-review` |
| Debug, fix lỗi, crash | `debug-and-fix` |
| Viết unit test, coverage | `write-tests` |
| E2E test, Playwright, Cypress | `e2e-testing` |
| Refactor, tối ưu, simplify | `simplify` |
| Tích hợp REST/GraphQL API | `api-integration` |
| SQL, ORM, database migration | `database-query` |
| CSS, Tailwind, UI component | `frontend-styling` |
| Accessibility, WCAG, a11y | `accessibility-check` |
| i18n, localization, translation | `localization-helper` |
| Anthropic SDK, Claude API | `claude-api` |

### Vận hành & Bảo mật
| Task | Skill |
|---|---|
| Deploy, CI/CD, Docker | `deploy-guide` |
| Security audit, vulnerability | `security-check` |
| Dependency, package upgrade | `dependency-manager` |
| License compliance | `license-checker` |
| Git branch, commit, PR, merge | `git-workflow` |
| Cấu hình Claude Code | `update-config` |

---

## Project Overview

Chat Box AI là ứng dụng AI chat real-time sử dụng Google Gemini với streaming responses. Tính năng: authentication, chat settings, auto-context analysis, anonymous device tracking.

## Architecture

### Frontend
- React + TypeScript + Vite
- State management: Redux Toolkit
- Styling: Tailwind CSS + Material UI (MUI) — hybrid pattern
- Routing: React Router DOM
- API: Axios
- Auth: Firebase + enhanced backend integration

### Backend
- NestJS + TypeScript
- Database: Prisma ORM (SQLite dev / PostgreSQL prod)
- AI: Google Gemini API với streaming
- Auth: JWT + Firebase Admin
- File processing: PDF, DOCX, XLSX

## Project Structure

```
apps/
├── backend/     # NestJS API server
│   ├── src/
│   │   ├── modules/           # Feature modules (auth, users, conversations, etc.)
│   │   ├── main.ts
│   │   └── app.module.ts
│   ├── .env.example
│   └── prisma/                # Database schema
└── frontend/   # React UI
    ├── src/
    │   ├── components/        # Reusable UI components
    │   │   ├── layout/        # Header, etc.
    │   │   └── settings/      # Settings page components
    │   ├── pages/             # Route-level components
    │   ├── store/             # Redux store and slices
    │   ├── middleware/        # API service layers
    │   ├── hooks/             # Custom React hooks
    │   ├── services/          # API service implementations
    │   └── auth/              # Authentication utilities
    └── public/
```

## Important Patterns

### State Management (Frontend)
- Redux Toolkit slices: messages, conversations, auth, user, theme
- Custom hooks: `useMessages`, `useConversations`, `useUser`
- Middleware cho API calls: `conversation.middleware.ts`, `auth.middleware.ts`

### Authentication Flow
- Email/password + Google OAuth
- JWT tokens trong cookies + enhanced backend integration
- Anonymous user support via device tracking
- Protected routes: `RequireAuth` component

### AI Integration
- Google Gemini API ở backend với streaming responses
- Configurable per conversation: temperature, max tokens, system prompt
- File processing: PDF, DOCX, XLSX

## Key Components

### Frontend
- `ChatLayout`: main layout với sidebar + header
- `ChatWindow`: container chat với title editing
- `MessageList/MessageItem`: hiển thị messages
- `InputBar`: message input với attachment support
- `SettingsPage`: user preferences
- `ConversationList`: với active state indicators
- `Header`: user photo + navigation

### Backend Modules
- `AuthModule`: authentication với JWT + Firebase
- `ConversationsModule`: CRUD conversations
- `UsersModule`: user management
- `DeviceModule`: anonymous device tracking
- `MessageProcessingModule`: AI integration
- `FilesModule`: file upload + processing

## Development Commands

```bash
# Install & setup
npm install
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# Run development
npm run dev          # cả hai
npm run dev:be       # chỉ backend
npm run dev:fe       # chỉ frontend

# Build & Test
npm run build
npm run test
npm run lint

# Docker
npm run docker:up
npm run docker:down
```

### Prisma
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:push
```

## Environment Variables

### Frontend (.env)
- `VITE_API_URL`: Backend API URL
- `VITE_FIREBASE_*`: Firebase configuration

### Backend (.env)
- `DATABASE_URL`: Database connection string
- `JWT_SECRET`: JWT signing secret
- `GEMINI_API_KEY`: Google Gemini API key
- `FRONTEND_URL`: Frontend origin for CORS
- `FIREBASE_*`: Firebase Admin SDK configuration
