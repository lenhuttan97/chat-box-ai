# Chat with Gemini Streaming Documentation

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

The Chat with Gemini Streaming feature in the Chat Box AI application provides real-time AI-powered conversations using Google Gemini API with streaming responses. This feature enables users to engage in dynamic, real-time conversations with AI, receiving responses as they are generated rather than waiting for complete answers. The implementation includes comprehensive conversation management, message history storage, and seamless integration with the authentication system.

## Features

- **Real-time Streaming**: Responses delivered as Server-Sent Events (SSE) for immediate display
- **Conversation Management**: Create, update, and manage multiple conversation threads
- **Message History**: Persistent storage of conversation history in SQLite database
- **Flexible Messaging**: Support for new conversations or appending to existing ones
- **User Authentication**: Integration with Firebase for secure user sessions
- **Model Configuration**: Configurable Gemini model (`gemini-3.1-flash-lite-preview`)
- **API Key Management**: Secure storage and retrieval of Gemini API keys from environment
- **Rich Response Format**: Structured responses with conversation IDs and streaming chunks

## Architecture Components

### Backend Components
- **Conversation Controller**: Manages conversation lifecycle (CRUD operations)
- **Message Controller**: Handles message creation and streaming responses
- **Gemini Service**: Integrates with Google Gemini API for AI responses
- **Prisma ORM**: Database operations for conversations and messages
- **Authentication Guards**: Firebase-based user authentication

### Frontend Components
- **Chat Window**: Real-time display of streaming responses
- **Message Input**: Form for sending user messages
- **Conversation List**: Sidebar for managing multiple conversations
- **State Management**: Redux store for conversation and message states

### Database Schema
```prisma
model user {
  id            String   @id @default(uuid())
  email         String?  @unique
  password      String?  @map("password")
  display_name  String?  @map("display_name")
  firebase_uid  String?  @unique @map("firebase_uid")
  photo_url     String?  @map("photo_url")
  provider      String?
  created_at    DateTime @default(now()) @map("created_at")
  updated_at    DateTime @updatedAt @map("updated_at")

  @@index([email])
  @@map("user")
}

model conversation {
  id         String    @id @default(uuid())
  name       String
  user_id    String?   @map("user_id")
  created_at DateTime  @default(now()) @map("created_at")
  updated_at DateTime  @updatedAt @map("updated_at")

  message    message[]

  @@map("conversation")
}

model message {
  id              String       @id @default(uuid())
  conversation_id String       @map("conversation_id")
  conversation    conversation @relation(fields: [conversation_id], references: [id], onDelete: Cascade)
  role            String
  content         String
  created_at      DateTime     @default(now()) @map("created_at")

  @@index([conversation_id])
  @@map("message")
}
```

## Workflows

### Message Streaming Workflow
1. User submits message with optional conversation ID
2. If no conversation ID, create new conversation
3. Store user message in database
4. Initialize Gemini API connection
5. Stream AI response via Server-Sent Events
6. Store AI response in database upon completion
7. Send conversation ID if newly created

### Conversation Management Workflow
1. User navigates to conversations list
2. Retrieve user's conversations from database
3. Display conversation summaries with message counts
4. On conversation selection, load full conversation details
5. Update UI with conversation history and current state

### Authentication Workflow
1. Verify user session via Firebase
2. Authorize access to user's conversations
3. Allow anonymous conversations for unauthenticated users
4. Link anonymous conversations to user account on login

## Security Features

- **API Key Security**: Gemini API key stored in environment variables, never exposed to frontend
- **Authentication Integration**: Firebase-based user authentication for protected conversations
- **Data Isolation**: Users can only access their own conversations
- **Input Validation**: Sanitization of user messages to prevent injection attacks
- **Rate Limiting**: Protection against excessive API usage
- **Session Management**: Secure session handling with Firebase tokens
- **Database Security**: Prisma schema validation and relation constraints
- **CORS Protection**: Configured to allow only trusted origins

## User Experience

### Chat Interface
- Real-time message display with streaming responses
- Smooth scrolling as AI generates responses
- Clear visual distinction between user and AI messages
- Loading indicators during AI processing
- Error messaging for failed requests

### Conversation Management
- Intuitive conversation list with message previews
- Easy creation of new conversations
- Conversation renaming and organization
- Persistent conversation history across sessions
- Quick access to recent conversations

### Performance Considerations
- Efficient streaming to minimize perceived latency
- Optimized database queries for conversation loading
- Caching of conversation metadata
- Responsive UI during streaming operations

### Error Handling UX
- Graceful degradation when AI service is unavailable
- Clear error messages for different failure scenarios
- Automatic retry mechanisms for transient failures
- User-friendly notifications for connection issues

## API Endpoints

### Send Message with Streaming
```
POST /api/v1/conversation/messages
Content-Type: application/json

Request:
{
  "message": "Hello, how are you?",
  "conversation_id": "optional-uuid"
}

Response (SSE):
Content-Type: text/event-stream
data: {"chunk": "Hello"}
data: {"chunk": " there!"}
data: {"chunk": " I'm doing well."}
data: {"conversation_id": "new-uuid-if-created"}
data: {"done": true}
```

