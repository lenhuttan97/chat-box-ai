# AI Provider Selection Documentation

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

The AI Provider Selection feature in the Chat Box AI application enables users to choose different AI providers and models for their conversations. This feature extends the existing AI integration beyond Google Gemini to include Ollama, allowing users to select from multiple local and remote AI models. The implementation maintains backward compatibility while providing flexibility for diverse AI capabilities.

## Features

- **Multi-Provider Support**: Users can select between Google Gemini and Ollama as their AI provider
- **Model Selection**: Dynamic model selection per conversation with provider-specific model lists
- **Configuration Management**: Environment-based configuration for Ollama endpoints and model availability
- **Streaming Compatibility**: Maintains consistent streaming response format across all providers
- **Fallback Mechanisms**: Graceful degradation when providers are unavailable
- **Provider Persistence**: Conversation-specific provider and model settings persist across sessions

## Architecture Components

### Backend Components
- **AiService**: Central service that routes requests to appropriate provider implementations
- **OllamaProvider**: Provider implementation for Ollama integration with streaming support
- **GeminiProvider**: Existing provider implementation for Google Gemini (unchanged)
- **Conversation Model**: Extended with provider and model fields in Prisma schema
- **Environment Configuration**: OLLAMA_ENABLED, OLLAMA_BASE_URL, OLLAMA_MODELS variables

### Frontend Components
- **Conversation Settings Modal**: UI for selecting provider and model per conversation
- **Dynamic Dropdowns**: Provider and model selection controls with dynamic loading
- **Settings Persistence**: Store provider/model selections in conversation metadata

### Database Schema
```prisma
model conversation {
  id            String   @id @default(uuid())
  name          String
  user_id       String?  @map("user_id")
  device_id     String?  @map("device_id")
  
  // AI Provider Settings
  provider      String   @default("gemini") @map("provider")  // "gemini" | "ollama"
  model         String?  @map("model")                        // model name (llama3, mistral, etc.)
  
  // Existing settings
  system_prompt String?  @map("system_prompt")
  auto_prompt   String?  @map("auto_prompt")
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

### Provider Selection Workflow
1. User opens conversation settings modal
2. Provider dropdown shows available options (Gemini, Ollama)
3. When Ollama is selected, model dropdown loads available models from backend
4. User selects provider and model
5. Settings are saved to conversation record
6. Future messages use selected provider/model combination

### Message Processing Workflow
1. User sends message to conversation
2. System retrieves conversation with provider/model settings
3. AiService routes to appropriate provider implementation
4. Provider handles API communication and streaming response
5. Response is streamed back to frontend in consistent format

### Ollama Integration Workflow
1. Backend calls Ollama API at configured base URL
2. Uses streaming endpoint for real-time response delivery
3. Parses SSE responses to maintain consistency with Gemini format
4. Handles connection timeouts and retry logic

## Security Features

- **Environment Variable Protection**: Ollama configuration stored in environment variables
- **Endpoint Validation**: Base URL validation to prevent malicious endpoint injection
- **Rate Limiting**: Provider-specific rate limiting to prevent abuse
- **Model Whitelisting**: Configurable model lists to restrict available models
- **Connection Security**: Secure communication with Ollama endpoints
- **Timeout Configuration**: Configurable timeouts to prevent hanging connections
- **Access Control**: Provider selection respects user permissions and conversation ownership

## User Experience

### Settings Interface
- Intuitive provider selection with clear visual distinction between options
- Dynamic model loading that updates when provider changes
- Clear indication of currently selected provider and model
- Visual feedback during model loading operations
- Error messages when providers are unavailable

### Performance Considerations
- Cached model lists to avoid repeated API calls
- Efficient streaming to maintain real-time responsiveness
- Provider health checks to prevent failed requests
- Smooth transitions when switching between providers

### Error Handling UX
- Graceful fallback when Ollama is unavailable
- Clear error messages for invalid configurations
- Automatic retry mechanisms for transient failures
- User-friendly notifications for connection issues

## API Endpoints

### Backend → Ollama Integration
```
GET /api/tags          # List available models
POST /api/chat         # Chat completion with streaming
```

### Frontend → Backend API
```
PATCH /api/v1/conversations/:id
{
  "provider": "ollama",
  "model": "llama3"
}
```

### Get Available Models
```
GET /api/v1/ollama/models
Response:
{
  "data": {
    "providers": {
      "gemini": ["gemini-1.5-flash", "gemini-pro"],
      "ollama": ["llama3", "mistral", "phi3", "codellama", "gemma"]
    }
  },
  "statusCode": 200
}
```

### Environment Configuration
```env
OLLAMA_ENABLED=true
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODELS=llama3,mistral,phi3,codellama,gemma
OLLAMA_TIMEOUT=120000
GEMINI_API_KEY=xxx
GEMINI_MODEL=gemini-1.5-flash
```

## Integration Points

### Backend Integrations
- **AiService**: Central routing point for provider selection
- **Conversation Controller**: Updates provider/model in conversation records
- **Prisma Schema**: Extended with provider and model fields
- **Environment Configuration**: Runtime configuration management

### Frontend Integrations
- **Conversation Settings**: Provider and model selection UI
- **Message Processing**: Uses conversation's provider settings
- **Redux Store**: Stores provider/model preferences
- **API Middleware**: Handles provider-specific requests

### External Integrations
- **Ollama API**: Direct integration with Ollama endpoints
- **Google Gemini API**: Maintains existing integration unchanged
- **Local Ollama Instance**: Supports localhost deployment
- **Remote Ollama Instances**: Supports configurable remote endpoints

## Error Handling

### Provider Availability
- **Ollama Unavailable**: Fallback to Gemini with user notification
- **Connection Timeout**: Configurable timeout with retry logic
- **Invalid Endpoint**: Validation and error reporting
- **Model Not Found**: Validation against available models

### Streaming Errors
- **Connection Drop**: Reconnection logic with exponential backoff
- **Partial Responses**: Recovery from incomplete streaming data
- **Format Mismatch**: Parsing error handling for inconsistent responses

### Configuration Errors
- **Missing Environment Variables**: Startup validation and error reporting
- **Invalid Model Selection**: Validation against configured model lists
- **Permission Issues**: Access control for provider selection

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "PROVIDER_UNAVAILABLE",
    "message": "Selected provider is currently unavailable",
    "details": {
      "provider": "ollama",
      "endpoint": "http://localhost:11434",
      "retry_after": 30
    }
  }
}
```

