const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
    turistaId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    numeroPersone: { type: Number, required: true, min: 1 },
    stato: {
      type: String,
      enum: ['in attesa', 'accettata', 'rifiutata'],
      default: 'in attesa'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
