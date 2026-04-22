const mongoose = require('mongoose');

const debtSchema = new mongoose.Schema({
  name: String,
  balance: Number,
  rate: Number,
  minPayment: Number,
  type: String,
  termMonths: { type: Number, default: null },
  installmentsRemaining: { type: Number, default: null }
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  debts: [debtSchema]
});

module.exports = mongoose.model('User', userSchema);