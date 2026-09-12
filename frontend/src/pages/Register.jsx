import { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  alpha
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ruolo, setRuolo] = useState('turista');
  const [errore, setErrore] = useState('');
  const [caricamento, setCaricamento] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrore('');
    setCaricamento(true);

    try {
      const res = await api.post('/api/auth/register', { nome, email, password, ruolo });
      login(res.data.utente, res.data.token);
      navigate('/');
    } catch (err) {
      setErrore(err.response?.data?.messaggio || 'Errore durante la registrazione');
    } finally {
      setCaricamento(false);
    }
  }

  return (
      <Container maxWidth="xs" sx={{ mt: 8, mb: 6 }}>
        <Paper
            elevation={0}
            sx={{
              p: 4,
              background: (t) => alpha(t.palette.background.paper, 0.8),
              backdropFilter: 'blur(16px)',
              borderRadius: 4,
              border: (t) => `1px solid ${alpha(t.palette.primary.main, 0.2)}`,
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.06)',
            }}
        >
          <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', fontWeight: 700, color: 'primary.main' }}>
            Crea un account
          </Typography>

          {errore && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{errore}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
                label="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                fullWidth
            />
            <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
            />
            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
            />

            <Typography variant="body2" sx={{ fontWeight: 500 }}>Ti registri come:</Typography>
            <ToggleButtonGroup
                value={ruolo}
                exclusive
                onChange={(e, valore) => valore && setRuolo(valore)}
                fullWidth
            >
              <ToggleButton value="turista">Turista</ToggleButton>
              <ToggleButton value="guida">Guida</ToggleButton>
            </ToggleButtonGroup>

            <Button type="submit" variant="contained" size="large" disabled={caricamento} sx={{ py: 1.2 }}>
              {caricamento ? 'Registrazione in corso...' : 'Registrati'}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: 'text.secondary' }}>
            Hai già un account? <Link to="/login" style={{ color: '#B5563C', fontWeight: 600 }}>Accedi</Link>
          </Typography>
        </Paper>
      </Container>
  );
}
