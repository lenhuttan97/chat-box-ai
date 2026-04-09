import { Chat as ChatIcon, SmartToy as BotIcon, CopyAll as CopyIcon, Share as ShareIcon, MoreVert as MoreIcon } from '@mui/icons-material'
import { useTheme } from '../../hooks/useTheme'
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
  const { darkMode } = useTheme()
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

  return (
    <div
      className={`flex gap-3 p-4 ${
        isUser 
          ? 'bg-transparent' 
          : `relative ${darkMode ? 'bg-[#0f172a]/20' : 'bg-slate-50'} rounded-2xl mx-4 my-2`
      } hover:${darkMode ? 'bg-[#0f172a]/30' : 'bg-slate-100/50'} transition-colors`}
    >
      {/* Glow orb for AI messages */}
      {!isUser && (
        <div className="absolute -left-6 top-6 h-12 w-12 rounded-full bg-emerald-500/20 blur-md -z-10" />
      )}
      
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-emerald-500' : 'bg-indigo-500'
        }`}
      >
        {isUser ? (
          <ChatIcon className="text-white text-sm" />
        ) : (
          <BotIcon className="text-white text-sm" />
        )}
      </div>
      
      <div className="flex-1 overflow-hidden">
        <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {isUser ? 'You' : 'AI Assistant'}
        </p>
        
        <div 
          className={`prose prose-sm max-w-none ${
            darkMode ? 'prose-invert text-white' : 'text-slate-800'
          }`}
        >
          <ReactMarkdown
            components={{
              p: ({node: _node, ...props}) => <p className="mb-2" {...props} />,
              h1: ({node: _node, ...props}) => <h1 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`} {...props} />,
              h2: ({node: _node, ...props}) => <h2 className={`font-bold text-md mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`} {...props} />,
              h3: ({node: _node, ...props}) => <h3 className={`font-semibold text-md mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`} {...props} />,
              ul: ({node: _node, ...props}) => <ul className="list-disc pl-5 mb-2" {...props} />,
              ol: ({node: _node, ...props}) => <ol className="list-decimal pl-5 mb-2" {...props} />,
              li: ({node: _node, ...props}) => <li className="mb-1" {...props} />,
              code: ({node: _node, ...props}) => <code className={`px-1.5 py-0.5 rounded ${darkMode ? 'bg-slate-700/50 text-slate-200' : 'bg-slate-200 text-slate-800'}`} {...props} />,
              pre: ({node: _node, ...props}) => <pre className={`p-3 rounded-lg overflow-x-auto mb-2 ${darkMode ? 'bg-slate-800/50' : 'bg-slate-100'}`} {...props} />,
              a: ({node: _node, ...props}) => <a className={`text-blue-500 hover:underline ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} {...props} />,
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
              onClick={handleCopy}
              className="p-1.5 rounded-full hover:bg-bg-tertiary transition-colors text-text-secondary hover:text-text-primary"
              title="Copy message"
            >
              <CopyIcon className="text-xs" />
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-full hover:bg-bg-tertiary transition-colors text-text-secondary hover:text-text-primary"
              title="Share message"
            >
              <ShareIcon className="text-xs" />
            </button>
            <button
              className="p-1.5 rounded-full hover:bg-bg-tertiary transition-colors text-text-secondary hover:text-text-primary"
              title="More options"
            >
              <MoreIcon className="text-xs" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
