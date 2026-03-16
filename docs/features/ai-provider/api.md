# FT-006 API Documentation

## Ollama API

### Base URL
```
OLLAMA_BASE_URL=http://localhost:11434  # local
OLLAMA_BASE_URL=https://api.ollama.ai   # remote (nếu có)
```

### Endpoints

#### 1. List Models
```
GET /api/tags
```

**Example Request:**
```bash
curl http://localhost:11434/api/tags
```

**Example Response:**
```json
{
  "models": [
    {
      "name": "llama3:latest",
      "modified_at": "2024-03-15T10:00:00Z",
      "size": 3826793472,
      "digest": "sha256:..."
    },
    {
      "name": "mistral:latest",
      "modified_at": "2024-03-10T10:00:00Z",
      "size": 4109854720,
      "digest": "sha256:..."
    }
  ]
}
```

#### 2. Chat Completion (Streaming)
```
POST /api/chat
```

**Request:**
```json
{
  "model": "llama3",
  "messages": [
    { "role": "system", "content": "You are a helpful assistant." },
    { "role": "user", "content": "Hello, how are you?" }
  ],
  "stream": true,
  "options": {
    "temperature": 0.7,
    "num_predict": 2048
  }
}
```

**Response (SSE - Server-Sent Events):**
```
data: {"model":"llama3","message":{"role":"assistant","content":"Hello"},"done":false}

data: {"model":"llama3","message":{"role":"assistant","content":" there!"},"done":false}

data: {"model":"llama3","done":true,"total_duration":5000000000,"load_duration":1000000000,"prompt_eval_count":10,"eval_count":20}
```

#### 3. Chat Completion (Non-Streaming)
```json
{
  "model": "llama3",
  "messages": [
    { "role": "user", "content": "Hello" }
  ],
  "stream": false
}
```

**Response:**
```json
{
  "model": "llama3",
  "message": {
    "role": "assistant",
    "content": "Hello! How can I help you today?"
  },
  "done": true
}
```

## Frontend → Backend API

### Update Conversation Provider

```
PATCH /api/v1/conversations/:id
```

**Request:**
```json
{
  "provider": "ollama",
  "model": "llama3"
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "name": "My Chat",
    "provider": "ollama",
    "model": "llama3",
    ...
  },
  "message": "Conversation updated successfully",
  "statusCode": 200
}
```

### Get Available Models (Backend → Ollama)

```
GET /api/v1/ollama/models
```

**Response:**
```json
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

**Note:** Ollama models được cache ở backend, không cần gọi Ollama mỗi lần.

## Environment Variables

```env
# Ollama
OLLAMA_ENABLED=true
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODELS=llama3,mistral,phi3,codellama,gemma
OLLAMA_TIMEOUT=120000

# Gemini (existing)
GEMINI_API_KEY=xxx
GEMINI_MODEL=gemini-1.5-flash
```
