# Skill: Token Guard — Quản lý token & đóng phiên an toàn

## Mục đích
Theo dõi lượng token đã dùng trong phiên làm việc.
Khi đạt ngưỡng cảnh báo → dừng đúng lúc, lưu trạng thái,
đảm bảo phiên tiếp theo biết chính xác cần làm gì.

---

## Ngưỡng token

| Mức | Ngưỡng | Hành động |
|-----|--------|-----------|
| 🟡 Cảnh báo | 80% context window | Thông báo cho user, hoàn thành bước hiện tại rồi dừng |
| 🔴 Bắt buộc dừng | 90% context window | Dừng ngay, lưu SESSION.md, hướng dẫn user tiếp tục |

> Ước tính token đã dùng dựa trên độ dài conversation.
> Không cần chính xác tuyệt đối — ưu tiên an toàn hơn tận dụng.

---

## Bước 1 — Kiểm tra token (khi nào chạy)

Chạy kiểm tra token SAU các thời điểm:
- Sau khi đọc docs/codebase trong bước CLARIFY
- Sau khi hoàn thành ANALYZE
- Sau khi hoàn thành PLANNING
- Sau mỗi task lớn trong quá trình thực thi

Format tự đánh giá:
```
[Token Check]
Ước tính đã dùng: ~X% context window
Trạng thái: 🟢 Bình thường / 🟡 Cảnh báo / 🔴 Dừng ngay
```

---

## Bước 2 — Khi đạt ngưỡng 🟡 80%

Thông báo cho user trước khi tiếp tục:

```
⚠️ Token Warning — đã dùng ~80% context window.

Tôi sẽ hoàn thành [bước hiện tại] rồi dừng lại.
Sau đó tôi sẽ lưu SESSION.md để phiên tiếp theo
có thể tiếp tục đúng chỗ.

Bạn có muốn tôi tiếp tục hoàn thành bước này không?
```

---

## Bước 3 — Khi đạt ngưỡng 🔴 90% — Lưu SESSION.md

Dừng mọi công việc đang làm, tạo ngay file `.agent/sessions/SESSION-[DATE]-[N].md`:

### Template SESSION.md

```markdown
# Session Handoff — [DATE] [TIME]

## Trạng thái khi dừng
- Phiên số: [N]
- Dừng lúc: [bước nào trong flow]
- Lý do dừng: Token limit (~90%)

## Yêu cầu đang xử lý
- Yêu cầu gốc từ user: "[nội dung nguyên văn]"
- Đã làm rõ chưa (Clarify): Có / Chưa
- Tóm tắt những gì đã hiểu: [mô tả]

## Tiến độ

### ✅ Đã hoàn thành trong phiên này
- [Bước / task đã xong]
- [Bước / task đã xong]

### 🔄 Đang dở dang (dừng ở đây)
- Bước: [tên bước]
- Đã làm đến: [mô tả cụ thể]
- Còn lại cần làm: [mô tả cụ thể]

### 📋 Chưa bắt đầu
- [Danh sách bước / task chưa làm theo thứ tự]

## Quyết định & Assumptions đã xác nhận
> Những gì đã được user xác nhận, không cần hỏi lại

| Điểm | Quyết định |
|------|-----------|
| [vấn đề] | [user đã chọn gì] |

## Câu hỏi còn treo (chưa có câu trả lời)
- [ ] [Câu hỏi chưa được trả lời]

## Docs đã cập nhật trong phiên này
- docs/features/INDEX.md: [tóm tắt thay đổi hoặc "Không thay đổi"]
- docs/tasks/INDEX.md: [tóm tắt thay đổi hoặc "Không thay đổi"]
- docs/bugs/INDEX.md: [tóm tắt thay đổi hoặc "Không thay đổi"]

## Hướng dẫn phiên tiếp theo

Khi bắt đầu phiên mới, paste đoạn sau:

---
[SESSION RESUME]
Đọc file: .agent/sessions/SESSION-[DATE]-[N].md
Đọc docs hiện tại: docs/features/INDEX.md, docs/tasks/INDEX.md, docs/bugs/INDEX.md

Tóm tắt nhanh cho tôi:
1. Đang làm yêu cầu gì?
2. Còn lại cần làm những gì?
3. Có câu hỏi nào còn treo không?

Sau đó tiếp tục từ bước: [tên bước cụ thể]
---
```

---

## Bước 4 — Thông báo đóng phiên cho user

Sau khi lưu SESSION.md, thông báo:

```
🔴 Phiên làm việc đã được lưu lại.

📄 File: .agent/sessions/SESSION-[DATE]-[N].md

Tóm tắt nhanh:
✅ Đã hoàn thành: [danh sách ngắn]
🔄 Đang dở: [bước đang làm]
📋 Còn lại: [danh sách ngắn]

Để tiếp tục, mở phiên mới và paste đoạn RESUME
ở cuối file SESSION.md vào đầu cuộc trò chuyện.
```

---

## Quy tắc đặt tên file SESSION

```
SESSION-YYYYMMDD-1.md   ← phiên đầu tiên trong ngày
SESSION-YYYYMMDD-2.md   ← phiên thứ hai trong ngày
SESSION-YYYYMMDD-N.md   ← tiếp tục tăng
```

Không xóa file SESSION cũ — giữ lại làm lịch sử.

---

## Quy tắc tiết kiệm token trong phiên (áp dụng thường xuyên)

| Tình huống | Hành động tiết kiệm |
|-----------|-------------------|
| Đọc docs | Chỉ đọc file cần thiết, không đọc toàn bộ |
| Codebase | Đọc theo module, không đọc toàn bộ src/ |
| Response | Trả lời súc tích, không lặp lại thông tin đã biết |
| Confirm | Tóm tắt ngắn thay vì liệt kê đầy đủ lại |
| History | Không nhắc lại toàn bộ conversation đã qua |
