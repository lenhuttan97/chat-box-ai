# Security, Git & Definition of Done

## Security
- KHÔNG log password/token/API key/PII (GEMINI_API_KEY, JWT_SECRET, FIREBASE_PRIVATE_KEY là secrets thật)
- Secrets chỉ trong `.env` (đã gitignore) — không hardcode vào code hay commit
- Validate mọi input tại boundary (ValidationPipe đã global)
- Không expose stack traces trong API error responses

## Git Rules
- KHÔNG BAO GIỜ `git add .` / `git add -A` — add từng file, biết chính xác đang commit gì
- Di chuyển file: `git mv`, không delete + recreate
- Được bảo stop/undo/revert → làm đúng lệnh đó, confirm xong, STOP HOÀN TOÀN
- Chỉ sửa trong project folder hiện tại
- Commit message: Conventional Commits `{type}(#{issue}): {short description}` — imperative mood, tiếng Anh
- PR dựa trên issue PHẢI có `Closes #{number}` trong body

## Documentation Protocol
- Repo docs hub: `docs/INDEX.md`; features `docs/features/<feature>/`, tasks `docs/tasks/`, bugs `docs/bugs/<feature>/`
- Thêm/sửa/xóa file docs → update INDEX.md tương ứng
- Mọi behavioral change phải được ghi docs trước khi báo done

## Definition of Done (verify TẤT CẢ trước khi báo complete)
- **Code:** đúng yêu cầu (không thêm bớt), không warning/error mới, tự review diff
- **Tests:** TDD đúng trình tự, test fail nếu bỏ change, test cũ vẫn pass
- **Docs:** API changes → `docs/features/`, bug status updated
- **Impact:** liệt kê dependent components, không N+1, không breaking API change
- Untested code = incomplete. Undocumented code = incomplete.
