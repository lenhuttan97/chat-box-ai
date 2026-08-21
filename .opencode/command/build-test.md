---
description: Build project và chạy tests. Dùng sau do-code hoặc khi Q nói 'build', 'test', 'chạy test'.
---

# Build & Test — $ARGUMENTS

1. Compile trước:
   - Backend: `npm run build --prefix apps/backend`
   - Frontend (nếu đổi FE): `npx tsc --noEmit --project apps/frontend` hoặc `npm run build --prefix apps/frontend`
2. Xác định changed files: `git diff --name-only --diff-filter=ACMR`
3. Chạy related tests cho từng changed module:
```bash
npm run test --prefix apps/backend -- --testPathPattern <module>
```
4. Nếu Q yêu cầu full backend suite: `npm run test --prefix apps/backend` — timeout 5 phút, >2 phút không output = hung → STOP
5. Frontend có test mới: `npm run test --prefix apps/frontend -- run` (NHỚ `run`, không watch mode)
6. Lint (lưu ý backend lint dùng `--fix` sẽ tự sửa file): `npm run lint`
7. Báo kết quả: pass/fail từng nhóm + duration. Fail → STOP, báo Q, không tự fix lan man
