# File Preprocessing Documentation

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

The File Preprocessing feature in the Chat Box AI application enables users to upload and process various file types before sending them to AI providers. This feature leverages background job processing with Bull queue to handle file processing asynchronously, supporting multiple file formats including images, PDFs, DOCX, and Excel files. The implementation extracts relevant content from uploaded files and integrates it seamlessly with AI conversations, enhancing the AI's ability to process and respond to file-based queries.

## Features

- **Multi-format File Support**: Processes images, PDFs, DOCX, and Excel files
- **Asynchronous Processing**: Background job processing with Bull queue
- **Content Extraction**: Text extraction from documents and image analysis
- **Temporary File Management**: Automatic cleanup of temporary files after processing
- **Status Tracking**: Real-time file processing status monitoring
- **AI Integration**: Seamless integration with AI providers for enhanced responses
- **File Size Limits**: Configurable file size restrictions for security
- **WebSocket Notifications**: Real-time updates for file processing status

## Architecture Components

### Backend Components
- **Files Controller**: Manages file upload and status retrieval endpoints
- **Files Service**: Handles file validation, storage, and processing coordination
- **Files Processor**: Background job processor using Bull queue
- **Preprocessor Service**: Coordinates content extraction from various file types
- **Extractor Services**: Specialized services for different file formats (PDF, DOCX, Excel, Images)
- **Queue Manager**: Bull queue implementation for background processing
- **Database Service**: Prisma-based file record management

### Frontend Components
- **File Upload Component**: Drag-and-drop interface for file uploads
- **Status Tracking**: Real-time monitoring of file processing status
- **WebSocket Client**: Real-time updates for file processing events
- **File Preview**: Preview functionality for uploaded files

### Database Schema
```prisma
model File {
  id            String   @id @default(uuid())
  filename      String
  originalName  String   @map("original_name")
  mimeType      String   @map("mime_type")
  size          Int
  status        String   @default("processing")  // processing, completed, failed
  extractedText String?  @map("extracted_text")
  error         String?
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  @@map("files")
}
```

### External Dependencies
- **Redis**: Queue management for background jobs
- **pdf-parse**: PDF text extraction
- **mammoth**: DOCX text extraction
- **xlsx**: Excel file processing
- **sharp**: Image processing and optimization

## Workflows

### File Upload Workflow
1. User selects file for upload
2. Frontend validates file type and size
3. File is uploaded to backend via multipart form
4. Backend saves temporary file to storage
5. File record is created in database with "processing" status
6. Processing job is queued in Bull queue
7. File ID is returned to frontend immediately

### Background Processing Workflow
1. Bull queue processes file processing job
2. File type is detected and appropriate extractor is selected
3. Content is extracted from the file using specialized extractor
4. Extracted content is stored in database record
5. Temporary file is deleted from storage
6. File status is updated to "completed" or "failed"
7. WebSocket notification is sent if applicable

### AI Integration Workflow
1. User sends message with attached file ID
2. System retrieves file record and extracted content
3. File content is appended to user message
4. Combined message is sent to AI provider
5. AI processes message with file content
6. Response is streamed back to frontend

## Security Features

- **File Type Validation**: Strict MIME type validation against allowed list
- **Size Limiting**: Configurable maximum file size enforcement
- **Temporary File Security**: Secure temporary storage with automatic cleanup
- **Path Traversal Prevention**: Proper file path sanitization
- **Content Validation**: Verification of file integrity and content
- **Queue Security**: Redis connection security and authentication
- **Database Protection**: Input sanitization for file metadata
- **Access Control**: Proper authentication for file-related operations

## User Experience

### File Upload Interface
- Intuitive drag-and-drop file upload experience
- Clear file type and size restrictions displayed
- Progress indicators during upload process
- Immediate feedback with file processing ID
- Real-time status updates during processing

### Processing Feedback
- Visual indicators for different processing statuses
- Estimated processing times where applicable
- Error messages with clear remediation steps
- Success notifications when processing completes
- Automatic retry mechanisms for failed processing

