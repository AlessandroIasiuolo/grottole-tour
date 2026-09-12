const express = require('express');
const router = express.Router();
const { creaSlot } = require('../controllers/slotController');
const { autentica, autorizza } = require('../middleware/auth');

router.post('/', autentica, autorizza('guida'), creaSlot);

module.exports = router;
