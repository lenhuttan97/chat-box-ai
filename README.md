# Chat Box AI

AI Chat Application với Gemini Streaming, Firebase Authentication và Chat Settings.

## Tính năng

### FT-001: Chat Gemini Streaming
- Chat với AI sử dụng Google Gemini API
- Streaming real-time với SSE (Server-Sent Events)
- Hỗ trợ markdown trong tin nhắn
- Lưu lịch sử chat vào database (khi đăng nhập)

### FT-002: Authentication (Firebase)
- Đăng nhập bằng Google
- Đăng nhập bằng Email/Password
- Quản lý phiên đăng nhập

### FT-003: Chat Settings
- Cài đặt riêng cho từng đoạn chat:
  - Tên conversation
  - AI Role / Identity (System Prompt)
  - Context / Background
  - Temperature (0-1)
  - Response Length (Max Tokens)

### FT-004: Auto Chat Settings
- Tự động phân tích và bổ sung context sau tin nhắn đầu
- Tự động cập nhật sau mỗi 10 lượt tin nhắn
- Bổ sung chứ không thay thế cài đặt thủ công

---

## Công nghệ sử dụng

### Backend
- **NestJS** - Node.js framework
- **Prisma** - ORM với SQLite/PostgreSQL
- **Google Gemini API** - AI Chat

### Frontend
- **React** + **Vite**
- **Material-UI (MUI)** - UI Components
- **Redux Thunk** - State Management
- **Firebase** - Authentication

### DevOps
- **Docker** - Containerization
- **Jest** - Backend Testing
- **Vitest** - Frontend Testing

---

## Cài đặt

### Yêu cầu
- Node.js 18+
- pnpm (khuyến nghị)
- Docker (optional)

### Thiết lập môi trường

1. **Clone project**
2. **Tạo file .env:**

```bash
# Backend
cp apps/backend/.env.example apps/backend/.env
# Điền GEMINI_API_KEY vào .env

# Frontend  
cp apps/frontend/.env.example apps/frontend/.env
# Điền Firebase config vào .env
```

3. **Cài đặt dependencies:**

```bash
pnpm install
```

4. **Khởi động Development Servers:**

```bash
# Backend
cd apps/backend
pnpm run start:dev

# Frontend (terminal khác)
cd apps/frontend
pnpm run dev
```

5. **Mở trình duyệt:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### Docker

```bash
docker-compose up --build
```

---

## Cấu trúc thư mục

```
chat-box-ai/
├── apps/
│   ├── backend/          # NestJS API
│   └── frontend/          # React + Vite
├── docs/                  # Tài liệu features
├── docker-compose.yml
└── package.json
```

---

## API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST | /api/v1/chat | Gửi tin nhắn (SSE streaming) |
| GET | /api/v1/conversations | Danh sách conversations |
| GET | /api/v1/conversations/:id | Chi tiết conversation |
| PATCH | /api/v1/conversations/:id | Cập nhật settings |
| DELETE | /api/v1/conversations/:id | Xóa conversation |

---

## Scripts

```bash
# Development
pnpm dev:be          # Backend
pnpm dev:fe          # Frontend

# Build
pnpm build

# Testing
pnpm test:be         # Backend tests
pnpm test:fe         # Frontend tests
```