### File Integration
- Seamless integration with chat interface
- Visual representation of attached files
- Preview capabilities for supported file types
- Clear indication of when file content is being used
- Smooth transitions during AI response generation

### Performance Considerations
- Asynchronous processing to avoid UI blocking
- Efficient file handling and memory management
- Optimized content extraction for various formats
- Caching mechanisms for frequently accessed files

## API Endpoints

### File Upload
```
POST /api/v1/files/upload
Content-Type: multipart/form-data

Request:
file: <binary>

Response (Success):
{
  "data": {
    "fileId": "uuid",
    "filename": "temp_abc123.pdf",
    "originalName": "document.pdf",
    "mimeType": "application/pdf",
    "size": 1024000,
    "status": "processing"
  },
  "message": "File uploaded successfully",
  "statusCode": 201
}
```

### File Status Check
```
GET /api/v1/files/:id

Response (Processing):
{
  "data": {
    "fileId": "uuid",
    "status": "processing",
    "extractedText": null
  },
  "message": "File is being processed",
  "statusCode": 200
}

Response (Completed):
{
  "data": {
    "fileId": "uuid",
    "status": "completed",
    "extractedText": "Extracted content from file..."
  },
  "message": "File processed successfully",
  "statusCode": 200
}
```

### Chat with File Attachment
```
POST /api/v1/conversation/messages

Request:
{
  "message": "Summarize this document",
  "fileId": "uuid-of-uploaded-file",
  "conversation_id": "optional-conversation-id"
}

Response (Streaming):
Content-Type: text/event-stream
data: {"conversationId": "uuid"}
data: {"chunk": "Here is "}
data: {"chunk": "a summary "}
data: {"chunk": "of your document..."}
data: {"done": true}
```

### WebSocket for File Processing
```
ws://domain/ws/files/:fileId

Events:
{ "event": "processing", "data": { "fileId": "uuid" } }
{ "event": "completed", "data": { "fileId": "uuid", "extractedText": "..." } }
{ "event": "failed", "data": { "fileId": "uuid", "error": "..." } }
```

### Configuration
```env
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
UPLOAD_TEMP_DIR=./uploads/temp
REDIS_HOST=localhost
REDIS_PORT=6379
QUEUE_FILE_PROCESS=file-process
```

## Integration Points

### Backend Integrations
- **AI Service**: Provides extracted content to AI providers
- **Conversation Service**: Links files to conversation messages
- **Queue System**: Bull queue for background processing
- **Database Service**: Prisma for file record management
- **Authentication Service**: Secures file operations

### Frontend Integrations
- **Chat Interface**: File attachment and preview functionality
- **File Upload Component**: Drag-and-drop interface
- **State Management**: Redux store for file status tracking
- **WebSocket Client**: Real-time status updates
- **Message Processing**: Integration with file-enhanced messages

### External Services
- **Redis**: Queue management for background jobs
- **File Processing Libraries**: pdf-parse, mammoth, xlsx, sharp
- **AI Providers**: Gemini, Ollama integration with extracted content
- **Storage Services**: Temporary file storage systems

## Error Handling

### Upload Errors
- **File Too Large**: 413 status with size limit information
- **Unsupported Type**: 400 status with supported types list
- **Upload Failure**: 500 status with detailed error information
- **Storage Issues**: 500 status with storage-related errors

### Processing Errors
- **Extraction Failure**: Mark file status as "failed" with error details
- **Queue Issues**: Retry mechanisms with exponential backoff
- **Resource Exhaustion**: Proper cleanup and error reporting
- **Corrupted Files**: Validation and rejection of corrupt files

### Integration Errors
- **AI Provider Issues**: Retry mechanisms and fallback strategies
- **Database Connection**: Connection pooling and retry logic
- **Queue Connection**: Redis connection management and recovery
- **Timeout Handling**: Proper timeout configuration and handling

### Error Response Format
```json
{
  "data": null,
  "error": {
    "code": "FILE_UPLOAD_ERROR",
    "message": "File size exceeds limit of 10MB",
    "details": {
      "maxSize": 10485760,
      "actualSize": 15728640
    }
  },
  "statusCode": 413
}
```