## State Management

### Backend State
- **Provider Cache**: Cached model lists to reduce API calls
- **Connection Pool**: Managed connections to different providers
- **Configuration State**: Runtime configuration from environment variables
- **Health Status**: Provider availability tracking

### Frontend State
- **Provider Selection**: Currently selected provider and model
- **Loading States**: Model loading indicators and status
- **Error States**: Provider availability and error information
- **Settings Persistence**: Conversation-specific provider preferences

### Database State
- **Conversation Metadata**: Provider and model stored per conversation
- **Model Lists**: Cached available models from providers
- **Provider Status**: Health check results and availability

## Workflow Analysis

### Performance Impact
- **Model Loading**: Initial model fetch may introduce slight delay
- **Provider Switching**: Minimal impact due to caching mechanisms
- **Streaming Performance**: Maintained through consistent SSE format
- **Resource Utilization**: Ollama may require local resources

### Scalability Considerations
- **Multiple Ollama Instances**: Support for load balancing across instances
- **Provider Load Distribution**: Intelligent routing based on availability
- **Cache Management**: Efficient caching to reduce external API calls
- **Connection Management**: Optimized connection pooling

### Maintainability Factors
- **Provider Abstraction**: Clean interfaces for adding new providers
- **Configuration Management**: Centralized environment-based configuration
- **Error Isolation**: Provider-specific errors don't affect other providers
- **Testing Coverage**: Provider-specific test suites for reliability

## User Flow

### Provider Selection Process
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    USER FLOW - AI PROVIDER SELECTION                    │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  User Opens Conversation Settings                                                       │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Provider Dropdown│─────────────► Show available providers (Gemini, Ollama)           │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ├─ Select Gemini ───────► Use existing Gemini integration                       │
│         │                                                                               │
│         └─ Select Ollama ───────► Load available models from backend                    │
│                                  │                                                      │
│                                  ▼                                                      │
│                           ┌─────────────┐                                               │
│                           │Model Dropdown│────────► Show models for selected provider   │
│                           └─────────────┘                                               │
│                                  │                                                      │
│                                  ▼                                                      │
│                           ┌─────────────────┐                                           │
│                           │Save Preferences │────────► Persist provider/model to conv   │
│                           └─────────────────┘                                           │
│                                  │                                                      │
│                                  ▼                                                      │
│                           ┌─────────────────┐                                           │
│                           │Future Messages  │────────► Use selected provider/model      │
│                           └─────────────────┘                                           │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### Message Processing Flow
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                MESSAGE PROCESSING WITH PROVIDER SELECTION               │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  User Sends Message to Conversation                                                     │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────────┐                                                               │
│  │Retrieve Conversation│─────────────► Get provider/model from conversation record      │
│  │Settings            │                                                                 │
│  └─────────────────────┘                                                               │
│         │                                                                               │
│         ▼                                                                               │
│  ┌─────────────────┐                                                                     │
│  │Route to Provider│─────────────► Direct to GeminiProvider or OllamaProvider          │
│  └─────────────────┘                                                                     │
│         │                                                                               │
│         ├─ GeminiProvider ───────► Call Google Gemini API with streaming               │
│         │                                                                               │
│         └─ OllamaProvider ───────► Call Ollama API with streaming                      │
│                                  │                                                      │
│                                  ▼                                                      │
│                           ┌─────────────────┐                                           │
│                           │Stream Response  │────────► Consistent SSE format to FE      │
│                           │to Frontend     │                                           │
│                           └─────────────────┘                                           │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Task Flow

