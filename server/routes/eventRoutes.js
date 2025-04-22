const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const Match = require("../models/Match");
const Tournament = require("../models/Tournament");

// POST: Create a new event
router.post("/", async (req, res) => {
  const { name, format, type, settings, createdBy } = req.body;

  // Validate request body
  if (!name || !format || !type || !createdBy) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const newEvent = new Event({
      name,
      format,
      type,
      players: [],
      rounds: [],
      settings: {
        maxRounds: settings.maxRounds || 4,
        bestOf: settings.bestOf || 3,
        countdown: settings.countdown || 50,
      },
      status: "waiting",
      joinCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      createdBy,
    });

    await newEvent.save(); // Save to database

    res.status(201).json(newEvent); // Return the created event
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Error creating event." });
  }
});

// GET: Retrieve all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().populate("players").populate("rounds");
    res.status(200).json(events); // Return list of events
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events." });
  }
});

// Generate pairings - Swiss style
router.post('/pairings/:tournamentId', async (req, res) => {
  try {
    const { round } = req.body;
    const tournament = await Tournament.findById(req.params.tournamentId).populate('players');

    // Sort players based on their win record (or any other logic for Swiss)
    const players = tournament.players.sort((a, b) => b.stats.wins - a.stats.wins);
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

    const created = await Match.insertMany(matches);
    res.status(201).json(created);
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
