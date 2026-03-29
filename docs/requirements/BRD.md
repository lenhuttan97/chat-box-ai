# BRD — Business Requirements Document

## 1. Project Overview

### 1.1 Project Name
**Chat Box AI** — Real-time AI Chat Application

### 1.2 Project Type
Web Application (SaaS)

### 1.3 Core Value Proposition
Cho phép người dùng chat với AI (Gemini/OpenAI/Ollama) theo thời gian thực với streaming responses, hỗ trợ cả user đã đăng nhập và anonymous users qua device tracking.

---

## 2. Business Objectives

| Objective | Mô tả | Success Metric |
|-----------|-------|----------------|
| **O1** | Cung cấp trải nghiệm chat AI real-time với streaming | Response time < 3s |
| **O2** | Hỗ trợ đa dạng AI providers (Gemini, OpenAI, Ollama) | 3+ providers |
| **O3** | Cho phép user tùy chỉnh AI settings per conversation | System prompt, temperature, max tokens |
| **O4** | Hỗ trợ anonymous users mà không cần đăng nhập | Device-based tracking |
| **O5** | Xử lý file đính kèm (PDF, txt, docx) | Extract text từ file |

---

## 3. User Personas

### P1: Regular User (Đã đăng nhập)
- **Mô tả**: User có tài khoản Firebase (Google hoặc Email/Password)
- **Nhu cầu**:
  - Đăng nhập/đăng ký nhanh
  - Lưu trữ lịch sử chat vĩnh viễn
  - Tùy chỉnh AI settings per conversation
  - Đồng bộ conversations across devices

### P2: Anonymous User (Chưa đăng nhập)
- **Mô tả**: User không muốn đăng nhập
- **Nhu cầu**:
  - Chat ngay lập tức không cần đăng ký
  - Device tracking để lưu lịch sử local
  - Đăng nhập sau để migrate data

### P3: Power User
- **Mô tả**: User muốn kiểm soát AI behavior
- **Nhu cầu**:
  - Custom system prompt
  - Điều chỉnh temperature, max tokens
  - Chọn AI model/provider
  - Xem context token usage

---

## 4. User Stories

| ID | User Story | Priority |
|----|------------|----------|
| **US01** | Là một user, tôi muốn đăng nhập bằng Google để sử dụng app nhanh chóng | P0 |
| **US02** | Là một user, tôi muốn gửi tin nhắn và nhận response streaming real-time | P0 |
| **US03** | Là một user, tôi muốn tạo nhiều conversations để phân loại chủ đề | P0 |
| **US04** | Là một user, tôi muốn tùy chỉnh AI role/system prompt per conversation | P1 |
| **US05** | Là một anonymous user, tôi muốn chat mà không cần đăng nhập | P1 |
| **US06** | Là một user, tôi muốn attach file và AI phân tích nội dung | P1 |
| **US07** | Là một user, tôi muốn tự động cài đặt AI settings dựa trên nội dung chat | P2 |
| **US08** | Là một user, tôi muốn chuyển đổi giữa các AI providers (Gemini, OpenAI, Ollama) | P2 |
| **US09** | Là một user, tôi muốn xem danh sách devices đã đăng nhập | P3 |
| **US10** | Là một user, tôi muốn đổi theme (light/dark/auto) | P3 |

---

## 5. Functional Requirements

### 5.1 Authentication (FT-002)
- **FR01**: Login với Google via Firebase
- **FR02**: Login với Email/Password
- **FR03**: Đăng ký tài khoản mới
- **FR04**: Logout
- **FR05**: Update password
- **FR06**: Update profile (displayName, photoUrl)
- **FR07**: Refresh token tự động

### 5.2 Chat & Conversations (FT-001, FT-003)
- **FR08**: Tạo conversation mới
- **FR09**: Liệt kê conversations (paginated)
- **FR10**: Xem chi tiết conversation
- **FR11**: Cập nhật conversation name/settings
- **FR12**: Xóa conversation
- **FR13**: Gửi tin nhắn và nhận streaming response (SSE)
- **FR14**: Xem lịch sử tin nhắn (paginated)

### 5.3 Chat Settings (FT-003, FT-004)
- **FR15**: Đặt system prompt per conversation
- **FR16**: Đặt AI provider (gemini/openai/ollama)
- **FR17**: Đặt AI model
- **FR18**: Đặt temperature (0.0 - 2.0)
- **FR19**: Đặt max tokens (1 - 8192)
- **FR20**: Đặt context token limit
- **FR21**: Auto-analyze để tự động cài đặt settings

### 5.4 Device Tracking (FT-005)
- **FR22**: Tạo device record khi user truy cập
- **FR23**: Track device info (browser, OS, IP, timezone)
- **FR24**: Link device với user account
- **FR25**: Xem danh sách devices của user

### 5.5 File Preprocessing (FT-007)
- **FR26**: Upload file (PDF, TXT, DOCX)
- **FR27**: Extract text từ file
- **FR28**: Attach file vào tin nhắn
- **FR29**: Kiểm tra trạng thái xử lý file

### 5.6 Message Processing (FT-010)
- **FR30**: Intent detection - phát hiện ý định user
- **FR31**: Question decomposition - chia nhỏ câu hỏi phức tạp
- **FR32**: Context augmentation - bổ sung context từ lịch sử
- **FR33**: Message routing - định tuyến đến handler phù hợp

### 5.7 Profile & Settings
- **FR34**: Xem profile
- **FR35**: Cập nhật theme (light/dark/auto)

---

## 6. Non-Functional Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| **NFR01** | Performance | Streaming response bắt đầu trong 3s |
| **NFR02** | Availability | 99.5% uptime |
| **NFR03** | Security | JWT tokens, Firebase auth, password hashing |
| **NFR04** | Scalability | Hỗ trợ 1000 concurrent users |
| **NFR05** | Data Retention | Anonymous: 30 days, Logged in: Unlimited |
| **NFR06** | Responsiveness | Mobile-friendly (320px+) |

---

## 7. Business Rules

| ID | Rule |
|----|------|
| **BR01** | Anonymous conversations auto-delete sau 30 ngày không hoạt động |
| **BR02** | Mỗi conversation chỉ có 1 user hoặc 1 device |
| **BR03** | System prompt max 4000 characters |
| **BR04** | Max 50 conversations per user |
| **BR05** | File upload max 10MB |
| **BR06** | Guest user có thể upgrade thành registered user và giữ lại conversations |

---

## 8. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| AI API rate limits | High | Implement queue, fallback providers |
| Device fingerprint collision | Medium | Use UUID + user agent hashing |
| Token expiration during chat | Medium | Auto-refresh token |
| Large file processing timeout | Medium | Async processing, status polling |

---

## 9. Out of Scope

- Voice/Audio chat
- Image generation
- Multi-user chat rooms
- Team collaboration
- Webhook integrations
- Mobile apps (iOS/Android)

---

## 10. Success Criteria

- [ ] User có thể đăng nhận bằng Google trong 10s
- [ ] Streaming response bắt đầu trong 3s
- [ ] Anonymous user có thể chat ngay lập tức
- [ ] File upload và extract text thành công
- [ ] Auto-settings được áp dụng sau message đầu tiên
