# Prisma & Database Rules

## Schema — Generated File Warning (CAO NHẤT)
- **Source of truth: `apps/backend/prisma/models/*.prisma`** (một file per model)
- `schema.prisma` là file REGENERATED: mọi script `prisma:*` chạy `prisma/merge-models.js` trước — strip hết models trong `schema.prisma` rồi append lại từ `models/`
- **KHÔNG BAO GIỜ edit `schema.prisma` trực tiếp** — sửa sẽ bị mất. Thêm/sửa model trong `prisma/models/`

## Workflow sau khi đổi model
```bash
npm run prisma:migrate --prefix apps/backend   # merge + migrate dev
# hoặc
npm run prisma:push --prefix apps/backend      # merge + db push (không tạo migration file)
```

## SQLite Dev Quirks
- Relative `file:` URL resolve theo thư mục `prisma/`, KHÔNG phải cwd — dùng đúng `DATABASE_URL=file:./prisma/dev.db` như `.env.example`
- (Bằng chứng sai lầm cũ: stray dir `apps/backend/prisma/apps/backend/database/`)
- Giữ `provider = "sqlite"` trong datasource — PostgreSQL chỉ xuất hiện qua docker-compose

## One-Way Doors — verify với Q trước
Drop column/table, đổi column type, xóa constraints, migration destructive, xóa records (prefer soft delete).
