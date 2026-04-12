# Tech Stack — AI Chatbox Project

## Tổ chức project
- Kiểu:       Monorepo (pnpm workspaces)
- Backend:    apps/backend/
- Frontend:   apps/frontend/
- Shared:     packages/shared/ (optional)

## Backend
- Runtime:    Node.js (v20 LTS)
- Framework:  NestJS (v10+)
- ORM:        Prisma (v5+)
- Database:   SQLite (dev) / PostgreSQL (prod-ready)
- Language:   TypeScript

## Frontend
- Framework:  ReactJS (v18+)
- Bundler:    Vite
- State:      Redux Toolkit
- UI:         MUI (Material UI) + Tailwind CSS (kết hợp: MUI là xương sống, Tailwind là da thịt)
- Language:   TypeScript

## AI Integration
- Provider:   Google Gemini API hoặc OpenAI API
- Protocol:   Streaming (SSE / WebSocket)

## DevOps (Scope hiện tại)
- Package:    pnpm (workspaces)

## Kiến trúc tổng thể
```
React (Redux) ←→ NestJS REST/SSE ←→ Prisma ←→ SQLite/PostgreSQL
                        ↓
                  AI Provider API
                (Gemini / OpenAI)
```
