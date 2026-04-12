# Chat Settings Documentation

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

The Chat Settings feature in the Chat Box AI application provides users with comprehensive configuration options for individual conversations. This feature enables users to customize various parameters including conversation names, AI system prompts, context windows, temperature settings, and maximum token limits. The implementation ensures that these personalized settings are seamlessly integrated into the AI response generation process, enhancing the conversational experience while maintaining user control over AI behavior.

## Features

- **Conversation Naming**: Customizable conversation titles for better organization
- **System Prompt Configuration**: Per-conversation AI role and behavior customization
- **Context Window Control**: Adjustable token limits for conversation context
- **Temperature Adjustment**: Creativity level control (0-1 scale)
- **Response Length Limits**: Configurable maximum token output
- **Settings Persistence**: Persistent storage of user preferences per conversation
- **Real-time Integration**: Settings applied dynamically during AI interactions
- **User Ownership**: Secure access control ensuring only owners can modify settings

## Architecture Components

### Backend Components
- **Conversation Controller**: Manages settings update and retrieval operations
- **Conversation Service**: Handles business logic for settings validation and updates
- **Prisma ORM**: Database operations for conversation settings
- **Authentication Guards**: Firebase-based access control for settings modification
- **AI Integration Layer**: Applies conversation settings to AI requests

### Frontend Components
- **Settings Modal**: Comprehensive interface for configuring conversation parameters
- **Settings Panel**: Sidebar or dedicated panel for settings access
- **State Management**: Redux store for settings persistence and validation
- **Form Validation**: Client-side validation for settings inputs

### Database Schema
```prisma
model conversation {
  id            String   @id @default(uuid())
  name          String
  user_id       String?  @map("user_id")
  system_prompt String?  @map("system_prompt")
  context_token Int?     @default(4096) @map("context_token")
  temperature   Float?   @default(0.7) @map("temperature")
  max_tokens    Int?     @default(2048) @map("max_tokens")
  created_at    DateTime @default(now()) @map("created_at")
  updated_at    DateTime @updatedAt @map("updated_at")

  message       message[]

  @@map("conversation")
}
```

## Workflows

### Settings Update Workflow
1. User opens conversation settings interface
2. Current settings are loaded from database
3. User modifies desired parameters
4. Settings are validated for correctness
5. Updated settings are saved to database
6. Changes are applied to ongoing conversation

### AI Integration Workflow
1. User sends message to conversation
2. System retrieves conversation with current settings
3. Settings are applied to AI request configuration
4. AI processes request with customized parameters
5. Response is generated according to user preferences
6. Settings remain active for subsequent messages

### Validation Workflow
1. User submits updated settings
2. Input validation occurs on frontend
3. Additional validation occurs on backend
4. Settings are checked for security compliance
5. Validated settings are persisted to database
6. Confirmation is provided to user

## Security Features

- **Access Control**: Only conversation owners can modify settings
- **Input Validation**: Comprehensive validation of all settings parameters
- **Sanitization**: System prompt content is sanitized to prevent injection
- **Rate Limiting**: Protection against excessive settings modifications
- **Session Validation**: Firebase authentication required for modifications
- **Parameter Bounds**: Enforced limits on temperature (0-1) and token values
- **Data Integrity**: Database constraints ensure valid setting values
- **Audit Trail**: Settings changes logged for security monitoring

## User Experience

### Settings Interface
- Intuitive modal or panel interface for easy access
- Clear labeling and descriptions for each setting
- Real-time validation feedback during input
- Visual indicators for default vs. custom values
- Smooth transitions between different setting categories

### Customization Experience
- Immediate effect of settings changes on AI responses
- Clear visual feedback when settings are applied
- Helpful tooltips explaining each parameter's function
- Preset options for common configurations
- Ability to revert to default settings easily

### Performance Considerations
- Efficient settings loading without interface delays
- Quick save operations with immediate feedback
- Optimized database queries for settings retrieval
- Minimal impact on chat performance

### Error Handling UX
- Clear error messages for invalid setting values
- Prevention of saving invalid configurations
- Graceful handling of server-side validation errors
- User-friendly guidance for correcting errors

## API Endpoints

### Update Conversation Settings
```
PATCH /api/v1/conversations/:id
Content-Type: application/json

Request:
{
  "name": "Tên mới",
  "systemPrompt": "System prompt...",
  "contextToken": 8192,
  "temperature": 0.8,
  "maxTokens": 4096
}

Response:
{
  "data": {
    "id": "uuid",
    "name": "Tên mới",
    "systemPrompt": "System prompt...",
    "contextToken": 8192,
    "temperature": 0.8,
    "maxTokens": 4096,
    ...
  },
  "message": "Conversation updated successfully",
  "statusCode": 200
}
```

### Get Conversation with Settings
```
GET /api/v1/conversations/:id

Response:
{
  "data": {
    "id": "conv-uuid-123",
    "name": "Tên mới",
    "systemPrompt": "System prompt...",
    "contextToken": 8192,
    "temperature": 0.8,
    "maxTokens": 4096,
    "messageCount": 5,
    "createdAt": "2026-03-12T10:00:00Z",
    "updatedAt": "2026-03-12T10:30:00Z"
  },
  "message": "Success",
  "statusCode": 200
}
```

