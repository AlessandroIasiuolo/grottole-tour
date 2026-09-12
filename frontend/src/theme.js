import { createTheme } from '@mui/material/styles';

// Palette ispirata ai colori del borgo di Grottole: pietra, terracotta, ocra
const theme = createTheme({
  palette: {
    primary: {
      main: '#B5563C', // terracotta
      light: '#D98B6F',
      dark: '#8A3E29'
    },
    secondary: {
      main: '#8C7A5E', // pietra/tufo
      light: '#B5A484',
      dark: '#645940'
    },
    background: {
      default: '#FAF6F1',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#3A322B'
    }
  },
  typography: {
    fontFamily: '"Georgia", "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 }
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        },
      },
    },
  },
});

export default theme;
