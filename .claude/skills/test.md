# Skill: Test — Viết và chạy test backend

## Mục đích
Đảm bảo mọi backend code đều có test đi kèm.
Theo dõi kết quả, phân tích log, đề xuất fix khi fail.
Chạy sau mỗi lần viết backend code (NestJS).

---

## Stack test

- **Unit test**: Jest (mặc định NestJS)
- **E2E / Integration**: Jest + Supertest
- **Config**: `jest.config.ts` tách riêng unit và e2e

---

## Bước 1 — Viết test song song với code

Với MỖI file backend được tạo/sửa, PHẢI tạo file test tương ứng:

```
src/modules/chat/chat.service.ts
    → src/modules/chat/chat.service.spec.ts     (unit)

src/modules/chat/chat.controller.ts
    → src/modules/chat/chat.controller.spec.ts  (integration)

test/
    → test/chat.e2e-spec.ts                     (e2e endpoint)
```

### Cấu trúc test bắt buộc cho mỗi file

```typescript
describe('[ClassName]', () => {

  // Setup
  beforeEach(async () => { ... });
  afterEach(() => { ... });

  describe('[methodName]', () => {
    it('should [expected behavior] when [condition]', async () => {
      // Arrange
      // Act
      // Assert
    });

    it('should throw [error] when [invalid condition]', async () => {
      // ...
    });
  });

});
```

### Checklist test tối thiểu per service method

- [ ] Happy path (đầu vào hợp lệ → kết quả đúng)
- [ ] Edge case (đầu vào biên)
- [ ] Error case (đầu vào không hợp lệ → throw đúng exception)
- [ ] Mock external dependency (AI provider, DB)

---

## Bước 2 — Hỏi user trước khi chạy test

Sau khi viết xong test, KHÔNG tự động chạy. Hỏi trước:

```
🧪 Test đã sẵn sàng:

File test đã tạo:
- src/modules/chat/chat.service.spec.ts (5 test cases)
- src/modules/chat/chat.controller.spec.ts (3 test cases)
- test/chat.e2e-spec.ts (2 test cases)

Bạn có muốn chạy test không?
(unit / integration / e2e / tất cả / bỏ qua)
```

---

## Bước 3 — Chạy test theo lựa chọn

```bash
# Unit test
npx jest --testPathPattern="\.spec\.ts$" --no-coverage

# E2E test
npx jest --config jest-e2e.config.ts

# Tất cả
npx jest

# Một file cụ thể
npx jest src/modules/chat/chat.service.spec.ts --verbose
```

---

## Bước 4 — Đọc và phân tích kết quả

### Nếu tất cả PASS ✅

```
✅ Test kết quả:
- Unit:  X/X passed
- E2E:   X/X passed
- Thời gian: Xs

Sẵn sàng commit.
```

### Nếu có test FAIL ❌

**KHÔNG được tự ý fix.** Thực hiện theo quy trình:

#### Bước 4a — Thu thập log đầy đủ

```bash
npx jest --verbose 2>&1 | tee test-output.log
```

Đọc và phân tích:
- Test nào fail?
- Error message là gì?
- Stack trace trỏ đến dòng nào?
- Expected vs Received là gì?

#### Bước 4b — Phân loại nguyên nhân

| Loại | Dấu hiệu | Hướng xử lý |
|------|---------|-------------|
| **Code bug** | Logic sai, kết quả không đúng yêu cầu | Fix code |
| **Test data sai** | Mock/fixture không khớp với schema thực | Cập nhật test data |
| **Test logic sai** | Test assert sai, không đúng yêu cầu gốc | Cập nhật test logic |
| **Environment** | DB chưa migrate, env thiếu | Fix môi trường |
| **Dependency mock** | Mock thiếu hoặc sai | Cập nhật mock |

#### Bước 4c — Đề xuất phương án cho user chọn

```
❌ Test fail — phân tích log:

Test: "should return message when chat is called"
Error: Expected 200, received 500
Cause: ChatService.sendMessage throws because AI_API_KEY is undefined

Phân tích: Đây là lỗi environment (thiếu API key trong test setup),
không phải lỗi logic code.

Đề xuất phương án:
[A] Cập nhật test data — thêm mock AI_API_KEY vào test setup
    → Giữ nguyên code, chỉ fix test environment
    → Phù hợp: không thay đổi logic

[B] Xem lại code ChatService — có thể cần handle trường hợp key undefined
    → Thêm validation + throw meaningful error
    → Phù hợp: nếu muốn code robust hơn

Bạn chọn phương án nào? (A / B / phân tích thêm)
```

---

## Bước 5 — Thực hiện fix sau khi user chọn

### Nguyên tắc bất biến khi fix

```
❌ KHÔNG được làm:
- Sửa assertion test để match với output sai của code
- Xóa test case đang fail
- Comment out test
- Sửa code làm sai logic ban đầu chỉ để test pass
- Tự ý quyết định sửa code hay sửa test mà không hỏi

✅ ĐƯỢC phép làm:
- Fix bug thực sự trong code (logic sai với yêu cầu)
- Cập nhật test data / mock cho đúng với schema hiện tại
- Cập nhật test logic nếu yêu cầu gốc đã thay đổi (phải có xác nhận)
- Thêm test case còn thiếu
```

### Sau khi fix → chạy lại test

```bash
npx jest --verbose
```

Nếu vẫn fail → lặp lại Bước 4. Tối đa 3 vòng.
Nếu sau 3 vòng vẫn fail → báo cáo user, không tự ý tiếp tục.

---

## Bước 6 — Báo cáo kết quả cuối

```
✅ Test hoàn tất:

Kết quả:
- Unit:        X/X passed
- Integration: X/X passed
- E2E:         X/X passed

Đã fix:
- [mô tả fix nếu có]

Sẵn sàng tiếp tục / commit.
```

---

## Quy tắc bảo vệ test integrity

| Tình huống | Hành động đúng |
|-----------|---------------|
| Test fail do code bug | Fix code, giữ nguyên test |
| Test fail do test data cũ | Cập nhật mock/fixture, giữ nguyên assertion |
| Test fail do yêu cầu thay đổi | Hỏi user xác nhận yêu cầu mới, sau đó mới sửa test |
| Test fail do môi trường | Fix setup, không sửa code hoặc test logic |
| Test pass nhưng logic nghi ngờ | Báo cáo user, không tự pass qua |

---

## Bước 7 — Dọn dẹp ports sau test

SAU KHI hoàn thành test (pass/fail/stop), LUÔN luôn dọn dẹp các port đang mở:

```bash
# Kiểm tra và tắt các port dev
# Frontend (Vite): 5173
# Backend (NestJS): 4000
# Database: 5432, 3306

lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs -r kill -9
lsof -i :4000 | grep LISTEN | awk '{print $2}' | xargs -r kill -9
```

Hoặc kill all node processes liên quan:
```bash
# Tắt tất cả dev server processes
pkill -f "vite" || true
pkill -f "nest start" || true
pkill -f "node.*dev" || true
```

**Lý do**: Tránh port conflicts khi chạy test tiếp theo hoặc khi user start dev server.
