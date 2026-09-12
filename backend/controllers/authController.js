const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function generaToken(utente) {
  return jwt.sign(
    { id: utente._id, ruolo: utente.ruolo },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

async function registra(req, res) {
  try {
    const { nome, email, password, ruolo } = req.body;

    if (!nome || !email || !password || !ruolo) {
      return res.status(400).json({ messaggio: 'Tutti i campi sono obbligatori' });
    }
    if (!['turista', 'guida'].includes(ruolo)) {
      return res.status(400).json({ messaggio: 'Ruolo non valido' });
    }

    const esistente = await User.findOne({ email });
    if (esistente) {
      return res.status(409).json({ messaggio: 'Email già registrata' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const nuovoUtente = await User.create({ nome, email, passwordHash, ruolo });

    const token = generaToken(nuovoUtente);
    res.status(201).json({
      token,
      utente: { id: nuovoUtente._id, nome: nuovoUtente.nome, ruolo: nuovoUtente.ruolo }
    });
  } catch (err) {
    res.status(500).json({ messaggio: 'Errore del server', errore: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const utente = await User.findOne({ email });
    if (!utente) {
      return res.status(401).json({ messaggio: 'Credenziali non valide' });
    }

    const passwordCorretta = await utente.confrontaPassword(password);
    if (!passwordCorretta) {
      return res.status(401).json({ messaggio: 'Credenziali non valide' });
    }

    const token = generaToken(utente);
    res.json({
      token,
      utente: { id: utente._id, nome: utente.nome, ruolo: utente.ruolo }
    });
  } catch (err) {
    res.status(500).json({ messaggio: 'Errore del server', errore: err.message });
  }
}

module.exports = { registra, login };
