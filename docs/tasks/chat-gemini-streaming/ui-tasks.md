# FT-001 UI Tasks — Chat Gemini Streaming

## Phase 0: Setup & Config (TRƯỚC KHI IMPLEMENT)

- [x] Install deps: `@mui/material @emotion/react @emotion/styled @mui/icons-material`
- [x] Install deps: `redux redux-thunk react-redux`
- [x] Install deps: `axios react-router-dom react-markdown date-fns`
- [x] Setup MUI Theme (dark/light mode theo design)
- [x] Setup Redux store với thunk middleware
- [x] Configure routing (react-router-dom)
- [x] Setup Axios instance với interceptors

---

## Phase 1: API Layer

### Files

| File | Description |
|------|-------------|
| `src/api/axios.ts` | Axios instance + interceptors |
| `src/api/endpoints.ts` | API endpoint constants |
| `src/services/chat.service.ts` | Chat API calls |
| `src/middleware/conversation.middleware.ts` | Conversation API calls (✅ done) |
| `src/middleware/message.middleware.ts` | Message API + SSE (✅ done) |

### Tasks

- [ ] Phase 1.1: Setup Axios + interceptors (token + error handling)
- [ ] Phase 1.2: Create chat.service.ts (sendMessage, getMessages)
- [ ] Phase 1.3: Create conversation.service.ts (CRUD)
- [x] Phase 1.4: Create sse.service.ts → dùng message.middleware.ts (✅ done)

---

## Phase 2: Redux Store

### Files

| File | Description |
|------|-------------|
| `src/store/index.ts` | Store configuration (✅ done) |
| `src/store/hooks.ts` | Typed hooks |
| `src/store/slices/message.slice.ts` | Message state + thunks (✅ done) |
| `src/store/slices/conversation.slice.ts` | Conversations state (✅ done) |

### Tasks

- [x] Phase 2.1: Setup Redux store + thunk middleware (✅ done)
- [x] Phase 2.2: Create chatSlice → dùng message.slice (✅ done)
- [x] Phase 2.3: Create conversationSlice với async thunks (✅ done)
- [ ] Phase 2.4: Export typed hooks (useAppDispatch, useAppSelector)

---

## Phase 3: Hooks

### Files

| File | Description |
|------|-------------|
| `src/hooks/useConversations.ts` | Conversation logic hook (✅ done) |
| `src/hooks/useMessages.ts` | Message logic hook (✅ done) |

### Tasks

- [x] Phase 3.1: Create useChat hook → dùng useMessages (✅ done)
- [x] Phase 3.2: Create useConversation hook (✅ done)
- [ ] Phase 3.3: Create useStream hook for SSE

---

## Phase 4: Layout Components

### Files

| File | Description |
|------|-------------|
| `src/components/ChatLayout.tsx` | Layout chính (✅ done) |
| `src/components/ConversationList.tsx` | Left sidebar + list (✅ done) |

### Tasks

- [x] Phase 4.1: MainLayout với Sidebar + Content → dùng ChatLayout (✅ done)
- [x] Phase 4.2: Sidebar (Logo, NewChat, ConversationList) (✅ done)
- [ ] Phase 4.3: Header (Title, Search, UserMenu)

---

## Phase 5: Chat Components

### Files

| File | Description |
|------|-------------|
| `src/components/InputBar.tsx` | Message input (✅ done) |
| `src/components/MessageItem.tsx` | Single message (✅ done) |
| `src/components/MessageList.tsx` | Message list (✅ done) |
| `src/components/ChatWindow.tsx` | Chat container (✅ done) |

### Tasks

- [ ] Phase 5.1: WelcomeScreen (theo home.html)
- [x] Phase 5.2: InputBar (MUI TextField + Send) (✅ done)
- [x] Phase 5.3: MessageItem (Markdown support) (✅ done)
- [x] Phase 5.4: MessageList (auto scroll) (✅ done)
- [x] Phase 5.5: ChatWindow integration (✅ done)

---

## Phase 6: Conversation Components

### Files

| File | Description |
|------|-------------|
| `src/components/ConversationList.tsx` | Danh sách (✅ done) |

### Tasks

- [x] Phase 6.1: ConversationList (✅ done)
- [ ] Phase 6.2: ConversationItem
- [x] Phase 6.3: NewChatButton → trong ConversationList (✅ done)

---

## Phase 7: Integration & Polish

### Tasks

- [x] Phase 7.1: Connect InputBar → API → Redux → MessageList (✅ done)
- [x] Phase 7.2: Connect Sidebar → conversations (✅ done)
- [x] Phase 7.3: Loading states (MUI CircularProgress) (✅ done)
- [ ] Phase 7.4: Error handling (MUI Snackbar)
- [ ] Phase 7.5: Responsive design

---

## Phase 8: Sidebar Enhancement (theo home.html)

### Files

| File | Description |
|------|-------------|
| `src/components/Sidebar.tsx` | Sidebar header + footer |
| `src/components/Header.tsx` | Top header |

### Tasks

- [ ] Phase 8.1: SidebarHeader (Logo "AI Chat", New Chat button)
- [ ] Phase 8.2: SidebarFooter (Dark/Light toggle, Settings button)
- [ ] Phase 8.3: Update ConversationList với icon + timestamp styling

---

## Phase 9: Header Component

### Tasks

- [ ] Phase 9.1: Header layout (flex, border-bottom)
- [ ] Phase 9.2: SearchBar (search icon, expandable)
- [ ] Phase 9.3: UserMenu (avatar, dropdown)

---

## Phase 10: Welcome Screen

### Tasks

- [ ] Phase 10.1: WelcomeScreen layout (center, max-w-3xl)
- [ ] Phase 10.2: PromptCard components (4 cards: Analyze Data, Write Email, Summarize Article, Generate Code)
- [ ] Phase 10.3: Card hover effects (border-primary/50, scale)

---

## Phase 11: Styling Refinement

### Tasks

- [ ] Phase 11.1: Dark/Light mode toggle với MUI theme
- [ ] Phase 11.2: Match colors với design (#10a27e, #f6f8f7, #11211d)
- [ ] Phase 11.3: Typography (Inter font)
- [ ] Phase 11.4: Custom scrollbar styling
- [ ] Phase 11.5: Responsive breakpoints

---

## Layer Order (Bottom to Top)

```
┌─────────────────────────────────────────┐
│  Phase 4-6: UI Components (Top)        │
│  - Layout, Chat, Conversation           │
├─────────────────────────────────────────┤
│  Phase 3: Hooks                         │
│  - useChat, useStream                   │
├─────────────────────────────────────────┤
│  Phase 2: Redux Store                   │
│  - Slices + Thunks                      │
├─────────────────────────────────────────┤
│  Phase 1: API Layer (Bottom)            │
│  - Axios, Services, SSE                │
└─────────────────────────────────────────┘
```

---

## MUI Theme (theo design)

```typescript
// colors
primary: '#10a27e'
background-light: '#f6f8f7'
background-dark: '#11211d'
```

---

## Dependencies

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install redux redux-thunk react-redux
npm install axios react-router-dom react-markdown date-fns
```
