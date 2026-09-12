const jwt = require('jsonwebtoken');

// Verifica che la richiesta contenga un token JWT valido
function autentica(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ messaggio: 'Token mancante' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.utente = payload; // { id, ruolo }
    next();
  } catch (err) {
    return res.status(401).json({ messaggio: 'Token non valido o scaduto' });
  }
}

// Restringe l'accesso a uno o più ruoli specifici (da usare dopo `autentica`)
function autorizza(...ruoliConsentiti) {
  return (req, res, next) => {
    if (!req.utente || !ruoliConsentiti.includes(req.utente.ruolo)) {
      return res.status(403).json({ messaggio: 'Accesso non consentito per questo ruolo' });
    }
    next();
  };
}

module.exports = { autentica, autorizza };
