# Project Constraints

## Technical
- SQLite chỉ dùng cho development/local
- Không dùng class-based components trong React
- Redux chỉ dùng Redux Toolkit
- Tất cả API calls phải có error handling

## Business
- UI phải responsive (mobile + desktop)
- Chat history phải persistent (không mất khi refresh)
- Streaming response bắt buộc (UX giống ChatGPT/Gemini)
- Authentication: tối thiểu có user session

## Performance
- API response < 500ms (không tính AI streaming time)
- Frontend bundle < 500KB initial load

## Out of Scope (hiện tại)
- Multi-tenant / Team workspace
- File upload / Image analysis
- Voice input/output
- Mobile native app

## Testing
- Test files giữ ở `src/test/` thay vì `test/` root vì:
  - Jest config đơn giản hơn
  - Import paths nhất quán
  - Không cần moduleNameMapper
- Chỉ thay đổi khi có lý do cụ thể
