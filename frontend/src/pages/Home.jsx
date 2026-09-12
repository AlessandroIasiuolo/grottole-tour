import { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, CardActionArea, Typography, Chip, Box, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Home() {
    const [tours, setTours] = useState([]);
    const [caricamento, setCaricamento] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/api/tours')
            .then((res) => setTours(res.data))
            .catch((err) => console.error('Errore nel caricamento dei tour:', err))
            .finally(() => setCaricamento(false));
    }, []);

    return (
        <Container sx={{ mt: 4, mb: 6 }}>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
                Visite guidate a Grottole
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Scopri il centro storico e i monumenti del borgo con una guida locale.<br></br>
                Prezzo per ogni tour: <b>25€ a persona.</b>
            </Typography>

            {caricamento && <Typography color="text.secondary">Caricamento tour...</Typography>}

            {!caricamento && tours.length === 0 && (
                <Typography color="text.secondary">Nessun tour disponibile al momento.</Typography>
            )}

            <Grid container spacing={3}>
                {tours.map((tour) => (
                    <Grid item xs={12} sm={6} md={4} key={tour._id}>
                        <Card
                            elevation={0}
                            sx={{
                                height: '100%',
                                background: (t) => alpha(t.palette.background.paper, 0.75),
                                backdropFilter: 'blur(10px)',
                                border: (t) => `1px solid ${alpha(t.palette.secondary.main, 0.2)}`,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    transform: 'translateY(-6px)',
                                    boxShadow: (t) => `0 16px 32px ${alpha(t.palette.primary.main, 0.18)}`,
                                    borderColor: 'primary.main',
                                },
                            }}
                        >
                            <CardActionArea onClick={() => navigate(`/tour/${tour._id}`)} sx={{ height: '100%' }}>
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>{tour.titolo}</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 500 }}>
                                            {tour.luogo}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 2, color: 'text.primary' }}>
                                            {tour.descrizione}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 'auto', pt: 1 }}>
                                        <Chip label={`${tour.durata} min`} size="small" color="primary" variant="outlined" />
                                        {tour.guidaId?.nome && (
                                            <Typography variant="caption" color="text.secondary">
                                                Guida: {tour.guidaId.nome}
                                            </Typography>
                                        )}
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}