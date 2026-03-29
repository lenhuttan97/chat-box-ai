# SRS — Software Requirements Specification

## 1. Technical Architecture

### 1.1 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite + TypeScript |
| Backend | NestJS + TypeScript |
| Database | SQLite (dev) / PostgreSQL (prod) |
| ORM | Prisma |
| Auth | Firebase Authentication + JWT |
| AI Providers | Google Gemini, OpenAI, Ollama |
| File Processing | pdf-parse, mammoth, textract |

### 1.2 Project Structure

```
apps/
├── backend/               # NestJS API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/      # Authentication
│   │   │   ├── users/     # User management
│   │   │   ├── conversations/  # Chat & messages
│   │   │   ├── device/    # Device tracking
│   │   │   ├── files/    # File upload & processing
│   │   │   ├── ai/       # AI service
│   │   │   └── message-processing/  # NLP pipeline
│   │   └── prisma/
│   └── prisma/
│       └── schema.prisma
│
└── frontend/              # React UI
    └── src/
        ├── components/    # UI components
        ├── pages/         # Page components
        ├── store/         # Redux Toolkit
        ├── auth/          # Auth context
        └── services/      # API services
```

---

## 2. Data Models

### 2.1 Entity Relationship

```
User (1) ─────< (N) Conversation
User (1) ─────< (N) Device
Device (1) ───< (N) Conversation
Conversation (1) ──< (N) Message
Conversation (1) ──< (N) File (optional)
```

### 2.2 Database Schema

#### User
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto | Unique identifier |
| email | String | unique, nullable | User email |
| password | String | nullable | Hashed password |
| displayName | String | nullable | Display name |
| firebaseUid | String | unique, nullable | Firebase UID |
| photoUrl | String | nullable | Profile photo URL |
| provider | String | nullable | Auth provider (google/email) |
| themeSetting | String | default: 'auto' | Theme preference |
| createdAt | DateTime | auto | Creation timestamp |
| updatedAt | DateTime | auto | Last update timestamp |

#### Conversation
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto | Unique identifier |
| name | String | required | Conversation name |
| userId | UUID | FK, nullable | Owner user |
| deviceId | UUID | FK, nullable | Owner device |
| provider | String | default: 'gemini' | AI provider |
| model | String | nullable | AI model |
| systemPrompt | String | nullable | Custom system prompt |
| autoPrompt | String | nullable | Auto-generated context |
| contextToken | Int | default: 4096 | Context window size |
| temperature | Float | default: 0.7 | AI creativity |
| maxTokens | Int | default: 2048 | Max response tokens |
| messageCount | Int | default: 0 | Total messages |
| createdAt | DateTime | auto | Creation timestamp |
| updatedAt | DateTime | auto | Last update timestamp |

#### Message
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto | Unique identifier |
| conversationId | UUID | FK | Parent conversation |
| role | String | required | 'user' or 'assistant' |
| content | String | required | Message content |
| createdAt | DateTime | auto | Creation timestamp |

#### Device
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto | Unique identifier |
| deviceId | String | unique | Browser/device fingerprint |
| browser | String | nullable | Browser name |
| os | String | nullable | Operating system |
| language | String | nullable | Browser language |
| timezone | String | nullable | User timezone |
| screenResolution | String | nullable | Screen size |
| ipAddress | String | nullable | Last known IP |
| isOnline | Boolean | default: false | Online status |
| userId | UUID | FK, nullable | Linked user |
| createdAt | DateTime | auto | Creation timestamp |
| updatedAt | DateTime | auto | Last update timestamp |

#### File
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, auto | Unique identifier |
| filename | String | required | Stored filename |
| originalName | String | required | Original filename |
| mimeType | String | required | File MIME type |
| size | Int | required | File size (bytes) |
| status | String | default: 'processing' | processing/completed/failed |
| extractedText | String | nullable | Extracted text content |
| error | String | nullable | Error message |
| createdAt | DateTime | auto | Creation timestamp |
| updatedAt | DateTime | auto | Last update timestamp |

---

## 3. API Specifications

### 3.1 Response Format

**Success Response:**
```json
{
  "data": { ... },
  "message": "Success message",
  "statusCode": 200
}
```

