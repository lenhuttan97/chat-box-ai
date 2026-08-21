# Frontend Data Flow & State Management

Module: Frontend (React + TypeScript + Vite) | Last updated: 2026-08-18
Refs: chat-gemini-streaming, auth, device-tracking, chat-settings

---

## 1. Overview

Tài liệu này mô tả cách frontend **điều phối data và state** từ lúc user tương tác đến khi hiển thị kết quả. FE là React 18 + Redux Toolkit + Vite, giao tiếp với backend qua 3 lớp: **Component → Hook → Redux Slice/Middleware → HTTP (axios / fetch / SSE)**.

```
User Interaction (InputBar / ConversationList / LoginPage)
   │  dispatch / useSelector
   ▼
Hook (useMessages / useConversations / useAuth / useUser / useTheme)
   │  dispatch(thunk) / action
   ▼
Redux Slice (state + async thunk)
   │
   ▼
Middleware / Service (axios | fetch | SSE)
   │
   ▼
Backend REST/SSE  (/api/v1/...)
```

---

## 2. App Bootstrap & Routing

Cấu hình tại `apps/frontend/src/main.tsx` + `App.tsx`:

```
main.tsx
   ├── <Provider store={store}>          → Redux store dùng cho toàn app
   ├── <BrowserRouter>                    → routing
   ├── <ThemeProvider theme={theme}>      → MUI theme
   └── <CssBaseline /> + <App />

App.tsx — Routes
   ├── /login           → LoginPage
   ├── /register        → RegisterPage
   ├── (ChatLayout)     → layout bọc chat (Sidebar + Header + Outlet)
   │     ├── /          → ChatPage            ← KHÔNG yêu cầu auth
   │     └── (RequireAuth) → profile, /update-password, /settings
   └── *                → Navigate /  (redirect về home)
```

**RequireAuth** (`auth/RequireAuth.tsx`) — guard cho profile/settings:
```
mount → initialize()          → auth.slice.initializeAuth thunk
      → isAuthenticated ? loadUser() : logout()
      → !isAuthenticated → <Navigate to="/login" replace />
```

**ChatPage** cũng tự init auth (kể cả khi route `/` không cần login) để đồng bộ user/device state khi vô trang chat.

---

## 3. Redux State Management

Store tại `apps/frontend/src/store/store.ts` — 5 slice:

```
RootState
 ├── conversations   → items[], currentConversation, loading, error
 ├── messages        → items[], loading, streaming, error
 ├── auth            → user, isAuthenticated, isLoading, error, accessToken
 ├── user            → currentUser, isLoading, error
 └── theme           → darkMode, themeSetting (light|dark|auto)
```

| Slice | State chính | Async thunk | Nguồn data |
|-------|-------------|-------------|------------|
| `conversation.slice` | `items`, `currentConversation` | `fetchConversations`, `fetchConversation`, `deleteConversation`, `updateConversation` | `conversationService` (axios) |
| `message.slice` | `items`, `streaming` | — (chỉ sync reducer) | `messageService` (fetch SSE) |
| `auth.slice` | `user`, `isAuthenticated`, `accessToken` | `loginWithEmail`, `registerWithEmail`, `loginWithGoogle`, `logoutUser`, `initializeAuth`, `updateUserProfile`, `updateUserPassword` | `authMiddleware` → `AuthService` (fetch) |
| `user.slice` | `currentUser` | `fetchUserProfile`, `updateUserProfile` | `authMiddleware` (GET/PUT /auth/profile) |
| `theme.slice` | `darkMode`, `themeSetting` | — (chỉ sync + localStorage) | localStorage `themeSetting` |

> **Lưu ý 2 nguồn user song song:** `auth.user` (từ response login) và `user.currentUser` (từ GET /auth/profile) là **2 state riêng biệt**, không tự đồng bộ. `useAuth` và `useUser` đọc khác nhau → Header/Sidebar có thể hiển thị user cũ khi chưa `loadUser()`.

---

## 4. Data Flow Layers

### 4.1 Tổng quan

```
Component
   │  (1) dispatch action / (2) useSelector lấy state
   ▼
Hook               ← giới thiệu state + hành động cho component
   │  (1) dispatch(thunk) / (2) đọc state từ store
   ▼
Redux Slice
   ├── sync reducer      → mutate state ngay lập tức (addMessage, setStreaming, ...)
   └── createAsyncThunk  → gọi middleware/service bên ngoài
   │
   ▼
Middleware / Service    ← CHỈ tầng này chạm HTTP
   ├── conversationService  (axios, REST)
   ├── messageService       (fetch, POST /conversation/messages + đọc SSE)
   ├── authMiddleware → AuthService (fetch, REST)
   └── userMiddleware       (fetch, REST)
   │
   ▼
Backend /api/v1/*
```

