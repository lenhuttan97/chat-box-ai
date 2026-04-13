# 01 - Chat Page (Current Frontend Implementation)

## 1) Phạm vi page đã kiểm tra

Các file chính:
- `apps/frontend/src/components/chat/ChatWindow.tsx`
- `apps/frontend/src/components/chat/MessageList.tsx`
- `apps/frontend/src/components/chat/MessageItem.tsx`
- `apps/frontend/src/components/chat/InputBar.tsx`
- `apps/frontend/src/components/chat/WelcomeSection.tsx`

## 2) Cấu trúc layout hiện tại

### 2.1 ChatWindow (container cấp page)
- Cấu trúc: `flex flex-col h-full`
- Vùng nội dung tin nhắn: `flex-1 relative overflow-auto`
- Input bar nằm dưới cùng: `InputBar`
- Có 2 lớp glow nền dạng tuyệt đối để tạo chiều sâu (emerald blur)

### 2.2 MessageList (vùng hiển thị nội dung chat)
- Cấu trúc: `flex-1 overflow-auto ... relative`
- Khi chưa có message: render `WelcomeSection`
- Khi có message: map `MessageItem`
- Auto-scroll xuống đáy khi có message mới/streaming (ref + effect)

### 2.3 InputBar (vùng nhập liệu cố định ở đáy flow)
- Wrapper `max-w-3xl mx-auto`
- Input capsule dạng `rounded-full`
- Trái: attach button
- Giữa: input text
- Phải: send button / loading spinner
- Dòng disclaimer nằm dưới input

## 3) Component đang sử dụng

## 3.1 Theo chức năng
- **Container/Page shell**: `ChatWindow`
- **Message stream**: `MessageList`
- **Message renderer**: `MessageItem`
- **Composer**: `InputBar`
- **Empty state**: `WelcomeSection`

### 3.2 MUI usage (skeleton)
- MUI Icons được dùng xuyên suốt:
  - Chat/Bot/Copy/Share/Replay/ThumbUp/ThumbDown/More
  - AttachFile/Send
- `SvgIcon` từ MUI dùng cho custom suggestion icons trong Welcome
- MUI hiện chưa đóng vai trò layout primitives (Box/Stack/Grid) ở chat page; chủ yếu dùng icon + semantics

### 3.3 Tailwind usage (skin)
- Layout/Flex/Grid: `flex`, `grid`, `max-w-*`, `gap-*`
- Surface/visual: `bg-*`, `border-*`, `rounded-*`, `backdrop-blur-*`
- Typography: `text-*`, `font-*`, `leading-*`
- State classes: `hover:*`, `focus-within:*`, `disabled:*`, `group-hover:*`

### 3.4 Motion usage (animation foundation)
- `framer-motion` trong `WelcomeSection`:
  - enter animation cho title/suggestion cards (`initial/animate/transition`)
  - hover/tap interactions (`whileHover`, `whileTap`)
- CSS utility transitions:
  - `transition-all`, `transition-colors`, `duration-300`
- Typing indicator dạng `animate-bounce`

## 4) Hành vi UI chính

- Empty state → hiển thị Bento suggestion cards
- Click suggestion → dispatch message mẫu vào store
- Message assistant có action bar (copy/share/feedback/regenerate)
- Khi streaming message cuối assistant → hiện typing indicator
- Enter gửi message, có xử lý IME composition

## 5) Data flow hiện tại (rút gọn)

- `ChatWindow` lấy `streaming`, `sendMessage` từ `useMessages`
- `MessageList` lấy `messages`, `streaming` từ Redux (`state.messages`)
- Suggestion click dispatch `addMessage` trực tiếp
- `InputBar` gọi `onSend` do parent truyền

## 6) Đánh giá nhanh cho redesign

### Điểm mạnh
- Tách component hợp lý theo domain chat
- Empty state rõ ràng, có motion tạo cảm giác premium
- Visual hierarchy đã có nền tảng (surface + accent + glow)

### Điểm cần cải thiện khi redesign
- MUI chưa được dùng như skeleton cho layout/page primitives (đang thiên về icon)
- Action bar của AI message đang phụ thuộc hover opacity, cần chiến lược cho mobile/touch
- Các token màu đang dựa utility class + CSS vars, cần chuẩn hóa theme contract rõ hơn
- Cần thống nhất motion tokens (duration/easing/distance) giữa Welcome, Input, Message actions

## 7) Mapping theo triết lý mục tiêu

- **MUI = skeleton**
  - Dùng mạnh hơn cho: layout primitives (Box/Stack/Grid), interactive components chuẩn
- **Tailwind = skin**
  - Tiếp tục dùng để tinh chỉnh visual premium (blur, glow, fine spacing, utility states)
- **Motion = gốc animation**
  - Chuẩn hóa motion system (enter/exit/hover/press/loading) theo token dùng chung
