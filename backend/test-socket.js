// Script di test per verificare le notifiche Socket.IO.

const { io } = require('socket.io-client');

const token = process.argv[2];
const ruoloAtteso = process.argv[3] || '(sconosciuto)';

if (!token) {
    console.error('Uso: node test-socket.js <token> [ruolo]');
    process.exit(1);
}

const socket = io('http://localhost:5000', {
    auth: { token }
});

socket.on('connect', () => {
    console.log(`✅ Connesso come ${ruoloAtteso}. In ascolto di eventi...`);
});

socket.on('nuova-prenotazione', (dati) => {
    console.log('🔔 Evento ricevuto: nuova-prenotazione');
    console.log(dati);
});

socket.on('esito-prenotazione', (dati) => {
    console.log('🔔 Evento ricevuto: esito-prenotazione');
    console.log(dati);
});

socket.on('disconnect', () => {
    console.log('❌ Disconnesso dal server');
});

socket.on('connect_error', (err) => {
    console.error('Errore di connessione:', err.message);
});