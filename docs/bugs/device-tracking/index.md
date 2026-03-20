# Device Tracking Bugs

## Feature: Device Tracking - Backend (BE)

## Bugs

| Bug ID | Bug | Status |
|--------|-----|--------|
| BUG-001 | Device Virtual User | ✅ fixed |
| BUG-002 | User & Conversation Creation Error | ✅ fixed |
| BUG-003 | Anonymous User Cannot Create Conversation | ⏳ pending |

## Chi tiết

| Bug | File | Mô tả |
|------|------|-------|
| BUG-001 | [BUG-001-device-virtual-user.md](./BUG-001-device-virtual-user.md) | Device không có user, không tạo được message |
| BUG-002 | [BUG-002-user-creation-error.md](./BUG-002-user-creation-error.md) | Không thể tạo user và conversation với device |
| BUG-003 | [BUG-003-anonymous-conversation.md](./BUG-003-anonymous-conversation.md) | Anonymous user không tạo được conversation |

## Dependencies

- BUG-001 và BUG-002 liên quan đến nhau

## Related Features

- FT-005: Anonymous + Device Tracking
- FT-002: Authentication (Firebase)
