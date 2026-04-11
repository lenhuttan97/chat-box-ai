# Skill: Clarification — Làm rõ yêu cầu

## Mục đích
Đảm bảo agent hiểu đúng yêu cầu trước khi phân tích hoặc lập kế hoạch.
Bước BẮT BUỘC chạy trước analyze.md và planning.md.

---

## Thứ tự bắt buộc (KHÔNG được đảo)

```
[1] HỎI user         — thu thập yêu cầu ban đầu
        ↓
[2] CHECK docs       — tra cứu docs/ tại root project
        ↓
[3] CHECK codebase   — tra cứu code liên quan (nếu cần)
        ↓
[4] HỎI LẠI user    — làm rõ thông tin còn thiếu
                       hoặc xung đột với docs/codebase
        ↓
[5] XÁC NHẬN        — tóm tắt đầy đủ, user confirm
```

---

## Bước 1 — HỎI user trước tiên

Nhận yêu cầu từ user. Nếu yêu cầu còn mơ hồ → hỏi ngay để có đủ
thông tin định hướng cho việc tra cứu ở bước 2 và 3.

### Chạy Clarity Checklist

Đánh giá những gì đã biết và chưa biết:

#### Nhóm Business (B)
□ B1 — Tính năng phục vụ persona nào? (user, admin, guest?)
□ B2 — User muốn làm gì cụ thể? (action)
□ B3 — Kết quả / output mong đợi là gì?
□ B4 — Priority: must-have hay nice-to-have?

#### Nhóm Technical (T)
□ T1 — Ảnh hưởng DB schema? (cần Prisma migration?)
□ T2 — Cần API endpoint mới? (NestJS)
□ T3 — Cần component React mới?
□ T4 — Liên quan đến AI streaming?
□ T5 — Cần authentication / authorization?

#### Nhóm Scope (S)
□ S1 — Feature mới hay cải tiến feature cũ?
□ S2 — Có dependency với tính năng khác?
□ S3 — Có deadline hoặc constraint thời gian?

### Điều kiện KHÔNG cần hỏi thêm:
- Yêu cầu đã rõ hoàn toàn (pass checklist)
- User nói "làm ngay, không cần hỏi"
- Yêu cầu quá đơn giản, rõ ràng

### Khi cần hỏi — format thông báo trước:

```
🔍 Tôi cần làm rõ [N] điểm trước khi tra cứu.

Tổng quan:
- 📌 Business ([X] câu): liên quan đến [mô tả ngắn]
- ⚙️ Technical ([X] câu): liên quan đến [mô tả ngắn]
- 📐 Scope ([X] câu): liên quan đến [mô tả ngắn]

Bạn muốn trả lời tất cả cùng lúc hay từng câu một?
```

### Format hỏi tất cả (All-at-once):

```
📌 Business

[B1] [Câu hỏi]
→ Gợi ý: [option A] / [option B] / [option C]

⚙️ Technical

[T1] [Câu hỏi]
→ Gợi ý: [option A] / [option B]

📐 Scope

[S1] [Câu hỏi]
→ Gợi ý: [option A] / [option B]

Trả lời xong, tôi sẽ tra cứu docs và codebase rồi xác nhận lại.
```

### Format hỏi từng câu (Step-by-step):

Thứ tự: Business → Technical → Scope. Mỗi lượt 1 câu:

```
[B1 — còn N câu] [Câu hỏi]
→ Gợi ý: [option A] / [option B] / [option C]
```

---

## Bước 2 — CHECK docs (sau khi đã có thông tin từ user)

Dùng thông tin từ Bước 1 để tra cứu có mục tiêu, tiết kiệm token.

### Thứ tự tra cứu:

```
1. docs/features/INDEX.md         ← feature này đã tồn tại chưa?
2. docs/features/{name}/index.md  ← chi tiết feature nếu đã tồn tại
3. docs/tasks/INDEX.md           ← đã có task liên quan chưa?
4. docs/tasks/{name}/index.md    ← chi tiết tasks của feature
5. docs/bugs/INDEX.md            ← có bug liên quan không?
```

### Cấu trúc docs hiện tại:

```
docs/
├── features/
│   ├── INDEX.md
│   └── {feature-name}/
│       ├── index.md
│       ├── FT-001-chat-gemini-streaming.md
│       └── api.md (nếu có)
├── tasks/
│   ├── INDEX.md
│   └── {feature-name}/
│       ├── index.md
│       └── T001-name.md
└── bugs/
    ├── INDEX.md
    └── {bug-name}/
        ├── index.md
        └── B001-fix-name.md
```

