import { ReactNode } from 'react'
import { Box } from '@mui/material'

interface ChatLayoutProps {
  sidebar: ReactNode
  children: ReactNode
}

export const ChatLayout = ({ sidebar, children }: ChatLayoutProps) => {
  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      <Box
        sx={{
          width: 280,
          borderRight: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {sidebar}
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</Box>
    </Box>
  )
}
