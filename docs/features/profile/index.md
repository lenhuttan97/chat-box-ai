# Feature: Profile Management

## Tasks

| ID | Task | Status |
|----|------|--------|
| T-P001 | View Profile | ✅ completed |
| T-P002 | Update Display Name | ✅ completed |
| T-P003 | Update Photo URL | ✅ completed |
| T-P004 | Update Password | ✅ completed |
| T-P005 | **Theme Settings (Device-aware)** | pending |

## T-P005: Theme Settings (Device-aware)

### Mô tả
Lưu trữ preference theme của user với các tùy chọn:
- **Light**: Luôn dùng light mode
- **Dark**: Luôn dùng dark mode  
- **Auto**: Tự động theo thiết bị (browser/system preference)

### User Flow

```
Sidebar → Click Theme Toggle Button
    │
    ▼
┌─────────────────────────────────────────┐
│  Theme Selector Modal                   │
│  ○ Light                                │
│  ○ Dark                                 │
│  ○ Auto (default)                       │
└─────────────────────────────────────────┘
    │
    ▼
Apply theme + Save to DB
```

### Database Changes

```prisma
// User model
model User {
  // ... existing fields
  themeSetting String @default("auto")  // "light" | "dark" | "auto"
}
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/users/me | Response thêm `themeSetting` |
| PUT | /api/v1/users/me/theme | Update theme preference |

### Frontend Implementation

```typescript
// ThemeProvider Flow
1. Load user → get themeSetting
2. Determine actual theme:
   - "light" → light
   - "dark" → dark  
   - "auto" → matchMedia('(prefers-color-scheme: dark)').matches
3. Listen media query change nếu "auto"
4. Apply theme
```

### Acceptance Criteria

- [ ] User có thể chọn Light/Dark/Auto
- [ ] Chọn Auto sẽ theo browser/system preference
- [ ] Theme preference được lưu vào DB
- [ ] Khi reload, theme được restore đúng
- [ ] Khi thay đổi system preference (nếu Auto), UI tự cập nhật real-time
