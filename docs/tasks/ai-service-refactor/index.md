# AI Service Refactor Tasks

## Feature: AI Service Refactor

## Tasks

| ID | Task | Status |
|----|------|--------|
| T001 | Refactor AiService - Tách business logic | pending |
| T002 | Create AI Provider Factory | pending |
| T003 | Enhance Error Handling | pending |
| T004 | API Key Pool Manager | pending |

## Chi tiết

| Task | File | Mô tả |
|------|------|-------|
| T001 | [T001-refactor-ai-service.md](./T001-refactor-ai-service.md) | Tách business logic khỏi provider code |
| T002 | [T002-ai-provider-factory.md](./T002-ai-provider-factory.md) | Factory pattern cho multi-provider |
| T003 | [T003-enhance-error-handling.md](./T003-enhance-error-handling.md) | Validation, retry, error handling |
| T004 | [T004-api-key-pool.md](./T004-api-key-pool.md) | Round-robin API key management |

## ⚠️ Accuracy Note

```
Tất cả tasks trong FT-009 KHÔNG ảnh hưởng đến AI accuracy:
- T001: Chỉ refactor code
- T002: Chỉ quản lý providers
- T003: Chỉ xử lý errors
- T004: Chỉ quản lý keys
```

## Dependencies

- T001 cần hoàn thành trước T002
- T002 cần hoàn thành trước FT-006 (AI Provider Selection)
- T003, T004 có thể làm song song với T001, T002
