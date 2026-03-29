# BUG-FT005-01 — Device Virtual User

- **Bug ID:** BUG-FT005-01
- **Feature:** FT-005 (Device Tracking)

## Problem

Device không có user liên kết khi người dùng chưa đăng nhập → không tạo được message.

## Root Cause

DeviceService không phân biệt trạng thái đăng nhập.

## Flow

### Mong muốn

| Case | Action |
|------|--------|
| Device mới + Chưa đăng nhập | Tạo user ảo → link vào device |
| Device đã tồn tại + Chưa đăng nhập | Chỉ update lastSeen, giữ nguyên user ảo cũ → xem được lịch sử |
| Đã đăng nhập | Không tạo user ảo, dùng user thật |

## Sub Tasks

- [ ] Device đã tồn tại → chỉ tracking lastSeen, không tạo user mới
- [ ] Giữ nguyên user ảo cũ → xem được lịch sử conversation trên cùng device

## Files Affected

- `apps/backend/src/modules/device/device.service.ts`

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| P1 | Identify Issue | ✅ done |
| P2 | Plan Solution | ⏳ pending |
| P3 | Implement | ⏳ pending |
| P4 | Test | ⏳ pending |

## Status

**✅ fixed**
