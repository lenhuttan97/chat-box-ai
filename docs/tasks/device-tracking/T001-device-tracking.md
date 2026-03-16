# T001 — Device Tracking Implementation

## Thông tin

| Trường | Giá trị |
|--------|---------|
| Task ID | T001 |
| Feature | FT-005 (Anonymous + Device Tracking) |
| Trạng thái | pending |
| Ngày bắt đầu | - |

---

## Mô tả

Implement anonymous user support và device tracking.

---

## Phases

### Phase 1: Database

- [ ] 1.1 Update Prisma schema - thêm device table
- [ ] 1.2 Run migration
- [ ] 1.3 Update conversation relation

### Phase 2: Backend - Device Service

- [ ] 2.1 Create device.service.ts
- [ ] 2.2 Create device.module.ts
- [ ] 2.3 Implement findOrCreateDevice()
- [ ] 2.4 Implement updateDeviceOnlineStatus()

### Phase 3: Backend - Auth Integration

- [ ] 3.1 Update AuthService - link anonymous device khi login
- [ ] 3.2 Update ConversationsController - accept device header

### Phase 4: Frontend - Device Utils

- [ ] 4.1 Create src/utils/device.ts
- [ ] 4.2 Create getDeviceInfo() function
- [ ] 4.3 Store device_id in localStorage

### Phase 5: Frontend - API Integration

- [ ] 5.1 Update message.middleware.ts - gửi X-Device-Info header
- [ ] 5.2 Update conversation.middleware.ts - gửi X-Device-Info header

### Phase 6: Testing

- [ ] 6.1 Test anonymous chat
- [ ] 6.2 Test login + anonymous device link
- [ ] 6.3 Test multi-device

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `apps/backend/prisma/schema.prisma` | Update |
| `apps/backend/src/modules/device/` | Create |
| `apps/backend/src/modules/auth/auth.service.ts` | Update |
| `apps/backend/src/modules/conversations/conversations.controller.ts` | Update |
| `apps/frontend/src/utils/device.ts` | Create |
| `apps/frontend/src/middleware/message.middleware.ts` | Update |
| `apps/frontend/src/middleware/conversation.middleware.ts` | Update |

---

## Acceptance Criteria

- [ ] Anonymous user có thể chat mà không cần login
- [ ] Device info được lưu vào DB
- [ ] Khi login, device được link với user
- [ ] User có thể xem danh sách thiết bị (sau khi login)
- [ ] Nhiều device có thể thuộc 1 user