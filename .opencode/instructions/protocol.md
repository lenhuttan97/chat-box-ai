# Agent Protocol (chat-box-ai)

## Roles
- Q = the human user. Khi được yêu cầu hỏi/báo/chờ Q → dừng, trả lời chat, chờ Q.
- Giải thích bằng tiếng Việt, code bằng tiếng Anh, commit message tiếng Anh imperative mood.

## Loss Function
Correctness > speed. Nếu thực tế trái với giả định → giả định sai.

## RULE 0 — STOP ON FAILURE
Bất cứ thứ gì fail/error/không như mong đợi:
- STOP, không retry, không "fix tạm"
- Báo Q: (1) lỗi chính xác, (2) giả định nguyên nhân, (3) action đề xuất, (4) kết quả kỳ vọng
- Không đụng gì cho đến khi hiểu nguyên nhân gốc và Q xác nhận

## RULE 1 — SELF-CHECK TRƯỚC MỖI ACTION MUTATE STATE
Output trước mọi Edit/Write/Bash:
```
CHECK: [rule đang verify]
ACTION: [sắp làm gì]
GATE: [PASS/FAIL — lý do]
```

**Hard Gates:**

| Gate | Trước khi | Check |
|------|-----------|-------|
| TDD | Viết production code | "Đã có failing test? Test name: [name], Status: FAILS" |
| POST-CHANGE | Sau khi sửa/tạo file | "Compile pass? Related tests tìm thấy? Related tests pass?" |
| CONFIRM | Mọi write/execute | "Q đã confirm action này?" |
| PATTERN | Sửa file .ts/.tsx | "Đã đọc code pattern hiện có trong module đó?" |
| CHECKLIST | Bắt đầu bước command/skill | "Đang theo đúng checklist? Bước: [N]" |
| GIT | Mọi git command | "Add từng file riêng lẻ? KHÔNG git add . ?" |
| N+1 | Trước khi báo done | "Có DB call trong loop? Có query Prisma trong stream/forEach?" |

GATE = FAIL → STOP. Tự phát hiện mình skip gate → STOP, báo Q.

## RULE 2 — COMPLETION BIAS OVERRIDE
- KHÔNG batch nhiều write actions rồi báo success một lần
- KHÔNG skip gate để "cho nhanh" — cảm giác muốn "làm nhanh" chính là tín hiệu STOP
- Một action → một verification → một report

**Exception /plan mode:** khi plan đã được Q approve → chạy toàn bộ plan không cần confirm từng bước, nhưng KHÔNG bypass: RULE 0, TDD gate, POST-CHANGE gate, PATTERN gate, GIT gate.

## Reasoning Protocol
Trước action có thể fail/mutate:
`DOING: [action] · EXPECT: [outcome] · IF YES: [next] · IF NO: [next]`
Sau: `RESULT · MATCHES yes/no · THEREFORE [update hoặc STOP]`

## Decision Quality
Trước quyết định lớn: blast radius? dễ undo không? Q có cần biết trước không?
One-way doors (schema change, xóa endpoint, đổi contract SSE/message shape, xóa records) → verify với Q trước.

## Task Tracking
Task non-trivial → tạo todo plan đầu phiên, update status real-time, báo duration từng bước khi xong. Task nhỏ 1 file được miễn.

## Minimal Compliance Mode
Context thiếu/uncertain: không act — tóm tắt hiểu biết, liệt kê constraints + uncertainties, hỏi Q. Luôn acceptable.

## Workflow Pipeline (dùng qua .opencode/command/)
gather-requirement → check-issue → analyze-issue → plan-impl → do-code → build-test → review-code → update-docs → commit-push
Chi tiết conventions theo domain nằm trong các instructions files còn lại.
