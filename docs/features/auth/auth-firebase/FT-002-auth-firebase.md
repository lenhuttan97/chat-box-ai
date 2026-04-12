# FT-002 — Authentication (Firebase)

## Thông tin

| Trường | Giá trị |
|--------|---------|
| ID | FT-002 |
| Tên | Authentication với Firebase |
| Trạng thái | completed |
| Priority | high |
| Ngày tiếp nhận | 2026-03-12 |

---

## Mô tả tính năng

Hệ thống xác thực người dùng sử dụng Firebase Authentication.

**Requirements từ user:**
- Login với Google (Firebase)
- Login với Email/Password
- Đăng ký tài khoản mới (Email/Password)
- Logout
- Update password
- Update display name
- Update ảnh đại diện

---

## Database Schema

```prisma
model user {
  id            String   @id @default(uuid())
  email         String?  @unique
  password      String?  @map("password")
  display_name  String?  @map("display_name")
  firebase_uid  String?  @unique @map("firebase_uid")
  photo_url     String?  @map("photo_url")
  provider      String?
  created_at    DateTime @default(now()) @map("created_at")
  updated_at    DateTime @updatedAt @map("updated_at")

  @@index([email])
  @@map("user")
}
```

---

## Features

| Feature | Mô tả |
|---------|-------|
| Login Google | Đăng nhập bằng tài khoản Google qua Firebase |
| Login Email/Password | Đăng nhập bằng email và password |
| Register | Đăng ký tài khoản mới bằng email/password |
| Logout | Đăng xuất khỏi hệ thống |
| Update Password | Thay đổi mật khẩu |
| Update Profile | Cập nhật display name và photo URL |

---

## Related Files

| Loại | File | Trạng thái |
|------|------|-------------|
| Task | [T001-auth-firebase.md](../tasks/auth-firebase/T001-auth-firebase.md) | pending |
| API | [api.md](./api.md) | - |

---

## Notes

- Sử dụng Firebase Auth SDK
- Password phải được hash trước khi lưu
- Token từ Firebase được verify ở backend
