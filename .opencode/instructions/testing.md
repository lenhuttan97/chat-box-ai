# Testing Rules (TDD bắt buộc)

## TDD Red → Green → Refactor
1. RED: viết test cho behavior mong đợi, chạy, PHẢI fail. Báo Q: "Test [name] — FAILS"
2. GREEN: implementation tối thiểu để pass. Báo: "Test [name] — PASSES"
3. REFACTOR: dọn code giữ test green
- Skip RED = protocol violation

## Backend — Jest
- Specs nằm ở `apps/backend/src/test/<module>/<name>.spec.ts` (KHÔNG đặt cạnh source), jest `rootDir` là `src`
- Single test:
```bash
npm run test --prefix apps/backend -- --testPathPattern <name>
```
- Compile trước khi test: `npm run build --prefix apps/backend` (nest build)

## Frontend — Vitest
- Config sẵn: jsdom + setup `src/test/setup.ts`, nhưng hiện CHƯA có test file nào
- **Gotcha:** `vitest` không args vào watch mode ở terminal local — dùng one-shot:
```bash
npm run test --prefix apps/frontend -- run
# hoặc single file:
npx vitest run src/path/to/file.test.tsx
```

## Discipline
- Sau mỗi file sửa: compile + chạy related tests TRƯỚC khi sang file kế
- Test cũ bị ảnh hưởng bởi code mới → PHẢI update
- Coverage ≥ 80% cho changed files
- Timeout 5 phút/module; >2 phút không output = hung → STOP báo Q