## State Management

### Backend State
- **Queue State**: Track processing jobs and their progress
- **File Records**: Maintain status and metadata in database
- **Temporary Storage**: Manage temporary file lifecycle
- **Processing Results**: Store extracted content and errors

### Frontend State
- **Upload Status**: Track file upload progress and completion
- **Processing State**: Monitor file processing status in real-time
- **Attachment State**: Manage file attachments to messages
- **Preview Cache**: Cache file previews and extracted content

### Database State
- **File Records**: Persistent storage of file metadata and status
- **Extraction Results**: Store processed content and errors
- **Processing History**: Track processing attempts and outcomes
- **Cleanup Records**: Track temporary files for cleanup

## Workflow Analysis

### Performance Impact
- **Asynchronous Processing**: Non-blocking file processing
- **Memory Management**: Efficient handling of large files
- **Queue Efficiency**: Optimized background job processing
- **Bandwidth Optimization**: Efficient file transfer and storage

### Scalability Considerations
- **Queue Scaling**: Distributed processing with multiple workers
- **Storage Management**: Efficient temporary file handling
- **Resource Allocation**: Proper allocation of processing resources
- **Concurrent Processing**: Handling multiple simultaneous uploads

### Maintainability Factors
- **Modular Architecture**: Separate processing for different file types
- **Configuration Management**: Centralized file processing settings
- **Error Isolation**: Contained error handling per file type
- **Testing Coverage**: Comprehensive testing for all file formats

## User Flow

### File Upload Process
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                USER FLOW - FILE UPLOAD PROCESS                          │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  User Selects File for Upload                                                           │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Validate File    │─────────────► Check type, size against limits                     │
│  │Constraints      │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Upload File to   │─────────────► POST /api/v1/files/upload (multipart)              │
│  │Backend          │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Backend Saves    │─────────────► Store temp file, create DB record                   │
│  │Temporarily      │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Queue Processing │─────────────► Add job to Bull queue for background processing     │
│  │Job              │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Return File ID   │─────────────► Immediate response with file ID and status          │
│  │to Frontend      │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Monitor Status   │─────────────► Poll or WebSocket for processing updates            │
│  │Updates          │                                                                     │
│  └─────────────────┘                                                                     │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### File-Enhanced Chat Process
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              USER FLOW - FILE-ENHANCED CHAT                             │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  User Sends Message with Attached File                                                  │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Submit Message   │─────────────► POST /api/v1/conversation/messages with fileId      │
│  │with File ID     │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Retrieve File    │─────────────► Get file record with extracted content              │
│  │Content          │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Combine Message  │─────────────► Append file content to user message                 │
│  │with File        │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Send to AI       │─────────────► Forward combined message to AI provider             │
│  │Provider         │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Stream AI        │─────────────► Return AI response as streaming events              │
│  │Response         │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Display Enhanced │─────────────► Show AI response considering file content           │
│  │Response         │                                                                     │
│  └─────────────────┘                                                                     │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Task Flow

