---
description: Stage, commit, push changes và optionally tạo PR. Dùng sau build-test + review-code pass, hoặc khi Q nói 'commit', 'push', 'tạo PR'.
---

# Commit & Push — $ARGUMENTS

1. Kiểm tra docs đã update chưa (Definition of Done) — chưa thì đề xuất `/update-docs` trước
2. Review staged/unstaged: `git status`, `git diff`, `git log --oneline -5`
3. **Stage từng file riêng lẻ** — `git add <file>` chính xác từng cái, KHÔNG `git add .`. Liệt kê cho Q thấy những gì sẽ commit
4. Lưu ý: `AGENTS.md` đang bị gitignore (kiểm tra `.gitignore` nếu cần commit nó)
5. Commit message: `{type}(#{issue}): {description}` — tiếng Anh imperative. Ví dụ: `feat(#12): add per-conversation AI provider selection`
6. Push: `git push origin <branch>`. Tạo PR khi Q yêu cầu: body PHẢI có `Closes #{number}` nếu work dựa trên issue
7. Báo: commit hash, files committed, PR URL