### 4.2 Endpoint resolution — 3 cách khác nhau (⚠️)

| File | Logic | Kết quả khi `VITE_API_URL=http://localhost:3000` |
|------|-------|------------------------------------------------|
| `conversation.middleware.ts` `getApiEndpoint()` | check chứa `/api/v` → append path, ngược lại thêm `/api/v1` | `http://localhost:3000/api/v1/conversations` ✅ |
| `auth.service.ts` `getApiEndpoint()` | tương tự trên | `http://localhost:3000/api/v1/auth/login` ✅ |
| `message.middleware.ts` | mặc định `/api`, append `/v1/...` trực tiếp | `http://localhost:3000/v1/conversation/messages` ❌ thiếu `/api` |

> ⚠️ **Bất nhất:** nếu `VITE_API_URL` đã gồm version (vd `.../api/v1`), `message.middleware` sẽ tạo URL **kép `/v1/v1`** trong khi `conversation.middleware` xử lý đúng. Xem Known Issues.

### 4.3 Request headers

| Header | Khi nào | Nguồn |
|--------|---------|-------|
| `Authorization: Bearer <token>` | có token (js-cookie `token`) | `Cookies.get('token')` |
| `X-Device-Info: {...}` | hầu hết conversation/message call | `getDeviceInfo()` (`utils/device.ts`) |

---

## 5. Auth Flow (Frontend)

### 5.1 Login bằng email/password

```
LoginPage.handleSubmit
   │
   ▼
useAuth.loginEmail → dispatch(loginWithEmail)  (auth.slice)
   │
   ▼
authMiddleware.login → AuthService.login
   │  fetch POST /auth/login { email, password }
   │  ← 200: { user, token, refreshToken }
   ▼
AuthService.setTokens(token, refreshToken)
   ├── js-cookie 'token'          expires 60m, httpOnly: false  ← JS đọc được
   └── js-cookie 'refresh_token'  expires 7d,  httpOnly: false
   │
   ▼
auth.slice fulfilled → state.user / isAuthenticated=true / accessToken
   │
   ▼
navigate('/')
```

### 5.2 Login bằng Google (Firebase)

```
LoginPage.handleGoogleLogin
   │
   ▼
useAuth.loginGoogle → dispatch(loginWithGoogle)
   │
   ▼
AuthService.googleLogin
   ├── FirebaseAuthService.signInWithGoogle()   → popup Google
   ├── FirebaseAuthService.getIdToken()         → Firebase ID token
   ├── fetch POST /auth/google { idToken }
   └── setTokens(token, refreshToken)           → cookie + store
```

### 5.3 Khởi tạo / khôi phục session (`initializeAuth`)

```
initializeAuth thunk
   ├── authMiddleware.getToken() → Cookies 'token'
   ├── [no token]        → reject 'No token found' → isAuthenticated=false
   ├── getCurrentUser()  → GET /auth/profile (Bearer token)
   │      └── [401/expired] → refreshToken() → POST /auth/refresh-token
   │             └── retry GET /auth/profile với token mới
   └── [OK] → isAuthenticated=true, state.user = user
```

`AuthService.getCurrentUser` tự refresh + retry 1 lần khi token hết hạn (gọi tới backend; backend đã có guard riêng).

### 5.4 Logout

```
logoutUser thunk
   │
   ▼
AuthService.logout
   ├── fetch POST /auth/logout        (fire-and-forget, lỗi chỉ log)
   ├── clearTokens()                  → xóa cookie token + refresh_token
   └── FirebaseAuthService.signOut()  → logout Firebase
   │
   ▼
auth.slice fulfilled → user=null, isAuthenticated=false
```

---

## 6. Device Tracking (Frontend)

Toolkit tại `apps/frontend/src/utils/device.ts`:

```
generateDeviceId()
   ├── localStorage 'chatbox_device_id'   ← lưu bền qua session
   └── chưa có → `device_${Date.now()}_${random}` + persist

getDeviceInfo() → { deviceId, browser, os, language, timezone, screenResolution }
   ├── parse navigator.userAgent → Chrome/Safari/Firefox/Edge + version
   ├── navigator.language, Intl.DateTimeFormat().timeZone
   └── window.screen.width x height

getDeviceId() → generateDeviceId()
```

