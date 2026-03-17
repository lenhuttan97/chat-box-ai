# FT-007 API Documentation

## File Endpoints

### 1. Upload File

```
POST /api/v1/files/upload
Content-Type: multipart/form-data
```

**Request:**
```
file: <binary>
```

**Response (Success):**
```json
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

**Response (Error - File too large):**
```json
{
  "data": null,
  "message": "File size exceeds limit of 10MB",
  "statusCode": 413
}
```

**Response (Error - Unsupported type):**
```json
{
  "data": null,
  "message": "File type not supported",
  "statusCode": 400
}
```

---

### 2. Get File Status

```
GET /api/v1/files/:id
```

**Response (Processing):**
```json
{
  "data": {
    "fileId": "uuid",
    "status": "processing",
    "extractedText": null
  },
  "message": "File is being processed",
  "statusCode": 200
}
```

**Response (Completed):**
```json
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

**Response (Failed):**
```json
{
  "data": {
    "fileId": "uuid",
    "status": "failed",
    "error": "Failed to extract text from PDF"
  },
  "message": "File processing failed",
  "statusCode": 200
}
```

---

## Chat với File (reuse API)

### Send Message with File

```
POST /api/v1/conversation/messages
```

**Request:**
```json
{
  "message": "Summarize this document",
  "fileId": "uuid-of-uploaded-file",
  "conversation_id": "optional-conversation-id"
}
```

**Response (Streaming):**
```
data: {"conversationId": "uuid"}

data: {"chunk": "Here is "}

data: {"chunk": "a summary "}

data: {"chunk": "of your document..."}

data: {"done": true}
```

---

## WebSocket (Optional)

### Subscribe to File Processing

```
ws://domain/ws/files/:fileId
```

**Events:**
```json
{ "event": "processing", "data": { "fileId": "uuid" } }
{ "event": "completed", "data": { "fileId": "uuid", "extractedText": "..." } }
{ "event": "failed", "data": { "fileId": "uuid", "error": "..." } }
```

---

## Configuration

### Environment Variables

```env
# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
UPLOAD_TEMP_DIR=./uploads/temp

# Queue
REDIS_HOST=localhost
REDIS_PORT=6379
QUEUE_FILE_PROCESS=file-process
```

### Allowed MIME Types

| Type | MIME |
|------|------|
| JPEG | image/jpeg |
| PNG | image/png |
| WebP | image/webp |
| PDF | application/pdf |
| DOCX | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| XLSX | application/vnd.openxmlformats-officedocument.spreadsheetml.sheet |
