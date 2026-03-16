# BUG-003: Message List Jumps During Streaming

## Thông tin

| Trường | Giá trị |
|--------|---------|
| Bug ID | BUG-003 |
| Feature | Chat - Frontend |
| Status | pending |
| Priority | high |

## Mô tả

Khi AI đang streaming response, message list bị nhảy lên xuống liên tục:
- Mỗi khi có token mới, content dài ra
- Container resize → scroll position thay đổi
- User không thể đọc được vì cứ nhảy

## Hiện tại

```
┌─────────────────────────────┐
│ User message                │  ← Fixed
├─────────────────────────────┤
│ AI: "H"                     │  ← Height changes
│                             │     from 20px
├─────────────────────────────┤
│                             │     to 40px
│ AI: "Hello"                 │     (jumps!)
├─────────────────────────────┤
│                             │     to 60px
│ AI: "Hello world"          │     (jumps!)
├─────────────────────────────┤
│                             │     ...
│ AI: "Hello world, how..."   │     (constant jumps!)
└─────────────────────────────┘
```

## Mong muốn

```
┌─────────────────────────────┐
│ User message                │
├─────────────────────────────┤
│                             │
│ AI: "Hello world, how..."   │  ← Smooth grow
│                             │     without jumping
├─────────────────────────────┤
│                             │
└─────────────────────────────┘
                        ↓
              Auto-scroll to bottom
              KHÔNG thay đổi vị trí user đang đọc
```

## Root Causes

1. **Content height change** - Mỗi token thêm → height thay đổi
2. **Scroll anchoring** - Không có anchor → scroll nhảy
3. **Re-render** - Component re-render → scroll position reset

## Solution

### 1. Sử dụng `overflow-anchor: auto` (CSS)

```css
/* index.css */
.message-list {
  overflow-anchor: auto;  /* Browser tự handle scroll anchoring */
  overflow-y: auto;
}
```

### 2. Custom scroll anchoring

```typescript
// MessageList.tsx
const messageListRef = useRef<HTMLDivElement>(null)
const anchorRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  if (streaming && anchorRef.current) {
    // Keep anchor in view
    anchorRef.current.scrollIntoView({ behavior: 'auto', block: 'end' })
  }
}, [streaming])
```

### 3. Buffer rendering - Chỉ update UI mỗi N characters

```typescript
// Thay vì update mỗi chunk
const BUFFER_SIZE = 5  // Update UI mỗi 5 words

let buffer = ''
for (const chunk of stream) {
  buffer += chunk
  if (buffer.length >= BUFFER_SIZE) {
    setDisplayText(buffer)
    buffer = ''
  }
}
```

### 4. Minimum height + smooth transition

```css
.message-item {
  min-height: 40px;
  transition: height 0.1s ease-out;  /* Smooth height change */
}
```

### 5. Auto-scroll to bottom với behavior: 'smooth'

```typescript
// Auto scroll when new content arrives
useEffect(() => {
  if (streaming) {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    })
  }
}, [displayText])
```

## Files liên quan

- `apps/frontend/src/components/MessageList.tsx`
- `apps/frontend/src/components/MessageItem.tsx`
- `apps/frontend/src/index.css`

## Recommendation

**Kết hợp**:
1. CSS `overflow-anchor: auto` (đơn giản, hiệu quả)
2. Minimum height cho message bubble
3. Buffer rendering (5-10 words thay vì mỗi token)

## Acceptance Criteria

- [ ] Message list KHÔNG nhảy khi AI streaming
- [ ] User có thể scroll up để xem previous messages
- [ ] Auto-scroll to bottom khi đang ở bottom
- [ ] Smooth height transition
