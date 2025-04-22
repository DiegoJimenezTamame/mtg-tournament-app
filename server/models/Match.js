const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
  round: { type: Number, required: true },
  player1: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  player2: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  result: {
    type: String,
    enum: ['P1', 'P2', 'Draw', 'Pending'],
    default: 'Pending'
  }
});

module.exports = mongoose.model('Match', MatchSchema);
