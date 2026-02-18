import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0F4C5C',
      light: '#2D6A74',
      dark: '#0A3945'
    },
    secondary: {
      main: '#E36414',
      light: '#F08E3C',
      dark: '#B2480B'
    },
    background: {
      default: '#F6EFE7',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#1E1E1E',
      secondary: '#5C5C5C'
    }
  },
  typography: {
    fontFamily: '"Source Sans 3", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Space Grotesk", "Source Sans 3", sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.02em'
    },
    h2: {
      fontFamily: '"Space Grotesk", "Source Sans 3", sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.02em'
    },
    h3: {
      fontFamily: '"Space Grotesk", "Source Sans 3", sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.01em'
    },
    h4: {
      fontFamily: '"Space Grotesk", "Source Sans 3", sans-serif',
      fontWeight: 600
    },
    button: {
      textTransform: 'none',
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 16
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#1E1E1E',
          borderBottom: '1px solid #efe4d8'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #efe4d8',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8f2ea 100%)'
        }
      }
    }
  }
});

export default theme;