### Settings Validation Response
```
{
  "data": null,
  "message": "Invalid temperature value. Must be between 0 and 1.",
  "statusCode": 400
}
```

## Integration Points

### Backend Integrations
- **AI Service**: Applies conversation settings to Gemini API requests
- **Conversation Controller**: Handles settings update and retrieval
- **Authentication System**: Validates user ownership for modifications
- **Prisma Schema**: Stores settings in conversation model

### Frontend Integrations
- **Settings Modal**: UI component for configuring conversation parameters
- **Redux Store**: State management for settings and validation
- **Form Components**: Input validation and user interaction handling
- **Chat Window**: Applies settings to ongoing conversations

### AI Integration
- **System Instruction**: Applies systemPrompt to Gemini requests
- **Generation Configuration**: Uses contextToken and maxTokens for response control
- **Temperature Setting**: Controls AI creativity level in responses
- **Request Customization**: Dynamically adjusts AI parameters per conversation

## Error Handling

### Validation Errors
- **Temperature Range**: Must be between 0 and 1
- **Token Limits**: Must be within acceptable ranges
- **Name Length**: Must meet minimum and maximum length requirements
- **System Prompt**: Must not exceed character limits

### Access Control Errors
- **Unauthorized Access**: User not logged in attempting modification
- **Ownership Violation**: Non-owner attempting to modify settings
- **Invalid Conversation**: Attempting to modify non-existent conversation

### Data Integrity Errors
- **Database Constraints**: Violation of schema constraints
- **Type Mismatches**: Incorrect data types in settings
- **Required Fields**: Missing mandatory settings values

### Error Response Format
```json
{
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid temperature value. Must be between 0 and 1.",
    "details": [
      {
        "field": "temperature",
        "message": "Temperature must be between 0 and 1"
      }
    ]
  },
  "statusCode": 400
}
```

## State Management

### Backend State
- **Settings Cache**: Temporary storage for frequently accessed settings
- **Validation State**: Tracks validation results during processing
- **User Permissions**: Maintains ownership and access rights
- **Configuration State**: Runtime configuration from environment

### Frontend State
- **Settings Form**: Current values in the settings interface
- **Validation State**: Input validation results and error messages
- **Loading States**: Indicators during save operations
- **Dirty State**: Tracks unsaved changes in settings

### Database State
- **Conversation Settings**: Persistent storage of all configuration values
- **History Tracking**: Records of settings changes over time
- **Default Values**: Baseline values for new conversations

## Workflow Analysis

### Performance Impact
- **Minimal Overhead**: Settings retrieval adds negligible latency
- **Efficient Updates**: Optimized database operations for settings changes
- **Caching Benefits**: Reduced API calls through local caching
- **Validation Efficiency**: Quick validation prevents expensive operations

### Scalability Considerations
- **Individual Settings**: Per-conversation settings scale linearly
- **Database Indexing**: Proper indexing supports efficient queries
- **Memory Usage**: Settings consume minimal memory per conversation
- **Concurrency**: Thread-safe operations for simultaneous modifications

### Maintainability Factors
- **Modular Design**: Settings logic separated from other features
- **Configuration Management**: Centralized settings handling
- **Error Isolation**: Settings errors don't affect other functionality
- **Testing Coverage**: Individual testing for each setting parameter

## User Flow

### Settings Configuration Process
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                USER FLOW - CHAT SETTINGS CONFIGURATION                  │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  User Opens Conversation Settings                                                       │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Load Current     │─────────────► GET /api/v1/conversations/:id                       │
│  │Settings         │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Display Settings │─────────────► Show current values in modal/panel                  │
│  │Interface        │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │User Modifies    │─────────────► User changes temperature, system prompt, etc.       │
│  │Settings         │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Validate Input   │─────────────► Client and server-side validation                   │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Save Settings    │─────────────► PATCH /api/v1/conversations/:id                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Confirmation     │─────────────► Success message and updated values                  │
│  │Feedback         │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Settings Active  │─────────────► New messages use updated configuration              │
│  │in Conversation  │                                                                     │
│  └─────────────────┘                                                                     │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### AI Integration Flow
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              USER FLOW - SETTINGS IN AI INTERACTION                     │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  User Sends Message to Conversation with Custom Settings                                │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Retrieve         │─────────────► Get conversation with current settings              │
│  │Conversation     │                                                                     │
│  │Settings         │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Apply Settings   │─────────────► Use systemPrompt, temperature, etc. in AI req       │
│  │to AI Request    │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Generate AI      │─────────────► Gemini processes with custom parameters             │
│  │Response         │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Stream Response  │─────────────► Return response according to settings               │
│  │to User          │                                                                     │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Settings Persist │─────────────► Settings remain active for next message             │
│  │for Next Message │                                                                     │
│  └─────────────────┘                                                                     │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Task Flow