### Developer Task Sequence - FILE PREPROCESSING IMPLEMENTATION

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                 DEVELOPER IMPLEMENTATION SEQUENCE                       │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  1. SET UP DEPENDENCIES                                                                │
│     • Install Bull queue, Redis, and file processing libraries                          │
│     • Configure Redis connection for queue management                                   │
│     • Set up file processing dependencies (pdf-parse, mammoth, xlsx, sharp)            │
│     • Test library installations and basic functionality                               │
│                                                                                         │
│  2. DESIGN DATABASE SCHEMA                                                             │
│     • Create File model with appropriate fields for file metadata                       │
│     • Add status tracking for processing workflow                                       │
│     • Include error handling fields for troubleshooting                                 │
│     • Run Prisma migrations to update database schema                                  │
│                                                                                         │
│  3. IMPLEMENT FILE UPLOAD CONTROLLER                                                   │
│     • Create files.controller.ts with upload endpoint                                  │
│     • Add file validation middleware for type and size checking                         │
│     • Implement proper error handling and response formatting                          │
│     • Add file ID generation and database record creation                              │
│                                                                                         │
│  4. BUILD FILE PROCESSING QUEUE                                                        │
│     • Create Bull queue for background file processing                                  │
│     • Implement files.processor.ts with job handling logic                             │
│     • Add proper error handling and retry mechanisms                                   │
│     • Configure queue settings and worker processes                                    │
│                                                                                         │
│  5. CREATE FILE EXTRACTOR SERVICES                                                     │
│     • Build PDF extractor using pdf-parse library                                      │
│     • Implement DOCX extractor with mammoth library                                    │
│     • Create Excel extractor using xlsx library                                        │
│     • Develop image processor for vision-based analysis                                │
│                                                                                         │
│  6. IMPLEMENT PREPROCESSOR SERVICE                                                     │
│     • Create preprocessor.service.ts to coordinate extraction                          │
│     • Implement file type detection and routing logic                                  │
│     • Add content extraction and database update functionality                         │
│     • Include temporary file cleanup mechanisms                                        │
│                                                                                         │
│  7. BUILD FRONTEND COMPONENTS                                                          │
│     • Create drag-and-drop file upload interface                                       │
│     • Implement file status tracking and display                                       │
│     • Add file preview capabilities for supported formats                              │
│     • Create attachment indicators in chat interface                                   │
│                                                                                         │
│  8. INTEGRATE WITH AI SERVICE                                                          │
│     • Modify AI service to incorporate file content                                    │
│     • Update conversation endpoints to handle file IDs                                 │
│     • Implement content appending to user messages                                     │
│     • Test AI responses with various file types                                        │
│                                                                                         │
│  9. ADD WEBSOCKET NOTIFICATIONS                                                        │
│     • Implement WebSocket server for real-time status updates                          │
│     • Create client-side WebSocket connection management                               │
│     • Add event broadcasting for file processing status                                │
│     • Implement reconnection and error handling                                        │
│                                                                                         │
│  10. TESTING AND OPTIMIZATION                                                          │
│     • Write comprehensive tests for all file types                                     │
│     • Test error scenarios and edge cases                                              │
│     • Optimize file processing performance                                             │
│     • Test scalability with concurrent file uploads                                    │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Recommendations & Improvements

### 1. Enhanced File Processing
- Implement more sophisticated content analysis and summarization
- Add support for additional file formats (PowerPoint, text files, etc.)
- Create intelligent content extraction based on file context
- Add OCR capabilities for scanned documents

### 2. Improved User Experience
- Add file thumbnail generation for visual previews
- Implement batch file upload capabilities
- Create file processing progress bars with percentage indicators
- Add file content highlighting and search capabilities

### 3. Advanced AI Integration
- Implement context-aware file content interpretation
- Add multi-modal AI processing for image and text combinations
- Create file-specific response templates and formatting
- Develop file-based conversation memory features

### 4. Performance Optimization
- Implement intelligent file caching strategies
- Add distributed processing for large files
- Optimize database queries for file metadata retrieval
- Implement CDN integration for file distribution

### 5. Security Enhancements
- Add virus scanning for uploaded files
- Implement content-based file validation
- Add encryption for sensitive file processing
- Enhance access controls for file-based conversations

## Conclusion

The File Preprocessing feature (FT-007) successfully enables rich, file-enhanced AI conversations while maintaining security and performance. The implementation provides a solid foundation for processing various file types with asynchronous background processing, ensuring optimal user experience and system efficiency.

**Key Strengths:**
- Comprehensive multi-format file support with specialized extractors
- Asynchronous processing with Bull queue for optimal performance
- Seamless integration with AI providers for enhanced responses
- Robust security measures with file validation and cleanup
- Real-time status tracking with WebSocket notifications

**Implementation Success:**
- Complete file processing workflow with background jobs
- Proper content extraction for all supported file formats
- Secure handling with validation and temporary file management
- Well-documented API endpoints with consistent responses
- Thorough testing and validation of all processing scenarios

The feature establishes a strong foundation for file-enhanced AI interactions while maintaining the application's core functionality and security standards, enabling users to leverage various document types in their AI conversations effectively.