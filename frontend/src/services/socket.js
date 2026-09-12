import { io } from 'socket.io-client';

let socket = null;

// Crea (o riusa) la connessione socket autenticata con il token corrente
export function connettiSocket() {
  const token = sessionStorage.getItem('token');
  if (!token) return null;

  if (socket && socket.connected) return socket;

  socket = io(import.meta.env.VITE_API_URL, {
    auth: { token }
  });

  return socket;
}

export function disconnettiSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}
