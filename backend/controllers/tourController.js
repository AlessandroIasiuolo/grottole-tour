const Tour = require('../models/Tour');

// GET /api/tours — elenco di tutti i tour
async function elencoTour(req, res) {
  try {
    const tours = await Tour.find().populate('guidaId', 'nome');
    res.json(tours);
  } catch (err) {
    res.status(500).json({ messaggio: 'Errore del server', errore: err.message });
  }
}

// GET /api/tours/:id — dettaglio singolo tour
async function dettaglioTour(req, res) {
  try {
    const tour = await Tour.findById(req.params.id).populate('guidaId', 'nome');
    if (!tour) return res.status(404).json({ messaggio: 'Tour non trovato' });
    res.json(tour);
  } catch (err) {
    res.status(500).json({ messaggio: 'Errore del server', errore: err.message });
  }
}

// POST /api/tours — crea un nuovo tour (solo guida)
async function creaTour(req, res) {
  try {
    const { titolo, descrizione, luogo, durata } = req.body;

    if (!titolo || !descrizione || !luogo || !durata) {
      return res.status(400).json({ messaggio: 'Campi obbligatori mancanti' });
    }

    const tour = await Tour.create({
      titolo,
      descrizione,
      luogo,
      durata,
      guidaId: req.utente.id
    });

    res.status(201).json(tour);
  } catch (err) {
    res.status(500).json({ messaggio: 'Errore del server', errore: err.message });
  }
}

module.exports = { elencoTour, dettaglioTour, creaTour };
