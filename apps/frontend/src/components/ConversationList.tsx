import { Box, List, ListItemButton, ListItemText, Typography, IconButton, CircularProgress } from '@mui/material'
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material'
import { useConversations } from '../hooks/useConversations'
import { format } from 'date-fns'

export const ConversationList = () => {
  const { conversations, currentConversation, loading, loadConversation, removeConversation, selectConversation } = useConversations()

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
        <Typography variant="h6" fontWeight="bold">
          Conversations
        </Typography>
        <IconButton size="small" onClick={handleNewChat}>
          <AddIcon />
        </IconButton>
      </Box>
      <List sx={{ flex: 1, overflow: 'auto' }}>
        {conversations.map((conv) => (
          <ListItemButton
            key={conv.id}
            selected={currentConversation?.id === conv.id}
            onClick={() => loadConversation(conv.id)}
            sx={{ px: 2, py: 1.5 }}
          >
            <ListItemText
              primary={conv.name}
              secondary={format(new Date(conv.updatedAt), 'MMM d, yyyy')}
              primaryTypographyProps={{ noWrap: true }}
            />
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); removeConversation(conv.id) }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </ListItemButton>
        ))}
        {conversations.length === 0 && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No conversations yet
            </Typography>
          </Box>
        )}
      </List>
    </Box>
  )
}