Cách dùng:
| Nơi | Cách dùng |
|-----|-----------|
| `conversation.middleware` | header `X-Device-Info: JSON.stringify(getDeviceInfo())` |
| `conversation.middleware.createConversation` | body `{ name, deviceId }` khi anonymous |
| `conversation.middleware.getConversations` | anonymous → `GET /conversations/device/:deviceId` (thay vì `GET /conversations`) |
| `message.middleware.sendMessageWithStream` | header `X-Device-Info` |

→ Chế độ **anonymous**: FE tự tạo deviceId trong localStorage; backend dựa vào đó tạo virtual user + gắn conversation.

---

## 7. Conversation CRUD Flow (Frontend)

```
Sidebar / ConversationList
   │
   ▼
useConversations
   ├── loadConversations()   → dispatch(fetchConversations)
   │      ├── [có token] → GET /conversations            (Bearer)
   │      └── [anon]     → GET /conversations/device/:id (X-Device-Info)
   │
   ├── loadConversation(id) → dispatch(fetchConversation)
   │      ├── GET /conversations/:id
   │      └── GET /conversations/:id/messages        ← Promise.all
   │             └── dispatch(setMessages)  → đổ vào message.slice
   │
   ├── selectConversation(conv | null)
   │      ├── dispatch(setCurrentConversation)
   │      └── null → dispatch(clearMessages)   ← "New chat"
   │
   ├── removeConversation(id) → DELETE /conversations/:id
   │      → slice filter items, clear currentConversation nếu trùng
   │
   └── editConversation / updateConversation(id, data) → PUT /conversations/:id
```

> **Ghi chú:** conversation **mới không được tạo ở FE** — bấm "New Chat" chỉ `selectConversation(null)`. Conversation thực sự được backend tạo **lazy** ngay khi gửi tin nhắn đầu tiên (xem §8). Suggestion card ở `WelcomeSection` cũng chỉ `addMessage` cục bộ (không gọi API).

---

## 8. Core Orchestration — Send Message (Streaming)

Flow chính nằm ở `useMessages.sendMessage` (`hooks/useMessages.ts`) + `messageService.sendMessageWithStream` (`middleware/message.middleware.ts`).

```
InputBar.onSend(message)          (ChatWindow → useMessages)
   │
   ▼
① Optimistic UI
   │
   ├── dispatch(addMessage({ id: uuid, role:'user', content, createdAt }))
   ├── dispatch(addMessage({ id: uuid, role:'assistant', content:'', createdAt }))
   │        ← placeholder rỗng để nhận chunk
   └── dispatch(setStreaming(true))
   │
   ▼
② messageService.sendMessageWithStream(content, currentConversation?.id, onChunk, onDone)
   │
   ├── fetch POST {API_URL}/v1/conversation/messages
   │      headers: Content-Type, Authorization: Bearer <token>, X-Device-Info
   │      body:    { message, conversation_id: currentConversation?.id }
   │
   ▼
③ Read SSE stream
   │
   ├── response.body.getReader() + TextDecoder
   ├── split từng dòng, lọc dòng bắt đầu bằng 'data: '
   │
   ├── data.conversationId → cập nhật conversationIdResult
   ├── data.chunk          → onChunk(chunk, conversationIdResult)
   │                           └── dispatch(appendToLastMessage(chunk))
   │                                   → append vào message assistant cuối cùng
   └── data.error          → throw Error
   │
   ▼
④ Done
   │
   └── onDone(conversationId)
          ├── conversationService.getConversation(id)
          ├── conversationService.getMessages(id)
          ├── dispatch(setCurrentConversation(conversation))
          ├── dispatch(setMessages(messages))        ← thay toàn bộ list optimistic
          └── dispatch(fetchConversations())         ← refresh sidebar
   │
   ▼
finally: dispatch(setStreaming(false))
```

**SSE event phía client đọc được:**
```
data: {"conversationId": "new-uuid"}    ← conversation mới được backend tạo
data: {"chunk": "Hello"}
data: {"chunk": " there"}
data: {"chunk": "!"}
data: {"error": "..."}                  ← AI fail
```

**Rendering:**
- `MessageList` auto-scroll khi `[messages, streaming]` đổi.
- `MessageItem` render markdown (`react-markdown`), hiện `TypingIndicator` khi `isLoading && lastMessage.role==='assistant' && streaming`.

> ⚠️ **Bug tiềm ẩn (known):** nếu message từ server lẫn `conversationId` và `chunk` trong cùng event, `conversationIdResult` update trước khi `onChunk` → chunk đầu có thể rơi vào message của conversation cũ. Thêm nữa, `setMessages` ở ④ **thay thế toàn bộ** list — có thể gây nhảy scroll giữa lúc streaming (đã có BUG-003-message-list-jump).

