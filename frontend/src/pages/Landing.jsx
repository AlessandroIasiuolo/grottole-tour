import { Box, Typography, Container, Grid, Card, CardMedia, CardContent, alpha } from '@mui/material';

const puntiDiInteresse = [
    {
        nome: 'Castello Feudale',
        immagine: '/images/castello.jpg',
        descrizione:
            'Sorge sulla collina della Motta, distaccato dal centro abitato. Con la sua torre ' +
            'centrale a base quadrata, ha rappresentato per secoli l\'antica vedetta a protezione del borgo.'
    },
    {
        nome: 'Chiesa Diruta',
        immagine: '/images/chiesa-diruta.jpg',
        descrizione:
            'I suggestivi resti della Chiesa dei SS. Luca e Giuliano, costruita nei primi anni del ' +
            '1500. Il suo aspetto di rovina, imponente e misterioso, è tra gli scorci più fotografati del paese.'
    },
    {
        nome: 'Chiesa Madre',
        immagine: '/images/chiesa-madre.jpeg',
        descrizione:
            'Dedicata a Santa Maria Maggiore, con l\'annesso ex convento dei frati Domenicani. ' +
            'Custodisce al suo interno altari lignei, una cantoria e un coro settecenteschi, oltre a diverse tele e statue.'
    },
    {
        nome: 'Chiesa di San Rocco',
        immagine: '/images/chiesa-san-rocco.jpg',
        descrizione:
            'Costruita nel 1400 e in origine dedicata a Santa Maria la Grotta, prese il nome dal ' +
            'patrono San Rocco dopo la peste del 1655. La facciata a doppia capanna è impreziosita da tre rosoni rinascimentali.'
    },
    {
        nome: 'Convento dei Cappuccini',
        immagine: '/images/cappuccini.jpeg',
        descrizione:
            'Fatto costruire a partire dal 1601 e dedicato alla Santissima Trinità, il convento ha fatto da ' +
            'set cinematografico a due documentari italiani degli anni \'60 e \'70, tra cui uno di Joris Ivens.'
    },
    {
        nome: 'Santuario di Sant\'Antuono',
        immagine: '/images/santo-antuono.jpg',
        descrizione:
            'Il Santuario di Sant\'Antonio Abate, chiamato familiarmente "Sant\'Antuono", sorge isolato nel bosco ' +
            'di Fosso Magno, a circa 14 km dal paese. È una delle costruzioni religiose più antiche del territorio.'
    },
    {
        nome: 'Centro Storico',
        immagine: '/images/centro-storico.jpg',
        descrizione:
            'Vicoli lastricati e case in pietra si intrecciano nella Terravecchia, il nucleo abitativo ' +
            'più antico di Grottole, dove il tempo sembra essersi fermato da decenni.'
    }
];

export default function Landing() {
    return (
        <Box>
            {/* Sezione hero originale con disposizione e colori trasparenti iniziali */}
            <Box
                sx={{
                    position: 'relative',
                    minHeight: { xs: '60vh', md: '70vh' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: '#fff',
                    backgroundImage: 'linear-gradient(rgba(58, 40, 30, 0.55), rgba(58, 40, 30, 0.55)), url(/images/hero-grottole.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: '#8A3E29'
                }}
            >
                <Container maxWidth="sm">
                    <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '2.2rem', md: '3rem' } }}>
                        Grottole
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 400 }}>
                        Un borgo lucano sospeso nel tempo, tra grotte scavate nella roccia,
                        rovine medievali e scorci panoramici sulla valle del Basento.
                        Scopri il centro storico e i suoi monumenti con una guida locale.
                    </Typography>
                </Container>
            </Box>

            {/* Sezione punti di interesse con glassmorphism sulle schede */}
            <Container sx={{ py: 6 }}>
                <Typography variant="h4" sx={{ mb: 1, textAlign: 'center', fontWeight: 700 }}>
                    Cosa vedere a Grottole
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
                    Alcuni dei luoghi che potrai visitare durante le nostre passeggiate guidate
                </Typography>

                <Grid container spacing={3}>
                    {puntiDiInteresse.map((punto) => (
                        <Grid item xs={12} sm={6} md={4} key={punto.nome}>
                            <Card
                                elevation={0}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
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
                                <CardMedia
                                    component="img"
                                    height="180"
                                    image={punto.immagine}
                                    alt={punto.nome}
                                    sx={{ backgroundColor: 'secondary.light' }}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>{punto.nome}</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                                        {punto.descrizione}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}