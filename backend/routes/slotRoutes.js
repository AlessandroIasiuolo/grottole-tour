const express = require('express');
const router = express.Router();
const { creaSlot } = require('../controllers/slotController');
const { autentica, autorizza } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Slot
 *   description: Gestione degli orari disponibili per i tour
 */

/**
 * @swagger
 * /api/slots:
 *   post:
 *     summary: Crea uno slot per un tour di propria guida
 *     tags: [Slot]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tourId, data, ora, postiDisponibili]
 *             properties:
 *               tourId: { type: string }
 *               data: { type: string, format: date, example: '2026-09-15' }
 *               ora: { type: string, example: '10:00' }
 *               postiDisponibili: { type: number, example: 8 }
 *     responses:
 *       201:
 *         description: Slot creato
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Slot' }
 *       403:
 *         description: Il tour non appartiene alla guida autenticata
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Errore' }
 *       404:
 *         description: Tour non trovato
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Errore' }
 */
router.post('/', autentica, autorizza('guida'), creaSlot);

module.exports = router;
