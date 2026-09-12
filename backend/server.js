require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const tourRoutes = require('./routes/tourRoutes');
const slotRoutes = require('./routes/slotRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

connectDB();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/', (req, res) => res.send('API Grottole Tour attiva'));

// Documentazione interattiva delle API, generata da OpenAPI/Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Setup HTTP server + Socket.IO ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL }
});

// Ogni client, dopo il login, si unisce a una "room" personale
// in base al proprio id e ruolo, così le notifiche arrivano solo a lui.
io.on('connection', (socket) => {
  const { token } = socket.handshake.auth;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const room = `${payload.ruolo}-${payload.id}`;
    socket.join(room);
    console.log(`Socket connesso e unito alla room: ${room}`);
  } catch (err) {
    console.log('Connessione socket rifiutata: token non valido');
    socket.disconnect();
  }
});

// Rende disponibile "io" ai controller tramite req.app.get('io')
app.set('io', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server in ascolto sulla porta ${PORT}`));
