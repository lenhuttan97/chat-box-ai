# Agent Rules

## Hard Rules (Bất biến)

### R01 — Tech Stack Lock
PHẢI sử dụng đúng stack đã định nghĩa trong tech-stack.md.
Không được đề xuất thay thế bằng công nghệ khác.

### R02 — Scope Boundary
Chỉ phân tích và lập kế hoạch trong phạm vi project này.

### R03 — CLARIFY FLOW ORDER ⚡
Thứ tự bắt buộc trong mọi yêu cầu, KHÔNG được đảo:
  [1] HỎI user       — thu thập yêu cầu ban đầu
  [2] CHECK docs     — tra cứu docs/ có mục tiêu
  [3] CHECK codebase — tra cứu code liên quan
  [4] HỎI LẠI       — làm rõ thông tin còn thiếu hoặc xung đột
  [5] XÁC NHẬN      — tóm tắt đầy đủ, user confirm
NGHIÊM CẤM bỏ qua hoặc đảo thứ tự bất kỳ bước nào.

### R04 — DOCS PROPOSE THEN CONFIRM ⚡
Sau MỖI yêu cầu được xử lý:
1. Agent soạn ĐỀ XUẤT cập nhật docs (CHƯA ghi)
2. Trình bày đề xuất cho user xác nhận
3. Chỉ ghi vào file sau khi user nói OK
Không được tự ý ghi docs mà không có xác nhận của user.

### R05 — Output Format
Mọi kế hoạch PHẢI theo template trong /output-templates/.

### R06 — No Assumption on Critical Info
Không tự giả định: persona, ảnh hưởng DB, yêu cầu auth, AI integration bắt buộc hay không.

### R07 — Protect Done Tasks
Task đã ở trạng thái `done` → KHÔNG được sửa nội dung.
Nếu bắt buộc phải sửa → ghi rõ lý do trong CHANGELOG.md.

### R08 — Bug Summary Sync
Mỗi khi BUGS.md được cập nhật, PHẢI đồng bộ section
"🚨 Bug & Warning Summary" trong TASKS.md ngay lập tức.
Chỉ hiển thị items có status = pending trong summary.

### R09 — TARGETED LOOKUP ONLY ⚡
Khi tra cứu docs và codebase (Bước 2 + 3 của clarify.md):
- Chỉ tra cứu những gì liên quan đến yêu cầu đã được làm rõ ở Bước 1
- Không đọc toàn bộ docs hoặc codebase — tiết kiệm token
- Ưu tiên INDEX files trước, chỉ đọc file chi tiết khi cần

### R10 — TOKEN GUARD ⚡
Chạy token check sau mỗi bước lớn (Clarify / Analyze / Plan).
Đạt 80% → cảnh báo user.
Đạt 90% → dừng ngay, lưu SESSION.md vào .claude/sessions/,
hướng dẫn user cách tiếp tục phiên mới.
Không được để hết token mà không lưu trạng thái.

### R11 — COMMIT SAFE ⚡
Trước khi commit PHẢI chạy skills/commit.md đầy đủ.
Không được commit nếu phát hiện file nhạy cảm (.env, key, db).
Luôn trình bày đề xuất commit message cho user xác nhận trước.
Sau commit PHẢI cập nhật TASKS.md và CHANGELOG.md.

### R12 — NO ENV READ ⚡
KHÔNG BAO GIỜ đọc file `.env` (chứa secrets).
Khi cần xem cấu trúc env variables → đọc `.env.example`.
Khi cần thêm/chỉnh sửa biến môi trường → cập nhật `.env.example` (KHÔNG tạo .env mới).

### R13 — GIT SEPARATION ⚡
Git operations (commit, push, pull, branch) TÁCH BIỆT khỏi flow task/bug thông thường.
- KHÔNG BAO GIỜ tự động chạy git commit sau khi hoàn thành task/bug
- Chỉ chạy git commands khi user YÊU CẦU COMMIT cụ thể
- VD: "commit code đi", "push lên", "tạo branch mới"
- Trong flow bình thường: code xong → đợi user yêu cầu commit

### R12 — PLAN CONFIRM BEFORE CODE ⚡
NGHIÊM CẤM viết bất kỳ dòng code nào khi chưa có xác nhận plan.
Sau khi planning.md hoàn thành → trình bày plan cho user → chờ "OK".
Chỉ sau khi user xác nhận mới được phép chuyển sang viết code.

### R13 — NO CODE WITHOUT PERMISSION ⚡
NGHIÊM CẤM tự ý cập nhật codebase (tạo file, sửa file, xóa file)
khi chưa được user cho phép tường minh.

**Quy trình xác nhận:**
1. Trình bày danh sách file cần thay đổi
2. User có 2 lựa chọn:
   - "OK hết" / "Thực hiện tất cả" → thay đổi tất cả file
   - Chọn từng file cụ thể → chỉ thay đổi các file được chọn

"Cho phép tường minh" = user nói "ok", "làm đi", "thực hiện", hoặc tương đương.
Đề xuất thay đổi code phải được hiển thị trước, user xác nhận sau.

### R14 — BACKEND MUST HAVE TESTS ⚡
Mọi backend code (NestJS service, controller) PHẢI có test đi kèm.
Thứ tự bắt buộc: viết code → viết test → hỏi user có muốn run test không.
Nếu user đồng ý → chạy test → theo dõi kết quả → xử lý nếu fail.
KHÔNG được commit backend code khi chưa có test file tương ứng.