> ⚠️ **Lỗi streaming không vào state:** `catch(err)` chỉ `console.error`, **không** `dispatch` error vào `message.slice.error` → UI không hiển thị lỗi cho user.

---

## 9. Conversation Settings Flow (FE)

Trigger: bấm icon Settings trên conversation → `ChatSettingsModal`.

```
ChatSettingsModal (open)
   ├── useEffect → fill form từ currentConversation
   │      name, systemPrompt, temperature, maxTokens
   │
   └── handleSave
          ├── useConversations.updateConversation(id, { name, systemPrompt, temperature, maxTokens })
          │      → dispatch(updateConversation) → PUT /conversations/:id
          │      → slice update items + currentConversation
          └── onClose()
```

> **Lưu ý:** modal **chỉ hiển thị/sửa** `name, systemPrompt, temperature, maxTokens`. Không có UI cho `provider/model`, `contextToken`, `autoPrompt` ở FE (dù type + backend hỗ trợ). Model selector ở `Header` chỉ là **state cục bộ** (mặc định `gemini-2.0-flash`), không đọc/save vào conversation.

---

## 10. Theme Flow (FE)

```
ThemeModal / SettingsPage → useTheme.setThemeSetting(setting)
   │
   ▼
theme.slice setThemeSetting
   ├── 'auto' → darkMode = matchMedia('(prefers-color-scheme: dark)').matches
   ├── 'dark'/'light' → darkMode tương ứng
   └── localStorage.setItem('themeSetting', ...)
   │
   ▼
ChatLayout useEffect([darkMode])
   └── document.documentElement.classList.add/remove('dark')  → Tailwind dark mode
```

> **Lưu ý:** theme **chỉ lưu localStorage**, KHÔNG đồng bộ lên backend. `userMiddleware.updateTheme` (PUT `/users/me/theme`) tồn tại nhưng **không được dùng** ở bất kỳ component nào → theme không theo user khi đổi máy.

---

## 11. Tóm tắt luồng chính (1 interaction điển hình)

```
User gõ tin nhắn + Enter
   │
   ▼
InputBar.onSend → useMessages.sendMessage
   ├── Optimistic: addMessage(user) + addMessage(assistant rỗng) + streaming=true
   ├── POST /v1/conversation/messages { message, conversation_id? }  (X-Device-Info)
   ├── [conversation mới] nhận SSE conversationId
   ├── mỗi SSE chunk → appendToLastMessage (render markdown realtime)
   ├── done → fetch conversation + messages → setMessages (thay optimistic)
   │        → fetchConversations (refresh sidebar)
   └── streaming=false
   │
   ▼
MessageItem render streaming response + TypingIndicator
```

---

## 12. Known Issues / Notes (thực tế vs docs)

| Vấn đề | Vị trí | Ảnh hưởng |
|--------|--------|-----------|
| URL building bất nhất: `message.middleware` thiếu/kép `/api/v1` | `message.middleware.ts:5,17,82` vs `conversation.middleware.ts:8-19` | Streaming có thể 404 tùy cấu hình `VITE_API_URL` |
| Luôn gửi header `Authorization: Bearer null` khi anonymous | `message.middleware.ts:21` | Backend không có guard ở endpoint này nên tạm hoạt động |
| 2 state user song song (auth.user / user.currentUser) không tự sync | `auth.slice.ts` vs `user.slice.ts` | Header/Sidebar hiển thị thông tin user lệch nhau |
| Lỗi streaming chỉ `console.error`, không vào `message.slice.error` | `useMessages.ts:39-41` | User không thấy thông báo lỗi AI trên UI |
| ChatWindow title editing là no-op (`handleSave` chỉ toggle state) | `ChatWindow.tsx:22-26` | Sửa tên trên header không lưu |
| Model selector ở Header là state cục bộ, không liên kết conversation | `Header.tsx:22-43` | Chọn model không có tác dụng tới AI call |
| `userMiddleware.updateTheme` chưa dùng → theme chỉ ở localStorage | `user.middleware.ts:50` | Theme không đồng bộ backend |
| Suggestion card chỉ `addMessage` cục bộ, không gửi tới AI | `MessageList.tsx:17-34` | Click suggestion không tạo AI response |
| `message.slice.error`/`loading` gần như không được set trong flow streaming | `message.slice.ts` | State dư thừa / không phản ánh thực tế |
| Reuse: `conversationService.getMessages` và `messageService.getMessages` trùng logic | cả 2 middleware | Single Code Path bị vi phạm |

Chi tiết bug: xem `docs/bugs/chat-streaming/` và `docs/bugs/auth-firebase/`.