### Developer Task Sequence - AI PROVIDER SELECTION IMPLEMENTATION

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                 DEVELOPER IMPLEMENTATION SEQUENCE                       │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  1. EXTEND DATABASE SCHEMA                                                             │
│     • Add provider and model fields to conversation model                              │
│     • Run Prisma migrations                                                            │
│     • Update seed data if necessary                                                    │
│                                                                                         │
│  2. IMPLEMENT OLLAMA PROVIDER                                                          │
│     • Create OllamaProvider class implementing provider interface                      │
│     • Implement model listing functionality                                            │
│     • Implement chat completion with streaming                                         │
│     • Add error handling and retry logic                                               │
│                                                                                         │
│  3. UPDATE AI SERVICE                                                                  │
│     • Modify AiService to route requests based on provider                             │
│     • Add provider factory pattern                                                     │
│     • Maintain backward compatibility with Gemini                                      │
│     • Implement fallback mechanisms                                                    │
│                                                                                         │
│  4. CONFIGURE ENVIRONMENT VARIABLES                                                    │
│     • Add OLLAMA_ENABLED, OLLAMA_BASE_URL, OLLAMA_MODELS                               │
│     • Set up default configurations                                                    │
│     • Add validation for environment variables                                         │
│                                                                                         │
│  5. UPDATE FRONTEND SETTINGS UI                                                        │
│     • Modify conversation settings modal                                               │
│     • Add provider selection dropdown                                                  │
│     • Add dynamic model loading based on provider                                      │
│     • Update Redux store for provider preferences                                      │
│                                                                                         │
│  6. IMPLEMENT API ENDPOINTS                                                            │
│     • Add endpoint for getting available models                                        │
│     • Update conversation update endpoint                                              │
│     • Add provider health check endpoints                                              │
│     • Ensure consistent response format                                                │
│                                                                                         │
│  7. ADD ERROR HANDLING                                                                 │
│     • Implement provider-specific error handling                                       │
│     • Add connection timeout handling                                                  │
│     • Create fallback mechanisms for unavailable providers                             │
│     • Add user-friendly error messages                                                 │
│                                                                                         │
│  8. TESTING AND VALIDATION                                                             │
│     • Write unit tests for OllamaProvider                                              │
│     • Test provider switching functionality                                            │
│     • Validate streaming response consistency                                          │
│     • Test error scenarios and fallbacks                                               │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Recommendations & Improvements

### 1. Enhanced Provider Management
- Implement provider health monitoring with automatic failover
- Add support for additional AI providers (OpenAI, Anthropic, etc.)
- Create provider performance metrics and analytics
- Add provider-specific configuration optimization

### 2. Improved User Experience
- Add provider-specific model descriptions and capabilities
- Implement provider comparison interface
- Add provider recommendation based on conversation context
- Create provider usage statistics and insights

### 3. Advanced Configuration
- Implement dynamic model discovery without restart
- Add provider-specific rate limiting and quotas
- Support for multiple Ollama instances with load balancing
- Configuration validation and testing tools

### 4. Performance Optimization
- Implement intelligent caching strategies for model lists
- Add connection pooling for provider APIs
- Optimize streaming performance across different providers
- Add provider-specific performance tuning

### 5. Security Enhancements
- Add provider authentication and authorization
- Implement secure credential management for provider APIs
- Add provider access logging and audit trails
- Enhance endpoint validation and sanitization

## Conclusion

The AI Provider Selection feature (FT-006) successfully extends the Chat Box AI application's capabilities by enabling users to choose from multiple AI providers and models. The implementation maintains full backward compatibility while providing the flexibility for diverse AI capabilities through Ollama integration.

**Key Strengths:**
- Seamless provider switching with consistent user experience
- Robust error handling and fallback mechanisms
- Extensible architecture supporting additional providers
- Efficient caching and performance optimization
- Strong security measures for configuration management

**Implementation Success:**
- Multi-provider support with Gemini and Ollama
- Dynamic model selection per conversation
- Consistent streaming response format
- Comprehensive error handling and recovery
- Well-documented API integration points

The feature provides a solid foundation for future AI provider integrations while maintaining the application's core functionality and user experience standards.