// server/routes/eventRoutes.js
const express = require("express");
const router = express.Router();
const Event = require("../models/Event"); // Import the Event model

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

module.exports = router;
