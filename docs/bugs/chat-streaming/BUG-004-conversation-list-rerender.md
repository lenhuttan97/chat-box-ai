# BUG-004: Conversation List Re-renders During Streaming

## Thông tin

| Trường | Giá trị |
|--------|---------|
| Bug ID | BUG-004 |
| Feature | Chat - Frontend |
| Status | pending |
| Priority | high |

## Mô tả

Khi AI đang streaming response, conversation list bị re-render không cần thiết:
- Mỗi khi có token mới → message slice update
- Conversation list cũng bị re-render theo
- Gây flickering (nhấp nháy) 
- Performance giảm

## Hiện tại

```
AI Token arrives
     │
     ▼
message.slice.ts → state updated
     │
     ├──► MessageList re-render ✓ (cần thiết)
     │
     └──► ConversationList re-render ✗ (KHÔNG cần thiết!)
           │
           └──► Sidebar rebuild → User thấy flicker
```

## Mong muốn

```
AI Token arrives
     │
     ▼
message.slice.ts → state updated
     │
     └──► Chỉ MessageList re-render
           │
           └──► ConversationList KHÔNG re-render
                 │
                 └──► Smooth, no flicker
```

## Root Cause

```typescript
// Có thể đang dùng chung store cho cả hai
const { messages } = useAppSelector(state => state.messages)
const { conversations } = useAppSelector(state => state.conversations)

// Khi messages thay đổi → cả hai đều re-render
// vì có thể dùng useAppSelector không tối ưu
```

## Solution

### 1. Tách state management

```typescript
// message.slice.ts - Tách riêng
const messageSlice = createSlice({
  name: 'messages',
  initialState: { items: [], streaming: false, streamingContent: '' },
  reducers: {
    setMessages: (state, action) => { ... },
    addStreamingChunk: (state, action) => { ... },  // Tách riêng action
  }
})

// conversation.slice.ts - Độc lập
const conversationSlice = createSlice({
  name: 'conversations',
  initialState: { items: [], current: null },
  reducers: { ... }
})
```

### 2. Memoize components

```typescript
// ConversationList.tsx
import { memo } from 'react'

export const ConversationList = memo(() => {
  const { conversations } = useConversations()
  // ... render
})

// MessageList.tsx  
export const MessageList = memo(() => {
  const { messages } = useMessages()
  // ... render
})
```

### 3. Optimized selectors

```typescript
// Thay vì select toàn bộ state
const allMessages = useAppSelector(state => state.messages)

// Select riêng từng phần
const messages = useAppSelector(state => state.messages.items)
const streaming = useAppSelector(state => state.messages.streaming)

// Hoặc dùng createSelector từ reselect
const selectMessages = createSelector(
  (state: RootState) => state.messages.items,
  (items) => items
)
```

### 4. Use shallowEqual

```typescript
const { conversations } = useAppSelector(
  state => state.conversations.items,
  shallowEqual  // Chỉ re-render khi reference thay đổi
)
```

## Files liên quan

- `apps/frontend/src/store/slices/message.slice.ts`
- `apps/frontend/src/store/slices/conversation.slice.ts`
- `apps/frontend/src/components/ConversationList.tsx`
- `apps/frontend/src/components/MessageList.tsx`

## Acceptance Criteria

- [ ] ConversationList KHÔNG re-render khi messages update
- [ ] Không có flickering
- [ ] Performance tốt hơn
- [ ] MessageList vẫn re-render đúng khi cần
