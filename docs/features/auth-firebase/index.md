# Authentication (Firebase)

## Thông tin

| Trường | Giá trị |
|--------|---------|
| ID | FT-002 |
| Tên | Authentication với Firebase |
| Trạng thái | ✅ completed |
| Priority | high |

## Firebase Configuration Note

> **⚠️ Important:** Firebase authentication là **optional**. Hệ thống hoạt động hoàn toàn bình thường với Email/Password login/register khi không có Firebase config.
>
> - ✅ Email/Password login: **Hoạt động**
> - ✅ Email/Password register: **Hoạt động**
> - 🔴 Google login: **Requires Firebase config**

Xem chi tiết: [api.md](./api.md#firebase-configuration)

## Tiến độ

| Loại | Trạng thái |
|------|-------------|
| Feature (FT-002) | ✅ completed |
| Task (T001-T003) | ✅ completed |

## Files

| File | Mô tả | Trạng thái |
|------|-------|-------------|
| [FT-002.md](./FT-002.md) | Feature specification | ✅ completed |
| [api.md](./api.md) | API Documentation | ✅ completed |
| [ui-tasks.md](./ui-tasks.md) | Frontend UI Tasks | ✅ completed |
| [T001-auth-firebase.md](../tasks/auth-firebase/T001-auth-firebase.md) | Task Implementation | ✅ completed |

## Related

- **UI Design:** [login-page.html](../../design/login-page.html) - Login/Register form
- **Tasks:** [T001-auth-firebase.md](../tasks/auth-firebase/T001-auth-firebase.md)
- **UI Tasks:** [ui-tasks.md](./ui-tasks.md)
