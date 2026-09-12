import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Alert,
  Grid,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Divider,
  alpha
} from '@mui/material';
import api from '../services/api';

export default function GestisciTour() {
  const [tourGuida, setTourGuida] = useState([]);
  const [errore, setErrore] = useState('');
  const [successo, setSuccesso] = useState('');

  // Form nuovo tour
  const [nuovoTour, setNuovoTour] = useState({ titolo: '', descrizione: '', luogo: '', durata: '' });

  // Form nuovo slot
  const [tourSelezionato, setTourSelezionato] = useState('');
  const [nuovoSlot, setNuovoSlot] = useState({ data: '', ora: '', postiDisponibili: '' });

  useEffect(() => {
    caricaTour();
  }, []);

  function caricaTour() {
    api.get('/api/tours').then((res) => setTourGuida(res.data));
  }

  async function handleCreaTour(e) {
    e.preventDefault();
    setErrore('');
    setSuccesso('');
    try {
      await api.post('/api/tours', {
        ...nuovoTour,
        durata: Number(nuovoTour.durata)
      });
      setSuccesso('Tour creato con successo');
      setNuovoTour({ titolo: '', descrizione: '', luogo: '', durata: '' });
      caricaTour();
    } catch (err) {
      setErrore(err.response?.data?.messaggio || 'Errore nella creazione del tour');
    }
  }

  async function handleCreaSlot(e) {
    e.preventDefault();
    setErrore('');
    setSuccesso('');

    if (!tourSelezionato) {
      setErrore('Seleziona un tour a cui aggiungere lo slot');
      return;
    }

    try {
      await api.post('/api/slots', {
        tourId: tourSelezionato,
        data: nuovoSlot.data,
        ora: nuovoSlot.ora,
        postiDisponibili: Number(nuovoSlot.postiDisponibili)
      });
      setSuccesso('Slot aggiunto con successo');
      setNuovoSlot({ data: '', ora: '', postiDisponibili: '' });
    } catch (err) {
      setErrore(err.response?.data?.messaggio || 'Errore nella creazione dello slot');
    }
  }

  const paperGlassStyle = {
    p: 3,
    background: (t) => alpha(t.palette.background.paper, 0.8),
    backdropFilter: 'blur(12px)',
    border: (t) => `1px solid ${alpha(t.palette.secondary.main, 0.2)}`,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
  };

  return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>Gestisci i tuoi tour</Typography>

        {errore && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{errore}</Alert>}
        {successo && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{successo}</Alert>}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={paperGlassStyle}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Nuovo tour</Typography>
              <Box component="form" onSubmit={handleCreaTour} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Titolo"
                    value={nuovoTour.titolo}
                    onChange={(e) => setNuovoTour({ ...nuovoTour, titolo: e.target.value })}
                    required
                />
                <TextField
                    label="Descrizione"
                    value={nuovoTour.descrizione}
                    onChange={(e) => setNuovoTour({ ...nuovoTour, descrizione: e.target.value })}
                    multiline
                    rows={3}
                    required
                />
                <TextField
                    label="Luogo"
                    value={nuovoTour.luogo}
                    onChange={(e) => setNuovoTour({ ...nuovoTour, luogo: e.target.value })}
                    required
                />
                <TextField
                    label="Durata (minuti)"
                    type="number"
                    value={nuovoTour.durata}
                    onChange={(e) => setNuovoTour({ ...nuovoTour, durata: e.target.value })}
                    required
                />
                <Button type="submit" variant="contained">Crea tour</Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={paperGlassStyle}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Nuovo slot</Typography>
              <Box component="form" onSubmit={handleCreaSlot} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    select
                    label="Tour"
                    value={tourSelezionato}
                    onChange={(e) => setTourSelezionato(e.target.value)}
                    required
                >
                  {tourGuida.map((t) => (
                      <MenuItem key={t._id} value={t._id}>{t.titolo}</MenuItem>
                  ))}
                </TextField>
                <TextField
                    label="Data"
                    type="date"
                    value={nuovoSlot.data}
                    onChange={(e) => setNuovoSlot({ ...nuovoSlot, data: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    required
                />
                <TextField
                    label="Ora"
                    type="time"
                    value={nuovoSlot.ora}
                    onChange={(e) => setNuovoSlot({ ...nuovoSlot, ora: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    required
                />
                <TextField
                    label="Posti disponibili"
                    type="number"
                    value={nuovoSlot.postiDisponibili}
                    onChange={(e) => setNuovoSlot({ ...nuovoSlot, postiDisponibili: e.target.value })}
                    required
                />
                <Button type="submit" variant="contained">Aggiungi slot</Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Paper elevation={0} sx={{ ...paperGlassStyle, mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>I tuoi tour pubblicati</Typography>
          <List>
            {tourGuida.map((t, i) => (
                <Box key={t._id}>
                  <ListItem>
                    <ListItemText primary={t.titolo} secondary={t.luogo} />
                  </ListItem>
                  {i < tourGuida.length - 1 && <Divider />}
                </Box>
            ))}
          </List>
        </Paper>
      </Container>
  );
}