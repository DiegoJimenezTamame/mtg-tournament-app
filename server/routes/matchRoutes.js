const express = require('express');
const router = express.Router();

const Match = require('../models/Match');
const Tournament = require('../models/Tournament');

// Pairings generation route (modified)
router.post('/pairings/:tournamentId', async (req, res) => {
    try {
        const { round } = req.body;
        const tournament = await Tournament.findById(req.params.tournamentId).populate('players');

        // Step 1: Sort players by win record (descending)
        const players = [...tournament.players].sort((a, b) => {
            const aWins = a.wins || 0;
            const bWins = b.wins || 0;
            return bWins - aWins; // descending order
        });

        // Step 2: Create pairings for this round
        const matches = [];
        for (let i = 0; i < players.length; i += 2) {
            if (players[i + 1]) {
                matches.push({
                    tournament: tournament._id,
                    round,
                    player1: players[i]._id,
                    player2: players[i + 1]._id
                });
            }
        }

        // Step 3: Save pairings to the Match model
        const createdMatches = await Match.insertMany(matches);
        res.status(201).json(createdMatches);

    } catch (err) {
        res.status(500).json({ error: 'Failed to generate pairings.' });
    }
});


// Submit result for a match
router.post('/submit/:matchId', async (req, res) => {
    try {
        const { result } = req.body;
        const match = await Match.findByIdAndUpdate(req.params.matchId, { result }, { new: true });
        res.json(match);
    } catch (err) {
        res.status(500).json({ error: 'Failed to submit result.' });
    }
});

// Get tournament standings
router.get('/standings/:tournamentId', async (req, res) => {
    try {
        const matches = await Match.find({ tournament: req.params.tournamentId });

        const stats = {};

        matches.forEach(({ player1, player2, result }) => {
            if (!stats[player1]) stats[player1] = { wins: 0, draws: 0, losses: 0 };
            if (!stats[player2]) stats[player2] = { wins: 0, draws: 0, losses: 0 };

            if (result === 'P1') {
                stats[player1].wins++;
                stats[player2].losses++;
            } else if (result === 'P2') {
                stats[player2].wins++;
                stats[player1].losses++;
            } else if (result === 'Draw') {
                stats[player1].draws++;
                stats[player2].draws++;
            }
        });

        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve standings.' });
    }
});

module.exports = router;
