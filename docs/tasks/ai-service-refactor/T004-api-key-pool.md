# T004: API Key Pool Manager

## Mục tiêu

Quản lý nhiều Google API Keys theo dạng round-robin, tránh rate limit và tăng availability.

## Mô tả

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    API KEY POOL MANAGER                                     │
└─────────────────────────────────────────────────────────────────────────────┘

                        ┌─────────────────┐
                        │   User Config   │
                        │  (env var / DB) │
                        └────────┬────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         KEY POOL                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                        │
│  │ API Key #1  │  │ API Key #2  │  │ API Key #3  │                        │
│  │ (active)    │  │ (active)    │  │ (active)    │                        │
│  │ Rate: 60/min│  │ Rate: 45/min│  │ Rate: 60/min│                        │
│  └─────────────┘  └─────────────┘  └─────────────┘                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ROUTER LOGIC                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Request ──► Select Key (Round-Robin)                                    │
│              │                                                             │
│              ├── Key OK ──► Use Key                                      │
│              │                                                             │
│              └── Key Error/RateLimit                                      │
│                  │                                                         │
│                  ├── Mark Key as unhealthy                                │
│                  ├── Retry with next key                                  │
│                  └── Alert if all keys fail                              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Implementation

### 1. Configuration

```typescript
// environment hoặc database
interface APIKeyConfig {
  keys: Array<{
    key: string
    name: string
    rateLimit: number  // requests per minute
    enabled: boolean
  }>
  defaultRateLimit: number
}

// .env
GOOGLE_API_KEYS="key1,key2,key3"
// hoặc JSON
GOOGLE_API_KEYS='[{"key":"key1","name":"key1","rateLimit":60},{"key":"key2","name":"key2","rateLimit":45}]'
```

### 2. Key Pool Manager

```typescript
@Injectable()
export class APIKeyPoolManager {
  private keys: APIKey[]
  private currentIndex = 0
  private healthStatus: Map<string, { healthy: boolean; lastError?: string }>

  constructor(private configService: ConfigService) {
    this.keys = this.loadKeys()
    this.healthStatus = new Map()
    
    // Initialize health status
    this.keys.forEach(key => {
      this.healthStatus.set(key.key, { healthy: true })
    })
  }

  private loadKeys(): APIKey[] {
    const keysConfig = this.configService.get<string>('GOOGLE_API_KEYS')
    if (!keysConfig) {
      // Fallback to single key
      const singleKey = this.configService.get<string>('GEMINI_API_KEY')
      return singleKey ? [{ key: singleKey, name: 'default', rateLimit: 60, enabled: true }] : []
    }
    
    try {
      return JSON.parse(keysConfig)
    } catch {
      // Comma-separated keys
      return keysConfig.split(',').map((key, i) => ({
        key: key.trim(),
        name: `key-${i + 1}`,
        rateLimit: 60,
        enabled: true,
      }))
    }
  }

  getNextKey(): APIKey {
    // Find next healthy key
    for (let i = 0; i < this.keys.length; i++) {
      const index = (this.currentIndex + i) % this.keys.length
      const key = this.keys[index]
      
      if (key.enabled && this.isHealthy(key.key)) {
        this.currentIndex = (index + 1) % this.keys.length
        return key
      }
    }
    
    // All keys unhealthy, reset and try again
    this.resetAllKeys()
    return this.keys[this.currentIndex]
  }

  markKeyError(key: string, error: string): void {
    const status = this.healthStatus.get(key)
    if (!status) return

    if (error.includes('rate_limit') || error.includes('429')) {
      // Temporary error, mark as unhealthy temporarily
      status.healthy = false
      setTimeout(() => {
        status.healthy = true
      }, 60000) // Retry after 1 minute
    } else if (error.includes('401') || error.includes('403')) {
      // Permanent error, disable key
      status.healthy = false
      this.disableKey(key)
    }

    this.healthStatus.set(key, status)
  }

  private isHealthy(key: string): boolean {
    return this.healthStatus.get(key)?.healthy ?? false
  }

  private disableKey(key: string): void {
    const keyObj = this.keys.find(k => k.key === key)
    if (keyObj) {
      keyObj.enabled = false
    }
  }

  private resetAllKeys(): void {
    this.keys.forEach(key => {
      this.healthStatus.set(key.key, { healthy: true })
    })
  }

  getStats(): { total: number; healthy: number; unhealthy: number } {
    const total = this.keys.length
    const healthy = this.keys.filter(k => this.isHealthy(k.key)).length
    return { total, healthy, unhealthy: total - healthy }
  }
}
```

### 3. Update Gemini Provider

```typescript
@Injectable()
export class GeminiProvider {
  private readonly genAI: GoogleGenerativeAI
  private currentKey: APIKey | null = null

  constructor(
    private readonly configService: ConfigService,
    private readonly keyPool: APIKeyPoolManager,
  ) {}

  private initWithKey(key: APIKey): void {
    this.genAI = new GoogleGenerativeAI(key.key)
    this.currentKey = key
  }

  async *generateStream(options: GenerateStreamOptions): AsyncGenerator<string> {
    const key = this.keyPool.getNextKey()
    
    if (this.currentKey?.key !== key.key) {
      this.initWithKey(key)
    }

    try {
      // ... existing streaming logic
    } catch (error) {
      // Mark key as error and retry
      this.keyPool.markKeyError(key.key, error.message)
      
      // Try next key
      const nextKey = this.keyPool.getNextKey()
      this.initWithKey(nextKey)
      
      // Retry with new key
      return this.generateStream(options)
    }
  }
}
```

## Features

| Feature | Mô tả |
|---------|-------|
| **Round-robin selection** | Lần lượt dùng từng key |
| **Rate limit detection** | Tự động switch khi gặp 429 |
| **Key health check** | Disable key vĩnh viễn nếu 401/403 |
| **Automatic recovery** | Thử lại key sau 1 phút |
| **Metrics/Stats** | Theo dõi số key healthy/unhealthy |
| **Fallback** | Graceful degradation khi không có key |

## Configuration

```bash
# Single key (backward compatible)
GEMINI_API_KEY="ai-google-key"

# Multiple keys (new)
GOOGLE_API_KEYS='[
  {"key": "key1...", "name": "production-1", "rateLimit": 60},
  {"key": "key2...", "name": "production-2", "rateLimit": 60},
  {"key": "key3...", "name": "backup", "rateLimit": 15}
]'
```

## Acceptance Criteria

- [ ] Load multiple API keys từ config
- [ ] Round-robin selection hoạt động đúng
- [ ] Tự động switch key khi rate limit (429)
- [ ] Disable key vĩnh viễn khi auth error (401/403)
- [ ] Recovery sau 1 phút cho temporary errors
- [ ] Metrics API để check health status
- [ ] Graceful fallback khi không có key nào healthy
- [ ] Backward compatible với single key config
