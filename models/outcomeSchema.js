
const mongoose = require('mongoose');

const outcomeSchema = new mongoose.Schema({
  game:     { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  type:      { type: String, required: true }, // e.g., "Home Win", "Draw", "Away Win"
  odds:      { type: Number, required: true }, // e.g., 2.5
  isWinning: { type: Boolean, default: false } // updated after match is completed
  
});

module.exports = mongoose.model('Outcome', outcomeSchema);
