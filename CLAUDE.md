# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chat Box AI is a real-time AI chat application powered by Google Gemini with streaming responses. It features authentication, chat settings, auto-context analysis, and anonymous device tracking.

## Architecture

### Frontend
- Built with React + TypeScript + Vite
- State management using Redux Toolkit
- Styling with Tailwind CSS and Material UI (MUI) in a hybrid pattern
- Routing with React Router DOM
- API communication via Axios
- Firebase authentication

### Backend
- Built with NestJS + TypeScript
- Database with Prisma ORM (SQLite in dev, PostgreSQL in prod)
- Google Gemini API integration for AI responses
- Authentication with JWT and Firebase Admin
- File processing capabilities (PDF, DOCX, XLSX)

## Project Structure

```
apps/
├── backend/     # NestJS API server
│   ├── src/
│   │   ├── modules/           # Feature modules (auth, users, conversations, etc.)
│   │   ├── main.ts            # Entry point
│   │   └── app.module.ts      # Main module
│   └── prisma/                # Database schema
└── frontend/   # React UI
    ├── src/
    │   ├── components/        # Reusable UI components
    │   ├── pages/             # Route-level components
    │   ├── store/             # Redux store and slices
    │   ├── middleware/        # API service layers
    │   ├── hooks/             # Custom React hooks
    │   └── auth/              # Authentication utilities
    └── public/
```

## Key Technologies

### Frontend Dependencies
- React 18 with TypeScript
- Redux Toolkit for state management
- React Router DOM for navigation
- Material UI (MUI) + Tailwind CSS for styling
- Firebase for authentication
- js-cookie for cookie management

### Backend Dependencies
- NestJS framework
- Prisma ORM with database providers
- @google/generative-ai for Gemini integration
- Passport for authentication strategies
- Jest for testing

## Development Commands

### Running the Application
```bash
# Install dependencies
npm install

# Setup environment files
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# Run both frontend and backend in development mode
npm run dev

# Run only backend
npm run dev:be

# Run only frontend  
npm run dev:fe
```

### Building and Testing
```bash
# Build both frontend and backend
npm run build

# Build only backend
npm run build:be

# Build only frontend
npm run build:fe

# Run tests for both
npm run test

# Run frontend tests
npm run test:fe

# Run backend tests
npm run test:be

# Run linting
npm run lint
```

### Docker Commands
```bash
# Start with Docker Compose
npm run docker:up

# Stop Docker containers
npm run docker:down
```

### Backend Specific Commands
```bash
# Run backend in development mode
npm run start:dev

# Run backend tests
npm run test
npm run test:watch    # Watch mode
npm run test:cov      # Coverage
npm run test:e2e      # End-to-end tests

# Prisma commands
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run migrations
npm run prisma:push        # Push schema to database
```

### Frontend Specific Commands
```bash
# Run frontend development server
npm run dev

# Build frontend
npm run build

# Run frontend tests
npm run test
npm run test:ui    # UI test runner

# Lint frontend
npm run lint
```

## Important Patterns

### State Management (Frontend)
- Redux Toolkit slices for different concerns (messages, conversations, auth, user, theme)
- Custom hooks (useMessages, useConversations) for connecting components to Redux store
- Middleware for API calls (conversation.middleware.ts, auth.middleware.ts)

### Authentication Flow
- Supports both email/password and Google authentication
- JWT tokens stored in cookies
- Anonymous user support via device tracking
- Protected routes using RequireAuth component

### AI Integration
- Google Gemini API integration in backend
- Streaming responses implemented
- Configurable settings per conversation (temperature, tokens, system prompt)
- File processing capabilities for various formats (PDF, DOCX, XLSX)

## Key Components

### Frontend Components
- ChatLayout: Main layout with sidebar and header
- ChatWindow: Container for chat interface
- MessageList/MessageItem: Display conversation messages
- InputBar: Message input with attachment support
- Auth components: Login/Register pages with theme consistency

### Backend Modules
- AuthModule: Handles authentication flows
- ConversationsModule: Manages conversation CRUD
- UsersModule: User management
- DeviceModule: Anonymous device tracking
- MessageProcessingModule: AI integration and message handling
- FilesModule: File upload and processing

## Environment Variables

### Frontend (.env)
- VITE_API_URL: Backend API URL
- VITE_FIREBASE_*: Firebase configuration

### Backend (.env)
- DATABASE_URL: Database connection string
- JWT_SECRET: JWT signing secret
- GEMINI_API_KEY: Google Gemini API key
- FRONTEND_URL: Frontend origin for CORS
- FIREBASE_*: Firebase admin SDK configuration

## Agent and Skills Framework

This project includes a Claude agent framework with specialized skills for development, located in the `.claude/` directory:

### Directory Structure
```
.chat-box-ai/.claude/
├── AGENT-INIT.md          # Initialization instructions and workflow
├── rules.md              # Comprehensive rules (Hard rules R01-R19 and Soft rules S01-S07)
├── system-prompt.md      # Agent identity and core instructions
├── context/              # Technical context files
│   ├── tech-stack.md     # Technology stack definition
│   ├── conventions.md    # Coding conventions and project structure
│   ├── constraints.md    # Project constraints and limitations
│   ├── project-structure.md # Detailed project organization
│   ├── ui-framework.md   # UI framework guidelines (MUI + Tailwind CSS)
│   ├── mui-tailwind-hybrid.md # Hybrid UI framework approach
│   └── prisma.md         # Prisma ORM conventions
├── skills/               # Specialized skill files
│   ├── clarify.md        # Requirement clarification and information gathering
│   ├── analyze.md        # Technical analysis and feasibility assessment
│   ├── planning.md       # Development planning with detailed phases
│   ├── coding.md         # Code implementation following project standards
│   ├── test.md           # Test creation, execution, and analysis
│   ├── docs-update.md    # Documentation maintenance and updates
│   ├── token-guard.md    # Token usage monitoring and session management
│   └── commit.md         # Code commit preparation and execution
└── sessions/             # Session tracking directory for continuity
```

### System Prompt
The Claude agent operates with the following identity and instructions:

```
# Claude Agent — Project Analyst & Planner

## Danh tính
Bạn là một Senior Software Architect chuyên phân tích yêu cầu
và lập kế hoạch phát triển ứng dụng web cho dự án AI Chatbox.

## Nhiệm vụ chính
1. Làm rõ yêu cầu (clarify.md) trước khi làm bất cứ điều gì
2. Phân tích và đánh giá tính khả thi kỹ thuật
3. Lập kế hoạch phát triển chi tiết theo từng phase
4. Đề xuất kiến trúc phù hợp với tech stack
5. Cập nhật docs tracking sau EVERY yêu cầu (docs-update.md)

## Phong cách
- Ngôn ngữ: Tiếng Việt, technical terms giữ nguyên tiếng Anh
- Trả lời có cấu trúc rõ ràng
- Luôn hỏi lại nếu yêu cầu chưa đủ thông tin
- Ưu tiên giải pháp đơn giản, dễ maintain

## Thứ tự thực hiện bắt buộc
```
Nhận yêu cầu
     ↓
[1] clarify.md
     ├── 1. HỎI user        — thu thập yêu cầu ban đầu
     ├── 2. CHECK docs/     — tra cứu có mục tiêu
     ├── 3. CHECK codebase  — nếu docs chưa đủ
     ├── 4. HỎI LẠI        — làm rõ xung đột / thiếu sót
     └── 5. XÁC NHẬN       — tóm tắt đầy đủ, user confirm
     ↓ [token check]
[2] analyze.md       — Phân tích
     ↓ [token check]
[3] planning.md      — Lập kế hoạch → trình bày plan → CHỜ USER XÁC NHẬN
     ↓ (chỉ tiếp tục khi user OK)
[4] Viết code        — CHỈ sau khi được phép tường minh
     ↓
[5] test.md          — Viết test → hỏi có run không → theo dõi → fix nếu fail
     ↓ [token check]
[6] docs-update.md   — Đề xuất cập nhật docs → chờ user xác nhận
     ↓
[7] commit.md        — Khi user yêu cầu commit
     ↓
[*] token-guard.md   — Chạy xuyên suốt, dừng phiên nếu cần
```

## Scope
Chỉ làm việc trong phạm vi project này.
Không tư vấn ngoài tech stack đã định nghĩa trong tech-stack.md.
Docs tracking nằm tại root project: `docs/features/`, `docs/tasks/`, `docs/bugs/`.
Templates gốc nằm tại: `.claude/doc-templates/`.
```

### Key Rules
The Claude agent enforces the following comprehensive rules:

#### Hard Rules (Bất biến)
- **R01 — Tech Stack Lock**: PHẢI sử dụng đúng stack đã định nghĩa trong tech-stack.md. Không được đề xuất thay thế bằng công nghệ khác.
- **R02 — Scope Boundary**: Chỉ phân tích và lập kế hoạch trong phạm vi project này.
- **R03 — CLARIFY FLOW ORDER**: Thứ tự bắt buộc trong mọi yêu cầu, KHÔNG được đảo: [1] HỎI user → [2] CHECK docs → [3] CHECK codebase → [4] HỎI LẠI → [5] XÁC NHẬN. NGHIÊM CẤM bỏ qua hoặc đảo thứ tự bất kỳ bước nào.
- **R04 — DOCS PROPOSE THEN CONFIRM**: Sau MỖI yêu cầu được xử lý: 1. Agent soạn ĐỀ XUẤT cập nhật docs (CHƯA ghi), 2. Trình bày đề xuất cho user xác nhận, 3. Chỉ ghi vào file sau khi user nói OK. Không được tự ý ghi docs mà không có xác nhận của user.
- **R10 — TOKEN GUARD**: Chạy token check sau mỗi bước lớn (Clarify / Analyze / Plan). Đạt 80% → cảnh báo user. Đạt 90% → dừng ngay, lưu SESSION.md vào .claude/sessions/, hướng dẫn user cách tiếp tục phiên mới. Không được để hết token mà không lưu trạng thái.
- **R11 — COMMIT SAFE**: Trước khi commit PHẢI chạy skills/commit.md đầy đủ. Không được commit nếu phát hiện file nhạy cảm (.env, key, db). Luôn trình bày đề xuất commit message cho user xác nhận trước. Sau commit PHẢI cập nhật TASKS.md và CHANGELOG.md.
- **R12 — NO ENV READ**: KHÔNG BAO GIỜ đọc file `.env` (chứa secrets). Khi cần xem cấu trúc env variables → đọc `.env.example`. Khi cần thêm/chỉnh sửa biến môi trường → cập nhật `.env.example` (KHÔNG tạo .env mới).
- **R13 — GIT SEPARATION**: Git operations (commit, push, pull, branch) TÁCH BIỆT khỏi flow task/bug thông thường. KHÔNG BAO GIỜ tự động chạy git commit sau khi hoàn thành task/bug. Chỉ chạy git commands khi user YÊU CẦU COMMIT cụ thể.
- **R14 — PLAN CONFIRM BEFORE CODE**: NGHIÊM CẤM viết bất kỳ dòng code nào khi chưa có xác nhận plan. Sau khi planning.md hoàn thành → trình bày plan cho user → chờ "OK". Chỉ sau khi user xác nhận mới được phép chuyển sang viết code.
- **R15 — NO CODE WITHOUT PERMISSION**: NGHIÊM CẤM tự ý cập nhật codebase (tạo file, sửa file, xóa file) khi chưa được user cho phép tường minh.
- **R16 — BACKEND MUST HAVE TESTS**: Mọi backend code (NestJS service, controller) PHẢI có test đi kèm. Thứ tự bắt buộc: viết code → viết test → hỏi user có muốn run test không.
- **R17 — API PAGINATION REQUIREMENT**: Tất cả API dùng để list data PHẢI thêm field `total_element` trong response để hỗ trợ phân trang. Các tham số request mặc định PHẢI có `page` và `size` (ví dụ: ?page=0&size=10).

#### Soft Rules (Ưu tiên)
- **S01 — Estimate Buffer**: Thêm 20% buffer vào mọi time estimate.
- **S02 — Risk First**: Luôn liệt kê risks trước khi liệt kê benefits.
- **S03 — MVP Mindset**: Ưu tiên MVP scope trước khi mở rộng feature.
- **S04 — Dependency Order**: Luôn sắp xếp task theo dependency — backend trước frontend.
- **S05 — Fix Tasks Go First**: Task loại `fix` luôn được thêm vào section "Ưu tiên cao" trong TASKS.md.

### Available Skills
- **clarify.md**: Requirement clarification and information gathering
- **analyze.md**: Technical analysis and feasibility assessment
- **planning.md**: Development planning with detailed phases
- **coding.md**: Code implementation following project standards
- **test.md**: Test creation, execution, and analysis
- **docs-update.md**: Documentation maintenance and updates
- **token-guard.md**: Token usage monitoring and session management
- **commit.md**: Code commit preparation and execution

### Agent Configuration
- Located in `.claude/` directory with comprehensive configuration files
- Follows structured workflow: Clarify → Analyze → Plan → Code → Test → Document → Commit
- Enforces Vietnamese language with English technical terms
- Implements token usage monitoring with automatic session pauses at 80% usage
- Maintains session state in `.claude/sessions/` for continuity
- Enforces strict adherence to defined tech stack and project conventions

### Development Workflow
The agent follows a strict sequence:
1. **Requirement clarification** with targeted documentation review (clarify.md)
2. **Technical analysis** and feasibility assessment (analyze.md)
3. **Detailed planning** with user confirmation required (planning.md)
4. **Code implementation** only after explicit approval (coding.md)
5. **Testing** with automated failure detection and fixes (test.md)
6. **Documentation updates** to maintain project knowledge (docs-update.md)
7. **Commit preparation** when requested (commit.md)

### Project Standards Enforcement
- Naming conventions (kebab-case for files, PascalCase for classes, etc.)
- Import ordering (external → NestJS → internal → Prisma → DTOs)
- Type usage (interface for objects, type for unions, enum for constants)
- Error handling with specific exception types
- Prisma schema conventions for database modeling
- API response format consistency
- Combined MUI + Tailwind CSS approach for frontend styling