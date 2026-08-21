# 03 - Auth/Login Pages (Current Frontend Implementation)

## 1) Phạm vi page đã kiểm tra

Các file chính:
- `apps/frontend/src/pages/LoginPage.tsx`
- `apps/frontend/src/pages/RegisterPage.tsx`
- `apps/frontend/src/App.tsx` (route `/login`, `/register`)

## 2) Cấu trúc layout hiện tại

## 2.1 Layout tổng thể (cả login và register)
- Root page dùng `Box` (MUI) + Tailwind classes:
  - `min-h-screen`
  - căn giữa theo cả 2 trục (`flex items-center justify-center`)
  - nền theo token `var(--surface)`
- Layer visual nền:
  1. Glow blobs (2 lớp blur emerald)
  2. Noise overlay (`noise-dark`)
  3. Card nội dung nổi ở giữa (`z-10`)

## 2.2 Card form
- Card dạng glassmorphism:
  - `glass`, `backdrop-blur-xl`
  - border subtle + shadow lớn
  - bo góc lớn (`rounded-[24px]`)
- Cấu trúc card:
  1. Header (icon + title + subtitle)
  2. Error alert (nếu có)
  3. Form chính (email/password...)
  4. Divider “Or sign in/up with”
  5. Social auth button(s)
  6. Link điều hướng sang page còn lại

## 3) Component đang sử dụng

### 3.1 MUI usage (skeleton)
- Dùng `Box` từ MUI để làm wrapper semantic (`component="main"`, `component="form"`, `component="button"`...)
- Dùng MUI Icons:
  - Login: `Lock`, `Visibility`, `VisibilityOff`
  - Register: `PersonAdd`, `Visibility`, `VisibilityOff`
- Chưa dùng MUI input/button components trực tiếp (TextField/Button), mà dùng HTML input/button + class Tailwind

### 3.2 Tailwind usage (skin)
- Form skin: rounded-full input/button, border, focus ring, hover brightness
- Glass + blur + noise + glow tạo phong cách premium
- Utility states đầy đủ: hover/focus/disabled/transition

### 3.3 Motion/Animation usage
- Không dùng framer-motion trong auth pages hiện tại
- Animation chủ yếu bằng CSS utility:
  - transition cho hover/focus
  - spinner `animate-spin` khi loading

## 4) Hành vi UI chính

## 4.1 Login
- Submit email/password -> `loginEmail`
- Google login -> `loginGoogle`
- Toggle show/hide password
- Reset form
- Khi mount: ép dark mode class trên `<html>`

## 4.2 Register
- Submit full name + email + password + confirm password -> `registerEmail`
- Check password match trước submit
- Google login
- Toggle show/hide password & confirm password
- Reset form
- Khi mount: ép dark mode class trên `<html>`

## 5) Nhận xét phục vụ redesign

### Điểm mạnh
- Visual style nhất quán premium với hệ glow/noise/glass
- Form affordance rõ ràng, focus states tốt
- Auth flow đơn giản, dễ theo dõi

### Khoảng cách cần cải tiến
- MUI mới đóng vai trò wrapper/icon, chưa phải skeleton mạnh cho form primitives
- Motion system chưa chuẩn hóa (thiếu enter/exit choreography cho card/error/social)
- Có thể trích xuất auth layout shell dùng chung để giảm lặp giữa login/register

## 6) Mapping theo triết lý mục tiêu

- **MUI = skeleton**
  - Tăng sử dụng MUI primitives cho form architecture (FormControl/InputLabel/TextField/Button base)
- **Tailwind = skin**
  - Giữ vai trò fine-tune premium visuals (glass/glow/noise, micro states)
- **Motion = gốc animation**
  - Chuẩn hóa motion tokens cho auth transitions (card appear, error feedback, button press)
