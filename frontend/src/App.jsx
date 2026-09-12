import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import RouteProtetta from './components/RouteProtetta';

import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DettaglioTour from './pages/DettaglioTour';
import DashboardGuida from './pages/DashboardGuida';
import GestisciTour from './pages/GestisciTour';
import LeMiePrenotazioni from './pages/LeMiePrenotazioni';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/tours" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/tour/:id" element={<DettaglioTour />} />

            <Route
              path="/le-mie-prenotazioni"
              element={
                <RouteProtetta ruoloRichiesto="turista">
                  <LeMiePrenotazioni />
                </RouteProtetta>
              }
            />

            <Route
              path="/dashboard-guida"
              element={
                <RouteProtetta ruoloRichiesto="guida">
                  <DashboardGuida />
                </RouteProtetta>
              }
            />

            <Route
              path="/gestisci-tour"
              element={
                <RouteProtetta ruoloRichiesto="guida">
                  <GestisciTour />
                </RouteProtetta>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
