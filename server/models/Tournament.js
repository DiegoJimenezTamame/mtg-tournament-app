const mongoose = require('mongoose');

const TournamentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    rounds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Round' }],
});

module.exports = mongoose.model('Tournament', TournamentSchema);