### Conversation Management
```
GET /api/v1/conversations
Response:
{
  "data": [
    {
      "id": "conv-uuid-1",
      "name": "Hỏi về React",
      "userId": null,
      "messageCount": 2,
      "createdAt": "2026-03-12T10:00:00Z",
      "updatedAt": "2026-03-12T10:30:00Z"
    }
  ],
  "message": "Success",
  "statusCode": 200
}
```

```
GET /api/v1/conversations/:id
Response:
{
  "data": {
    "id": "conv-uuid-123",
    "name": "Hỏi về React",
    "messages": [
      {
        "id": "msg-uuid-1",
        "role": "user",
        "content": "React hooks là gì?",
        "createdAt": "2026-03-12T10:30:00Z"
      }
    ]
  },
  "message": "Success",
  "statusCode": 200
}
```

### Create/Update Conversations
```
POST /api/v1/conversations
{
  "name": "Hỏi về React"
}

PUT /api/v1/conversations/:id
{
  "name": "Tên mới"
}
```

### Error Responses
```
{
  "data": null,
  "message": "AI service unavailable",
  "statusCode": 503
}
```

## Integration Points

### Backend Integrations
- **Google Gemini API**: Real-time AI responses with streaming
- **Firebase Authentication**: User session and authorization management
- **Prisma ORM**: Database operations for conversations and messages
- **Server-Sent Events**: Real-time response streaming to frontend

### Frontend Integrations
- **Chat Window Component**: Real-time display of streaming responses
- **Conversation List**: Navigation and management of conversation threads
- **Redux Store**: State management for conversations and messages
- **Axios/Fetch**: API communication with streaming event handling

### External Services
- **Google Cloud Platform**: Gemini API access and management
- **Firebase**: Authentication and user management
- **SQLite**: Local database storage for conversation history

## Error Handling

### API Errors
- **400 Bad Request**: Invalid message format or empty content
- **500 Internal Server Error**: Unexpected server issues
- **503 Service Unavailable**: Gemini API temporarily unavailable
- **401 Unauthorized**: Missing or invalid authentication

### Streaming Errors
- **Connection Drop**: Reconnection logic with exponential backoff
- **Partial Responses**: Recovery from incomplete streaming data
- **Format Mismatch**: Parsing error handling for inconsistent responses
- **Timeout Handling**: Graceful timeout management for long responses

### Database Errors
- **Constraint Violations**: Proper validation and error reporting
- **Connection Issues**: Retry logic for database connectivity problems
- **Transaction Failures**: Rollback mechanisms for failed operations

### Error Response Format
```json
{
  "data": null,
  "message": "AI service unavailable",
  "statusCode": 503
}
```

## State Management

### Backend State
- **Active Streams**: Track ongoing streaming sessions
- **Connection Pool**: Manage multiple concurrent streams
- **Rate Limits**: Track API usage per user/session
- **Session State**: Maintain conversation context

### Frontend State
- **Streaming Status**: Track active streaming operations
- **Message Buffer**: Temporary storage for partial responses
- **Conversation Cache**: Local storage of conversation data
- **UI State**: Loading states, error states, and user interactions

### Database State
- **Conversation History**: Persistent storage of all messages
- **User Associations**: Link conversations to authenticated users
- **Metadata**: Timestamps, message counts, and conversation details

## Workflow Analysis

### Performance Impact
- **Streaming Efficiency**: Real-time responses reduce perceived latency
- **Database Load**: Optimized queries for conversation retrieval
- **API Usage**: Efficient batching and caching strategies
- **Memory Management**: Proper cleanup of streaming resources

### Scalability Considerations
- **Concurrent Sessions**: Support for multiple simultaneous streams
- **Load Balancing**: Distribute requests across multiple instances
- **Database Scaling**: Efficient indexing for conversation queries
- **CDN Integration**: Optimize static asset delivery

### Maintainability Factors
- **Modular Architecture**: Separation of concerns between components
- **Configuration Management**: Centralized API key and model settings
- **Error Isolation**: Contained error handling per conversation
- **Testing Coverage**: Comprehensive test suite for all workflows

## User Flow

### Starting a New Conversation
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                USER FLOW - NEW CONVERSATION START                       │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  User Opens Chat Interface                                                              │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Message Input Bar│─────────────► User types message without conversation ID          │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Send Message     │─────────────► POST /api/v1/conversation/messages (no ID)          │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Backend Creates  │─────────────► New conversation created in database                │
│  │Conversation     │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Store Message    │─────────────► User message saved to database                      │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Stream AI        │─────────────► SSE stream begins with AI response                  │
│  │Response         │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Save AI Response │─────────────► AI message saved to database when complete          │
│  │to Database      │                                                                     │
│  └─────────────────┘                                                                     │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### Continuing Existing Conversation
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                            USER FLOW - CONTINUING EXISTING CONVERSATION                 │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  User Selects Conversation from List                                                    │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Load Conversation│─────────────► GET /api/v1/conversations/:id                       │
│  │Details         │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Display History  │─────────────► Show existing conversation messages                 │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │User Types Reply │─────────────► User enters response in message input               │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Send with Conv ID│─────────────► POST /api/v1/conversation/messages (with ID)        │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Append to Conv   │─────────────► Message added to existing conversation              │
│  │and Stream       │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Update UI in     │─────────────► Real-time streaming updates UI                      │
│  │Real-time        │                                                                     │
│  └─────────────────┘                                                                     │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Task Flow

