# Feature Documentation Standard

## Mục tiêu
Tài liệu này định nghĩa tiêu chuẩn và quy trình để viết documentation cho các feature trong hệ thống, dựa trên mẫu thành công từ `docs/features/auth/`.

## Cấu trúc chuẩn cho Feature Documentation

### 1. Cấu trúc chung của tài liệu
```
# [Tên Feature] Documentation

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Architecture Components](#architecture-components)
4. [Workflows](#workflows)
5. [Security Features](#security-features)
6. [User Experience](#user-experience)
7. [API Endpoints](#api-endpoints)
8. [Integration Points](#integration-points)
9. [Error Handling](#error-handling)
10. [State Management](#state-management)
11. [Workflow Analysis](#workflow-analysis)
12. [User Flow](#user-flow)
13. [Task Flow](#task-flow)
14. [Recommendations](#recommendations)

## Overview
[Tổng quan về feature]

## Features
[Các chức năng cụ thể của feature]

## Architecture Components
[Các thành phần kiến trúc liên quan]

## Authentication Flows (hoặc các loại flow khác tùy feature)
[Các luồng hoạt động chính]

## Security Features
[Những đặc điểm bảo mật nếu có]

## User Experience Features
[Những đặc điểm trải nghiệm người dùng]

## API Endpoints Used
[Các endpoint API liên quan]

## Integration Points
[Các điểm tích hợp với hệ thống khác]

## Error Handling Strategy
[Cách xử lý lỗi trong feature]

## State Management
[Cách quản lý trạng thái nếu có]

## Workflow Analysis
[Phân tích luồng hoạt động]

## User Flow
[Sơ đồ khối về luồng người dùng]

## Task Flow
[Sơ đồ khối về luồng tác vụ]

## Recommendations & Improvements
[Đề xuất cải tiến]

## Conclusion
[Kết luận tổng quát]
```

### 2. User Flow Section
Luôn bao gồm các thành phần sau dưới dạng sơ đồ khối:

```
### User Journey Map
[Schema dạng bảng với các bước người dùng đi qua]

### User Authentication Flow (hoặc tên flow phù hợp với feature)
[Schema dạng quy trình với các bước chính]

### User [Tên Feature] States
[Schema trạng thái người dùng trong feature]
```

### 3. Task Flow Section
Luôn bao gồm các thành phần sau dưới dạng sơ đồ khối:

```
### Developer Task Sequence - [Tên Feature] WORKFLOWS

[Schema backend workflow]
[Schema frontend workflow] 
[Schema state management workflow]
[Schema component integration workflow]
```

### 4. Các nguyên tắc viết documentation

#### 4.1. Ngôn ngữ và phong cách
- Sử dụng ngôn ngữ rõ ràng, dễ hiểu
- Giữ nhất quán về terminology trong toàn bộ tài liệu
- Tránh sử dụng mã nguồn cụ thể trong phần recommendations
- Tập trung vào quy trình và kiến trúc ở mức hệ thống

#### 4.2. Sơ đồ khối (Block Diagrams)
- Luôn sử dụng định dạng ASCII art cho sơ đồ
- Mỗi sơ đồ phải có tiêu đề rõ ràng
- Các ô vuông biểu thị các thành phần hoặc trạng thái
- Mũi tên biểu thị luồng dữ liệu hoặc luồng điều khiển
- Ghi chú ngắn gọn bên trong mỗi khối nếu cần

#### 4.3. Tổ chức thông tin
- Mỗi section nên có tiêu đề rõ ràng
- Sử dụng bullet points cho các danh sách
- Bảng biểu cho các thông tin so sánh hoặc trạng thái
- Giữ cấu trúc lặp lại giữa các tài liệu feature khác nhau

### 5. Các phần cần cập nhật trong hệ thống

#### 5.1. Cập nhật Rules
- Thêm quy tắc mới về việc tạo documentation cho feature mới
- Quy định bắt buộc sử dụng cấu trúc chuẩn khi tạo tài liệu mới
- Quy định về sơ đồ khối trong tài liệu

#### 5.2. Cập nhật Skills
- Tạo hoặc cập nhật skill để tự động tạo skeleton documentation
- Skill để kiểm tra tính đầy đủ của tài liệu feature
- Skill để tạo sơ đồ khối tự động

#### 5.3. Template cho feature mới
Khi tạo một feature mới, cần tạo tài liệu theo mẫu:

```
# [Tên Feature] Documentation

## Overview
[Tổng quan về feature mới]

## User Flow
[Copy cấu trúc từ auth-documentation.md và điều chỉnh phù hợp]

## Task Flow  
[Copy cấu trúc từ auth-documentation.md và điều chỉnh phù hợp]

[Các section còn lại tương tự]
```

### 6. Quy trình áp dụng
1. Khi bắt đầu phát triển feature mới, tạo tài liệu documentation trước
2. Cập nhật tài liệu trong quá trình phát triển
3. Kiểm tra tài liệu theo tiêu chuẩn trước khi hoàn thành feature
4. Duy trì tài liệu khi có cập nhật cho feature

### 7. Ví dụ áp dụng
Tài liệu `docs/features/auth/auth-documentation.md` là ví dụ hoàn hảo về cách áp dụng tiêu chuẩn này, với:
- Cấu trúc rõ ràng và đầy đủ
- Sơ đồ khối dễ hiểu cho cả người dùng và nhà phát triển
- Tập trung vào quy trình và kiến trúc hơn là mã nguồn cụ thể
- Các phần được tổ chức hợp lý và dễ theo dõi

Tiêu chuẩn này sẽ giúp đảm bảo tính nhất quán trong toàn bộ hệ thống documentation của dự án.