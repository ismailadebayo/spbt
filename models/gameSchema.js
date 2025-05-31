// module one of project 5 (question 3) -  game schema
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name:       { type: String, required: true }, // e.g., "Arsenal vs Chelsea"
  sport:      { type: String, required: true }, // e.g., "Football"
  startTime:  { type: Date, required: true },
  status:     { type: String, enum: ['upcoming', 'live', 'completed'], default: 'upcoming' },
  outcomes:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Outcome' }]
});

module.exports = mongoose.model('Game', gameSchema);
