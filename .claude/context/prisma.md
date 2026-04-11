# Prisma Guide

## Cấu trúc

```
apps/backend/
├── database/
│   └── dev.db              # SQLite (dev)
├── prisma/
│   ├── schema.prisma       # Merged schema (auto)
│   ├── merge-models.js    # Script merge models
│   ├── models/           # 👈 Edit ở đây
│   │   ├── user.prisma
│   │   ├── conversation.prisma
│   │   └── message.prisma
│   └── migrations/
└── .env
```

## Thêm Table mới

### Bước 1: Tạo file model

Tạo `prisma/models/<tên_table>.prisma`:

```prisma
// prisma/models/post.prisma
model Post {
  id        String   @id @default(uuid())
  title     String
  content   String?
  createdAt DateTime @default(now())

  @@map("posts")
}
```

### Bước 2: Chạy migrate

```bash
cd apps/backend
npm run prisma:migrate
# Nhập tên migration: add_<tên>_table
```

### Bước 3: Generate Client

Tự động sau migrate.

---

## Scripts

```bash
npm run prisma:merge      # Merge models → schema.prisma
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Create & apply migration
npm run prisma:push      # Push schema (dev only)
```

---

## Development vs Production

| | Development | Production |
|--|------------|------------|
| Database | SQLite | PostgreSQL |
| DATABASE_URL | `file:./database/dev.db` | `postgresql://user:pass@host:5432/db` |
| Provider | `sqlite` | `postgresql` |

**Đổi provider trong `schema.prisma`:**

```prisma
datasource db {
  provider = "postgresql"  // hoặc "sqlite"
  url      = env("DATABASE_URL")
}
```
