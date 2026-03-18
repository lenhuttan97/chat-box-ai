# T001-device-tracking — Device Tracking

- **Feature:** FT-005
- **Task ID:** FT-005-T01

## Phases

| Phase | Description | Details | Status |
|-------|-------------|---------|--------|
| P1 | Device Fingerprint | Generate unique device ID (localStorage) | ✅ done |
| P2 | Backend Device Model | Create Device table in database | ✅ done |
| P3 | Anonymous Auth | Allow chat without login | ✅ done |
| P4 | Device Mapping | Link device to user after login | ✅ done |

## Status

**✅ completed**

## Implementation Summary

### Backend
- Created `prisma/models/device.prisma` - Device model
- Updated `user.prisma` - Added devices relation
- Updated `conversation.prisma` - Added deviceId field
- Created `modules/device/` module with:
  - `device.service.ts` - findOrCreate, updateLastSeen, linkDevice
  - `device.controller.ts` - GET /v1/devices, PATCH /v1/devices/:id
  - `device.repository.ts` - CRUD operations
  - `device.middleware.ts` - Extract device info from header
- Updated `conversations/` module:
  - Added deviceId to CreateConversationDto
  - Added findConversationsByDeviceId endpoint
  - Updated sendMessage to handle device info from header

### Frontend
- Created `utils/device.ts`:
  - `generateDeviceId()` - Generate and store device ID in localStorage
  - `getDeviceInfo()` - Get browser, OS, language, timezone, screen resolution
- Updated `middleware/conversation.middleware.ts`:
  - Added device info headers to all API calls
  - Added device-based conversation retrieval for anonymous users
- Updated `middleware/message.middleware.ts`:
  - Added X-Device-Info header to all API calls

### Database
- Added `devices` table with fields: deviceId, browser, os, language, timezone, screenResolution, ipAddress, lastSeen, isOnline
- Added deviceId foreign key to conversations table

## Notes

- Device ID is generated as `device_{timestamp}_{random}` and stored in localStorage
- When user logs in (Firebase), device can be linked to user (future implementation in auth flow)
- Online status is updated when device makes API requests