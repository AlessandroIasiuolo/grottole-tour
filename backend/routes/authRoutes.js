const express = require('express');
const router = express.Router();
const { registra, login } = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Registrazione e login
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuovo utente (turista o guida)
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, password, ruolo]
 *             properties:
 *               nome: { type: string, example: Maria Rossi }
 *               email: { type: string, example: maria@example.com }
 *               password: { type: string, example: password123 }
 *               ruolo: { type: string, enum: [turista, guida] }
 *     responses:
 *       201:
 *         description: Utente creato, restituisce token JWT e dati utente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *                 utente: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Campi mancanti o ruolo non valido
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Errore' }
 *       409:
 *         description: Email già registrata
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Errore' }
 */
router.post('/register', registra);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Effettua il login
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: maria@example.com }
 *               password: { type: string, example: password123 }
 *     responses:
 *       200:
 *         description: Login riuscito, restituisce token JWT e dati utente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *                 utente: { $ref: '#/components/schemas/User' }
 *       401:
 *         description: Credenziali non valide
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Errore' }
 */
router.post('/login', login);

module.exports = router;
