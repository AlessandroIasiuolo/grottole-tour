const express = require('express');
const router = express.Router();
const { registra, login } = require('../controllers/authController');

router.post('/register', registra);
router.post('/login', login);

module.exports = router;
