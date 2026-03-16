# BUG-001: Missing Loading Effect on Message Send

## Thông tin

| Trường | Giá trị |
|--------|---------|
| Bug ID | BUG-001 |
| Feature | Chat - Frontend |
| Status | pending |
| Priority | high |

## Mô tả

Khi user gửi tin nhắn, không có hiệu ứng loading để user biết tin nhắn đang được xử lý.

## Hiện tại

```
User typing → Click Send → Tin nhắn hiện lên ngay
                                    ↓
                           (Không có loading indicator)
                                    ↓
                           Chờ AI response...
```

## Mong muốn

```
User typing → Click Send → [Spinner/Loading] hiện trong message bubble
                                    ↓
                           (User biết đang xử lý)
                                    ↓
                           AI response hiện ra
```

## Files liên quan

- `apps/frontend/src/components/MessageItem.tsx`
- `apps/frontend/src/store/slices/message.slice.ts`
- `apps/frontend/src/hooks/useMessages.ts`

## Solution

```typescript
// Trong MessageItem.tsx
interface MessageItemProps {
  message: Message
  isLoading?: boolean  // Thêm prop
}

export const MessageItem = ({ message, isLoading }: MessageItemProps) => {
  return (
    <Box>
      <MessageBubble content={message.content} />
      {isLoading && <TypingIndicator />}  // Hiển thị loading
    </Box>
  )
}

// Trong MessageList.tsx - truyền isLoading
{messages.map((msg, index) => (
  <MessageItem
    key={msg.id}
    message={msg}
    isLoading={index === messages.length - 1 && streaming}  // Last message + streaming
  />
))}
```

## Acceptance Criteria

- [ ] Loading indicator hiện khi user click send
- [ ] Loading biến mất khi AI response hoàn thành
- [ ] UX: User biết tin nhắn đang được xử lý