**Paginated Response:**
```json
{
  "data": [...],
  "message": "...",
  "statusCode": 200,
  "totalElement": 100
}
```

**Error Response:**
```json
{
  "message": "Error message",
  "statusCode": 400,
  "errors": [...]
}
```

### 3.2 Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login with email/password | No |
| POST | `/auth/google` | Login with Google | No |
| POST | `/auth/refresh-token` | Refresh JWT token | No |
| POST | `/auth/logout` | Logout | Optional |
| PUT | `/auth/password` | Update password | JWT |
| PUT | `/auth/profile` | Update profile | JWT |

### 3.3 Conversation Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/conversations` | Create new conversation | Optional |
| GET | `/conversations` | List all conversations | Optional |
| GET | `/conversations/user/:userId` | List user conversations | Optional |
| GET | `/conversations/device/:deviceId` | List device conversations | Optional |
| GET | `/conversations/:id` | Get conversation details | Optional |
| PUT | `/conversations/:id` | Update conversation | Optional |
| DELETE | `/conversations/:id` | Delete conversation | Optional |
| GET | `/conversations/:id/messages` | List messages | Optional |
| POST | `/conversation/messages` | Send message (SSE) | Optional |

### 3.4 User Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/users` | Create user | No |
| GET | `/users` | List all users | JWT |
| GET | `/users/:id` | Get user by ID | JWT |
| PUT | `/users/:id` | Update user | JWT |
| DELETE | `/users/:id` | Delete user | JWT |
| GET | `/users/profile` | Get current user profile | JWT |
| PUT | `/users/me/theme` | Update theme | JWT |

### 3.5 File Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/files/upload` | Upload file | Optional |
| GET | `/files/:id` | Get file metadata | Optional |
| GET | `/files/:id/content` | Get extracted content | Optional |
| GET | `/files/:id/status` | Get processing status | Optional |

### 3.6 Device Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/devices` | List user devices | JWT |
| PATCH | `/devices/:id` | Update device | JWT |

---

## 4. UI/UX Specifications

### 4.1 Pages

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | Login with email/password |
| Register | `/register` | Register new account |
| Chat | `/` | Main chat interface |
| Profile | `/profile` | User profile settings |

### 4.2 Components

| Component | Description |
|-----------|-------------|
| ChatLayout | Main layout with sidebar |
| ConversationList | List of conversations |
| ChatWindow | Chat message area |
| MessageList | Scrollable message list |
| MessageItem | Single message bubble |
| InputBar | Message input with file attach |
| ChatSettingsModal | AI settings popup |
| ThemeModal | Theme selection popup |

### 4.3 Theme

- **Light**: White background, dark text
- **Dark**: Dark background, light text
- **Auto**: Follow system preference

---

## 5. Security Requirements

### 5.1 Authentication
- JWT access token (15 min expiry)
- JWT refresh token (7 days expiry)
- Tokens stored in httpOnly cookies
- Firebase ID token verification

### 5.2 Authorization
- Role-based access control
- User can only access own data
- Device linking requires authentication

### 5.3 Data Protection
- Passwords hashed with bcrypt
- Input sanitization
- Rate limiting on auth endpoints

---

## 6. Acceptance Criteria

### AC01: Authentication
- [ ] User can register with email/password
- [ ] User can login with Google
- [ ] User can login with email/password
- [ ] JWT tokens are automatically refreshed
- [ ] User can logout

### AC02: Chat
- [ ] User can create new conversation
- [ ] User can send message and receive streaming response
- [ ] Conversation history is persisted
- [ ] Messages are displayed in correct order

### AC03: Settings
- [ ] User can set custom system prompt
- [ ] User can adjust temperature, max tokens
- [ ] User can select AI provider
- [ ] Auto-settings apply after first message

### AC04: Anonymous User
- [ ] User can chat without login
- [ ] Device is tracked automatically
- [ ] Conversations persist per device

### AC05: File Upload
- [ ] User can upload PDF/TXT/DOCX
- [ ] Text is extracted automatically
- [ ] File content is attached to message

### AC06: UI/UX
- [ ] App is responsive (320px+)
- [ ] Theme can be switched
- [ ] Loading states are shown
- [ ] Error messages are user-friendly
