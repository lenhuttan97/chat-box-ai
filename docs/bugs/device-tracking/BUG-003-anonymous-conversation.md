# BUG-FT005-03 — Anonymous User Chat Flow Issues

- **Bug ID:** BUG-FT005-03
- **Feature:** FT-005 (Device Tracking)
- **Status:** ⏳ pending

## Problems

User không đăng nhập (anonymous) không thể:
1. Tạo thêm conversation mới
2. Cùng một thiết bị không thể thấy lịch sử conversation
3. Conversation mới tạo không xuất hiện trong sidebar

## Root Causes

### Issue 1: Thiếu userId khi tạo Conversation

```typescript
// conversations.controller.ts
const device = await this.deviceService.findOrCreate(...)
deviceId = device.id
// ❌ KHÔNG lấy userId từ device

const createDto = {
  name: message.substring(0, 50),
  deviceId: deviceId,
  // ❌ THIẾU userId!
}
```

### Issue 2: Device ID Type Mismatch

```
Frontend localStorage: "device_123" (STRING)
Backend Conversation: deviceId = "uuid-123" (UUID)
→ Query bằng string → Không tìm thấy!
```

**Chi tiết:**
- `device.id` = UUID trong database
- `device.deviceId` = String từ frontend
- Frontend query bằng string → Backend tìm bằng UUID → FAIL

### Issue 3: Conversation List không load khi mount

```typescript
// ConversationList.tsx
const { conversations, loadConversations, ... } = useConversations()
// ⚠️ loadConversations() KHÔNG ĐƯỢC GỌI trong useEffect
```

## Files Affected

- `apps/backend/src/modules/conversations/conversations.controller.ts`
- `apps/backend/src/modules/conversations/conversations.repository.ts`
- `apps/frontend/src/components/ConversationList.tsx`
- `apps/frontend/src/store/slices/conversation.slice.ts`

## Fix Required

### Fix 1: Thêm userId vào Conversation

```typescript
// conversations.controller.ts
const userId = device.userId  // ← Thêm dòng này
const createDto = {
  name: message.substring(0, 50),
  deviceId: deviceId,
  userId: userId,  // ← Thêm dòng này
}
```

### Fix 2: Device ID Type Consistency

**Option A - Query bằng device.deviceId (string):**
```typescript
// conversations.repository.ts
findConversationsByDeviceId(deviceId: string) {
  return this.prisma.conversation.findMany({
    where: { device: { deviceId } },  // Join qua relation
  })
}
```

**Option B - Frontend lưu UUID:**
- Backend trả về device UUID
- Frontend lưu UUID vào localStorage

### Fix 3: Auto-load Conversations

```typescript
// ConversationList.tsx
useEffect(() => {
  loadConversations()  // ← THÊM DÒNG NÀY!
}, [])
```

## Acceptance Criteria

- [ ] Anonymous user có thể tạo conversation mới
- [ ] Anonymous user cùng thiết bị thấy được lịch sử conversation
- [ ] Conversation có cả `deviceId` và `userId` (virtual user)
- [ ] Frontend hiển thị conversation mới ngay sau khi tạo (sidebar update)
- [ ] Frontend gọi `/conversations/device/:deviceId` để lấy danh sách cho anonymous user
- [ ] Device ID type nhất quán (string hoặc UUID)
- [ ] Conversation list load khi mount component
