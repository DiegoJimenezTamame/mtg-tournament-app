// server/models/Event.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["tournament", "casual", "league"],
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
    enum: ["waiting", "ongoing", "completed"],
    default: "waiting",
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Event", eventSchema);
