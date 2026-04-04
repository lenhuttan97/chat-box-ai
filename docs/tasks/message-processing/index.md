# Message Processing Tasks

## Feature: Message Processing Pipeline (FT-010)

## Tasks

| ID | Task | GitHub Issue | Status |
|----|------|--------------|--------|
| T001 | Intent Detection | #40 | ⏳ pending |
| T002 | Question Decomposition | #45 | ⏳ pending |
| T003 | Context Augmentation | #46 | ⏳ pending |
| T004 | Message Router | #47 | ✅ done (BE only) |

## Chi tiết

| Task | File | Description |
|------|------|-------------|
| T001 | [T001-intent-detection.md](./T001-intent-detection.md) | Phát hiện ý định user |
| T002 | [T002-question-decomposition.md](./T002-question-decomposition.md) | Tách câu hỏi phức tạp |
| T003 | [T003-context-augmentation.md](./T003-context-augmentation.md) | Bổ sung context tự động |
| T004 | [T004-message-router.md](./T004-message-router.md) | Route đến handler phù hợp |

## Dependencies

```
T001 (Intent Detection)
    │
    ▼
T004 (Message Router)  ← Infrastructure
    │
    ├──► T002 (Question Decomposition)
    │
    └──► T003 (Context Augmentation)
```

## Implementation Order

1. **T001** - Foundation (không phụ thuộc)
2. **T004** - Infrastructure (dùng T001)
3. **T002** - Enhancement (dùng T004)
4. **T003** - Enhancement (dùng T004, phụ thuộc FT-007)
