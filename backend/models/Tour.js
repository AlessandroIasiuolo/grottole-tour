const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    titolo: { type: String, required: true, trim: true },
    descrizione: { type: String, required: true },
    luogo: { type: String, required: true },
    durata: { type: Number, required: true }, // in minuti
    guidaId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tour', tourSchema);
