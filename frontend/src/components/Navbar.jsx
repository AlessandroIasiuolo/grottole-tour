import { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { utente, logout } = useAuth();
    const navigate = useNavigate();
    const [menuAperto, setMenuAperto] = useState(false);

    function handleLogout() {
        setMenuAperto(false);
        logout();
        navigate('/login');
    }

    const linkComuni = [
        { label: 'Home', to: '/' },
        { label: 'Tour disponibili', to: '/tours' }
    ];

    const linkOspite = [
        { label: 'Accedi', to: '/login' },
        { label: 'Registrati', to: '/register' }
    ];

    const linkTurista = [{ label: 'Le mie prenotazioni', to: '/le-mie-prenotazioni' }];

    const linkGuida = [
        { label: 'Prenotazioni ricevute', to: '/dashboard-guida' },
        { label: 'Gestisci tour', to: '/gestisci-tour' }
    ];

    let linkRuolo = [];
    if (!utente) linkRuolo = linkOspite;
    else if (utente.ruolo === 'turista') linkRuolo = linkTurista;
    else if (utente.ruolo === 'guida') linkRuolo = linkGuida;

    const tuttiILink = [...linkComuni, ...linkRuolo];

    return (
        <AppBar position="static">
            <Toolbar sx={{ gap: 2 }}>
                <Box
                    component={Link}
                    to="/"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        flexGrow: 1,
                        textDecoration: 'none',
                        color: 'inherit'
                    }}
                >
                    <Box
                        component="img"
                        src="/logo.png"
                        alt="Logo Grottole Tour"
                        sx={{ height: 36, width: 'auto' }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Grottole Tour
                    </Typography>
                </Box>

                {/* Barra di bottoni classica desktop */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                    {tuttiILink.map((link) => (
                        <Button key={link.to} color="inherit" component={Link} to={link.to}>
                            {link.label}
                        </Button>
                    ))}

                    {utente && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                            <Typography variant="body2">Ciao, {utente.nome}</Typography>
                            <Button color="inherit" onClick={handleLogout}>
                                Esci
                            </Button>
                        </Box>
                    )}
                </Box>

                {/* Icona hamburger mobile */}
                <IconButton
                    color="inherit"
                    edge="end"
                    sx={{ display: { xs: 'flex', md: 'none' } }}
                    onClick={() => setMenuAperto(true)}
                    aria-label="Apri il menu"
                >
                    <MenuIcon />
                </IconButton>
            </Toolbar>

            {/* Menu a comparsa laterale per mobile */}
            <Drawer anchor="right" open={menuAperto} onClose={() => setMenuAperto(false)}>
                <Box sx={{ width: 250 }} role="presentation">
                    {utente && (
                        <Typography variant="subtitle1" sx={{ px: 2, py: 2, fontWeight: 600 }}>
                            Ciao, {utente.nome}
                        </Typography>
                    )}
                    <Divider />
                    <List>
                        {tuttiILink.map((link) => (
                            <ListItem key={link.to} disablePadding>
                                <ListItemButton
                                    component={Link}
                                    to={link.to}
                                    onClick={() => setMenuAperto(false)}
                                >
                                    <ListItemText primary={link.label} />
                                </ListItemButton>
                            </ListItem>
                        ))}

                        {utente && (
                            <ListItem disablePadding>
                                <ListItemButton onClick={handleLogout}>
                                    <ListItemText primary="Esci" />
                                </ListItemButton>
                            </ListItem>
                        )}
                    </List>
                </Box>
            </Drawer>
        </AppBar>
    );
}