import { Box, List, ListItemButton, ListItemText, Typography, IconButton, CircularProgress } from '@mui/material'
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material'
import { useConversations } from '../hooks/useConversations'
import { useTheme } from '../hooks/useTheme'
import { format } from 'date-fns'

export const ConversationList = () => {
  const { conversations, currentConversation, loading, loadConversation, removeConversation, selectConversation } = useConversations()
  const { darkMode } = useTheme()

  const handleNewChat = () => {
    selectConversation(null)
  }

  if (loading) {
    return (
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={24} />
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography 
          variant="h6" 
          fontWeight="bold"
          sx={{ color: darkMode ? 'white' : '#0f172a' }}
        >
          Conversations
        </Typography>
        <IconButton 
          size="small" 
          onClick={handleNewChat}
          sx={{ color: darkMode ? '#94a3b8' : '#64748b' }}
        >
          <AddIcon />
        </IconButton>
      </Box>
      <List sx={{ flex: 1, overflow: 'auto' }}>
        {conversations.map((conv) => (
          <ListItemButton
            key={conv.id}
            selected={currentConversation?.id === conv.id}
            onClick={() => loadConversation(conv.id)}
            sx={{ 
              px: 2, 
              py: 1.5,
              color: darkMode ? '#cbd5e1' : '#475569',
              '&.Mui-selected': {
                bgcolor: darkMode ? 'rgba(16,162,126,0.15)' : 'rgba(16,162,126,0.1)',
                '&:hover': {
                  bgcolor: darkMode ? 'rgba(16,162,126,0.2)' : 'rgba(16,162,126,0.15)',
                }
              },
              '&:hover': {
                bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              }
            }}
          >
            <ListItemText
              primary={conv.name}
              secondary={format(new Date(conv.updatedAt), 'MMM d, yyyy')}
              primaryTypographyProps={{ 
                noWrap: true,
                sx: { color: darkMode ? 'white' : '#0f172a' }
              }}
              secondaryTypographyProps={{
                sx: { color: darkMode ? '#94a3b8' : '#64748b' }
              }}
            />
            <IconButton 
              size="small" 
              onClick={(e) => { e.stopPropagation(); removeConversation(conv.id) }}
              sx={{ color: darkMode ? '#94a3b8' : '#64748b' }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </ListItemButton>
        ))}
        {conversations.length === 0 && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography 
              variant="body2" 
              sx={{ color: darkMode ? '#94a3b8' : '#64748b' }}
            >
              No conversations yet
            </Typography>
          </Box>
        )}
      </List>
    </Box>
  )
}
