# T001-file-preprocessing — File Upload & Preprocessing

- **Feature:** FT-007
- **Task ID:** FT-007-T01

## Phases

| Phase | Description | Details | Status |
|-------|-------------|---------|--------|
| P1 | File Upload API | POST /api/v1/files with multipart/form-data | ⏳ pending |
| P2 | File Storage | Temporary storage with cleanup mechanism | ⏳ pending |
| P3 | Bull Queue Setup | Background job processing configuration | ⏳ pending |
| P4 | File Extractors | Image, PDF, DOCX, Excel content extraction | ⏳ pending |
| P5 | File Processor Service | Main processing logic and error handling | ⏳ pending |
| P6 | AI Integration | Connect preprocessed content to AI providers | ⏳ pending |
| P7 | Frontend Integration | File upload UI and status indicators | ⏳ pending |
| P8 | Testing & Validation | Unit tests, integration tests, file validation | ⏳ pending |

## Status

**⏳ pending** (All phases pending)

## Acceptance Criteria

- [ ] User có thể upload file kèm tin nhắn
- [ ] File được xử lý bất đồng bộ (background job)
- [ ] Images: Trích xuất nội dung (Vision/Base64)
- [ ] PDF: Trích xuất text
- [ ] DOCX: Trích xuất text
- [ ] Excel: Trích xuất text từ all sheets
- [ ] File tạm được xóa sau khi xử lý
- [ ] Frontend có thể poll status để biết processing done
- [ ] Error handling cho các trường hợp fail