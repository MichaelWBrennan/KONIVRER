const mongoose = require("mongoose");

const DeckSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: String, required: true },
  cards: [
    {
      cardId: { type: String, required: true },
      count: { type: Number, default: 1 },
    },
  ],
  isPublic: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Deck", DeckSchema);
