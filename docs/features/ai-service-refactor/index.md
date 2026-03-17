# AI Service Refactor

## Thông tin

| Trường | Giá trị |
|--------|---------|
| ID | FT-009 |
| Tên | AI Service Refactor |
| Trạng thái | pending |
| Priority | high |

## Tiến độ

| Loại | Trạng thái |
|------|-------------|
| Feature (FT-009) | pending |
| Task (T001) | pending |
| Task (T002) | pending |
| Task (T003) | pending |
| Task (T004) | pending |

## Files

| File | Mô tả | Trạng thái |
|------|-------|-------------|
| [T001_refactor-ai-service.md](./T001-refactor-ai-service.md) | Refactor AiService | pending |
| [T002_ai-provider-factory.md](./T002-ai-provider-factory.md) | Factory pattern | pending |
| [T003_enhance-error-handling.md](./T003-enhance-error-handling.md) | Error handling | pending |
| [T004_api-key-pool.md](./T004-api-key-pool.md) | API Key Pool Manager | pending |

## ⚠️ Important Notes

### Accuracy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Tất cả thay đổi trong FT-009 KHÔNG ảnh hưởng đến accuracy:             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  • T001 (Refactor)        → Chỉ tách code, không thay đổi logic AI      │
│  • T002 (Factory)         → Chỉ quản lý providers, không thay đổi AI     │
│  • T003 (Error Handling)  → Chỉ xử lý lỗi, không thay đổi AI            │
│  • T004 (API Key Pool)   → Chỉ quản lý keys, không thay đổi AI         │
│                                                                             │
│  Kết luận: Accuracy được giữ nguyên 100%                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Dependencies

- T001 → T002 (T001 hoàn thành trước T002)
- T002 → FT-006 (AI Provider Selection cần factory)
- T004 có thể làm độc lập

---

## Related

- **Feature:** FT-001 (Chat Gemini Streaming) - base code
- **Feature:** FT-006 (AI Provider Selection) - cần sau khi refactor
- **Tasks:** [T001-T003](../tasks/ai-service-refactor/index.md)
