# Complete Authentication Documentation

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Architecture Components](#architecture-components)
4. [Authentication Flows](#authentication-flows)
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

The Chat Box AI application implements a comprehensive authentication system that supports multiple authentication methods while maintaining security and user experience best practices. The system combines backend API authentication with Firebase integration for social login capabilities.

The current authentication workflow between backend and frontend is well-designed and properly aligned. The hybrid approach of using Firebase for social login while maintaining a backend API for JWT management is effective and secure.

### Backend Authentication System
- **Framework**: NestJS with Passport for authentication
- **Database**: Prisma with user model storing email, password, display name, Firebase UID, photo URL
- **JWT Strategy**: Standard JWT authentication with refresh tokens
- **Firebase Integration**: Optional integration for Google OAuth (can fallback to email/password only)

### Frontend Authentication System
- **State Management**: Redux Toolkit with auth slice
- **Service Layer**: AuthService handling API communication
- **Middleware**: authMiddleware as a facade layer
- **React Integration**: useAuth hook for component access


## User Flow

### User Journey Map
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Landing Page  │    │ Authentication  │    │   Dashboard     │    │   Chat Room     │
│                 │───▶│                 │───▶│                 │───▶│                 │
│   - View intro  │    │ - Login/Signup  │    │ - View profile  │    │ - Send messages │
│   - Learn app   │    │ - Social login  │    │ - Settings      │    │ - Receive AI    │
│   - Get started │    │ - Forgot pwd    │    │ - Start chat    │    │   responses     │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
         │                      │                      │                      │
         ▼                      ▼                      ▼                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Guest Access   │    │   Auth State    │    │   User Data     │    │   Conversation  │
│                 │    │                 │    │                 │    │                 │
│ - Limited view  │    │ - Token mgmt    │    │ - Profile sync  │    │ - Real-time     │
│ - Try demo      │    │ - Auto-refresh  │    │ - Preferences   │    │   messaging     │
│ - Sign up req   │    │ - Session mgmt  │    │ - Theme setting │    │ - Context aware │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

### User Authentication Flow
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    USER FLOW                                          │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐              │
│  │  Landing    │───▶│  Identity   │───▶│  Verify     │───▶│  Access     │              │
│  │  Page       │    │  Establish  │    │  Identity   │    │  Granted    │              │
│  │             │    │             │    │             │    │             │              │
│  │ - Welcome   │    │ - Login     │    │ - JWT token │    │ - Dashboard │              │
│  │ - Features  │    │ - Register  │    │ - Session   │    │ - Chat      │              │
│  │ - CTAs      │    │ - Social    │    │ - Profile   │    │ - Settings  │              │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘              │
│         │                   │                   │                   │                   │
│         │                   │                   │                   │                   │
│         │◀──────────────────┼───────────────────┼───────────────────┘                   │
│         │                   │                   │                                       │
│         │         ┌─────────▼──────────┐        │                                       │
│         │         │  Authentication    │        │                                       │
│         │         │  Process           │        │                                       │
│         │         │                    │        │                                       │
│         │         │ • Validate creds   │        │                                       │
│         │         │ • Token exchange   │        │                                       │
│         │         │ • Profile sync     │        │                                       │
│         │         │ • Session init     │        │                                       │
│         │         └─────────┬──────────┘        │                                       │
│         │                   │                   │                                       │
│         │                   │                   │                                       │
│         ▼                   ▼                   ▼                                       │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                               │
│  │   Guest     │    │  Pending    │    │  Verified   │                               │
│  │   State     │    │  Approval   │    │   User      │                               │
│  │             │    │             │    │             │                               │
│  │ - Limited   │    │ - Verify    │    │ - Full      │                               │
│  │   access    │    │   email     │    │   access    │                               │
│  │ - Demo mode │    │ - Social    │    │ - Personal  │                               │
│  └─────────────┘    │   auth      │    │   settings  │                               │
│                     │ - Phone ver │    │ - Security  │                               │
│                     └─────────────┘    └─────────────┘                               │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### User Authentication States
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           AUTHENTICATION USER STATES                                    │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐                     │
│  │  Unauthenticated│    │    Loading      │    │  Authenticated  │                     │
│  │                 │───▶│                 │───▶│                 │                     │
│  │ - No session    │    │ - Processing    │    │ - Active session│                     │
│  │ - Guest access  │    │ - Validating    │    │ - Token valid │                     │
│  │ - Login prompt  │    │ - Connecting    │    │ - Profile loaded│                     │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘                     │
│         │                      │                      │                                 │
│         │                      │                      │                                 │
│         │◀─────────────────────┼──────────────────────┘                                 │
│         │                      │                                                        │
│         │         ┌────────────▼────────────┐                                           │
│         │         │        Error            │                                           │
│         │         │                         │                                           │
│         │         │ • Invalid credentials   │                                           │
│         │         │ • Network error         │                                           │
│         │         │ • Token expired         │                                           │
│         │         │ • Server error          │                                           │
│         │         └────────────┬────────────┘                                           │
│         │                      │                                                        │
│         │                      │                                                        │
│         ▼                      ▼                                                        │
│  ┌─────────────────┐    ┌─────────────────┐                                             │
│  │   Logged Out    │    │  Session Lost   │                                             │
│  │                 │    │                 │                                             │
│  │ - Clear tokens  │    │ - Auto redirect │                                             │
│  │ - Redirect to   │    │ - Show error    │                                             │
│  │   login         │    │ - Retry option  │                                             │
│  └─────────────────┘    └─────────────────┘                                             │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Task Flow

### Developer Task Sequence - AUTHENTICATION WORKFLOWS

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND API WORKFLOW                                          │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐│
│  │  Login Request  │───▶│ Validate Creds  │───▶│ Generate Tokens │───▶│ Return Response ││
│  │                 │    │                 │    │                 │    │                 ││
│  │ • Email         │    │ • Check email   │    │ • JWT token     │    │ • User data     ││
│  │ • Password      │    │ • Verify pwd    │    │ • Refresh token │    │ • Auth tokens   ││
│  └─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘│
│         │                      │                      │                      │           │
│         │    ┌─────────────────▼─────────────────┐    │                      │           │
│         │    │         ERROR HANDLING          │    │                      │           │
│         │    │                                 │    │                      │           │
│         │    │ • Invalid credentials           │    │                      │           │
│         │    │ • Network issues                │    │                      │           │
│         │    │ • Server errors                 │    │                      │           │
│         │    └─────────────────────────────────┘    │                      │           │
│         │                                           │                      │           │
│         ▼                                           ▼                      ▼           │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐│
│  │ Register Req    │───▶│ Validate Input  │───▶│ Create Record   │───▶│ Set Response    ││
│  │                 │    │                 │    │                 │    │                 ││
│  │ • Email         │    │ • Email format  │    │ • New user      │    │ • User data     ││
│  │ • Password      │    │ • Password str  │    │ • Hash pwd      │    │ • Auth tokens   ││
│  │ • Display Name  │    │ • Unique email  │    │ • Profile pic   │    │ • Success msg   ││
│  └─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘│
│         │                      │                      │                      │           │
│         │                      │                      │                      │           │
│         └──────────────────────┼──────────────────────┼──────────────────────┘           │
│                                │                      │                                  │
│                                ▼                      ▼                                  │
│                         ┌─────────────────┐    ┌─────────────────┐                      │
│                         │   Logout        │    │  Refresh Token  │                      │
│                         │                 │    │                 │                      │
│                         │ • Invalidate    │    │ • Validate RT   │                      │
│                         │   tokens        │    │ • Generate NT   │                      │
│                         │ • Clear session │    │ • Set response  │                      │
│                         └─────────────────┘    └─────────────────┘                      │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND SERVICE WORKFLOW                                        │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐│
│  │   Login Req     │───▶│   API Call      │───▶│ Handle Response │───▶│ Update Storage  ││
│  │                 │    │                 │    │                 │    │                 ││
│  │ • Email/Pwd     │    │ • POST /login   │    │ • Check status  │    │ • Store tokens  ││
│  │ • Social login  │    │ • Headers       │    │ • Parse data    │    │ • Update state  ││
│  └─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘│
│         │                      │                      │                      │           │
│         │                      │                      │                      │           │
│         ▼                      ▼                      ▼                      ▼           │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐│
│  │ Register Req    │───▶│   API Call      │───▶│ Handle Response │───▶│ Update Storage  ││
│  │                 │    │                 │    │                 │    │                 ││
│  │ • Email/Pwd     │    │ • POST /reg     │    │ • Check status  │    │ • Store tokens  ││
│  │ • Display name  │    │ • Headers       │    │ • Parse data    │    │ • Update state  ││
│  └─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘│
│         │                      │                      │                      │           │
│         │                      │                      │                      │           │
│         └──────────────────────┼──────────────────────┼──────────────────────┘           │
│                                │                      │                                  │
│                                ▼                      ▼                                  │
│                         ┌─────────────────┐    ┌─────────────────┐                      │
│                         │   Logout        │    │ Token Refresh   │                      │
│                         │                 │    │                 │                      │
│                         │ • API call      │    │ • API call      │                      │
│                         │ • Clear storage │    │ • Update tokens │                      │
│                         │ • Reset state   │    │ • Continue sess │                      │
│                         └─────────────────┘    └─────────────────┘                      │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                      REDUX STATE MANAGEMENT WORKFLOW                                    │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐│
│  │  Action         │───▶│ Async Thunk     │───▶│ Loading State   │───▶│ Success/Fail    ││
│  │  Triggered      │    │ Execution       │    │                 │    │ Handling        ││
│  │                 │    │                 │    │ • Set loading   │    │                 ││
│  │ • loginEmail()  │    │ • API call      │    │ • Show spinner  │    │ • Update state  ││
│  │ • register()    │    │ • Error catch   │    │ • Disable btn   │    │ • Show msg      ││
│  │ • logout()      │    │ • Response proc │    │ • Wait          │    │ • Navigate      ││
│  └─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘│
│         │                      │                      │                      │           │
│         │                      │                      │                      │           │
│         │    ┌─────────────────▼─────────────────┐    │                      │           │
│         │    │         ERROR HANDLING          │    │                      │           │
│         │    │                                 │    │                      │           │
│         │    │ • Network errors                │    │                      │           │
│         │    │ • Server errors                 │    │                      │           │
│         │    │ • Validation errors             │    │                      │           │
│         │    │ • Timeout errors                │    │                      │           │
│         │    └─────────────────────────────────┘    │                      │           │
│         │                                           │                      │           │
│         └───────────────────────────────────────────┼──────────────────────┘           │
│                                                     │                                  │
│                                                     ▼                                  │
│                                              ┌─────────────────┐                      │
│                                              │ State Update    │                      │
│                                              │                 │                      │
│                                              │ • Update user   │                      │
│                                              │ • Set auth      │                      │
│                                              │ • Clear errors  │                      │
│                                              └─────────────────┘                      │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                      COMPONENT INTEGRATION WORKFLOW                                     │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐│
│  │ User            │───▶│ Dispatch        │───▶│ Handle Result   │───▶│ UI Update/      ││
│  │ Interaction     │    │ Auth Action     │    │                 │    │ Navigation      ││
│  │                 │    │                 │    │ • Check status  │    │                 ││
│  │ • Click login   │    │ • loginEmail()  │    │ • Show loading  │    │ • Render        ││
│  │ • Submit form   │    │ • register()    │    │ • Handle error  │    │   conditionally ││
│  │ • Click logout  │    │ • logout()      │    │ • Success msg   │    │ • Navigate      ││
│  └─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘│
│         │                      │                      │                      │           │
│         │                      │                      │                      │           │
│         │    ┌─────────────────▼─────────────────┐    │                      │           │
│         │    │        LOADING STATES           │    │                      │           │
│         │    │                                 │    │                      │           │
│         │    │ • Show spinners                 │    │                      │           │
│         │    │ • Disable buttons               │    │                      │           │
│         │    │ • Show progress                 │    │                      │           │
│         │    │ • Prevent resubmit            │    │                      │           │
│         │    └─────────────────────────────────┘    │                      │           │
│         │                                           │                      │           │
│         └───────────────────────────────────────────┼──────────────────────┘           │
│                                                     │                                  │
│                                                     ▼                                  │
│                                              ┌─────────────────┐                      │
│                                              │ Conditional     │                      │
│                                              │ Rendering       │                      │
│                                              │                 │                      │
│                                              │ • Protected     │                      │
│                                              │   routes        │                      │
│                                              │ • Auth state    │                      │
│                                              │   dependent UI  │                      │
│                                              └─────────────────┘                      │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Features

### 1. Email/Password Authentication
- **Login**: Secure email/password authentication against backend database
- **Registration**: User account creation with email verification
- **Password Management**: Password update functionality

### 2. Social Authentication
- **Google Login**: Integration with Firebase for Google OAuth
- **Token Exchange**: Seamless exchange of Firebase ID tokens for application JWTs

### 3. Session Management
- **Persistent Sessions**: Tokens stored in localStorage for session persistence
- **Automatic Refresh**: Silent token refresh when JWT expires
- **Secure Logout**: Complete session cleanup on logout

### 4. User Profile Management
- **Profile Updates**: Ability to update display name and profile picture
- **User Information**: Access to user details through the authentication system

## Architecture Components

### Service Layer
- **File**: `services/auth/auth.service.ts`
- **Role**: Handles all API communication with backend auth endpoints
- **Key Methods**:
  - `login(email, password)` - Authenticate with email/password
  - `register(email, password, displayName)` - Create new account
  - `googleLogin()` - Handle Google OAuth flow
  - `refreshToken()` - Refresh expired tokens
  - `logout()` - End user session
  - `getCurrentUser()` - Retrieve current user info
  - `updateProfile()` - Update user profile information
- **Responsibilities**: 
  - Communicates with backend API
  - Manages token storage and retrieval
  - Handles token refresh logic

### Middleware Layer
- **File**: `middleware/auth.middleware.ts`
- **Role**: Facade between Redux thunks and AuthService
- **Provides**: Consistent interface for auth operations
- **Responsibilities**:
  - Provides consistent interface for auth operations
  - Delegates to AuthService methods

### State Management Layer
- **File**: `store/slices/auth.slice.ts`
- **Role**: Manages authentication state in Redux store
- **State Properties**:
  - `user`: User object (id, email, displayName, photoURL, etc.)
  - `isAuthenticated`: Boolean indicating auth status
  - `isLoading`: Loading state for auth operations
  - `error`: Error messages
  - `accessToken`: JWT token
- **State Properties**:
  - `user`: User object with id, email, displayName, photoURL, etc.
  - `isAuthenticated`: Boolean indicating authentication status
  - `isLoading`: Loading state for auth operations
  - `error`: Error messages from auth operations
  - `accessToken`: JWT token for API authentication

### React Integration Layer
- **File**: `hooks/useAuth.ts`
- **Role**: Provides auth functionality to React components
- **Exports**: Actions and state selectors for UI components
- **Role**: Provides auth functionality to React components
- **Exports**: Actions and state selectors for components

## Authentication Flows

### 1. Application Startup Flow
```
1. App loads → ChatPage.tsx mounts
2. ChatPage calls useEffect with useAuth().initialize()
3. initializeAuth thunk triggered
4. Check for tokens in localStorage
5. If token exists → call authMiddleware.getCurrentUser()
6. If token invalid/expired → attempt refresh with authMiddleware.refreshToken()
7. Update Redux state with user info and auth status
```

### 2. Email/Password Login Flow
```
LoginPage.tsx
├── User enters email and password
├── useAuth().loginEmail(email, password)
├── Dispatch loginWithEmail thunk
├── authMiddleware.login(email, password)
├── AuthService.login(email, password)
├── Fetch POST /api/auth/login
├── Receive user data, JWT token, refresh token
├── Store tokens in localStorage
├── Update Redux auth state
└── Navigate to home page

Component: LoginPage.tsx
├── useAuth().loginEmail(email, password)
├── Dispatch loginWithEmail thunk
├── authMiddleware.login(email, password)
├── AuthService.login(email, password)
├── POST /api/auth/login
├── Store received tokens
├── Update Redux state
└── Navigate to home page
```

### 3. User Registration Flow
```
RegisterPage.tsx
├── User enters email, password, and display name
├── useAuth().registerEmail(email, password, displayName)
├── Dispatch registerWithEmail thunk
├── authMiddleware.register(email, password, displayName)
├── AuthService.register(email, password, displayName)
├── Fetch POST /api/auth/register
├── Receive user data, JWT token, refresh token
├── Store tokens in localStorage
├── Update Redux auth state
└── Navigate to home page

Component: RegisterPage.tsx
├── useAuth().registerEmail(email, password, displayName)
├── Dispatch registerWithEmail thunk
├── authMiddleware.register(email, password, displayName)
├── AuthService.register(email, password, displayName)
├── POST /api/auth/register
├── Store received tokens
├── Update Redux state
└── Navigate to home page
```

### 4. Google Authentication Flow
```
LoginPage.tsx or RegisterPage.tsx
├── User clicks "Continue with Google"
├── useAuth().loginGoogle()
├── AuthService.googleLogin()
├── Firebase signInWithGoogle() → Get ID token
├── POST /api/auth/google with ID token
├── Backend validates and exchanges for JWT
├── Store received tokens
├── Update Redux state
└── Navigate to home page

Component: LoginPage.tsx or RegisterPage.tsx
├── useAuth().loginGoogle()
├── Dispatch loginWithGoogle thunk
├── authMiddleware.googleLogin()
├── AuthService.googleLogin()
├── Firebase signInWithGoogle() → Obtain ID token
├── Fetch POST /api/auth/google with ID token
├── Backend validates ID token and creates/exchanges for JWT
├── Receive user data, JWT token, refresh token
├── Store tokens in localStorage
├── Update Redux auth state
└── Navigate to home page
```

### 5. Session Initialization Flow
```
ChatPage.tsx
├── useEffect calls useAuth().initialize()
├── Check for existing tokens in localStorage
├── Validate token with GET /api/auth/profile
├── If expired, refresh with POST /api/auth/refresh-token
├── Update Redux state with user info
└── Determine authentication status
```

### 6. Logout Flow
```
Component: Various (Header, Sidebar, etc.)
├── useAuth().logout()
├── Dispatch logoutUser thunk
├── authMiddleware.logout()
├── AuthService.logout()
├── Fetch POST /api/auth/logout (optional cleanup)
├── Clear tokens from localStorage
├── Update Redux auth state to unauthenticated
└── Redirect to login page
```

### 7. Token Refresh Flow
```
When accessing protected resources or during initialization:
├── Check if current token is expired
├── Call authMiddleware.refreshToken()
├── AuthService.refreshToken()
├── Fetch POST /api/auth/refresh-token with refresh token
├── Receive new JWT token and refresh token
├── Update tokens in localStorage
└── Continue with authenticated request
```

## Security Features

### Token Management
- **JWT Authentication**: Secure JSON Web Tokens for API access
- **Refresh Tokens**: Automatic token refresh without user interaction
- **Secure Storage**: Tokens stored in localStorage with proper validation
- **Token Expiration**: Automatic handling of expired tokens

### Session Security
- **Token Validation**: Continuous validation of token validity
- **Secure Transmission**: Tokens sent via Authorization header
- **Session Cleanup**: Complete removal of tokens on logout
- **CSRF Protection**: Built-in protection mechanisms

### Data Protection
- **Encrypted Communication**: All auth requests over HTTPS
- **Sensitive Data**: Passwords never stored or transmitted in plain text
- **Access Control**: Proper authorization for all protected resources

### Token Storage
- JWT tokens stored in `localStorage` as `auth_token`
- Refresh tokens stored in `localStorage` as `refresh_token`
- Tokens sent in Authorization header as Bearer tokens

### Token Validation
- Tokens validated on app startup
- Automatic refresh when expired
- Secure cookie handling via backend

### Session Management
- Sessions tied to JWT validity
- Refresh token rotation
- Secure logout process

## User Experience Features

### Loading States
- **Visual Feedback**: Loading indicators during auth operations
- **Progress Indicators**: Clear status during registration/login
- **Error Messaging**: User-friendly error messages for failed operations

### Form Validation
- **Real-time Validation**: Immediate feedback on form inputs
- **Password Strength**: Guidance for secure password creation
- **Email Verification**: Validation of email format

### Persistent Sessions
- **Remember Me**: Option to maintain login across browser sessions
- **Auto-login**: Return users automatically authenticated
- **Seamless Experience**: No need to re-authenticate frequently

### Performance Optimizations
- **Token Caching**: Tokens persisted in localStorage between sessions, user data cached in Redux store, smart refresh token utilization
- **Lazy Loading**: Auth state initialized only when needed, components subscribe to specific auth state parts, efficient re-rendering through Redux selectors

## API Endpoints Used

### Authentication Endpoints
- `POST /api/auth/login` - Email/password authentication
- `POST /api/auth/register` - Account creation
- `POST /api/auth/google` - Google OAuth token exchange
- `POST /api/auth/refresh-token` - Token refresh
- `POST /api/auth/logout` - Session termination
- `GET /api/auth/profile` - Retrieve user information
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Update user password

### Backend API Integration
- All auth operations communicate with `/api/auth/*` endpoints:
  - `POST /api/auth/login` - Email/password login
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/google` - Google login with ID token
  - `POST /api/auth/refresh-token` - Token refresh
  - `POST /api/auth/logout` - Session cleanup
  - `GET /api/auth/profile` - Get current user
  - `PUT /api/auth/profile` - Update profile
  - `PUT /api/auth/password` - Update password

### Error Handling
- **Standardized Responses**: Consistent error response format
- **User-Friendly Messages**: Clear error descriptions for UI
- **Logging**: Proper error logging for debugging
- **Recovery Options**: Guidance for resolving common issues

## Integration Points

### Backend Integration
- **Database**: User accounts stored in application database
- **JWT Generation**: Backend generates and validates tokens
- **Social Auth**: Google OAuth handled through Firebase integration

### Frontend Integration
- **Protected Routes**: Automatic redirection for unauthenticated users
- **UI Components**: Dynamic rendering based on auth state
- **Data Fetching**: Authenticated API calls with proper headers

### Firebase Integration (Google Auth)
- Google login uses Firebase Authentication to obtain ID tokens
- ID tokens exchanged with backend for application JWT tokens
- Maintains single source of truth for auth state
- Provides seamless social login experience

### Component Interaction
- **Protected Route Guard**: `auth/RequireAuth.tsx` checks `isAuthenticated` from Redux state, redirects unauthenticated users to `/login`
- **UI Components Using Auth**: 
  - `LoginPage.tsx` - Login functionality
  - `RegisterPage.tsx` - Registration functionality
  - `Header.tsx` - Logout button, user info
  - `Sidebar.tsx` - Logout functionality
  - `ChatPage.tsx` - Auth initialization

## Error Handling Strategy

### Network Errors
- Captured at the service layer
- Converted to user-friendly messages
- Stored in Redux state for UI display

### Authentication Errors
- Invalid credentials
- Expired tokens
- Network connectivity issues
- Server-side validation failures

### UI Integration
- Error messages displayed in login/register forms
- Loading states during async operations
- Automatic redirection after successful operations

### Error Scenarios & Recovery
- **Common Error Cases**:
  - **Invalid Credentials**: Clear feedback for wrong email/password
  - **Network Issues**: Graceful handling of connectivity problems
  - **Token Expiration**: Automatic refresh without user interruption
  - **Account Issues**: Proper handling of locked/banned accounts

- **Recovery Mechanisms**:
  - **Retry Logic**: Automatic retries for transient failures
  - **Fallback Options**: Alternative authentication methods
  - **User Guidance**: Clear instructions for resolving issues
  - **Support Integration**: Links to help/resources when needed

### Testing Considerations
- **Mocking Strategy**: AuthService methods can be mocked for component testing, Redux state can be pre-populated for integration tests, network calls can be intercepted for testing
- **Edge Cases**: Network failures during auth operations, token expiration during user session, concurrent auth operations, invalid token scenarios

### Testing & Quality Assurance
- **Test Coverage**: Unit tests for individual service method testing, integration tests for complete flow validation, edge cases for error scenario testing, security tests for token validation and security checks
- **Performance Metrics**: Load times for authentication operation speed, success rates for percentage of successful authentications, failure analysis for common failure patterns identification

## State Management

### Authentication States
| State | Condition | Actions Required |
|-------|-----------|------------------|
| **Unauthenticated** | No tokens in localStorage<br/>OR tokens invalid | Redirect to `/login` |
| **Loading** | Auth operation in progress | Show loading indicators |
| **Authenticated** | Valid tokens exist<br/>AND user data loaded | Allow access to protected routes |
| **Error** | Auth operation failed | Display error message |

### State Management Flow
```
Redux Store (auth slice)
├── Initial State: { user: null, isAuthenticated: false, isLoading: false, error: null }
├── Login Pending: { isLoading: true, error: null }
├── Login Success: { user: {...}, isAuthenticated: true, isLoading: false, error: null }
├── Login Failure: { user: null, isAuthenticated: false, isLoading: false, error: "message" }
├── Logout: { user: null, isAuthenticated: false, isLoading: false, error: null }
└── Initialize: { ...restore previous state if valid ... }
```

## Workflow Analysis

### Current State Overview
The current implementation demonstrates excellent alignment between backend and frontend:

1. ✅ **Consistent API Contract**: Frontend expects exactly what backend provides
2. ✅ **Proper Error Handling**: Both layers handle errors appropriately
3. ✅ **Security Measures**: JWT guards, token validation, secure storage
4. ✅ **User Experience**: Smooth authentication flows with proper loading states
5. ✅ **Flexibility**: Optional Firebase integration with fallback options

### Workflow Comparison: Backend vs Frontend

#### 1. Email/Password Login
**Backend Flow:**
```
POST /auth/login → validateUser() → generateJwtToken() → generateRefreshToken() → setTokenCookie() → return user + tokens
```

**Frontend Flow:**
```
LoginPage.tsx → useAuth().loginEmail() → loginWithEmail thunk → authMiddleware.login() → AuthService.login() → fetch /auth/login → store tokens → update Redux state
```

✅ **Match**: Backend and frontend workflows are perfectly aligned.

#### 2. Google Authentication
**Backend Flow:**
```
POST /auth/google → firebaseLogin() → validate ID token → create/get user → generate tokens → return user + tokens
```

**Frontend Flow:**
```
LoginPage.tsx → useAuth().loginGoogle() → loginWithGoogle thunk → authMiddleware.googleLogin() → AuthService.googleLogin() → Firebase signInWithGoogle() → getIdToken() → fetch /auth/google → store tokens → update Redux state
```

✅ **Match**: Hybrid approach works seamlessly with Firebase for ID token + backend for JWT.

#### 3. Token Refresh
**Backend Flow:**
```
POST /auth/refresh-token → validateRefreshToken() → generate new tokens → return user + new tokens
```

**Frontend Flow:**
```
AuthService.refreshToken() → fetch /auth/refresh-token → update stored tokens
```

✅ **Match**: Token refresh mechanism is consistent.

#### 4. Profile Management
**Backend Flow:**
```
GET /auth/profile (with JWT guard) → getUserById() → return user data
PUT /auth/profile (with JWT guard) → updateProfile() → return updated user
```

**Frontend Flow:**
```
AuthService.getCurrentUser() → fetch /auth/profile → return user data
AuthService.updateProfile() → fetch /auth/profile → return updated user
```

✅ **Match**: Profile operations are well-aligned.

## Recommendations & Improvements

### 1. Enhance Error Handling
- Cải thiện định dạng phản hồi lỗi để nhất quán với chuẩn API chung của hệ thống
- Đảm bảo tất cả lỗi xác thực đều có mã lỗi cụ thể và thông báo thân thiện với người dùng

### 2. Add Token Expiration Handling
- Triển khai cơ chế làm mới token tự động trước thời điểm hết hạn
- Xây dựng cơ chế xử lý phiên làm việc mượt mà hơn khi token hết hạn

### 3. Improve Offline Support
- Xem xét lưu trữ dữ liệu người dùng cục bộ để hỗ trợ trải nghiệm offline
- Thiết kế cơ chế đồng bộ dữ liệu khi kết nối trở lại

### 4. Add Analytics & Monitoring
- Triển khai theo dõi các sự kiện xác thực để phân tích và cải thiện hệ thống
- Thiết lập giám sát hiệu suất và lỗi trong quá trình xác thực

### 5. Security Enhancements
- Đánh giá lại phương pháp lưu trữ token để tăng cường bảo mật
- Xem xét sử dụng httpOnly cookies hoặc các biện pháp bảo vệ bổ sung

### 6. Add Biometric Authentication (Future)
- Cân nhắc tích hợp xác thực sinh trắc học cho trải nghiệm người dùng nâng cao
- Sử dụng Web Authentication API cho các phương thức xác thực tiên tiến

## Conclusion

The current authentication workflow between backend and frontend is well-designed and properly aligned. The hybrid approach of using Firebase for social login while maintaining a backend API for JWT management is effective and secure.

**Key Strengths:**
- Clean separation of concerns
- Consistent API contracts
- Proper security measures
- Flexible architecture with fallback options
- Good user experience

**Areas for Enhancement:**
- More consistent error responses
- Proactive token refresh
- Offline capability
- Enhanced security for token storage
- Analytics and monitoring

The system is production-ready but could benefit from the suggested improvements for enhanced security, user experience, and observability.