### Developer Task Sequence - CHAT SETTINGS IMPLEMENTATION

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                 DEVELOPER IMPLEMENTATION SEQUENCE                       │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  1. EXTEND DATABASE SCHEMA                                                             │
│     • Add settings fields to conversation model in Prisma schema                        │
│     • Set appropriate defaults for temperature, contextToken, maxTokens                 │
│     • Add field constraints and validation rules                                        │
│     • Run migrations to update database                                               │
│                                                                                         │
│  2. IMPLEMENT CONVERSATION CONTROLLER                                                  │
│     • Add PATCH endpoint for updating settings                                          │
│     • Implement validation logic for all setting parameters                             │
│     • Add authentication and ownership checks                                           │
│     • Create comprehensive response formatting                                         │
│                                                                                         │
│  3. BUILD SETTINGS INTERFACE                                                           │
│     • Create settings modal or panel component                                          │
│     • Implement form fields for each setting parameter                                  │
│     • Add real-time validation and error feedback                                       │
│     • Create save/cancel functionality with proper UX                                   │
│                                                                                         │
│  4. INTEGRATE WITH AI SERVICE                                                          │
│     • Modify AI request generation to include conversation settings                     │
│     • Apply systemPrompt as systemInstruction in Gemini requests                        │
│     • Use temperature and token settings in generation configuration                    │
│     • Test settings application with actual AI responses                               │
│                                                                                         │
│  5. ADD CLIENT-SIDE VALIDATION                                                         │
│     • Implement form validation for temperature range (0-1)                             │
│     • Add token limit validation with reasonable bounds                                 │
│     • Create input sanitization for system prompt content                              │
│     • Add user-friendly error messages and guidance                                     │
│                                                                                         │
│  6. IMPLEMENT ACCESS CONTROL                                                           │
│     • Add Firebase authentication to settings endpoints                                │
│     • Implement ownership verification for settings modifications                       │
│     • Create proper error responses for unauthorized access                            │
│     • Test security boundaries and edge cases                                          │
│                                                                                         │
│  7. BUILD STATE MANAGEMENT                                                             │
│     • Create Redux slice for settings state management                                  │
│     • Implement settings caching and synchronization                                    │
│     • Add loading and error states for settings operations                             │
│     • Create settings change detection and dirty state tracking                        │
│                                                                                         │
│  8. TESTING AND VALIDATION                                                             │
│     • Write unit tests for all setting parameters                                      │
│     • Test validation logic with edge cases                                             │
│     • Verify AI integration applies settings correctly                                  │
│     • Test security controls and access restrictions                                   │
│                                                                                         │
│  9. USER EXPERIENCE OPTIMIZATION                                                       │
│     • Fine-tune settings interface for usability                                       │
│     • Add tooltips and guidance for each setting                                       │
│     • Implement smooth transitions and feedback                                        │
│     • Test accessibility and responsive design                                         │
│                                                                                         │
│  10. PERFORMANCE OPTIMIZATION                                                          │
│     • Optimize database queries for settings retrieval                                 │
│     • Implement efficient caching strategies                                            │
│     • Test with large numbers of conversations                                          │
│     • Monitor and optimize API response times                                          │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Recommendations & Improvements

### 1. Enhanced Settings Options
- Add advanced configuration options like stop sequences and candidate count
- Implement preset templates for common AI personalities and behaviors
- Create settings profiles that can be applied to multiple conversations
- Add visual indicators showing the impact of different settings

### 2. Improved User Experience
- Implement live preview of setting changes on AI responses
- Add quick-access shortcuts for frequently used settings combinations
- Create settings import/export functionality for sharing configurations
- Add historical tracking of setting changes with ability to revert

### 3. Advanced AI Integration
- Implement adaptive settings that adjust based on conversation context
- Add AI-powered suggestions for optimal setting configurations
- Create conversation-specific AI behavior patterns
- Add support for more sophisticated AI model parameters

### 4. Performance Optimization
- Implement intelligent caching of frequently accessed settings
- Add bulk settings operations for multiple conversations
- Optimize database queries with proper indexing strategies
- Create efficient settings synchronization across devices

### 5. Security Enhancements
- Add enhanced validation for system prompt content
- Implement more granular access controls for shared conversations
- Add audit logging for settings modifications
- Enhance sanitization of user input for security

## Conclusion

The Chat Settings feature (FT-003) successfully provides users with comprehensive control over their AI conversation parameters while maintaining security and usability. The implementation offers a solid foundation for personalized AI interactions with robust validation and integration capabilities.

**Key Strengths:**
- Comprehensive settings control with intuitive interface
- Strong security with proper access controls and validation
- Seamless integration with AI response generation
- Efficient database design with proper constraints
- Well-documented API endpoints with consistent responses

**Implementation Success:**
- Complete settings functionality with all required parameters
- Proper validation and error handling throughout
- Secure access control ensuring only owners can modify settings
- Effective integration with AI service for real-time application
- Thorough testing and validation of all components

The feature establishes a strong foundation for personalized AI interactions while maintaining the application's core functionality and security standards.