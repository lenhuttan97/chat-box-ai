# 02 - Settings Page (Current Frontend Implementation)

## 1) Phạm vi page đã kiểm tra

Các file chính:
- `apps/frontend/src/pages/SettingsPage.tsx` *(route-level wrapper)*
- `apps/frontend/src/components/settings/SettingsPage.tsx` *(main implementation)*
- `apps/frontend/src/App.tsx` *(routing)*

Liên quan layout shell:
- `apps/frontend/src/components/layout/ChatLayout.tsx` *(tham chiếu để so sánh shell chung với chat page)*

## 2) Cấu trúc route và vị trí page

- Route `/settings` được khai báo trong `App.tsx` dưới `RequireAuth`.
- Settings là protected page (chỉ user đã auth).
- Hiện tại settings page implementation nằm ở component riêng, không chia nhiều file nhỏ theo section.

## 3) Cấu trúc layout hiện tại của Settings

## 3.1 Page shell trong Settings component
- Root: `flex flex-col h-full bg-surface-1`
- Header vùng trên: title + subtitle, có border-bottom
- Content body: `flex-1 overflow-y-auto p-6 space-y-6`
- Mỗi section là một block collapsible `SettingsSection`

## 3.2 SettingsSection pattern (accordion nhẹ custom)
- Container: nền mờ + blur + border
- Header row: icon + title + description + chevron
- Click toggle mở/đóng nội dung (`isOpen` local state)
- Body chỉ render khi open

## 3.3 Các khu vực chức năng chính
1. **ProfileSection**
   - Avatar + overlay camera khi hover
   - Edit display name (toggle edit mode)
   - Email read-only
   - Change password action
2. **AppearanceSection**
   - 3 lựa chọn: light / dark / auto
   - Current theme indicator dạng switch visual
3. **AISelectionSection**
   - 2 model cards (GPT-4, GPT-3.5)
   - Persist model vào `localStorage`
4. **DataManagementSection**
   - Chat history toggle (persist localStorage)
   - Export action (placeholder alert)
   - Delete action + confirm modal custom

## 4) Component đang sử dụng

### 4.1 MUI usage (skeleton hiện tại)
- MUI Icons sử dụng nhiều cho semantic/action cues:
  - AccountCircle, PhotoCamera, Edit, Notifications, Palette, Help, Info, SmartToy, Storage
- Chưa dùng nhiều MUI layout primitives (Box/Stack/Grid) trong file này
- Cấu trúc section/accordion/modal chủ yếu custom bằng div + Tailwind

### 4.2 Tailwind usage (skin)
- Layout: `flex`, `grid`, `gap`, `space-y`
- Surface: `bg-surface-*`, `border-[color:var(--...)]`, `rounded-*`
- Visual state: `hover:*`, `focus:*`, `disabled:*`, `transition-*`
- Typography: `text-[color:var(--...)]`, `font-medium`, `text-sm`

### 4.3 Motion/Animation usage
- Không dùng framer-motion trong settings hiện tại
- Motion chủ yếu dựa CSS utility transitions:
  - `transition-colors`, `transition-all`, `transition-transform`
  - rotate chevron khi open
  - toggle knob translate-x
  - modal xuất hiện tức thời (chưa có enter/exit animation rõ)

## 5) Data & state flow hiện tại

- Local state cho UI interaction:
  - open/close section
  - edit mode, saving state
  - selected model
  - history toggle
  - delete confirm modal
- Persist cục bộ:
  - `chatbox_ai_model` (`localStorage`)
  - `chatbox_save_history` (`localStorage`)
- User data:
  - lấy từ hook `useUser` (currentUser, updateProfile)

## 6) So sánh nhanh với hướng redesign premium

### 6.1 Điểm đã có
- Cấu trúc theo domain rõ (Profile, Appearance, AI, Data)
- Có semantic icons và visual state cơ bản
- Đã có token-like màu qua CSS vars (`--accent-primary`, `--text-primary`)

### 6.2 Khoảng cách cần cải tiến
- Chưa có shell premium đồng nhất như mock (sidebar/header dạng shared shell cho settings)
- Thiếu motion system rõ ràng cho section open/close, modal enter/exit, hover choreography
- MUI chưa đóng vai trò skeleton mạnh cho layout/component-level primitives
- Một số action còn placeholder (export/delete thực)

## 7) Mapping theo triết lý mục tiêu

- **MUI = skeleton**
  - Nâng cấp dùng MUI primitives cho section container, modal, form controls, spacing system
- **Tailwind = skin**
  - Tiếp tục đảm nhận glass, blur, glow, accent highlights, micro visual tuning
- **Motion = gốc animation**
  - Chuẩn hóa animation cho accordion, modal, button press, focus transitions bằng motion tokens
