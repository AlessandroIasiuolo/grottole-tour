const express = require('express');
const router = express.Router();
const {
  creaPrenotazione,
  mieBookings,
  bookingsRicevute,
  aggiornaStatoPrenotazione
} = require('../controllers/bookingController');
const { autentica, autorizza } = require('../middleware/auth');

router.post('/', autentica, autorizza('turista'), creaPrenotazione);
router.get('/mie', autentica, autorizza('turista'), mieBookings);
router.get('/ricevute', autentica, autorizza('guida'), bookingsRicevute);
router.patch('/:id', autentica, autorizza('guida'), aggiornaStatoPrenotazione);

module.exports = router;
