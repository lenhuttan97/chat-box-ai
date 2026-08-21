# Frontend Rules (React + Redux Toolkit)

## State & Data Flow
- Slices: `apps/frontend/src/store/slices/` (auth, user, theme, message, conversation)
- API layer là **Redux middleware**: `src/middleware/*.middleware.ts` — listen action type → fetch → dispatch result. KHÔNG gọi fetch trực tiếp trong component
- Custom hooks (`src/hooks/use*.ts`) wrap `useSelector`/`useDispatch` — components dùng hooks, không dùng store trực tiếp

## API URL Handling
- Backend routes nằm dưới `/api/v1`. Vite dev proxy forward `/api` → `http://localhost:3000`
- `VITE_API_URL` có thể có hoặc không có suffix `/api/v1` — khi viết code gọi API mới, follow pattern `buildApiUrl` trong `conversation.middleware.ts` (detect `baseUrl.includes('/api/v')`)
- Default fallback: `import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '/api'`

## UI Conventions
- MUI + Tailwind hybrid; path alias `@` → `./src` (vite.config.ts)
- Route protection: `RequireAuth` component (`src/auth/`)
- Firebase client config qua `VITE_FIREBASE_*` env vars
