import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RouteProtetta({ children, ruoloRichiesto }) {
  const { utente } = useAuth();

  if (!utente) {
    return <Navigate to="/login" replace />;
  }

  if (ruoloRichiesto && utente.ruolo !== ruoloRichiesto) {
    return <Navigate to="/" replace />;
  }

  return children;
}
