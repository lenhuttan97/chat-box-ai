# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chat Box AI is a real-time AI chat application powered by Google Gemini with streaming responses. It features authentication, chat settings, auto-context analysis, and anonymous device tracking.

## Architecture

### Frontend
- Built with React + TypeScript + Vite
- State management using Redux Toolkit
- Styling with Tailwind CSS and Material UI (MUI) in a hybrid pattern
- Routing with React Router DOM
- API communication via Axios
- Firebase authentication with enhanced backend integration
- Settings page with user preferences management

### Backend
- Built with NestJS + TypeScript
- Database with Prisma ORM (SQLite in dev, PostgreSQL in prod)
- Google Gemini API integration for AI responses
- Authentication with JWT and Firebase Admin
- Enhanced auth system with API integration
- File processing capabilities (PDF, DOCX, XLSX)

## Project Structure

```
apps/
├── backend/     # NestJS API server
│   ├── src/
│   │   ├── modules/           # Feature modules (auth, users, conversations, etc.)
│   │   ├── main.ts            # Entry point
│   │   └── app.module.ts      # Main module
│   ├── .env.example          # Environment variables template
│   └── prisma/                # Database schema
└── frontend/   # React UI
    ├── src/
    │   ├── components/        # Reusable UI components
    │   │   ├── layout/        # Layout components (Header, etc.)
    │   │   ├── settings/      # Settings page components
    │   ├── pages/             # Route-level components
    │   ├── store/             # Redux store and slices
    │   ├── middleware/        # API service layers
    │   ├── hooks/             # Custom React hooks
    │   ├── services/          # API service implementations
    │   └── auth/              # Authentication utilities
    ├── .env.example          # Environment variables template
    └── public/
```

## Key Technologies

### Frontend Dependencies
- React 18 with TypeScript
- Redux Toolkit for state management
- React Router DOM for navigation
- Material UI (MUI) + Tailwind CSS for styling
- Firebase for authentication
- js-cookie for cookie management
- Enhanced auth service with backend API integration

### Backend Dependencies
- NestJS framework
- Prisma ORM with database providers
- @google/generative-ai for Gemini integration
- Passport for authentication strategies
- Jest for testing
- Enhanced auth system with JWT and API integration

## Development Commands

### Running the Application
```bash
# Install dependencies
npm install

# Setup environment files
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# Run both frontend and backend in development mode
npm run dev

# Run only backend
npm run dev:be

# Run only frontend  
npm run dev:fe
```

### Building and Testing
```bash
# Build both frontend and backend
npm run build

# Build only backend
npm run build:be

# Build only frontend
npm run build:fe

# Run tests for both
npm run test

# Run frontend tests
npm run test:fe

# Run backend tests
npm run test:be

# Run linting
npm run lint
```

### Docker Commands
```bash
# Start with Docker Compose
npm run docker:up

# Stop Docker containers
npm run docker:down
```

### Backend Specific Commands
```bash
# Run backend in development mode
npm run start:dev

# Run backend tests
npm run test
npm run test:watch    # Watch mode
npm run test:cov      # Coverage
npm run test:e2e      # End-to-end tests

# Prisma commands
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run migrations
npm run prisma:push        # Push schema to database
```

### Frontend Specific Commands
```bash
# Run frontend development server
npm run dev

# Build frontend
npm run build

# Run frontend tests
npm run test
npm run test:ui    # UI test runner

# Lint frontend
npm run lint
```

## Important Patterns

### State Management (Frontend)
- Redux Toolkit slices for different concerns (messages, conversations, auth, user, theme)
- Custom hooks (useMessages, useConversations, useUser) for connecting components to Redux store
- Middleware for API calls (conversation.middleware.ts, auth.middleware.ts)
- Enhanced user slice with improved auth state management

### Authentication Flow
- Supports both email/password and Google authentication
- JWT tokens stored in cookies with enhanced backend integration
- Anonymous user support via device tracking
- Protected routes using RequireAuth component with proper auth initialization
- Enhanced auth service with API integration and improved JWT handling

### Settings and User Preferences
- Settings page with user preferences management
- Profile page with user information
- Enhanced user state management in Redux

### AI Integration
- Google Gemini API integration in backend
- Streaming responses implemented
- Configurable settings per conversation (temperature, tokens, system prompt)
- File processing capabilities for various formats (PDF, DOCX, XLSX)

## Key Components

### Frontend Components
- ChatLayout: Main layout with sidebar and header
- ChatWindow: Container for chat interface with enhanced title functionality
- MessageList/MessageItem: Display conversation messages with enhanced UI
- InputBar: Message input with attachment support
- SettingsPage: User settings and preferences management
- ProfilePage: User profile and information
- Auth components: Login/Register pages with theme consistency
- ConversationList: Enhanced with active state indicators
- Header: Layout component with user photo and navigation

### Backend Modules
- AuthModule: Handles authentication flows with enhanced API integration
- ConversationsModule: Manages conversation CRUD
- UsersModule: User management
- DeviceModule: Anonymous device tracking
- MessageProcessingModule: AI integration and message handling
- FilesModule: File upload and processing

## Environment Variables

### Frontend (.env)
- VITE_API_URL: Backend API URL
- VITE_FIREBASE_*: Firebase configuration

### Backend (.env)
- DATABASE_URL: Database connection string
- JWT_SECRET: JWT signing secret
- GEMINI_API_KEY: Google Gemini API key
- FRONTEND_URL: Frontend origin for CORS
- FIREBASE_*: Firebase admin SDK configuration

## Recent Updates

### Enhanced Authentication System
- Updated auth system to integrate with backend API
- Improved RequireAuth component to properly wait for auth initialization
- Implemented auth service with API integration and enhanced JWT modules
- Centralized frontend types for authentication

### Settings Page Implementation
- Created SettingsPage component for user preferences
- Enhanced user management with improved state handling
- Updated ProfilePage with user information management

### Conversation Features
- Enhanced ChatWindow title with gradient styling and edit functionality
- Improved ConversationList with active state indicators
- Enhanced MessageItem functionality with full-width AI background and interaction buttons

### Layout Components
- Updated Header component with user photo display (photoUrl)
- Improved navigation and user interface elements