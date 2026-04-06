import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import SearchIcon from '@mui/icons-material/Search'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LoginIcon from '@mui/icons-material/Login'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

interface HeaderProps {
  title?: string
}

export const Header = ({ title = 'New Conversation' }: HeaderProps) => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [modelAnchorEl, setModelAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash')

  const models = [
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
    { id: 'gpt-4o', name: 'GPT-4o' },
    { id: 'claude-3', name: 'Claude 3' },
  ]

  const handleModelClick = (event: React.MouseEvent<HTMLElement>) => {
    setModelAnchorEl(event.currentTarget)
  }

  const handleModelClose = () => {
    setModelAnchorEl(null)
  }

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId)
    handleModelClose()
  }

  const handleUserClick = () => {
    if (isAuthenticated) {
      navigate('/profile')
    } else {
      navigate('/login')
    }
  }

  return (
    <header className="h-[56px] flex items-center justify-between px-8 border-b border-border-subtle bg-bg-secondary glass">
      {/* Center - Title */}
      <div className="flex-1 flex justify-center">
        <h2 className="text-body font-semibold text-text-primary">
          {title}
        </h2>
      </div>

      {/* Right - Search + Model + User */}
      <div className="flex items-center gap-4">
        {/* Search Icon */}
        <button className="p-2 rounded-button hover:bg-bg-tertiary transition-colors">
          <SearchIcon sx={{ fontSize: 20, color: 'var(--text-secondary)' }} />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-border-default" />

        {/* Model Selector */}
        <button
          onClick={handleModelClick}
          className="flex items-center gap-2 px-3 py-1.5 rounded-button hover:bg-bg-tertiary transition-colors"
        >
          <span className="text-body text-text-secondary font-medium">
            {models.find(m => m.id === selectedModel)?.name || 'Select Model'}
          </span>
          <ExpandMoreIcon sx={{ fontSize: 20, color: 'var(--text-secondary)' }} />
        </button>

        {/* Model Dropdown Menu */}
        <Menu
          anchorEl={modelAnchorEl}
          open={Boolean(modelAnchorEl)}
          onClose={handleModelClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              bgcolor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-card)',
              mt: 1,
            }
          }}
        >
          {models.map((model) => (
            <MenuItem
              key={model.id}
              onClick={() => handleModelSelect(model.id)}
              sx={{
                color: 'var(--text-primary)',
                '&:hover': {
                  bgcolor: 'var(--bg-tertiary)',
                },
              }}
            >
              {model.name}
            </MenuItem>
          ))}
        </Menu>

        {/* Divider */}
        <div className="w-px h-6 bg-border-default" />

        {/* User Avatar */}
        <button
          onClick={handleUserClick}
          className="flex items-center gap-2 p-1 rounded-full hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-border-subtle hover:border-accent transition-colors">
            {isAuthenticated && user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-full h-full object-cover"
              />
            ) : (
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: 'var(--accent-primary)', 
                  color: 'white',
                  fontSize: '0.875rem'
                }}
              >
                <LoginIcon sx={{ fontSize: 20 }} />
              </Avatar>
            )}
          </div>
        </button>
      </div>
    </header>
  )
}