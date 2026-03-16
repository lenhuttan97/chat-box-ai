# BUG-002: Streaming Response Not Smooth

## Thông tin

| Trường | Giá trị |
|--------|---------|
| Bug ID | BUG-002 |
| Feature | Chat - Frontend |
| Status | pending |
| Priority | high |

## Mô tả

Khi AI streaming response, text hiện ra không mượt:
- Nhảy theo từng word hoặc nhiều words một lúc
- Không có punctuation delay (dấu chấm, phẩy hiện ra quá nhanh)
- Cảm giác giật lag

## Hiện tại

```
AI: "Hello" → "Hello world" → "Hello world, how" → "Hello world, how are you?"
       ↓           ↓              ↓                 ↓
     instant    instant       instant           instant
     (không     (không        (không            (không
     có delay)   có delay)     có delay)         có delay)
```

## Mong muốn

```
AI: "H" → "He" → "Hel" → "Hello" → (pause) → "Hello " → "Hello w" → ...
                     ↓                    ↓
              Delay cho punctuation    Smooth word-by-word
              ".", ",", "!"           với micro-delay
```

## Solution

### 1. Word-by-word streaming với debounce

```typescript
// useMessages.ts - useEffect for streaming
useEffect(() => {
  if (!streamingContent) return

  // Debounce để tạo cảm giác mượt hơn
  const words = streamingContent.split(' ')
  let currentText = ''

  const interval = setInterval(() => {
    if (wordIndex < words.length) {
      currentText += (currentText ? ' ' : '') + words[wordIndex]
      setDisplayText(currentText)
      wordIndex++
    } else {
      clearInterval(interval)
    }
  }, 30) // 30ms per word - adjust for smoothness

  return () => clearInterval(interval)
}, [streamingContent])
```

### 2. Punctuation delay

```typescript
const PUNCTUATION_DELAY = {
  '.': 200,   // Pause longer after sentence
  '!': 200,
  '?': 200,
  ',': 100,   // Medium pause
  ';': 100,
  ':': 50,    // Short pause
}

function shouldDelay(char: string): number {
  return PUNCTUATION_DELAY[char] || 0
}

// Use trong streaming logic
for (const char of response) {
  setDisplayText(prev => prev + char)
  const delay = shouldDelay(char)
  if (delay > 0) await sleep(delay)
}
```

### 3. Sử dụng Markdown rendering với typing effect

```typescript
// Thư viện: react-type-animation hoặc custom hook
import { TypeAnimation } from 'react-type-animation'

// Trong MessageItem.tsx
{isStreaming ? (
  <TypeAnimation
    sequence={[displayText, 100]}  // Characters + delay
    speed={80}  // Tốc độ typing
  />
) : (
  <Markdown>{message.content}</Markdown>
)}
```

## Files liên quan

- `apps/frontend/src/store/slices/message.slice.ts`
- `apps/frontend/src/components/MessageItem.tsx`
- `apps/frontend/src/components/MessageList.tsx`

## Recommendation

**Sử dụng react-type-animation** cho smoothest experience:
- Hỗ trợ word-by-word
- Hỗ trợ punctuation delays
- Tích hợp Markdown rendering

```bash
npm install react-type-animation
```

## Acceptance Criteria

- [ ] Text hiện ra mượt mà theo từng word
- [ ] Có delay sau dấu câu (. , ! ?) để đọc dễ hơn
- [ ] Không jump nhiều words cùng lúc
- [ ] Performance vẫn tốt (không lag UI)