### Quy tắc tiết kiệm token:

| Nguồn | Khi nào đọc |
|-------|------------|
| features/INDEX.md | Luôn đọc — nhỏ, định hướng nhanh |
| features/{name}/index.md | Chỉ khi feature đã tồn tại |
| tasks/INDEX.md | Luôn đọc — biết context hiện tại |
| bugs/INDEX.md | Chỉ khi yêu cầu liên quan fix/sửa |

### Ghi nhận từ docs:
- Feature đã tồn tại chưa? (FT-xxx)
- Task đã tồn tại chưa? (Txxx)
- Cần tạo mới hay cập nhật?
- Links giữa feature/task có chính xác không?

---

## Bước 3 — CHECK codebase (chỉ khi docs không đủ)

Tra cứu có mục tiêu dựa trên kết quả Bước 1 + 2.

### Thứ tự tra cứu codebase:

```
1. prisma/schema.prisma       ← schema DB hiện tại
2. src/modules/[module]/      ← module liên quan đã có gì?
3. src/components/[component] ← component liên quan đã có gì?
```

### Quy tắc bắt buộc:

| Nguồn | Quy tắc |
|-------|---------|
| prisma/schema.prisma | Chỉ đọc khi cần xác nhận DB schema |
| src/modules/ cụ thể | Chỉ đọc đúng module liên quan |
| src/components/ cụ thể | Chỉ đọc đúng component liên quan |
| Toàn bộ src/ | ❌ KHÔNG BAO GIỜ — quá tốn token |

### Ghi nhận từ codebase:
- Module/component nào đã có, có thể tái sử dụng
- Interface, type, schema hiện tại
- Pattern đang dùng trong codebase

---

## Bước 4 — HỎI LẠI user (nếu cần)

Sau khi check docs + codebase, so sánh với yêu cầu ban đầu của user.
Xác định xem có điểm nào cần làm rõ thêm không.

### Các trường hợp BẮT BUỘC hỏi lại:

| Tình huống | Ví dụ | Cần hỏi |
|-----------|-------|---------|
| Thông tin còn thiếu | Yêu cầu đề cập "lưu lịch sử" nhưng chưa rõ scope | Hỏi bổ sung |
| Xung đột với docs | Yêu cầu tạo FT-002 nhưng docs ghi FT-002 đã done | Làm rõ ý định |
| Xung đột với codebase | Yêu cầu thêm field vào schema nhưng field đã tồn tại | Xác nhận hành động |
| Dependency chưa có | Yêu cầu cần auth nhưng auth module chưa được build | Hỏi xử lý thế nào |
| Pattern khác codebase | Yêu cầu dùng pattern khác với codebase hiện tại | Xác nhận có muốn đổi không |

### Các trường hợp KHÔNG cần hỏi lại:
- Docs và codebase đều xác nhận yêu cầu là hợp lệ
- Không có thông tin mâu thuẫn
- Tất cả dependency đã sẵn sàng

### Format hỏi lại — gộp tất cả vào 1 lần:

```
🔄 Sau khi kiểm tra docs và codebase, tôi cần làm rõ thêm:

⚠️ Xung đột phát hiện:
- [mô tả xung đột cụ thể]
  → Docs/codebase hiện tại: [trạng thái]
  → Yêu cầu của bạn: [yêu cầu]
  → Bạn muốn xử lý thế nào?

❓ Thông tin còn thiếu:
- [câu hỏi bổ sung nếu có]
  → Gợi ý: [option A] / [option B]
```

---

## Bước 5 — XÁC NHẬN với user (BẮT BUỘC trước khi tiếp tục)

Tổng hợp tất cả từ Bước 1 + 2 + 3, trình bày cho user xác nhận:

```
✅ Tóm tắt những gì tôi hiểu:

Yêu cầu:
- Tính năng: [mô tả]
- Người dùng: [persona]
- Output mong đợi: [mô tả]

Từ docs:
- Đã có: [những gì tìm thấy liên quan]
- Chưa có: [cần tạo mới]
- Xung đột: [nếu có, và cách đã làm rõ]

Từ codebase:
- Module liên quan: [tên] — [trạng thái]
- Schema hiện tại: [mô tả ngắn nếu có]
- Pattern đang dùng: [mô tả ngắn]

Kế hoạch sơ bộ:
- [bước 1 dự kiến]
- [bước 2 dự kiến]

Tôi hiểu đúng không? Nếu đúng, tôi sẽ tiến hành phân tích ngay.
```

Chỉ tiếp tục sang analyze.md sau khi user xác nhận.
