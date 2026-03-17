# Phase 0: Project Setup

## Overview

Thiết lập toàn bộ môi trường phát triển cho project bao gồm: Backend, Frontend, Testing, Docker.

---

## Phase 0.1: Project Structure

### Tasks

- [ ] Tạo cấu trúc monorepo:
  ```
  chat-box-ai/
  ├── apps/
  │   ├── backend/
  │   └── frontend/
  ├── packages/
  │   └── shared/          (optional)
  ├── .env
  ├── .env.example
  ├── docker-compose.yml
  ├── package.json        (root workspace)
  ├── pnpm-workspace.yaml
  ├── turbo.json          (optional - turbo repo)
  └── tsconfig.json       (root)
  ```
- [ ] Tạo `pnpm-workspace.yaml`
- [ ] Tạo root `package.json` với scripts
- [ ] Tạo root `tsconfig.json`

---

## Phase 0.2: Backend Setup (NestJS)

### Tasks

- [ ] Khởi tạo NestJS project: `nest new apps/backend`
- [ ] Cài đặt core dependencies:
  ```bash
  npm install @nestjs/common @nestjs/core @nestjs/platform-express
  npm install @nestjs/config @nestjs/jwt @nestjs/passport
  npm install passport passport-jwt passport-local
  ```
- [ ] Cài đặt Prisma:
  ```bash
  npm install prisma @prisma/client
  ```
- [ ] Cài đặt AI SDK:
  ```bash
  npm install @google/generative-ai
  ```
- [ ] Cài đặt validation:
  ```bash
  npm install class-validator class-transformer
  ```
- [ ] Cài đặt utilities:
  ```bash
  npm install rxjs reflect-manager
  ```
- [ ] Tạo `.env`:
  ```
  GEMINI_API_KEY=your_api_key_here
  DATABASE_URL=file:./dev.db
  PORT=3000
  ```
- [ ] Tạo `docker-compose.yml` cho backend:
  ```yaml
  services:
    backend:
      build: ./apps/backend
      ports:
        - "3000:3000"
      environment:
        - DATABASE_URL=postgresql://postgres:postgres@db:5432/chatbox
        - GEMINI_API_KEY=${GEMINI_API_KEY}
  ```
- [ ] Tạo Dockerfile cho backend

---

## Phase 0.3: Frontend Setup (React + Vite)

### Tasks

- [ ] Khởi tạo Vite project: `npm create vite@latest apps/frontend -- --template react-ts`
- [ ] Cài đặt MUI:
  ```bash
  npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
  ```
- [ ] Cài đặt Redux + Thunk:
  ```bash
  npm install redux redux-thunk react-redux @reduxjs/toolkit
  ```
- [ ] Cài đặt Router:
  ```bash
  npm install react-router-dom
  ```
- [ ] Cài đặt HTTP Client:
  ```bash
  npm install axios
  ```
- [ ] Cài đặt Firebase:
  ```bash
  npm install firebase
  ```
- [ ] Cài đặt Utilities:
  ```bash
  npm install react-markdown date-fns
  ```
- [ ] Cài đặt dev dependencies:
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```
- [ ] Cấu hình Tailwind (theo design colors):
  ```javascript
  // tailwind.config.js
  export default {
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          primary: '#10a27e',
          'background-light': '#f6f8f7',
          'background-dark': '#11211d',
        },
      },
    },
  }
  ```
- [ ] Tạo Dockerfile cho frontend:
  ```yaml
  services:
    frontend:
      build: ./apps/frontend
      ports:
        - "5173:5173"
  ```
- [ ] Setup Vite proxy cho API:
  ```typescript
  // vite.config.ts
  export default defineConfig({
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
  })
  ```

---

## Phase 0.4: Testing Setup

### Backend Testing

- [ ] Cài đặt Jest:
  ```bash
  npm install -D jest @types/jest ts-jest @nestjs/testing
  ```
- [ ] Tạo `jest.config.js`:
  ```javascript
  module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'src',
    testRegex: '.*\\.spec\\.ts$',
    transform: { '^.+\\.(t|j)s$': 'ts-jest' },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: '../coverage',
  }
  ```
- [ ] Tạo test utils, mocks

### Frontend Testing

- [ ] Cài đặt Vitest:
  ```bash
  npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
  ```
- [ ] Cấu hình Vitest trong `vite.config.ts`:
  ```typescript
  export default defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
    },
  })
  ```
- [ ] Tạo test setup file

---

## Phase 0.5: Docker Setup

### Tasks

- [ ] Tạo root `docker-compose.yml`:
  ```yaml
  services:
    backend:
      build: ./apps/backend
      ports:
        - "3000:3000"
      environment:
        - DATABASE_URL=postgresql://postgres:postgres@db:5432/chatbox
        - GEMINI_API_KEY=${GEMINI_API_KEY}
      depends_on:
        - db

    frontend:
      build: ./apps/frontend
      ports:
        - "5173:5173"
      depends_on:
        - backend

    db:
      image: postgres:15-alpine
      environment:
        - POSTGRES_USER=postgres
        - POSTGRES_PASSWORD=postgres
        - POSTGRES_DB=chatbox
      ports:
        - "5432:5432"
      volumes:
        - postgres_data:/var/lib/postgresql/data

  volumes:
    postgres_data:
  ```
- [ ] Tạo `.dockerignore`:
  ```
  node_modules
  .git
  *.log
  .env
  ```
- [ ] Tạo Dockerfile cho từng app

---

## Phase 0.6: Environment & Config

### Tasks

- [ ] Tạo `.env.example`:
  ```
  # Backend
  GEMINI_API_KEY=
  DATABASE_URL=file:./dev.db
  PORT=3000
  
  # Frontend
  VITE_API_URL=http://localhost:3000
  VITE_FIREBASE_API_KEY=
  VITE_FIREBASE_AUTH_DOMAIN=
  VITE_FIREBASE_PROJECT_ID=
  ```
- [ ] Tạo `.gitignore` chuẩn cho monorepo
- [ ] Cấu hình ESLint/Prettier (optional)
- [ ] Cấu hình CI/CD (GitHub Actions - optional)

---

## Phase 0.7: Verify Setup

### Tasks

- [ ] Chạy backend dev server: `npm run start:dev`
- [ ] Chạy frontend dev server: `npm run dev`
- [ ] Verify Docker: `docker-compose up --build`
- [ ] Test API endpoint: `curl http://localhost:3000/api`
- [ ] Test frontend: http://localhost:5173

---

## Summary

| Phase | Contents | Output |
|-------|----------|--------|
| 0.1 | Project Structure | Monorepo setup |
| 0.2 | Backend | NestJS + Prisma + Gemini |
| 0.3 | Frontend | React + Vite + MUI + Redux |
| 0.4 | Testing | Jest + Vitest |
| 0.5 | Docker | docker-compose.yml |
| 0.6 | Environment | .env, .gitignore |
| 0.7 | Verify | Working dev servers |

---

## Commands

```bash
# Install all dependencies
pnpm install

# Run backend
pnpm --filter backend dev

# Run frontend  
pnpm --filter frontend dev

# Run all with Docker
docker-compose up --build

# Run tests
pnpm --filter backend test
pnpm --filter frontend test
```
