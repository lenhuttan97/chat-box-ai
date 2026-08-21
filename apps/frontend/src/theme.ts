import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#61dbb4', // emerald green accent
    },
    secondary: {
      main: '#10a27e', // green CTA
    },
    background: {
      default: 'var(--bg-primary)', // sử dụng CSS variable
      paper: 'var(--bg-secondary)',  // sử dụng CSS variable
    },
    text: {
      primary: 'var(--text-primary)',     // sử dụng CSS variable
      secondary: 'var(--text-secondary)', // sử dụng CSS variable
      disabled: 'var(--text-tertiary)',   // sử dụng CSS variable
    },
    mode: 'light',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--surface-2)',
          color: 'var(--text-primary)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--surface-2)',
          color: 'var(--text-primary)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'var(--surface-2)',
          color: 'var(--text-primary)',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    primary: {
      main: '#61dbb4', // emerald green accent
    },
    secondary: {
      main: '#10a27e', // green CTA
    },
    background: {
      default: 'var(--bg-primary)', // sử dụng CSS variable
      paper: 'var(--bg-secondary)',  // sử dụng CSS variable
    },
    text: {
      primary: 'var(--text-primary)',     // sử dụng CSS variable
      secondary: 'var(--text-secondary)', // sử dụng CSS variable
      disabled: 'var(--text-tertiary)',   // sử dụng CSS variable
    },
    mode: 'dark',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--surface-2)',
          color: 'var(--text-primary)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--surface-2)',
          color: 'var(--text-primary)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'var(--surface-2)',
          color: 'var(--text-primary)',
        },
      },
    },
  },
});
