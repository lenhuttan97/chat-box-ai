# Project Structure Reference

> File này là nguồn tham chiếu cấu trúc thư mục chuẩn.
> Agent PHẢI tuân thủ khi tạo file mới hoặc scaffold module.

---

## Root Monorepo

```
ai-chatbox/
├── apps/
│   ├── backend/
│   └── frontend/
├── packages/
│   └── shared/                  ← optional, tạo khi cần
├── docs/                        ← docs tracking (tạo từ .agent/doc-templates/)
├── .agent/
├── .opencode/
├── AGENTS.md
├── .env.example
├── .gitignore
├── pnpm-workspace.yaml
└── package.json
```

---

## Backend — apps/backend/

```
apps/backend/
├── src/
│   │
│   ├── main.ts                          ← Bootstrap NestJS app
│   ├── app.module.ts                    ← Import tất cả feature modules
│   │
│   ├── modules/                         ← Mỗi feature = 1 thư mục
│   │   │
│   │   ├── users/                       ← User module (1 module - nhiều models)
│   │   │   ├── models/                  ← Prisma entities
│   │   │   │   └── user.model.ts
│   │   │   ├── repository/              ← Kết nối Prisma, thao tác DB
│   │   │   │   └── users.repository.ts
│   │   │   ├── users.service.ts         ← Business logic
│   │   │   ├── users.controller.ts       ← HTTP handlers
│   │   │   ├── users.module.ts           ← NestJS module
│   │   │   └── dto/
│   │   │       ├── request/              ← CreateDto, UpdateDto
│   │   │       └── response/            ← Response DTOs
│   │   │
│   │   └── conversations/               ← Conversation + Message module
│   │       ├── models/                  ← Prisma entities
│   │       │   ├── conversation.model.ts
│   │       │   └── message.model.ts
│   │       ├── repository/
│   │       │   └── conversations.repository.ts
│   │       ├── conversations.service.ts
│   │       ├── conversations.controller.ts
│   │       ├── conversations.module.ts
│   │       └── dto/
│   │           ├── request/
│   │           └── response/
│   │
│   ├── common/                          ← Dùng chung toàn app (≥ 2 module)
│   │   ├── decorators/
│   │   │   └── current-user.decorator.ts     ← @CurrentUser()
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts      ← Global error format
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   ├── interceptors/
│   │   │   └── response.interceptor.ts       ← Wrap { data, message, statusCode }
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   └── types/
│   │       └── express.d.ts                  ← Extend Express Request type
│   │
│   └── config/                          ← Cấu hình app, không chứa logic
│       ├── app.config.ts
│       ├── database.config.ts
│       └── jwt.config.ts
│
├── prisma/
│   ├── schema.prisma                    ← Source of truth cho DB schema
│   ├── seed.ts                          ← Dữ liệu mẫu
│   └── migrations/                      ← Auto-generated, không sửa tay
│
├── test/                                ← E2E tests (Jest + Supertest)
│   ├── auth.e2e-spec.ts
│   ├── chat.e2e-spec.ts
│   └── jest-e2e.json
│
├── .env                                 ← Không commit
├── .env.example                         ← Commit, không có giá trị thật
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
├── jest.config.ts
└── package.json
```

### Quy tắc đặt file backend

| Loại file | Vị trí | Ví dụ |
|-----------|--------|-------|
| Module | `modules/[name]/[name].module.ts` | `users.module.ts` |
| Controller | `modules/[name]/[name].controller.ts` | `users.controller.ts` |
| Service | `modules/[name]/[name].service.ts` | `users.service.ts` |
| Repository | `modules/[name]/repository/[name].repository.ts` | `users.repository.ts` |
| Models | `modules/[name]/models/[name].model.ts` | `users/user.model.ts` |
| DTO request | `modules/[name]/dto/request/[action]-[name].dto.ts` | `create-user.dto.ts` |
| DTO response | `modules/[name]/dto/response/[name]-response.dto.ts` | `user-response.dto.ts` |
| Unit test | `test/[name]/[name].spec.ts` | `test/users/users.service.spec.ts` |
| E2E test | `test/[name].e2e-spec.ts` | `test/users/users.e2e-spec.ts` |
| Guard/Filter/Pipe global | `common/[type]/` | `common/guards/` |
| Guard/Filter scope module | trong thư mục module | `users/users.guard.ts` |

---

## Frontend — apps/frontend/

