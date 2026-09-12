import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  Box,
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

export default function DashboardGuida() {
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [notifica, setNotifica] = useState(null);

  useEffect(() => {
    caricaPrenotazioni();

    const socket = connettiSocket();
    if (socket) {
      socket.on('nuova-prenotazione', (dati) => {
        setNotifica(`Nuova prenotazione per "${dati.tourTitolo}" (${dati.numeroPersone} persone)`);
        caricaPrenotazioni();
      });
    }

    return () => {
      if (socket) socket.off('nuova-prenotazione');
    };
  }, []);

  function caricaPrenotazioni() {
    api.get('/api/bookings/ricevute').then((res) => setPrenotazioni(res.data));
  }

  async function gestisciPrenotazione(id, stato) {
    try {
      await api.patch(`/api/bookings/${id}`, { stato });
      caricaPrenotazioni();
    } catch (err) {
      console.error('Errore aggiornamento prenotazione:', err);
    }
  }

  return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>Prenotazioni ricevute</Typography>

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
                  <ListItemText primary="Nessuna prenotazione ricevuta al momento." sx={{ color: 'text.secondary' }} />
                </ListItem>
            )}

            {prenotazioni.map((p) => (
                <ListItem
                    key={p._id}
                    divider
                    secondaryAction={
                        p.stato === 'in attesa' && (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  onClick={() => gestisciPrenotazione(p._id, 'accettata')}
                              >
                                Accetta
                              </Button>
                              <Button
                                  size="small"
                                  variant="outlined"
                                  color="error"
                                  onClick={() => gestisciPrenotazione(p._id, 'rifiutata')}
                              >
                                Rifiuta
                              </Button>
                            </Box>
                        )
                    }
                >
                  <ListItemText
                      sx={{ pr: p.stato === 'in attesa' ? 20 : 12 }}
                      primary={`${p.slotId?.tourId?.titolo || 'Tour'} — ${p.numeroPersone} persone`}
                      secondary={
                        <>
                          Richiesta da {p.turistaId?.nome} ({p.turistaId?.email})
                          {p.slotId?.data && ` — ${new Date(p.slotId.data).toLocaleDateString('it-IT')} ore ${p.slotId.ora}`}
                        </>
                      }
                  />
                  {p.stato !== 'in attesa' && (
                      <Chip label={p.stato} color={coloriStato[p.stato]} size="small" sx={{ mr: 2 }} />
                  )}
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