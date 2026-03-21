# Chat Box AI

A real-time AI chat application powered by Google Gemini with streaming responses.

## Features

- **AI Chat**: Real-time streaming responses with Gemini
- **Authentication**: Google & Email/Password login via Firebase
- **Chat Settings**: Custom AI role, system prompt, temperature, response length per conversation
- **Auto Context**: Automatically analyzes and adds context after first message
- **Device Tracking**: Anonymous user support with virtual users

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# Run development servers
npm dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Tech Stack

- **Frontend**: React + Vite + Material UI + Redux
- **Backend**: NestJS + Prisma
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **AI**: Google Gemini API

## Project Structure

```
apps/
├── backend/     # NestJS API
└── frontend/    # React UI
```