```
apps/frontend/
├── src/
│   │
│   ├── main.tsx                         ← ReactDOM.createRoot + Provider
│   ├── App.tsx                          ← Router setup + AppLayout
│   │
│   ├── pages/                           ← 1 file = 1 route
│   │   ├── ChatPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── components/
│   │   │
│   │   ├── common/                      ← Atom/Molecule, tái sử dụng toàn app
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   └── Button.types.ts      ← Props interface
│   │   │   ├── Input/
│   │   │   │   │   ├── Input.tsx
│   │   │   │   │   └── Input.types.ts
│   │   │   │   ├── Spinner/
│   │   │   │   │   └── Spinner.tsx
│   │   │   │   └── Modal/
│   │   │   │       ├── Modal.tsx
│   │   │   │       └── Modal.types.ts
│   │   │
│   │   ├── layout/                      ← Skeleton của app
│   │   │   ├── AppLayout.tsx            ← Sidebar + main content
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   │
│   │   └── chat/                        ← Feature-specific components
│   │       ├── ChatWindow.tsx           ← Container chính
│   │       ├── MessageList.tsx          ← Scroll + render messages
│   │       ├── MessageItem.tsx           ← 1 bubble message
│   │       ├── MessageItem.types.ts
│   │       ├── InputBar.tsx              ← Text input + send button
│   │       └── ConversationList.tsx      ← Danh sách hội thoại ở sidebar
│   │
│   ├── store/                           ← Redux Toolkit
│   │   ├── index.ts                     ← configureStore + exports all
│   │   │
│   │   └── slices/
│   │       ├── conversation.slice.ts      ← conversations[], currentConversation
│   │       └── message.slice.ts          ← messages[], streaming
│   │
│   ├── middleware/                      ← API calls (thay thế services/)
│   │   ├── conversation.service.ts       ← getConversations(), getConversation(), delete()
│   │   └── message.service.ts            ← sendMessageWithStream()
│   │
│   ├── hooks/                           ← Custom hooks, export từ store/index
│   │   ├── useConversations.ts          ← Wrap conversation slice actions
│   │   └── useMessages.ts                ← Wrap message slice + streaming
│   │
│   ├── types/                           ← TypeScript interfaces/types
│   │   ├── auth.types.ts                ← User, LoginRequest, AuthResponse
│   │   ├── chat.types.ts                ← Message, Conversation, Role
│   │   └── api.types.ts                 ← ApiResponse<T>, ApiError
│   │
│   ├── utils/                           ← Pure functions, không có side effect
│   │   ├── format.ts                    ← formatDate, truncateText...
│   │   └── storage.ts                   ← localStorage helpers (token)
│   │
│   └── styles/
│       └── index.css                    ← @tailwind base/components/utilities
│
├── public/
│   └── favicon.ico
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.app.json
└── package.json
```

### Import convention (quan trọng)
```typescript
// ✅ Import từ một chỗ
import { store, useConversations, useMessages, fetchConversations, setMessages } from '@/store'

// ❌ Không import trực tiếp từ slices/ hoặc hooks/
import { useConversations } from '@/store/hooks/useConversations'  // KHÔNG ĐƯỢC
```

### Quy tắc đặt file frontend

| Loại file | Vị trí | Ghi chú |
|-----------|--------|---------|
| Route component | `pages/` | Chỉ compose, không viết UI trực tiếp |
| Component tái sử dụng | `components/common/[Name]/` | Kèm `.types.ts` nếu có props |
| Component theo feature | `components/[feature]/` | Chỉ dùng trong feature đó |
| Redux slice | `store/slices/[name].slice.ts` | camelCase + Slice suffix |
| API call | `middleware/[name].service.ts` | Đặt trong middleware/ |
| Custom hook | `hooks/use[Name].ts` | Export từ store/index.ts |
| TypeScript types | `types/[name].types.ts` | Interface/type thuần, không import React |
| Helper function | `utils/[name].ts` | Pure function, không side effect |

### Frontend Import Rule
```typescript
// ✅ ĐÚNG - Import từ một chỗ
import { store, RootState, AppDispatch, useConversations, useMessages, fetchConversations, setMessages } from '@/store'

// ❌ SAI - Import trực tiếp từ slices hoặc hooks
import { useConversations } from '@/store/hooks/useConversations'
import { fetchConversations } from '@/store/slices/conversation.slice'
```

---

## Shared Package — packages/shared/

```
packages/shared/
├── src/
│   ├── types/
│   │   ├── chat.types.ts        ← Message, Conversation (dùng ở cả BE + FE)
│   │   ├── auth.types.ts        ← User, TokenPayload
│   │   └── api.types.ts         ← ApiResponse<T>
│   └── index.ts                 ← Re-export tất cả
├── tsconfig.json
└── package.json                 ← name: "@ai-chatbox/shared"
```

> Tạo package này khi có type nào được dùng ở cả backend lẫn frontend.
> Không cần tạo ngay từ đầu nếu chưa cần thiết.

---

## Workspace Config Files

### pnpm-workspace.yaml
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### package.json (root)
```json
{
  "name": "ai-chatbox",
  "private": true,
  "scripts": {
    "dev:be":   "pnpm --filter backend dev",
    "dev:fe":   "pnpm --filter frontend dev",
    "dev":      "concurrently \"pnpm dev:be\" \"pnpm dev:fe\"",
    "build:be": "pnpm --filter backend build",
    "build:fe": "pnpm --filter frontend build",
    "test:be":  "pnpm --filter backend test",
    "test:fe":  "pnpm --filter frontend test",
    "lint":     "pnpm -r lint"
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
```

### .gitignore (root)
```
node_modules/
dist/
.env
*.db
*.sqlite
.DS_Store
```

### .env.example (root — commit file này)
```
# Backend
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-here"
JWT_EXPIRES_IN="7d"

# AI Provider
GEMINI_API_KEY=""
OPENAI_API_KEY=""
AI_PROVIDER="gemini"   # gemini | openai

# App
PORT=3000
NODE_ENV="development"
```
