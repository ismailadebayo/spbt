
const mongoose = require('mongoose');
// module two of project 5 (question 2) - create bet scheme
const betSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  outcome:  { type: mongoose.Schema.Types.ObjectId, ref: 'Outcome', required: true },
  amount:   { type: Number, required: true },
  potentialWin: { type: Number, required: true },
  potentialPayout: { type: Number, required: true },
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  stake: { type: Number, required: true },
  odds: { type: Number, required: true },
  status:   { type: String, enum: ['pending', 'won', 'lost'], default: 'pending' },
  placedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bet', betSchema);
