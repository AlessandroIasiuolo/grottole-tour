import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  TextField,
  Alert,
  Box,
  Chip,
  alpha
} from '@mui/material';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DettaglioTour() {
  const { id } = useParams();
  const { utente } = useAuth();
  const navigate = useNavigate();

  const [tour, setTour] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotSelezionato, setSlotSelezionato] = useState(null);
  const [numeroPersone, setNumeroPersone] = useState(1);
  const [messaggio, setMessaggio] = useState(null);
  const [errore, setErrore] = useState('');

  useEffect(() => {
    caricaDati();
  }, [id]);

  function caricaDati() {
    api.get(`/api/tours/${id}`).then((res) => setTour(res.data));
    api.get(`/api/tours/${id}/slots`).then((res) => setSlots(res.data));
  }

  async function handlePrenota() {
    setErrore('');
    setMessaggio(null);

    if (!utente) {
      navigate('/login');
      return;
    }

    if (!slotSelezionato) {
      setErrore('Seleziona prima un orario disponibile');
      return;
    }

    try {
      await api.post('/api/bookings', {
        slotId: slotSelezionato._id,
        numeroPersone: Number(numeroPersone)
      });
      setMessaggio('Prenotazione inviata! Riceverai una notifica quando la guida risponde.');
      setSlotSelezionato(null);
      caricaDati();
    } catch (err) {
      setErrore(err.response?.data?.messaggio || 'Errore durante la prenotazione');
    }
  }

  if (!tour) return <Container sx={{ mt: 4 }}><Typography color="text.secondary">Caricamento...</Typography></Container>;

  return (
      <Container maxWidth="sm" sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>{tour.titolo}</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>{tour.luogo}</Typography>
        <Chip label={`${tour.durata} minuti`} size="small" color="primary" variant="outlined" sx={{ mb: 2 }} />
        <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7 }}>{tour.descrizione}</Typography>

        <Paper
            elevation={0}
            sx={{
              p: 3,
              background: (t) => alpha(t.palette.background.paper, 0.8),
              backdropFilter: 'blur(12px)',
              border: (t) => `1px solid ${alpha(t.palette.secondary.main, 0.2)}`,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
            }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Orari disponibili</Typography>

          {slots.length === 0 && (
              <Typography color="text.secondary">Nessuno slot disponibile al momento.</Typography>
          )}

          <List sx={{ gap: 1, display: 'flex', flexDirection: 'column' }}>
            {slots.map((slot) => (
                <ListItem key={slot._id} disablePadding>
                  <ListItemButton
                      selected={slotSelezionato?._id === slot._id}
                      onClick={() => setSlotSelezionato(slot)}
                      sx={{
                        borderRadius: 2,
                        transition: 'all 0.2s ease',
                        '&.Mui-selected': {
                          backgroundColor: (t) => alpha(t.palette.primary.main, 0.12),
                          borderColor: 'primary.main',
                        },
                      }}
                  >
                    <ListItemText
                        primary={`${new Date(slot.data).toLocaleDateString('it-IT')} — ore ${slot.ora}`}
                        secondary={`${slot.postiDisponibili} posti disponibili`}
                    />
                  </ListItemButton>
                </ListItem>
            ))}
          </List>

          {slotSelezionato && (
              <Box sx={{ mt: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                    label="Numero persone"
                    type="number"
                    size="small"
                    value={numeroPersone}
                    onChange={(e) => setNumeroPersone(e.target.value)}
                    inputProps={{ min: 1, max: slotSelezionato.postiDisponibili }}
                    sx={{ width: 140 }}
                />
                <Button variant="contained" onClick={handlePrenota} sx={{ flexGrow: 1 }}>
                  Prenota ora
                </Button>
              </Box>
          )}

          {errore && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{errore}</Alert>}
          {messaggio && <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>{messaggio}</Alert>}
        </Paper>
      </Container>
  );
}