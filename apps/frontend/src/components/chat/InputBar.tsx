import { KeyboardEvent, useState } from 'react'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import SendIcon from '@mui/icons-material/Send'

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

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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
    <div className="px-4 py-4 bg-transparent">
      <div className="max-w-3xl mx-auto space-y-3">
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-surface-4/80 backdrop-blur-xl border border-accent/10 transition-all focus-within:ring-2 focus-within:ring-accent/20 focus-within:border-accent/30">
          <button
            type="button"
            onClick={handleAttach}
            disabled={loading}
            className="flex items-center justify-center w-10 h-10 rounded-full text-text-secondary hover:text-accent transition-colors disabled:opacity-50"
            aria-label="Attach file"
          >
            <AttachFileIcon sx={{ fontSize: 20 }} />
          </button>

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            disabled={loading}
            maxLength={4000}
            placeholder="Message Premium AI..."
            className="flex-1 bg-transparent text-text-primary placeholder:text-text-secondary/60 focus:outline-none text-base leading-relaxed py-2.5"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!message.trim() || loading}
            className="relative inline-flex items-center justify-center h-10 w-10 rounded-full bg-accent text-white shadow-lg shadow-accent-glow transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <SendIcon sx={{ fontSize: 20 }} />
            )}
          </button>
        </div>

        <div className="text-center">
          <p className="text-[10px] text-text-secondary/40 tracking-wider uppercase">AI may display inaccurate info. Verify outputs.</p>
        </div>
      </div>
    </div>
  )
}