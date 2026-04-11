# Skill: Commit — Thực hiện commit code

## Mục đích
Hướng dẫn agent thực hiện commit code đúng quy trình:
kiểm tra trước, soạn message chuẩn, cập nhật docs sau.

---

## Khi nào chạy skill này
- User yêu cầu "commit", "commit code", "lưu lại thay đổi"
- Sau khi hoàn thành 1 task hoặc 1 nhóm task liên quan
- Trước khi đóng phiên (kết hợp với token-guard.md)

---

## Bước 1 — Tổng hợp những gì đã thực hiện

Trước khi commit, agent PHẢI đọc và tổng hợp:

```
1. docs/tasks/INDEX.md     ← task nào vừa chuyển sang done?
2. docs/bugs/INDEX.md      ← bug nào vừa được resolve?
3. docs/CHANGELOG.md       ← những thay đổi trong phiên này
4. git diff --staged        ← những file thực sự thay đổi
5. git status               ← file nào chưa được stage?
```

Tổng hợp thành danh sách rõ ràng:

```
📋 Tổng hợp thay đổi trong phiên này:

✅ Tasks hoàn thành:
- [T001] [tên task] - [feature-name]

🐛 Bugs đã fix:
- [B001] [mô tả ngắn]

📁 Files thay đổi:
- [path/to/file] — [mô tả thay đổi]
- [path/to/file] — [mô tả thay đổi]
```

---

## Bước 2 — Pre-commit Checklist (BẮT BUỘC)

Chạy lần lượt, báo cáo kết quả từng mục:

### 2.1 Kiểm tra file nhạy cảm
```bash
git status
```
Kiểm tra KHÔNG có các file sau trong staging:
- [ ] `.env` hoặc `.env.*`
- [ ] `node_modules/`
- [ ] `*.key`, `*.pem`, `*.secret`
- [ ] `prisma/*.db` (SQLite file)
- [ ] Bất kỳ file chứa credentials/API key

Nếu phát hiện → DỪNG, cảnh báo user, KHÔNG commit.

### 2.2 Review diff
```bash
git diff --staged
```
Đọc qua và xác nhận:
- [ ] Không có code debug bị bỏ quên (`console.log`, `debugger`)
- [ ] Không có TODO quan trọng chưa giải quyết
- [ ] Thay đổi đúng với mục tiêu của task

### 2.3 Lint check
```bash
# Backend
cd backend && npm run lint

# Frontend
cd frontend && npm run lint
```
- [ ] Không có lỗi lint nghiêm trọng (warning có thể bỏ qua)

### 2.4 Test (nếu có)
```bash
npm run test
```
- [ ] Test pass hoặc không có test nào fail liên quan đến thay đổi

---

## Bước 3 — Soạn Commit Message

### Convention: Conventional Commits + scope

```
<type>(<scope>): <mô tả ngắn>

[body - tùy chọn]

[footer - tùy chọn]
```

### Các type hợp lệ

| Type | Dùng khi |
|------|---------|
| `feat` | Thêm tính năng mới |
| `fix` | Sửa bug |
| `chore` | Cấu hình, setup, dependency |
| `docs` | Cập nhật tài liệu |
| `refactor` | Cải thiện code, không thêm tính năng hay fix bug |
| `style` | Thay đổi UI/CSS, format code |
| `test` | Thêm hoặc sửa test |
| `perf` | Cải thiện hiệu năng |

### Scope theo module project

| Scope | Dùng cho |
|-------|---------|
| `chat` | Module chat, messages |
| `auth` | Authentication, authorization |
| `history` | Conversation history |
| `ai` | AI integration, streaming |
| `ui` | React components, layout |
| `db` | Prisma schema, migration |
| `config` | Cấu hình, environment |
| `agent` | File trong .agent/ |

### Quy tắc viết message

```
✅ Đúng:
feat(chat): add streaming response to chat window
fix(auth): resolve JWT expiry not refreshing session
chore(db): add conversation and message prisma models

❌ Sai:
fixed stuff
update code
WIP
```

### Nếu commit gộp nhiều task

```
feat(chat): implement core chat interface

- Add MessageList component with auto-scroll
- Add InputBar with send on Enter
- Add Redux chatSlice for message state
- Connect to /api/v1/chat/message endpoint

Tasks: T001, T002
```

---

## Bước 4 — Trình bày đề xuất commit cho user xác nhận

```
🔀 Đề xuất commit — vui lòng xác nhận:

┌─ Pre-commit Check ─────────────────────────────────┐
│ ✅ Không có file nhạy cảm                          │
│ ✅ Lint pass                                        │
│ ⚠️  Có 2 console.log trong chat.service.ts         │
└────────────────────────────────────────────────────┘

┌─ Files sẽ được commit ─────────────────────────────┐
│ M  src/modules/chat/chat.service.ts                │
│ A  src/modules/chat/dto/send-message.dto.ts        │
│ M  prisma/schema.prisma                            │
└────────────────────────────────────────────────────┘

┌─ Commit message ───────────────────────────────────┐
│ feat(chat): add basic chat message API             │
│                                                    │
│ - Add SendMessageDto with validation               │
│ - Add ChatService with AI provider integration     │
│ - Update Prisma schema with Message model          │
│                                                    │
│ Tasks: T001, T002                                  │
└────────────────────────────────────────────────────┘

Xác nhận commit? (OK / chỉnh message / hủy)
```

---

## Bước 5 — Thực hiện commit

Sau khi user xác nhận OK:

```bash
git add [các file đã review]
git commit -m "feat(chat): add basic chat message API

- Add SendMessageDto with validation
- Add ChatService with AI provider integration
- Update Prisma schema with Message model

Tasks: T001, T002"
```

---

## Bước 6 — Cập nhật docs sau commit (chạy docs-update.md)

Sau khi commit thành công, đề xuất cập nhật:

```
┌─ docs/tasks/{feature-name}/index.md ────────────────┐
│ ~ T001: pending → done                              │
│ ~ T002: pending → done                              │
└────────────────────────────────────────────────────┘

┌─ docs/features/{feature-name}/index.md ───────────┐
│ ~ Feature: pending → in_progress                    │
└────────────────────────────────────────────────────┘

┌─ docs/CHANGELOG.md ─────────────────────────────────┐
│ [DATE] ✅ commit: feat(chat): add basic chat API   │
│         Tasks done: T001, T002                      │
└────────────────────────────────────────────────────┘

Xác nhận cập nhật docs? (OK / bỏ qua)
```

---

## Bước 7 — Tóm tắt phiên commit

Sau khi hoàn tất, hiển thị tóm tắt:

```
✅ Commit hoàn tất

Commit: feat(chat): add basic chat message API
Hash:   [git commit hash 7 ký tự]

Tasks đã done: T001, T002
Bugs đã fix:   B001 (nếu có)

Tiến độ tổng:
- Features: [X] done / [X] in_progress / [X] pending
- Tasks:    [X] done / [X] in_progress / [X] pending
- Bugs:     [X] done / [X] pending
```

---

## Trường hợp đặc biệt

### Commit khẩn (hotfix)
Nếu user nói "hotfix" hoặc "urgent fix":
- Bỏ qua lint check nếu không pass
- Vẫn bắt buộc kiểm tra file nhạy cảm
- Type bắt buộc là `fix`
- Ghi chú `[HOTFIX]` trong body

### Commit docs only
Nếu chỉ thay đổi file trong `.agent/`:
```
docs(agent): [mô tả thay đổi]
```
Không cần chạy lint/test.

### Nhiều commit trong 1 phiên
Mỗi commit độc lập, không gộp nhiều tính năng không liên quan vào 1 commit.
