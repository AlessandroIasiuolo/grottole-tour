const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const Tour = require('../models/Tour');

// POST /api/bookings — il turista prenota uno slot
async function creaPrenotazione(req, res) {
  try {
    const { slotId, numeroPersone } = req.body;

    if (!slotId || !numeroPersone) {
      return res.status(400).json({ messaggio: 'Campi obbligatori mancanti' });
    }

    const slot = await Slot.findById(slotId);
    if (!slot) return res.status(404).json({ messaggio: 'Slot non trovato' });

    if (slot.postiDisponibili < numeroPersone) {
      return res.status(400).json({ messaggio: 'Posti disponibili insufficienti' });
    }

    const tour = await Tour.findById(slot.tourId);

    const prenotazione = await Booking.create({
      slotId,
      turistaId: req.utente.id,
      numeroPersone
    });

    // Notifica in tempo reale alla guida proprietaria del tour
    const io = req.app.get('io');
    io.to(`guida-${tour.guidaId}`).emit('nuova-prenotazione', {
      prenotazioneId: prenotazione._id,
      tourTitolo: tour.titolo,
      numeroPersone,
      data: slot.data,
      ora: slot.ora
    });

    res.status(201).json(prenotazione);
  } catch (err) {
    res.status(500).json({ messaggio: 'Errore del server', errore: err.message });
  }
}

// GET /api/bookings/mie — prenotazioni effettuate dal turista loggato
async function mieBookings(req, res) {
  try {
    const prenotazioni = await Booking.find({ turistaId: req.utente.id })
      .populate({ path: 'slotId', populate: { path: 'tourId', select: 'titolo luogo' } })
      .sort({ createdAt: -1 });
    res.json(prenotazioni);
  } catch (err) {
    res.status(500).json({ messaggio: 'Errore del server', errore: err.message });
  }
}

// GET /api/bookings/ricevute — prenotazioni ricevute dalla guida loggata
async function bookingsRicevute(req, res) {
  try {
    const tourDellaGuida = await Tour.find({ guidaId: req.utente.id }).select('_id');
    const tourIds = tourDellaGuida.map((t) => t._id);

    const slotDeiTour = await Slot.find({ tourId: { $in: tourIds } }).select('_id');
    const slotIds = slotDeiTour.map((s) => s._id);

    const prenotazioni = await Booking.find({ slotId: { $in: slotIds } })
      .populate({ path: 'slotId', populate: { path: 'tourId', select: 'titolo' } })
      .populate('turistaId', 'nome email')
      .sort({ createdAt: -1 });

    res.json(prenotazioni);
  } catch (err) {
    res.status(500).json({ messaggio: 'Errore del server', errore: err.message });
  }
}

// PATCH /api/bookings/:id — la guida accetta o rifiuta una prenotazione
async function aggiornaStatoPrenotazione(req, res) {
  try {
    const { stato } = req.body; // "accettata" | "rifiutata"

    if (!['accettata', 'rifiutata'].includes(stato)) {
      return res.status(400).json({ messaggio: 'Stato non valido' });
    }

    const prenotazione = await Booking.findById(req.params.id).populate('slotId');
    if (!prenotazione) return res.status(404).json({ messaggio: 'Prenotazione non trovata' });

    const tour = await Tour.findById(prenotazione.slotId.tourId);
    if (tour.guidaId.toString() !== req.utente.id) {
      return res.status(403).json({ messaggio: 'Non autorizzato a modificare questa prenotazione' });
    }

    prenotazione.stato = stato;
    await prenotazione.save();

    // Se accettata, decrementa i posti disponibili sullo slot
    if (stato === 'accettata') {
      await Slot.findByIdAndUpdate(prenotazione.slotId._id, {
        $inc: { postiDisponibili: -prenotazione.numeroPersone }
      });
    }

    // Notifica in tempo reale al turista
    const io = req.app.get('io');
    io.to(`turista-${prenotazione.turistaId}`).emit('esito-prenotazione', {
      prenotazioneId: prenotazione._id,
      stato,
      tourTitolo: tour.titolo
    });

    res.json(prenotazione);
  } catch (err) {
    res.status(500).json({ messaggio: 'Errore del server', errore: err.message });
  }
}

module.exports = {
  creaPrenotazione,
  mieBookings,
  bookingsRicevute,
  aggiornaStatoPrenotazione
};
