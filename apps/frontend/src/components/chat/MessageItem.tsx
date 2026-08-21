import { Chat as ChatIcon, SmartToy as BotIcon, CopyAll as CopyIcon, Share as ShareIcon, MoreVert as MoreIcon, Replay as ReplayIcon, ThumbUp as ThumbUpIcon, ThumbDown as ThumbDownIcon } from '@mui/icons-material'
import ReactMarkdown from 'react-markdown'

interface MessageItemProps {
  role: 'user' | 'assistant'
  content: string
  isLoading?: boolean
}

const TypingIndicator = () => (
  <div className="flex gap-1 mt-2">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"
        style={{ animationDelay: `${i * 0.16}s` }}
      />
    ))}
  </div>
)

export const MessageItem = ({ role, content, isLoading }: MessageItemProps) => {
  const isUser = role === 'user'

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'AI Message',
        text: content,
      })
    }
  }

  const handleRegenerate = () => {
    console.log('Regenerating message:', content)
  }

  const handleThumbUp = () => {
    console.log('Thumb up feedback for message:', content)
  }

  const handleThumbDown = () => {
    console.log('Thumb down feedback for message:', content)
  }

  return (
    <div
      className={`flex gap-3 p-4 relative group ${
        isUser
          ? 'bg-surface-3/50 rounded-xl mx-4 my-2 backdrop-blur-sm'
          : 'bg-transparent'
      } transition-colors`}
    >
      {/* Full-width background wash for AI messages */}
      {!isUser && (
        <div className="absolute inset-y-0 left-0 right-0 -z-20 bg-accent/5"></div>
      )}

      {/* Glow orb for AI messages - emerald colored per spec */}
      {!isUser && (
        <div className="absolute -left-8 top-6 h-16 w-16 rounded-full bg-accent/5 blur-lg -z-10 opacity-60" />
      )}

      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-accent' : 'bg-accent/80'
        }`}
      >
        {isUser ? (
          <ChatIcon sx={{ fontSize: 18 }} />
        ) : (
          <BotIcon sx={{ fontSize: 18 }} />
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <p className="text-xs font-medium mb-1 text-text-secondary">
          {isUser ? 'You' : 'AI Assistant'}
        </p>

        <div className="prose prose-sm max-w-none text-text-primary">
          <ReactMarkdown
            components={{
              p: ({node: _node, ...props}) => <p className="mb-2" {...props} />,
              h1: ({node: _node, ...props}) => <h1 className="font-bold text-lg mb-2 text-text-primary" {...props} />,
              h2: ({node: _node, ...props}) => <h2 className="font-bold text-md mb-2 text-text-primary" {...props} />,
              h3: ({node: _node, ...props}) => <h3 className="font-semibold text-md mb-2 text-text-primary" {...props} />,
              ul: ({node: _node, ...props}) => <ul className="list-disc pl-5 mb-2" {...props} />,
              ol: ({node: _node, ...props}) => <ol className="list-decimal pl-5 mb-2" {...props} />,
              li: ({node: _node, ...props}) => <li className="mb-1" {...props} />,
              code: ({node: _node, ...props}) => <code className="px-1.5 py-0.5 rounded bg-surface-3/50 text-accent" {...props} />,
              pre: ({node: _node, ...props}) => <pre className="p-3 rounded-lg overflow-x-auto mb-2 bg-surface-3/30" {...props} />,
              a: ({node: _node, ...props}) => <a className="text-accent hover:underline" {...props} />,
            }}
          >
            {content}
          </ReactMarkdown>
          {!isUser && isLoading && <TypingIndicator />}
        </div>

        {/* Actions bar for AI messages */}
        {!isUser && (
          <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleRegenerate}
              className="p-1.5 rounded-full hover:bg-surface-3/50 transition-colors text-text-secondary hover:text-accent"
              title="Regenerate response"
            >
              <ReplayIcon sx={{ fontSize: 14 }} />
            </button>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-full hover:bg-surface-3/50 transition-colors text-text-secondary hover:text-accent"
              title="Copy message"
            >
              <CopyIcon sx={{ fontSize: 14 }} />
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-full hover:bg-surface-3/50 transition-colors text-text-secondary hover:text-accent"
              title="Share message"
            >
              <ShareIcon sx={{ fontSize: 14 }} />
            </button>
            <button
              onClick={handleThumbUp}
              className="p-1.5 rounded-full hover:bg-surface-3/50 transition-colors text-text-secondary hover:text-accent"
              title="Like response"
            >
              <ThumbUpIcon sx={{ fontSize: 14 }} />
            </button>
            <button
              onClick={handleThumbDown}
              className="p-1.5 rounded-full hover:bg-surface-3/50 transition-colors text-text-secondary hover:text-accent"
              title="Dislike response"
            >
              <ThumbDownIcon sx={{ fontSize: 14 }} />
            </button>
            <button
              className="p-1.5 rounded-full hover:bg-surface-3/50 transition-colors text-text-secondary hover:text-accent"
              title="More options"
            >
              <MoreIcon sx={{ fontSize: 14 }} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}