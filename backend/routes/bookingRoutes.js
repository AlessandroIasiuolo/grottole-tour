const express = require('express');
const router = express.Router();
const {
  creaPrenotazione,
  mieBookings,
  bookingsRicevute,
  aggiornaStatoPrenotazione
} = require('../controllers/bookingController');
const { autentica, autorizza } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Prenotazioni
 *   description: >
 *     Gestione delle prenotazioni. La creazione e l'accettazione/rifiuto
 *     generano anche un evento Socket.IO in tempo reale (rispettivamente
 *     "nuova-prenotazione" verso la guida e "esito-prenotazione" verso il turista),
 *     non rappresentabile in questa documentazione REST.
 */

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Il turista prenota uno slot
 *     tags: [Prenotazioni]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [slotId, numeroPersone]
 *             properties:
 *               slotId: { type: string }
 *               numeroPersone: { type: number, example: 2 }
 *     responses:
 *       201:
 *         description: Prenotazione creata con stato "in attesa"
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Booking' }
 *       400:
 *         description: Posti disponibili insufficienti o campi mancanti
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Errore' }
 *       404:
 *         description: Slot non trovato
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Errore' }
 */
router.post('/', autentica, autorizza('turista'), creaPrenotazione);

/**
 * @swagger
 * /api/bookings/mie:
 *   get:
 *     summary: Prenotazioni effettuate dal turista autenticato
 *     tags: [Prenotazioni]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista delle prenotazioni del turista
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Booking' }
 */
router.get('/mie', autentica, autorizza('turista'), mieBookings);

/**
 * @swagger
 * /api/bookings/ricevute:
 *   get:
 *     summary: Prenotazioni ricevute dalla guida autenticata sui propri tour
 *     tags: [Prenotazioni]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista delle prenotazioni ricevute
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Booking' }
 */
router.get('/ricevute', autentica, autorizza('guida'), bookingsRicevute);

/**
 * @swagger
 * /api/bookings/{id}:
 *   patch:
 *     summary: La guida accetta o rifiuta una prenotazione ricevuta
 *     tags: [Prenotazioni]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [stato]
 *             properties:
 *               stato: { type: string, enum: [accettata, rifiutata] }
 *     responses:
 *       200:
 *         description: Prenotazione aggiornata
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Booking' }
 *       400:
 *         description: Stato non valido
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Errore' }
 *       403:
 *         description: La prenotazione non riguarda un tour della guida autenticata
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Errore' }
 *       404:
 *         description: Prenotazione non trovata
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Errore' }
 */
router.patch('/:id', autentica, autorizza('guida'), aggiornaStatoPrenotazione);

module.exports = router;
