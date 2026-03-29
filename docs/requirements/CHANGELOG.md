# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Requirements documentation (BRD, SRS)
- API Documentation

---

## [v1.0.0] - 2026-03-29

### Features

#### FT-001: Chat với Gemini Streaming
- Real-time streaming responses với Google Gemini API
- Server-Sent Events (SSE) protocol
- Conversation management (create, list, update, delete)
- Message history with pagination

#### FT-002: Authentication (Firebase)
- Google Login via Firebase
- Email/Password registration and login
- JWT token management (access + refresh tokens)
- Token stored in httpOnly cookies
- Profile management (displayName, photoUrl)
- Password update

#### FT-003: Chat Settings
- Custom system prompt per conversation
- Temperature adjustment (0.0 - 2.0)
- Max tokens configuration (1 - 8192)
- AI provider selection
- AI model selection

#### FT-004: Auto Chat Settings
- Automatic context analysis
- Auto-generated system prompts based on conversation
- Dynamic temperature and max tokens adjustment
- Context token optimization

#### FT-005: Anonymous + Device Tracking
- Device fingerprint tracking
- Anonymous user support
- Device-browser-OS info collection
- Device linking to user account
- Multiple device management

#### FT-006: AI Provider Selection
- Google Gemini support
- OpenAI support
- Ollama (local) support
- Provider factory pattern
- Easy provider switching

#### FT-007: File Preprocessing
- File upload (PDF, TXT, DOCX)
- Text extraction from files
- File attachment to messages
- Processing status tracking

#### FT-008: Profile Management
- User profile view and edit
- Theme settings (light/dark/auto)
- Account management

#### FT-009: AI Service Refactor
- Provider factory pattern
- API key pool management
- Enhanced error handling
- Fallback mechanisms

#### FT-010: Message Processing Pipeline
- Intent detection
- Question decomposition
- Context augmentation
- Message routing

### Bug Fixes

#### Chat Streaming (FT-001)
- BUG-FT001-01: Missing loading effect on send button
- BUG-FT001-02: Streaming response not smooth
- BUG-FT001-03: Message list jumps during streaming
- BUG-FT001-04: Conversation list re-renders

#### Device Tracking (FT-005)
- BUG-FT005-01: Device creates virtual user issue
- BUG-FT005-02: User & conversation creation error

---

## [v0.1.0] - 2026-03-12

### Initial Setup
- Project initialization
- Backend: NestJS + Prisma setup
- Frontend: React + Vite + Tailwind + Redux
- Database: SQLite (dev) / PostgreSQL (prod) schema
- Firebase authentication setup
- Gemini API integration

---

## Version History

| Version | Date | Status |
|---------|------|--------|
| v1.0.0 | 2026-03-29 | Released |
| v0.1.0 | 2026-03-12 | Initial |

---

## Migration Notes

### v0.1.0 → v1.0.0

**Breaking Changes:**
- None

**New Dependencies:**
- Firebase Admin SDK
- pdf-parse
- mammoth
- textract

**Database Changes:**
- Added `themeSetting` field to User
- Added Device model
- Added File model
- Extended Conversation with AI settings

---

## Upcoming Features (Planned)

- [ ] Voice/Audio chat
- [ ] Image generation
- [ ] Multi-user chat rooms
- [ ] Team collaboration
- [ ] Mobile apps (iOS/Android)
- [ ] Webhook integrations
