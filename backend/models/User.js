const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    ruolo: { type: String, enum: ['turista', 'guida'], required: true }
  },
  { timestamps: true }
);

// Confronta la password in chiaro con l'hash salvato
userSchema.methods.confrontaPassword = function (passwordInChiaro) {
  return bcrypt.compare(passwordInChiaro, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
