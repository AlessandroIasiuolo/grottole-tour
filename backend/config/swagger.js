const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Grottole Tour API',
      version: '1.0.0',
      description:
        'API per la gestione di prenotazioni di visite guidate nel centro storico di Grottole. ' +
        'Due ruoli: "turista" (prenota visite) e "guida" (pubblica tour e gestisce le prenotazioni).'
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Ambiente locale' },
      { url: 'https://grottole-tour-backend.onrender.com', description: 'Produzione (Render)' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '66f1a2b3c4d5e6f7a8b9c0d1' },
            nome: { type: 'string', example: 'Maria Rossi' },
            email: { type: 'string', example: 'maria@example.com' },
            ruolo: { type: 'string', enum: ['turista', 'guida'], example: 'turista' }
          }
        },
        Tour: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            titolo: { type: 'string', example: 'Centro Storico e Castello di Grottole' },
            descrizione: { type: 'string', example: 'Passeggiata guidata tra i vicoli della Terravecchia' },
            luogo: { type: 'string', example: 'Grottole (MT)' },
            durata: { type: 'number', example: 90, description: 'Durata in minuti' },
            guidaId: { type: 'string', description: 'Riferimento allo User guida proprietario del tour' }
          }
        },
        Slot: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            tourId: { type: 'string' },
            data: { type: 'string', format: 'date', example: '2026-09-15' },
            ora: { type: 'string', example: '10:00' },
            postiDisponibili: { type: 'number', example: 8 }
          }
        },
        Booking: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            slotId: { type: 'string' },
            turistaId: { type: 'string' },
            numeroPersone: { type: 'number', example: 2 },
            stato: {
              type: 'string',
              enum: ['in attesa', 'accettata', 'rifiutata'],
              example: 'in attesa'
            }
          }
        },
        Errore: {
          type: 'object',
          properties: {
            messaggio: { type: 'string', example: 'Descrizione dell\'errore' }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  // File in cui swagger-jsdoc cerca i commenti @swagger
  apis: ['./routes/*.js']
};

module.exports = swaggerJsdoc(options);
