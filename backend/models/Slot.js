const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
    data: { type: Date, required: true },
    ora: { type: String, required: true }, // es. "10:30"
    postiDisponibili: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Slot', slotSchema);
