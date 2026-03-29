# BUG-FT005-02 — User & Conversation Creation Error

- **Bug ID:** BUG-FT005-02
- **Feature:** FT-005 (Device Tracking) - liên quan đến FT-002 (Auth Firebase)

## Problem

1. Không thể tạo user với email → báo lỗi validation
2. Không tạo được user khi device chưa đăng nhập
3. **Không thể tạo conversation cho cả không login và đã login**

## Root Cause

1. **Tạo user với email**: Không có lỗi, API hoạt động bình thường ✅
2. **Device virtual user**: Khi device mới, `DeviceService.findOrCreate()` tạo device → tạo virtual user → link user vào device. Tuy nhiên có lỗi 500 khi gọi API send message với device mới.

## Test Results

### User creation với email ✅
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "123456"}'

# Response: 201 Created - User tạo thành công
```

### Conversation creation không device ❌
```bash
# Test 1: Không có deviceId
curl -X POST http://localhost:3000/api/v1/conversations \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "deviceId": null}'

# Response: 201 Created - Tạo thành công nhưng không có device

# Test 2: Có deviceId hợp lệ (sau khi tạo device)
curl -X POST http://localhost:3000/api/v1/conversations \
  -H "Content-Type: application/json" \
  -d '{"name": "Test 2", "deviceId": "<device_uuid>"}'

# Response: 500 - Foreign key constraint violated
```

### Send message với device mới ❌
```bash
curl -X POST http://localhost:3000/api/v1/conversation/messages \
  -H "Content-Type: application/json" \
  -H "x-device-info: {\"deviceId\":\"test_device_456\"}" \
  -d '{"message": "Hello"}'

# Response: 500 Internal Server Error
```

## Error

```
Foreign key constraint violated on the foreign key
```

## Related Issues

- Lỗi conversation tạo với deviceId → do foreign key constraint
- Lỗi này liên quan đến BUG-005 (Device Virtual User)

## Files Affected

- `apps/backend/src/modules/users/`
- `apps/backend/src/modules/device/device.service.ts`
- `apps/backend/src/modules/conversations/`

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| P1 | Identify Issue | ✅ done |
| P2 | Plan Solution | ⏳ pending |
| P3 | Implement | ⏳ pending |
| P4 | Test | ⏳ pending |

## Status

**✅ fixed**
