const express = require('express');
const router = express.Router();
const { elencoTour, dettaglioTour, creaTour } = require('../controllers/tourController');
const { slotPerTour } = require('../controllers/slotController');
const { autentica, autorizza } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Tour
 *   description: Gestione dei tour disponibili
 */

/**
 * @swagger
 * /api/tours:
 *   get:
 *     summary: Elenco pubblico di tutti i tour
 *     tags: [Tour]
 *     security: []
 *     responses:
 *       200:
 *         description: Lista dei tour
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Tour' }
 */
router.get('/', elencoTour);

/**
 * @swagger
 * /api/tours/{id}:
 *   get:
 *     summary: Dettaglio di un singolo tour
 *     tags: [Tour]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Dettaglio tour
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Tour' }
 *       404:
 *         description: Tour non trovato
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Errore' }
 */
router.get('/:id', dettaglioTour);

/**
 * @swagger
 * /api/tours/{tourId}/slots:
 *   get:
 *     summary: Slot disponibili (con posti > 0) per un tour
 *     tags: [Tour]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: tourId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lista degli slot disponibili
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Slot' }
 */
router.get('/:tourId/slots', slotPerTour);

/**
 * @swagger
 * /api/tours:
 *   post:
 *     summary: Crea un nuovo tour (solo guida autenticata)
 *     tags: [Tour]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titolo, descrizione, luogo, durata]
 *             properties:
 *               titolo: { type: string }
 *               descrizione: { type: string }
 *               luogo: { type: string }
 *               durata: { type: number }
 *     responses:
 *       201:
 *         description: Tour creato
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Tour' }
 *       400:
 *         description: Campi obbligatori mancanti
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Errore' }
 *       403:
 *         description: Accesso consentito solo al ruolo guida
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Errore' }
 */
router.post('/', autentica, autorizza('guida'), creaTour);

module.exports = router;
