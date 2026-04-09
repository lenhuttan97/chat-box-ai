import { KeyboardEvent, useState } from 'react'

interface InputBarProps {
  onSend: (message: string) => void
  loading?: boolean
}

export const InputBar = ({ onSend, loading }: InputBarProps) => {
  const [message, setMessage] = useState('')
  const [isComposing, setIsComposing] = useState(false)

  const handleSend = () => {
    if (message.trim() && !loading && !isComposing) {
      onSend(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  const handleCompositionEnd = () => {
    setIsComposing(false)
  }

  const handleAttach = () => {
    // Placeholder for future attach functionality
  }

  return (
    <div className="px-4 py-4 border-t border-border-subtle bg-bg-secondary/80 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto space-y-3">
        <div className="flex items-center gap-3 px-4 py-2 rounded-full glass border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.15)]">
          <button
            type="button"
            onClick={handleAttach}
            disabled={loading}
            className="flex items-center justify-center w-10 h-10 rounded-full text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors disabled:opacity-50"
            aria-label="Attach file"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 12.75V7.5a4.5 4.5 0 10-9 0v8.25A3.75 3.75 0 0011.25 19.5c2.071 0 3.75-1.679 3.75-3.75V7.5" />
            </svg>
          </button>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            disabled={loading}
            rows={1}
            maxLength={4000}
            placeholder="Type a message..."
            className="flex-1 resize-none bg-transparent text-text-primary placeholder:text-text-tertiary/70 focus:outline-none text-base leading-relaxed max-h-32 py-2"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!message.trim() || loading}
            className="relative inline-flex items-center justify-center h-11 px-6 rounded-full font-semibold text-sm text-white bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-[0_10px_25px_rgba(16,162,126,0.35)] hover:from-emerald-300 hover:to-emerald-500 transition-all disabled:opacity-50"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              'Send'
            )}
          </button>
        </div>

        <div className="flex items-center justify-between text-[0.75rem] text-text-tertiary flex-wrap gap-2">
          <div className="inline-flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-white/5 text-text-secondary">
              <span className="text-xs font-semibold">⌘L</span>
              <span className="text-[0.7rem]">New chat</span>
            </span>
            <span>Enter để gửi • Shift + Enter xuống dòng</span>
          </div>
          <span className="text-text-secondary/80">Secure end-to-end conversation</span>
        </div>
      </div>
    </div>
  )
}