### Developer Task Sequence - CHAT GEMINI STREAMING IMPLEMENTATION

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                 DEVELOPER IMPLEMENTATION SEQUENCE                       │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  1. SET UP GEMINI INTEGRATION                                                          │
│     • Configure Google Gemini API client                                               │
│     • Set up API key management from environment variables                             │
│     • Implement basic text generation functionality                                    │
│     • Test API connectivity and response format                                        │
│                                                                                         │
│  2. DESIGN DATABASE SCHEMA                                                             │
│     • Create Prisma schema for user, conversation, and message models                  │
│     • Define relationships between entities                                            │
│     • Add necessary indexes for performance                                            │
│     • Run initial migrations                                                           │
│                                                                                         │
│  3. IMPLEMENT AUTHENTICATION                                                           │
│     • Set up Firebase authentication integration                                       │
│     • Create auth guards and middleware                                                │
│     • Implement user session management                                                │
│     • Test authentication flows                                                        │
│                                                                                         │
│  4. BUILD CONVERSATION CONTROLLER                                                      │
│     • Implement CRUD operations for conversations                                      │
│     • Add endpoints for creating, retrieving, updating, and deleting conversations     │
│     • Include user association and validation                                          │
│     • Add pagination and filtering capabilities                                        │
│                                                                                         │
│  5. CREATE MESSAGE CONTROLLER                                                          │
│     • Implement message creation and retrieval                                         │
│     • Add streaming endpoint for real-time responses                                   │
│     • Integrate with Gemini service for AI responses                                   │
│     • Handle conversation creation on first message                                    │
│                                                                                         │
│  6. IMPLEMENT SSE STREAMING                                                            │
│     • Set up Server-Sent Events for real-time responses                                │
│     • Create proper response formatting for streaming                                  │
│     • Handle connection management and error recovery                                  │
│     • Test streaming performance and reliability                                       │
│                                                                                         │
│  7. BUILD FRONTEND COMPONENTS                                                          │
│     • Create chat window with real-time message display                                │
│     • Implement conversation list and navigation                                       │
│     • Add message input with proper event handling                                     │
│     • Create loading and error states                                                  │
│                                                                                         │
│  8. INTEGRATE FRONTEND WITH BACKEND                                                    │
│     • Connect frontend components to backend APIs                                      │
│     • Implement streaming response handling in frontend                                │
│     • Add proper error handling and user feedback                                      │
│     • Test complete user workflows                                                     │
│                                                                                         │
│  9. ADD ERROR HANDLING AND VALIDATION                                                  │
│     • Implement comprehensive error handling                                           │
│     • Add input validation and sanitization                                            │
│     • Create user-friendly error messages                                              │
│     • Add retry mechanisms for failed requests                                         │
│                                                                                         │
│  10. TESTING AND OPTIMIZATION                                                          │
│     • Write unit tests for all components                                              │
│     • Perform integration testing of complete workflows                                │
│     • Optimize database queries and API performance                                    │
│     • Test scalability with multiple concurrent streams                                │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Recommendations & Improvements

### 1. Enhanced Streaming Capabilities
- Implement advanced streaming features like response interruption
- Add support for different response formats (JSON, text, etc.)
- Create streaming analytics and performance monitoring
- Implement adaptive streaming based on network conditions

### 2. Improved Conversation Intelligence
- Add conversation summarization features
- Implement context-aware response generation
- Create conversation tagging and categorization
- Add smart conversation recommendations

### 3. Advanced User Experience
- Implement rich media support (images, files) in conversations
- Add conversation sharing and collaboration features
- Create customizable AI personas and behaviors
- Add voice input/output capabilities

### 4. Performance Optimization
- Implement intelligent caching strategies for common queries
- Add connection pooling for better resource utilization
- Optimize database queries with proper indexing
- Implement CDN for faster static asset delivery

### 5. Security Enhancements
- Add additional input sanitization and validation
- Implement more granular access controls
- Add audit logging for conversation access
- Enhance API key management and rotation

## Conclusion

The Chat with Gemini Streaming feature (FT-001) successfully delivers real-time AI-powered conversations with robust architecture and excellent user experience. The implementation provides a solid foundation for AI-driven interactions while maintaining security, performance, and scalability.

**Key Strengths:**
- Real-time streaming responses for immediate feedback
- Comprehensive conversation management system
- Strong security with Firebase authentication integration
- Efficient database design with proper relationships
- Well-documented API endpoints with consistent responses

**Implementation Success:**
- Seamless integration with Google Gemini API
- Proper error handling and user feedback mechanisms
- Scalable architecture supporting multiple concurrent streams
- Complete user workflows from conversation creation to engagement
- Thorough testing and validation of all components

The feature establishes a strong foundation for the AI chat application while providing a superior user experience through real-time interactions and persistent conversation management.