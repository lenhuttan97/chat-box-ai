# Design Audit Index (Frontend Current Implementation)

Mục tiêu: hiểu cấu trúc frontend hiện tại để phục vụ redesign UI.

Nguyên tắc thực hiện:
- Phân tích **từng page một**
- Mỗi page ghi rõ: **layout hiện tại** + **component đang dùng**
- Hoàn tất docs page hiện tại rồi mới chuyển page tiếp theo

## Tracking

- [x] 01. Chat Page — `./pages/01-chat-page.md` (✓ Layout: flex-col shell + MessageList + InputBar; ✓ Components: MUI Icons + Tailwind skins + Motion enter/hover; ✓ Redesign insight: MUI layout primitives need more usage)
- [x] 02. Settings Page — `./pages/02-settings-page.md` (✓ Layout: flex-col shell + collapsible sections; ✓ Components: MUI Icons + Tailwind skins; ✓ Redesign insight: Need shared shell + motion system + stronger MUI primitives)
- [x] 03. Auth/Login Page — `./pages/03-auth-login-page.md` (✓ Layout: centered auth shell + glass card; ✓ Components: MUI Box/Icons + Tailwind form skins; ✓ Redesign insight: shared auth shell + motion choreography)
- [x] 04. Premium vs Current Analysis — `./phase-3-premium-vs-current.md` (✓ 4-trục so sánh: Layout/Component/Page/CSS-Motion; ✓ Philosophy mapping: MUI/Tailwind/Motion roles; ✓ Implementation roadmap)
- [ ] 05. Conversation/Sidebar Shell
- [ ] 06. Shared Layout (Header/Navigation)

## Ghi chú kiến trúc
- MUI = skeleton (icons, primitives/theme-oriented usage)
- Tailwind = skin (visual tuning, spacing, effects)
- Motion = animation foundation (đặc biệt ở welcome/suggestion interactions)