### R15 — TEST INTEGRITY ⚡
Khi test fail, NGHIÊM CẤM:
- Sửa test để pass mà không phân tích nguyên nhân
- Sửa code làm sai lệch logic ban đầu chỉ để test pass
- Cập nhật test sai với yêu cầu gốc hoặc không theo logic codebase
Phải phân tích log → đề xuất phương án → user chọn → mới thực hiện.

### R16 — TASKS & BUGS STRUCTURE

#### Thư mục Features (quản lý tính năng)
```
docs/features/
├── INDEX.md
└── {feature-name}/
    ├── index.md              ← Tổng hợp feature
    ├── FT-xxx-name.md       ← Feature specification (ID + name)
    └── api.md               ← API Documentation (nếu có)
```

#### Thư mục Tasks (triển khai)
```
docs/tasks/
├── INDEX.md
└── {feature-name}/
    ├── index.md              ← Tổng hợp tasks của feature
    └── Txxx-name.md          ← Task file (ID + name)
```

#### Thư mục Bugs
```
docs/bugs/
├── INDEX.md
└── {bug-name}/
    ├── index.md              ← Tổng hợp bugs
    └── Bxxx-fix-name.md     ← Bug file (ID + name)
```

#### File naming
- Feature: `FT-xxx-name` (FT-001-chat-gemini-streaming, FT-002-auth-firebase)
- Task: `Txxx-name` (T001-auth-firebase, T001-chat-api)
- Bug: `Bxxx-name` (B001-fix-name)

### R17 — TASK DOCUMENTATION REQUIRED

**Feature Specification (`docs/features/{feature-name}/FT-xxx-name.md`):**
- Mô tả tính năng tổng quan
- Database schema (nếu có)
- Link đến api.md và task

**Task Implementation (`docs/tasks/{feature-name}/Txxx-name.md`):**
- Plan + Phases + Sub-tasks
- Chi tiết từng bước triển khai

**API Documentation:**
Nếu feature có API, PHẢI tạo file `api.md` trong thư mục feature:
```
docs/features/{feature-name}/
├── index.md
├── FT-xxx-name.md
└── api.md          ← File mô tả API endpoints
```

Template `docs/tasks/{feature-name}/Txxx-name.md`:
```markdown
# Txxx — Tên Task

## Thông tin
| Trường | Giá trị |
|--------|---------|
| ID | Txxx |
| Feature | tên-feature |
| Loại | feature/fix |
| Trạng thái | pending/in_progress/done |
| Priority | high/medium/low |

---

## Mô tả yêu cầu
(mô tả chi tiết từ user)

---

## Plan
1. Bước 1: ...
2. Bước 2: ...

---

## Phases
- [ ] Phase 1: ...
- [ ] Phase 2: ...

---

## Sub-tasks
- [ ] Sub-task 1
- [ ] Sub-task 2
```

### R18 — BUG DOCUMENTATION REQUIRED

Template `docs/bugs/{bug-name}/Bxxx-name.md`:
```markdown
# Bxxx — Tên Bug

## Thông tin
| Trường | Giá trị |
|--------|---------|
| ID | Bxxx |
| Loại | bug |
| Trạng thái | pending/in_progress/done |
| Priority | high/medium/low |
| Related Feature | Txxx

---

## Mô tả lỗi
(mô tả chi tiết lỗi)

---

## Steps to reproduce
1. ...
2. ...

---

## Expected vs Actual
- Expected: ...
- Actual: ...

---

## Fix Plan
1. Bước 1: ...
2. Bước 2: ...

---

## Fix Phases
- [ ] Phase 1: ...
- [ ] Phase 2: ...
```
### R19 — API PAGINATION REQUIREMENT ⚡
Tất cả API dùng để list data PHẢI thêm field `total_element` trong response để hỗ trợ phân trang.
Các tham số request mặc định PHẢI có `page` và `size` (ví dụ: ?page=0&size=10).

---

## Soft Rules (Ưu tiên)

### S01 — Estimate Buffer
Thêm 20% buffer vào mọi time estimate.

### S02 — Risk First
Luôn liệt kê risks trước khi liệt kê benefits.

### S03 — MVP Mindset
Ưu tiên MVP scope trước khi mở rộng feature.

### S04 — Dependency Order
Luôn sắp xếp task theo dependency — backend trước frontend.

### S05 — Fix Tasks Go First
Task loại `fix` luôn được thêm vào section "Ưu tiên cao" trong TASKS.md.

### S06 — Skip Clarify Conditions
Được phép bỏ qua hỏi lại khi:
- Yêu cầu đã đủ thông tin (pass clarity checklist)
- User nói rõ "làm ngay, không cần hỏi"
- Yêu cầu quá đơn giản, rõ ràng

### S07 — Coding Standards
Khi viết code, nên tuân thủ theo conventions.md:
- SOLID: không cứng nhắc nhưng áp dụng khi có thể
- Comment: thêm khi logic không hiển nhiên, business rule quan trọng, workaround tạm thời
- JSDoc: thêm cho các function/method quan trọng ở backend
- Logging: dùng NestJS Logger, log tại các điểm quan trọng để debug sau này
- Không log thông tin nhạy cảm (password, token, API key)