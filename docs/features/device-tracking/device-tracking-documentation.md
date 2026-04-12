# Anonymous + Device Tracking Documentation

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

The Anonymous + Device Tracking feature in the Chat Box AI application enables users to engage in conversations without authentication while maintaining conversation continuity and device identification. This feature captures comprehensive device information for tracking purposes and allows anonymous conversations to be seamlessly linked to user accounts upon authentication. The implementation ensures that user privacy is maintained while providing valuable analytics and continuity features.

## Features

- **Anonymous Chat Access**: Users can engage in conversations without logging in
- **Device Identification**: Comprehensive device information capture and storage
- **Conversation Continuity**: Anonymous conversations persist when users log in
- **Online Status Tracking**: Real-time device online/offline status monitoring
- **Device Linking**: Seamless association of anonymous devices with user accounts
- **Privacy Protection**: Secure handling of device information without compromising privacy
- **Cross-Session Continuity**: Persistent conversations across browser sessions
- **Device Analytics**: Collection of device information for analytics and optimization

## Architecture Components

### Backend Components
- **Device Service**: Manages device identification, creation, and updates
- **Device Controller**: Handles device-related API requests and authentication
- **Conversation Service**: Links conversations to devices for anonymous users
- **Prisma ORM**: Database operations for users, devices, and conversations
- **Authentication Middleware**: Handles both authenticated and anonymous requests
- **Heartbeat Service**: Manages online status updates for devices

### Frontend Components
- **Device Info Collector**: Captures browser, OS, timezone, and other device details
- **Local Storage Manager**: Persists device ID across browser sessions
- **Authentication Handler**: Manages transition from anonymous to authenticated state
- **Online Status Indicator**: Shows device online/offline status

### Database Schema
```prisma
model user {
  id            String   @id @default(uuid())
  email         String?  @unique
  password      String?
  firebase_uid  String?  @unique
  display_name  String?  @map("display_name")
  photo_url     String?  @map("photo_url")
  provider      String?  // "email" | "firebase" | null (anonymous)
  
  created_at    DateTime @default(now()) @map("created_at")
  updated_at    DateTime @updatedAt @map("updated_at")
  
  devices       device[]
  conversations conversation[]
  
  @@map("user")
}

model device {
  id                String   @id @default(uuid())
  user_id           String?  @map("user_id")
  user              user?    @relation(fields: [user_id], references: [id])
  
  device_id         String   @unique  // từ localStorage
  browser           String?
  os                String?
  language          String?
  timezone          String?
  screen_resolution String?
  ip_address        String?
  last_seen         DateTime @default(now()) @map("last_seen")
  is_online         Boolean  @default(false) @map("is_online")
  
  created_at        DateTime @default(now()) @map("created_at")
  updated_at        DateTime @updatedAt @map("updated_at")
  
  conversations     conversation[]
  
  @@map("device")
}

model conversation {
  id          String   @id @default(uuid())
  name        String
  user_id     String?  @map("user_id")
  user        user?    @relation(fields: [user_id], references: [id])
  device_id   String?  @map("device_id")
  device      device?  @relation(fields: [device_id], references: [id])
  
  created_at  DateTime @default(now()) @map("created_at")
  updated_at  DateTime @updatedAt @map("updated_at")
  
  message     message[]
  
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

### Anonymous User Workflow
1. User accesses application without authentication
2. Frontend collects device information (browser, OS, timezone, etc.)
3. Device ID is generated and stored in localStorage
4. Device information is sent to backend with each request
5. Backend creates or retrieves device record in database
6. Conversations are associated with device ID for anonymous user

### Device Linking Workflow
1. User authenticates with Firebase credentials
2. Backend receives authenticated request with device ID
3. Device record is linked to authenticated user account
4. All previous anonymous conversations remain accessible
5. Future conversations are associated with user account
6. Device continues to track online status

### Online Status Workflow
1. Device sends periodic heartbeat requests or makes API calls
2. Backend updates device's last_seen timestamp
3. Online status is determined based on last activity
4. Frontend displays online/offline indicators
5. Status updates are synchronized across connected devices

## Security Features

- **Device Privacy**: Device information collected without personally identifiable information
- **Secure Device ID**: Randomly generated device IDs stored locally and in database
- **IP Address Protection**: IP addresses are stored but not exposed in responses
- **Authentication Verification**: Proper validation when linking devices to users
- **Data Isolation**: Devices and conversations are properly isolated by ownership
- **Session Security**: Secure handling of both anonymous and authenticated sessions
- **Rate Limiting**: Protection against device enumeration attacks
- **Access Control**: Proper authorization checks for device-related operations

## User Experience

### Anonymous Access
- Seamless entry into conversations without authentication barriers
- Clear indication of anonymous status in UI
- Prompt to sign in to preserve conversations across devices
- Smooth transition when logging in to retain anonymous conversations

### Device Information
- Automatic collection of device details without user input
- Respectful handling of privacy-sensitive information
- Option to control data collection preferences
- Transparent use of device information for service improvement

### Conversation Continuity
- Persistent conversations across browser sessions
- Easy access to previous anonymous conversations
- Clear indication of conversation ownership after login
- Intuitive merging of anonymous and authenticated conversations

### Online Status
- Visual indicators showing device online/offline status
- Real-time updates of status changes
- Clear understanding of availability status
- Privacy controls for online status visibility

## API Endpoints

### Enhanced Message Endpoint
```
POST /api/v1/conversation/messages
Headers:
Authorization: Bearer <token>      // nếu login
X-Device-Info: <json>              // always sent

