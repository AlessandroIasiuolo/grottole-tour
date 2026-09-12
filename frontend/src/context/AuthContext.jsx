import { createContext, useContext, useState, useEffect } from 'react';
import { connettiSocket, disconnettiSocket } from '../services/socket';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [utente, setUtente] = useState(() => {
    const salvato = sessionStorage.getItem('utente');
    return salvato ? JSON.parse(salvato) : null;
  });

  // Ristabilisce la connessione socket se l'utente è già loggato al caricamento
  useEffect(() => {
    if (utente) {
      connettiSocket();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function login(datiUtente, token) {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('utente', JSON.stringify(datiUtente));
    setUtente(datiUtente);
    connettiSocket();
  }

  function logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('utente');
    setUtente(null);
    disconnettiSocket();
  }

  return (
      <AuthContext.Provider value={{ utente, login, logout }}>
        {children}
      </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
