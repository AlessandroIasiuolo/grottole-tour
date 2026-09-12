const Slot = require('../models/Slot');
const Tour = require('../models/Tour');

// GET /api/tours/:tourId/slots — slot disponibili per un tour
async function slotPerTour(req, res) {
  try {
    const slots = await Slot.find({
      tourId: req.params.tourId,
      postiDisponibili: { $gt: 0 }
    }).sort({ data: 1 });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ messaggio: 'Errore del server', errore: err.message });
  }
}

// POST /api/slots — crea uno slot (solo guida, e solo per i propri tour)
async function creaSlot(req, res) {
  try {
    const { tourId, data, ora, postiDisponibili } = req.body;

    if (!tourId || !data || !ora || postiDisponibili == null) {
      return res.status(400).json({ messaggio: 'Campi obbligatori mancanti' });
    }

    const tour = await Tour.findById(tourId);
    if (!tour) return res.status(404).json({ messaggio: 'Tour non trovato' });

    if (tour.guidaId.toString() !== req.utente.id) {
      return res.status(403).json({ messaggio: 'Non puoi aggiungere slot a un tour non tuo' });
    }

    const slot = await Slot.create({ tourId, data, ora, postiDisponibili });
    res.status(201).json(slot);
  } catch (err) {
    res.status(500).json({ messaggio: 'Errore del server', errore: err.message });
  }
}

module.exports = { slotPerTour, creaSlot };
