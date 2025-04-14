// server/models/Event.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Ensuring the event name is always provided
  },
  format: {
    type: String,
    required: true, // Ensuring format is always provided
  },
  type: {
    type: String,
    enum: ["tournament", "casual", "league"], // Example of event type enum
    required: true,
  },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
  rounds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Round" }],
  settings: {
    maxRounds: {
      type: Number,
      default: 4,
    },
    bestOf: {
      type: Number,
      default: 3,
    },
    countdown: {
      type: Number,
      default: 50,
    },
  },
  status: {
    type: String,
    enum: ["waiting", "ongoing",
