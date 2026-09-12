const express = require('express');
const router = express.Router();
const { elencoTour, dettaglioTour, creaTour } = require('../controllers/tourController');
const { slotPerTour } = require('../controllers/slotController');
const { autentica, autorizza } = require('../middleware/auth');

router.get('/', elencoTour);
router.get('/:id', dettaglioTour);
router.get('/:tourId/slots', slotPerTour);
router.post('/', autentica, autorizza('guida'), creaTour);

module.exports = router;
