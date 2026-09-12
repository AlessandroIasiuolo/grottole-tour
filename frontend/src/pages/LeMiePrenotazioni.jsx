import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Snackbar,
  Alert,
  alpha
} from '@mui/material';
import api from '../services/api';
import { connettiSocket } from '../services/socket';

const coloriStato = {
  'in attesa': 'warning',
  accettata: 'success',
  rifiutata: 'error'
};

export default function LeMiePrenotazioni() {
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [notifica, setNotifica] = useState(null);

  useEffect(() => {
    caricaPrenotazioni();

    // Sottoscrizione all'evento real-time di esito prenotazione
    const socket = connettiSocket();
    if (socket) {
      socket.on('esito-prenotazione', (dati) => {
        setNotifica(`La tua prenotazione per "${dati.tourTitolo}" è stata ${dati.stato}`);
        caricaPrenotazioni();
      });
    }

    return () => {
      if (socket) socket.off('esito-prenotazione');
    };
  }, []);

  function caricaPrenotazioni() {
    api.get('/api/bookings/mie').then((res) => setPrenotazioni(res.data));
  }

  return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>Le mie prenotazioni</Typography>

        <Paper
            elevation={0}
            sx={{
              p: 2,
              background: (t) => alpha(t.palette.background.paper, 0.8),
              backdropFilter: 'blur(12px)',
              border: (t) => `1px solid ${alpha(t.palette.secondary.main, 0.2)}`,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
            }}
        >
          <List>
            {prenotazioni.length === 0 && (
                <ListItem>
                  <ListItemText
                      primary="Non hai ancora effettuato prenotazioni."
                      sx={{ color: 'text.secondary' }}
                  />
                </ListItem>
            )}

            {prenotazioni.map((p) => (
                <ListItem key={p._id} divider>
                  <ListItemText
                      primary={`${p.slotId?.tourId?.titolo || 'Tour'} — ${p.numeroPersone} persone`}
                      secondary={
                          p.slotId?.data &&
                          `${new Date(p.slotId.data).toLocaleDateString('it-IT')} ore ${p.slotId.ora}`
                      }
                  />
                  <Chip label={p.stato} color={coloriStato[p.stato]} size="small" />
                </ListItem>
            ))}
          </List>
        </Paper>

        <Snackbar
            open={!!notifica}
            autoHideDuration={5000}
            onClose={() => setNotifica(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity="info" onClose={() => setNotifica(null)} sx={{ borderRadius: 2 }}>
            {notifica}
          </Alert>
        </Snackbar>
      </Container>
  );
}