Request Body:
{
  "message": "Hello",
  "conversation_id": "optional"
}

Response:
{
  "data": {
    "conversation_id": "uuid",
    "message": "response chunk"
  },
  "message": "Success",
  "statusCode": 200
}
```

### Device Management Endpoints
```
GET /api/v1/devices
Response:
{
  "data": [
    {
      "id": "device-uuid",
      "deviceId": "local-device-id",
      "browser": "Chrome 122",
      "os": "MacIntel",
      "timezone": "Asia/Ho_Chi_Minh",
      "lastSeen": "2026-03-15T10:00:00Z",
      "isOnline": true,
      "createdAt": "2026-03-15T09:00:00Z"
    }
  ],
  "message": "Devices retrieved",
  "statusCode": 200
}
```

```
PATCH /api/v1/devices/:id
{
  "name": "My Laptop"
}

Response:
{
  "data": {
    "id": "device-uuid",
    "name": "My Laptop"
  },
  "message": "Device updated",
  "statusCode": 200
}
```

### Device Info Header Format
```
X-Device-Info: {
  "deviceId": "device_xxx",
  "browser": "Chrome 122",
  "os": "MacIntel", 
  "timezone": "Asia/Ho_Chi_Minh",
  "language": "en-US",
  "screenResolution": "1920x1080"
}
```

## Integration Points

### Backend Integrations
- **Authentication System**: Seamless integration with Firebase authentication
- **Conversation Service**: Links conversations to devices for anonymous users
- **Prisma ORM**: Database operations for device and user relationships
- **Request Middleware**: Handles device info extraction and processing
- **Heartbeat Service**: Manages online status updates

### Frontend Integrations
- **Device Info Collection**: Browser APIs for collecting device information
- **Local Storage**: Persistent device ID storage across sessions
- **Authentication Flow**: Smooth transition from anonymous to authenticated state
- **State Management**: Redux store for device status and information
- **Real-time Updates**: WebSocket or polling for online status updates

### External Services
- **Firebase Authentication**: User authentication and session management
- **Browser APIs**: Navigator, screen, timezone APIs for device information
- **LocalStorage**: Client-side device ID persistence

## Error Handling

### Device Registration Errors
- **Duplicate Device ID**: Handling conflicts when device ID already exists
- **Invalid Device Info**: Validation errors for malformed device information
- **Storage Limitations**: LocalStorage quota exceeded scenarios
- **Network Issues**: Failed device info transmission

### Authentication Errors
- **Device Linking Failures**: Issues when linking anonymous devices to users
- **Session Conflicts**: Multiple devices attempting to link simultaneously
- **Permission Violations**: Unauthorized access to other users' devices

### Online Status Errors
- **Heartbeat Failures**: Failed online status updates
- **Timestamp Synchronization**: Clock differences affecting status accuracy
- **Connection Drops**: Temporary disconnections affecting status

### Error Response Format
```json
{
  "data": null,
  "error": {
    "code": "DEVICE_LINKING_FAILED",
    "message": "Failed to link device to user account",
    "details": {
      "device_id": "device_xxx",
      "user_id": "user_xxx"
    }
  },
  "statusCode": 400
}
```

## State Management

### Backend State
- **Device Registry**: Track active devices and their online status
- **Session State**: Manage both anonymous and authenticated sessions
- **Linking Queue**: Handle device-user linking operations
- **Heartbeat Tracking**: Monitor device activity and online status

### Frontend State
- **Device Information**: Current device details and capabilities
- **Authentication State**: Track transition from anonymous to authenticated
- **Online Status**: Current device online/offline status
- **Local Storage**: Persistent device ID and preferences

### Database State
- **Device Records**: Persistent storage of device information and status
- **User-Device Links**: Association between users and their devices
- **Conversation Ownership**: Track conversation ownership across state changes

## Workflow Analysis

### Performance Impact
- **Device Identification**: Minimal overhead for device info collection
- **Database Queries**: Optimized queries for device lookup and creation
- **Network Overhead**: Efficient device info transmission
- **Storage Usage**: Lightweight device information storage

### Scalability Considerations
- **Device Volume**: Support for large numbers of anonymous devices
- **Concurrent Sessions**: Handling multiple devices per user
- **Database Indexing**: Efficient indexing for device lookups
- **Caching Strategies**: Optimize frequent device information access

### Maintainability Factors
- **Modular Architecture**: Device tracking separated from other features
- **Configuration Management**: Centralized device info collection settings
- **Error Isolation**: Device errors don't affect core functionality
- **Testing Coverage**: Comprehensive testing for anonymous workflows

## User Flow

### Anonymous User Journey
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                USER FLOW - ANONYMOUS ACCESS                             │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  User Visits Chat Application Without Login                                               │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Collect Device   │─────────────► Gather browser, OS, timezone, etc.                  │
│  │Information      │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Generate Device  │─────────────► Create unique device ID in localStorage             │
│  │ID & Store       │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Start Chat       │─────────────► Begin conversation without auth                     │
│  │Without Auth     │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Send Device Info │─────────────► Include X-Device-Info header with requests          │
│  │with Requests    │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Backend Creates  │─────────────► Create device record linked to conversations        │
│  │Device Record    │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Conversations    │─────────────► All messages associated with device ID              │
│  │Linked to Device │                                                                     │
│  └─────────────────┘                                                                     │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### Device Linking Process
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              USER FLOW - DEVICE LINKING                                  │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  Anonymous User Decides to Login                                                        │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Authenticate     │─────────────► Firebase login/signup process                        │
│  │with Firebase    │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Authenticated    │─────────────► JWT token received, user session established        │
│  │Request with     │                                                                     │
│  │Device ID        │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Backend Links    │─────────────► Associate device record with user account           │
│  │Device to User   │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Anonymous        │─────────────► Previously anonymous conversations now accessible   │
│  │Conversations    │                                                                     │
│  │Preserved        │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Future          │─────────────► New conversations linked to user account             │
│  │Conversations   │                                                                     │
│  │Linked to User  │                                                                     │
│  └─────────────────┘                                                                     │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Task Flow

### Developer Task Sequence - ANONYMOUS + DEVICE TRACKING IMPLEMENTATION

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                 DEVELOPER IMPLEMENTATION SEQUENCE                       │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  1. DESIGN DATABASE SCHEMA                                                             │
│     • Create device model with comprehensive device information fields                  │
│     • Establish relationships between users, devices, and conversations                 │
│     • Add proper indexes for efficient device lookups                                   │
│     • Run migrations to update database schema                                          │
│                                                                                         │
│  2. IMPLEMENT DEVICE SERVICE                                                           │
│     • Create DeviceService for device creation and management                           │
│     • Implement findOrCreateDevice method with proper validation                        │
│     • Add device info parsing and validation logic                                      │
│     • Create online status update mechanisms                                            │
│                                                                                         │
│  3. BUILD DEVICE CONTROLLER                                                            │
│     • Add endpoints for device management (GET, PATCH)                                  │
│     • Implement authentication middleware for device operations                         │
│     • Create proper response formatting for device information                          │
│     • Add error handling for device-related operations                                  │
│                                                                                         │
│  4. MODIFY CONVERSATION SERVICE                                                        │
│     • Update conversation creation to handle device associations                        │
│     • Modify message endpoints to accept device info headers                            │
│     • Implement logic to link conversations to devices for anonymous users              │
│     • Add user-device linking functionality                                             │
│                                                                                         │
│  5. CREATE FRONTEND DEVICE INFO COLLECTION                                           │
│     • Implement browser API usage for device information gathering                      │
│     • Create device ID generation and localStorage management                           │
│     • Build X-Device-Info header construction                                           │
│     • Add device info validation and sanitization                                       │
│                                                                                         │
│  6. IMPLEMENT AUTHENTICATION INTEGRATION                                               │
│     • Modify authentication flow to handle device linking                               │
│     • Create middleware to process device info in authenticated requests                │
│     • Implement logic to associate anonymous devices with user accounts                 │
│     • Add proper error handling for authentication-device conflicts                     │
│                                                                                         │
│  7. ADD ONLINE STATUS TRACKING                                                         │
│     • Implement heartbeat mechanism for online status updates                           │
│     • Create status determination logic based on activity timestamps                    │
│     • Add real-time status updates to frontend                                          │
│     • Implement status cleanup for inactive devices                                     │
│                                                                                         │
│  8. BUILD USER INTERFACE ELEMENTS                                                    │
│     • Create visual indicators for device online status                                 │
│     • Add device management UI for authenticated users                                  │
│     • Implement prompts for anonymous users to sign in                                  │
│     • Create clear indication of anonymous vs. authenticated state                      │
│                                                                                         │
│  9. TESTING AND VALIDATION                                                             │
│     • Write comprehensive tests for anonymous workflows                                 │
│     • Test device linking functionality thoroughly                                      │
│     • Validate privacy and security measures                                            │
│     • Test scalability with multiple concurrent devices                                 │
│                                                                                         │
│  10. SECURITY AND PRIVACY REVIEW                                                      │
│     • Audit device information collection for privacy compliance                        │
│     • Implement proper data sanitization and storage                                    │
│     • Add privacy controls and user consent mechanisms                                  │
│     • Document data retention and deletion policies                                     │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Recommendations & Improvements

### 1. Enhanced Device Tracking
- Implement more sophisticated device fingerprinting techniques
- Add support for cross-device synchronization of conversations
- Create device reputation scoring for abuse prevention
- Add geolocation tracking with user consent

### 2. Improved User Experience
- Implement smart prompts for anonymous users to sign in
- Add device trust scoring for seamless authentication experiences
- Create device-specific preferences and settings
- Add multi-device conversation synchronization

### 3. Advanced Analytics
- Implement comprehensive device usage analytics
- Add conversion tracking from anonymous to authenticated users
- Create device-based personalization features
- Add predictive analytics for user behavior

### 4. Privacy and Compliance
- Implement GDPR-compliant data handling procedures
- Add user controls for device data collection and deletion
- Create audit trails for device information access
- Add privacy-by-design principles to all device tracking

### 5. Security Enhancements
- Add device-based rate limiting and abuse prevention
- Implement device authentication and verification
- Add encryption for sensitive device information
- Enhance protection against device spoofing and fraud

## Conclusion

The Anonymous + Device Tracking feature (FT-005) successfully enables seamless chat experiences for both anonymous and authenticated users while maintaining conversation continuity and valuable device analytics. The implementation provides a solid foundation for user engagement and analytics while preserving privacy and security.

**Key Strengths:**
- Seamless anonymous chat access without authentication barriers
- Comprehensive device information collection and tracking
- Smooth transition from anonymous to authenticated state
- Proper privacy controls and security measures
- Efficient database design with proper relationships

**Implementation Success:**
- Complete device tracking functionality with detailed information
- Proper conversation continuity across authentication states
- Secure handling of device information and privacy
- Well-documented API endpoints with consistent responses
- Thorough testing and validation of anonymous workflows

The feature establishes a strong foundation for user engagement while maintaining the application's core functionality and security standards, enabling both anonymous exploration and authenticated continuity.